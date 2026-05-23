const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS kid_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    grade INTEGER NOT NULL,
    avatar_id INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kid_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    genre TEXT NOT NULL,
    grade INTEGER NOT NULL,
    template_id TEXT NOT NULL,
    input_values TEXT,
    lyrics TEXT NOT NULL,
    audio_settings TEXT,
    task_id TEXT,
    status TEXT DEFAULT 'complete',
    audio_url TEXT,
    image_url TEXT,
    error_message TEXT,
    share_id TEXT UNIQUE,
    is_shared INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kid_id) REFERENCES kid_profiles(id)
  );

  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER NOT NULL,
    kid_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    answers_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (song_id) REFERENCES songs(id),
    FOREIGN KEY (kid_id) REFERENCES kid_profiles(id)
  );
`);

const songColumns = db.prepare('PRAGMA table_info(songs)').all();
const songColumnNames = new Set(songColumns.map((column) => column.name));

if (!songColumnNames.has('task_id')) {
  db.exec('ALTER TABLE songs ADD COLUMN task_id TEXT');
}

if (!songColumnNames.has('status')) {
  db.exec("ALTER TABLE songs ADD COLUMN status TEXT DEFAULT 'complete'");
}

if (!songColumnNames.has('audio_url')) {
  db.exec('ALTER TABLE songs ADD COLUMN audio_url TEXT');
}

if (!songColumnNames.has('image_url')) {
  db.exec('ALTER TABLE songs ADD COLUMN image_url TEXT');
}

if (!songColumnNames.has('error_message')) {
  db.exec('ALTER TABLE songs ADD COLUMN error_message TEXT');
}

module.exports = db;
