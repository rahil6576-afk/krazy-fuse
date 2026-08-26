// Dart Master Arena - Full Physics & Game Engine
(function() {
    'use strict';

    // London Standard Dartboard Sequence (clockwise starting top 20)
    const SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const ANGLE_PER_SECTOR = (Math.PI * 2) / 20;

    // Checkout table lookup for standard finishes
    const CHECKOUT_HINTS = {
        170: 'T20 • T20 • BULL',
        167: 'T20 • T19 • BULL',
        164: 'T20 • T18 • BULL',
        161: 'T20 • T17 • BULL',
        160: 'T20 • T20 • D20',
        100: 'T20 • D20',
        96: 'T20 • D18',
        80: 'T20 • D10',
        70: 'T18 • D8',
        60: 'S20 • D20',
        50: 'BULLSEYE',
        40: 'DOUBLE 20',
        36: 'DOUBLE 18',
        32: 'DOUBLE 16',
        24: 'DOUBLE 12',
        20: 'DOUBLE 10',
        16: 'DOUBLE 8',
        12: 'DOUBLE 6',
        8: 'DOUBLE 4',
        4: 'DOUBLE 2',
        2: 'DOUBLE 1'
    };

    class DartGame {
        constructor() {
            this.canvas = document.getElementById('dartCanvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.dpr = window.devicePixelRatio || 1;

            // Logical Canvas Dimensions
            this.width = 600;
            this.height = 700;
            this.boardCenter = { x: 300, y: 360 };
            this.boardRadius = 220;

            // Dart Radii Relative to boardRadius
            this.rInnerBull = this.boardRadius * 0.045; // 50
            this.rOuterBull = this.boardRadius * 0.105; // 25
            this.rTrebleInner = this.boardRadius * 0.54;
            this.rTrebleOuter = this.boardRadius * 0.62;
            this.rDoubleInner = this.boardRadius * 0.92;
            this.rDoubleOuter = this.boardRadius * 1.0;

            // Game Settings & Mode
            this.gameType = '501'; // '301' or '501'
            this.gameMode = 'bot'; // 'bot', 'pass', 'online'
            this.botDifficulty = 'pro'; // 'rookie', 'amateur', 'pro', 'master'
            this.doubleOut = true;

            // Match State
            this.players = [
                { id: 'p1', name: 'Player 1', avatar: '🎯', score: 501, dartsThrown: 0, turnDarts: [], startTurnScore: 501, legsWon: 0 },
                { id: 'p2', name: 'DartBot AI', avatar: '🤖', score: 501, dartsThrown: 0, turnDarts: [], startTurnScore: 501, legsWon: 0 }
            ];
            this.activePlayerIdx = 0;
            this.turnDartCount = 0;
            this.boardDarts = [];
            this.isThrowing = false;
            this.flyingDart = null;
            this.particles = [];
            this.gameOver = false;
            this.isBotTurn = false;

            // Aiming & Drag Throw Controls
            this.aimPoint = { x: 300, y: 290 };
            this.isAiming = false;
            this.dragStart = null;
            this.dragCurrent = null;

            // Multiplayer Sync Channel
            this.roomCode = 'DART-101';
            this.isHost = true;
            this.peerChannel = null;

            this.load3DAssets();
            this.initCanvas();
            this.setupEvents();
            this.initMultiplayerChannel();
            this.resetMatch();
            this.startLoop();
        }

        load3DAssets() {
            this.assets = {
                boardReady: false,
                boardCanvas: null,
                dartRedReady: false,
                dartRedCanvas: null,
                dartBlueReady: false,
                dartBlueCanvas: null
            };

            const imgBoard = new Image();
            imgBoard.onload = () => {
                try {
                    const c = document.createElement('canvas');
                    c.width = imgBoard.width || 1024;
                    c.height = imgBoard.height || 1024;
                    const octx = c.getContext('2d');
                    octx.beginPath();
                    octx.arc(c.width / 2, c.height / 2, c.width * 0.485, 0, Math.PI * 2);
                    octx.clip();
                    octx.drawImage(imgBoard, 0, 0);
                    this.assets.boardCanvas = c;
                    this.assets.boardReady = true;
                } catch (e) {
                    console.warn('Board asset error:', e);
                }
            };
            imgBoard.src = 'dartboard_3d.jpg';

            const processDart = (src, isRed) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const c = document.createElement('canvas');
                        c.width = img.width || 576;
                        c.height = img.height || 1024;
                        const octx = c.getContext('2d');
                        octx.drawImage(img, 0, 0);

                        const imgData = octx.getImageData(0, 0, c.width, c.height);
                        const d = imgData.data;
                        for (let i = 0; i < d.length; i += 4) {
                            const maxLum = Math.max(d[i], d[i+1], d[i+2]);
                            if (maxLum < 16) {
                                d[i+3] = 0;
                            } else if (maxLum < 48) {
                                d[i+3] = Math.round(((maxLum - 16) / 32) * 255);
                            }
                        }
                        octx.putImageData(imgData, 0, 0);

                        if (isRed) {
                            this.assets.dartRedCanvas = c;
                            this.assets.dartRedReady = true;
                        } else {
                            this.assets.dartBlueCanvas = c;
                            this.assets.dartBlueReady = true;
                        }
                    } catch (e) {
                        console.warn('Dart asset error:', e);
                    }
                };
                img.src = src;
            };

            processDart('dart_red_3d.jpg', true);
            processDart('dart_blue_3d.jpg', false);
        }

        initCanvas() {
            this.canvas.width = this.width * this.dpr;
            this.canvas.height = this.height * this.dpr;
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;
            this.ctx.scale(this.dpr, this.dpr);
        }

        initMultiplayerChannel() {
            try {
                if ('BroadcastChannel' in window) {
                    this.peerChannel = new BroadcastChannel(`krazio_darts_${this.roomCode}`);
                    this.peerChannel.onmessage = (e) => {
                        this.handleRemoteMessage(e.data);
                    };
                }
            } catch (err) {
                console.warn('BroadcastChannel error:', err);
            }
        }

        handleRemoteMessage(data) {
            if (!data || this.gameMode !== 'online') return;
            if (data.type === 'REMOTE_THROW') {
                if (this.activePlayerIdx === 1) {
                    this.executeThrow(data.targetX, data.targetY);
                }
            } else if (data.type === 'MATCH_RESTART') {
                this.resetMatch();
            }
        }

        broadcastThrow(targetX, targetY) {
            if (this.peerChannel && this.gameMode === 'online') {
                this.peerChannel.postMessage({
                    type: 'REMOTE_THROW',
                    targetX,
                    targetY,
                    playerIdx: this.activePlayerIdx
                });
            }
        }

        resetMatch() {
            const startScore = parseInt(this.gameType, 10) || 501;
            this.players[0].score = startScore;
            this.players[0].startTurnScore = startScore;
            this.players[0].dartsThrown = 0;
            this.players[0].turnDarts = [];

            this.players[1].score = startScore;
            this.players[1].startTurnScore = startScore;
            this.players[1].dartsThrown = 0;
            this.players[1].turnDarts = [];

            if (this.gameMode === 'bot') {
                this.players[1].name = `DartBot (${this.botDifficulty.toUpperCase()})`;
                this.players[1].avatar = '🤖';
            } else if (this.gameMode === 'pass') {
                this.players[1].name = 'Player 2 (Local)';
                this.players[1].avatar = '👥';
            } else {
                this.players[1].name = 'Online Rival';
                this.players[1].avatar = '🌐';
            }

            this.activePlayerIdx = 0;
            this.turnDartCount = 0;
            this.boardDarts = [];
            this.flyingDart = null;
            this.particles = [];
            this.gameOver = false;
            this.isBotTurn = false;

            const modeBadge = document.getElementById('currentModeBadge');
            if (modeBadge) {
                modeBadge.textContent = `${this.gameType} • ${this.gameMode.toUpperCase()}`;
            }

            this.updateHUD();
            this.showCallout('MATCH READY — GAME ON!');
            if (window.dartAudio) window.dartAudio.announce('Game on!');
        }

        setupEvents() {
            const getPos = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * (this.width / rect.width),
                    y: (clientY - rect.top) * (this.height / rect.height)
                };
            };

            const startAim = (e) => {
                if (this.gameOver || this.flyingDart || (this.gameMode === 'bot' && this.activePlayerIdx === 1)) return;
                if (window.dartAudio) window.dartAudio.init();
                const pos = getPos(e);
                this.isAiming = true;
                this.dragStart = pos;
                this.dragCurrent = pos;
            };

            const moveAim = (e) => {
                if (!this.isAiming) return;
                this.dragCurrent = getPos(e);
            };

            const releaseAim = (e) => {
                if (!this.isAiming || !this.dragStart || !this.dragCurrent) {
                    this.isAiming = false;
                    return;
                }
                this.isAiming = false;

                const dx = this.dragCurrent.x - this.dragStart.x;
                const dy = this.dragCurrent.y - this.dragStart.y;
                const dist = Math.hypot(dx, dy);

                let targetX, targetY;
                if (dist < 15) {
                    targetX = this.dragCurrent.x;
                    targetY = this.dragCurrent.y;
                } else {
                    targetX = this.dragStart.x - dx * 1.3;
                    targetY = this.dragStart.y - dy * 1.3;
                }

                targetX = Math.max(20, Math.min(this.width - 20, targetX));
                targetY = Math.max(20, Math.min(this.height - 20, targetY));

                this.executeThrow(targetX, targetY);
                this.broadcastThrow(targetX, targetY);
            };

            this.canvas.addEventListener('mousedown', startAim);
            window.addEventListener('mousemove', moveAim);
            window.addEventListener('mouseup', releaseAim);

            this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startAim(e); }, { passive: false });
            window.addEventListener('touchmove', (e) => { moveAim(e); }, { passive: true });
            window.addEventListener('touchend', (e) => { releaseAim(e); }, { passive: true });
        }

        executeThrow(targetX, targetY) {
            if (this.flyingDart || this.gameOver) return;

            if (window.dartAudio) window.dartAudio.playThrow();

            this.flyingDart = {
                startX: this.width / 2,
                startY: this.height - 20,
                targetX: targetX,
                targetY: targetY,
                x: this.width / 2,
                y: this.height - 20,
                progress: 0,
                speed: 0.058,
                scale: 1.6
            };
        }

        triggerBotThrow() {
            if (this.gameOver || this.flyingDart || this.activePlayerIdx !== 1 || this.gameMode !== 'bot') return;

            this.isBotTurn = true;
            setTimeout(() => {
                if (this.gameOver || this.activePlayerIdx !== 1) return;

                const botTarget = this.calculateBotTarget(this.players[1].score);
                const varianceMap = { rookie: 48, amateur: 26, pro: 11, master: 4 };
                const variance = varianceMap[this.botDifficulty] || 15;

                const u1 = Math.random();
                const u2 = Math.random();
                const randStdNormal = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.cos(2.0 * Math.PI * u2);
                const randStdNormal2 = Math.sqrt(-2.0 * Math.log(u1 || 0.001)) * Math.sin(2.0 * Math.PI * u2);

                const finalX = botTarget.x + randStdNormal * variance;
                const finalY = botTarget.y + randStdNormal2 * variance;

                this.executeThrow(finalX, finalY);
            }, 750);
        }

        calculateBotTarget(remainingScore) {
            const center = this.boardCenter;
            const rTreble = (this.rTrebleInner + this.rTrebleOuter) / 2;
            const rDouble = (this.rDoubleInner + this.rDoubleOuter) / 2;

            if (remainingScore === 50) return { x: center.x, y: center.y };
            if (remainingScore <= 40 && remainingScore % 2 === 0) {
                const targetSector = remainingScore / 2;
                const sectorIdx = SECTORS.indexOf(targetSector);
                if (sectorIdx !== -1) {
                    const angle = -Math.PI / 2 + sectorIdx * ANGLE_PER_SECTOR;
                    return {
                        x: center.x + Math.cos(angle) * rDouble,
                        y: center.y + Math.sin(angle) * rDouble
                    };
                }
            }

            const angle20 = -Math.PI / 2;
            return {
                x: center.x + Math.cos(angle20) * rTreble,
                y: center.y + Math.sin(angle20) * rTreble
            };
        }

        scoreHit(x, y) {
            const dx = x - this.boardCenter.x;
            const dy = y - this.boardCenter.y;
            const dist = Math.hypot(dx, dy);

            let angle = Math.atan2(dy, dx) - (-Math.PI / 2);
            if (angle < 0) angle += Math.PI * 2;

            const sectorIndex = Math.floor((angle + ANGLE_PER_SECTOR / 2) / ANGLE_PER_SECTOR) % 20;
            const baseNumber = SECTORS[sectorIndex];

            let multiplier = 1;
            let text = '';
            let points = 0;
            let isTreble = false;
            let isDouble = false;
            let isBull = false;

            if (dist <= this.rInnerBull) {
                points = 50;
                text = 'BULLSEYE! (50)';
                isBull = true;
                isDouble = true;
            } else if (dist <= this.rOuterBull) {
                points = 25;
                text = 'OUTER BULL (25)';
                isBull = true;
            } else if (dist > this.rTrebleInner && dist <= this.rTrebleOuter) {
                multiplier = 3;
                points = baseNumber * 3;
                text = `TREBLE ${baseNumber} (${points})`;
                isTreble = true;
            } else if (dist > this.rDoubleInner && dist <= this.rDoubleOuter) {
                multiplier = 2;
                points = baseNumber * 2;
                text = `DOUBLE ${baseNumber} (${points})`;
                isDouble = true;
            } else if (dist <= this.rDoubleOuter) {
                multiplier = 1;
                points = baseNumber;
                text = `SINGLE ${baseNumber}`;
            } else {
                points = 0;
                text = 'MISS! (0)';
            }

            return { points, text, multiplier, isTreble, isDouble, isBull, baseNumber, x, y };
        }

        onDartLanded(hit) {
            this.boardDarts.push(hit);
            this.spawnParticles(hit.x, hit.y, hit.isTreble ? '#f59e0b' : (hit.isDouble ? '#ef4444' : '#06b6d4'));

            if (hit.points > 0) {
                if (window.dartAudio) window.dartAudio.playHit(hit.isTreble, hit.isBull);
            } else {
                if (window.dartAudio) window.dartAudio.playMiss();
            }

            const p = this.players[this.activePlayerIdx];
            p.dartsThrown++;
            p.turnDarts.push(hit);
            this.turnDartCount++;

            const newScore = p.score - hit.points;

            if (newScore === 0 && (!this.doubleOut || hit.isDouble)) {
                p.score = 0;
                this.gameOver = true;
                this.updateHUD();
                if (window.dartAudio) {
                    window.dartAudio.playCrowdCheer();
                    window.dartAudio.announce(`Game Shot, and the match! ${p.name} wins!`);
                }
                this.showCallout(`🏆 ${p.name.toUpperCase()} WINS!`);
                return;
            } else if (newScore < 0 || (this.doubleOut && newScore === 1)) {
                p.score = p.startTurnScore;
                this.showCallout('⚡ BUST!');
                if (window.dartAudio) window.dartAudio.announce('Bust!');
                this.endTurn();
                return;
            } else {
                p.score = newScore;
            }

            this.updateHUD();

            if (this.turnDartCount >= 3) {
                const turnTotal = p.turnDarts.reduce((acc, d) => acc + d.points, 0);
                if (turnTotal === 180) {
                    if (window.dartAudio) {
                        window.dartAudio.announce('ONE HUNDRED AND EIGHTY!');
                        window.dartAudio.playCrowdCheer();
                    }
                    this.showCallout('🔥 ONE HUNDRED & EIGHTY!');
                } else if (turnTotal >= 100) {
                    if (window.dartAudio) window.dartAudio.announce(`${turnTotal}!`);
                    this.showCallout(`⭐ ${turnTotal}!`);
                } else {
                    if (window.dartAudio) window.dartAudio.announce(`${turnTotal}`);
                }
                this.endTurn();
            } else {
                if (this.gameMode === 'bot' && this.activePlayerIdx === 1) {
                    this.triggerBotThrow();
                }
            }
        }

        endTurn() {
            setTimeout(() => {
                if (this.gameOver) return;

                this.boardDarts = [];
                this.turnDartCount = 0;
                this.activePlayerIdx = (this.activePlayerIdx + 1) % 2;
                this.players[this.activePlayerIdx].startTurnScore = this.players[this.activePlayerIdx].score;
                this.players[this.activePlayerIdx].turnDarts = [];

                this.updateHUD();

                if (this.gameMode === 'bot' && this.activePlayerIdx === 1) {
                    this.triggerBotThrow();
                }
            }, 1200);
        }

        spawnParticles(x, y, color) {
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.5 + Math.random() * 4.5;
                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                    decay: 0.03 + Math.random() * 0.03,
                    color: color,
                    size: 2 + Math.random() * 3
                });
            }
        }

        showCallout(text) {
            const banner = document.getElementById('calloutBanner');
            if (banner) {
                banner.textContent = text;
                banner.classList.add('show');
                setTimeout(() => {
                    banner.classList.remove('show');
                }, 1800);
            }
        }

        updateHUD() {
            const p1 = this.players[0];
            const p1ScoreEl = document.getElementById('p1Score');
            const p1AvgEl = document.getElementById('p1Avg');
            const p1DartsEl = document.getElementById('p1Darts');
            const p1Card = document.getElementById('p1Card');
            const p1Hint = document.getElementById('p1Checkout');

            if (p1ScoreEl) p1ScoreEl.textContent = p1.score;
            if (p1DartsEl) p1DartsEl.textContent = p1.dartsThrown;
            if (p1AvgEl) {
                const avg = p1.dartsThrown > 0 ? (((parseInt(this.gameType, 10) - p1.score) / p1.dartsThrown) * 3).toFixed(1) : '0.0';
                p1AvgEl.textContent = avg;
            }
            if (p1Card) {
                if (this.activePlayerIdx === 0 && !this.gameOver) p1Card.classList.add('active-turn');
                else p1Card.classList.remove('active-turn');
            }
            if (p1Hint) {
                const hint = CHECKOUT_HINTS[p1.score];
                if (hint) {
                    p1Hint.textContent = `🎯 Finish: ${hint}`;
                    p1Hint.classList.add('visible');
                } else {
                    p1Hint.classList.remove('visible');
                }
            }

            const p2 = this.players[1];
            const p2ScoreEl = document.getElementById('p2Score');
            const p2AvgEl = document.getElementById('p2Avg');
            const p2DartsEl = document.getElementById('p2Darts');
            const p2Card = document.getElementById('p2Card');
            const p2Hint = document.getElementById('p2Checkout');
            const p2NameEl = document.getElementById('p2Name');
            const p2AvatarEl = document.getElementById('p2Avatar');

            if (p2NameEl) p2NameEl.textContent = p2.name;
            if (p2AvatarEl) p2AvatarEl.textContent = p2.avatar;
            if (p2ScoreEl) p2ScoreEl.textContent = p2.score;
            if (p2DartsEl) p2DartsEl.textContent = p2.dartsThrown;
            if (p2AvgEl) {
                const avg2 = p2.dartsThrown > 0 ? (((parseInt(this.gameType, 10) - p2.score) / p2.dartsThrown) * 3).toFixed(1) : '0.0';
                p2AvgEl.textContent = avg2;
            }
            if (p2Card) {
                if (this.activePlayerIdx === 1 && !this.gameOver) p2Card.classList.add('active-turn');
                else p2Card.classList.remove('active-turn');
            }
            if (p2Hint) {
                const hint2 = CHECKOUT_HINTS[p2.score];
                if (hint2) {
                    p2Hint.textContent = `🎯 Finish: ${hint2}`;
                    p2Hint.classList.add('visible');
                } else {
                    p2Hint.classList.remove('visible');
                }
            }

            const activePlayer = this.players[this.activePlayerIdx];
            for (let i = 1; i <= 3; i++) {
                const slot = document.getElementById(`dartSlot${i}`);
                const slotVal = document.getElementById(`dartVal${i}`);
                if (slot && slotVal) {
                    const dartHit = activePlayer.turnDarts[i - 1];
                    if (dartHit) {
                        slot.classList.add('filled');
                        slotVal.textContent = dartHit.points;
                    } else {
                        slot.classList.remove('filled');
                        slotVal.textContent = '—';
                    }
                }
            }
        }

        drawDartboard() {
            const ctx = this.ctx;
            const center = this.boardCenter;
            const rBoard = this.boardRadius;

            ctx.save();

            // 1. Deep 3D Ambient Drop Shadow on Board
            ctx.beginPath();
            ctx.arc(center.x + 14, center.y + 20, rBoard + 36, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.shadowBlur = 35;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (this.assets && this.assets.boardReady && this.assets.boardCanvas) {
                // 3D Photorealistic Tournament Dartboard Asset
                const totalR = rBoard * 1.25;
                ctx.drawImage(
                    this.assets.boardCanvas,
                    center.x - totalR,
                    center.y - totalR,
                    totalR * 2,
                    totalR * 2
                );
            } else {
                // 2. Heavy Dark-Steel Outer Rim with Metallic Bevel Glint & 12 Perimeter Rivets
                const outerRimR = rBoard + 32;
                const rimGrad = ctx.createLinearGradient(center.x - outerRimR, center.y - outerRimR, center.x + outerRimR, center.y + outerRimR);
                rimGrad.addColorStop(0, '#334155');
                rimGrad.addColorStop(0.25, '#1e293b');
                rimGrad.addColorStop(0.5, '#475569');
                rimGrad.addColorStop(0.75, '#0f172a');
                rimGrad.addColorStop(1, '#1e293b');

                ctx.beginPath();
                ctx.arc(center.x, center.y, outerRimR, 0, Math.PI * 2);
                ctx.fillStyle = rimGrad;
                ctx.fill();
                ctx.lineWidth = 3.5;
                ctx.strokeStyle = '#64748b';
                ctx.stroke();

                // 12 Perimeter Rivet Fasteners with Metallic Highlights
                for (let r = 0; r < 12; r++) {
                    const rAngle = (r * Math.PI * 2) / 12;
                    const rx = center.x + Math.cos(rAngle) * (outerRimR - 6);
                    const ry = center.y + Math.sin(rAngle) * (outerRimR - 6);
                    ctx.beginPath();
                    ctx.arc(rx, ry, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fill();
                    ctx.strokeStyle = '#0f172a';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // 3. Matte Charcoal Number Ring Band
                ctx.beginPath();
                ctx.arc(center.x, center.y, rBoard + 20, 0, Math.PI * 2);
                ctx.fillStyle = '#0f172a';
                ctx.fill();

                // Inner Metallic Separator Ring
                ctx.beginPath();
                ctx.arc(center.x, center.y, this.rDoubleOuter, 0, Math.PI * 2);
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = '#cbd5e1';
                ctx.stroke();

                // 4. 20 Alternating Authentic Sisal Segments (Ivory Cream #f5f0e6 vs Jet Black #141416)
                for (let i = 0; i < 20; i++) {
                    const startAngle = -Math.PI / 2 + (i - 0.5) * ANGLE_PER_SECTOR;
                    const endAngle = startAngle + ANGLE_PER_SECTOR;
                    const isEven = i % 2 === 0;

                    // Single Bed Base
                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.arc(center.x, center.y, this.rDoubleOuter, startAngle, endAngle);
                    ctx.closePath();
                    ctx.fillStyle = isEven ? '#141416' : '#f5f0e6';
                    ctx.fill();

                    // Double Ring (Tournament Crimson Red #d92525 vs Emerald Green #0d9448)
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, this.rDoubleOuter, startAngle, endAngle);
                    ctx.arc(center.x, center.y, this.rDoubleInner, endAngle, startAngle, true);
                    ctx.closePath();
                    ctx.fillStyle = isEven ? '#d92525' : '#0d9448';
                    ctx.fill();

                    // Treble Ring (Tournament Crimson Red #d92525 vs Emerald Green #0d9448)
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, this.rTrebleOuter, startAngle, endAngle);
                    ctx.arc(center.x, center.y, this.rTrebleInner, endAngle, startAngle, true);
                    ctx.closePath();
                    ctx.fillStyle = isEven ? '#d92525' : '#0d9448';
                    ctx.fill();
                }

                // 5. Dual-Ring Bullseye: Emerald Green Outer Bull (25 pts) & Crimson Red Inner Bull (50 pts)
                ctx.beginPath();
                ctx.arc(center.x, center.y, this.rOuterBull, 0, Math.PI * 2);
                ctx.fillStyle = '#0d9448';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(center.x, center.y, this.rInnerBull, 0, Math.PI * 2);
                ctx.fillStyle = '#d92525';
                ctx.fill();

                // 6. High-Tensile Silver Spider Blade Wires (Metallic Dividers with Glint)
                ctx.save();
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1.6;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 1.5;

                // Radial Sector Dividers
                for (let i = 0; i < 20; i++) {
                    const angle = -Math.PI / 2 + (i - 0.5) * ANGLE_PER_SECTOR;
                    ctx.beginPath();
                    ctx.moveTo(center.x + Math.cos(angle) * this.rOuterBull, center.y + Math.sin(angle) * this.rOuterBull);
                    ctx.lineTo(center.x + Math.cos(angle) * this.rDoubleOuter, center.y + Math.sin(angle) * this.rDoubleOuter);
                    ctx.stroke();
                }

                // Concentric Ring Wires
                [this.rInnerBull, this.rOuterBull, this.rTrebleInner, this.rTrebleOuter, this.rDoubleInner, this.rDoubleOuter].forEach(r => {
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
                    ctx.stroke();
                });
                ctx.restore();

                // 7. Crisp, Bold White Tournament Numbers (20, 1, 18, 4, 13...)
                ctx.save();
                ctx.font = '900 22px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetY = 1.5;

                for (let i = 0; i < 20; i++) {
                    const angle = -Math.PI / 2 + i * ANGLE_PER_SECTOR;
                    const numR = rBoard + 11;
                    const nx = center.x + Math.cos(angle) * numR;
                    const ny = center.y + Math.sin(angle) * numR;

                    ctx.fillText(SECTORS[i], nx, ny);
                }
                ctx.restore();
            }

            ctx.restore();
        }

        drawBoardDarts() {
            const ctx = this.ctx;
            this.boardDarts.forEach(dart => {
                ctx.save();
                ctx.translate(dart.x, dart.y);
                ctx.rotate(dart.angle || 0);

                const isP2 = dart.playerIdx === 1;
                const isReady = isP2 ? (this.assets && this.assets.dartBlueReady) : (this.assets && this.assets.dartRedReady);
                const dartCanvas = isP2 ? (this.assets && this.assets.dartBlueCanvas) : (this.assets && this.assets.dartRedCanvas);

                if (isReady && dartCanvas) {
                    // Soft Impact Drop Shadow
                    ctx.beginPath();
                    ctx.ellipse(10, 24, 18, 8, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                    ctx.fill();

                    // 3D Rendered Dart
                    const dw = 48;
                    const dh = dw * (dartCanvas.height / dartCanvas.width);
                    ctx.drawImage(dartCanvas, -dw * 0.503, -dh * 0.042, dw, dh);
                } else {
                    const themeColor = isP2 ? '#2563eb' : '#dc2626';

                    // Soft Impact Drop Shadow
                    ctx.beginPath();
                    ctx.ellipse(8, 14, 14, 6, Math.PI / 5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                    ctx.fill();

                    // Stainless Steel Needle Point
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(-2.5, 14);
                    ctx.lineTo(2.5, 14);
                    ctx.closePath();
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fill();
                    ctx.strokeStyle = '#0f172a';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Tungsten Barrel with Anodized Rings
                    const barrelGrad = ctx.createLinearGradient(-5, 0, 5, 0);
                    barrelGrad.addColorStop(0, '#64748b');
                    barrelGrad.addColorStop(0.3, '#f8fafc');
                    barrelGrad.addColorStop(1, '#1e293b');

                    ctx.beginPath();
                    ctx.moveTo(-3, 14);
                    ctx.lineTo(3, 14);
                    ctx.lineTo(5, 18);
                    ctx.lineTo(4.5, 34);
                    ctx.lineTo(-4.5, 34);
                    ctx.lineTo(-5, 18);
                    ctx.closePath();
                    ctx.fillStyle = barrelGrad;
                    ctx.fill();
                    ctx.strokeStyle = '#0f172a';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();

                    // Anodized Ribbed Grip Rings
                    [18, 22, 26, 30].forEach(gy => {
                        ctx.fillStyle = themeColor;
                        ctx.fillRect(-4.5, gy, 9, 2);
                    });

                    // Aluminum Stem
                    ctx.fillStyle = '#94a3b8';
                    ctx.fillRect(-2, 34, 4, 16);
                    ctx.strokeStyle = '#0f172a';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(-2, 34, 4, 16);

                    // 3D Aerodynamic Quad-Fin Flights
                    ctx.beginPath();
                    ctx.moveTo(-2, 50);
                    ctx.lineTo(-18, 45);
                    ctx.lineTo(-22, 76);
                    ctx.lineTo(0, 68);
                    ctx.lineTo(22, 76);
                    ctx.lineTo(18, 45);
                    ctx.lineTo(2, 50);
                    ctx.closePath();

                    const flightGrad = ctx.createLinearGradient(-22, 0, 22, 0);
                    flightGrad.addColorStop(0, themeColor);
                    flightGrad.addColorStop(0.5, '#0f172a');
                    flightGrad.addColorStop(1, themeColor);
                    ctx.fillStyle = flightGrad;
                    ctx.fill();
                    ctx.strokeStyle = '#0f172a';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }

                ctx.restore();
            });
        }

        drawFlyingDart() {
            if (!this.flyingDart) return;

            const fd = this.flyingDart;
            fd.progress += fd.speed;

            if (fd.progress >= 1) {
                const hit = this.scoreHit(fd.targetX, fd.targetY);
                this.flyingDart = null;
                this.onDartLanded(hit);
                return;
            }

            const t = fd.progress;
            fd.x = fd.startX + (fd.targetX - fd.startX) * t;
            const linearY = fd.startY + (fd.targetY - fd.startY) * t;
            const arcOffset = -Math.sin(t * Math.PI) * 75;
            fd.y = linearY + arcOffset;
            fd.scale = 1.0 - t * 0.55;

            const ctx = this.ctx;
            ctx.save();
            ctx.translate(fd.x, fd.y);
            ctx.scale(fd.scale, fd.scale);

            const isP2 = fd.playerIdx === 1;
            const isReady = isP2 ? (this.assets && this.assets.dartBlueReady) : (this.assets && this.assets.dartRedReady);
            const dartCanvas = isP2 ? (this.assets && this.assets.dartBlueCanvas) : (this.assets && this.assets.dartRedCanvas);

            if (isReady && dartCanvas) {
                // Drop shadow
                ctx.beginPath();
                ctx.ellipse(12, 32, 22, 10, Math.PI / 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fill();

                const dw = 95;
                const dh = dw * (dartCanvas.height / dartCanvas.width);
                ctx.drawImage(dartCanvas, -dw * 0.503, -dh * 0.042, dw, dh);
            } else {
                const themeColor = isP2 ? '#2563eb' : '#dc2626';

                // Stainless Steel Needle Point
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-3, 20);
                ctx.lineTo(3, 20);
                ctx.closePath();
                ctx.fillStyle = '#cbd5e1';
                ctx.fill();
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Knurled Tungsten Barrel
                const barrelGrad = ctx.createLinearGradient(-6, 0, 6, 0);
                barrelGrad.addColorStop(0, '#64748b');
                barrelGrad.addColorStop(0.3, '#f8fafc');
                barrelGrad.addColorStop(1, '#1e293b');

                ctx.beginPath();
                ctx.moveTo(-3.5, 20);
                ctx.lineTo(3.5, 20);
                ctx.lineTo(6, 26);
                ctx.lineTo(5.5, 46);
                ctx.lineTo(-5.5, 46);
                ctx.lineTo(-6, 26);
                ctx.closePath();
                ctx.fillStyle = barrelGrad;
                ctx.fill();
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 1.4;
                ctx.stroke();

                // Anodized Grip Rings
                [26, 31, 36, 41].forEach(gy => {
                    ctx.fillStyle = themeColor;
                    ctx.fillRect(-5.5, gy, 11, 2.5);
                });

                // Aluminum Stem
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(-2.5, 46, 5, 20);
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(-2.5, 46, 5, 20);

                // Aerodynamic Flight
                ctx.beginPath();
                ctx.moveTo(-2.5, 66);
                ctx.lineTo(-24, 60);
                ctx.lineTo(-28, 100);
                ctx.lineTo(0, 90);
                ctx.lineTo(28, 100);
                ctx.lineTo(24, 60);
                ctx.lineTo(2.5, 66);
                ctx.closePath();

                const flightGrad = ctx.createLinearGradient(-28, 0, 28, 0);
                flightGrad.addColorStop(0, themeColor);
                flightGrad.addColorStop(0.5, '#0f172a');
                flightGrad.addColorStop(1, themeColor);
                ctx.fillStyle = flightGrad;
                ctx.fill();
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.restore();
        }

        drawParticles() {
            const ctx = this.ctx;
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();
            }
        }

        drawAimReticle() {
            if (!this.isAiming || !this.dragStart || !this.dragCurrent) return;

            const ctx = this.ctx;
            const dx = this.dragCurrent.x - this.dragStart.x;
            const dy = this.dragCurrent.y - this.dragStart.y;
            const dist = Math.hypot(dx, dy);

            let targetX, targetY;
            if (dist < 15) {
                targetX = this.dragCurrent.x;
                targetY = this.dragCurrent.y;
            } else {
                targetX = this.dragStart.x - dx * 1.3;
                targetY = this.dragStart.y - dy * 1.3;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(targetX, targetY, 18, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
            ctx.setLineDash([4, 4]);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(targetX - 24, targetY);
            ctx.lineTo(targetX + 24, targetY);
            ctx.moveTo(targetX, targetY - 24);
            ctx.lineTo(targetX, targetY + 24);
            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.dragStart.x, this.dragStart.y);
            ctx.lineTo(this.dragCurrent.x, this.dragCurrent.y);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.stroke();

            ctx.restore();
        }

        render() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawDartboard();
            this.drawBoardDarts();
            this.drawParticles();
            this.drawAimReticle();
            this.drawFlyingDart();
        }

        startLoop() {
            const loop = () => {
                this.render();
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
    }

    // Initialize Game Instance on Load
    window.addEventListener('DOMContentLoaded', () => {
        window.dartGame = new DartGame();

        const modeModal = document.getElementById('modeModal');
        const btnChangeMode = document.getElementById('btnChangeMode');
        const btnStartMatch = document.getElementById('btnStartMatch');
        const btnMute = document.getElementById('btnMute');
        const btnRestart = document.getElementById('btnRestart');

        if (btnChangeMode && modeModal) {
            btnChangeMode.addEventListener('click', () => {
                modeModal.classList.add('active');
            });
        }

        if (btnMute) {
            btnMute.addEventListener('click', () => {
                if (window.dartAudio) {
                    const isMuted = window.dartAudio.toggleMute();
                    btnMute.textContent = isMuted ? '🔇' : '🔊';
                }
            });
        }

        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                if (window.dartGame) window.dartGame.resetMatch();
            });
        }

        const modeBtns = document.querySelectorAll('.mode-btn');
        const roomBox = document.getElementById('roomInputBox');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const selectedMode = btn.getAttribute('data-mode');
                if (window.dartGame) window.dartGame.gameMode = selectedMode;

                if (roomBox) {
                    if (selectedMode === 'online') roomBox.classList.add('visible');
                    else roomBox.classList.remove('visible');
                }
            });
        });

        const scorePills = document.querySelectorAll('.score-pill');
        scorePills.forEach(pill => {
            pill.addEventListener('click', () => {
                scorePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                if (window.dartGame) window.dartGame.gameType = pill.getAttribute('data-score');
            });
        });

        const diffPills = document.querySelectorAll('.diff-pill');
        diffPills.forEach(pill => {
            pill.addEventListener('click', () => {
                diffPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                if (window.dartGame) window.dartGame.botDifficulty = pill.getAttribute('data-diff');
            });
        });

        if (btnStartMatch && modeModal) {
            btnStartMatch.addEventListener('click', () => {
                const roomInput = document.getElementById('roomCodeInput');
                if (roomInput && roomInput.value.trim() && window.dartGame) {
                    window.dartGame.roomCode = roomInput.value.trim().toUpperCase();
                    window.dartGame.initMultiplayerChannel();
                }
                modeModal.classList.remove('active');
                if (window.dartGame) window.dartGame.resetMatch();
            });
        }
    });
})();
