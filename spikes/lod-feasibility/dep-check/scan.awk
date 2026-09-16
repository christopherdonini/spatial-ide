BEGIN{
  split("MIT|Apache-2.0|MIT OR Apache-2.0|Apache-2.0 OR MIT|BSD-2-Clause|BSD-3-Clause|ISC|Zlib|Unicode-3.0|Unicode-DFS-2016|MIT-0|0BSD", a, "|");
  for(i in a) ok[a[i]]=1;
}
{
  line=$0;
  sub(/ \(proc-macro\)/, "", line);
  n=split(line, f, " ");
  name=f[1]; ver=f[2];
  lic="";
  for(i=3;i<=n;i++) lic = lic (i>3?" ":"") f[i];
  if(name ~ /^lod-dep-check/) next;
  if(lic=="") { print "FLAG(empty licence field): " name " " ver; next }
  if(!(lic in ok)) print "FLAG: " name " " ver " -> " lic;
}
