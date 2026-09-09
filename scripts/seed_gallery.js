const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/promo_v2'
});

const photos = [
  { imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: 'Pegunungan', deskripsi: 'Keindahan puncak pegunungan' },
  { imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', title: 'Pantai Tropis', deskripsi: 'Pasir putih dan air jernih' },
  { imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80', title: 'Danau Indah', deskripsi: 'Danau tenang di antara pegunungan' },
  { imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', title: 'Hutan Hijau', deskripsi: 'Suasana hutan yang sejuk' },
  { imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', title: 'Jalan Setapak', deskripsi: 'Jalan menuju petualangan' },
  { imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80', title: 'Padang Rumput', deskripsi: 'Hamparan rumput hijau' },
];

async function seed() {
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    await pool.query(
      'INSERT INTO gallery (image_url, title, deskripsi, urutan, aktif) VALUES ($1, $2, $3, $4, 1)',
      [p.imageUrl, p.title, p.deskripsi, i + 1]
    );
    console.log(`Added: ${p.title}`);
  }
  console.log('Done!');
  await pool.end();
}

seed().catch(console.error);
