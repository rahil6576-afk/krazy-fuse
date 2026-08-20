// Elevator of Doom 99 - Complete Game Engine
const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');

// Game States
const STATE = {
    LOBBY: 'LOBBY',
    TRANSITION: 'TRANSITION',
    DOOM_EVENT: 'DOOM_EVENT',
    GAMEOVER: 'GAMEOVER',
    VICTORY: 'VICTORY'
};

let gameState = STATE.LOBBY;
let currentFloor = 1;
let targetFloor = 1;
let survivalRounds = 0;
let sabotagesCount = 0;
let shakeTime = 0;
let eventTimer = 0;
let currentEvent = null;

// Elevator Dimensions
const ELEVATOR = {
    x: 120,
    y: 90,
    w: 660,
    h: 460,
    floorY: 520,
    ceilingY: 120
};

// Floor Tiles (6 tiles)
let floorTiles = [];
function resetFloorTiles() {
    floorTiles = [];
    const tileWidth = ELEVATOR.w / 6;
    for (let i = 0; i < 6; i++) {
        floorTiles.push({
            x: ELEVATOR.x + i * tileWidth,
            w: tileWidth,
            active: true,
            blinking: false,
            dropY: 0
        });
    }
}

// 8 Players Roster
const ROSTER = [
    { name: 'You', color: '#38bdf8', emoji: '🧑💼', isPlayer: true },
    { name: 'Chad', color: '#f59e0b', emoji: '💪', isPlayer: false },
    { name: 'Karen', color: '#ec4899', emoji: '👩💼', isPlayer: false },
    { name: 'Bob', color: '#10b981', emoji: '👨🔧', isPlayer: false },
    { name: 'Luna', color: '#c084fc', emoji: '🧙♀️', isPlayer: false },
    { name: 'Dave', color: '#f43f5e', emoji: '🧢', isPlayer: false },
    { name: 'Bot-99', color: '#64748b', emoji: '🤖', isPlayer: false },
    { name: 'Glitch', color: '#84cc16', emoji: '👾', isPlayer: false }
];

let players = [];
let particles = [];
let floatingItems = [];
let barks = [];

// Player Class
class Passenger {
    constructor(info, index) {
        this.name = info.name;
        this.color = info.color;
        this.emoji = info.emoji;
        this.isPlayer = info.isPlayer;
        this.index = index;

        this.w = 32;
        this.h = 44;
        this.x = ELEVATOR.x + 80 + index * 65;
        this.y = ELEVATOR.floorY - this.h;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = true;
        this.isCrouching = false;
        this.isAlive = true;
        this.gravityReversed = false;
        this.hasBomb = false;
        this.frozenTimer = 0;
        this.barkText = '';
        this.barkTimer = 0;

        // Ability
        this.ability = 'PUSH';
        this.abilityCooldown = 0;
    }

    bark(msg) {
        this.barkText = msg;
        this.barkTimer = 120;
    }

    update() {
        if (!this.isAlive) return;

        if (this.barkTimer > 0) this.barkTimer--;
        if (this.frozenTimer > 0) {
            this.frozenTimer--;
            return;
        }
        if (this.abilityCooldown > 0) this.abilityCooldown--;

        // Gravity
        const grav = this.gravityReversed ? -0.65 : 0.65;
        this.vy += grav;

        // Apply movement with max velocity cap
        this.vx = Math.max(-4.5, Math.min(4.5, this.vx));
        this.x += this.vx;
        this.y += this.vy;

        // Smooth Friction
        this.vx *= 0.84;

        // Elevator Wall bounds
        if (this.x < ELEVATOR.x + 10) {
            this.x = ELEVATOR.x + 10;
            this.vx = 0;
        }
        if (this.x + this.w > ELEVATOR.x + ELEVATOR.w - 10) {
            this.x = ELEVATOR.x + ELEVATOR.w - 10 - this.w;
            this.vx = 0;
        }

        // Floor / Ceiling check
        if (!this.gravityReversed) {
            // Normal gravity
            const currentTile = floorTiles.find(t => this.x + this.w/2 >= t.x && this.x + this.w/2 <= t.x + t.w);
            if (currentTile && currentTile.active && this.y + this.h >= ELEVATOR.floorY) {
                this.y = ELEVATOR.floorY - this.h;
                this.vy = 0;
                this.isGrounded = true;
            } else if (this.y > 620) {
                this.eliminate('Fell through collapsed floor!');
            }
        } else {
            // Inverted gravity
            if (this.y <= ELEVATOR.ceilingY + 10) {
                this.y = ELEVATOR.ceilingY + 10;
                this.vy = 0;
                this.isGrounded = true;
            }
        }

        // AI Logic for bots
        if (!this.isPlayer) {
            this.updateAI();
        }
    }

    updateAI() {
        // Controlled bot reacting to current event
        if (currentEvent) {
            if (currentEvent.type === 'COLLAPSE') {
                // Find safe tile
                const safeTile = floorTiles.find(t => t.active && !t.blinking);
                if (safeTile) {
                    const targetX = safeTile.x + safeTile.w / 2;
                    if (this.x < targetX - 8) this.vx += 0.45;
                    else if (this.x > targetX + 8) this.vx -= 0.45;
                }
            } else if (currentEvent.type === 'LASER') {
                if (currentEvent.laserY > 400 && this.isGrounded && Math.random() < 0.12) {
                    this.jump();
                } else if (currentEvent.laserY <= 400) {
                    this.isCrouching = true;
                }
            } else if (currentEvent.type === 'BOMB') {
                if (this.hasBomb) {
                    // Chase nearest player to pass bomb
                    const other = players.find(p => p !== this && p.isAlive);
                    if (other) {
                        if (this.x < other.x) this.vx += 0.55;
                        else this.vx -= 0.55;
                    }
                } else {
                    // Run away from bomb holder
                    const bombHolder = players.find(p => p.hasBomb && p.isAlive);
                    if (bombHolder) {
                        if (this.x < bombHolder.x) this.vx -= 0.5;
                        else this.vx += 0.5;
                    }
                }
            }
        }

        // Random bot sabotage barks
        if (Math.random() < 0.002) {
            const botBarks = ['DON’T PUSH ME!', 'WHO DID THAT?!', 'I REGRET THIS ELEVATOR', 'FLOOR 99 OR BUST!', 'WATCH OUT!'];
            this.bark(botBarks[Math.floor(Math.random() * botBarks.length)]);
        }

        // Random AI Push
        if (Math.random() < 0.008 && this.abilityCooldown <= 0) {
            this.useAbility();
        }
    }

    jump() {
        if (this.isGrounded) {
            this.vy = this.gravityReversed ? 11.5 : -11.5;
            this.isGrounded = false;
            if (this.isPlayer) window.doomAudio.playJump();
        }
    }

    useAbility() {
        if (this.abilityCooldown > 0 || !this.isAlive) return;
        this.abilityCooldown = 180; // 3 sec cooldown

        // Push nearby players with balanced impulse
        players.forEach(p => {
            if (p !== this && p.isAlive) {
                const dist = Math.hypot((this.x + this.w/2) - (p.x + p.w/2), (this.y + this.h/2) - (p.y + p.h/2));
                if (dist < 70) {
                    const dir = p.x > this.x ? 1 : -1;
                    p.vx += dir * 9;
                    p.vy -= 4;
                    createImpactSparks(p.x, p.y);
                    if (this.isPlayer) {
                        sabotagesCount++;
                        p.bark('HEY! WHO PUSHED ME?!');
                        window.doomAudio.playPunch();
                    }
                }
            }
        });
    }

    eliminate(reason) {
        if (!this.isAlive) return;
        this.isAlive = false;
        createDeathExplosion(this.x + this.w/2, this.y + this.h/2, this.color);
        window.doomAudio.playExplosion();

        if (this.isPlayer) {
            document.getElementById('spectator-hud').classList.remove('hidden');
            setTimeout(() => {
                endGame(false, reason);
            }, 1200);
        }

        updateAliveHUD();
    }

    draw() {
        if (!this.isAlive) return;

        ctx.save();
        // Draw Character
        const drawH = this.isCrouching ? this.h * 0.6 : this.h;
        const drawY = this.y + (this.h - drawH);

        // Body Capsule
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.isPlayer ? 14 : 4;
        ctx.beginPath();
        ctx.roundRect(this.x, drawY, this.w, drawH, 8);
        ctx.fill();

        // Face & Emoji
        ctx.font = '18px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.emoji, this.x + this.w / 2, drawY + 22);

        // Name tag
        ctx.fillStyle = this.isPlayer ? '#38bdf8' : '#e2e8f0';
        ctx.font = this.isPlayer ? 'bold 11px Outfit' : '10px Outfit';
        ctx.fillText(this.name, this.x + this.w / 2, drawY - 6);

        // Ticking Bomb Tag
        if (this.hasBomb) {
            ctx.fillText('💣', this.x + this.w / 2, drawY - 18);
        }

        // Bark bubble
        if (this.barkTimer > 0 && this.barkText) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1;
            const tw = ctx.measureText(this.barkText).width + 12;
            ctx.beginPath();
            ctx.roundRect(this.x + this.w/2 - tw/2, drawY - 36, tw, 20, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px Outfit';
            ctx.fillText(this.barkText, this.x + this.w/2, drawY - 22);
        }

        ctx.restore();
    }
}

// Particle Engine
function createImpactSparks(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30,
            color: '#facc15'
        });
    }
}

function createDeathExplosion(x, y, color) {
    for (let i = 0; i < 24; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            life: 45,
            color
        });
    }
}

// DOOM EVENT LIST & GENERATOR (Tuned for smooth, fair reaction time)
const DOOM_TYPES = [
    { type: 'COLLAPSE', title: 'WARNING: FLOOR IS COLLAPSING!', icon: '💥', duration: 420 },
    { type: 'LASER', title: 'SWEEPING LASER BEAM — DUCK OR JUMP!', icon: '⚡', duration: 380 },
    { type: 'BOMB', title: 'HOT POTATO BOMB — PASS IT NOW!', icon: '💣', duration: 420 },
    { type: 'BLACKOUT', title: 'LIGHTS OUT — AVOID THE GHOST!', icon: '👻', duration: 380 },
    { type: 'FLOOD', title: 'ACID SLIME RISING — GET ON CRATES!', icon: '🧪', duration: 400 },
    { type: 'GRAVITY', title: 'GRAVITY REVERSAL ANOMALY!', icon: '🔄', duration: 360 }
];

function triggerRandomDoom() {
    if (currentFloor >= 99) {
        // Floor 99: Final Doom Escape Hatch
        currentEvent = {
            type: 'ESCAPE_HATCH',
            title: 'DOOM FLOOR 99: JUMP INTO ESCAPE HATCH!',
            icon: '🏆',
            duration: 500,
            hatchX: ELEVATOR.x + ELEVATOR.w / 2 - 30,
            hatchY: ELEVATOR.floorY - 60
        };
        showDoomBanner(currentEvent.title, currentEvent.icon);
        window.doomAudio.playAlarm();
        return;
    }

    const template = DOOM_TYPES[Math.floor(Math.random() * DOOM_TYPES.length)];
    currentEvent = { ...template };

    showDoomBanner(currentEvent.title, currentEvent.icon);
    window.doomAudio.playAlarm();

    if (currentEvent.type === 'COLLAPSE') {
        // Pick 2-3 random floor tiles to collapse with generous warning
        const indices = [0, 1, 2, 3, 4, 5].sort(() => 0.5 - Math.random()).slice(0, 2);
        indices.forEach(idx => {
            floorTiles[idx].blinking = true;
            setTimeout(() => {
                floorTiles[idx].active = false;
                shakeTime = 25;
            }, 3200); // 3.2s fair warning
        });
    } else if (currentEvent.type === 'LASER') {
        currentEvent.laserY = Math.random() < 0.5 ? 490 : 440; // Ankle or Head height
        currentEvent.laserX = ELEVATOR.x;
    } else if (currentEvent.type === 'BOMB') {
        const aliveOnes = players.filter(p => p.isAlive);
        if (aliveOnes.length > 0) {
            const lucky = aliveOnes[Math.floor(Math.random() * aliveOnes.length)];
            lucky.hasBomb = true;
            lucky.bark('OH NO! I HAVE THE BOMB!');
        }
    } else if (currentEvent.type === 'GRAVITY') {
        players.forEach(p => p.gravityReversed = true);
    }
}

function showDoomBanner(text, icon) {
    const banner = document.getElementById('doom-event-banner');
    document.getElementById('doom-event-icon').textContent = icon;
    document.getElementById('doom-event-text').textContent = text;
    banner.classList.remove('hidden');
}

function hideDoomBanner() {
    document.getElementById('doom-event-banner').classList.add('hidden');
}

// Game Flow: Floor Transitions
function nextFloorTransition() {
    gameState = STATE.TRANSITION;
    hideDoomBanner();
    resetFloorTiles();
    players.forEach(p => {
        p.gravityReversed = false;
        p.hasBomb = false;
    });

    // Close Doors
    document.getElementById('door-left').classList.add('closed');
    document.getElementById('door-right').classList.add('closed');
    window.doomAudio.playDing();

    survivalRounds++;
    targetFloor = Math.min(99, currentFloor + Math.floor(Math.random() * 12) + 7);

    let floorTick = setInterval(() => {
        if (currentFloor < targetFloor) {
            currentFloor++;
            document.getElementById('hud-floor-text').textContent = 'FLOOR ' + currentFloor;
        } else {
            clearInterval(floorTick);
            setTimeout(() => {
                // Open Doors & Trigger Doom
                document.getElementById('door-left').classList.remove('closed');
                document.getElementById('door-right').classList.remove('closed');
                gameState = STATE.DOOM_EVENT;
                triggerRandomDoom();
            }, 600);
        }
    }, 60);
}

function updateAliveHUD() {
    const aliveCount = players.filter(p => p.isAlive).length;
    document.getElementById('hud-alive-count').textContent = `${aliveCount}/8 ALIVE`;
}

function initMatch() {
    currentFloor = 1;
    survivalRounds = 0;
    sabotagesCount = 0;
    particles = [];
    resetFloorTiles();

    players = ROSTER.map((info, idx) => new Passenger(info, idx));
    updateAliveHUD();

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('spectator-hud').classList.add('hidden');

    nextFloorTransition();
}

function endGame(victory, reason) {
    gameState = victory ? STATE.VICTORY : STATE.GAMEOVER;
    const box = document.getElementById('gameover-screen');
    box.classList.remove('hidden');

    const badge = document.getElementById('gameover-badge');
    const title = document.getElementById('gameover-title');
    const sub = document.getElementById('gameover-subtitle');

    if (victory) {
        badge.textContent = '🏆 DOOM SURVIVOR';
        badge.style.borderColor = '#10b981';
        badge.style.color = '#10b981';
        title.textContent = 'YOU CONQUERED FLOOR 99!';
        sub.textContent = 'You escaped the Elevator of Doom alive!';
        window.doomAudio.playVictory();
    } else {
        badge.textContent = '💀 ELIMINATED';
        badge.style.borderColor = '#ef4444';
        badge.style.color = '#ef4444';
        title.textContent = 'You Were Eliminated!';
        sub.textContent = `Floor ${currentFloor}: ${reason || 'Crushed by the elevator doom.'}`;
    }

    document.getElementById('res-floor').textContent = 'Floor ' + currentFloor;
    document.getElementById('res-dooms').textContent = survivalRounds;
    document.getElementById('res-sabotages').textContent = sabotagesCount;
    document.getElementById('res-rank').textContent = victory ? '🥇 Elevator Legend' : (currentFloor > 60 ? '🥈 Chaos Veteran' : '💀 Certified Splat');
}

// Input Handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    if (e.code === 'KeyE' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        const player = players.find(p => p.isPlayer);
        if (player) player.useAbility();
    }

    if (e.code === 'Space' && (gameState === STATE.GAMEOVER || gameState === STATE.VICTORY)) {
        initMatch();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Update & Render Loop
function update() {
    if (shakeTime > 0) shakeTime--;

    const player = players.find(p => p.isPlayer);
    if (player && player.isAlive) {
        if (keys['KeyA'] || keys['ArrowLeft']) player.vx -= 0.65;
        if (keys['KeyD'] || keys['ArrowRight']) player.vx += 0.65;
        if (keys['KeyW'] || keys['Space'] || keys['ArrowUp']) player.jump();
        player.isCrouching = !!(keys['KeyS'] || keys['ArrowDown']);
    }

    // Update all passengers
    players.forEach(p => p.update());

    // Update Doom Events
    if (gameState === STATE.DOOM_EVENT && currentEvent) {
        currentEvent.duration--;

        // Bomb collision transfer
        if (currentEvent.type === 'BOMB') {
            players.forEach(p1 => {
                if (p1.hasBomb && p1.isAlive) {
                    players.forEach(p2 => {
                        if (p2 !== p1 && p2.isAlive) {
                            if (Math.abs(p1.x - p2.x) < 28 && Math.abs(p1.y - p2.y) < 32) {
                                p1.hasBomb = false;
                                p2.hasBomb = true;
                                p2.bark('TAG! YOU HAVE THE BOMB!');
                                window.doomAudio.playPunch();
                            }
                        }
                    });
                }
            });

            // Bomb explosion at 0
            if (currentEvent.duration <= 0) {
                const bombGuy = players.find(p => p.hasBomb && p.isAlive);
                if (bombGuy) bombGuy.eliminate('Blown to pieces by the ticking bomb!');
                nextFloorTransition();
            }
        }

        // Laser collision (Smooth, readable sweep speed)
        if (currentEvent.type === 'LASER') {
            currentEvent.laserX += 2.1;
            players.forEach(p => {
                if (p.isAlive && Math.abs(p.x + p.w/2 - currentEvent.laserX) < 14) {
                    if (currentEvent.laserY > 450 && p.isGrounded && !p.isCrouching) {
                        p.eliminate('Vaporized by the laser beam!');
                    } else if (currentEvent.laserY <= 450 && !p.isCrouching) {
                        p.eliminate('Decapitated by the high laser beam!');
                    }
                }
            });

            if (currentEvent.duration <= 0) nextFloorTransition();
        }

        // Floor 99 Escape Hatch
        if (currentEvent.type === 'ESCAPE_HATCH') {
            players.forEach(p => {
                if (p.isAlive && Math.abs(p.x - currentEvent.hatchX) < 40 && Math.abs(p.y - currentEvent.hatchY) < 40) {
                    if (p.isPlayer) endGame(true);
                    else p.eliminate('Left behind in the abyss!');
                }
            });
        }

        if (currentEvent.type !== 'BOMB' && currentEvent.type !== 'LASER' && currentEvent.duration <= 0) {
            nextFloorTransition();
        }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) particles.splice(i, 1);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (shakeTime > 0) {
        ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    }

    // Background Shaft
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Elevator Cabin Shell
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.fillRect(ELEVATOR.x, ELEVATOR.y, ELEVATOR.w, ELEVATOR.h);
    ctx.strokeRect(ELEVATOR.x, ELEVATOR.y, ELEVATOR.w, ELEVATOR.h);

    // Overhead Light Cones
    const grad = ctx.createLinearGradient(0, ELEVATOR.y, 0, ELEVATOR.floorY);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(ELEVATOR.x + 20, ELEVATOR.y, ELEVATOR.w - 40, ELEVATOR.h);

    // Floor Tiles
    floorTiles.forEach(tile => {
        if (tile.active) {
            ctx.fillStyle = tile.blinking && Math.floor(Date.now() / 150) % 2 === 0 ? '#ef4444' : '#1e293b';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.fillRect(tile.x + 2, ELEVATOR.floorY, tile.w - 4, 30);
            ctx.strokeRect(tile.x + 2, ELEVATOR.floorY, tile.w - 4, 30);
        }
    });

    // Draw Laser if active
    if (currentEvent && currentEvent.type === 'LASER') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(currentEvent.laserX, ELEVATOR.y);
        ctx.lineTo(currentEvent.laserX, ELEVATOR.floorY + 20);
        ctx.stroke();
    }

    // Draw Floor 99 Golden Escape Hatch
    if (currentEvent && currentEvent.type === 'ESCAPE_HATCH') {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(currentEvent.hatchX + 30, currentEvent.hatchY + 20, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('ESCAPE!', currentEvent.hatchX + 30, currentEvent.hatchY + 24);
    }

    // Draw Passengers
    players.forEach(p => p.draw());

    // Draw Particles
    particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 4, 4);
    });

    ctx.restore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Render Lobby Roster
function renderLobbyRoster() {
    const grid = document.getElementById('passenger-grid');
    if (!grid) return;
    grid.innerHTML = '';
    ROSTER.forEach(r => {
        const slot = document.createElement('div');
        slot.className = `p-slot ${r.isPlayer ? 'is-you' : ''}`;
        slot.innerHTML = `
            <span class="p-emoji">${r.emoji}</span>
            <span class="p-name">${r.name}</span>
        `;
        grid.appendChild(slot);
    });
}

// Wire Up Buttons
document.getElementById('btn-start-game').addEventListener('click', initMatch);
document.getElementById('btn-restart').addEventListener('click', initMatch);
document.getElementById('btn-sound-toggle').addEventListener('click', () => {
    window.doomAudio.muted = !window.doomAudio.muted;
    document.getElementById('btn-sound-toggle').textContent = window.doomAudio.muted ? '🔇' : '🔊';
});

renderLobbyRoster();
gameLoop();
