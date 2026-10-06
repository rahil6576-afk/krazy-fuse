import React, { useState, useEffect, useRef } from 'react';
import './Cannon.css';

// Direct asset imports for 100% reliable loading across all browsers
import salmanIdleImg from '../../assets/salman_idle.jpg';
import salmanHappyImg from '../../assets/salman_happy.jpg';
import salmanAngryImg from '../../assets/salman_angry.jpg';
import hunterIdleImg from '../../assets/hunter_idle.jpg';
import hunterHappyImg from '../../assets/hunter_happy.jpg';
import hunterAngryImg from '../../assets/hunter_angry.jpg';

export function Cannon({
  cannonballs,
  aimPos,
  updateAim,
  targetColor,
  theme = 'space',
  hunterMood = 'idle',
  isFeverMode = false,
}) {
  const [isAiming, setIsAiming] = useState(false);
  const reticleRef = useRef(null);
  const shooterRef = useRef(null);
  const rafRef = useRef(null);
  const isAimingRef = useRef(false);
  const aimTimerRef = useRef(null);

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isAimingRef.current) {
        isAimingRef.current = true;
        setIsAiming(true);
      }

      if (aimTimerRef.current) clearTimeout(aimTimerRef.current);
      aimTimerRef.current = setTimeout(() => {
        isAimingRef.current = false;
        setIsAiming(false);
      }, 2000);

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          const originX = window.innerWidth / 2;
          const originY = window.innerHeight - 30;
          const targetX = clientX;
          const targetY = Math.min(originY - 30, clientY);

          const dx = targetX - originX;
          const dy = targetY - originY;
          const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

          if (reticleRef.current) {
            reticleRef.current.setAttribute('transform', `translate(${targetX}, ${targetY})`);
          }
          if (shooterRef.current) {
            shooterRef.current.style.transform = `rotate(${angleDeg}deg)`;
          }
        });
      }
    };

    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouch = (e) => {
      if (e.touches && e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleMouseLeave = () => {
      isAimingRef.current = false;
      setIsAiming(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (aimTimerRef.current) clearTimeout(aimTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const originX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const originY = typeof window !== 'undefined' ? window.innerHeight - 30 : 700;

  const targetX = aimPos?.x ?? originX;
  const targetY = Math.min(originY - 30, aimPos?.y ?? originY - 300);
  const angle = aimPos?.angle ?? 0;

  return (
    <>
      {/* Target Aim Trajectory Line & Reticle */}
      <svg className={`cannon-trajectory-svg ${isAiming ? 'is-aiming' : 'is-idle'}`} aria-hidden="true">
        {/* Aim Reticle at Cursor (◎ -> ◉) */}
        <g ref={reticleRef} transform={`translate(${targetX}, ${targetY})`} className="aim-reticle-group">
          <circle r="14" className="aim-reticle-outer" />
          <circle r="4" className="aim-reticle-dot" />
          <line x1="-18" y1="0" x2="-8" y2="0" className="aim-reticle-cross" />
          <line x1="8" y1="0" x2="18" y2="0" className="aim-reticle-cross" />
          <line x1="0" y1="-18" x2="0" y2="-8" className="aim-reticle-cross" />
          <line x1="0" y1="8" x2="0" y2="18" className="aim-reticle-cross" />
        </g>
      </svg>

      {/* =========================================================================
          THEME-SPECIFIC SHOOTERS
          ========================================================================= */}
      <div className="shooter-wrapper">
        {/* 1. Space Theme: Starfighter Spaceship */}
        {theme === 'space' && (
          <div ref={shooterRef} className="spaceship-shooter" style={{ transform: `rotate(${angle}deg)` }}>
            <div className="spaceship-wing wing-left">
              <div className="wing-blaster"></div>
            </div>
            <div className="spaceship-hull">
              <div className="spaceship-cockpit"></div>
              <div className="spaceship-nose-cannon"></div>
            </div>
            <div className="spaceship-wing wing-right">
              <div className="wing-blaster"></div>
            </div>
            <div className="spaceship-engine-glow"></div>
          </div>
        )}

        {/* 2. Slimy / Hunter Theme: Veteran Wolf-Pelt Hunter with Reaction Moods */}
        {theme === 'slimy' && (
          <div className={`veteran-hunter-wrapper mood-${hunterMood} ${isFeverMode ? 'fever-active' : ''}`}>
            {/* Dynamic Reaction Speech / Emote Bubble */}
            {hunterMood === 'happy' && (
              <div className="hunter-reaction-bubble happy-reaction">
                <span className="reaction-icon">🎯</span>
                <span className="reaction-text">BULLSEYE!</span>
                <span className="reaction-sparkle s-left">✨</span>
                <span className="reaction-sparkle s-right">✨</span>
              </div>
            )}

            {hunterMood === 'angry' && (
              <div className="hunter-reaction-bubble angry-reaction">
                <span className="reaction-icon">💢</span>
                <span className="reaction-text">MISSED!</span>
                <span className="reaction-sparkle s-left">⚡</span>
                <span className="reaction-sparkle s-right">🔥</span>
              </div>
            )}

            {/* Veteran Hunter Portrait / Bust */}
            <div className="hunter-bust-container">
              <img
                src={
                  hunterMood === 'happy' || isFeverMode
                    ? hunterHappyImg
                    : hunterMood === 'angry'
                    ? hunterAngryImg
                    : hunterIdleImg
                }
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = './hunter_idle.jpg';
                }}
                alt="Veteran Hunter"
                className="hunter-portrait-img"
              />
              <div className="hunter-bust-vignette"></div>
              <div className="hunter-cigar-smoke-node"></div>
            </div>

            {/* Aiming Double-Barrel Shotgun */}
            <div ref={shooterRef} className="veteran-shotgun-assembly" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="shotgun-barrels">
                <div className="barrel b-top"></div>
                <div className="barrel b-bottom"></div>
                <div className="barrel-muzzle"></div>
              </div>
              <div className="shotgun-receiver"></div>
              <div className="shotgun-stock"></div>
              <div className="shotgun-pump"></div>
            </div>
          </div>
        )}

        {/* 3. Dystopian Theme: Cyberpunk Railgun / Laser Turret */}
        {theme === 'dystopian' && (
          <div className="dystopian-railgun-shooter">
            <div ref={shooterRef} className="railgun-turret-barrel" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="laser-emitter-lens"></div>
              <div className="railgun-rails">
                <span className="rail r-left"></span>
                <span className="rail r-right"></span>
              </div>
              <div className="railgun-core-chamber"></div>
            </div>
            <div className="railgun-turret-base">
              <div className="turret-neon-ring"></div>
            </div>
          </div>
        )}

        {/* 4. Beach Theme: Beach Umbrella Cannon */}
        {theme === 'beach' && (
          <div className="beach-umbrella-shooter">
            <div className="umbrella-stand-base">
              <span className="tiki-badge">⛱️</span>
            </div>
            <div ref={shooterRef} className="umbrella-canopy-assembly" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="umbrella-launcher-barrel"></div>
              <div className="umbrella-canopy-striped">
                <div className="umbrella-rib s1"></div>
                <div className="umbrella-rib s2"></div>
                <div className="umbrella-rib s3"></div>
              </div>
              <div className="umbrella-tip-melon-loader">🍉</div>
            </div>
          </div>
        )}

        {/* 5. Salman Khan Theme: Bhaijaan Throwing SUVs */}
        {theme === 'salman' && (
          <div className={`salman-shooter-wrapper mood-${hunterMood} ${isFeverMode ? 'fever-active' : ''}`}>
            {/* Dynamic Reaction Bubble */}
            {hunterMood === 'happy' && (
              <div className="salman-reaction-bubble happy-reaction">
                <span className="reaction-icon">🚗</span>
                <span className="reaction-text">SWAAGAT HAI!</span>
                <span className="reaction-sparkle s-left">✨</span>
                <span className="reaction-sparkle s-right">✨</span>
              </div>
            )}

            {hunterMood === 'angry' && (
              <div className="salman-reaction-bubble angry-reaction">
                <span className="reaction-icon">💢</span>
                <span className="reaction-text">COMMITMENT!</span>
                <span className="reaction-sparkle s-left">🔥</span>
                <span className="reaction-sparkle s-right">⚡</span>
              </div>
            )}

            {/* Salman Portrait Bust */}
            <div className="salman-bust-container">
              <img
                src={
                  hunterMood === 'happy' || isFeverMode
                    ? salmanHappyImg
                    : hunterMood === 'angry'
                    ? salmanAngryImg
                    : salmanIdleImg
                }
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = './salman_idle.jpg';
                }}
                alt="Bhaijaan Salman Khan"
                className="salman-portrait-img"
              />
              <div className="salman-bust-vignette"></div>
              <div className="salman-bracelet-glow"></div>
            </div>

            {/* Aiming Car Arm Launcher */}
            <div className="salman-car-aim-assembly" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="aiming-suv-car">
                <span className="aiming-car-emoji">🚙</span>
                <div className="car-headlight-beam"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          THEME-SPECIFIC PROJECTILES
          ========================================================================= */}
      {cannonballs.map((ball) => {
        const ballTheme = ball.theme || theme || 'space';

        return (
          <div
            key={ball.id}
            className={`projectile-entity proj-${ballTheme}`}
            style={{
              left: ball.x,
              top: ball.y,
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              transform: `translate(-50%, -50%) rotate(${ball.angle || 0}deg)`,
            }}
          >
            {/* Space: Plasma Bullet */}
            {ballTheme === 'space' && (
              <div className="plasma-bullet-node">
                <div className="plasma-trail"></div>
              </div>
            )}

            {/* Slimy: Shotgun Shells / Buckshot */}
            {ballTheme === 'slimy' && (
              <div className="shotgun-bullet-node">
                <div className="shotgun-shell-casing"></div>
                <div className="shotgun-smoke-trail"></div>
              </div>
            )}

            {/* Dystopian: High-Energy Laser Beam */}
            {ballTheme === 'dystopian' && (
              <div className="laser-beam-node">
                <div className="laser-core-beam"></div>
                <div className="laser-spark-corona"></div>
              </div>
            )}

            {/* Beach: Spinning Watermelon */}
            {ballTheme === 'beach' && (
              <div className="watermelon-node">
                <div className="watermelon-skin">🍉</div>
                <div className="watermelon-splash-trail"></div>
              </div>
            )}

            {/* Salman: Flying Luxury SUV / Car */}
            {ballTheme === 'salman' && (
              <div className="flying-car-node">
                <div className="flying-car-body">🚗</div>
                <div className="car-exhaust-fire"></div>
                <div className="car-drift-sparks"></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default React.memo(Cannon);
