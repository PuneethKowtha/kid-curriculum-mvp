const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'song-generator-secret-key';
const SUNO_API_KEY = process.env.SUNO_API_KEY;
const SUNO_GENERATE_ENDPOINT = process.env.SUNO_GENERATE_ENDPOINT || 'https://api.kie.ai/api/v1/generate';
const SUNO_STATUS_ENDPOINT = process.env.SUNO_STATUS_ENDPOINT || 'https://api.kie.ai/api/v1/generate/record-info';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TRANSCRIBE_MODEL = process.env.GEMINI_TRANSCRIBE_MODEL || 'gemini-2.5-flash';
const GEMINI_LYRICS_MODEL = process.env.GEMINI_LYRICS_MODEL || 'gemini-2.5-flash';

app.use(cors());
app.use(express.json());

const parseSunoTrack = (payload) => {
  const responseObj = payload?.data?.response;
  let tracks = responseObj?.sunoData;

  if (!tracks && Array.isArray(responseObj)) {
    tracks = responseObj;
  }

  if (!Array.isArray(tracks) || tracks.length === 0) {
    return null;
  }

  const firstTrack = tracks[0] || {};

  return {
    audioUrl: firstTrack.audioUrl || firstTrack.audio_url || null,
    imageUrl: firstTrack.imageUrl || firstTrack.image_url || null,
    rawTrack: firstTrack,
  };
};

const fetchSunoStatus = async (taskId) => {
  const statusUrl = `${SUNO_STATUS_ENDPOINT}?taskId=${encodeURIComponent(taskId)}`;
  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${SUNO_API_KEY}`,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.msg || payload?.message || 'Suno status request failed';
    throw new Error(message);
  }

  return payload;
};

const buildFallbackTimedLyrics = (lyricsText) => {
  const cleanText = (lyricsText || '').trim();
  if (!cleanText) {
    return { text: '', lines: [] };
  }

  const lines = cleanText
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { text: cleanText, lines: [] };
  }

  let cursor = 0;
  const timedLines = lines.map((line) => {
    const words = line.split(/\s+/).filter(Boolean);
    const wordDuration = 0.4;
    const lineStart = cursor;
    const timedWords = words.map((word) => {
      const start = cursor;
      const end = start + wordDuration;
      cursor = end;
      return { text: word, start, end };
    });
    cursor += 0.15;
    return {
      text: line,
      start: lineStart,
      end: timedWords.length ? timedWords[timedWords.length - 1].end : lineStart + 0.6,
      words: timedWords,
    };
  });

  return { text: cleanText, lines: timedLines };
};

const buildTimedLyricsFromTranscription = (transcriptionPayload, fallbackLyrics) => {
  const segments = transcriptionPayload?.segments;
  const words = transcriptionPayload?.words;
  const fullText = (transcriptionPayload?.text || fallbackLyrics || '').trim();

  if (!Array.isArray(segments) || segments.length === 0) {
    return buildFallbackTimedLyrics(fullText || fallbackLyrics || '');
  }

  const timedLines = segments
    .map((segment) => {
      const segmentText = (segment?.text || '').trim();
      if (!segmentText) return null;

      const start = Number(segment?.start || 0);
      const end = Number(segment?.end || start + 1);

      let segmentWords = [];
      if (Array.isArray(words) && words.length > 0) {
        segmentWords = words
          .filter((word) => Number(word?.start) >= start && Number(word?.end) <= end + 0.1)
          .map((word) => ({
            text: (word?.word || '').trim(),
            start: Number(word?.start || start),
            end: Number(word?.end || end),
          }))
          .filter((word) => word.text);
      }

      return {
        text: segmentText,
        start,
        end,
        words: segmentWords,
      };
    })
    .filter(Boolean);

  if (timedLines.length === 0) {
    return buildFallbackTimedLyrics(fullText || fallbackLyrics || '');
  }

  return {
    text: fullText || fallbackLyrics || timedLines.map((line) => line.text).join(' '),
    lines: timedLines,
  };
};

const parseGeminiJson = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
};

const transcribeAudioWithGemini = async (audioUrl) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error('Failed to download generated audio for transcription');
  }

  const audioBuffer = await audioResponse.arrayBuffer();
  const mimeType = audioResponse.headers.get('content-type') || 'audio/mpeg';
  const base64Audio = Buffer.from(audioBuffer).toString('base64');

  const prompt = [
    'Transcribe this song audio and return strict JSON only.',
    'Schema:',
    '{',
    '  "text": "full lyrics transcription",',
    '  "segments": [',
    '    { "start": 0.0, "end": 2.5, "text": "line of lyrics" }',
    '  ]',
    '}',
    'Rules:',
    '- start/end are seconds as numbers',
    '- segments should be in chronological order',
    '- no markdown, no explanation, only JSON',
  ].join('\n');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_TRANSCRIBE_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Audio,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || 'Gemini transcription failed');
  }

  const responseText = payload?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('') || '';
  const parsed = parseGeminiJson(responseText);

  if (!parsed || !Array.isArray(parsed.segments)) {
    throw new Error('Gemini transcription response was not valid JSON with segments');
  }

  return parsed;
};

const startTranscriptionForSong = (songId) => {
  setImmediate(async () => {
    try {
      const updateStart = db.prepare(`
        UPDATE songs
        SET transcription_status = 'processing'
        WHERE id = ? AND status = 'complete' AND audio_url IS NOT NULL
          AND (transcription_status IS NULL OR transcription_status IN ('pending', 'failed'))
      `);
      const startResult = updateStart.run(songId);
      if (startResult.changes === 0) return;

      const song = db.prepare('SELECT id, audio_url, lyrics FROM songs WHERE id = ?').get(songId);
      if (!song || !song.audio_url) {
        db.prepare("UPDATE songs SET transcription_status = 'failed' WHERE id = ?").run(songId);
        return;
      }

      let timedLyrics;
      if (GEMINI_API_KEY) {
        const transcription = await transcribeAudioWithGemini(song.audio_url);
        timedLyrics = buildTimedLyricsFromTranscription(transcription, song.lyrics || '');
      } else {
        timedLyrics = buildFallbackTimedLyrics(song.lyrics || '');
      }

      db.prepare(`
        UPDATE songs
        SET transcription_status = 'complete', transcription_text = ?, lyrics_timestamps_json = ?
        WHERE id = ?
      `).run(timedLyrics.text || song.lyrics || '', JSON.stringify(timedLyrics.lines || []), songId);
    } catch (error) {
      db.prepare('UPDATE songs SET transcription_status = ?, error_message = ? WHERE id = ?').run(
        'failed',
        error.message || 'Transcription failed',
        songId,
      );
    }
  });
};

const createLearningSongPrompt = ({ subject, topic, genre, grade }) => {
  const safeSubject = subject || 'science';
  const safeTopic = topic || 'General Knowledge';
  const safeGenre = genre || 'pop';
  const safeGrade = grade || 3;

  return [
    `Create a ${safeGenre} educational song for grade ${safeGrade} students.`,
    `Subject: ${safeSubject}.`,
    `Topic: ${safeTopic}.`,
    'Use clear, child-friendly language and short lines.',
    'Include a catchy chorus and repeat it once.',
    'Keep it fun, positive, and easy to memorize.',
    'Return only song lyrics.',
  ].join(' ');
};

const extractGeminiText = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts.map((part) => part?.text || '').join('').trim();
};

const generateLyricsWithGemini = async ({ subject, topic, genre, grade }) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = createLearningSongPrompt({ subject, topic, genre, grade });
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_LYRICS_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || 'Gemini lyrics generation failed');
  }

  const lyrics = extractGeminiText(payload);
  if (!lyrics) {
    throw new Error('Gemini returned empty lyrics');
  }

  return { prompt, lyrics };
};

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
  const { name, grade, avatar_id, curriculum } = req.body;

  const count = db.prepare('SELECT COUNT(*) as count FROM kid_profiles WHERE user_id = ?').get(req.user.userId);
  if (count.count >= 4) {
    return res.status(400).json({ error: 'Maximum 4 kids allowed' });
  }

  const stmt = db.prepare('INSERT INTO kid_profiles (user_id, name, grade, avatar_id, curriculum) VALUES (?, ?, ?, ?, ?)');
  const result = stmt.run(req.user.userId, name, grade, avatar_id || 1, curriculum || 'cbse');

  res.json({ id: result.lastInsertRowid, name, grade, avatar_id: avatar_id || 1, curriculum: curriculum || 'cbse' });
});

app.put('/api/kids/:id', authenticateToken, (req, res) => {
  const { name, grade, avatar_id, curriculum } = req.body;
  const { id } = req.params;

  const kid = db.prepare('SELECT * FROM kid_profiles WHERE id = ? AND user_id = ?').get(id, req.user.userId);
  if (!kid) return res.status(404).json({ error: 'Kid profile not found' });

  const stmt = db.prepare('UPDATE kid_profiles SET name = ?, grade = ?, avatar_id = ?, curriculum = ? WHERE id = ?');
  stmt.run(name, grade, avatar_id, curriculum, id);

  res.json({ id: parseInt(id), name, grade, avatar_id, curriculum });
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
    INSERT INTO songs (kid_id, subject, topic, genre, grade, template_id, input_values, lyrics, audio_settings, status, share_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(kid_id, subject, topic, genre, grade, template_id, JSON.stringify(input_values), lyrics, JSON.stringify(audio_settings), 'complete', shareId);

  res.json({ id: result.lastInsertRowid, share_id: shareId });
});

app.post('/api/songs/generate', authenticateToken, async (req, res) => {
  if (!SUNO_API_KEY) {
    return res.status(500).json({ error: 'SUNO_API_KEY is not configured' });
  }

  const {
    kid_id,
    subject,
    topic,
    genre,
    grade,
    template_id,
    input_values,
    prompt,
    customMode,
    instrumental,
    model,
    style,
    title,
  } = req.body;

  const kid = db.prepare('SELECT * FROM kid_profiles WHERE id = ? AND user_id = ?').get(kid_id, req.user.userId);
  if (!kid) {
    return res.status(404).json({ error: 'Kid profile not found' });
  }

  if (!prompt && !instrumental) {
    return res.status(400).json({ error: 'Prompt is required for non-instrumental generation' });
  }

  const shareId = Math.random().toString(36).substring(2, 10);
  const payload = {
    prompt,
    customMode: !!customMode,
    instrumental: !!instrumental,
    model: model || 'V4',
    callBackUrl: 'https://example.com/callback',
  };

  if (payload.customMode) {
    payload.style = style || genre || 'Pop';
    payload.title = title || `${topic || 'Learning'} Song`;
  }

  try {
    const response = await fetch(SUNO_GENERATE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const sunoData = await response.json();

    if (!response.ok || sunoData?.code !== 200) {
      const message = sunoData?.msg || 'Suno generation failed';
      return res.status(502).json({ error: message });
    }

    const taskId = sunoData?.data?.taskId;
    if (!taskId) {
      return res.status(502).json({ error: 'Suno returned no task id' });
    }

    const stmt = db.prepare(`
      INSERT INTO songs (kid_id, subject, topic, genre, grade, template_id, input_values, lyrics, audio_settings, task_id, status, transcription_status, share_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      kid_id,
      subject,
      topic,
      genre,
      grade,
      template_id,
      JSON.stringify(input_values || {}),
      prompt || '',
      JSON.stringify({}),
      taskId,
      'generating',
      'pending',
      shareId,
    );

    res.json({
      id: result.lastInsertRowid,
      task_id: taskId,
      status: 'generating',
      share_id: shareId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to start generation' });
  }
});

app.get('/api/songs/status/:taskId', authenticateToken, async (req, res) => {
  if (!SUNO_API_KEY) {
    return res.status(500).json({ error: 'SUNO_API_KEY is not configured' });
  }

  const { taskId } = req.params;

  const song = db.prepare(`
    SELECT s.*
    FROM songs s
    JOIN kid_profiles kp ON s.kid_id = kp.id
    WHERE s.task_id = ? AND kp.user_id = ?
  `).get(taskId, req.user.userId);

  if (!song) {
    return res.status(404).json({ error: 'Song task not found' });
  }

  if (song.status === 'complete' || song.status === 'failed') {
    if (song.status === 'complete' && song.audio_url && song.transcription_status !== 'complete' && song.transcription_status !== 'processing') {
      startTranscriptionForSong(song.id);
    }
    return res.json(song);
  }

  try {
    const payload = await fetchSunoStatus(taskId);
    const apiStatus = payload?.data?.status;

    if (payload?.code === 200 && apiStatus === 'SUCCESS') {
      const track = parseSunoTrack(payload);
      db.prepare(
        'UPDATE songs SET status = ?, audio_url = ?, image_url = ?, error_message = NULL, transcription_status = COALESCE(transcription_status, ?) WHERE id = ?'
      ).run('complete', track?.audioUrl || null, track?.imageUrl || null, 'pending', song.id);

      const latestSong = db.prepare('SELECT * FROM songs WHERE id = ?').get(song.id);
      if (latestSong?.audio_url && latestSong?.transcription_status !== 'complete') {
        startTranscriptionForSong(song.id);
      }
    } else if (payload?.code === 200 && apiStatus === 'FAILED') {
      db.prepare('UPDATE songs SET status = ?, error_message = ? WHERE id = ?').run(
        'failed',
        payload?.msg || 'Generation failed',
        song.id,
      );
    }

    const updated = db.prepare('SELECT * FROM songs WHERE id = ?').get(song.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to check status' });
  }
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

app.get('/api/prewritten-songs', (req, res) => {
  res.json([]);
});

app.post('/api/songs/generate-one', authenticateToken, async (req, res) => {
  if (!SUNO_API_KEY) {
    return res.status(500).json({ error: 'SUNO_API_KEY is not configured' });
  }
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  const {
    kid_id,
    subject,
    topic,
    genre,
    grade,
    template_id,
    input_values,
    style,
    title,
  } = req.body;

  const kid = db.prepare('SELECT * FROM kid_profiles WHERE id = ? AND user_id = ?').get(kid_id, req.user.userId);
  if (!kid) {
    return res.status(404).json({ error: 'Kid profile not found' });
  }

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const shareId = Math.random().toString(36).substring(2, 10);

  try {
    const { prompt, lyrics } = await generateLyricsWithGemini({
      subject,
      topic,
      genre,
      grade: grade || kid.grade,
    });

    const payload = {
      prompt: lyrics,
      customMode: true,
      instrumental: false,
      model: 'V4',
      callBackUrl: 'https://example.com/callback',
      style: style || genre || 'pop',
      title: title || `${topic} Learning Song`,
    };

    const response = await fetch(SUNO_GENERATE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const sunoData = await response.json();

    if (!response.ok || sunoData?.code !== 200) {
      const message = sunoData?.msg || 'Suno generation failed';
      return res.status(502).json({ error: message });
    }

    const taskId = sunoData?.data?.taskId;
    if (!taskId) {
      return res.status(502).json({ error: 'Suno returned no task id' });
    }

    const stmt = db.prepare(`
      INSERT INTO songs (kid_id, subject, topic, genre, grade, curriculum, template_id, input_values, lyrics, audio_settings, task_id, status, transcription_status, share_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      kid_id,
      subject,
      topic,
      genre || 'pop',
      grade || kid.grade,
      kid.curriculum || 'cbse',
      template_id || `${subject || 'general'}-${String(topic).toLowerCase().replace(/\s+/g, '-')}`,
      JSON.stringify(input_values || { topic }),
      lyrics,
      JSON.stringify({}),
      taskId,
      'generating',
      'pending',
      shareId,
    );

    res.json({
      id: result.lastInsertRowid,
      task_id: taskId,
      status: 'generating',
      share_id: shareId,
      prompt,
      lyrics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to start generation' });
  }
});

// Bookmarks API
app.get('/api/kids/:id/bookmarks', authenticateToken, (req, res) => {
  const { id } = req.params;
  const bookmarks = db.prepare('SELECT b.*, s.subject, s.topic, s.genre, s.grade, s.lyrics FROM bookmarks b JOIN songs s ON b.song_id = s.id WHERE b.kid_id = ?').all(id);
  res.json(bookmarks);
});

app.post('/api/bookmarks', authenticateToken, (req, res) => {
  const { kid_id, song_id } = req.body;
  try {
    const stmt = db.prepare('INSERT OR IGNORE INTO bookmarks (kid_id, song_id) VALUES (?, ?)');
    const result = stmt.run(kid_id, song_id);
    res.json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: 'Already bookmarked' });
  }
});

app.delete('/api/bookmarks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const bm = db.prepare('SELECT b.* FROM bookmarks b JOIN kid_profiles kp ON b.kid_id = kp.id WHERE b.id = ? AND kp.user_id = ?').get(id, req.user.userId);
  if (!bm) return res.status(404).json({ error: 'Bookmark not found' });
  db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
  res.json({ message: 'Bookmark deleted' });
});

app.get('/api/kids/:id/stats', authenticateToken, (req, res) => {
  const { id } = req.params;

  const kid = db.prepare('SELECT * FROM kid_profiles WHERE id = ? AND user_id = ?').get(id, req.user.userId);
  if (!kid) return res.status(404).json({ error: 'Kid profile not found' });

  const songCount = db.prepare('SELECT COUNT(*) as count FROM songs WHERE kid_id = ?').get(id);
  let totalStars = 0;
  let totalScore = 0;
  let totalQuiz = 0;

  const results = db.prepare('SELECT score, total FROM quiz_results WHERE kid_id = ?').all(id);
  results.forEach(r => {
    const pct = (r.score / r.total) * 100;
    if (pct >= 80) totalStars += 3;
    else if (pct >= 60) totalStars += 2;
    else totalStars += 1;
    totalScore += r.score;
    totalQuiz += r.total;
  });

  const avgScore = totalQuiz > 0 ? Math.round((totalScore / totalQuiz) * 100) : 0;

  res.json({
    songsCreated: songCount.count,
    totalStars,
    avgScore,
    avgScoreLabel: totalQuiz > 0 ? `${avgScore}%` : '--'
  });
});

const fs = require('fs');
app.get('/api/curriculums', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../shared/curriculums.json'), 'utf8'));
  res.json(data);
});

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
