import React, { memo } from 'react';
import './Effects.css';

function PopEffects({ particles, popTexts, poopedBalls = [] }) {
  return (
    <>
      {/* Render Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`pop-particle ${p.theme ? 'particle-theme-' + p.theme : ''}`}
          style={{
            top: p.y,
            left: p.x,
            '--tx': p.tx,
            '--ty': p.ty,
            '--size': p.size,
            '--particle-color': p.color,
            '--rot': p.rot || '0deg',
            '--start-rot': p.startRot || '0deg',
          }}
        />
      ))}

      {/* Render Pop Texts */}
      {popTexts.map((t) => (
        <div
          key={t.id}
          className={`popup-text ${t.type || ''}`}
          style={{
            top: t.y,
            left: t.x,
            color: t.color || '#ffffff',
          }}
        >
          {t.text}
        </div>
      ))}

      {/* Render Pooped/Falling Beach Balls */}
      {poopedBalls && poopedBalls.map((b) => (
        <div
          key={b.id}
          className="pooped-ball"
          style={{
            position: 'absolute',
            top: b.y,
            left: b.x,
            width: '40px',
            height: '40px',
            transform: `translate(-50%, -50%) scale(${b.scale}) rotate(${b.angle}deg)`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div className={`beach-ball ${b.color}`} style={{ width: '100%', height: '100%', borderRadius: '50%', boxShadow: 'none' }}>
            <div className="beach-ball-inner">
              <svg viewBox="0 0 100 100" className="entity-svg beach-ball-svg" aria-hidden="true">
                <defs>
                  <radialGradient id={`poopedShade-${b.id}`} cx="32%" cy="28%" r="68%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="55%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                  </radialGradient>
                  <linearGradient id={`poopedWhite-${b.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e9ecef" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="var(--color-primary, #ff3366)" />
                <path
                  d="M 50 2 C 28 2 12 22 12 50 C 12 78 28 98 50 98 C 36 82 26 62 26 50 C 26 38 36 18 50 2 Z"
                  fill={`url(#poopedWhite-${b.id})`}
                />
                <path
                  d="M 50 2 C 36 18 26 38 26 50 C 26 62 36 82 50 98 C 64 82 74 62 74 50 C 74 38 64 18 50 2 Z"
                  fill="var(--color-primary, #ff3366)"
                />
                <path
                  d="M 50 2 C 64 18 74 38 74 50 C 74 62 64 82 50 98 C 72 98 88 78 88 50 C 88 22 72 2 50 2 Z"
                  fill={`url(#poopedWhite-${b.id})`}
                />
                <circle cx="50" cy="4" r="5" fill="#ffffff" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                <circle cx="50" cy="96" r="5" fill="#ffffff" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                <circle cx="50" cy="50" r="48" fill={`url(#poopedShade-${b.id})`} />
                <ellipse cx="36" cy="24" rx="14" ry="6.5" transform="rotate(-32 36 24)" fill="#ffffff" fillOpacity="0.55" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default memo(PopEffects);
