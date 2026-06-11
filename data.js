const { Pool } = require('pg');

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function init() {
    // ❌ Enlever ça :
    // await db.query(`DROP TABLE IF EXISTS guilds;`)

    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT,
            points INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `)

    await db.query(`
        CREATE TABLE IF NOT EXISTS moderation (
            id SERIAL PRIMARY KEY,
            user_id TEXT,
            guild_id TEXT,
            action TEXT,
            reason TEXT,
            moderator_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `)

    await db.query(`
        CREATE TABLE IF NOT EXISTS guilds (
            id TEXT PRIMARY KEY,
            captcha TEXT DEFAULT 'false',
            role TEXT
        );
    `)

    console.log('Base de données connectée !')
}

init()

module.exports = db;