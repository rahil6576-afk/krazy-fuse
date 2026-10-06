import React, { memo } from 'react';
import './Stars.css';

function Stars({ theme = 'space', isFeverMode = false }) {
  return (
    <div className={`game-theme-background theme-${theme} ${isFeverMode ? 'fever-active' : ''}`} aria-hidden="true">
      {/* 1. Space Theme */}
      {theme === 'space' && (
        <>
          <div className="nebula-layer"></div>
          <div className="stars-layer-1"></div>
          <div className="stars-layer-2"></div>
          <div className="shooting-star"></div>
        </>
      )}

      {/* 2. Beach Theme - Vibrant Tropical Pirate Bay */}
      {theme === 'beach' && (
        <div className="beach-environment">
          <div className="beach-art-backdrop"></div>
          <div className="beach-sun-gleam"></div>
          <div className="beach-cloud-layer"></div>
          <div className="beach-water-shimmer"></div>
          
          {/* Animated Glistening Ocean Sparkles */}
          <div className="beach-sparkles-layer">
            <span className="b-sparkle sp1"></span>
            <span className="b-sparkle sp2"></span>
            <span className="b-sparkle sp3"></span>
            <span className="b-sparkle sp4"></span>
            <span className="b-sparkle sp5"></span>
            <span className="b-sparkle sp6"></span>
            <span className="b-sparkle sp7"></span>
            <span className="b-sparkle sp8"></span>
          </div>

          {/* Animated Flying Seagulls */}
          <div className="beach-seagulls-layer">
            <div className="seagull s1">
              <svg viewBox="0 0 24 12" className="seagull-svg">
                <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,9 Q6,3 0,6 Z" fill="rgba(255,255,255,0.9)" />
              </svg>
            </div>
            <div className="seagull s2">
              <svg viewBox="0 0 24 12" className="seagull-svg">
                <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,9 Q6,3 0,6 Z" fill="rgba(255,255,255,0.85)" />
              </svg>
            </div>
            <div className="seagull s3">
              <svg viewBox="0 0 24 12" className="seagull-svg">
                <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,9 Q6,3 0,6 Z" fill="rgba(255,255,255,0.75)" />
              </svg>
            </div>
          </div>

          <div className="beach-vignette-overlay"></div>
        </div>
      )}

      {/* 3. Dystopian Theme */}
      {theme === 'dystopian' && (
        <div className="dystopian-environment">
          {/* Animated Cyber Dystopia Dynamic GIF Backdrop */}
          <div className="dystopian-gif-backdrop"></div>
          <div className="dystopian-ambient-overlay"></div>
          <div className="toxic-rain-streaks"></div>
          <div className="dystopian-scanlines"></div>
          <div className="neon-hologram-beacon"></div>
        </div>
      )}

      {/* 4. Slimy Theme */}
      {theme === 'slimy' && (
        <div className="slimy-environment">
          {/* Animated Slime World Video Backdrop */}
          <video
            className="slime-video-backdrop"
            autoPlay
            loop
            muted
            playsInline
            src="./slime_world_animated-ezgif.com-gif-to-webm-converter.webm"
          />
          <div className="slimy-ambient-overlay"></div>
          <div className="slimy-drips-top"></div>
          
          {/* Constantly falling goopy slime streams & drops */}
          <div className="goopy-falling-slime-container">
            <span className="slime-drip d1"></span>
            <span className="slime-drip d2"></span>
            <span className="slime-drip d3"></span>
            <span className="slime-drip d4"></span>
            <span className="slime-drip d5"></span>
            <span className="slime-drip d6"></span>
            <span className="slime-drip d7"></span>
            <span className="slime-drip d8"></span>
            <span className="slime-drip d9"></span>
            <span className="slime-drip d10"></span>
          </div>

          <div className="radioactive-bubbles">
            <span className="bubble b1"></span>
            <span className="bubble b2"></span>
            <span className="bubble b3"></span>
            <span className="bubble b4"></span>
            <span className="bubble b5"></span>
            <span className="bubble b6"></span>
            <span className="bubble b7"></span>
            <span className="bubble b8"></span>
          </div>
          <div className="toxic-sludge-floor"></div>
          <div className="biohazard-ambient-glow"></div>
        </div>
      )}

      {/* 5. Salman Khan Theme: Rajasthan Desert Safari at Twilight */}
      {theme === 'salman' && (
        <div className="salman-environment">
          <div className="salman-desert-backdrop"></div>
          <div className="salman-twilight-glow"></div>
          <div className="salman-stars-twinkle"></div>
          <div className="salman-dust-haze"></div>
          <div className="salman-vignette-overlay"></div>
        </div>
      )}
    </div>
  );
}

export default memo(Stars);
