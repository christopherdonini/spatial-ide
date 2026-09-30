/* probe3_changeattr.c -- size/mtime/ctime (statx) before and after writes by another process,
 * (a) through write(), (b) through a MAP_SHARED|PROT_WRITE mapping, with and without msync.
 * Usage: probe3_changeattr <dir>    Build: gcc -O2 -Wall -o probe3_changeattr probe3_changeattr.c
 * The observer (parent) never writes; the writer is a forked child driven step by step over a pipe.
 */
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

#define FSIZE (1 << 20)
static char path[4096];
static int cmd[2], ack[2];

struct snap { long long size; long long mt_s, mt_ns, ct_s, ct_ns; unsigned mask; };

static struct snap take(void) {
    struct statx sx; struct snap s;
    if (statx(AT_FDCWD, path, 0, STATX_BASIC_STATS | STATX_BTIME, &sx) != 0) { perror("statx"); exit(1); }
    s.size = sx.stx_size; s.mt_s = sx.stx_mtime.tv_sec; s.mt_ns = sx.stx_mtime.tv_nsec;
    s.ct_s = sx.stx_ctime.tv_sec; s.ct_ns = sx.stx_ctime.tv_nsec; s.mask = sx.stx_mask;
    return s;
}
static int same(struct snap a, struct snap b) {
    return a.size == b.size && a.mt_s == b.mt_s && a.mt_ns == b.mt_ns && a.ct_s == b.ct_s && a.ct_ns == b.ct_ns;
}
static void show(const char *id, const char *step, struct snap prev, struct snap s) {
    printf("%s | %-44s | size=%lld mtime=%lld.%09lld ctime=%lld.%09lld | vs previous: %s\n", id, step, s.size,
           s.mt_s, s.mt_ns, s.ct_s, s.ct_ns,
           same(prev, s) ? "UNCHANGED" :
           (prev.mt_s != s.mt_s || prev.mt_ns != s.mt_ns) && (prev.ct_s != s.ct_s || prev.ct_ns != s.ct_ns) ? "mtime+ctime CHANGED" :
           prev.size != s.size ? "size CHANGED" : "partly changed");
    fflush(stdout);
}

/* writer child: commands
 *  w<off>  pwrite 4 bytes at offset      m  mmap MAP_SHARED rw     p<off>  store 4 bytes into the map
 *  s       msync(MS_SYNC)                 u  munmap                 q  quit */
static void writer(void) {
    close(cmd[1]); close(ack[0]);
    int fd = open(path, O_RDWR);
    char *m = NULL; unsigned ctr = 0;
    char line[64];
    FILE *in = fdopen(cmd[0], "r");
    while (fgets(line, sizeof line, in)) {
        long off = atol(line + 1);
        ctr++;
        switch (line[0]) {
        case 'w': if (pwrite(fd, &ctr, 4, off) != 4) perror("pwrite"); break;
        case 'm': m = mmap(NULL, FSIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0); if (m == MAP_FAILED) perror("mmap"); break;
        case 'p': memcpy(m + off, &ctr, 4); break;
        case 's': if (msync(m, FSIZE, MS_SYNC)) perror("msync"); break;
        case 'u': munmap(m, FSIZE); m = NULL; break;
        case 'q': _exit(0);
        }
        if (write(ack[1], "k", 1) != 1) _exit(2);
    }
    _exit(0);
}

static void send(const char *c) {
    if (write(cmd[1], c, strlen(c)) < 0) exit(1);
    char k; if (read(ack[0], &k, 1) != 1) exit(1);
}

static pid_t start(void) {
    unlink(path);
    int fd = open(path, O_CREAT | O_RDWR | O_TRUNC, 0644);
    static char buf[FSIZE]; memset(buf, 'a', sizeof buf);
    if (write(fd, buf, sizeof buf) != FSIZE) exit(1);
    fsync(fd); close(fd);
    usleep(20000);
    if (pipe(cmd) || pipe(ack)) exit(1);
    pid_t p = fork();
    if (p == 0) writer();
    close(cmd[0]); close(ack[1]);
    return p;
}
static void stop(pid_t p) { if (write(cmd[1], "q\n", 2) < 0) exit(1); waitpid(p, NULL, 0); close(cmd[1]); close(ack[0]); }

#define STEP(id, label, command, delay_us) do { if (command) send(command); if (delay_us) usleep(delay_us); \
    struct snap _n = take(); show(id, label, prev, _n); prev = _n; } while (0)

int main(int argc, char **argv) {
    if (argc < 2) return 1;
    setvbuf(stdout, NULL, _IOLBF, 0);
    snprintf(path, sizeof path, "%s/probe3.dat", argv[1]);
    printf("probe3_changeattr dir=%s\n", argv[1]);
#ifdef STATX_CHANGE_COOKIE
    printf("STATX_CHANGE_COOKIE defined in userspace headers\n");
#else
    printf("STATX_CHANGE_COOKIE not defined in userspace headers (/usr/include/linux/stat.h): no change-cookie field requestable\n");
#endif
    struct snap prev;

    /* (a) write() by another process */
    pid_t p = start(); prev = take();
    { struct statx sx; statx(AT_FDCWD, path, 0, STATX_BASIC_STATS | STATX_BTIME, &sx);
      printf("statx stx_mask=0x%x (MTIME %s, CTIME %s, SIZE %s)\n", sx.stx_mask,
             sx.stx_mask & STATX_MTIME ? "yes" : "no", sx.stx_mask & STATX_CTIME ? "yes" : "no", sx.stx_mask & STATX_SIZE ? "yes" : "no"); }
    show("a", "baseline", prev, prev);
    STEP("a", "pwrite 4 B @4096 by other process", "w4096\n", 0);
    STEP("a", "no-op (re-stat)", NULL, 0);
    STEP("a", "pwrite 4 B @8192 immediately after stat", "w8192\n", 0);
    STEP("a", "pwrite 4 B @8192 again 10 ms later", "w8192\n", 10000);
    stop(p);
    /* (a-rep) back-to-back same-size writes with an observer stat between each: how often is the
     * change visible? 200 repetitions, no deliberate delay. */
    p = start(); prev = take();
    int vis = 0, n = 200;
    for (int i = 0; i < n; i++) { send("w4096\n"); struct snap s = take(); if (!same(prev, s)) vis++; prev = s; }
    printf("a-rep | %d back-to-back pwrites, observer statx after each: change visible after %d of %d\n", n, vis, n);
    /* two writes with NO observation between them are indistinguishable from one; not probed further */
    stop(p);

    /* (b1) mmap writes, no msync */
    p = start(); prev = take();
    show("b1-no-msync", "baseline", prev, prev);
    STEP("b1-no-msync", "mmap MAP_SHARED rw (no store yet)", "m\n", 0);
    STEP("b1-no-msync", "store 4 B page0 (first touch)", "p0\n", 0);
    STEP("b1-no-msync", "store 4 B page0 again, 50 ms later", "p0\n", 50000);
    STEP("b1-no-msync", "store 4 B page1 (first touch), 50 ms later", "p4096\n", 50000);
    STEP("b1-no-msync", "store 4 B page0 again, 50 ms later", "p0\n", 50000);
    STEP("b1-no-msync", "re-stat 2 s later, no store", NULL, 2000000);
    STEP("b1-no-msync", "store page0 again after 35 s (writeback window)", NULL, 35000000);
    STEP("b1-no-msync", "  ... the store itself", "p0\n", 0);
    STEP("b1-no-msync", "munmap", "u\n", 0);
    stop(p);

    /* (b2) mmap writes, with msync */
    p = start(); prev = take();
    show("b2-msync", "baseline", prev, prev);
    STEP("b2-msync", "mmap MAP_SHARED rw", "m\n", 0);
    STEP("b2-msync", "store 4 B page0 (first touch)", "p0\n", 0);
    STEP("b2-msync", "store 4 B page0 again, 50 ms later", "p0\n", 50000);
    STEP("b2-msync", "msync(MS_SYNC), 50 ms later", "s\n", 50000);
    STEP("b2-msync", "store 4 B page0 after msync, 50 ms later", "p0\n", 50000);
    STEP("b2-msync", "store 4 B page0 again, 50 ms later", "p0\n", 50000);
    STEP("b2-msync", "msync(MS_SYNC), 50 ms later", "s\n", 50000);
    STEP("b2-msync", "munmap", "u\n", 0);
    stop(p);
    unlink(path);
    return 0;
}
