const ANIMALS = {
  1: {
    body: '#D4A574', ears: 'floppy', earColor: '#C4955A', innerEar: '#E8C4A0',
    belly: '#F5E6D0', nose: '#3D2B1F', spotColor: '#C4955A',
    tail: 'short', tailColor: '#D4A574', irisColor: '#8B5E3C',
    hasWhiskers: false, hasCheekFluff: false
  },
  2: {
    body: '#FFB347', ears: 'pointy', earColor: '#FFB347', innerEar: '#FF8C94',
    belly: '#FFF0E0', nose: '#FF6B8A', spotColor: '#FF8C42',
    tail: 'long', tailColor: '#FFB347', irisColor: '#4CAF50',
    hasWhiskers: true, hasCheekFluff: false
  },
  3: {
    body: '#F5F0E8', ears: 'long', earColor: '#F5F0E8', innerEar: '#FFB5C2',
    belly: '#FFFFFF', nose: '#FF9EAA', spotColor: '#FFD1DC',
    tail: 'round', tailColor: '#FFFFFF', irisColor: '#FF9EAA',
    hasWhiskers: false, hasCheekFluff: true
  },
  4: {
    body: '#E8743A', ears: 'triangle', earColor: '#E8743A', innerEar: '#FFFFFF',
    belly: '#FFF5E6', nose: '#2C1810', spotColor: '#FFFFFF',
    tail: 'bushy', tailColor: '#E8743A', tailTip: '#FFFFFF', irisColor: '#FF8C00',
    hasWhiskers: true, hasCheekFluff: false
  },
  5: {
    body: '#FFFFFF', ears: 'round', earColor: '#2C2C2C', innerEar: '#4A4A4A',
    belly: '#F5F5F5', nose: '#2C2C2C', spotColor: '#2C2C2C',
    tail: 'none', tailColor: '#2C2C2C', irisColor: '#5D4037',
    hasWhiskers: false, hasCheekFluff: false
  },
  6: {
    body: '#D4A040', ears: 'round', earColor: '#D4A040', innerEar: '#F5DEB3',
    belly: '#F5E6C8', nose: '#8B6914', spotColor: '#8B6914',
    tail: 'tuft', tailColor: '#D4A040', mane: '#C89030', irisColor: '#FFD700',
    hasWhiskers: false, hasCheekFluff: false
  },
  7: {
    body: '#4CAF50', ears: 'none', earColor: '#4CAF50', innerEar: '#81C784',
    belly: '#C8E6C9', nose: '#2E7D32', spotColor: '#66BB6A',
    tail: 'none', tailColor: '#4CAF50', irisColor: '#CDDC39',
    hasWhiskers: false, hasCheekFluff: false
  },
  8: {
    body: '#F3E5F5', ears: 'pointy', earColor: '#F3E5F5', innerEar: '#FFD1DC',
    belly: '#FFFFFF', nose: '#CE93D8', spotColor: '#E1BEE7',
    tail: 'flowing', tailColor: '#CE93D8', horn: '#FFD700', irisColor: '#CE93D8',
    hasWhiskers: false, hasCheekFluff: false
  }
};

function getMoodData(mood) {
  switch (mood) {
    case 'excited':
      return {
        eyeOpen: 1, irisScale: 1.3, browLeft: 'M22 15 Q28 12 34 15', browRight: 'M38 15 Q44 12 50 15',
        eyelidY: 16, mouthType: 'open', mouthOpen: 5, blush: true
      };
    case 'celebrating':
      return {
        eyeOpen: 1, irisScale: 1.1, browLeft: 'M23 14 Q28 11 33 14', browRight: 'M39 14 Q44 11 49 14',
        eyelidY: 16, mouthType: 'smile', mouthOpen: 0, blush: true
      };
    case 'thinking':
      return {
        eyeOpen: 0.7, irisScale: 0.8, browLeft: 'M22 14 Q28 16 34 14', browRight: 'M38 14 Q44 16 50 14',
        eyelidY: 19, mouthType: 'wavy', mouthOpen: 0, blush: true
      };
    case 'encouraging':
      return {
        eyeOpen: 0.85, irisScale: 0.9, browLeft: 'M23 17 Q28 19 33 17', browRight: 'M39 17 Q44 19 49 17',
        eyelidY: 18, mouthType: 'warm', mouthOpen: 0, blush: true
      };
    case 'sleepy':
      return {
        eyeOpen: 0.3, irisScale: 0.5, browLeft: 'M23 18 Q28 20 33 18', browRight: 'M39 18 Q44 20 49 18',
        eyelidY: 21, mouthType: 'yawn', mouthOpen: 2, blush: false
      };
    default: // idle
      return {
        eyeOpen: 1, irisScale: 1, browLeft: 'M23 15 Q28 13 33 15', browRight: 'M39 15 Q44 13 49 15',
        eyelidY: 16, mouthType: 'smile', mouthOpen: 0, blush: false
      };
  }
}

function Ears({ config }) {
  const c = config;
  switch (c.ears) {
    case 'floppy':
      return (
        <g className="ear-group">
          <ellipse className="ear-left" cx="16" cy="18" rx="8" ry="14" fill={c.earColor} transform="rotate(-20 16 18)" />
          <ellipse cx="16" cy="18" rx="4" ry="10" fill={c.innerEar} transform="rotate(-20 16 18)" />
          <ellipse className="ear-right" cx="56" cy="18" rx="8" ry="14" fill={c.earColor} transform="rotate(20 56 18)" />
          <ellipse cx="56" cy="18" rx="4" ry="10" fill={c.innerEar} transform="rotate(20 56 18)" />
        </g>
      );
    case 'pointy':
      return (
        <g>
          <polygon points="16,28 10,6 24,22" fill={c.earColor} />
          <polygon points="16,24 12,10 22,20" fill={c.innerEar} />
          <polygon points="56,28 62,6 48,22" fill={c.earColor} />
          <polygon points="56,24 60,10 50,20" fill={c.innerEar} />
        </g>
      );
    case 'triangle':
      return (
        <g>
          <polygon points="14,30 8,8 24,24" fill={c.earColor} />
          <polygon points="14,20 11,12 20,20" fill={c.innerEar} />
          <polygon points="58,30 64,8 48,24" fill={c.earColor} />
          <polygon points="58,20 61,12 52,20" fill={c.innerEar} />
        </g>
      );
    case 'long':
      return (
        <g>
          <ellipse className="ear-left" cx="14" cy="8" rx="6" ry="20" fill={c.earColor} transform="rotate(-10 14 8)" />
          <ellipse cx="14" cy="8" rx="3" ry="15" fill={c.innerEar} transform="rotate(-10 14 8)" />
          <ellipse className="ear-right" cx="58" cy="8" rx="6" ry="20" fill={c.earColor} transform="rotate(10 58 8)" />
          <ellipse cx="58" cy="8" rx="3" ry="15" fill={c.innerEar} transform="rotate(10 58 8)" />
        </g>
      );
    case 'round':
      return (
        <g>
          <circle cx="16" cy="20" r="10" fill={c.earColor} />
          <circle cx="16" cy="20" r="6" fill={c.innerEar} />
          <circle cx="56" cy="20" r="10" fill={c.earColor} />
          <circle cx="56" cy="20" r="6" fill={c.innerEar} />
        </g>
      );
    default: return null;
  }
}

function Tail({ config }) {
  const c = config;
  switch (c.tail) {
    case 'short':
      return <ellipse className="tail-group" cx="70" cy="38" rx="8" ry="5" fill={c.tailColor} transform="rotate(15 70 38)" />;
    case 'long':
      return <path className="tail-group" d="M68 36 Q80 30 82 18 Q84 10 80 8" stroke={c.tailColor} strokeWidth="5" fill="none" strokeLinecap="round" />;
    case 'round':
      return <circle className="tail-group" cx="72" cy="36" r="7" fill={c.tailColor} />;
    case 'bushy':
      return (
        <g className="tail-group">
          <path d="M66 38 Q78 28 82 18 Q84 12 80 8 Q76 10 74 18 Q72 24 68 34" fill={c.tailColor} />
          {c.tailTip && <circle cx="80" cy="10" r="4" fill={c.tailTip} />}
        </g>
      );
    case 'tuft':
      return (
        <g className="tail-group">
          <path d="M66 38 Q76 32 78 26 Q80 20 76 16" stroke={c.tailColor} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="75" cy="16" r="5" fill={c.tailColor} />
        </g>
      );
    case 'flowing':
      return (
        <g>
          <path d="M66 38 Q76 30 80 20 Q84 10 78 6" stroke={c.tailColor} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
          {[4, 5, 3].map((s, i) => (
            <circle key={i} cx={76 + i * 3} cy={8 + i * 6} r={s} fill={['#CE93D8', '#E1BEE7', '#F3E5F5'][i]} />
          ))}
        </g>
      );
    default: return null;
  }
}

function Mane({ config }) {
  if (!config.mane) return null;
  return (
    <g className="mane-group" opacity="0.6">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const r = 32;
        const cx = 36 + Math.cos(angle) * r;
        const cy = 28 + Math.sin(angle) * r;
        return <ellipse key={i} cx={cx} cy={cy} rx="8" ry="12" fill={config.mane} transform={`rotate(${angle * 180 / Math.PI + 90} ${cx} ${cy})`} opacity="0.8" />;
      })}
    </g>
  );
}

function Horn({ config }) {
  if (!config.horn) return null;
  return <polygon className="horn-group" points="36,8 32,-8 40,-8" fill={config.horn} />;
}

function Eyes({ config, mood }) {
  const md = getMoodData(mood);
  const irisR = 4 * md.irisScale;
  const c = config;

  const Eye = ({ cx, idx }) => {
    const eyeClipId = `eye-clip-${idx}`;
    return (
      <g>
        <defs>
          <clipPath id={eyeClipId}>
            <rect x={cx - 8} y={md.eyelidY} width="16" height="14" />
          </clipPath>
        </defs>
        {/* Sclera */}
        <ellipse cx={cx} cy="22" rx="7" ry="6" fill="white" />
        {/* Iris + Pupil + Highlight (clipped by eyelid) */}
        <g clipPath={`url(#${eyeClipId})`}>
          <circle cx={cx} cy="22" r={irisR} fill={c.irisColor} />
          <circle cx={cx} cy="22" r="2" fill="#2C2C2C" />
          <circle cx={cx - 1.5} cy={21} r="1.2" fill="white" opacity="0.9" />
        </g>
        {/* Eyelid (blinking) */}
        <path className={`eyelid eyelid-${idx}`} d={`M${cx - 8} 22 Q${cx} ${md.eyelidY - 2} ${cx + 8} 22`} fill={c.body} opacity="0.95" />
        {/* Eyelash line */}
        <path d={`M${cx - 7} 22 Q${cx} ${md.eyelidY - 2} ${cx + 7} 22`} stroke="#2C2C2C" strokeWidth="0.8" fill="none" opacity="0.3" />
      </g>
    );
  };

  return (
    <g>
      {/* Eyebrows */}
      <path d={md.browLeft} stroke="#2C2C2C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={md.browRight} stroke="#2C2C2C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <Eye cx={28} idx={0} />
      <Eye cx={44} idx={1} />
    </g>
  );
}

function Mouth({ mood }) {
  const md = getMoodData(mood);

  switch (md.mouthType) {
    case 'open':
      return (
        <g>
          <ellipse cx="36" cy="34" rx="5" ry="4.5" fill="#2C1810" />
          <ellipse cx="36" cy="36" rx="3.5" ry="2" fill="#FF6B8A" />
        </g>
      );
    case 'wavy':
      return <path d="M30 34 Q34 30 36 34 Q38 38 42 34" stroke="#2C2C2C" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
    case 'warm':
      return <path d="M30 34 Q36 39 42 34" stroke="#2C2C2C" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
    case 'yawn':
      return <ellipse cx="36" cy="34" rx="3.5" ry="3" fill="#2C1810" />;
    default: // smile
      return <path d="M30 33 Q36 38 42 33" stroke="#2C2C2C" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
  }
}

function Paws() {
  return (
    <g>
      {[20, 28, 36].map(x => <circle key={`lp${x}`} cx={x} cy="62" r="2.5" fill="#D4A574" opacity="0.6" />)}
      {[36, 44, 52].map(x => <circle key={`rp${x}`} cx={x} cy="62" r="2.5" fill="#D4A574" opacity="0.6" />)}
    </g>
  );
}

function Whiskers({ config }) {
  if (!config.hasWhiskers) return null;
  return (
    <g stroke="#2C2C2C" strokeWidth="0.6" opacity="0.3" fill="none" strokeLinecap="round">
      <path d="M14 28 L6 26" />
      <path d="M14 30 L6 30" />
      <path d="M14 32 L6 34" />
      <path d="M58 28 L66 26" />
      <path d="M58 30 L66 30" />
      <path d="M58 32 L66 34" />
    </g>
  );
}

function CheekFluff({ config }) {
  if (!config.hasCheekFluff) return null;
  return (
    <g fill={config.body}>
      <ellipse cx="16" cy="30" rx="4" ry="3" />
      <ellipse cx="56" cy="30" rx="4" ry="3" />
    </g>
  );
}

function getMoodAnim(mood) {
  switch (mood) {
    case 'excited': return 'animate-bounce-in animate-star-float';
    case 'celebrating': return 'animate-bounce-in';
    case 'thinking': return 'animate-think';
    case 'encouraging': return 'animate-sway';
    case 'sleepy': return '';
    default: return 'animate-float';
  }
}

export default function Mascot({ animalId = 1, mood = 'idle', size = 'md', className = '' }) {
  const config = ANIMALS[animalId] || ANIMALS[1];
  const animClass = getMoodAnim(mood);

  const sizes = { sm: 48, md: 72, lg: 120 };
  const dim = sizes[size] || sizes.md;
  const scale = dim / 72;

  return (
    <div className={`inline-flex items-center justify-center ${animClass} ${className}`} style={{ width: dim, height: dim }}>
      <svg viewBox="0 0 72 72" width={dim} height={dim} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            @keyframes mascot-blink {
              0%, 93%, 100% { transform: scaleY(1); }
              95%, 97% { transform: scaleY(0.05); }
            }
            @keyframes mascot-tail-wag {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(18deg); }
            }
            @keyframes mascot-ear-twitch {
              0%, 90%, 100% { transform: rotate(var(--ear-angle)); }
              93%, 96% { transform: rotate(calc(var(--ear-angle) - 8deg)); }
            }
            @keyframes mascot-breathe {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.015); }
            }
            @keyframes mascot-sparkle {
              0%, 100% { opacity: 0; transform: scale(0); }
              50% { opacity: 0.6; transform: scale(1); }
            }
            .eyelid-0 { animation: mascot-blink 3.5s infinite; transform-origin: 28px 22px; }
            .eyelid-1 { animation: mascot-blink 3.5s infinite 0.2s; transform-origin: 44px 22px; }
            .tail-group { animation: mascot-tail-wag 0.4s ease-in-out infinite; transform-origin: 70px 38px; }
            .ear-left { --ear-angle: -20deg; animation: mascot-ear-twitch 5s infinite; transform-origin: 16px 18px; }
            .ear-right { --ear-angle: 20deg; animation: mascot-ear-twitch 5s infinite 2.5s; transform-origin: 56px 18px; }
            .body-group { animation: mascot-breathe 3s ease-in-out infinite; transform-origin: 36px 42px; }
            .horn-group { animation: mascot-sparkle 2s ease-in-out infinite; }
          `}</style>
        </defs>
        <g transform={`scale(${scale})`}>
          {/* Tail behind body */}
          <Tail config={config} />

          {/* Mane (behind head) */}
          <Mane config={config} />

          {/* Body group with breathing */}
          <g className="body-group">
            {/* Body */}
            <ellipse cx="36" cy="42" rx="24" ry="22" fill={config.body} />
            <ellipse cx="36" cy="48" rx="16" ry="14" fill={config.belly} />

            {/* Paws */}
            <Paws />
          </g>

          {/* Arms */}
          {(mood === 'excited' || mood === 'celebrating') && (
            <>
              <path d="M12 42 Q4 30 8 24" stroke={config.body} strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M60 42 Q68 30 64 24" stroke={config.body} strokeWidth="5" fill="none" strokeLinecap="round" />
            </>
          )}
          {mood === 'encouraging' && (
            <>
              <path d="M12 44 Q6 38 10 32" stroke={config.body} strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M60 44 Q68 36 62 30" stroke={config.body} strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M58 30 L54 28 M62 30 L66 28" stroke="#2C2C2C" strokeWidth="1.5" fill="none" />
            </>
          )}

          {/* Ears */}
          <Ears config={config} mood={mood} />

          {/* Horn */}
          <Horn config={config} />

          {/* Head */}
          <circle cx="36" cy="26" r="18" fill={config.body} />

          {/* Panda eye spots */}
          {animalId === 5 && (
            <>
              <circle cx="26" cy="24" r="8" fill={config.spotColor} />
              <circle cx="46" cy="24" r="8" fill={config.spotColor} />
            </>
          )}

          {/* Whiskers */}
          <Whiskers config={config} />

          {/* Cheek fluff */}
          <CheekFluff config={config} />

          {/* Eyes */}
          <Eyes config={config} mood={mood} />

          {/* Blush */}
          {getMoodData(mood).blush && (
            <>
              <ellipse cx="20" cy="29" rx="4" ry="2.5" fill="#FFB5C2" opacity="0.45" />
              <ellipse cx="52" cy="29" rx="4" ry="2.5" fill="#FFB5C2" opacity="0.45" />
            </>
          )}

          {/* Nose */}
          <ellipse cx="36" cy="30" rx="3" ry="2" fill={config.nose} />

          {/* Mouth */}
          <Mouth mood={mood} />

          {/* Feet */}
          <ellipse cx="24" cy="60" rx="8" ry="5" fill={config.body} />
          <ellipse cx="48" cy="60" rx="8" ry="5" fill={config.body} />
        </g>
      </svg>
    </div>
  );
}
