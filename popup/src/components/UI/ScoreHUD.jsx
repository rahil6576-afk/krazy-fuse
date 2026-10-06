import React, { useState, useEffect, memo } from 'react';
import { getLevelMechanic } from '../../constants/levelsData';
import './ScoreHUD.css';

function ScoreHUD({
  level = 1,
  maxLevels = 20,
  levelTitle = '',
  levelMechanic = '',
  levelProgress = 0,
  targetPopsNeeded = 3,
  score = 0,
  highScore = 0,
  lives = 3,
  lastLostHeartIndex = -1,
  targetColor = 'red',
  combo = 0,
  isFeverMode = false,
  isMuted = false,
  theme = 'space',
  onToggleSound,
  onPauseGame,
  onOpenThemes,
  onOpenScoreboard,
}) {
  const displayTarget = targetColor ? targetColor.toUpperCase() : '';
  const [animateTarget, setAnimateTarget] = useState(false);

  const displayMechanic = getLevelMechanic(level, theme) || levelMechanic || levelTitle;

  useEffect(() => {
    setAnimateTarget(true);
    const timer = setTimeout(() => setAnimateTarget(false), 400);
    return () => clearTimeout(timer);
  }, [targetColor]);

  const remainingNeeded = Math.max(0, targetPopsNeeded - levelProgress);

  const entityName = theme === 'beach' ? 'beach ball' : theme === 'slimy' ? 'slime' : theme === 'dystopian' ? 'zombie' : theme === 'salman' ? 'blackbuck' : 'asteroid';
  const entityNamePlural = theme === 'beach' ? 'beach balls' : theme === 'slimy' ? 'slimes' : theme === 'dystopian' ? 'zombies' : theme === 'salman' ? 'blackbucks' : 'asteroids';

  const targetColorHex = {
    red: '#ff3366',
    cyan: '#00f0ff',
    purple: '#c77dff',
    gold: '#ffb703',
    green: '#39ff14',
    pink: '#ff66c4',
    yellow: '#ffea00',
    blue: '#0088ff',
  }[targetColor] || '#ffffff';

  return (
    <div className="game-hud">
      <div className="hud-container">
        {/* Top-Left: Level Info, Track Bar, and Objective */}
        <div className="hud-column hud-left">
          <div className="level-header">
            <span className="level-number-text">LEVEL {level} <span className="level-max">/ {maxLevels}</span></span>
            <span className={`level-mechanic-tag theme-${theme}`}>{displayMechanic}</span>
          </div>

          {/* Mini 20-level track bar */}
          <div className="level-track-bar" title={`Level ${level} of ${maxLevels}`}>
            <div 
              className="level-track-progress" 
              style={{ width: `${(level / maxLevels) * 100}%` }}
            />
            <div 
              className="level-track-pin" 
              style={{ left: `${((level - 1) / (maxLevels - 1)) * 100}%` }}
            />
          </div>

          {/* Objective Progress Bar */}
          <div className="objective-box">
            <div className="objective-label-row">
              <span className="objective-label">OBJECTIVE</span>
              <span className="objective-count">{levelProgress} / {targetPopsNeeded}</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(100, (levelProgress / targetPopsNeeded) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top-Center: Prominent Target Badge */}
        <div className="hud-column hud-center">
          <div className={`target-spotlight-card ${animateTarget ? 'target-pulse-anim' : ''}`}>
            <span className="target-title-label">🎯 TARGET COLOR</span>
            <div className={`target-giant-badge ${targetColor} glow-${targetColor}`}>
              {theme === 'salman' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <svg 
                    viewBox="0 0 110 100" 
                    style={{ width: '42px', height: '38px', '--color-primary': targetColorHex }} 
                    aria-hidden="true"
                  >
                    {/* Leaping Blackbuck Body Silhouette */}
                    <path
                      d="M 22,62 C 26,44 42,42 58,46 C 72,50 82,42 90,32 C 94,36 96,44 92,52 C 86,60 76,64 68,68 C 54,74 38,76 28,78 C 22,76 18,70 22,62 Z"
                      fill="#271c19"
                    />
                    <path
                      d="M 30,72 C 42,70 56,66 66,62 C 60,68 48,74 34,76 Z"
                      fill="#f8fafc"
                    />
                    <path
                      d="M 82,44 C 88,38 96,30 102,32 C 105,34 104,40 98,46 C 92,50 86,48 82,44 Z"
                      fill="#1c1311"
                    />
                    <circle cx="94" cy="36" r="4.5" fill="#f8fafc" />
                    <circle cx="94.5" cy="36" r="2.5" fill="#000000" />
                    <circle cx="93.5" cy="35" r="0.8" fill="#ffffff" />
                    <path
                      d="M 85,34 Q 78,16 68,4 M 83,34 Q 74,18 64,6"
                      stroke="var(--color-primary)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      filter="drop-shadow(0 0 5px var(--color-primary))"
                    />
                    <circle cx="79" cy="24" r="2" fill="#ffffff" />
                    <circle cx="73" cy="14" r="1.8" fill="#ffffff" />
                    <circle cx="68" cy="6" r="1.5" fill="#ffffff" />
                    <path d="M 88,52 L 102,74 L 108,76" stroke="#271c19" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 82,56 L 94,80 L 100,82" stroke="#1c1311" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M 28,70 L 14,88 L 6,86" stroke="#271c19" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 34,72 L 20,92 L 12,90" stroke="#1c1311" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M 82,46 Q 84,54 88,52" stroke="var(--color-primary)" strokeWidth="3" fill="none" filter="drop-shadow(0 0 4px var(--color-primary))" />
                  </svg>
                  <span className="target-giant-text">{displayTarget}</span>
                </div>
              ) : (
                <span className="target-giant-text">{displayTarget}</span>
              )}
            </div>
            <span className="target-hint-sub">
              {remainingNeeded === 1 ? `Pop 1 more ${displayTarget} ${entityName}!` : `Pop ${remainingNeeded} more ${displayTarget} ${entityNamePlural}`}
            </span>
          </div>
        </div>

        {/* Top-Right: Score, Best, Menu & Audio Controls */}
        <div className="hud-column hud-right">
          <div className="score-high-card">
            <div className="score-block">
              <span className="hud-mini-label">SCORE</span>
              <span className="score-digits">{score.toLocaleString()}</span>
            </div>
            <div className="score-sep"></div>
            <div className="score-block">
              <span className="hud-mini-label">BEST</span>
              <span className="best-digits">{highScore.toLocaleString()}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="hud-quick-actions">
            <button 
              className="hud-action-btn theme-action-btn" 
              onClick={onOpenThemes}
              title="Change Theme (Space, Beach, Dystopian, Slimy)"
              aria-label="Change Theme"
            >
              🎨 <span className="btn-label-text">THEME</span>
            </button>

            <button 
              className="hud-action-btn" 
              onClick={onToggleSound}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              aria-label="Sound Toggle"
            >
              {isMuted ? '🔇' : '🔊'} <span className="btn-label-text">{isMuted ? 'UNMUTE' : 'MUTE'}</span>
            </button>

            <button 
              className="hud-action-btn" 
              onClick={onPauseGame}
              title="Pause Game"
              aria-label="Pause"
            >
              ⏸️ <span className="btn-label-text">PAUSE</span>
            </button>

            <button 
              className="hud-action-btn leaderboard-btn" 
              onClick={onOpenScoreboard}
              title="Hall of Fame / Leaderboard"
              aria-label="Leaderboard"
            >
              🏆 <span className="btn-label-text">RANKS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Combo / Fever Mode Badge */}
      {combo >= 2 && (
        <div className={`combo-float-pill ${isFeverMode ? 'fever-mode-active' : ''}`}>
          {isFeverMode ? (
            <div className="fever-content">
              <span className="fever-fire">🔥</span>
              <span className="fever-title">FEVER MODE 3×</span>
              <span className="fever-fire">🔥</span>
            </div>
          ) : (
            <div className="combo-content">
              <span className="combo-x">COMBO</span>
              <span className="combo-multiplier">×{combo}</span>
              <span className="combo-bonus-tag">+{combo * 50} pts</span>
            </div>
          )}
        </div>
      )}

      {/* Integrated Bottom/HUD Lives System */}
      <div className={`lives-bar-wrapper ${lives === 1 ? 'critical-danger-pulse' : ''}`}>
        <span className="lives-tag">LIVES</span>
        <div className="hearts-cluster">
          {[0, 1, 2].map((idx) => {
            const isAlive = idx < lives;
            const isCracking = idx === lastLostHeartIndex;
            return (
              <div 
                key={idx} 
                className={`heart-unit ${isAlive ? 'heart-alive' : 'heart-lost'} ${isCracking ? 'heart-shatter' : ''}`}
                title={isAlive ? 'Life active' : 'Life lost'}
              >
                <svg viewBox="0 0 24 24" className="heart-svg" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(ScoreHUD);
