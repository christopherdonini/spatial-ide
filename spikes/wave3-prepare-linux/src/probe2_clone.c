/* probe2_clone.c -- ioctl(FICLONE) support on one directory.
 * Usage: probe2_clone <dir>    Build: gcc -O2 -Wall -o probe2_clone probe2_clone.c */
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <linux/fs.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <unistd.h>

int main(int argc, char **argv) {
    if (argc < 2) return 1;
    char src[4096], dst[4096];
    snprintf(src, sizeof src, "%s/probe2_src.dat", argv[1]);
    snprintf(dst, sizeof dst, "%s/probe2_dst.dat", argv[1]);
    int s = open(src, O_CREAT | O_RDWR | O_TRUNC, 0644);
    static char buf[1 << 20];
    memset(buf, 'x', sizeof buf);
    if (write(s, buf, sizeof buf) != (ssize_t)sizeof buf) { perror("write"); return 1; }
    fsync(s);
    int d = open(dst, O_CREAT | O_WRONLY | O_TRUNC, 0644);
    int r = ioctl(d, FICLONE, s);
    int e = errno;
    struct stat st; fstat(d, &st);
    if (r == 0) printf("probe2_clone dir=%s: ioctl(FICLONE) -> 0 (SUPPORTED); dst size=%lld\n", argv[1], (long long)st.st_size);
    else printf("probe2_clone dir=%s: ioctl(FICLONE) -> -1 errno=%d (%s) (NOT SUPPORTED); dst size=%lld\n", argv[1], e, strerror(e), (long long)st.st_size);
    close(s); close(d); unlink(src); unlink(dst);
    return 0;
}
