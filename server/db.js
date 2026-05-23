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
    curriculum TEXT DEFAULT 'cbse',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kid_id INTEGER,
    user_id INTEGER,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    genre TEXT NOT NULL,
    grade INTEGER NOT NULL,
    curriculum TEXT DEFAULT 'cbse',
    template_id TEXT NOT NULL,
    input_values TEXT,
    lyrics TEXT NOT NULL,
    audio_settings TEXT,
    share_id TEXT UNIQUE,
    is_shared INTEGER DEFAULT 0,
    is_prewritten INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kid_id) REFERENCES kid_profiles(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
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

try {
  db.exec("ALTER TABLE kid_profiles ADD COLUMN curriculum TEXT DEFAULT 'cbse'");
} catch (e) {}
try {
  db.exec("ALTER TABLE songs ADD COLUMN is_prewritten INTEGER DEFAULT 0");
} catch (e) {}
try {
  db.exec("ALTER TABLE songs ADD COLUMN curriculum TEXT DEFAULT 'cbse'");
} catch (e) {}
try {
  db.exec("ALTER TABLE songs ADD COLUMN user_id INTEGER REFERENCES users(id)");
} catch (e) {}

module.exports = db;