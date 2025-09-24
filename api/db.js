// api/db.js
// Versi ini sangat sederhana karena semua keamanan
// ditangani oleh vercel.json.

export default function handler(request, response) {
  // Hanya perlu memeriksa metodenya.
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(500).json({ 
      error: 'Server configuration error.' 
    });
  }

  // Kirimkan kunci sebagai response JSON
  response.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
  });
}

