// panggil fungsi readline 
const readline = require('./readline');
//  panggil fungsi untuk menyimpan database sementara
const databaseKontak = require('./storage');


// buat object kosong untuk menampung inputan 
let objectKontak = {
    nama : '',
    nomorHp : ''
}


function viewMenu() { //fungsi untuk menampilkan halaman menu
    console.log("Selamat Datang Di Aplikasi Kontak !");
    console.log("====================================\n");
    console.log("Main Menu :\n");
    console.log("1.Tambah Data \n");
    console.log("2.Lihat Data \n");
    console.log("3.Reset Data \n");
    console.log("4.Pencarian Data \n");
    console.log("5.Hapus Satu Data \n");
    console.log("99.Exit \n");
    readline.question(`Silahkan Masukan Pilihan Anda  :`, input => {
        mainMenu(Number(input))
    });
}



function mainMenu(pilihan) { // fungsi untuk mengatur pilihan menu
    switch (pilihan) {
        case 1:
            simpan()
            break;
        case 2:
            lihatData() 
            break;
        case 3:
            resetData() 
            break;
        case 4:
            pencarianData() 
            break;
        case 5:
            hapusData() 
            break;
            
        // lanjutkan menu pilihanya disini secara urut
        default:
            console.log("Pilihan Tidak Valid !");
            readline.close()
            break;
    }
}



function simpan() {
    console.log("\nSilahkan Masukkan Data : \n");
    readline.question("masukan Nama (format harus berupa string) : ", (nama) => {
        if (typeof nama === 'string' && isNaN(nama)) {
            objectKontak.nama = nama;
            console.log(`nama anda: ${nama}\n`);
            ambilInputanNomor();
        } else {
            console.log("Nama harus berupa huruf atau string (tidak boleh berisi angka atau karakter khusus).\n");
            simpan();
        }
    });
}

const ambilInputanNomor = () => {
    readline.question("Masukan Nomor (format harus berupa number) : ", (nomor) => {
        if (!isNaN(nomor)) {
            const nomorHp = nomor.trim(); 
            const isNomorExist = databaseKontak.some((kontak) => kontak.nomorHp === nomorHp);

            if (isNomorExist) {
                console.log(`Nomor ${nomorHp} sudah ada dalam database.\n`);
                ambilInputanNomor(); 
            } else {
                objectKontak.nomorHp = nomorHp;
                databaseKontak.push(Object.assign({}, objectKontak));
                console.log(`nomor hp anda: ${nomorHp}\n`);
                kembali();
            }
        } else {
            console.log("Nomor harus berupa angka.\n");
            ambilInputanNomor();
        }
    });
}


const kembali = () => { // fungsi untuk navigasi kembali
    readline.question("Apakah Anda Ingin Kembali ? (y/n) :", (pilihan) => {
        if(pilihan === "y"){
            viewMenu()
        }else {
            readline.close()
        }
        
    })
}

function lihatData () { // fungsi untuk melihat list data
    console.table(databaseKontak);
    kembali()
}



function resetData() {
    if (databaseKontak.length === 0) {
        console.log("Data Kosong, Tidak Ada Data Yang Dapat Dihapus.");
        viewMenu();
    } else {
        console.log("Anda yakin ingin menghapus semua data? (y/n)");
        readline.question("Pilihan Anda : ", input => {
            if (input.toLowerCase() === "y") {
                databaseKontak.length = 0;
                console.log("Semua data telah dihapus.");
            } else if (input.toLowerCase() === "n") {
                console.log("dibatalkan.");
            } else {
                console.log("Pilihan tidak valid.");
            }
            viewMenu();
        });
    }
}



function pencarianData() {
    readline.question("Masukkan kata kunci pencarian: ", (kataKunci) => {
        const hasilPencarian = databaseKontak.filter((kontak) =>
            kontak.nama.match(new RegExp(kataKunci, "i"))
        );

        let statusPencarian = false;

        if (hasilPencarian.length > 0) {
            statusPencarian = true;
        }

        if (statusPencarian) {
            console.log("\nHasil Pencarian:");

        
            console.table(
                hasilPencarian.map((kontak) => {
                    
                    return {Nama: kontak.nama, 'Nomor HP': kontak.nomorHp };
                })
            );
        } else {
            console.log("\nData tidak ditemukan.");
        }

        kembali()
    });
}



  
function hapusData() {
    readline.question("Masukkan nama kontak yang ingin dihapus: ", (namaKontak) => {
        const index = databaseKontak.findIndex((kontak) =>
            kontak.nama.toLowerCase() === namaKontak.toLowerCase()
        );

        if (index !== -1) {
            const deletedKontak = databaseKontak.splice(index, 1);
            console.log(`Kontak dengan nama '${deletedKontak[0].nama}' telah dihapus.`);
        } else {
            console.log(`Kontak dengan nama '${namaKontak}' tidak ditemukan.`);
        }

        kembali();
    });
}


viewMenu() // panggil fungsi view menu untuk pertama kali