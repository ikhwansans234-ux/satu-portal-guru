/* Hash password (SHA-256) dan migrasi password lama */
function sha256(str){var b=unescape(encodeURIComponent(str)),l=b.length,w=[],i,j,K=[],H=[],n=2,c=0;
  function pr(x){for(var d=2;d*d<=x;d++)if(x%d===0)return false;return true}
  while(c<64){if(pr(n)){if(c<8)H[c]=(Math.sqrt(n)%1*4294967296)|0;K[c]=(Math.cbrt(n)%1*4294967296)|0;c++}n++}
  for(i=0;i<l;i++)w[i>>2]|=b.charCodeAt(i)<<(24-(i%4)*8);
  w[l>>2]|=0x80<<(24-(l%4)*8);var tl=(((l+8)>>6)+1)*16;for(i=0;i<tl;i++)w[i]=w[i]|0;w[tl-1]=l*8;
  var R=function(x,k){return(x>>>k)|(x<<(32-k))};
  for(i=0;i<tl;i+=16){var a=H.slice(),W=[];
    for(j=0;j<64;j++){if(j<16)W[j]=w[i+j];else{var x=W[j-15],y=W[j-2];W[j]=(W[j-16]+(R(x,7)^R(x,18)^(x>>>3))+W[j-7]+(R(y,17)^R(y,19)^(y>>>10)))|0}
      var t1=(a[7]+(R(a[4],6)^R(a[4],11)^R(a[4],25))+((a[4]&a[5])^(~a[4]&a[6]))+K[j]+W[j])|0,t2=((R(a[0],2)^R(a[0],13)^R(a[0],22))+((a[0]&a[1])^(a[0]&a[2])^(a[1]&a[2])))|0;
      a=[(t1+t2)|0,a[0],a[1],a[2],(a[3]+t1)|0,a[4],a[5],a[6]]}
    for(j=0;j<8;j++)H[j]=(H[j]+a[j])|0}
  return H.map(function(x){return("00000000"+(x>>>0).toString(16)).slice(-8)}).join("")}
function HP(u,p){return sha256(u+"|"+p+"|satu-2026")}
function mig(){GURU.forEach(function(g){if(g.p!==undefined){g.h=HP(g.u,g.p);delete g.p}})}
mig();persist();
