import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mascot from './Mascot';

const API_URL = '/api';
const authAxios = axios.create({ baseURL: API_URL });
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const genreIcons = { rap: '🎤', pop: '🎵', 'epic story': '🏰', lullaby: '🌙', dance: '💃', chant: '👏' };
const subjectColors = { math: 'bg-blue-100 text-blue-700', science: 'bg-orange-100 text-orange-700', spelling: 'bg-green-100 text-green-700', geography: 'bg-yellow-100 text-yellow-700' };

export default function SongLibrary({ currentKid }) {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAxios.get('/prewritten-songs').then(res => {
      setSongs(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!currentKid) return;
    authAxios.get(`/kids/${currentKid.id}/bookmarks`).then(res => {
      setBookmarkedIds(new Set(res.data.map(b => b.song_id)));
    }).catch(() => {});
  }, [currentKid]);

  const toggleBookmark = async (songId) => {
    if (!currentKid) return;
    const existing = bookmarkedIds.has(songId);
    try {
      if (existing) {
        const bookmarks = await authAxios.get(`/kids/${currentKid.id}/bookmarks`);
        const bm = bookmarks.data.find(b => b.song_id === songId);
        if (bm) await authAxios.delete(`/bookmarks/${bm.id}`);
        bookmarkedIds.delete(songId);
      } else {
        await authAxios.post('/bookmarks', { kid_id: currentKid.id, song_id: songId });
        bookmarkedIds.add(songId);
      }
      setBookmarkedIds(new Set(bookmarkedIds));
    } catch (e) { console.error(e); }
  };

  let filtered = songs;
  if (filterSubject !== 'all') filtered = filtered.filter(s => s.subject === filterSubject);
  if (filterGrade !== 'all') filtered = filtered.filter(s => String(s.grade) === filterGrade);
  if (filterGenre !== 'all') filtered = filtered.filter(s => s.genre === filterGenre);
  if (showFavorites) filtered = filtered.filter(s => bookmarkedIds.has(s.id));

  const subjects = ['all', 'math', 'science', 'spelling', 'geography'];
  const grades = ['all', '1', '2', '3', '4', '5'];
  const genres = ['all', 'rap', 'pop', 'epic story', 'lullaby', 'dance', 'chant'];

  const filterBtn = (label, active, onClick) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
        active ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 bg-polka-dots-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="text-gray-500 font-bold hover:text-gray-700">← Back</button>
          <h1 className="text-3xl font-bold flex-1">📚 Song Library</h1>
          <Mascot animalId={currentKid?.avatar_id || 1} mood="idle" size="md" />
        </div>

        {/* Favorites toggle */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              showFavorites ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {showFavorites ? '❤️ Favorites' : '🤍 Show Favorites'}
          </button>
          <span className="text-sm text-gray-400">{filtered.length} song{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Filter rows */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-6 space-y-3 card-pattern">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-gray-500 w-16">Subject</span>
            {subjects.map(s => filterBtn(s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1), filterSubject === s, () => setFilterSubject(s)))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-gray-500 w-16">Grade</span>
            {grades.map(g => filterBtn(g === 'all' ? 'All' : `Grade ${g}`, filterGrade === g, () => setFilterGrade(g)))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-gray-500 w-16">Genre</span>
            {genres.map(g => filterBtn(g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1), filterGenre === g, () => setFilterGenre(g)))}
          </div>
        </div>

        {/* Song grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-lg animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Mascot animalId={currentKid?.avatar_id || 1} mood="thinking" size="lg" className="mb-4" />
            <p className="text-gray-500 text-lg">No songs match your filters!</p>
            <button onClick={() => { setFilterSubject('all'); setFilterGrade('all'); setFilterGenre('all'); setShowFavorites(false); }}
              className="mt-4 px-6 py-3 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(song => (
              <div key={song.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-4xl">{genreIcons[song.genre] || '🎵'}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(song.id); }}
                    className={`text-2xl transition-all hover:scale-110 ${bookmarkedIds.has(song.id) ? 'text-red-500' : 'text-gray-300'}`}
                  >
                    {bookmarkedIds.has(song.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <h3 className="font-bold text-lg mb-1">{song.topic}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${subjectColors[song.subject] || 'bg-gray-100 text-gray-600'}`}>
                    {song.subject}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    G{song.grade}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                    {song.genre}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/player/${song.id}`)}
                  className="w-full mt-3 px-4 py-2 rounded-xl font-bold text-sm bg-purple-600 text-white hover:bg-purple-700 transition-all"
                >
                  ▶ Play
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
