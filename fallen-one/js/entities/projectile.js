// js/entities/projectile.js - Energy Wave, Projectile & Hazard Entity System with 4-Frame Dynamic VFX

import { ARENA_BOUNDS } from '../core/constants.js';
import { particleSystem } from '../graphics/particleSystem.js';

export class Projectile {
    constructor(owner, type, x, y, facingRight, attackData) {
        this.owner = owner;
        this.type = type;
        this.x = x;
        this.y = y;
        this.facingRight = facingRight;
        this.attackData = attackData;
        
        this.width = attackData.projWidth || 70;
        this.height = attackData.projHeight || 50;
        this.speedX = (facingRight ? 1 : -1) * (attackData.projSpeed || 15);
        this.speedY = attackData.projSpeedY || 0;
        this.life = attackData.projLifetime || 80;
        this.maxLife = this.life;
        this.color = attackData.color || '#00e5ff';
        this.isAlive = true;
        this.clashPriority = attackData.projPriority || 1;
        this.animTimer = 0;
    }

    update() {
        if (!this.isAlive) return;

        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.animTimer++;

        // Spawn particle trail
        particleSystem.spawnEnergyTrail(this.x, this.y, this.color, 6);

        if (this.life <= 0 || this.x < ARENA_BOUNDS.minX - 50 || this.x > ARENA_BOUNDS.maxX + 50) {
            this.destroy();
        }
    }

    destroy(hitPoint = null) {
        this.isAlive = false;
        const sparkX = hitPoint ? hitPoint.x : this.x;
        const sparkY = hitPoint ? hitPoint.y : this.y;
        particleSystem.spawnHitSpark(sparkX, sparkY, this.color, 14, true);
    }

    getHitbox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            w: this.width,
            h: this.height
        };
    }

    render(ctx) {
        if (!this.isAlive) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        if (!this.facingRight) ctx.scale(-1, 1);

        const frame4 = Math.floor((this.animTimer / 4) % 4);
        const spinAngle = this.animTimer * 0.25;

        if (this.type === 'ENERGY_WAVE') {
            // Aarav / Shadow Crescent Wave - 4-Frame Pulsing Blade
            ctx.shadowBlur = 22;
            ctx.shadowColor = this.color;

            // Outer energy pulse ring (4-frame expansion)
            const ringScale = 1.0 + frame4 * 0.08;
            ctx.save();
            ctx.scale(ringScale, ringScale);

            // Core crescent
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(30, 0);
            ctx.quadraticCurveTo(-15, -28, -35, -38);
            ctx.quadraticCurveTo(-10, 0, -35, 38);
            ctx.quadraticCurveTo(-15, 28, 30, 0);
            ctx.fill();

            // Outer energy wave halo
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();

            // Dynamic electric discharge ribbons
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const sparkOffset = (frame4 * 7) % 20;
            ctx.moveTo(10, -12 + sparkOffset);
            ctx.lineTo(30, -22 + sparkOffset);
            ctx.moveTo(10, 12 - sparkOffset);
            ctx.lineTo(30, 22 - sparkOffset);
            ctx.stroke();

        } else if (this.type === 'ICE_PROJECTILE') {
            // Frost's 4-Frame Spinning Cryo Snowflake Shuriken
            ctx.shadowBlur = 18;
            ctx.shadowColor = '#38bdf8';
            ctx.save();
            ctx.rotate(spinAngle);

            ctx.fillStyle = '#e0f2fe';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;

            // 4-Point crystalline star
            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.beginPath();
                ctx.moveTo(0, -30);
                ctx.lineTo(8, -8);
                ctx.lineTo(0, 0);
                ctx.lineTo(-8, -8);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            // Center icy core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        } else if (this.type === 'VOLT_ORB') {
            // Volt's 4-Frame Pulsing Lightning Sphere
            const pulse = 16 + (frame4 % 2 === 0 ? 3 : -1);
            ctx.shadowBlur = 24;
            ctx.shadowColor = '#facc15';

            // High-voltage plasma sphere
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(0, 0, pulse, 0, Math.PI * 2);
            ctx.fill();

            // Inner bright core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, pulse * 0.5, 0, Math.PI * 2);
            ctx.fill();

            // 4-Frame Dynamic Branching Lightning Arcs
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            for (let b = 0; b < 3; b++) {
                const bAngle = (b / 3) * Math.PI * 2 + spinAngle;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(bAngle) * (pulse * 0.7), Math.sin(bAngle) * (pulse * 0.7));
                ctx.lineTo(Math.cos(bAngle + 0.4) * (pulse * 1.4), Math.sin(bAngle + 0.4) * (pulse * 1.4));
                ctx.stroke();
            }

        } else {
            // Generic 4-frame pulsing energy orb
            const p = 14 + Math.sin(this.animTimer * 0.3) * 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, p, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, p * 0.45, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
