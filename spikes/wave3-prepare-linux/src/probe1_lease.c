/* probe1_lease.c -- read lease (fcntl F_SETLEASE, F_RDLCK) behaviour on one directory.
 * Usage: probe1_lease <dir> [c2]
 *   c2 additionally runs the "holder keeps the lease" case, which waits out
 *   /proc/sys/fs/lease-break-time (45 s by default here).
 * Every case prints one or more lines "CASE <id>: ..." with the raw result and errno.
 * Build: gcc -O2 -Wall -o probe1_lease probe1_lease.c
 */
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

static char path[4096];
static volatile sig_atomic_t got_sig = 0;
static volatile sig_atomic_t sig_fd = -1;
static struct timespec sig_ts;

static double now(void) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t);
    return t.tv_sec + t.tv_nsec / 1e9;
}
static double ts2d(struct timespec t) { return t.tv_sec + t.tv_nsec / 1e9; }

static void on_sig(int s, siginfo_t *si, void *u) {
    (void)u;
    got_sig = s;
    sig_fd = si->si_fd;
    clock_gettime(CLOCK_MONOTONIC, &sig_ts);
}

static void mkfile(uid_t owner, mode_t mode) {
    unlink(path);
    int fd = open(path, O_CREAT | O_WRONLY | O_TRUNC, 0644);
    if (fd < 0) { perror("create"); exit(1); }
    if (write(fd, "0123456789abcdef", 16) != 16) { perror("write"); exit(1); }
    close(fd);
    if (chown(path, owner, owner) != 0) { perror("chown"); exit(1); }
    chmod(path, mode);
}

static const char *lname(int l) {
    return l == F_RDLCK ? "F_RDLCK" : l == F_WRLCK ? "F_WRLCK" : l == F_UNLCK ? "F_UNLCK" : "?";
}

static int try_lease(int fd, const char *id) {
    int r = fcntl(fd, F_SETLEASE, F_RDLCK);
    int e = errno;
    if (r == 0) printf("CASE %s: F_SETLEASE F_RDLCK -> 0 (GRANTED); F_GETLEASE=%s\n", id, lname(fcntl(fd, F_GETLEASE)));
    else printf("CASE %s: F_SETLEASE F_RDLCK -> -1 errno=%d (%s) (REFUSED)\n", id, e, strerror(e));
    fflush(stdout);
    return r;
}

/* child opens path with flags, reports timing on the pipe, stays alive until told */
static pid_t spawn_opener(int flags, int hold_pipe[2], int ready_pipe[2], int do_mmap) {
    pid_t p = fork();
    if (p == 0) {
        close(hold_pipe[1]); close(ready_pipe[0]);
        double t0 = now();
        int fd = open(path, flags);
        int e = errno;
        double t1 = now();
        char msg[256];
        void *m = MAP_FAILED;
        if (fd >= 0 && do_mmap) {
            m = mmap(NULL, 16, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
            if (m == MAP_FAILED) { perror("child mmap"); }
            if (do_mmap == 2) close(fd); /* keep only the mapping */
        }
        snprintf(msg, sizeof msg, "open(flags=0x%x) -> %s errno=%d (%s) after %.3f s%s",
                 flags, fd >= 0 ? "fd" : "-1", fd >= 0 ? 0 : e, fd >= 0 ? "ok" : strerror(e), t1 - t0,
                 do_mmap == 2 ? "; fd closed, MAP_SHARED|PROT_WRITE mapping kept" :
                 do_mmap == 1 ? "; fd kept, MAP_SHARED|PROT_WRITE mapping kept" : "");
        if (write(ready_pipe[1], msg, strlen(msg) + 1) < 0) _exit(2);
        char c; if (read(hold_pipe[0], &c, 1) < 0) {} /* wait for release */
        _exit(0);
    }
    return p;
}

static void read_msg(int fd, const char *id) {
    char buf[256]; ssize_t n = read(fd, buf, sizeof buf - 1);
    if (n > 0) { buf[n] = 0; printf("CASE %s: opener: %s\n", id, buf); } else printf("CASE %s: opener: no message\n", id);
    fflush(stdout);
}

static void finish(pid_t p, int hold_pipe[2], int ready_pipe[2]) {
    if (write(hold_pipe[1], "x", 1) < 0) {}
    waitpid(p, NULL, 0);
    close(hold_pipe[1]); close(ready_pipe[0]);
}

/* Lease held; another process opens the file with 'flags'. If release_after >= 0 the
 * holder releases the lease that many seconds after the break signal; if < 0 it keeps it. */
static void case_c(const char *id, int flags, double release_after) {
    mkfile(getuid(), 0644);
    int fd = open(path, O_RDONLY);
    fcntl(fd, F_SETSIG, SIGRTMIN); /* request si_fd in siginfo */
    if (try_lease(fd, id) != 0) { close(fd); return; }
    got_sig = 0;
    int hp[2], rp[2]; if (pipe(hp) || pipe(rp)) exit(1);
    double t_spawn = now();
    pid_t p = spawn_opener(flags, hp, rp, 0);
    close(hp[0]); close(rp[1]);
    /* wait for a signal or up to 2 s */
    while (!got_sig && now() - t_spawn < 2.0) usleep(1000);
    if (got_sig)
        printf("CASE %s: holder received signal %d (SIGRTMIN=%d) si_fd=%d (lease fd=%d) %.3f s after fork; F_GETLEASE now=%s\n",
               id, got_sig, SIGRTMIN, sig_fd, fd, ts2d(sig_ts) - t_spawn, lname(fcntl(fd, F_GETLEASE)));
    else
        printf("CASE %s: holder received NO signal within 2 s; F_GETLEASE=%s\n", id, lname(fcntl(fd, F_GETLEASE)));
    fflush(stdout);
    if (got_sig && release_after >= 0) {
        usleep((useconds_t)(release_after * 1e6));
        int r = fcntl(fd, F_SETLEASE, F_UNLCK);
        printf("CASE %s: holder F_SETLEASE F_UNLCK -> %d at %.3f s after fork\n", id, r, now() - t_spawn);
        fflush(stdout);
    } else if (got_sig) {
        printf("CASE %s: holder keeps the lease (does not release); polling F_GETLEASE once per second\n", id);
        fflush(stdout);
    }
    /* wait for the opener's message (blocks until opener's open() returns) */
    struct timeval tv; fd_set s; FD_ZERO(&s); FD_SET(rp[0], &s);
    tv.tv_sec = 120; tv.tv_usec = 0;
    double last = now();
    for (;;) {
        FD_ZERO(&s); FD_SET(rp[0], &s); tv.tv_sec = 1; tv.tv_usec = 0;
        int r = select(rp[0] + 1, &s, NULL, NULL, &tv);
        if (r > 0) break;
        if (release_after < 0 && got_sig && now() - last >= 5.0) {
            printf("CASE %s: t=%.1f s F_GETLEASE=%s (opener still blocked)\n", id, now() - t_spawn, lname(fcntl(fd, F_GETLEASE)));
            fflush(stdout); last = now();
        }
        if (now() - t_spawn > 120) { printf("CASE %s: opener did not return in 120 s\n", id); break; }
    }
    double t_ret = now();
    read_msg(rp[0], id);
    printf("CASE %s: opener's open returned %.3f s after fork; holder F_GETLEASE after=%s\n", id, t_ret - t_spawn, lname(fcntl(fd, F_GETLEASE)));
    /* can the holder re-take the lease while the writer is open? */
    try_lease(fd, id);
    finish(p, hp, rp);
    close(fd);
}

static void drop_to(uid_t u) {
    if (setgid(u) || setuid(u)) { perror("setuid"); _exit(3); }
}

int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage\n"); return 1; }
    setvbuf(stdout, NULL, _IOLBF, 0);
    snprintf(path, sizeof path, "%s/probe1_lease.dat", argv[1]);
    int run_c2 = argc > 2 && strcmp(argv[2], "c2") == 0;
    struct sigaction sa; memset(&sa, 0, sizeof sa);
    sa.sa_sigaction = on_sig; sa.sa_flags = SA_SIGINFO;
    sigaction(SIGRTMIN, &sa, NULL); sigaction(SIGIO, &sa, NULL);
    struct stat st; stat(argv[1], &st);
    printf("probe1_lease dir=%s st_dev=%lu uid=%d euid=%d\n", argv[1], (unsigned long)st.st_dev, getuid(), geteuid());

    /* (a) nobody else has it open */
    mkfile(getuid(), 0644);
    { int fd = open(path, O_RDONLY); try_lease(fd, "a-rdonly-no-other-opener"); close(fd); }
    /* (a') for contrast: same process holds an O_RDWR fd too */
    { int w = open(path, O_RDWR); int fd = open(path, O_RDONLY); try_lease(fd, "a'-own-process-also-has-O_RDWR"); close(fd); close(w); }

    /* (b) another process holds it open for writing */
    {
        mkfile(getuid(), 0644);
        int hp[2], rp[2]; if (pipe(hp) || pipe(rp)) return 1;
        pid_t p = spawn_opener(O_WRONLY, hp, rp, 0); close(hp[0]); close(rp[1]);
        read_msg(rp[0], "b-other-process-O_WRONLY");
        int fd = open(path, O_RDONLY); try_lease(fd, "b-other-process-O_WRONLY"); close(fd);
        finish(p, hp, rp);
        /* after the writer closes */
        fd = open(path, O_RDONLY); try_lease(fd, "b-after-writer-closed"); close(fd);
    }
    /* (b2) another process holds it open read-only */
    {
        mkfile(getuid(), 0644);
        int hp[2], rp[2]; if (pipe(hp) || pipe(rp)) return 1;
        pid_t p = spawn_opener(O_RDONLY, hp, rp, 0); close(hp[0]); close(rp[1]);
        read_msg(rp[0], "b2-other-process-O_RDONLY");
        int fd = open(path, O_RDONLY); try_lease(fd, "b2-other-process-O_RDONLY"); close(fd);
        finish(p, hp, rp);
    }

    /* (c) lease held, then another process opens */
    case_c("c1-O_WRONLY-holder-releases-0.5s", O_WRONLY, 0.5);
    case_c("c1b-O_WRONLY|O_NONBLOCK", O_WRONLY | O_NONBLOCK, 0.5);
    case_c("c1c-O_RDONLY-opener", O_RDONLY, 0.5);
    case_c("c1d-O_RDWR|O_TRUNC-holder-releases-0.5s", O_RDWR | O_TRUNC, 0.5);
    if (run_c2) case_c("c2-O_WRONLY-holder-keeps-lease", O_WRONLY, -1);

    /* (d) file owned by another user (uid 65534) */
    mkfile(65534, 0644);
    { int fd = open(path, O_RDONLY); try_lease(fd, "d1-root-with-CAP_LEASE-on-file-owned-by-65534"); close(fd); }
    {
        pid_t p = fork();
        if (p == 0) {
            drop_to(65534);
            printf("CASE d2: child uid=%d euid=%d\n", getuid(), geteuid());
            int fd = open(path, O_RDONLY); try_lease(fd, "d2-uid65534-on-own-file(control)"); close(fd);
            _exit(0);
        }
        waitpid(p, NULL, 0);
    }
    mkfile(0, 0644);
    {
        pid_t p = fork();
        if (p == 0) {
            drop_to(65534);
            int fd = open(path, O_RDONLY);
            if (fd < 0) { printf("CASE d3: open failed errno=%d\n", errno); _exit(0); }
            try_lease(fd, "d3-uid65534-no-CAP_LEASE-on-file-owned-by-root");
            close(fd); _exit(0);
        }
        waitpid(p, NULL, 0);
    }

    /* (e) writer holds a shared writable memory map */
    for (int variant = 1; variant <= 2; variant++) {
        mkfile(getuid(), 0644);
        int hp[2], rp[2]; if (pipe(hp) || pipe(rp)) return 1;
        const char *id = variant == 1 ? "e1-other-process-MAP_SHARED-rw-fd-open" : "e2-other-process-MAP_SHARED-rw-fd-closed";
        pid_t p = spawn_opener(O_RDWR, hp, rp, variant); close(hp[0]); close(rp[1]);
        read_msg(rp[0], id);
        int fd = open(path, O_RDONLY); try_lease(fd, id); close(fd);
        finish(p, hp, rp);
    }
    unlink(path);
    return 0;
}
