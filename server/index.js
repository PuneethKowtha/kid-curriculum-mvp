const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'song-generator-secret-key';

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const result = stmt.run(email, hashedPassword);

    const token = jwt.sign({ userId: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, userId: result.lastInsertRowid, email });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, userId: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/user', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(req.user.userId);
  res.json(user);
});

app.get('/api/kids', authenticateToken, (req, res) => {
  const kids = db.prepare('SELECT * FROM kid_profiles WHERE user_id = ?').all(req.user.userId);
  res.json(kids);
});

app.post('/api/kids', authenticateToken, (req, res) => {
  const { name, grade, avatar_id } = req.body;

  const count = db.prepare('SELECT COUNT(*) as count FROM kid_profiles WHERE user_id = ?').get(req.user.userId);
  if (count.count >= 4) {
    return res.status(400).json({ error: 'Maximum 4 kids allowed' });
  }

  const stmt = db.prepare('INSERT INTO kid_profiles (user_id, name, grade, avatar_id) VALUES (?, ?, ?, ?)');
  const result = stmt.run(req.user.userId, name, grade, avatar_id || 1);

  res.json({ id: result.lastInsertRowid, name, grade, avatar_id: avatar_id || 1 });
});

app.put('/api/kids/:id', authenticateToken, (req, res) => {
  const { name, grade, avatar_id } = req.body;
  const { id } = req.params;

  const kid = db.prepare('SELECT * FROM kid_profiles WHERE id = ? AND user_id = ?').get(id, req.user.userId);
  if (!kid) return res.status(404).json({ error: 'Kid profile not found' });

  const stmt = db.prepare('UPDATE kid_profiles SET name = ?, grade = ?, avatar_id = ? WHERE id = ?');
  stmt.run(name, grade, avatar_id, id);

  res.json({ id: parseInt(id), name, grade, avatar_id });
});

app.delete('/api/kids/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const kid = db.prepare('SELECT * FROM kid_profiles WHERE id = ? AND user_id = ?').get(id, req.user.userId);
  if (!kid) return res.status(404).json({ error: 'Kid profile not found' });

  db.prepare('DELETE FROM quiz_results WHERE kid_id = ?').run(id);
  db.prepare('DELETE FROM songs WHERE kid_id = ?').run(id);
  db.prepare('DELETE FROM kid_profiles WHERE id = ?').run(id);

  res.json({ message: 'Kid profile deleted' });
});

app.get('/api/songs', authenticateToken, (req, res) => {
  const { kidId } = req.query;

  if (kidId) {
    const songs = db.prepare(`
      SELECT s.*, kr.score, kr.total as quiz_total
      FROM songs s
      LEFT JOIN (
        SELECT song_id, score, total, kid_id,
               ROW_NUMBER() OVER (PARTITION BY song_id ORDER BY created_at DESC) as rn
        FROM quiz_results
      ) kr ON s.id = kr.song_id AND kr.rn = 1
      WHERE s.kid_id = ?
      ORDER BY s.created_at DESC
    `).all(kidId);
    return res.json(songs);
  }

  const kids = db.prepare('SELECT id FROM kid_profiles WHERE user_id = ?').all(req.user.userId);
  const kidIds = kids.map(k => k.id);

  if (kidIds.length === 0) return res.json([]);

  const songs = db.prepare(`
    SELECT s.*, kr.score, kr.total as quiz_total, kp.name as kid_name
    FROM songs s
    LEFT JOIN (
      SELECT song_id, score, total, kid_id,
             ROW_NUMBER() OVER (PARTITION BY song_id ORDER BY created_at DESC) as rn
      FROM quiz_results
    ) kr ON s.id = kr.song_id AND kr.rn = 1
    JOIN kid_profiles kp ON s.kid_id = kp.id
    WHERE s.kid_id IN (${kidIds.join(',')})
    ORDER BY s.created_at DESC
  `).all();

  res.json(songs);
});

app.get('/api/songs/:id', (req, res) => {
  const { id } = req.params;

  const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(id);
  if (!song) return res.status(404).json({ error: 'Song not found' });

  res.json(song);
});

app.get('/api/shared/:shareId', (req, res) => {
  const { shareId } = req.params;

  const song = db.prepare(`
    SELECT s.*, kp.name as kid_name, kp.grade
    FROM songs s
    JOIN kid_profiles kp ON s.kid_id = kp.id
    WHERE s.share_id = ? AND s.is_shared = 1
  `).get(shareId);

  if (!song) return res.status(404).json({ error: 'Shared song not found' });

  res.json(song);
});

app.post('/api/songs', authenticateToken, (req, res) => {
  const { kid_id, subject, topic, genre, grade, template_id, input_values, lyrics, audio_settings } = req.body;

  const shareId = Math.random().toString(36).substring(2, 10);

  const stmt = db.prepare(`
    INSERT INTO songs (kid_id, subject, topic, genre, grade, template_id, input_values, lyrics, audio_settings, share_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(kid_id, subject, topic, genre, grade, template_id, JSON.stringify(input_values), lyrics, JSON.stringify(audio_settings), shareId);

  res.json({ id: result.lastInsertRowid, share_id: shareId });
});

app.put('/api/songs/:id', authenticateToken, (req, res) => {
  const { is_shared } = req.body;
  const { id } = req.params;

  const song = db.prepare('SELECT * FROM songs s JOIN kid_profiles kp ON s.kid_id = kp.id WHERE s.id = ? AND kp.user_id = ?').get(id, req.user.userId);
  if (!song) return res.status(404).json({ error: 'Song not found' });

  db.prepare('UPDATE songs SET is_shared = ? WHERE id = ?').run(is_shared ? 1 : 0, id);

  res.json({ message: 'Song updated' });
});

app.delete('/api/songs/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const song = db.prepare('SELECT * FROM songs s JOIN kid_profiles kp ON s.kid_id = kp.id WHERE s.id = ? AND kp.user_id = ?').get(id, req.user.userId);
  if (!song) return res.status(404).json({ error: 'Song not found' });

  db.prepare('DELETE FROM quiz_results WHERE song_id = ?').run(id);
  db.prepare('DELETE FROM songs WHERE id = ?').run(id);

  res.json({ message: 'Song deleted' });
});

app.get('/api/quiz-results', authenticateToken, (req, res) => {
  const { kidId } = req.query;

  let query = 'SELECT qr.*, s.subject, s.topic, s.genre, kp.name as kid_name FROM quiz_results qr JOIN songs s ON qr.song_id = s.id JOIN kid_profiles kp ON qr.kid_id = kp.id';
  const params = [];

  if (kidId) {
    query += ' WHERE qr.kid_id = ?';
    params.push(kidId);
  } else {
    const kids = db.prepare('SELECT id FROM kid_profiles WHERE user_id = ?').all(req.user.userId);
    const kidIds = kids.map(k => k.id);
    if (kidIds.length > 0) {
      query += ` WHERE qr.kid_id IN (${kidIds.join(',')})`;
    }
  }

  query += ' ORDER BY qr.created_at DESC';

  const results = db.prepare(query).all(...params);
  res.json(results);
});

app.post('/api/quiz-results', authenticateToken, (req, res) => {
  const { song_id, kid_id, score, total, answers } = req.body;

  const stmt = db.prepare('INSERT INTO quiz_results (song_id, kid_id, score, total, answers_json) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(song_id, kid_id, score, total, JSON.stringify(answers));

  res.json({ id: result.lastInsertRowid, score, total });
});

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});