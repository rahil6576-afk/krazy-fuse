// js/graphics/particleSystem.js - High-Performance Particle, Ground Fissures & Dynamic Combat FX Engine

import { ARENA_BOUNDS } from '../core/constants.js';

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 200;
        this.shockwaves = [];
        this.hitFlashes = [];
        this.groundFissures = [];
        this.slashArcs = [];
    }

    reset() {
        this.particles = [];
        this.shockwaves = [];
        this.hitFlashes = [];
        this.groundFissures = [];
        this.slashArcs = [];
    }

    // =========================================================================
    // HIT IMPACTS & PERFECT BLOCKS
    // =========================================================================
    spawnHitSpark(x, y, color = '#38bdf8', count = 18, isHeavy = false) {
        const num = isHeavy ? count * 1.6 : count;
        for (let i = 0; i < num; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const angle = Math.random() * Math.PI * 2;
            const speed = (isHeavy ? 6 : 3.5) + Math.random() * (isHeavy ? 9 : 4.5);
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.035 + Math.random() * 0.04,
                size: (isHeavy ? 5 : 3) + Math.random() * 3.5,
                color: color,
                shape: Math.random() > 0.3 ? 'spark' : 'circle'
            });
        }

        this.shockwaves.push({
            x, y,
            radius: 6,
            maxRadius: isHeavy ? 75 : 45,
            growth: isHeavy ? 5.2 : 3.6,
            color: color,
            alpha: 1.0,
            lineWidth: isHeavy ? 4.5 : 2.8
        });
    }

    spawnPerfectBlockSpark(x, y) {
        for (let i = 0; i < 32; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 6 + Math.random() * 8;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.03,
                size: 4.5 + Math.random() * 3.5,
                color: Math.random() > 0.5 ? '#facc15' : '#38bdf8',
                shape: 'spark'
            });
        }
        this.shockwaves.push({
            x, y,
            radius: 8,
            maxRadius: 90,
            growth: 6.5,
            color: '#facc15',
            alpha: 1.0,
            lineWidth: 5
        });
    }

    spawnSuperImpactExplosion(x, y, color = '#ff5722') {
        this.spawnHitSpark(x, y, color, 45, true);
        this.shockwaves.push({
            x, y,
            radius: 12,
            maxRadius: 160,
            growth: 8.5,
            color: '#ffffff',
            alpha: 1.0,
            lineWidth: 6
        });
        this.shockwaves.push({
            x, y,
            radius: 8,
            maxRadius: 130,
            growth: 7.0,
            color: color,
            alpha: 1.0,
            lineWidth: 5
        });
    }


    spawnAttackRelease(fighter, opponent) {
        const style = fighter.combatStyle || { archetype: 'precision' };
        const color = fighter.themeColor || '#00e5ff';
        const dir = fighter.facingRight ? 1 : -1;
        const x = fighter.x + dir * 42;
        const y = fighter.y - 82;
        const type = fighter.currentAttackData?.type || '';
        const heavy = type.includes('HEAVY') || type === 'RISING_KICK' || type.includes('SPECIAL');
        const count = heavy ? 10 : 5;

        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const spread = (Math.random() - 0.5) * (heavy ? 1.2 : 0.8);
            const speed = heavy ? 3 + Math.random() * 5 : 2 + Math.random() * 3;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 18,
                vx: dir * speed, vy: spread * speed, life: 1, decay: 0.08 + Math.random() * 0.05,
                size: heavy ? 3 + Math.random() * 3 : 2 + Math.random() * 2, color, shape: 'spark'
            });
        }

        if (heavy || style.archetype === 'assassin' || style.archetype === 'rushdown') {
            this.shockwaves.push({ x, y, radius: 8, maxRadius: heavy ? 52 : 35, growth: heavy ? 6 : 4, color, alpha: 0.8, lineWidth: heavy ? 3.5 : 2 });
        }

        if (style.archetype === 'heavy' || style.archetype === 'tank') {
            this.spawnGroundFissure(fighter.x, fighter.x + dir * (style.archetype === 'tank' ? 160 : 120), fighter.y, style.archetype === 'tank' ? 'TERRA' : 'MAGMA', color);
        }
    }

    spawnMovementBurst(x, y, charId, kind = 'jump') {
        const colors = { SOLAR: '#ff6b2c', FROST: '#38bdf8', VOLT: '#facc15', SHADOW: '#a855f7', TERRA: '#22c55e', AARAV: '#00e5ff' };
        const color = colors[charId] || '#ffffff';
        const count = kind === 'land' ? 12 : 7;
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const a = Math.PI + Math.random() * Math.PI;
            const speed = 1.5 + Math.random() * 3;
            this.particles.push({ x, y: y - 2, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed * 0.5, life: 1, decay: 0.08, size: 2 + Math.random() * 3, color, shape: 'circle' });
        }
        if (kind === 'land') this.shockwaves.push({ x, y, radius: 8, maxRadius: 55, growth: 4, color, alpha: 0.55, lineWidth: 2.5 });
    }

    spawnDashDust(x, y, facingRight, charId = 'AARAV') {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x + (facingRight ? -18 : 18),
                y: y - Math.random() * 15,
                vx: (facingRight ? -1 : 1) * (2 + Math.random() * 3),
                vy: -Math.random() * 1.5,
                life: 1.0,
                decay: 0.06,
                size: 3 + Math.random() * 4,
                color: ({ SOLAR: '#ff6b2c', FROST: '#38bdf8', VOLT: '#facc15', SHADOW: '#a855f7', TERRA: '#22c55e', AARAV: '#00e5ff' }[charId] || 'rgba(255,255,255,0.4)'),
                shape: 'circle'
            });
        }
    }

    spawnEnergyTrail(x, y, color = '#00e5ff', count = 4) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2.0;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 12,
                y: y + (Math.random() - 0.5) * 12,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.08 + Math.random() * 0.04,
                size: 2.5 + Math.random() * 2.5,
                color: color,
                shape: Math.random() > 0.4 ? 'spark' : 'circle'
            });
        }
    }

    // =========================================================================
    // ARENA ATTACK PROPAGATION: TRAVELING GROUND FISSURES & WAVES
    // =========================================================================
    spawnGroundFissure(startX, targetX, groundY, type = 'MAGMA', color = '#ff5722') {
        const dir = targetX >= startX ? 1 : -1;
        const totalDistance = Math.min(800, Math.abs(targetX - startX) + 120);

        this.groundFissures.push({
            startX,
            currentX: startX,
            targetX: startX + dir * totalDistance,
            groundY,
            dir,
            speed: 18,
            type,
            color,
            life: 1.0,
            decay: 0.022,
            points: [],
            eruptTimer: 0
        });
    }

    // =========================================================================
    // DYNAMIC MELEE SLASH ARCS (Curved Bezier Energy Blade Striking Forward)
    // =========================================================================
    spawnMeleeSlashArc(x, y, facingRight, color = '#00e5ff', isHeavy = false) {
        this.slashArcs.push({
            x: x + (facingRight ? 45 : -45),
            y: y - 85,
            radius: isHeavy ? 68 : 48,
            angleStart: facingRight ? -Math.PI * 0.65 : Math.PI * 0.65,
            angleEnd: facingRight ? Math.PI * 0.45 : -Math.PI * 0.45,
            facingRight,
            color,
            isHeavy,
            life: 1.0,
            decay: isHeavy ? 0.08 : 0.14
        });
    }

    // =========================================================================
    // UPDATE CYCLE
    // =========================================================================
    update() {
        // 1. Update Ground Fissures
        for (let i = this.groundFissures.length - 1; i >= 0; i--) {
            const gf = this.groundFissures[i];
            const distRemaining = Math.abs(gf.targetX - gf.currentX);

            if (distRemaining > 10) {
                gf.currentX += gf.dir * gf.speed;
                gf.points.push({
                    x: gf.currentX,
                    y: gf.groundY,
                    height: 15 + Math.random() * 32,
                    eruptTime: 1.0
                });

                if (this.particles.length < this.maxParticles) {
                    this.particles.push({
                        x: gf.currentX,
                        y: gf.groundY,
                        vx: (Math.random() - 0.5) * 3,
                        vy: -Math.random() * 6 - 2,
                        life: 1.0,
                        decay: 0.04,
                        size: 4 + Math.random() * 4,
                        color: gf.color,
                        shape: 'spark'
                    });
                }
            } else {
                gf.life -= gf.decay;
                if (gf.life <= 0) {
                    this.groundFissures.splice(i, 1);
                }
            }
        }

        // 2. Update Melee Slash Arcs
        for (let i = this.slashArcs.length - 1; i >= 0; i--) {
            const s = this.slashArcs[i];
            s.life -= s.decay;
            if (s.life <= 0) {
                this.slashArcs.splice(i, 1);
            }
        }

        // 3. Update Shockwaves
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.radius += sw.growth;
            sw.alpha -= 0.05;
            if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
                this.shockwaves.splice(i, 1);
            }
        }

        // 4. Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // =========================================================================
    // RENDER PASS
    // =========================================================================
    render(ctx) {
        ctx.save();

        // 1. Render Ground Fissures
        for (const gf of this.groundFissures) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, gf.life);
            ctx.strokeStyle = gf.color;

            if (gf.type === 'MAGMA') {
                ctx.fillStyle = 'rgba(234, 88, 12, 0.85)';
                for (let j = 0; j < gf.points.length; j += 2) {
                    const pt = gf.points[j];
                    ctx.beginPath();
                    ctx.moveTo(pt.x - 8, pt.y);
                    ctx.lineTo(pt.x, pt.y - pt.height);
                    ctx.lineTo(pt.x + 8, pt.y);
                    ctx.closePath();
                    ctx.fill();
                }
            } else if (gf.type === 'FROST') {
                ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
                ctx.strokeStyle = '#e0f2fe';
                for (let j = 0; j < gf.points.length; j += 2) {
                    const pt = gf.points[j];
                    ctx.beginPath();
                    ctx.moveTo(pt.x - 7, pt.y);
                    ctx.lineTo(pt.x + (j % 4 === 0 ? 3 : -3), pt.y - pt.height * 1.3);
                    ctx.lineTo(pt.x + 7, pt.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            } else if (gf.type === 'TERRA') {
                for (let j = 0; j < gf.points.length; j += 2) {
                    const pt = gf.points[j];
                    ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
                    ctx.strokeStyle = '#15803d';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(pt.x - 9, pt.y);
                    ctx.lineTo(pt.x, pt.y - pt.height);
                    ctx.lineTo(pt.x + 9, pt.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            } else if (gf.type === 'VOLT') {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let j = 0; j < gf.points.length; j++) {
                    const pt = gf.points[j];
                    if (j === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y + (Math.random() - 0.5) * 8);
                }
                ctx.stroke();
            } else {
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                for (let j = 0; j < gf.points.length; j++) {
                    const pt = gf.points[j];
                    if (j === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y - Math.sin((j / gf.points.length) * Math.PI) * 18);
                }
                ctx.stroke();
            }
            ctx.restore();
        }

        // 2. Render Dynamic Melee Slash Arcs
        for (const s of this.slashArcs) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, s.life);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.isHeavy ? 6 : 3.5;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, s.angleStart, s.angleEnd, !s.facingRight);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = s.isHeavy ? 2.5 : 1.5;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, s.angleStart, s.angleEnd, !s.facingRight);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Render Shockwaves
        for (const sw of this.shockwaves) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = sw.color;
            ctx.globalAlpha = sw.alpha;
            ctx.lineWidth = sw.lineWidth;
            ctx.stroke();
            ctx.restore();
        }

        // 4. Render Particles
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;

            if (p.shape === 'spark') {
                const angle = Math.atan2(p.vy, p.vx);
                const len = p.size * 2.2;
                ctx.translate(p.x, p.y);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(-len / 2, 0);
                ctx.lineTo(len / 2, 0);
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.size * 0.8;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        ctx.restore();
    }
}

export const particleSystem = new ParticleSystem();
