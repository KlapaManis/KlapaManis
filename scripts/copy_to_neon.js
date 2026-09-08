const pg = require('pg');
const localUrl = 'postgresql://postgres:postgres@localhost:5432/promo_v2';
const liveUrl = 'postgresql://neondb_owner:npg_2wKLiENXlFk4@ep-round-block-b3kfgf10-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function copy() {
  const local = new pg.Client({ connectionString: localUrl });
  const live = new pg.Client({ connectionString: liveUrl });
  await local.connect(); await live.connect();
  console.log('connected both');

  // tables to copy
  const tables = ['promo_banner','promo','menu','menu_photo','promo_item'];
  for (const t of tables) {
    const r = await local.query(`SELECT * FROM ${t} ORDER BY id`);
    console.log(`${t}: ${r.rows.length} rows`);
    if (r.rows.length === 0) continue;
    // clear live
    await live.query(`TRUNCATE ${t} CASCADE`);
    for (const row of r.rows) {
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const placeholders = cols.map((_,i)=>`$${i+1}`).join(',');
      const colList = cols.map(c=>`"${c}"`).join(',');
      await live.query(`INSERT INTO ${t} (${colList}) VALUES (${placeholders})`, vals);
    }
    // reset sequence
    try {
      const seq = await local.query(`SELECT pg_get_serial_sequence('${t}','id') as seq`);
      const seqName = seq.rows[0].seq;
      if (seqName) {
        const max = await live.query(`SELECT COALESCE(MAX(id),0) as m FROM ${t}`);
        const m = Number(max.rows[0].m);
        await live.query(`SELECT setval('${seqName}', $1, true)`, [m+1]);
        console.log(`  seq ${seqName} -> ${m+1}`);
      }
    } catch(e){ console.log(' seq skip', e.message) }
  }
  // settings separately (key is setting_key)
  {
    const r = await local.query(`SELECT * FROM settings ORDER BY setting_key`);
    console.log(`settings: ${r.rows.length} rows`);
    await live.query(`TRUNCATE settings CASCADE`);
    for (const row of r.rows) {
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const placeholders = cols.map((_,i)=>`$${i+1}`).join(',');
      const colList = cols.map(c=>`"${c}"`).join(',');
      await live.query(`INSERT INTO settings (${colList}) VALUES (${placeholders})`, vals);
    }
  }

  // also copy users except admin already exists (merge)
  const u = await local.query('SELECT * FROM users');
  console.log(`users local ${u.rows.length}`);
  for (const row of u.rows) {
    try {
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const placeholders = cols.map((_,i)=>`$${i+1}`).join(',');
      const colList = cols.map(c=>`"${c}"`).join(',');
      await live.query(`INSERT INTO users (${colList}) VALUES (${placeholders}) ON CONFLICT (email) DO NOTHING`, vals);
    } catch(e){ console.log(' user insert err', e.message) }
  }

  await local.end(); await live.end();
  console.log('copy done');
}
copy().catch(e=>{console.error(e); process.exit(1)});
