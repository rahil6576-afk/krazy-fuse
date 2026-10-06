import { useState, useEffect, useRef, useCallback } from 'react';
import { colorMap, generateBalloonsForLevel } from '../constants/balloonsData';
import { LEVELS } from '../constants/levelsData';
import { sound } from '../utils/soundEffects';

const HIGH_SCORE_KEY = 'float_high_score';
const SCOREBOARD_KEY = 'float_scoreboard';

const THEME_KEY = 'float_game_theme';

export function useBalloonGame() {
  const [gameState, setGameState] = useState('start'); // 'start' | 'countdown' | 'playing' | 'paused' | 'level_cleared' | 'game_over' | 'victory'
  const [level, setLevel] = useState(1);
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'space';
  });
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('float_player_name') || '';
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [strikes, setStrikes] = useState(0); // 0..3
  const [levelProgress, setLevelProgress] = useState(0);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.isMuted());

  const [swagatActive, setSwagatActive] = useState(false);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    if (newTheme === 'salman') {
      sound.playSwagat();
      setSwagatActive(true);
      setTimeout(() => setSwagatActive(false), 3000);
    }
  }, []);

  // Combo & Fever Mode
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isFeverMode, setIsFeverMode] = useState(false);

  // Countdown before level start
  const [countdown, setCountdown] = useState(null);

  // Stats & Screen Feedback
  const [shotsFired, setShotsFired] = useState(0);
  const [shotsHit, setShotsHit] = useState(0);
  const [screenShake, setScreenShake] = useState(''); // 'shake-small' | 'shake-large' | ''
  const [wrongFlash, setWrongFlash] = useState(false);
  const [lastLostHeartIndex, setLastLostHeartIndex] = useState(-1);
  const [hunterMood, setHunterMood] = useState('idle'); // 'idle' | 'happy' | 'angry'
  const hunterMoodTimerRef = useRef(null);

  const triggerHunterMood = useCallback((mood, duration = 1300) => {
    setHunterMood(mood);
    if (hunterMoodTimerRef.current) clearTimeout(hunterMoodTimerRef.current);
    hunterMoodTimerRef.current = setTimeout(() => {
      setHunterMood('idle');
    }, duration);
  }, []);

  const currentLevelConfig = LEVELS[Math.min(level - 1, LEVELS.length - 1)];

  const [balloons, setBalloons] = useState(() => generateBalloonsForLevel(currentLevelConfig));
  const [particles, setParticles] = useState([]);
  const [popTexts, setPopTexts] = useState([]);
  const [poopedBalls, setPoopedBalls] = useState([]);
  const [cannonballs, setCannonballs] = useState([]);
  const [aimPos, setAimPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2, angle: 0 });

  const [targetColor, setTargetColor] = useState(() => {
    const colors = currentLevelConfig.colors;
    return colors[Math.floor(Math.random() * colors.length)];
  });

  const [scoreboard, setScoreboard] = useState(() => {
    try {
      const saved = localStorage.getItem(SCOREBOARD_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 'sb-1', name: 'SkyAce', score: 1450, level: 18, date: '2026-08-10' },
        { id: 'sb-2', name: 'BreezeHunter', score: 980, level: 12, date: '2026-08-12' },
        { id: 'sb-3', name: 'CloudPopper', score: 620, level: 8, date: '2026-08-13' },
        { id: 'sb-4', name: 'Zephyr', score: 350, level: 5, date: '2026-08-14' },
      ];
    } catch {
      return [];
    }
  });

  const balloonsRef = useRef(balloons);
  const cannonballsRef = useRef(cannonballs);
  const targetColorRef = useRef(targetColor);
  const gameStateRef = useRef(gameState);

  // Refs
  const strikesRef = useRef(strikes);
  const levelProgressRef = useRef(levelProgress);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const themeRef = useRef(theme);
  const playerNameRef = useRef(playerName);
  const currentLevelConfigRef = useRef(currentLevelConfig);
  const comboTimerRef = useRef(null);

  useEffect(() => { balloonsRef.current = balloons; }, [balloons]);
  useEffect(() => { cannonballsRef.current = cannonballs; }, [cannonballs]);
  useEffect(() => { targetColorRef.current = targetColor; }, [targetColor]);
  useEffect(() => { currentLevelConfigRef.current = currentLevelConfig; }, [currentLevelConfig]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { playerNameRef.current = playerName; }, [playerName]);
  useEffect(() => { strikesRef.current = strikes; }, [strikes]);
  useEffect(() => { levelProgressRef.current = levelProgress; }, [levelProgress]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { comboRef.current = combo; }, [combo]);

  // Update High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    }
  }, [score, highScore]);

  // Sync scoreboard
  useEffect(() => {
    localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(scoreboard));
  }, [scoreboard]);

  const toggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const triggerShake = useCallback((type = 'shake-small') => {
    setScreenShake(type);
    setTimeout(() => setScreenShake(''), 300);
  }, []);

  const saveScoreToScoreboard = useCallback((nameParam) => {
    const finalName = (typeof nameParam === 'string' && nameParam.trim())
      ? nameParam.trim()
      : (playerNameRef.current?.trim() || localStorage.getItem('float_player_name')?.trim() || 'Player');

    const currentScore = scoreRef.current;
    if (currentScore <= 0) return;

    const newEntry = {
      id: `${Date.now()}-${Math.random()}`,
      name: finalName,
      score: currentScore,
      level: level,
      date: new Date().toISOString().split('T')[0],
    };

    setScoreboard(prev => {
      const updated = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
      return updated;
    });
  }, [level]);

  const clearScoreboard = useCallback(() => {
    setScoreboard([]);
    localStorage.removeItem(SCOREBOARD_KEY);
  }, []);

  const spawnPopupText = useCallback((text, x, y, type, color) => {
    const textId = `${Date.now()}-${Math.random()}`;
    const newText = { id: textId, x, y, text, type, color };
    setPopTexts(prev => [...prev, newText]);
    setTimeout(() => {
      setPopTexts(prev => prev.filter(t => t.id !== textId));
    }, 950);
  }, []);

  const spawnParticles = useCallback((x, y, color, extraIntensity = false) => {
    const newParticles = [];
    const particleCount = extraIntensity ? 22 : 14;
    const particleColor = colorMap[color] || '#ffffff';
    const currentTheme = themeRef.current || 'space';

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * 2 * Math.PI + Math.random() * 0.4;
      const distance = (extraIntensity ? 55 : 38) + Math.random() * (extraIntensity ? 85 : 65);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 6 + Math.random() * (extraIntensity ? 9 : 6);

      newParticles.push({
        id: `p-${i}-${Date.now()}-${Math.random()}`,
        x,
        y,
        tx: `${tx}px`,
        ty: `${ty}px`,
        size: `${size}px`,
        color: particleColor,
        theme: currentTheme,
        rot: `${Math.random() * 720 - 360}deg`,
        startRot: `${Math.random() * 360}deg`,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 800);
  }, []);

  // Combo timer management
  const resetComboTimer = useCallback(() => {
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
      setIsFeverMode(false);
    }, 3800);
  }, []);

  // Trigger Countdown sequence
  const startLevelCountdown = useCallback((targetLvl = level) => {
    setGameState('countdown');
    setCannonballs([]);
    setCountdown(3);
    sound.playCountdown(false);

    setTimeout(() => {
      setCountdown(2);
      sound.playCountdown(false);
    }, 800);

    setTimeout(() => {
      setCountdown(1);
      sound.playCountdown(false);
    }, 1600);

    setTimeout(() => {
      setCountdown('GO!');
      sound.playCountdown(true);
    }, 2400);

    setTimeout(() => {
      setCountdown(null);
      setGameState('playing');
    }, 3000);
  }, [level]);

  const triggerPop = useCallback((id, color, hitX, hitY) => {
    if (gameStateRef.current !== 'playing') return;

    const currentTheme = themeRef.current || 'space';
    setShotsHit(h => h + 1);

    // Ensure matching across number vs string ID types
    setBalloons(prev =>
      prev.map(b => (String(b.id) === String(id) ? { ...b, isPopping: true } : b))
    );

    const isCorrect = color === targetColorRef.current;

    if (isCorrect) {
      // Correct Pop!
      const newCombo = comboRef.current + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      resetComboTimer();

      // Check Fever mode
      let feverActive = isFeverMode;
      if (newCombo >= 5 && !isFeverMode) {
        setIsFeverMode(true);
        feverActive = true;
        sound.playFever();
        spawnPopupText('🔥 FEVER MODE 3×! 🔥', window.innerWidth / 2, window.innerHeight * 0.35, 'fever', '#ffb703');
      }

      // Multiplier calculation
      const multiplier = feverActive ? 3 : newCombo >= 4 ? 2.5 : newCombo >= 3 ? 2 : newCombo >= 2 ? 1.5 : 1;
      const pointsEarned = Math.round(10 * multiplier);

      setScore(s => s + pointsEarned);
      sound.playPop(newCombo, currentTheme);
      if (newCombo >= 2 && !feverActive) {
        sound.playComboChord(newCombo);
      }

      // Haptic light feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }

      triggerShake('shake-small');
      spawnParticles(hitX, hitY, color, feverActive);
      triggerHunterMood('happy', 1400);

      // Spawn a "pooped out" mini beach ball falling down in beach mode
      if (currentTheme === 'beach') {
        const ballId = `${Date.now()}-${Math.random()}`;
        setPoopedBalls(prev => [
          ...prev,
          {
            id: ballId,
            x: hitX,
            y: hitY,
            vx: (Math.random() * 5 - 2.5),
            vy: (Math.random() * -5 - 3),
            gravity: 0.35,
            angle: Math.random() * 360,
            vAngle: (Math.random() * 10 - 5),
            scale: 0.45 + Math.random() * 0.15,
            color: color,
          }
        ]);
      }

      // Popup indicator (child-friendly cartoon exclamations)
      const funCorrectWords = ['YAY!', 'WOW!', 'COOL!', 'GREAT!', 'SUPER!', 'AWESOME!', 'POP!'];
      const randomWord = funCorrectWords[Math.floor(Math.random() * funCorrectWords.length)];
      if (newCombo >= 2) {
        spawnPopupText(`${randomWord} +${pointsEarned} (×${newCombo} COMBO!)`, hitX, hitY, 'combo', '#ffd700');
      } else {
        spawnPopupText(`${randomWord} +${pointsEarned}`, hitX, hitY, 'correct', '#4caf50');
      }

      const nextProgress = levelProgressRef.current + 1;
      setLevelProgress(nextProgress);

      const needed = currentLevelConfigRef.current.targetPopsNeeded;

      if (nextProgress >= needed) {
        // Level cleared!
        const bonus = currentLevelConfigRef.current.bonusPoints || 100;
        setScore(s => s + bonus);
        sound.playWinFanfare();
        spawnPopupText(`LEVEL CLEARED! +${bonus}`, window.innerWidth / 2, window.innerHeight / 2, 'level-up', '#ffd700');

        if (level >= 20) {
          saveScoreToScoreboard(playerNameRef.current);
          setGameState('victory');
        } else {
          setGameState('level_cleared');
        }
      } else {
        // Pick next target color from level's allowed colors
        const colors = currentLevelConfigRef.current.colors;
        const choices = colors.length > 1 ? colors.filter(c => c !== color) : colors;
        const nextColor = choices[Math.floor(Math.random() * choices.length)];
        setTargetColor(nextColor);
      }
    } else {
      // Wrong balloon popped -> STRIKE!
      const newStrikes = strikesRef.current + 1;
      setStrikes(newStrikes);
      setCombo(0);
      setIsFeverMode(false);
      setLastLostHeartIndex(3 - newStrikes);
      setTimeout(() => setLastLostHeartIndex(-1), 500);

      sound.playWrong();
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 400);

      // Stronger haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      triggerShake('shake-large');
      setScore(prev => Math.max(0, prev - 5));
      spawnParticles(hitX, hitY, color, false);
      triggerHunterMood('angry', 1500);

      const funWrongWords = ['OOPS!', 'OH NO!', 'TRY AGAIN!', 'WATCH OUT!', 'CAREFUL!'];
      const randomWrongWord = funWrongWords[Math.floor(Math.random() * funWrongWords.length)];

      if (newStrikes >= 3) {
        sound.playGameOver();
        spawnPopupText('LEVEL FAILED 💔', hitX, hitY, 'wrong', '#ff3366');
        saveScoreToScoreboard(playerNameRef.current);
        setGameState('game_over');
      } else {
        spawnPopupText(`${randomWrongWord} STRIKE ${newStrikes}/3 (-5)`, hitX, hitY, 'wrong', '#ff5252');
      }
    }

    // Respawn popped balloon from top after 1200ms with fresh random delay and position
    setTimeout(() => {
      setBalloons(prev =>
        prev.map(b => {
          if (String(b.id) !== String(id)) return b;
          const currentConfig = currentLevelConfigRef.current || {};
          const colors = currentConfig.colors || ['red', 'cyan', 'gold'];
          const newColor = colors[Math.floor(Math.random() * colors.length)];
          const newLeft = Math.max(4, Math.min(92, Math.round(Math.random() * 88 + 4)));
          return {
            ...b,
            isPopping: false,
            color: newColor,
            left: `${newLeft}%`,
            key: (b.key || 0) + 1,
            floatDelay: '0s',
          };
        })
      );
    }, 1200);
  }, [level, isFeverMode, resetComboTimer, spawnParticles, spawnPopupText, triggerShake]);

  function distToSegmentSquared(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return (px - x1) * (px - x1) + (py - y1) * (py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return (px - projX) * (px - projX) + (py - projY) * (py - projY);
  }

  const fireCannonball = useCallback((clientX, clientY) => {
    if (gameStateRef.current !== 'playing') return;

    const currentTheme = themeRef.current || 'space';
    sound.playShoot(currentTheme);
    setShotsFired(s => s + 1);

    // 1. Direct Tap / Click Hit Detection (Instant Pop on Touch)
    const balloonElements = document.querySelectorAll('.balloon-wrapper:not(.popping)');
    for (let i = 0; i < balloonElements.length; i++) {
      const el = balloonElements[i];
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(48, Math.max(rect.width, rect.height) * 0.55);
      if (Math.hypot(clientX - cx, clientY - cy) <= radius) {
        const id = el.getAttribute('data-id');
        const color = el.getAttribute('data-color');
        if (id && color) {
          triggerPop(id, color, clientX, clientY);
          return;
        }
      }
    }

    // 2. Cannonball Projectile Launch
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight - 30;
    const dx = clientX - originX;
    const dy = clientY - originY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;

    const speed = 22 + Math.min(8, level * 0.35);
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    setCannonballs(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        x: originX,
        y: originY,
        vx,
        vy,
        size: currentTheme === 'beach' ? 26 : currentTheme === 'dystopian' ? 14 : currentTheme === 'slimy' ? 20 : 16,
        theme: currentTheme,
        angle,
      },
    ]);
  }, [level, triggerPop]);

  const updateAim = useCallback((clientX, clientY) => {
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight - 30;
    const dx = clientX - originX;
    const dy = clientY - originY;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI + 90;
    const clampedAngle = Math.max(-85, Math.min(85, angleDeg));

    setAimPos({
      x: clientX,
      y: clientY,
      angle: clampedAngle,
    });
  }, []);

  const startGame = useCallback(() => {
    setLevel(1);
    setScore(0);
    setStrikes(0);
    setLevelProgress(0);
    setCombo(0);
    setMaxCombo(0);
    setIsFeverMode(false);
    setShotsFired(0);
    setShotsHit(0);
    setLastLostHeartIndex(-1);
    setPoopedBalls([]);
    if (themeRef.current === 'salman') {
      sound.playSwagat();
      setSwagatActive(true);
      setTimeout(() => setSwagatActive(false), 3000);
    }
    const config = LEVELS[0];
    setBalloons(generateBalloonsForLevel(config));
    setTargetColor(config.colors[Math.floor(Math.random() * config.colors.length)]);
    startLevelCountdown(1);
  }, [startLevelCountdown]);

  const nextLevel = useCallback(() => {
    if (level < 20) {
      const nextLvl = level + 1;
      setLevel(nextLvl);
      const nextConfig = LEVELS[nextLvl - 1];
      setBalloons(generateBalloonsForLevel(nextConfig));
      setStrikes(0);
      setLevelProgress(0);
      setCombo(0);
      setMaxCombo(0);
      setIsFeverMode(false);
      setLastLostHeartIndex(-1);
      setCannonballs([]);
      setPoopedBalls([]);
      const colors = nextConfig.colors;
      setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
      startLevelCountdown(nextLvl);
    } else {
      setGameState('victory');
    }
  }, [level, startLevelCountdown]);

  const retryLevel = useCallback(() => {
    const config = LEVELS[level - 1];
    setBalloons(generateBalloonsForLevel(config));
    setStrikes(0);
    setLevelProgress(0);
    setCombo(0);
    setMaxCombo(0);
    setIsFeverMode(false);
    setLastLostHeartIndex(-1);
    setCannonballs([]);
    setPoopedBalls([]);
    const colors = config.colors;
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    startLevelCountdown(level);
  }, [level, startLevelCountdown]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  const levelStartTimeRef = useRef(performance.now());
  const balloonSpawnOffsetsRef = useRef({});

  useEffect(() => {
    levelStartTimeRef.current = performance.now();
    balloonSpawnOffsetsRef.current = {};
  }, [level, gameState]);

  // Main game loop for moving cannonballs and detecting collision (zero layout thrashing, continuous swept line collision)
  useEffect(() => {
    let animId;
    const updateFrame = () => {
      if (gameStateRef.current === 'playing') {
        setCannonballs(prevBalls => {
          if (prevBalls.length === 0) return prevBalls;

          const nextBalls = [];
          const poppedBalloonIds = new Set();
          const winW = window.innerWidth;
          const winH = window.innerHeight;

          // Retrieve true visual on-screen balloon positions
          const balloonElements = document.querySelectorAll('.balloon-wrapper:not(.popping)');
          const activeTargets = [];
          for (let i = 0; i < balloonElements.length; i++) {
            const el = balloonElements[i];
            const rect = el.getBoundingClientRect();
            if (rect.bottom < -40 || rect.top > winH + 40 || rect.right < -40 || rect.left > winW + 40) continue;
            const id = el.getAttribute('data-id');
            const color = el.getAttribute('data-color');
            if (id && color) {
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              const radius = Math.max(48, Math.max(rect.width, rect.height) * 0.55);
              activeTargets.push({ id, color, cx, cy, radius });
            }
          }

          for (const ball of prevBalls) {
            const nextX = ball.x + ball.vx;
            const nextY = ball.y + ball.vy;

            if (nextX < -60 || nextX > winW + 60 || nextY < -60 || nextY > winH + 60) {
              continue;
            }

            let hit = false;
            const ballRadius = (ball.size || 36) / 2;

            for (const t of activeTargets) {
              if (poppedBalloonIds.has(t.id)) continue;

              const hitDist = t.radius + ballRadius;
              // Continuous swept line segment collision to prevent fast projectile tunneling
              const d2 = distToSegmentSquared(t.cx, t.cy, ball.x, ball.y, nextX, nextY);

              if (d2 <= hitDist * hitDist) {
                hit = true;
                poppedBalloonIds.add(t.id);
                triggerPop(t.id, t.color, t.cx, t.cy);
                break;
              }
            }

            if (!hit) {
              nextBalls.push({
                ...ball,
                x: nextX,
                y: nextY,
              });
            }
          }

          return nextBalls;
        });

        // Update falling pooped beach balls
        setPoopedBalls(prev => {
          if (prev.length === 0) return prev;
          const winH = window.innerHeight;
          return prev
            .map(b => ({
              ...b,
              x: b.x + b.vx,
              y: b.y + b.vy,
              vy: b.vy + b.gravity,
              angle: b.angle + b.vAngle,
            }))
            .filter(b => b.y < winH + 60);
        });
      }

      animId = requestAnimationFrame(updateFrame);
    };

    animId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animId);
  }, [triggerPop]);

  const accuracy = Math.round((shotsHit / Math.max(1, shotsFired)) * 100);

  return {
    gameState,
    setGameState,
    level,
    maxLevels: LEVELS.length,
    currentLevelConfig,
    score,
    highScore,
    strikes,
    lives: Math.max(0, 3 - strikes),
    lastLostHeartIndex,
    levelProgress,
    targetPopsNeeded: currentLevelConfig.targetPopsNeeded,
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
    shotsFired,
    shotsHit,
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
  };
}


