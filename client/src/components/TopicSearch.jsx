import { useState, useEffect, useRef, useMemo } from 'react';

const subjectIcons = { math: '🧮', science: '🚀', spelling: '🔤', geography: '🌍' };

export default function TopicSearch({ topics = [], value = '', onChange, placeholder = 'Type a topic...' }) {
  const [input, setInput] = useState(value);
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const ref = useRef(null);
  const debounceRef = useRef(null);

  const allTopics = useMemo(() => {
    const flat = [];
    for (const [subj, list] of Object.entries(topics)) {
      for (const t of list) {
        flat.push({ label: t, subject: subj, icon: subjectIcons[subj] || '📚' });
      }
    }
    return flat;
  }, [topics]);

  const filtered = useMemo(() => {
    if (!input.trim()) return allTopics.slice(0, 8);
    const q = input.toLowerCase();
    return allTopics.filter(t =>
      t.label.toLowerCase().includes(q) || t.subject.includes(q)
    ).slice(0, 10);
  }, [input, allTopics]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setSelectedIdx(-1);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(val), 150);
  };

  const select = (item) => {
    setInput(item.label);
    setOpen(false);
    onChange(item.label);
  };

  const handleKey = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && selectedIdx >= 0) { select(filtered[selectedIdx]); }
    if (e.key === 'Escape') setOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setInput(value); }, [value]);

  return (
    <div ref={ref} className="relative">
      <input
        value={input}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {filtered.map((item, i) => (
            <button
              key={item.label + item.subject}
              onClick={() => select(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-50 transition-colors ${
                i === selectedIdx ? 'bg-purple-100' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              <span className="text-xs text-gray-400 capitalize ml-auto">{item.subject}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
