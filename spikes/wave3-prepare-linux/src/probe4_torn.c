/* probe4_torn.c -- torn capture: a writer process rewrites a file in several write() calls while a
 * reader process copies it with read(). No lease, no lock (the A1-without-A2 case).
 * Usage: probe4_torn <dir> <trials> <inplace|trunc> [size_mib=64] [nwrites=16] [seed=1] [pause_us=0]
 *   pause_us: the writer sleeps this long between consecutive write() calls (0 = back to back)
 *   inplace: writer opens O_WRONLY and overwrites from offset 0
 *   trunc:   writer opens O_WRONLY|O_TRUNC and writes the file again from empty
 * Every 4 KiB page of version v holds the 8-byte word (v<<32 | page index) repeated, so each page of
 * the copy is classified OLD (version before the trial), NEW (version written in the trial),
 * INTRA (a page holding words of both versions) or OTHER (anything else, e.g. zeros), and the copy
 * length is compared with the file size.
 * Reader start is offset from the writer start by a pseudo-random delay in [-R, +W], where R and W are the
 * reader's and writer's measured durations alone (negative: the writer starts later).
 * Build: gcc -O2 -Wall -o probe4_torn probe4_torn.c
 */
#define _GNU_SOURCE
#include <fcntl.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

#define PAGE 4096
static char path[4096];
static size_t SIZE; static int NW; static useconds_t PAUSE;

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }

static void fill(uint64_t *buf, uint32_t v) {
    size_t words = SIZE / 8;
    for (size_t i = 0; i < words; i++) buf[i] = ((uint64_t)v << 32) | (uint32_t)(i / (PAGE / 8));
}

static void write_version(uint64_t *buf, int trunc) {
    int fd = open(path, O_WRONLY | O_CREAT | (trunc ? O_TRUNC : 0), 0644);
    size_t chunk = SIZE / NW;
    for (int i = 0; i < NW; i++) {
        if (i && PAUSE) usleep(PAUSE);
        size_t off = (size_t)i * chunk, len = i == NW - 1 ? SIZE - off : chunk, done = 0;
        while (done < len) { ssize_t n = write(fd, (char *)buf + off + done, len - done); if (n <= 0) { perror("write"); exit(1); } done += n; }
    }
    close(fd);
}

/* shared timing block */
struct times { double w0, w1, r0, r1; size_t copied; };

int main(int argc, char **argv) {
    if (argc < 4) { fprintf(stderr, "usage\n"); return 1; }
    setvbuf(stdout, NULL, _IOLBF, 0);
    int trials = atoi(argv[2]); int trunc = strcmp(argv[3], "trunc") == 0;
    SIZE = (size_t)(argc > 4 ? atoi(argv[4]) : 64) << 20; NW = argc > 5 ? atoi(argv[5]) : 16;
    unsigned seed = argc > 6 ? atoi(argv[6]) : 1; srand(seed);
    PAUSE = argc > 7 ? atoi(argv[7]) : 0;
    snprintf(path, sizeof path, "%s/probe4.dat", argv[1]);
    uint64_t *wbuf = malloc(SIZE);
    /* the reader's copy lands in a shared anonymous mapping, so the parent classifies it without a file */
    uint64_t *rbuf = mmap(NULL, SIZE, PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    struct times *T = mmap(NULL, sizeof *T, PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    memset(rbuf, 0, SIZE); /* pre-fault the copy buffer so the calibration measures the read, not page faults */
    printf("probe4_torn dir=%s mode=%s size=%zu B writes_per_rewrite=%d (%zu B each) pause_between_writes=%u us read_chunk=1 MiB trials=%d seed=%u\n",
           argv[1], trunc ? "trunc" : "inplace", SIZE, NW, SIZE / NW, (unsigned)PAUSE, trials, seed);

    uint32_t v = 1; fill(wbuf, v); write_version(wbuf, 1);
    /* calibrate W: writer duration of one rewrite with no reader */
    fill(wbuf, ++v); double c0 = now(); write_version(wbuf, trunc); double W = now() - c0;
    /* and a reader alone */
    double R; { int fd = open(path, O_RDONLY); double r0 = now(); size_t got = 0; ssize_t n;
      while ((n = read(fd, (char *)rbuf + got, got + (1 << 20) > SIZE ? SIZE - got : 1 << 20)) > 0) got += n;
      printf("calibration: writer alone %.3f ms, reader alone %.3f ms (%zu B)\n", W * 1e3, (now() - r0) * 1e3, got); R = now() - r0; close(fd); }

    int nold = 0, nnew = 0, ntorn = 0;
    for (int t = 0; t < trials; t++) {
        uint32_t vold = v, vnew = ++v;
        fill(wbuf, vnew);
        double delay = -R + (R + W) * (rand() / (double)RAND_MAX); /* reader start relative to writer start */
        int go[2]; if (pipe(go)) return 1;
        memset(T, 0, sizeof *T);
        pid_t wp = fork();
        if (wp == 0) { char c; close(go[1]); if (read(go[0], &c, 1) != 1) _exit(1);
            if (delay < 0) usleep((useconds_t)(-delay * 1e6));
            T->w0 = now(); write_version(wbuf, trunc); T->w1 = now(); _exit(0); }
        pid_t rp = fork();
        if (rp == 0) { char c; close(go[1]); if (read(go[0], &c, 1) != 1) _exit(1);
            if (delay > 0) usleep((useconds_t)(delay * 1e6));
            T->r0 = now(); int fd = open(path, O_RDONLY); size_t got = 0; ssize_t n;
            while (got < SIZE && (n = read(fd, (char *)rbuf + got, got + (1 << 20) > SIZE ? SIZE - got : 1 << 20)) > 0) got += n;
            close(fd); T->r1 = now(); T->copied = got;
            _exit(0); }
        close(go[0]); if (write(go[1], "gg", 2) != 2) return 1; close(go[1]);
        waitpid(wp, NULL, 0); waitpid(rp, NULL, 0);
        size_t got = T->copied;
        size_t pages = got / PAGE, po = 0, pn = 0, pi = 0, px = 0;
        long first_new = -1, last_old = -1;
        for (size_t p = 0; p < pages; p++) {
            uint64_t *w = rbuf + p * (PAGE / 8); uint64_t to = ((uint64_t)vold << 32) | (uint32_t)p, tn = ((uint64_t)vnew << 32) | (uint32_t)p;
            int o = 0, nn = 0;
            for (int k = 0; k < PAGE / 8; k++) { if (w[k] == to) o++; else if (w[k] == tn) nn++; }
            if (o == PAGE / 8) { po++; last_old = p; } else if (nn == PAGE / 8) { pn++; if (first_new < 0) first_new = p; }
            else if (o + nn == PAGE / 8) pi++; else px++;
        }
        const char *out;
        if (got == SIZE && po == pages) { out = "OLD"; nold++; }
        else if (got == SIZE && pn == pages) { out = "NEW"; nnew++; }
        else { out = "TORN"; ntorn++; }
        double base = T->w0 < T->r0 ? T->w0 : T->r0;
        printf("trial %2d | reader_delay=%+8.3f ms | writer [%8.3f, %8.3f] ms | reader [%8.3f, %8.3f] ms | copied=%zu B (file %zu) | pages old=%zu new=%zu intra=%zu other=%zu partial_tail=%zu | first_new_page=%ld last_old_page=%ld | %s\n",
               t, delay * 1e3, (T->w0 - base) * 1e3, (T->w1 - base) * 1e3, (T->r0 - base) * 1e3, (T->r1 - base) * 1e3,
               got, SIZE, po, pn, pi, px, got % PAGE, first_new, last_old, out);
    }
    printf("SUMMARY dir=%s mode=%s pause_us=%u trials=%d OLD=%d NEW=%d TORN=%d\n", argv[1], trunc ? "trunc" : "inplace", (unsigned)PAUSE, trials, nold, nnew, ntorn);
    unlink(path);
    return 0;
}
