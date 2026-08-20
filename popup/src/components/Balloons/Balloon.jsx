import React, { memo } from 'react';

function Balloon({ data, isTarget, theme = 'space' }) {
  // If the balloon was hit (correct or wrong), it immediately bursts and vanishes!
  if (data.isPopping) return null;

  const movementClass = `mov-${data.movementStyle || 'linear'}`;
  const themeClass = `theme-entity-${theme}`;

  return (
    <div
      className={`balloon-wrapper ${movementClass} ${isTarget ? 'is-target-balloon' : ''} ${themeClass} ${data.isPopping ? 'popping' : ''}`}
      data-id={data.id}
      data-color={data.color}
      data-is-target={isTarget ? 'true' : 'false'}
      style={{
        '--balloon-left': data.left,
        '--float-duration': data.floatDuration,
        '--float-delay': data.floatDelay,
        '--balloon-opacity': data.opacity,
        '--balloon-blur': data.blur,
        '--balloon-z': data.z,
        transform: `scale(${data.scale})`,
      }}
    >
      {/* Floating cartoon star helper above target entities for children */}
      {isTarget && (
        <div className="child-target-indicator" aria-hidden="true">
          ⭐
        </div>
      )}
      {/* 1. BEACH THEME: 3D Striped Beach Balls */}
      {theme === 'beach' && (
        <div
          className={`beach-ball ${data.color} ${data.isPopping ? 'popping' : ''} ${isTarget ? 'target-glow' : ''}`}
          style={{
            '--sway-duration': data.swayDuration,
            '--sway-delay': data.swayDelay,
          }}
        >
          <div className="beach-ball-inner">
            <svg viewBox="0 0 100 100" className="entity-svg beach-ball-svg" aria-hidden="true">
              <defs>
                <radialGradient id={`beachBallShade-${data.id}`} cx="32%" cy="28%" r="68%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="55%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                </radialGradient>
                <linearGradient id={`beachWhite-${data.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e9ecef" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="var(--color-primary, #ff3366)" />
              <path
                d="M 50 2 C 28 2 12 22 12 50 C 12 78 28 98 50 98 C 36 82 26 62 26 50 C 26 38 36 18 50 2 Z"
                fill={`url(#beachWhite-${data.id})`}
              />
              <path
                d="M 50 2 C 36 18 26 38 26 50 C 26 62 36 82 50 98 C 64 82 74 62 74 50 C 74 38 64 18 50 2 Z"
                fill="var(--color-primary, #ff3366)"
              />
              <path
                d="M 50 2 C 64 18 74 38 74 50 C 74 62 64 82 50 98 C 72 98 88 78 88 50 C 88 22 72 2 50 2 Z"
                fill={`url(#beachWhite-${data.id})`}
              />
              <circle cx="50" cy="4" r="5" fill="#ffffff" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              <circle cx="50" cy="96" r="5" fill="#ffffff" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              <circle cx="50" cy="50" r="48" fill={`url(#beachBallShade-${data.id})`} />
              <ellipse cx="36" cy="24" rx="14" ry="6.5" transform="rotate(-32 36 24)" fill="#ffffff" fillOpacity="0.55" />
            </svg>
          </div>
        </div>
      )}

      {/* 2. SPACE THEME: Glowing Cosmic Asteroids (No box outlines) */}
      {theme === 'space' && (
        <div
          className={`space-asteroid ${data.color} ${data.isPopping ? 'popping' : ''} ${isTarget ? 'target-glow' : ''}`}
          style={{
            '--sway-duration': data.swayDuration,
            '--sway-delay': data.swayDelay,
          }}
        >
          <div className="asteroid-inner">
            <svg viewBox="0 0 100 100" className="entity-svg asteroid-svg" aria-hidden="true">
              <defs>
                <radialGradient id={`asteroidRock-${data.id}`} cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#4a445d" />
                  <stop offset="50%" stopColor="#252033" />
                  <stop offset="100%" stopColor="#110d1c" />
                </radialGradient>
                <radialGradient id={`crystalCore-${data.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="var(--color-primary, #00f0ff)" />
                  <stop offset="100%" stopColor="var(--color-primary, #00f0ff)" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* Jagged Faceted Asteroid Body */}
              <path
                d="M 50,5 C 72,7 90,20 95,44 C 98,62 90,82 76,93 C 58,100 34,97 16,84 C 4,70 2,48 8,28 C 15,12 32,3 50,5 Z"
                fill={`url(#asteroidRock-${data.id})`}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.5"
              />

              {/* Luminous Crystal Vein Fissures (Target Color) */}
              <path
                d="M 46,18 Q 58,32 50,48 T 68,76 M 28,42 Q 44,52 38,72"
                stroke="var(--color-primary, #00f0ff)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                filter={`drop-shadow(0 0 6px var(--color-primary, #00f0ff))`}
              />

              {/* Large Crater with Glowing Geode Core */}
              <ellipse cx="64" cy="38" rx="12" ry="9" fill="#181424" stroke="#4a445d" strokeWidth="1.5" />
              <circle cx="63" cy="38" r="5.5" fill={`url(#crystalCore-${data.id})`} filter={`drop-shadow(0 0 5px var(--color-primary, #00f0ff))`} />

              {/* Small Deep Craters */}
              <ellipse cx="32" cy="62" rx="9" ry="7" fill="#141120" stroke="#3b354c" strokeWidth="1.2" />
              <circle cx="32" cy="62" r="3" fill="var(--color-primary, #00f0ff)" fillOpacity="0.8" />

              <ellipse cx="38" cy="26" rx="6" ry="4.5" fill="#141120" stroke="#3b354c" strokeWidth="1" />
              <ellipse cx="74" cy="68" rx="7" ry="5" fill="#141120" stroke="#3b354c" strokeWidth="1" />

              {/* Rocky Specular Highlights */}
              <path d="M 44,8 Q 62,12 78,24" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
              <circle cx="20" cy="32" r="2" fill="#ffffff" opacity="0.7" />
            </svg>
          </div>
        </div>
      )}

      {/* 3. SLIMY THEME: Melting Cyclops Slime Monster with Gooey Reaching Arms & Teeth */}
      {theme === 'slimy' && (
        <div
          className={`slime-monster ${data.color} ${data.isPopping ? 'popping' : ''} ${isTarget ? 'target-glow' : ''}`}
          style={{
            '--sway-duration': data.swayDuration,
            '--sway-delay': data.swayDelay,
          }}
        >
          <div className="slime-inner">
            <svg viewBox="0 0 110 110" className="entity-svg slime-svg" aria-hidden="true">
              <defs>
                <radialGradient id={`slimeGooMountain-${data.id}`} cx="48%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                  <stop offset="35%" stopColor="var(--color-primary, #39ff14)" />
                  <stop offset="85%" stopColor="var(--color-primary-dark, #007200)" />
                  <stop offset="100%" stopColor="#051f05" />
                </radialGradient>
              </defs>

              {/* Melting Slime Base Puddle */}
              <path
                d="M 6,92 C 16,84 28,94 44,90 C 62,94 80,86 96,90 C 106,94 104,98 88,100 C 60,102 32,102 10,98 C 4,96 2,94 6,92 Z"
                fill="var(--color-primary-dark, #007200)"
                opacity="0.8"
              />

              {/* Main Mountain Melting Body with Left & Right Reaching Arms */}
              <path
                d="M 58,18 
                   C 66,24 74,38 82,46 
                   C 88,48 98,46 94,54 
                   C 90,62 82,60 76,64 
                   C 82,72 90,82 86,88 
                   C 80,94 64,88 52,90 
                   C 40,88 24,94 18,88 
                   C 14,84 22,74 24,66 
                   C 18,60 10,48 20,24 
                   C 24,14 30,12 32,20 
                   C 34,28 32,38 38,44 
                   C 44,30 48,12 58,18 Z"
                fill={`url(#slimeGooMountain-${data.id})`}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Dripping Goo Droplets */}
              <circle cx="16" cy="38" r="2.5" fill="var(--color-primary, #39ff14)" />
              <circle cx="94" cy="62" r="2.5" fill="var(--color-primary, #39ff14)" />
              <ellipse cx="12" cy="94" rx="4" ry="2" fill="var(--color-primary, #39ff14)" />

              {/* Giant Central Cyclops Eyeball */}
              <ellipse cx="53" cy="36" rx="10.5" ry="13.5" fill="#fefae0" stroke="#0f290f" strokeWidth="2" />
              <ellipse cx="54" cy="37" rx="5.5" ry="7" fill="#1b263b" />
              <circle cx="51" cy="33" r="2.8" fill="#ffffff" />
              <circle cx="56" cy="40" r="1.4" fill="#ffffff" />

              {/* Wide Gaping Screaming Mouth */}
              <path
                d="M 42,52 Q 54,48 64,52 Q 68,66 62,76 Q 52,82 42,74 Q 38,64 42,52 Z"
                fill="#0a180a"
                stroke="#0f290f"
                strokeWidth="2"
              />
              {/* Top Silly Monster Teeth */}
              <rect x="47" y="52" width="4.5" height="5.5" rx="1.5" fill="#ffffff" stroke="#0a180a" strokeWidth="0.8" />
              <rect x="54" y="52" width="4" height="6.5" rx="1.5" fill="#ffffff" stroke="#0a180a" strokeWidth="0.8" />
              {/* Bottom Silly Monster Tooth */}
              <rect x="51" y="70" width="4.5" height="5" rx="1.5" fill="#ffffff" stroke="#0a180a" strokeWidth="0.8" />

              {/* Glossy Liquid Sheen Arcs */}
              <path d="M 54,20 Q 62,26 68,34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65" />
              <path d="M 23,22 Q 22,30 26,38" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
              <ellipse cx="72" cy="84" rx="8" ry="3" fill="#ffffff" fillOpacity="0.45" />
            </svg>
          </div>
        </div>
      )}

      {/* 4. DYSTOPIAN THEME: Cyber Zombies with Neon Implants (No box outlines) */}
      {theme === 'dystopian' && (
        <div
          className={`cyber-zombie ${data.color} ${data.isPopping ? 'popping' : ''} ${isTarget ? 'target-glow' : ''}`}
          style={{
            '--sway-duration': data.swayDuration,
            '--sway-delay': data.swayDelay,
          }}
        >
          <div className="zombie-inner">
            <svg viewBox="0 0 100 100" className="entity-svg zombie-svg" aria-hidden="true">
              <defs>
                <linearGradient id={`zombieHead-${data.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="60%" stopColor="#1f2937" />
                  <stop offset="100%" stopColor="#111827" />
                </linearGradient>
              </defs>

              {/* Cyborg Skull / Head Base */}
              <path
                d="M 50,8 C 74,8 86,24 86,50 C 86,66 78,80 72,90 C 62,94 38,94 28,90 C 22,80 14,66 14,50 C 14,24 26,8 50,8 Z"
                fill={`url(#zombieHead-${data.id})`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />

              {/* Cybernetic Ocular Targeting Eye (Left) */}
              <circle cx="35" cy="42" r="10" fill="#0f172a" stroke="var(--color-primary, #ff007f)" strokeWidth="2" />
              <circle cx="35" cy="42" r="5.5" fill="var(--color-primary, #ff007f)" filter={`drop-shadow(0 0 6px var(--color-primary, #ff007f))`}>
                <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <line x1="22" y1="42" x2="48" y2="42" stroke="var(--color-primary, #ff007f)" strokeWidth="1" strokeDasharray="1 2" />
              <line x1="35" y1="29" x2="35" y2="55" stroke="var(--color-primary, #ff007f)" strokeWidth="1" strokeDasharray="1 2" />

              {/* Hollow Sunken Undead Eye (Right) */}
              <ellipse cx="65" cy="42" rx="8" ry="7" fill="#0b0f19" stroke="#4b5563" strokeWidth="1.5" />
              <circle cx="65" cy="42" r="2" fill="var(--color-primary, #ff007f)" opacity="0.9" filter={`drop-shadow(0 0 3px var(--color-primary, #ff007f))`} />

              {/* Metallic Cyber Rebreather / Jaw Mask */}
              <path d="M 28,68 L 50,60 L 72,68 L 68,90 L 32,90 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <rect x="38" y="70" width="24" height="12" rx="3" fill="#0f172a" stroke="var(--color-primary, #ff007f)" strokeWidth="1.2" />
              <line x1="44" y1="70" x2="44" y2="82" stroke="var(--color-primary, #ff007f)" strokeWidth="1.5" />
              <line x1="50" y1="70" x2="50" y2="82" stroke="var(--color-primary, #ff007f)" strokeWidth="1.5" />
              <line x1="56" y1="70" x2="56" y2="82" stroke="var(--color-primary, #ff007f)" strokeWidth="1.5" />

              {/* Glowing Neural Wiring Cables into Skull */}
              <path d="M 50,8 Q 56,22 76,28" stroke="var(--color-primary, #ff007f)" strokeWidth="2.5" fill="none" filter={`drop-shadow(0 0 4px var(--color-primary, #ff007f))`} />
              <path d="M 50,8 Q 42,20 22,26" stroke="var(--color-primary, #ff007f)" strokeWidth="2.5" fill="none" filter={`drop-shadow(0 0 4px var(--color-primary, #ff007f))`} />
            </svg>
          </div>
        </div>
      )}

      {/* 5. SALMAN KHAN THEME: Majestic Leaping Blackbuck Deer */}
      {theme === 'salman' && (
        <div
          className={`blackbuck-deer ${data.color} ${data.isPopping ? 'popping' : ''} ${isTarget ? 'target-glow' : ''}`}
          style={{
            '--sway-duration': data.swayDuration,
            '--sway-delay': data.swayDelay,
          }}
        >
          <div className="blackbuck-inner">
            <svg viewBox="0 0 110 100" className="entity-svg blackbuck-svg" aria-hidden="true">
              {/* Leaping Blackbuck Body Silhouette */}
              {/* Dark Coat Back & Flanks */}
              <path
                d="M 22,62 C 26,44 42,42 58,46 C 72,50 82,42 90,32 C 94,36 96,44 92,52 C 86,60 76,64 68,68 C 54,74 38,76 28,78 C 22,76 18,70 22,62 Z"
                fill="#271c19"
              />

              {/* White Belly & Eye Patch */}
              <path
                d="M 30,72 C 42,70 56,66 66,62 C 60,68 48,74 34,76 Z"
                fill="#f8fafc"
              />

              {/* Blackbuck Head & Snout */}
              <path
                d="M 82,44 C 88,38 96,30 102,32 C 105,34 104,40 98,46 C 92,50 86,48 82,44 Z"
                fill="#1c1311"
              />
              <circle cx="94" cy="36" r="4.5" fill="#f8fafc" />
              <circle cx="94.5" cy="36" r="2.5" fill="#000000" />
              <circle cx="93.5" cy="35" r="0.8" fill="#ffffff" />

              {/* Long Twisted Spiral Horns (Glowing in Target Color!) */}
              <path
                d="M 85,34 Q 78,16 68,4 M 83,34 Q 74,18 64,6"
                stroke="var(--color-primary, #f59e0b)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                filter={`drop-shadow(0 0 6px var(--color-primary, #f59e0b))` }
              />
              {/* Horn Spiral Ring Ridges */}
              <circle cx="79" cy="24" r="2" fill="#ffffff" />
              <circle cx="73" cy="14" r="1.8" fill="#ffffff" />
              <circle cx="68" cy="6" r="1.5" fill="#ffffff" />

              {/* Graceful Leaping Front Legs */}
              <path d="M 88,52 L 102,74 L 108,76" stroke="#271c19" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 82,56 L 94,80 L 100,82" stroke="#1c1311" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Leaping Hind Legs */}
              <path d="M 28,70 L 14,88 L 6,86" stroke="#271c19" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 34,72 L 20,92 L 12,90" stroke="#1c1311" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Radiant Collar Glow in Target Color */}
              <path d="M 82,46 Q 84,54 88,52" stroke="var(--color-primary, #f59e0b)" strokeWidth="3" fill="none" filter="drop-shadow(0 0 5px var(--color-primary, #f59e0b))" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Balloon);
