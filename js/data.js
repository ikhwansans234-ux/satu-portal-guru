/* Data awal, state aplikasi, dan pemuatan dari localStorage */
var $=function(i){return document.getElementById(i)};
var NAMES=["Ahmad Fauzi","Aisyah Putri","Bagas Prakoso","Citra Lestari","Dimas Saputra","Eka Wulandari","Farhan Hakim","Gita Permata","Hafidz Ramadhan","Indah Safitri","Joko Santoso","Kirana Dewi","Luthfi Maulana","Maya Anggraini","Naufal Rizky","Olivia Salsabila","Putra Wijaya","Qonita Azzahra","Rafi Pratama","Sinta Maharani"];
var KELAS=["1","2","3","4","5","6"];
var GURU=[
["ita","Ita@2026","Ita Rosmita, M.A","Kepala Madrasah","kepala","Akidah Akhlak","6"],
["romenah","Romenah@2026","Dr. Romenah, S.Pd.I, M.A","Guru","guru","Al-Qur'an Hadis","456"],
["martas","Martas@2026","Martas, S.Pd.I","Guru","guru","Fikih","456"],
["sri","Sri@2026","Sri Mulyati, S.Pd.I","Guru","guru","Akidah Akhlak","12345"],
["erik","Erik@2026","Erik Zen, S.Pd.I","Guru","guru","Bahasa Arab","123456"],
["salsabila","Salsabila@2026","Salsabila Ramadhina, S.Pd.I","Guru","guru","Al-Qur'an Hadis","123"],
["nurkhollah","Nurkhollah@2026","Nurkhollah, S.Hum","Guru","guru","SKI","3456"],
["mulyanah","Mulyanah@2026","Mulyanah, S.Pd","Guru (Wali Kelas 1)","guru","Tematik","1"],
["dian","Dian@2026","Dian Haryani, S.Pd","Guru (Wali Kelas 2)","guru","Tematik","2"],
["imelda","Imelda@2026","Imelda Patrisia, S.Pd","Guru (Wali Kelas 3)","guru","Tematik","3"],
["sopyan","Sopyan@2026","Sopyan Hadi, S.Si","Guru","guru","IPAS","456"],
["nurmalita","Nurmalita@2026","Nurmalita Sari, S.Pd","Guru","guru","Matematika","456"],
["euis","Euis@2026","Euis Amalia, S.Pd","Guru","guru","Bahasa Indonesia","456"],
["nurhabibah","Nurhabibah@2026","Nurhabibah, S.Pd","Guru","guru","PPKn","123456"],
["nasipot","Nasipot@2026","Nasipot Khu Zasqia, S.Pd","Guru","guru","PJOK","123456"],
["bayu","Bayu@2026","Bayu Supriyadi, S.Kom","Guru","guru","Informatika","456"],
["putri","Putri@2026","Putri Nur Karmila, S.Pd","Guru","guru","Bahasa Inggris","123456"],
["ibnu","Ibnu@2026","Ibnu Fauzani, S.M","Tata Usaha","admin","-",""],
["irmansyah","Irmansyah@2026","Irmansyah Fahmi, S.T","Operator","admin","-",""],
["admin","admin123","Administrator TU","Tata Usaha","admin","-",""]
].map(function(a){return{u:a[0],p:a[1],n:a[2],j:a[3],r:a[4],m:a[5],k:a[6].split("").filter(Boolean)}});
var YAYASAN={n:"H. Mujitaba, S.Ag",j:"Ketua Yayasan",m:"-",k:[],u:"-",p:"-"};
var MENU={home:["Beranda","kepala guru admin"],abs:["Absensi Siswa","kepala guru"],stt:["Status Absensi","admin"],jdw:["Jadwal Mengajar","kepala guru"],jur:["Jurnal Mengajar","kepala guru admin"],jad:["Atur Jadwal","admin"],info:["Pengumuman","admin"],rkp:["Rekap Absensi","kepala guru"],sis:["Data Siswa","kepala guru"],nil:["Nilai","kepala guru"],gur:["Daftar Guru","kepala guru admin"],acc:["Kelola Akun","admin"],log:["Log Aktivitas","admin"],set:["Pengaturan Sekolah","admin"],pro:["Akun Saya","kepala guru admin"]};
var me=null,roster={},absen={},grades={},cur="home",selK="1",editU=null,armed=false,started={};
var SET={sch:"MI Sa'adatuddarain II",tp:"2026/2027"},LOG=[],SK="satu_v1";
var JADWAL=[],INFO=[],JURNAL=[];
try{var sv=JSON.parse(localStorage.getItem(SK)||"null");if(sv&&sv.g){GURU=sv.g;SET=sv.s;LOG=sv.l||[];absen=sv.a||{};roster=sv.r||{};grades=sv.n||{};JADWAL=sv.j||[];INFO=sv.i||[];JURNAL=sv.jr||[]}}catch(e){}
if(!GURU.some(function(x){return x.u==="admin"}))GURU.push({u:"admin",p:"admin123",n:"Administrator TU",j:"Tata Usaha",r:"admin",m:"-",k:[]});
