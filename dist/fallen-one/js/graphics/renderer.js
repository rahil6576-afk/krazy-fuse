// js/graphics/renderer.js - Main Canvas 2D Game Renderer (with 2v1 Boss Support)

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../core/constants.js';
import { arenaManager } from './arenas.js';
import { FighterSpriteRenderer } from './fighterSprites.js';
import { particleSystem } from './particleSystem.js';
import { camera } from '../core/camera.js';

export class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.showHitboxes = false;
        this.renderScale = 1.0;
    }

    render(p1, p2, matchManager, comboTracker, p3 = null) {
        const ctx = this.ctx;

        // Clear Viewport
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Apply Dynamic Camera Zoom & Screen Shake
        camera.applyTransform(ctx);

        // 1. Render Parallax Stage Background & Ambiance
        arenaManager.renderBackground(ctx);

        // 2. Render Projectiles
        if (p1 && p1.projectiles) {
            p1.projectiles.forEach(p => p.render(ctx));
        }
        if (p2 && p2.projectiles) {
            p2.projectiles.forEach(p => p.render(ctx));
        }
        if (p3 && p3.projectiles) {
            p3.projectiles.forEach(p => p.render(ctx));
        }

        // 3. Render Fighters
        if (p1) FighterSpriteRenderer.drawFighter(ctx, p1);
        if (p2) FighterSpriteRenderer.drawFighter(ctx, p2);
        if (p3) FighterSpriteRenderer.drawFighter(ctx, p3);

        // 4. Render Particle System (Hitsparks, Embers, Shockwaves, Ground Fissures)
        particleSystem.render(ctx);

        // 5. Debug Hitboxes / Hurtboxes (Training Mode)
        if (this.showHitboxes) {
            this.renderHitboxes(ctx, p1);
            this.renderHitboxes(ctx, p2);
            if (p3) this.renderHitboxes(ctx, p3);
        }

        // Restore Camera Transformation
        camera.restoreTransform(ctx);

        // 6. Render On-Screen Match Announcements (Round 1, Fight!, K.O.)
        this.renderMatchBanners(ctx, matchManager);
    }

    renderHitboxes(ctx, fighter) {
        if (!fighter) return;
        ctx.save();

        // Pushbox (Yellow)
        const push = fighter.getPushbox();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(push.x, push.y, push.w, push.h);

        // Hurtboxes (Green)
        const hurts = fighter.getHurtboxes();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.5;
        for (const h of hurts) {
            ctx.strokeRect(h.x, h.y, h.w, h.h);
        }

        // Active Hitbox (Red)
        const hit = fighter.getActiveHitbox();
        if (hit) {
            ctx.strokeStyle = '#ef4444';
            ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(hit.x, hit.y, hit.w, hit.h);
            ctx.fillRect(hit.x, hit.y, hit.w, hit.h);
        }

        ctx.restore();
    }

    renderMatchBanners(ctx, matchManager) {
        if (!matchManager || !matchManager.bannerText) return;

        const text = matchManager.bannerText;
        const sub = matchManager.bannerSubText;
        const scale = matchManager.bannerScale || 1.0;

        ctx.save();
        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
        ctx.scale(scale, scale);

        ctx.font = '900 84px Teko, Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Glowing Outline
        ctx.lineWidth = 12;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.strokeText(text, 0, 0);

        // Main Text Gradient
        const grad = ctx.createLinearGradient(0, -40, 0, 40);
        if (text.includes('K.O.') || text.includes('TIME')) {
            grad.addColorStop(0, '#ef4444');
            grad.addColorStop(1, '#f97316');
        } else {
            grad.addColorStop(0, '#facc15');
            grad.addColorStop(1, '#e11d48');
        }
        ctx.fillStyle = grad;
        ctx.fillText(text, 0, 0);

        if (sub) {
            ctx.font = '700 28px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00e5ff';
            ctx.fillText(sub, 0, 52);
        }

        ctx.restore();
    }
}
