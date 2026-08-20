import React, { useEffect, useCallback } from 'react';
import Stars from './components/Background/Stars';
import ScoreHUD from './components/UI/ScoreHUD';
import BalloonStream from './components/Balloons/BalloonStream';
import PopEffects from './components/Effects/PopEffects';
import Cannon from './components/Cannon/Cannon';
import {
  StartScreenModal,
  ThemeSelectorModal,
  CountdownOverlay,
  PauseModal,
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
    pauseGame,
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

  const handleShoot = useCallback((e) => {
    // Prevent shooting if clicking on modals, HUD buttons, or inputs
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

      {/* Atmospheric Theme Background (Space, Beach, Dystopian, Slimy) */}
      <Stars theme={theme} isFeverMode={isFeverMode} />

      {/* Top HUD with 3-section layout, target spotlight, lives, and controls */}
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
          onPauseGame={pauseGame}
          onOpenThemes={() => setIsThemesOpen(true)}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
        />
      )}

      {/* Floating Balloons Stream */}
      <BalloonStream balloons={balloons} targetColor={targetColor} theme={theme} />

      {/* Pop Explosions Particle System & Floating Text Overlays */}
      <PopEffects particles={particles} popTexts={popTexts} poopedBalls={poopedBalls} />
      
      {/* Interactive Cannon, Trajectory Arrow & Projectiles */}
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

      {/* Countdown Overlay (3... 2... 1... GO!) */}
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

      {/* Pause Menu Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={pauseGame}
          onRestart={restartGame}
          currentTheme={theme}
          onOpenThemes={() => setIsThemesOpen(true)}
          isMuted={isMuted}
          onToggleSound={toggleSound}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
        />
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

      {/* Level Failed / Game Over Modal (3 strikes) */}
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

      {/* Victory Modal (All 20 Levels Cleared!) */}
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
  );
}



