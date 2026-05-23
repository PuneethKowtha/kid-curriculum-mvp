import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getQuizForTopic, synonymKeys, normalize } from './quizBank.js';
import { getLyricsForTopic } from './lyricsBank.js';
import Mascot from './components/Mascot.jsx';
import Confetti from './components/Confetti.jsx';
import SongLibrary from './components/SongLibrary.jsx';
import TopicSearch from './components/TopicSearch.jsx';
import { ToastProvider, useToast } from './components/Toast.jsx';
import { startMusic, stopMusic } from './music/musicEngine.js';

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
    <div className="min-h-screen bg-gray-50 p-4 bg-polka-dots-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button onClick={() => navigate('/generator?subject=science')} className="bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🚀 Science</button>
          <button onClick={() => navigate('/generator?subject=math')} className="bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🧮 Math</button>
          <button onClick={() => navigate('/generator?subject=spelling')} className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🔤 Spelling</button>
          <button onClick={() => navigate('/generator?subject=geography')} className="bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">🌍 Geography</button>
          <button onClick={() => navigate('/library')} className="bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">📚 Library</button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 card-pattern">
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

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg card-pattern">
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
  const toast = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subjectFromQuery = params.get('subject') || Array.from(params.keys())[0] || '';
    setSubject(subjectFromQuery);
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
    if (!('webkitSpeechRecognition' in window)) { toast('Voice input not supported'); return; }
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

  const generateLyrics = (subj, topic) => getLyricsForTopic(subj, topic);

  const handleGenerate = async () => {
    if (!topicInput) { toast('Please enter or say a topic!'); return; }
    setGenerating(true);
    setTimeout(async () => {
      try {
        const lyrics = generateLyrics(subject, topicInput);
        const res = await authAxios.post('/songs', {
          kid_id: currentKid.id,
          subject,
          topic: topicInput,
          genre,
          grade: currentKid.grade,
          curriculum: currentKid.curriculum || 'cbse',
          template_id: `${subject}-${topicInput.toLowerCase().replace(/\s+/g, '-')}`,
          input_values: { topic: topicInput, grade: currentKid.grade },
          lyrics,
          audio_settings: { speed: 1, pitch: 1 }
        });
        navigate(`/player/${res.data.id}`);
      } catch (err) { toast('Failed to create song'); console.error(err); }
      finally { setGenerating(false); }
    }, 2000);
  };

  const genGradients = {
    math: 'from-blue-600 to-indigo-500',
    science: 'from-emerald-600 to-teal-500',
    spelling: 'from-orange-600 to-red-500',
    geography: 'from-amber-600 to-yellow-500'
  };
  const genGrad = genGradients[subject] || 'from-purple-600 to-indigo-500';

  const [genStep, setGenStep] = useState(0);
  const genSteps = ['Writing lyrics... ✍️', 'Composing music... 🎶', 'Almost done... ⭐'];
  const genStepColors = ['from-pink-400 to-purple-400', 'from-purple-400 to-indigo-400', 'from-indigo-400 to-blue-400'];

  useEffect(() => {
    if (!generating) return;
    setGenStep(0);
    const timer = setInterval(() => setGenStep(s => Math.min(s + 1, 2)), 1500);
    return () => clearInterval(timer);
  }, [generating]);

  const floatingNotes = Array.from({ length: 6 }, (_, i) => ({
    note: i % 2 === 0 ? '🎵' : '🎶', delay: i * 0.4, x: 10 + i * 16, dur: 2 + (i % 3)
  }));

  if (generating) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${genGrad} flex items-center justify-center relative overflow-hidden`}>
        {/* Floating notes */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingNotes.map((n, i) => (
            <span key={i} className="absolute text-3xl animate-float-up opacity-30"
              style={{ left: `${n.x}%`, bottom: '10%', animationDelay: `${n.delay}s`, animationDuration: `${n.dur}s` }}>
              {n.note}
            </span>
          ))}
        </div>
        <div className="text-center text-white relative z-10">
          <Mascot animalId={currentKid?.avatar_id || 1} mood="excited" size="lg" className="mb-4" />
          <div className="text-3xl font-bold mb-4">Making Your Song!</div>
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {genSteps.map((step, i) => (
              <div key={i} className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-500 ${
                genStep === i ? 'bg-white text-purple-800 shadow-lg scale-110' :
                genStep > i ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
              }`}>
                {step}
              </div>
            ))}
          </div>
          {/* Pulse bar */}
          <div className="w-48 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className={`h-full rounded-full bg-white transition-all duration-700 animate-pulse`}
              style={{ width: `${((genStep + 1) / 3) * 100}%` }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 page-enter-active bg-polka-dots-sm">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-4 text-gray-600 font-bold">← Back</button>
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Song!</h1>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-4 card-pattern">
          <h2 className="text-xl font-bold mb-2">Subject: {subject.charAt(0).toUpperCase() + subject.slice(1)}</h2>
          <p className="text-gray-500 text-sm mb-4">Grade {currentKid?.grade} · {CURRICULUM_NAMES[currentKid?.curriculum] || 'CBSE'}</p>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">What do you want to learn about?</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <TopicSearch topics={{ [subject]: curriculumTopics }} value={topicInput} onChange={setTopicInput} placeholder="Type a topic..." />
              </div>
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
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-4 card-pattern">
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

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-4 card-pattern">
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
  const [countUp, setCountUp] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [shakingBtn, setShakingBtn] = useState(null);
  const [floatScores, setFloatScores] = useState([]);
  const [mascotQuizMood, setMascotQuizMood] = useState('thinking');
  const { currentKid } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const id = window.location.pathname.split('/').pop();
  const answerConfettiRef = useRef(null);

  useEffect(() => {
    authAxios.get(`/songs/${id}`).then(res => setSong(res.data)).catch(console.error);
  }, [id]);

  const lyricsLines = song ? song.lyrics.split('\n').filter(l => l.trim()) : [];

  useEffect(() => {
    if (!song?.task_id || song.status !== 'generating') return;

    const interval = setInterval(async () => {
      try {
        const res = await authAxios.get(`/songs/status/${song.task_id}`);
        setSong(res.data);
        if (res.data.status === 'complete' || res.data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [song?.task_id, song?.status]);

  const quizQuestions = [
    { q: 'What is 3 + 4?', options: ['5', '7', '9'], a: '7' },
    { q: 'What is 5 x 2?', options: ['8', '10', '12'], a: '10' },
    { q: 'What is 10 - 3?', options: ['5', '7', '9'], a: '7' },
    { q: 'How many sides does a triangle have?', options: ['2', '3', '4'], a: '3' }
  ];

  const handlePlay = async () => {
    if (song.audio_url) return;
    if (!('speechSynthesis' in window)) { toast('TTS not supported'); return; }
    setPlaying(true);
    startMusic(song.genre || 'pop');

    // Try Google Cloud TTS first
    try {
      const res = await authAxios.post('/tts', { text: song.lyrics, languageCode: 'en-US' });
      if (res.data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${res.data.audioContent}`);
        ttsAudioRef.current = audio;
        audio.volume = 0.5;
        audio.onended = () => { setPlaying(false); setCurrentLineIdx(0); stopMusic(); };
        audio.play().catch(() => fallbackTTS());
        return;
      }
    } catch (e) { /* fallback to Web Speech */ }
    fallbackTTS();
  };

  const fallbackTTS = () => {
    if (!('speechSynthesis' in window)) { toast('TTS not supported'); return; }
    const u = new SpeechSynthesisUtterance(song.lyrics);
    const voices = speechSynthesis.getVoices();
    const goodVoice = voices.find(v => /female|zira|natural/i.test(v.name)) || voices.find(v => /english|en-/i.test(v.lang)) || voices[0];
    if (goodVoice) u.voice = goodVoice;
    u.rate = 0.85;
    u.pitch = 1.2;
    u.onend = () => { setPlaying(false); setCurrentLineIdx(0); stopMusic(); };
    speechSynthesis.speak(u);
  };

  const handleStop = () => {
    setPlaying(false); setCurrentLineIdx(0);
    speechSynthesis.cancel();
    if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current = null; setTtsAudioUrl(null); }
    stopMusic();
  };

  const fireMiniConfetti = () => {
    import('canvas-confetti').then(({ default: c }) => {
      c({ particleCount: 20, spread: 40, origin: { x: 0.5, y: 0.6 }, colors: ['#6C5CE7', '#00CEC9', '#F59E0B', '#FB7185'] });
    });
  };

  const handleAnswer = (ans) => {
    const correct = ans === quizQuestions[quizIndex].a;
    setLastCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      fireMiniConfetti();
      setFloatScores(prev => [...prev, { id: Date.now(), x: Math.random() * 60 + 20 }]);
      setTimeout(() => setFloatScores(prev => prev.slice(1)), 800);
      setMascotQuizMood('celebrating');
    } else {
      setShakingBtn(ans);
      setMascotQuizMood('encouraging');
      setTimeout(() => setShakingBtn(null), 500);
    }

    setTimeout(() => setMascotQuizMood('thinking'), 800);

    if (quizIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setQuizIndex(i => i + 1);
        setLastCorrect(null);
      }, 1200);
    } else {
      setTimeout(async () => {
        setShowResults(true);
        const finalScore = score + (correct ? 1 : 0);
        const pct = finalScore / quizQuestions.length;
        if (pct >= 0.6) { setCelebration(true); }
        const step = Math.max(1, Math.floor(finalScore / 20));
        for (let i = 0; i <= finalScore; i += step) {
          await new Promise(r => setTimeout(r, 50));
          setCountUp(Math.min(i, finalScore));
        }
        setCountUp(finalScore);
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
      toast('Link copied! 📋');
    } catch (e) { toast('Failed to share'); }
  };

  const SCORE_RING_RADIUS = 45;
  const SCORE_RING_CIRCUM = 2 * Math.PI * SCORE_RING_RADIUS;

  const subjectGradients = {
    math: 'from-blue-500 to-indigo-400',
    science: 'from-emerald-500 to-teal-400',
    spelling: 'from-orange-500 to-red-400',
    geography: 'from-amber-500 to-yellow-400'
  };
  const playerGradient = subjectGradients[song?.subject] || 'from-purple-500 to-teal-400';

  if (!song) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;

  if (song.status === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">🎧</div>
          <h2 className="text-2xl font-bold mb-3">Your song is generating</h2>
          <p className="text-gray-600 mb-4">This can take up to a minute. We refresh automatically.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl font-bold bg-gray-200">Back to Home</button>
        </div>
      </div>
    );
  }

  if (song.status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-5xl mb-4">😞</div>
          <h2 className="text-2xl font-bold mb-2">Song generation failed</h2>
          <p className="text-gray-600 mb-6">{song.error_message || 'Please try another topic or style.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/generator?subject=' + song.subject)} className="px-5 py-3 rounded-xl font-bold bg-purple-600 text-white">Try Again</button>
            <button onClick={() => navigate('/')} className="px-5 py-3 rounded-xl font-bold bg-gray-200">Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (celebration) {
    const pct = quizQuestions.length > 0 ? countUp / quizQuestions.length : 0;
    const targetOffset = SCORE_RING_CIRCUM - pct * SCORE_RING_CIRCUM;
    return (
      <>
        <Confetti active={true} />
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="text-center text-white animate-pop-in relative z-10">
            <Mascot animalId={currentKid?.avatar_id || 1} mood="celebrating" size="lg" className="mb-4" />

            {/* Score Ring */}
            <div className="inline-flex items-center justify-center mb-4 relative">
              <svg width="130" height="130" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={SCORE_RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle cx="50" cy="50" r={SCORE_RING_RADIUS} fill="none" stroke="white" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={SCORE_RING_CIRCUM}
                  style={{ strokeDashoffset: SCORE_RING_CIRCUM, '--target': targetOffset }}
                  className="animate-score-ring" transform="rotate(-90 50 50)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{countUp}<span className="text-xl opacity-70">/{quizQuestions.length}</span></span>
              </div>
            </div>

            {/* Stars fly in */}
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map(i => (
                <span key={i} className={`text-5xl animate-pop-in animate-star-float`} style={{ animationDelay: `${i * 0.2}s, 2s` }}>
                  ⭐
                </span>
              ))}
            </div>

            <div className="text-4xl font-bold mb-2 animate-glow" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>AMAZING JOB!</div>
            <div className="text-xl mb-8 opacity-80">You passed the quiz!</div>

            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/')} className="px-8 py-4 rounded-2xl font-bold text-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all border border-white/30">
                🏠 Home
              </button>
              <button onClick={() => { setCelebration(false); setShowResults(true); }} className="px-8 py-4 rounded-2xl font-bold text-xl bg-purple-900/40 backdrop-blur-sm text-white hover:bg-purple-900/60 transition-all border border-purple-300/30">
                📊 Details
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showResults) {
    const pct = quizQuestions.length > 0 ? (countUp / quizQuestions.length) * 100 : 0;
    const passed = pct >= 60;
    const barPct = Math.min(pct, 100);
    const targetOffset = SCORE_RING_CIRCUM - (barPct / 100) * SCORE_RING_CIRCUM;
    return (
      <div className={`min-h-screen p-4 flex items-center justify-center page-enter-active ${passed ? 'bg-gradient-to-br from-purple-100 via-white to-indigo-100' : 'bg-gradient-to-br from-teal-50 via-white to-blue-100'}`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center shadow-xl animate-pop-in border border-white/50">
          <Mascot animalId={currentKid?.avatar_id || 1} mood={passed ? 'celebrating' : 'encouraging'} size="lg" className="mb-4" />

          {/* Mini score ring */}
          <div className="inline-flex items-center justify-center mb-3 relative">
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={SCORE_RING_RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle cx="50" cy="50" r={SCORE_RING_RADIUS} fill="none" stroke={passed ? '#7C3AED' : '#14B8A6'} strokeWidth="6"
                strokeLinecap="round" strokeDasharray={SCORE_RING_CIRCUM}
                style={{ strokeDashoffset: SCORE_RING_CIRCUM, '--target': targetOffset }}
                className="animate-score-ring" transform="rotate(-90 50 50)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{countUp}<span className="text-sm text-gray-400">/{quizQuestions.length}</span></span>
            </div>
          </div>

          <div className="text-5xl mb-2">{passed ? '🎉' : '💪'}</div>
          <h2 className="text-3xl font-bold mb-1">{passed ? 'Great Job!' : 'Almost There!'}</h2>
          <p className={passed ? 'text-purple-600 mb-4' : 'text-teal-600 mb-4'}>
            {passed ? "You're learning fast!" : "So close! Keep going!"}
          </p>

          <div className="mb-4">{getStars(countUp, quizQuestions.length)}</div>

          {/* Progress bar for fail */}
          {!passed && (
            <div className="mb-6">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-teal-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${barPct}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-1">You were {Math.ceil(60 - barPct)}% away from ⭐⭐!</p>
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => navigate('/')} className="px-6 py-3 rounded-2xl font-bold bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 transition-all shadow-sm">
              🏠 Home
            </button>
            <button onClick={() => { setShowResults(false); setQuizIndex(0); setScore(0); setCountUp(0); setCelebration(false); setLastCorrect(null); }} className="px-6 py-3 rounded-2xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-md">
              🔄 Try Again
            </button>
            {!passed && (
              <button onClick={() => navigate('/generator?subject=' + song.subject)} className="px-6 py-3 rounded-2xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-all shadow-md w-full">
                🔍 Learn {song.topic}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz && quizQuestions.length > 0) {
    const q = quizQuestions[quizIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 page-enter-active bg-polka-dots-sm">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-purple-100 card-pattern">
            <div className="flex items-center gap-3 mb-2">
              <Mascot animalId={currentKid?.avatar_id || 1} mood={mascotQuizMood} size="sm" />
              <span className="text-sm text-gray-500 font-medium">Question {quizIndex + 1} of {quizQuestions.length}</span>
            </div>

            {/* Score pills */}
            <div className="flex gap-1 mb-4">
              {quizQuestions.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${i < quizIndex ? (lastCorrect !== null && i === quizIndex - 1 ? (lastCorrect ? 'bg-green-400' : 'bg-red-300') : 'bg-purple-300') : i === quizIndex ? 'bg-purple-600' : 'bg-gray-200'}`} />
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">{q.q}</h2>

            {/* Floating score animations */}
            {floatScores.map(fs => (
              <span key={fs.id} className="fixed text-green-500 text-2xl font-bold pointer-events-none animate-float-score z-50" style={{ left: `${fs.x}%`, top: '50%' }}>
                +1
              </span>
            ))}

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.a;
                const isSelected = opt === lastCorrect !== null ? (opt === q.a) : false;
                let btnClass = 'w-full px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ';
                if (shakingBtn === opt) {
                  btnClass += 'bg-red-50 border-red-300 text-red-700 animate-shake';
                } else if (lastCorrect !== null && isCorrect) {
                  btnClass += 'bg-green-50 border-green-400 text-green-700';
                } else if (lastCorrect !== null && opt !== q.a) {
                  btnClass += 'bg-gray-50 border-gray-200 text-gray-400';
                } else {
                  btnClass += 'bg-white border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50';
                }
                return (
                  <button key={i} onClick={() => lastCorrect === null && handleAnswer(opt)} className={btnClass} disabled={lastCorrect !== null}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold shrink-0">{['A','B','C','D'][i]}</span>
                      <span className="flex-1 text-left">{opt}</span>
                      {lastCorrect !== null && isCorrect && <span className="text-xl">✅</span>}
                      {shakingBtn === opt && <span className="text-xl">❌</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${playerGradient} p-4 page-enter-active bg-polka-dots`}>
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-4 border border-white/50">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => navigate('/')} className="text-gray-500 font-bold">← Back</button>
          <Mascot animalId={currentKid?.avatar_id || 1} mood="idle" size="sm" />
        </div>
        <div className="flex items-center gap-2 justify-center mb-1">
          <h1 className="text-2xl font-bold text-center">{song.topic}</h1>
        </div>
        <p className="text-center text-gray-500 text-sm mb-4">{song.subject} · {song.genre} · Grade {song.grade}</p>

        <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 mb-4 min-h-[250px] max-h-[400px] overflow-y-auto">
          <div className="text-lg leading-relaxed text-center space-y-3">
            {lyricsLines.map((line, i) => (
              <div key={i} className={`transition-all duration-500 px-4 py-2 rounded-lg ${playing && currentLineIdx === i ? 'bg-purple-100 text-purple-900 font-bold scale-105 shadow-md animate-glow' : playing && currentLineIdx > i ? 'text-gray-400' : 'text-gray-700'}`}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button onClick={playing ? handleStop : handlePlay} className={`px-10 py-4 rounded-2xl font-bold text-xl ${playing ? 'bg-red-500' : 'bg-purple-600'} text-white hover:opacity-90 transition-all shadow-md`}>
            {playing ? '⏹️ Stop' : '▶️ Play'}
          </button>
          <button onClick={handlePlay} className="px-6 py-4 rounded-2xl font-bold bg-teal-500 text-white hover:opacity-90 shadow-md">🔄 Replay</button>
        </div>

        <button onClick={() => { handleStop(); setShowQuiz(true); }} className="w-full px-6 py-4 rounded-2xl font-bold text-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
          🎯 Take Quiz!
        </button>

        <div className="flex justify-center mt-4">
          <button onClick={handleShare} className="px-6 py-3 rounded-2xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
            🔗 Share this song
          </button>
        </div>
        {song.audio_url ? (
          <div className="mb-4">
            <audio className="w-full" controls src={song.audio_url} />
          </div>
        ) : (
          <div className="flex justify-center gap-4 mb-4">
            <button onClick={playing ? handleStop : handlePlay} className={`px-8 py-4 rounded-xl font-bold text-xl ${playing ? 'bg-red-500' : 'bg-purple-600'} text-white`}>
              {playing ? '⏹️ Stop' : '▶️ Play'}
            </button>
            <button onClick={handlePlay} className="px-6 py-4 rounded-xl font-bold bg-teal-500 text-white">🔄 Replay</button>
          </div>
        )}
        <button onClick={() => setShowQuiz(true)} className="w-full px-6 py-4 rounded-xl font-bold text-xl bg-purple-600 text-white">🎯 Take Quiz!</button>
      </div>
    </div>
  );
}

function SharedSong() {
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const shareId = window.location.pathname.split('/').pop();
  const toast = useToast();

  useEffect(() => {
    authAxios.get(`/shared/${shareId}`).then(res => setSong(res.data)).catch(console.error);
  }, [shareId]);

  if (!song) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const handlePlay = () => {
    if (song.audio_url) return;
    if (!('speechSynthesis' in window)) { toast('TTS not supported'); return; }
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
        {song.audio_url ? (
          <div className="mb-6">
            <audio className="w-full" controls src={song.audio_url} />
          </div>
        ) : (
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={playing ? handleStop : handlePlay} className={`px-8 py-4 rounded-xl font-bold text-xl ${playing ? 'bg-red-500' : 'bg-purple-600'} text-white`}>
              {playing ? '⏹️ Stop' : '▶️ Play'}
            </button>
          </div>
        )}
        <a href="/" className="block text-center px-6 py-4 rounded-xl font-bold bg-teal-500 text-white">🎤 Make Your Own!</a>
      </div>
    </div>
  );
}

function LibraryRoute() {
  const { currentKid } = useAuth();
  return <SongLibrary currentKid={currentKid} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/add-kid" element={<ProtectedRoute><CreateKid /></ProtectedRoute>} />
            <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
            <Route path="/player/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><LibraryRoute /></ProtectedRoute>} />
            <Route path="/shared/:shareId" element={<SharedSong />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
