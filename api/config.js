// File: /api/config.js
// Logika diperbarui dengan "keamanan berlapis" untuk memastikan
// auth.html bisa mengakses, sementara akses langsung tetap diblokir.

export default function handler(request, response) {
  // Ambil kedua header untuk pengecekan berlapis
  const secFetchSite = request.headers['sec-fetch-site'];
  const referer = request.headers.referer;

  // (Untuk debugging di Vercel Log)
  console.log(`Sec-Fetch-Site: ${secFetchSite}, Referer: ${referer}`);

  // --- KONDISI 1: Pengecekan Modern (Prioritas Utama) ---
  const isSameOriginFetch = secFetchSite === 'same-origin';

  // --- KONDISI 2: Pengecekan Cadangan (Fallback) menggunakan Referer ---
  // Definisikan semua origin/domain yang diizinkan dari environment variables
  // GANTI BAGIAN allowedOrigins DENGAN KODE DI BAWAH INI

// Daftar domain yang diizinkan untuk mengakses API ini
const allowedOrigins = [
  'http://localhost:3000', // Untuk development di komputer Anda
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean); // Menghapus nilai null jika tidak ada (misal saat di localhost)

  const refererOrigin = referer ? new URL(referer).origin : null;
  const isAllowedReferer = refererOrigin && allowedOrigins.includes(refererOrigin);


  // --- LOGIKA UTAMA ---
  // Izinkan akses jika SALAH SATU kondisi terpenuhi
  if (isSameOriginFetch || isAllowedReferer) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return response.status(500).json({
        error: 'Environment variables Supabase tidak diatur.'
      });
    }

    // Set header agar respons tidak di-cache
    response.setHeader('Cache-Control', 'no-store');
    
    return response.status(200).json({
      supabaseUrl,
      supabaseAnonKey,
    });

  } else {
    // Tolak jika tidak ada kondisi yang terpenuhi
    return response.status(403).json({
      error: 'Akses ditolak.',
      details: 'Permintaan ini bukan berasal dari sumber yang diizinkan.'
    });
  }
}

