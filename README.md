# Permaian Jari: Pemain vs Bot 🖐️🤖

Permainan jari klasik yang dimainkan melawan kecerdasan buatan (AI) dengan tiga tingkat kesulitan. Tujuannya adalah menjatuhkan kedua tangan lawan (mencapai nilai 5) sebelum lawan menjatuhkan tanganmu.

## **[Mainkan Langsung](https://riswan-nopiyar.github.io/Web-permainan-jari)** 
<br/>
<br/>
<p align="center">
  <img width="253" height="500" alt="image" src="https://github.com/user-attachments/assets/81718801-a0bc-45b7-8a43-d931bc0735c9" />
</p>


## Aturan Main 📜

### Cara Bermain
1. **Kondisi Awal**: Setiap tangan dimulai dengan nilai **1**.
2. **Tujuan**: Buat kedua tangan lawan mencapai nilai **5** (mati).
3. **Giliran**: Pemain dan bot bergantian menyerang.

### Aksi yang Bisa Dilakukan
#### 1. Menyerang ⚔️
- Pilih **tanganmu** yang masih hidup, lalu klik **tangan lawan**.
- Nilai tangan lawan akan bertambah sesuai nilai tanganmu.
- Jika total mencapai **5**, tangan lawan mati (menjadi 💀).
- **Contoh**: Tanganmu (3) menyerang tangan lawan (4) → hasil `(3+4) mod 5 = 2` (bukan 7).

#### 2. Split ✂️
- Tersedia jika satu tangan bernilai **2** atau **4**, dan tangan satunya sudah **mati** (5).
- **Split 2** → bagi rata menjadi 1 dan 1.
- **Split 4** → bagi rata menjadi 2 dan 2.
- Split **tidak menghabiskan giliran** — kamu bisa langsung menyerang lagi.

### Kondisi Menang 🏆
- Pemain menang jika **kedua tangan bot mati**.
- Bot menang jika **kedua tangan pemain mati**.

## Tingkat Kesulitan 🤔

| Level | Kesulitan | Cara Bot Bermain |
|-------|-----------|------------------|
| 🟢 Mudah | Random | 50% pilih langkah mematikan, sisanya acak |
| 🟡 Sedang | Minimax depth 3 | Melihat 3 langkah ke depan dengan sedikit variasi |
| 🔴 Susah | Minimax depth 6 | Melihat 6 langkah ke depan, hampir sempurna |

## Tips & Trik 💡
- **Manfaatkan Split**: Split memberikan fleksibilitas tanpa kehilangan giliran.
- **Hindari nilai 4**: Tangan bernilai 4 berbahaya karena serangan kecil (1) bisa langsung mematikanmu.
- **Paksa lawan ke nilai 4**: Jika bisa membuat tangan bot bernilai 4, kamu hanya butuh serangan 1 untuk menang.
- **Perhatikan pola**: Bot tingkat susah akan berusaha menghindari jebakan.

---
Selamat bermain! 🎮
