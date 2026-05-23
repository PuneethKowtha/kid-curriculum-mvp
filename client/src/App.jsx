import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = '/api';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
      authAxios.get('/user')
        .then(res => {
          setUser(res.data);
          return authAxios.get('/kids');
        })
        .then(res => {
          setKids(res.data);
          const savedKidId = localStorage.getItem('currentKidId');
          if (savedKidId) {
            const kid = res.data.find(k => k.id === parseInt(savedKidId));
            if (kid) setCurrentKid(kid);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('currentKidId');
        })
        .finally(() => setLoading(false));
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
    setUser(null);
    setKids([]);
    setCurrentKid(null);
  };

  const addKid = async (name, grade, avatar_id) => {
    const res = await authAxios.post('/kids', { name, grade, avatar_id });
    const newKid = { id: res.data.id, name, grade, avatar_id };
    setKids([...kids, newKid]);
    return newKid;
  };

  const selectKid = (kid) => {
    setCurrentKid(kid);
    localStorage.setItem('currentKidId', kid.id);
  };

  return (
    <AuthContext.Provider value={{
      user, kids, currentKid, loading,
      login, register, logout, addKid, selectKid
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full px-6 py-3 rounded-xl font-bold text-lg bg-purple-600 text-white hover:bg-purple-700 transition-all">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-purple-600 font-bold">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

const AVATARS = ['🐶', '🐱', '🐰', '🦊', '🐼', '🦁', '🐸', '🦄'];

function getAvatar(id) {
  return AVATARS[(id - 1) % AVATARS.length];
}

function Home() {
  const { user, kids, currentKid, selectKid, logout } = useAuth();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (currentKid) {
      authAxios.get(`/songs?kidId=${currentKid.id}`)
        .then(res => setSongs(res.data))
        .catch(console.error);
      authAxios.get(`/quiz-results?kidId=${currentKid.id}`)
        .then(res => setResults(res.data.slice(0, 5)))
        .catch(console.error);
    }
  }, [currentKid]);

  if (!currentKid && kids.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Who's Learning Today?</h1>
          <div className="space-y-4">
            {kids.map(kid => (
              <button
                key={kid.id}
                onClick={() => { selectKid(kid); }}
                className="w-full px-6 py-4 rounded-xl font-bold text-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                {getAvatar(kid.avatar_id)} {kid.name} (Grade {kid.grade})
              </button>
            ))}
            <button onClick={() => navigate('/add-kid')} className="w-full px-6 py-4 rounded-xl font-bold text-xl bg-teal-500 text-white">
              + Add New Kid
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentKid) {
    return <CreateKid />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getAvatar(currentKid.avatar_id)}</div>
            <div>
              <h2 className="text-xl font-bold">{currentKid.name}</h2>
              <p className="text-gray-500">Grade {currentKid.grade}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { localStorage.removeItem('currentKidId'); window.location.reload(); }} className="px-4 py-2 bg-gray-200 rounded-xl font-bold">Switch Profile</button>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => navigate('/generator?subject=science')} className="bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">
            🚀 Science
          </button>
          <button onClick={() => navigate('/generator?subject=math')} className="bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">
            🧮 Math
          </button>
          <button onClick={() => navigate('/generator?subject=spelling')} className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">
            🔤 Spelling
          </button>
          <button onClick={() => navigate('/generator?subject=geography')} className="bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl p-6 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">
            🌍 Geography
          </button>
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
              {songs.map(song => (
                <button key={song.id} onClick={() => navigate(`/player/${song.id}`)} className="bg-gray-50 rounded-xl p-4 text-left hover:bg-gray-100">
                  <div className="text-3xl mb-2">{getGenreIcon(song.genre)}</div>
                  <div className="font-bold">{song.topic}</div>
                  <div className="text-sm text-gray-500 capitalize">{song.subject} - {song.genre}</div>
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

function getGenreIcon(genre) {
  const icons = { rap: '🎤', pop: '🎵', 'epic story': '🏰', lullaby: '🌙', dance: '💃', chant: '👏' };
  return icons[genre] || '🎵';
}

function getStars(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 80) return '⭐⭐⭐';
  if (pct >= 60) return '⭐⭐';
  return '⭐';
}

function CreateKid() {
  const { addKid, selectKid } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [avatarId, setAvatarId] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const kid = await addKid(name, grade, avatarId);
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
  const { currentKid } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subjectFromQuery = params.get('subject') || Array.from(params.keys())[0] || '';
    setSubject(subjectFromQuery);
  }, []);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setListening(true);
    recognition.onresult = (e) => { setTopicInput(e.results[0][0].transcript); setListening(false); };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const topics = {
    science: ['Human Body', 'Plants', 'Animals', 'Weather', 'Solar System', 'States of Matter'],
    math: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Shapes', 'Fractions', 'Time', 'Money'],
    spelling: ['Sight Words', 'Phonics', 'Spelling Lists', 'Homophones'],
    geography: ['Continents', 'Countries', 'Landforms', 'Maps']
  };

  const genres = [
    { id: 'rap', icon: '🎤', label: 'Rap' },
    { id: 'pop', icon: '🎵', label: 'Pop' },
    { id: 'epic story', icon: '🏰', label: 'Epic Story' },
    { id: 'lullaby', icon: '🌙', label: 'Lullaby' },
    { id: 'dance', icon: '💃', label: 'Dance' },
    { id: 'chant', icon: '👏', label: 'Chant' }
  ];

  const generateLyrics = (subj, top) => {
    const templates = {
      science: {
        'Human Body': 'The heart of our body beats so strong, Every organ helps us all day long! The heart pumps blood, the lungs help us breathe, Our amazing body is what we believe!',
        'Plants': 'Plants need sunlight to grow up tall, Water and soil help them not to fall! Roots take water from the ground below, Leaves and flowers everywhere we know!',
        'Animals': 'Animals live in forest and sea, Big and small, wild and free! Carnivores eat meat, herbivores eat plants, Omnivores eat both in animal grants!',
        'Weather': 'Sunny days shine so bright and clear, Clouds bring rain when storms appear! Snow falls cold, wind blows so strong, Weather changes all day long!',
        'Solar System': 'Eight planets orbit the Sun so bright, Mercury to Neptune shining light! The Moon shines bright at night in the sky, Our solar system is so vast and high!',
        'States of Matter': 'Water can freeze into ice so cold, Then melt again when it gets warm! Solid, liquid, gas, three states we know, Matter changes where the temp does go!'
      },
      math: {
        Addition: 'One plus two equals three in math class, Learning addition is super fast! Five plus three is eight that is true, Addition helps me and helps you!',
        Subtraction: 'Five minus two equals three we know, Taking away is easy to show! Ten minus four is six, that is the way, Subtraction helps us every day!',
        Multiplication: 'Three times two equals six thats great! Multiplication facts we celebrate! Four times five is twenty, hear us cheer, Times tables help us far and near!',
        Division: 'Ten divided by two equals five, Division helps numbers come alive! Twelve divided by three is four, Sharing equally is what division is for!',
        Shapes: 'Triangle has three sides count with me, Square has four sides just like a bee! Circle rolls round, its so much fun, Shapes are everywhere under the sun!',
        Fractions: 'Half of eight is four easy to see, Quarter of twenty is five like a bee! Third of nine is three, thats the way, Fractions help us share every day!',
        Time: 'The clock shows us time throughout the day, Hour hand points the way lead the way! Minute hand runs around the dial, Time tells us when to work and smile!',
        Money: 'A penny is one cent that is clear, A nickel is five cents have no fear! A dime is ten cents, quarter is twenty-five, Count your money and you will thrive!'
      },
      spelling: {
        'Sight Words': 'The word the we use everywhere, Look and see it everywhere! I, you, we are words we say, Sight words help us read each day!',
        Phonics: 'A says ah like in apple sweet, B says buh like in ball we meet! C says kuh, D says duh fun to say, Phonics help us read each day!',
        'Spelling Lists': 'Spell school with S-C-H-O-O-L, Spell friend and you will be cool! Spell beautiful with letters bright, Practice makes perfect what a sight!',
        Homophones: 'Their, there, they sound just the same, Write the right one its a game! Your vs you are, to vs two, Homophones are tricky but we get through!'
      },
      geography: {
        Continents: 'Seven continents on Earth we know, Asia, Africa, Europe lets go! North America, South America too, Antarctica and Australia continents view!',
        Countries: 'United States is one nation wide, France, Japan, Brazil with pride! Canada cold, India big and grand, Countries of the world are so grand!',
        Landforms: 'Mountains reach high up to the sky, Valleys low where rivers run by! Desert sand, island in the sea, Landforms are what we see!',
        Maps: 'Maps show us where to go today, North, South, East, West leads the way! Compass points the direction true, Maps help us find our way through!'
      }
    };
    return templates[subj]?.[top] || `Learning about ${top} is so much fun, Singing and dancing learning begun! We sing the words and remember the facts, ${top} is the best topic thats a fact!`;
  };

  const handleGenerate = async () => {
    if (!topicInput) { alert('Please enter or say a topic!'); return; }
    setGenerating(true);
    try {
      const prompt = generateLyrics(subject, topicInput);
      const res = await authAxios.post('/songs/generate', {
        kid_id: currentKid.id,
        subject,
        topic: topicInput,
        genre,
        grade: currentKid.grade,
        template_id: `${subject}-${topicInput.toLowerCase()}`,
        input_values: { topic: topicInput, grade: currentKid.grade },
        prompt,
        customMode: true,
        instrumental: false,
        model: 'V4',
        style: genre,
        title: `${topicInput} Learning Song`
      });
      navigate(`/player/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create song');
      console.error(err);
    } finally {
      setGenerating(false);
    }
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
          <h2 className="text-xl font-bold mb-4">Subject: {subject.charAt(0).toUpperCase() + subject.slice(1)}</h2>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">What do you want to learn about?</label>
            <div className="flex gap-2">
              <input type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)} placeholder="Type or speak..." className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl" />
              <button onClick={handleVoiceInput} className={`px-4 py-3 rounded-xl font-bold ${listening ? 'bg-red-500' : 'bg-teal-500'} text-white`}>
                {listening ? '🔴' : '🎤'}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(topics[subject] || []).map(t => (
                <button key={t} onClick={() => setTopicInput(t)} className={`px-3 py-1 rounded-full text-sm ${topicInput === t ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

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

  const handlePlay = () => {
    if (song.audio_url) return;
    if (!('speechSynthesis' in window)) { alert('TTS not supported'); return; }
    setPlaying(true);
    const u = new SpeechSynthesisUtterance(song.lyrics);
    u.onend = () => setPlaying(false);
    speechSynthesis.speak(u);
  };

  const handleStop = () => { setPlaying(false); speechSynthesis.cancel(); };

  const handleAnswer = (ans) => {
    if (ans === quizQuestions[quizIndex].a) setScore(s => s + 1);
    if (quizIndex < quizQuestions.length - 1) {
      setTimeout(() => setQuizIndex(i => i + 1), 1000);
    } else {
      setTimeout(async () => {
        setShowResults(true);
        const pass = (score + (ans === quizQuestions[quizIndex].a ? 1 : 0)) / quizQuestions.length >= 0.6;
        if (pass) { setCelebration(true); setTimeout(() => setCelebration(false), 3000); }
        try {
          await authAxios.post('/quiz-results', {
            song_id: song.id,
            kid_id: currentKid.id,
            score: score + (ans === quizQuestions[quizIndex].a ? 1 : 0),
            total: quizQuestions.length,
            answers: []
          });
        } catch (e) { console.error(e); }
      }, 1000);
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

  if (!song) return <div className="flex items-center justify-center h-screen">Loading...</div>;

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-8">⭐⭐⭐</div>
          <div className="text-4xl font-bold mb-4">AMAZING JOB!</div>
          <div className="text-2xl">You passed!</div>
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

  if (showQuiz) {
    const q = quizQuestions[quizIndex];
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-sm text-gray-500 mb-2">Question {quizIndex + 1} of {quizQuestions.length}</div>
          <h2 className="text-2xl font-bold mb-6">{q.q}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)} className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-gray-100 hover:bg-purple-600 hover:text-white">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const words = song.lyrics.split(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate('/')} className="text-gray-500 font-bold">← Back</button>
          <button onClick={handleShare} className="text-purple-600 font-bold">🔗 Share</button>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">{song.topic}</h1>
        <p className="text-center text-gray-500 mb-4">{song.genre} - Grade {song.grade}</p>
        <div className="bg-gray-50 rounded-xl p-6 mb-6 min-h-[200px]">
          <div className="text-lg leading-relaxed text-center">{words.map((w, i) => <span key={i} className="inline-block mx-1">{w}</span>)}</div>
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

  useEffect(() => {
    authAxios.get(`/shared/${shareId}`).then(res => setSong(res.data)).catch(console.error);
  }, [shareId]);

  if (!song) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const handlePlay = () => {
    if (song.audio_url) return;
    if (!('speechSynthesis' in window)) { alert('TTS not supported'); return; }
    setPlaying(true);
    const u = new SpeechSynthesisUtterance(song.lyrics);
    u.onend = () => setPlaying(false);
    speechSynthesis.speak(u);
  };

  const handleStop = () => { setPlaying(false); speechSynthesis.cancel(); };

  const words = song.lyrics.split(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎵</div>
          <h1 className="text-2xl font-bold">{song.topic}</h1>
          <p className="text-gray-500">{song.subject} - {song.genre}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 mb-4">
          <div className="text-lg leading-relaxed text-center">{words.map((w, i) => <span key={i} className="inline-block mx-1">{w}</span>)}</div>
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
