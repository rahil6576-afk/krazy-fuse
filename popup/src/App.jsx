import React, { useState, useEffect, useCallback, useRef } from 'react';
import Stars from './components/Background/Stars';
import ScoreHUD from './components/UI/ScoreHUD';
import BalloonStream from './components/Balloons/BalloonStream';
import PopEffects from './components/Effects/PopEffects';
import Cannon from './components/Cannon/Cannon';
import {
  StartScreenModal,
  ThemeSelectorModal,
  CountdownOverlay,
  LevelCompleteModal,
  GameOverModal,
  VictoryModal,
  ScoreboardModal,
} from './components/UI/Modals';
import { useBalloonGame } from './hooks/useBalloonGame';
import './styles/global.css';

export default function App() {
  const {
    gameState,
    setGameState,
    level,
    maxLevels,
    currentLevelConfig,
    score,
    highScore,
    lives,
    lastLostHeartIndex,
    levelProgress,
    targetPopsNeeded,
    targetColor,
    balloons,
    particles,
    popTexts,
    poopedBalls,
    cannonballs,
    aimPos,
    scoreboard,
    isScoreboardOpen,
    setIsScoreboardOpen,
    isMuted,
    toggleSound,
    combo,
    maxCombo,
    isFeverMode,
    countdown,
    accuracy,
    screenShake,
    wrongFlash,
    hunterMood,
    updateAim,
    fireCannonball,
    startGame,
    nextLevel,
    retryLevel,
    restartGame,
    playerName,
    setPlayerName,
    theme,
    setTheme,
    isThemesOpen,
    setIsThemesOpen,
    saveScoreToScoreboard,
    clearScoreboard,
    swagatActive,
  } = useBalloonGame();

  const [resumeCountdown, setResumeCountdown] = useState(null);
  const countdownTimerRef = useRef(null);

  const playCountdownAudio = useCallback((freq = 440, type = 'sine', duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window.__cdAudioCtxPopup) window.__cdAudioCtxPopup = new AudioCtx();
      const ctx = window.__cdAudioCtxPopup;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }, []);

  const handlePauseGame = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setResumeCountdown(null);
    setGameState('paused');
    document.body.classList.add('portal-paused');
  }, [setGameState]);

  const handleResumeGame = useCallback(() => {
    document.body.classList.remove('portal-paused');
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
      if (req) req.call(docEl).catch(() => {});
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    let count = 3;
    setResumeCountdown(3);
    playCountdownAudio(440, 'sine', 0.18);

    countdownTimerRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setResumeCountdown(count);
        playCountdownAudio(count === 2 ? 554 : 659, 'sine', 0.18);
      } else if (count === 0) {
        setResumeCountdown('GO!');
        playCountdownAudio(880, 'triangle', 0.3);
      } else {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        setResumeCountdown(null);
        setGameState('playing');
      }
    }, 1000);
  }, [playCountdownAudio, setGameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        if (gameState === 'playing') {
          handlePauseGame();
        } else if (gameState === 'paused') {
          handleResumeGame();
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (gameState === 'playing') {
          handlePauseGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [gameState, handlePauseGame, handleResumeGame]);

  const handleShoot = useCallback((e) => {
    if (
      gameState !== 'playing' ||
      e.target.closest('.modal-card') ||
      e.target.closest('.hud-action-btn') ||
      e.target.closest('button') ||
      e.target.closest('input')
    ) {
      return;
    }

    if (e.type === 'touchstart') {
      if (e.touches && e.touches.length > 0) {
        fireCannonball(e.touches[0].clientX, e.touches[0].clientY);
      }
    } else {
      fireCannonball(e.clientX, e.clientY);
    }
  }, [gameState, fireCannonball]);

  useEffect(() => {
    window.addEventListener('click', handleShoot);
    window.addEventListener('touchstart', handleShoot, { passive: true });
    return () => {
      window.removeEventListener('click', handleShoot);
      window.removeEventListener('touchstart', handleShoot);
    };
  }, [handleShoot]);

  return (
    <div id="game-view-wrapper">
      {/* Topbar for Paused Portal Mode */}
      <header id="portal-paused-topbar" className="portal-topbar">
        <div className="portal-nav-left">
          <a className="portal-brand" href="../index.html" title="Krazy Fuse Arcade Portal">
            <span className="portal-brand-icon">⚡</span>
            <span><b>KRAZY FUSE</b><small>ARCADE PORTAL</small></span>
          </a>
          <div className="portal-search-box">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search 250+ free arcade games..." readOnly onClick={() => { window.location.href = '../index.html'; }} />
          </div>
        </div>

        <div className="portal-nav-pills">
          <a href="../index.html" className="nav-pill active">🔥 HOT</a>
          <a href="../dart-board/index.html" className="nav-pill">🎯 2-PLAYER</a>
          <a href="../office-escape/index.html" className="nav-pill">🏃 RUNNER</a>
          <a href="../flappy-man/index.html" className="nav-pill">🦸 SUPERHERO</a>
          <a href="../wild-swings/index.html" className="nav-pill">🕸️ ACTION</a>
          <a href="../bomb-panic/index.html" className="nav-pill">💣 PARTY</a>
        </div>

        <div className="portal-nav-right">
          <div className="portal-bank-badge">🪙 76 P</div>
          <button className="portal-resume-btn" onClick={handleResumeGame}>
            <span>▶️ RESUME (ESC)</span>
          </button>
        </div>
      </header>

      <div id="portal-paused-body" className="portal-layout-body">
        {/* Left Sidebar Navigation */}
        <aside className="portal-sidebar">
          <a href="../index.html" className="side-btn active" title="Home"><span>🏠</span><small>Home</small></a>
          <a href="../index.html" className="side-btn" title="Hot"><span>🔥</span><small>Hot</small></a>
          <a href="../dart-board/index.html" className="side-btn" title="2-Player"><span>👥</span><small>2-Player</small></a>
          <a href="../flappy-man/index.html" className="side-btn" title="Arcade"><span>🕹️</span><small>Arcade</small></a>
          <a href="../wild-swings/index.html" className="side-btn" title="Action"><span>⚡</span><small>Action</small></a>
          <a href="../bomb-panic/index.html" className="side-btn" title="Party"><span>💣</span><small>Party</small></a>
          <a href="../gravity-flip/index.html" className="side-btn" title="Reflex"><span>🔄</span><small>Reflex</small></a>
        </aside>

        {/* Center Column */}
        <main className="portal-center-col">
          <div id="main-game-stage">
            <div className={`game-root-container ${screenShake} ${isFeverMode ? 'fever-active' : ''}`}>
              {/* Red screen flash on wrong hit */}
              {wrongFlash && <div className="wrong-flash-vignette" aria-hidden="true" />}

              {/* Bhaijaan Welcome Voice Banner */}
              {swagatActive && (
                <div className="swagat-overlay-banner" aria-hidden="true">
                  <div className="swagat-text-box animate-swagat-pop">
                    💥 Swagat Nahi Karoge Aap Humara? 💥
                  </div>
                </div>
              )}

              {/* Atmospheric Theme Background */}
              <Stars theme={theme} isFeverMode={isFeverMode} />

              {/* Top HUD with 3-section layout */}
              {gameState !== 'start' && (
                <ScoreHUD
                  level={level}
                  maxLevels={maxLevels}
                  levelTitle={currentLevelConfig.title}
                  levelMechanic={currentLevelConfig.mechanic}
                  levelProgress={levelProgress}
                  targetPopsNeeded={targetPopsNeeded}
                  score={score}
                  highScore={highScore}
                  lives={lives}
                  lastLostHeartIndex={lastLostHeartIndex}
                  targetColor={targetColor}
                  combo={combo}
                  isFeverMode={isFeverMode}
                  isMuted={isMuted}
                  theme={theme}
                  onToggleSound={toggleSound}
                  onPauseGame={handlePauseGame}
                  onOpenThemes={() => setIsThemesOpen(true)}
                  onOpenScoreboard={() => setIsScoreboardOpen(true)}
                />
              )}

              {/* Floating Balloons Stream */}
              <BalloonStream balloons={balloons} targetColor={targetColor} theme={theme} />

              {/* Pop Explosions Particle System & Floating Text Overlays */}
              <PopEffects particles={particles} popTexts={popTexts} poopedBalls={poopedBalls} />
              
              {/* Interactive Cannon & Projectiles */}
              {gameState !== 'start' && (
                <Cannon
                  cannonballs={cannonballs}
                  aimPos={aimPos}
                  updateAim={updateAim}
                  targetColor={targetColor}
                  theme={theme}
                  hunterMood={hunterMood}
                  isFeverMode={isFeverMode}
                />
              )}

              {/* Countdown Overlay (Level start) */}
              {gameState === 'countdown' && (
                <CountdownOverlay count={countdown} />
              )}

              {/* Welcome Start Screen */}
              {gameState === 'start' && (
                <StartScreenModal
                  playerName={playerName}
                  setPlayerName={setPlayerName}
                  currentTheme={theme}
                  onStart={startGame}
                  onOpenThemes={() => setIsThemesOpen(true)}
                  onOpenScoreboard={() => setIsScoreboardOpen(true)}
                />
              )}

              {/* Theme Selector Modal */}
              {isThemesOpen && (
                <ThemeSelectorModal
                  currentTheme={theme}
                  onSelectTheme={setTheme}
                  onClose={() => setIsThemesOpen(false)}
                />
              )}

              {/* Universal Frosted Paused Modal Card */}
              {gameState === 'paused' && (
                <div className="pause-modal-card">
                  <div style={{
                    background: 'rgba(14, 23, 38, 0.96)',
                    border: '2.5px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '20px',
                    padding: '22px 24px',
                    textAlign: 'center',
                    maxWidth: '380px',
                    width: '90%',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(56,189,248,0.3)',
                    backdropFilter: 'blur(16px)',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    <div style={{
                      display: 'inline-block',
                      border: '2.5px solid #38bdf8',
                      color: '#38bdf8',
                      fontWeight: 900,
                      fontSize: '1.05rem',
                      padding: '3px 14px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '8px'
                    }}>
                      ⏸️ PAUSED
                    </div>
                    <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>
                      Game Paused
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '16px' }}>
                      Taking a quick tactical breather...
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', maxWidth: '260px', margin: '0 auto', width: '100%' }}>
                      <button
                        className="portal-resume-btn"
                        onClick={handleResumeGame}
                        style={{
                          justifyContent: 'center',
                          width: '100%',
                          fontSize: '1rem',
                          padding: '11px 18px',
                          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                          border: '1px solid rgba(56,189,248,0.4)',
                          borderRadius: '999px',
                          color: '#fff',
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(2,132,199,0.4)'
                        }}
                      >
                        <span>▶️ RESUME (ESC)</span>
                      </button>
                      <button
                        onClick={() => { retryLevel(); handleResumeGame(); }}
                        style={{
                          justifyContent: 'center',
                          width: '100%',
                          fontSize: '0.88rem',
                          padding: '9px 16px',
                          background: 'rgba(30,41,59,0.7)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '12px',
                          color: '#cbd5e1',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <span>🔄 RESTART RUN</span>
                      </button>
                      <a
                        href="../index.html"
                        style={{
                          justifyContent: 'center',
                          width: '100%',
                          fontSize: '0.88rem',
                          padding: '9px 16px',
                          background: 'rgba(30,41,59,0.7)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '12px',
                          color: '#cbd5e1',
                          fontWeight: 800,
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'inline-block'
                        }}
                      >
                        <span>🏠 HOME</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Level Completed Modal */}
              {gameState === 'level_cleared' && (
                <LevelCompleteModal
                  level={level}
                  levelTitle={currentLevelConfig.title}
                  bonusPoints={currentLevelConfig.bonusPoints}
                  score={score}
                  maxCombo={maxCombo}
                  accuracy={accuracy}
                  onNextLevel={nextLevel}
                />
              )}

              {/* Level Failed / Game Over Modal */}
              {gameState === 'game_over' && (
                <GameOverModal
                  level={level}
                  score={score}
                  maxCombo={maxCombo}
                  accuracy={accuracy}
                  playerName={playerName}
                  onRetry={retryLevel}
                  onRestart={restartGame}
                  onOpenScoreboard={() => setIsScoreboardOpen(true)}
                />
              )}

              {/* Victory Modal */}
              {gameState === 'victory' && (
                <VictoryModal
                  score={score}
                  maxCombo={maxCombo}
                  accuracy={accuracy}
                  playerName={playerName}
                  onRestart={restartGame}
                  onOpenScoreboard={() => setIsScoreboardOpen(true)}
                />
              )}

              {/* High Scores Leaderboard Modal */}
              {isScoreboardOpen && (
                <ScoreboardModal
                  scoreboard={scoreboard}
                  onClose={() => setIsScoreboardOpen(false)}
                  onClear={clearScoreboard}
                />
              )}
            </div>
          </div>

          {/* Under-Game Meta Action Bar */}
          <div id="game-meta-bar" className="game-meta-bar">
            <div className="game-meta-info">
              <div className="game-avatar-icon">🎈💥</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3>Pop Up</h3>
                <div className="game-meta-tags">
                  <span className="tag-badge">Shooter</span>
                  <span className="tag-badge">Arcade</span>
                  <span className="meta-rating">⭐ 4.8</span>
                </div>
              </div>
            </div>
            <div className="game-meta-actions">
              <button className="meta-btn" id="btn-meta-like" onClick={(e) => {
                e.currentTarget.classList.toggle('active');
                const s = e.currentTarget.querySelector('span');
                if (s) s.textContent = e.currentTarget.classList.contains('active') ? '19.6k' : '19.5k';
              }}>
                👍 <span>19.5k</span>
              </button>
              <button className="meta-btn" id="btn-meta-fav" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                ⭐ Fav
              </button>
              <button className="meta-btn" id="btn-meta-expand" onClick={handleResumeGame}>
                ⛶ Expand
              </button>
              <button className="meta-btn" id="btn-meta-share" onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Game link copied!');
                }
              }}>
                🔗
              </button>
            </div>
          </div>
        </main>

        {/* Right Column: Recommended Games Grid */}
        <aside id="portal-rec-col" className="portal-rec-col">
          <div className="rec-header">
            <span>🔥 RECOMMENDED GAMES</span>
            <a href="../index.html">ALL <span>→</span></a>
          </div>
          <div className="rec-grid">
            <a href="../office-escape/index.html" className="rec-card">
              <div className="rec-badge">⚡ SPRINT</div>
              <div className="rec-preview">🏃💼</div>
              <div className="rec-info">
                <b>Office Escape</b>
                <small>Runner • Satire</small>
              </div>
            </a>
            <a href="../dart-board/index.html" className="rec-card">
              <div className="rec-badge">🎯 BULLSEYE</div>
              <div className="rec-preview">🎯🍺</div>
              <div className="rec-info">
                <b>Dart Master</b>
                <small>PvP • 2-Player</small>
              </div>
            </a>
            <a href="../flappy-man/index.html" className="rec-card">
              <div className="rec-badge">🦸 HERO</div>
              <div className="rec-preview">🦸‍♂️🚀</div>
              <div className="rec-info">
                <b>Flappy Man</b>
                <small>Arcade • 10 Levels</small>
              </div>
            </a>
            <a href="../wild-swings/index.html" className="rec-card">
              <div className="rec-badge">🕸️ PHYSICS</div>
              <div className="rec-preview">🕸️🐒</div>
              <div className="rec-info">
                <b>Wild Swings</b>
                <small>Action • 20 Levels</small>
              </div>
            </a>
            <a href="../bomb-panic/index.html" className="rec-card">
              <div className="rec-badge">💣 MULTI</div>
              <div className="rec-preview">💣💥</div>
              <div className="rec-info">
                <b>Bomb Panic</b>
                <small>Party • Hot Potato</small>
              </div>
            </a>
            <a href="../gravity-flip/index.html" className="rec-card">
              <div className="rec-badge">⛏️ CAVERN</div>
              <div className="rec-preview">⛏️🪨</div>
              <div className="rec-info">
                <b>Gravity Flip</b>
                <small>Runner • Reflex</small>
              </div>
            </a>
          </div>
        </aside>
      </div>

      {/* 3-Second Resume Countdown Overlay */}
      {resumeCountdown && (
        <div className="resume-countdown-overlay active">
          <div className="resume-countdown-number" style={resumeCountdown === 'GO!' ? { color: '#4ade80', textShadow: '0 0 45px rgba(74, 222, 128, 0.9)' } : {}}>
            {resumeCountdown}
          </div>
          <div className="resume-countdown-sub" style={resumeCountdown === 'GO!' ? { color: '#4ade80' } : {}}>
            {resumeCountdown === 'GO!' ? '🚀 POP NOW!' : '⚡ GET READY • RESUMING'}
          </div>
        </div>
      )}
    </div>
  );
}



