import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = '/api';
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const authAxios = axios.create({ baseURL: API_URL });
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [kids, setKids] = useState([]);
  const [currentKid, setCurrentKid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAxios.get('/user').then(res => {
        setUser(res.data);
        return authAxios.get('/kids');
      }).then(res => {
        setKids(res.data);
        const savedKidId = localStorage.getItem('currentKidId');
        if (savedKidId) {
          const kid = res.data.find(k => k.id === parseInt(savedKidId));
          if (kid) setCurrentKid(kid);
        }
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentKidId');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAxios.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: res.data.userId, email: res.data.email });
    const kidsRes = await authAxios.get('/kids');
    setKids(kidsRes.data);
    return res.data;
  };

  const register = async (email, password) => {
    const res = await authAxios.post('/register', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: res.data.userId, email: res.data.email });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentKidId');
    setUser(null); setKids([]); setCurrentKid(null);
  };

  const addKid = async (name, grade, avatar_id, curriculum) => {
    const res = await authAxios.post('/kids', { name, grade, avatar_id, curriculum: curriculum || 'cbse' });
    const newKid = { id: res.data.id, name, grade, avatar_id, curriculum: curriculum || 'cbse' };
    setKids([...kids, newKid]);
    return newKid;
  };

  const selectKid = (kid) => {
    setCurrentKid(kid);
    localStorage.setItem('currentKidId', kid.id);
  };

  return (
    <AuthContext.Provider value={{ user, kids, currentKid, loading, login, register, logout, addKid, selectKid }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

const AVATARS = ['🐶', '🐱', '🐰', '🦊', '🐼', '🦁', '🐸', '🦄'];
function getAvatar(id) { return AVATARS[(id - 1) % AVATARS.length]; }
function getGenreIcon(genre) { const icons = { rap: '🎤', pop: '🎵', 'epic story': '🏰', lullaby: '🌙', dance: '💃', chant: '👏' }; return icons[genre] || '🎵'; }
function getStars(score, total) { const pct = (score / total) * 100; return pct >= 80 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐' : '⭐'; }

const CURRICULUM_NAMES = { cbse: 'CBSE', icse: 'ICSE', 'ssc-telangana': 'SSC Telangana' };

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      isLogin ? await login(email, password) : await register(email, password);
      navigate('/');
    } catch (err) { setError(err.response?.data?.error || 'Something went wrong'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" required />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full px-6 py-3 rounded-xl font-bold text-lg bg-purple-600 text-white hover:bg-purple-700 transition-all">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-purple-600 font-bold">{isLogin ? 'Sign Up' : 'Login'}</button>
        </p>
      </div>
    </div>
  );
}

function Home() {
  const { currentKid, kids, selectKid, logout } = useAuth();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (currentKid) {
      authAxios.get(`/songs?kidId=${currentKid.id}`).then(res => setSongs(res.data)).catch(console.error);
      authAxios.get(`/quiz-results?kidId=${currentKid.id}`).then(res => setResults(res.data.slice(0, 5))).catch(console.error);
      authAxios.get(`/kids/${currentKid.id}/stats`).then(res => setStats(res.data)).catch(console.error);
    }
  }, [currentKid]);

  if (!currentKid && kids.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Who's Learning Today?</h1>
          <div className="space-y-4">
            {kids.map(kid => (
              <button key={kid.id} onClick={() => { selectKid(kid); }} className="w-full px-6 py-4 rounded-xl font-bold text-xl bg-purple-600 text-white hover:bg-purple-700">
                {getAvatar(kid.avatar_id)} {kid.name} (Grade {kid.grade} · {CURRICULUM_NAMES[kid.curriculum] || 'CBSE'})
              </button>
            ))}
            <button onClick={() => navigate('/add-kid')} className="w-full px-6 py-4 rounded-xl font-bold text-xl bg-teal-500 text-white">+ Add New Kid</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentKid) return <CreateKid />;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getAvatar(currentKid.avatar_id)}</div>
            <div>
              <h2 className="text-xl font-bold">{currentKid.name}</h2>
              <p className="text-gray-500">Grade {currentKid.grade} · {CURRICULUM_NAMES[currentKid.curriculum] || 'CBSE'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { localStorage.removeItem('currentKidId'); window.location.reload(); }} className="px-4 py-2 bg-gray-200 rounded-xl font-bold text-sm">Switch</button>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm">Logout</button>
          </div>
        </div>

        {stats && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-4 mb-4 text-white shadow-lg">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-3xl font-bold">{stats.songsCreated}</div>
                <div className="text-purple-200 text-sm">Song{stats.songsCreated !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.totalStars} ⭐</div>
                <div className="text-purple-200 text-sm">Stars Earned</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.avgScoreLabel}</div>
                <div className="text-purple-200 text-sm">Avg Score</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => navigate('/generator?science')} className="bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🚀 Science</button>
          <button onClick={() => navigate('/generator?math')} className="bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🧮 Math</button>
          <button onClick={() => navigate('/generator?spelling')} className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🔤 Spelling</button>
          <button onClick={() => navigate('/generator?geography')} className="bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🌍 Geography</button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4">🎤 My Stage</h3>
          {songs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎵</div>
              <p>No songs yet! Pick a subject above to create your first song.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {songs.filter(s => !s.is_prewritten).slice(0, 6).map(song => (
                <button key={song.id} onClick={() => navigate(`/player/${song.id}`)} className="bg-gray-50 rounded-xl p-4 text-left hover:bg-gray-100">
                  <div className="text-3xl mb-2">{getGenreIcon(song.genre)}</div>
                  <div className="font-bold">{song.topic}</div>
                  <div className="text-sm text-gray-500 capitalize">{song.subject} · {song.genre}</div>
                  {song.score !== null && <div className="mt-2">{getStars(song.score, song.quiz_total)}</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">📊 Progress</h3>
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No quiz results yet.</p>
          ) : (
            <div className="space-y-2">
              {results.map(result => (
                <div key={result.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-bold">{result.topic}</div>
                    <div className="text-sm text-gray-500">{result.subject}</div>
                  </div>
                  <div className="text-lg">{getStars(result.score, result.total)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateKid() {
  const { addKid, selectKid } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [avatarId, setAvatarId] = useState(1);
  const [curriculum, setCurriculum] = useState('cbse');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const kid = await addKid(name, grade, avatarId, curriculum);
    selectKid(kid);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Add Your Child</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Grade</label>
            <select value={grade} onChange={e => setGrade(parseInt(e.target.value))} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl">
              {[1,2,3,4,5,6,7,8].map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Curriculum</label>
            <select value={curriculum} onChange={e => setCurriculum(e.target.value)} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl">
              <option value="cbse">CBSE</option>
              <option value="icse">ICSE</option>
              <option value="ssc-telangana">SSC Telangana</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Avatar</label>
            <div className="flex gap-2 justify-center">
              {[1,2,3,4,5,6,7,8].map(id => (
                <button key={id} type="button" onClick={() => setAvatarId(id)} className={`text-3xl p-2 rounded-full ${avatarId === id ? 'bg-purple-100 ring-2 ring-purple-500' : ''}`}>
                  {getAvatar(id)}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full px-6 py-3 rounded-xl font-bold text-lg bg-purple-600 text-white">Start Learning!</button>
        </form>
      </div>
    </div>
  );
}

function Generator() {
  const [subject, setSubject] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [genre, setGenre] = useState('pop');
  const [listening, setListening] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [curriculumTopics, setCurriculumTopics] = useState([]);
  const [suggestedSongs, setSuggestedSongs] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { currentKid } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSubject(params.get('subject') || '');
  }, []);

  useEffect(() => {
    if (subject && currentKid) {
      const cur = currentKid.curriculum || 'cbse';
      const gr = String(currentKid.grade);
      const pathMap = { math: 'math', science: 'science', spelling: 'spelling', geography: 'geography' };
      const subjKey = pathMap[subject];
      if (!subjKey) return;
      authAxios.get('/curriculums').then(res => {
        const data = res.data;
        const topics = data[cur]?.[subjKey]?.[gr] || data[cur]?.[subjKey]?.[`${gr}`];
        if (subjKey === 'science') {
          const allGrades = Object.keys(data[cur]?.[subjKey] || {});
          for (const g of allGrades) {
            if (g.includes('-')) {
              const [low, high] = g.split('-').map(Number);
              if (currentKid.grade >= low && currentKid.grade <= high) {
                setCurriculumTopics(data[cur][subjKey][g] || []);
                return;
              }
            }
          }
        }
        setCurriculumTopics(topics || []);
      }).catch(console.error);
    }
  }, [subject, currentKid]);

  useEffect(() => {
    if (subject && topicInput && currentKid) {
      setLoadingSuggestions(true);
      authAxios.get(`/prewritten-songs?subject=${subject}&grade=${currentKid.grade}&curriculum=${currentKid.curriculum || 'cbse'}`)
        .then(res => {
          const matched = res.data.filter(s => s.topic.toLowerCase() === topicInput.toLowerCase());
          setSuggestedSongs(matched);
        })
        .catch(console.error)
        .finally(() => setLoadingSuggestions(false));
    } else {
      setSuggestedSongs([]);
    }
  }, [subject, topicInput, currentKid]);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) { alert('Voice input not supported'); return; }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setListening(true);
    recognition.onresult = (e) => { setTopicInput(e.results[0][0].transcript); setListening(false); };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const handlePlaySuggested = (songId) => {
    navigate(`/player/${songId}`);
  };

  const genres = [
    { id: 'rap', icon: '🎤', label: 'Rap' },
    { id: 'pop', icon: '🎵', label: 'Pop' },
    { id: 'epic story', icon: '🏰', label: 'Epic Story' },
    { id: 'lullaby', icon: '🌙', label: 'Lullaby' },
    { id: 'dance', icon: '💃', label: 'Dance' },
    { id: 'chant', icon: '👏', label: 'Chant' }
  ];

  const handleGenerate = async () => {
    if (!topicInput) { alert('Please enter or say a topic!'); return; }
    setGenerating(true);
    setTimeout(async () => {
      try {
        const res = await authAxios.post('/songs', {
          kid_id: currentKid.id,
          subject,
          topic: topicInput,
          genre,
          grade: currentKid.grade,
          curriculum: currentKid.curriculum || 'cbse',
          template_id: `${subject}-${topicInput.toLowerCase().replace(/\s+/g, '-')}`,
          input_values: { topic: topicInput, grade: currentKid.grade },
          lyrics: `🎵 Learning about ${topicInput} in ${subject} is so much fun,\nDiscovering new facts one by one!\nExploring and learning every day,\n${topicInput} helps us in every way! 🎶`,
          audio_settings: { speed: 1, pitch: 1 }
        });
        navigate(`/player/${res.data.id}`);
      } catch (err) { alert('Failed to create song'); console.error(err); }
      finally { setGenerating(false); }
    }, 2000);
  };

  if (generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-8 animate-bounce">🎧</div>
          <div className="text-3xl font-bold mb-4">Making Your Song!</div>
          <div className="flex justify-center gap-2">
            <span className="text-4xl animate-bounce">🎵</span>
            <span className="text-4xl animate-bounce" style={{animationDelay: '0.5s'}}>🎶</span>
            <span className="text-4xl animate-bounce" style={{animationDelay: '1s'}}>🎵</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-4 text-gray-600 font-bold">← Back</button>
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Song!</h1>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <h2 className="text-xl font-bold mb-2">Subject: {subject.charAt(0).toUpperCase() + subject.slice(1)}</h2>
          <p className="text-gray-500 text-sm mb-4">Grade {currentKid?.grade} · {CURRICULUM_NAMES[currentKid?.curriculum] || 'CBSE'}</p>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">What do you want to learn about?</label>
            <div className="flex gap-2">
              <input type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)} placeholder="Type or speak..." className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none" />
              <button onClick={handleVoiceInput} className={`px-4 py-3 rounded-xl font-bold ${listening ? 'bg-red-500' : 'bg-teal-500'} text-white`}>
                {listening ? '🔴' : '🎤'}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {curriculumTopics.map(t => (
                <button key={t} onClick={() => setTopicInput(t)} className={`px-3 py-1 rounded-full text-sm ${topicInput === t ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {topicInput && (
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <h3 className="font-bold mb-2">🎵 Suggested Songs</h3>
            {loadingSuggestions ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : suggestedSongs.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {suggestedSongs.map(s => (
                  <button key={s.id} onClick={() => handlePlaySuggested(s.id)} className="flex-shrink-0 bg-purple-50 rounded-xl p-3 text-left hover:bg-purple-100 w-40">
                    <div className="text-2xl mb-1">{getGenreIcon(s.genre)}</div>
                    <div className="font-bold text-sm">{s.topic}</div>
                    <div className="text-xs text-gray-500">{s.genre}</div>
                    <div className="text-purple-600 text-xs mt-1">▶ Play</div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No pre-written songs found. You can create a new one!</p>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <h2 className="text-xl font-bold mb-4">Pick Your Style</h2>
          <div className="grid grid-cols-3 gap-3">
            {genres.map(g => (
              <button key={g.id} onClick={() => setGenre(g.id)} className={`p-4 rounded-xl text-center ${genre === g.id ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                <div className="text-3xl mb-1">{g.icon}</div>
                <div className="font-bold">{g.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} className="w-full px-6 py-4 rounded-xl font-bold text-xl bg-purple-600 text-white hover:bg-purple-700">
          🎵 Create My Song!
        </button>
      </div>
    </div>
  );
}

function Player() {
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const { currentKid } = useAuth();
  const navigate = useNavigate();
  const id = window.location.pathname.split('/').pop();

  useEffect(() => {
    authAxios.get(`/songs/${id}`).then(res => setSong(res.data)).catch(console.error);
  }, [id]);

  const lyricsLines = song ? song.lyrics.split('\n').filter(l => l.trim()) : [];

  useEffect(() => {
    if (!playing || lyricsLines.length === 0) return;
    setCurrentLineIdx(0);
    const interval = setInterval(() => {
      setCurrentLineIdx(prev => {
        const next = prev + 1;
        if (next >= lyricsLines.length) { clearInterval(interval); setPlaying(false); return 0; }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [playing, song?.id]);

  const getQuizForTopic = (subject, topic) => {
    const quizzes = {
      math: {
        Shapes: [
          { q: 'How many sides does a circle have?', options: ['0', '1', '3'], a: '0' },
          { q: 'How many sides does a square have?', options: ['3', '4', '5'], a: '4' },
          { q: 'A triangle has how many sides?', options: ['2', '3', '4'], a: '3' },
          { q: 'Which shape has four sides with two long and two short?', options: ['Square', 'Rectangle', 'Triangle'], a: 'Rectangle' },
          { q: 'How many points does a star have?', options: ['3', '5', '6'], a: '5' }
        ],
        Addition: [
          { q: 'What is one plus one?', options: ['1', '2', '3'], a: '2' },
          { q: 'What is two plus two?', options: ['3', '4', '5'], a: '4' },
          { q: 'What is three plus three?', options: ['5', '6', '7'], a: '6' },
          { q: 'What is five plus three?', options: ['7', '8', '9'], a: '8' },
          { q: 'What is ten plus zero?', options: ['0', '10', '11'], a: '10' }
        ],
        Multiplication: [
          { q: 'What is 2 times 2?', options: ['2', '4', '6'], a: '4' },
          { q: 'What is 3 times 4?', options: ['7', '12', '14'], a: '12' },
          { q: 'What is 5 times 5?', options: ['10', '20', '25'], a: '25' },
          { q: 'What does multiplication mean?', options: ['Repeated addition', 'Subtraction', 'Division'], a: 'Repeated addition' },
          { q: 'What is 10 times any number?', options: ['Add a zero', 'Double it', 'Half it'], a: 'Add a zero' }
        ],
        'Shapes & Designs': [
          { q: 'What shape has six sides?', options: ['Pentagon', 'Hexagon', 'Heptagon'], a: 'Hexagon' },
          { q: 'What is the perimeter of a shape?', options: ['Area inside', 'Distance around', 'Width only'], a: 'Distance around' },
          { q: 'What type of triangle has all sides equal?', options: ['Isosceles', 'Equilateral', 'Scalene'], a: 'Equilateral' },
          { q: 'A quadrilateral has how many sides?', options: ['3', '4', '5'], a: '4' },
          { q: 'What shape has eight sides?', options: ['Hexagon', 'Heptagon', 'Octagon'], a: 'Octagon' }
        ]
      },
      science: {
        'My Body': [
          { q: 'What organ pumps blood in our body?', options: ['Brain', 'Heart', 'Lungs'], a: 'Heart' },
          { q: 'What helps us breathe air?', options: ['Lungs', 'Stomach', 'Heart'], a: 'Lungs' },
          { q: 'What is the largest organ of our body?', options: ['Liver', 'Heart', 'Skin'], a: 'Skin' },
          { q: 'How many bones does an adult human have?', options: ['106', '206', '306'], a: '206' },
          { q: 'What does the brain do?', options: ['Pumps blood', 'Helps us think', 'Digests food'], a: 'Helps us think' }
        ],
        'Plants': [
          { q: 'What part of the plant grows underground?', options: ['Stem', 'Leaves', 'Roots'], a: 'Roots' },
          { q: 'What do plants need from the sun?', options: ['Water', 'Sunlight', 'Soil'], a: 'Sunlight' },
          { q: 'What process do plants use to make food?', options: ['Digestion', 'Respiration', 'Photosynthesis'], a: 'Photosynthesis' },
          { q: 'What part of the plant carries water to leaves?', options: ['Roots', 'Stem', 'Flowers'], a: 'Stem' },
          { q: 'What do plants give off that we breathe?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen'], a: 'Oxygen' }
        ],
        'Plants Around Us': [
          { q: 'What do roots do for a plant?', options: ['Make food', 'Hold the plant and take water', 'Grow flowers'], a: 'Hold the plant and take water' },
          { q: 'What part of a plant grows above the soil?', options: ['Roots', 'Stem', 'Both stem and leaves'], a: 'Stem' },
          { q: 'Which gas do plants use from the air?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], a: 'Carbon dioxide' },
          { q: 'What do flowers become after they bloom?', options: ['Roots', 'Fruits', 'Soil'], a: 'Fruits' },
          { q: 'What do we get from plants besides food?', options: ['Clothes and wood', 'Only food', 'Only oxygen'], a: 'Clothes and wood' }
        ],
        'Living Things': [
          { q: 'Do non-living things grow?', options: ['Yes', 'No', 'Sometimes'], a: 'No' },
          { q: 'What do living things need to survive?', options: ['Only food', 'Food, water and air', 'Only water'], a: 'Food, water and air' },
          { q: 'What do herbivores eat?', options: ['Meat', 'Plants', 'Both'], a: 'Plants' },
          { q: 'What do carnivores eat?', options: ['Meat', 'Plants', 'Both'], a: 'Meat' },
          { q: 'What do omnivores eat?', options: ['Only plants', 'Only meat', 'Both plants and meat'], a: 'Both plants and meat' }
        ],
        'Living & Non-Living': [
          { q: 'Is a rock a living thing?', options: ['Yes', 'No', 'Sometimes'], a: 'No' },
          { q: 'Do living things respond to changes?', options: ['Yes', 'No', 'Only some'], a: 'Yes' },
          { q: 'Can a non-living thing grow?', options: ['Yes', 'No', 'Only in water'], a: 'No' },
          { q: 'Do living things need air?', options: ['Yes', 'No', 'Only plants'], a: 'Yes' },
          { q: 'Is a toy car a living thing?', options: ['Yes', 'No', 'If it moves'], a: 'No' }
        ],
        'Our Body': [
          { q: 'How many bones are in the adult human skeleton?', options: ['106', '206', '306'], a: '206' },
          { q: 'What protects our brain?', options: ['Skull', 'Rib cage', 'Spine'], a: 'Skull' },
          { q: 'What is the function of the rib cage?', options: ['Protects heart and lungs', 'Helps us think', 'Digests food'], a: 'Protects heart and lungs' },
          { q: 'What are the muscles that we can control called?', options: ['Cardiac', 'Skeletal', 'Smooth'], a: 'Skeletal' },
          { q: 'What does the heart pump?', options: ['Air', 'Blood', 'Food'], a: 'Blood' }
        ]
      },
      spelling: {
        'Sight Words': [
          { q: 'How do we read sight words?', options: ['By sounding out', 'By looking at them', 'By spelling them'], a: 'By looking at them' },
          { q: 'Which word is a sight word?', options: ['Elephant', 'The', 'Refrigerator'], a: 'The' },
          { q: 'Which word is NOT a sight word?', options: ['A', 'Is', 'Giraffe'], a: 'Giraffe' },
          { q: 'What helps us read faster?', options: ['Knowing sight words', 'Reading slowly', 'Counting letters'], a: 'Knowing sight words' },
          { q: 'Is "play" a sight word?', options: ['Yes', 'No', 'Sometimes'], a: 'Yes' }
        ],
        Homophones: [
          { q: 'Which word means a place?', options: ['Their', 'There', 'They\'re'], a: 'There' },
          { q: 'Which word shows belonging?', options: ['Their', 'There', 'They\'re'], a: 'Their' },
          { q: 'Which is the number 2?', options: ['To', 'Too', 'Two'], a: 'Two' },
          { q: 'Which means also?', options: ['To', 'Too', 'Two'], a: 'Too' },
          { q: 'What is "sun" and "son"?', options: ['Homophones', 'Synonyms', 'Antonyms'], a: 'Homophones' }
        ],
        'Compound Words': [
          { q: 'What is a compound word?', options: ['A word with silent letters', 'Two small words joined as one', 'A very long word'], a: 'Two small words joined as one' },
          { q: 'What is "sun" + "flower"?', options: ['Sunlight', 'Sunflower', 'Flowerpot'], a: 'Sunflower' },
          { q: 'What is "rain" + "bow"?', options: ['Rainbow', 'Raindrop', 'Raincoat'], a: 'Rainbow' },
          { q: 'What is "bed" + "room"?', options: ['Bedroom', 'Bedtime', 'Bedding'], a: 'Bedroom' },
          { q: 'What is "class" + "room"?', options: ['Classmate', 'Classroom', 'Classwork'], a: 'Classroom' }
        ]
      },
      geography: {
        Continents: [
          { q: 'How many continents are there?', options: ['5', '7', '9'], a: '7' },
          { q: 'Which is the largest continent?', options: ['Africa', 'Asia', 'Europe'], a: 'Asia' },
          { q: 'Which continent is the coldest?', options: ['Antarctica', 'Europe', 'North America'], a: 'Antarctica' },
          { q: 'Which continent has the Amazon rainforest?', options: ['Asia', 'Africa', 'South America'], a: 'South America' },
          { q: 'What is Australia considered?', options: ['A country only', 'A continent and a country', 'An island only'], a: 'A continent and a country' }
        ],
        Countries: [
          { q: 'What is the capital of the United States?', options: ['New York', 'Washington D.C.', 'Los Angeles'], a: 'Washington D.C.' },
          { q: 'Which country has the Eiffel Tower?', options: ['Italy', 'France', 'Spain'], a: 'France' },
          { q: 'Which country has the Great Wall?', options: ['Japan', 'China', 'India'], a: 'China' },
          { q: 'Which is the largest country by area?', options: ['Canada', 'China', 'Russia'], a: 'Russia' },
          { q: 'Which country is also a continent?', options: ['India', 'Brazil', 'Australia'], a: 'Australia' }
        ]
      }
    };
    const topicKey = Object.keys(quizzes[subject] || {}).find(k => topic.toLowerCase().includes(k.toLowerCase())) || Object.keys(quizzes[subject] || {}).find(k => k.toLowerCase().includes(topic.toLowerCase().split(' ').slice(0, 2).join(' ')));
    const pool = (quizzes[subject] || {})[topicKey || ''] || (subject === 'math' ? quizzes.math.Shapes : subject === 'science' ? quizzes.science['My Body'] : subject === 'spelling' ? quizzes.spelling['Sight Words'] : quizzes.geography.Continents);
    return pool.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    if (song) {
      const qs = getQuizForTopic(song.subject, song.topic);
      setQuizQuestions(qs);
    }
  }, [song]);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) { alert('TTS not supported'); return; }
    speechSynthesis.cancel();
    setPlaying(true);
    const u = new SpeechSynthesisUtterance(song.lyrics);
    u.rate = 0.9;
    u.onend = () => { setPlaying(false); setCurrentLineIdx(0); };
    speechSynthesis.speak(u);
  };

  const handleStop = () => { setPlaying(false); setCurrentLineIdx(0); speechSynthesis.cancel(); };

  const handleAnswer = (ans) => {
    const correct = ans === quizQuestions[quizIndex].a;
    if (correct) setScore(s => s + 1);
    if (quizIndex < quizQuestions.length - 1) {
      setTimeout(() => setQuizIndex(i => i + 1), 1200);
    } else {
      setTimeout(async () => {
        setShowResults(true);
        const finalScore = score + (correct ? 1 : 0);
        const pct = finalScore / quizQuestions.length;
        if (pct >= 0.6) { setCelebration(true); setTimeout(() => setCelebration(false), 3000); }
        try {
          await authAxios.post('/quiz-results', {
            song_id: song.id, kid_id: currentKid.id,
            score: finalScore, total: quizQuestions.length, answers: []
          });
        } catch (e) { console.error(e); }
      }, 1200);
    }
  };

  const handleShare = async () => {
    try {
      await authAxios.put(`/songs/${song.id}`, { is_shared: true });
      const url = `${window.location.origin}/shared/${song.share_id}`;
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch (e) { alert('Failed to share'); }
  };

  if (!song) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;

  if (celebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-8">⭐⭐⭐</div>
          <div className="text-4xl font-bold mb-4">AMAZING JOB!</div>
          <div className="text-2xl">You passed the quiz!</div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const pct = (score / quizQuestions.length) * 100;
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">{pct >= 60 ? '🎉' : '💪'}</div>
          <h2 className="text-3xl font-bold mb-2">{pct >= 60 ? 'Great Job!' : 'Keep Practicing!'}</h2>
          <p className="text-xl mb-4">{score}/{quizQuestions.length} correct!</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl font-bold bg-teal-500 text-white">Back to Home</button>
            <button onClick={() => { setShowResults(false); setQuizIndex(0); setScore(0); }} className="px-6 py-3 rounded-xl font-bold bg-purple-600 text-white">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz && quizQuestions.length > 0) {
    const q = quizQuestions[quizIndex];
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-500 mb-2">Question {quizIndex + 1} of {quizQuestions.length}</div>
          <h2 className="text-3xl font-bold mb-8">{q.q}</h2>
          <div className="space-y-4">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)} className="w-full px-6 py-5 rounded-xl font-bold text-xl bg-gray-100 hover:bg-purple-600 hover:text-white transition-all">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => navigate('/')} className="text-gray-500 font-bold">← Back</button>
          <button onClick={handleShare} className="text-purple-600 font-bold">🔗 Share</button>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">{song.topic}</h1>
        <p className="text-center text-gray-500 text-sm mb-4">{song.subject} · {song.genre} · Grade {song.grade}</p>

        <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 mb-4 min-h-[250px] max-h-[400px] overflow-y-auto">
          <div className="text-2xl leading-relaxed text-center space-y-3">
            {lyricsLines.map((line, i) => (
              <div key={i} className={`transition-all duration-500 px-4 py-2 rounded-lg ${playing && currentLineIdx === i ? 'bg-purple-100 text-purple-900 font-bold scale-105 shadow-md' : playing && currentLineIdx > i ? 'text-gray-400' : 'text-gray-700'}`}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button onClick={playing ? handleStop : handlePlay} className={`px-10 py-4 rounded-xl font-bold text-xl ${playing ? 'bg-red-500' : 'bg-purple-600'} text-white hover:opacity-90 transition-all`}>
            {playing ? '⏹️ Stop' : '▶️ Play'}
          </button>
          <button onClick={handlePlay} className="px-6 py-4 rounded-xl font-bold bg-teal-500 text-white hover:opacity-90">🔄 Replay</button>
        </div>

        <button onClick={() => { handleStop(); setShowQuiz(true); }} className="w-full px-6 py-4 rounded-xl font-bold text-xl bg-purple-600 text-white hover:bg-purple-700 transition-all">
          🎯 Take Quiz!
        </button>
      </div>
    </div>
  );
}

function SharedSong() {
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const shareId = window.location.pathname.split('/').pop();

  useEffect(() => {
    authAxios.get(`/shared/${shareId}`).then(res => setSong(res.data)).catch(console.error);
  }, [shareId]);

  if (!song) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) { alert('TTS not supported'); return; }
    setPlaying(true);
    const u = new SpeechSynthesisUtterance(song.lyrics);
    u.onend = () => setPlaying(false);
    speechSynthesis.speak(u);
  };

  const handleStop = () => { setPlaying(false); speechSynthesis.cancel(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 p-4 flex items-center">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎵</div>
          <h1 className="text-2xl font-bold">{song.topic}</h1>
          <p className="text-gray-500">{song.subject} · {song.genre}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 mb-4 max-h-[300px] overflow-y-auto">
          <div className="text-lg leading-relaxed text-center space-y-2">
            {song.lyrics.split('\n').map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={playing ? handleStop : handlePlay} className={`px-8 py-4 rounded-xl font-bold text-xl ${playing ? 'bg-red-500' : 'bg-purple-600'} text-white`}>
            {playing ? '⏹️ Stop' : '▶️ Play'}
          </button>
        </div>
        <a href="/" className="block text-center px-6 py-4 rounded-xl font-bold bg-teal-500 text-white">🎤 Make Your Own!</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/add-kid" element={<ProtectedRoute><CreateKid /></ProtectedRoute>} />
          <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
          <Route path="/player/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
          <Route path="/shared/:shareId" element={<SharedSong />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;