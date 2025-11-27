// Ganti dengan endpoint API REST Anda yang sebenarnya
const API_ENDPOINT = 'YOUR_API_ENDPOINT'; 

// Fungsi untuk mengambil data video dari API
async function fetchVideoData() {
    const urlInput = document.getElementById('tiktok-url');
    const resultContainer = document.getElementById('result-container');
    const messageDiv = document.getElementById('message');
    const url = urlInput.value.trim();

    // Reset tampilan
    resultContainer.style.display = 'none';
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    if (!url) {
        messageDiv.textContent = '⚠️ Harap masukkan tautan video TikTok.';
        return;
    }

    try {
        messageDiv.textContent = '⏳ Mencari data video...';
        
        // Asumsi: API Anda menerima link sebagai parameter query
        // Contoh API Call: POST ke API_ENDPOINT dengan body JSON
        const response = await fetch(API_ENDPOINT, {
            method: 'POST', // Gunakan POST atau GET sesuai API Anda
            headers: {
                'Content-Type': 'application/json',
                // Tambahkan token otorisasi jika API Anda membutuhkannya
                // 'Authorization': 'Bearer your_token_here' 
            },
            body: JSON.stringify({
                tiktok_url: url
            })
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }

        const data = await response.json();
        // Asumsi: Struktur respons API Anda adalah seperti ini:
        /*
        {
            "success": true,
            "video_url": "https://cdn.example.com/video.mp4",
            "thumbnail_url": "https://cdn.example.com/thumbnail.jpg",
            "title": "Judul Video Keren"
        }
        */

        if (data.success && data.video_url && data.thumbnail_url) {
            displayVideoResult(data);
        } else {
            throw new Error(data.message || 'Tautan tidak valid atau video tidak ditemukan.');
        }

    } catch (error) {
        console.error('Error fetching video data:', error);
        messageDiv.textContent = `❌ Terjadi kesalahan: ${error.message}`;
        messageDiv.className = 'message error';
    }
}

// Fungsi untuk menampilkan hasil di antarmuka
function displayVideoResult(data) {
    const resultContainer = document.getElementById('result-container');
    const thumbnail = document.getElementById('video-thumbnail');
    const title = document.getElementById('video-title');
    const downloadBtn = document.getElementById('download-btn');
    const messageDiv = document.getElementById('message');

    // Mengatur data ke elemen HTML
    thumbnail.src = data.thumbnail_url;
    title.textContent = data.title || 'Video TikTok';
    
    // Menghapus event listener lama jika ada
    downloadBtn.onclick = null;
    
    // Menetapkan fungsi unduh
    downloadBtn.onclick = () => {
        downloadVideo(data.video_url, data.title);
    };

    // Tampilkan hasilnya
    resultContainer.style.display = 'block';
    messageDiv.textContent = '✅ Video ditemukan! Klik ikon unduh untuk menyimpan.';
    messageDiv.className = 'message success';
}

// Fungsi untuk memulai proses unduhan
function downloadVideo(videoUrl, title) {
    // Membuat elemen <a> sementara untuk memicu unduhan
    const link = document.createElement('a');
    link.href = videoUrl;
    // Atribut 'download' memaksa browser untuk mengunduh file, 
    // dengan nama file yang disarankan
    link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}_tiktok.mp4`);
    
    // Harus ditambahkan ke DOM untuk memicu klik
    document.body.appendChild(link); 
    link.click();
    
    // Membersihkan elemen <a>
    document.body.removeChild(link); 
    
    // Anda bisa menambahkan notifikasi di sini, misalnya:
    // document.getElementById('message').textContent = '📥 Proses unduhan dimulai...';
}

// Anda bisa menambahkan validasi format URL TikTok di sini jika diperlukan
function isValidTikTokUrl(url) {
    return url.includes('tiktok.com');
}
