import React, { useState } from 'react';
import './Modals.css';

export function StartScreenModal({ onStart, onOpenScoreboard, onOpenThemes, playerName, setPlayerName, currentTheme = 'space' }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [name, setName] = useState(() => {
    try {
      return playerName || localStorage.getItem('float_player_name') || 'Player';
    } catch {
      return 'Player';
    }
  });
  const [error, setError] = useState('');
  
  const lastUsedName = (() => {
    try {
      return localStorage.getItem('float_player_name') || '';
    } catch {
      return '';
    }
  })();

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setError('');
    if (setPlayerName) {
      setPlayerName(val);
    }
  };

  const handleStart = () => {
    const trimmedName = name.trim() || 'Player';
    try {
      localStorage.setItem('float_player_name', trimmedName);
    } catch {}
    
    onStart(trimmedName);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card start-card">
        <div className="start-logo-wrap">
          <div className="start-balloon-badge">🎈</div>
          <h1 className="game-main-title">POP RUSH</h1>
          <p className="game-main-tagline">Match the target. Pop fast. Don't miss.</p>
        </div>

        {showHowToPlay ? (
          <div className="how-to-play-card">
            <h3 className="how-to-title">🎯 HOW TO PLAY</h3>
            <ul className="rules-list">
              <li>Aim your cannon with <strong>Mouse or Touch</strong> & click/tap to shoot.</li>
              <li>Pop only the <strong>TARGET COLOR</strong> shown in the top HUD.</li>
              <li>Popping wrong balloons costs <strong>1 Life</strong> (3 strikes = Level Failed!).</li>
              <li>Consecutive correct hits build <strong>COMBO MULTIPLIERS</strong>.</li>
              <li>Hit a 5× combo to unleash <strong>🔥 FEVER MODE 3×</strong>!</li>
              <li>Conquer all <strong>20 Levels</strong> to become the Grand Champion!</li>
            </ul>
            <button className="modal-secondary-btn" onClick={() => setShowHowToPlay(false)}>
              Back to Menu
            </button>
          </div>
        ) : (
          <div className="modal-button-group">
            {/* Button above Play Game: 'Add name here' */}
            <div className="name-button-wrapper">
              <span className="name-button-icon">👤</span>
              <input
                type="text"
                className="name-input-button"
                placeholder={lastUsedName ? `Previously: ${lastUsedName}` : "Add name here"}
                value={name}
                onChange={handleNameChange}
                maxLength={15}
                aria-label="Add name here"
              />
            </div>
            {error && <div className="name-error-msg" style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</div>}

            <button 
              className="modal-primary-btn play-btn" 
              onClick={handleStart}
            >
              ▶ PLAY GAME
            </button>

            <button className="modal-secondary-btn theme-toggle-btn" onClick={onOpenThemes}>
              🎨 Themes: <span className="theme-name-tag">{currentTheme.toUpperCase()}</span>
            </button>

            <button className="modal-secondary-btn" onClick={() => setShowHowToPlay(true)}>
              📖 How to Play
            </button>
            <button className="modal-secondary-btn" onClick={onOpenScoreboard}>
              🏆 Hall of Fame
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ThemeSelectorModal({ currentTheme = 'space', onSelectTheme, onClose }) {
  const themes = [
    {
      id: 'space',
      name: 'Space',
      icon: '🌌',
      tagline: 'Deep Cosmos & Twinkling Stars',
      color: '#00b4d8',
      previewGradient: 'radial-gradient(circle, #171a42 0%, #0c0e28 100%)',
    },
    {
      id: 'beach',
      name: 'Beach',
      icon: '🏝️',
      tagline: 'Tropical Pirate Island & Azure Waters',
      color: '#00d2ff',
      previewGradient: 'linear-gradient(135deg, #0096c7 0%, #00b4d8 45%, #ffd166 100%)',
    },
    {
      id: 'dystopian',
      name: 'Dystopian',
      icon: '🏙️',
      tagline: 'Cyberpunk Skyline & Toxic Smog',
      color: '#ff007f',
      previewGradient: 'radial-gradient(circle, #200a2b 0%, #0d0414 70%, #050208 100%)',
    },
    {
      id: 'slimy',
      name: 'Slimy',
      icon: '🧪',
      tagline: 'Radioactive Cavern & Acid Bubbles',
      color: '#39ff14',
      previewGradient: 'radial-gradient(circle, #082915 0%, #03140a 80%)',
    },
    {
      id: 'salman',
      name: 'Bhaijaan',
      icon: '🚗',
      tagline: 'Salman throwing cars at blackbucks',
      color: '#f59e0b',
      previewGradient: 'linear-gradient(135deg, #18181b 0%, #78350f 50%, #d97706 100%)',
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card themes-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="scoreboard-header">
          <div className="header-left">
            <span className="trophy-icon">🎨</span>
            <h2 className="modal-title">CHOOSE THEME</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="modal-subtitle">Pick an immersive visual aesthetic</p>

        <div className="themes-grid">
          {themes.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                className={`theme-card-option ${isSelected ? 'theme-selected' : ''}`}
                onClick={() => {
                  onSelectTheme(t.id);
                }}
                style={{
                  background: t.previewGradient,
                  borderColor: isSelected ? t.color : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isSelected ? `0 0 24px ${t.color}` : 'none',
                }}
              >
                <div className="theme-card-icon">{t.icon}</div>
                <div className="theme-card-info">
                  <div className="theme-card-title-row">
                    <span className="theme-card-name" style={{ color: isSelected ? t.color : '#fff' }}>
                      {t.name}
                    </span>
                    {isSelected && <span className="theme-active-pill">ACTIVE</span>}
                  </div>
                  <span className="theme-card-desc">{t.tagline}</span>
                </div>
              </button>
            );
          })}
        </div>

        <button className="modal-primary-btn" onClick={onClose} style={{ marginTop: '16px' }}>
          Done
        </button>
      </div>
    </div>
  );
}

export function CountdownOverlay({ count }) {
  if (!count) return null;

  return (
    <div className="countdown-backdrop" aria-hidden="true">
      <div className={`countdown-number ${count === 'GO!' ? 'countdown-go' : ''}`} key={count}>
        {count}
      </div>
    </div>
  );
}

export function PauseModal({ onResume, onRestart, isMuted, onToggleSound, onOpenScoreboard, onOpenThemes, currentTheme = 'space' }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card pause-card">
        <h2 className="modal-title">⏸️ GAME PAUSED</h2>
        <p className="modal-subtitle">Take a breather, Champion</p>

        <div className="modal-button-group">
          <button className="modal-primary-btn" onClick={onResume}>
            ▶ Resume Game
          </button>
          <button className="modal-secondary-btn theme-toggle-btn" onClick={onOpenThemes}>
            🎨 Themes: <span className="theme-name-tag">{currentTheme.toUpperCase()}</span>
          </button>
          <button className="modal-secondary-btn" onClick={onToggleSound}>
            {isMuted ? '🔊 Unmute Sound' : '🔇 Mute Sound'}
          </button>
          <button className="modal-secondary-btn" onClick={onOpenScoreboard}>
            🏆 View Scoreboard
          </button>
          <button className="modal-secondary-btn" onClick={onRestart}>
            🔄 Restart from Level 1
          </button>
        </div>
      </div>
    </div>
  );
}

export function LevelCompleteModal({ level, levelTitle, bonusPoints, score, maxCombo, accuracy, onNextLevel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card victory-card">
        <div className="modal-icon-badge glow-gold">🎉</div>
        <h2 className="modal-title">LEVEL {level} CLEARED!</h2>
        <p className="modal-subtitle">{levelTitle}</p>

        <div className="modal-stats-grid">
          <div className="stat-box">
            <span className="stat-label">LEVEL BONUS</span>
            <span className="stat-val text-gold">+{bonusPoints}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">TOTAL SCORE</span>
            <span className="stat-val text-cyan">{score.toLocaleString()}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">ACCURACY</span>
            <span className="stat-val text-green">{accuracy || 100}%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">BEST COMBO</span>
            <span className="stat-val text-gold">{maxCombo > 1 ? `×${maxCombo}` : '×1'}</span>
          </div>
        </div>

        <button className="modal-primary-btn" onClick={onNextLevel}>
          NEXT LEVEL (LEVEL {level + 1}/20) ➔
        </button>
      </div>
    </div>
  );
}

export function GameOverModal({ level, score, maxCombo, accuracy, playerName, onRetry, onRestart, onOpenScoreboard }) {
  const displayName = playerName?.trim() || localStorage.getItem('float_player_name')?.trim() || 'Player';

  return (
    <div className="modal-backdrop">
      <div className="modal-card failure-card">
        <div className="modal-icon-badge glow-red">💔</div>
        <h2 className="modal-title text-red">LEVEL {level} FAILED</h2>
        <p className="modal-subtitle">You lost all 3 lives by popping wrong balloons!</p>

        <div className="modal-stats-grid">
          <div className="stat-box">
            <span className="stat-label">FINAL SCORE</span>
            <span className="stat-val text-gold">{score.toLocaleString()}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">LEVEL REACHED</span>
            <span className="stat-val text-cyan">{level} / 20</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">ACCURACY</span>
            <span className="stat-val text-green">{accuracy || 0}%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">BEST COMBO</span>
            <span className="stat-val text-gold">{maxCombo > 1 ? `×${maxCombo}` : '×1'}</span>
          </div>
        </div>

        {/* Automatic score saving notification */}
        <div className="score-auto-saved-badge">
          <span className="save-icon-circle">✓</span>
          <span>Score automatically saved for <strong>{displayName}</strong> in Hall of Fame!</span>
        </div>

        <div className="modal-button-group">
          <button className="modal-primary-btn retry-btn" onClick={onRetry}>
            🔄 Retry Level {level}
          </button>
          <button className="modal-secondary-btn" onClick={onRestart}>
            Restart Game
          </button>
          <button className="modal-secondary-btn" onClick={onOpenScoreboard}>
            🏆 Hall of Fame
          </button>
        </div>
      </div>
    </div>
  );
}

export function VictoryModal({ score, maxCombo, accuracy, playerName, onRestart, onOpenScoreboard }) {
  const displayName = playerName?.trim() || localStorage.getItem('float_player_name')?.trim() || 'GrandMaster';

  return (
    <div className="modal-backdrop">
      <div className="modal-card victory-card grand-champion">
        <div className="modal-icon-badge glow-gold">🏆</div>
        <h2 className="modal-title text-gold">GRAND CHAMPION!</h2>
        <p className="modal-subtitle">You conquered all 20 levels of POP RUSH!</p>

        <div className="modal-stats-grid">
          <div className="stat-box">
            <span className="stat-label">FINAL SCORE</span>
            <span className="stat-val text-gold">{score.toLocaleString()}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">ALL LEVELS</span>
            <span className="stat-val text-green">20 / 20 ✓</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">ACCURACY</span>
            <span className="stat-val text-green">{accuracy || 100}%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">MAX COMBO</span>
            <span className="stat-val text-gold">×{maxCombo || 1}</span>
          </div>
        </div>

        {/* Automatic victory score saving notification */}
        <div className="score-auto-saved-badge victory-saved">
          <span className="save-icon-circle gold">🏆</span>
          <span>Grand Champion score recorded for <strong>{displayName}</strong>!</span>
        </div>

        <div className="modal-button-group">
          <button className="modal-primary-btn" onClick={onRestart}>
            🌟 Play Again
          </button>
          <button className="modal-secondary-btn" onClick={onOpenScoreboard}>
            🏆 View Hall of Fame
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScoreboardModal({ scoreboard, onClose, onClear }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card scoreboard-card" onClick={(e) => e.stopPropagation()}>
        <div className="scoreboard-header">
          <div className="header-left">
            <span className="trophy-icon">🏆</span>
            <h2 className="modal-title">HALL OF FAME</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="scoreboard-table-container">
          <table className="scoreboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>PLAYER</th>
                <th>SCORE</th>
                <th>LEVEL</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {scoreboard && scoreboard.length > 0 ? (
                scoreboard.map((item, idx) => (
                  <tr key={item.id || idx} className={idx === 0 ? 'top-rank' : ''}>
                    <td className="rank-cell">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </td>
                    <td className="player-cell">{item.name}</td>
                    <td className="score-cell">{item.score.toLocaleString()}</td>
                    <td className="level-cell">Lvl {item.level}</td>
                    <td className="date-cell">{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-scoreboard">
                    No high scores yet. Pop target balloons to claim your rank!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="scoreboard-actions">
          {scoreboard && scoreboard.length > 0 && (
            <button className="clear-btn" onClick={onClear}>
              Clear History
            </button>
          )}
          <button className="modal-primary-btn" onClick={onClose}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}


