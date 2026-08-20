// js/core/camera.js - Dynamic 2D Fighting Game Camera & Screen Shake Trauma System

import { CANVAS_WIDTH, CANVAS_HEIGHT, ARENA_BOUNDS } from './constants.js';

export class Camera {
    constructor() {
        this.x = (ARENA_BOUNDS.minX + ARENA_BOUNDS.maxX) / 2;
        this.y = ARENA_BOUNDS.groundY - 140;
        this.targetX = this.x;
        this.targetY = this.y;
        this.zoom = 1.0;
        this.targetZoom = 1.0;

        // Screen shake trauma (0.0 to 1.0)
        this.trauma = 0;
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeAngle = 0;

        // Hitstop freeze-frame counter
        this.hitstopFrames = 0;
        this.slowmoFactor = 1.0;

        // Super cinematic focus mode
        this.cinematicFocus = null; // { x, y, zoom, duration }
    }

    addTrauma(amount) {
        this.trauma = Math.min(1.0, this.trauma + amount);
    }

    addHitstop(frames) {
        this.hitstopFrames = Math.max(this.hitstopFrames, frames);
    }

    startSuperCinematic(fighter, duration = 30) {
        this.cinematicFocus = {
            x: fighter.x,
            y: fighter.y - 60,
            zoom: 1.35,
            duration: duration,
            maxDuration: duration
        };
        this.addTrauma(0.4);
    }

    update(p1, p2) {
        // Hitstop logic
        if (this.hitstopFrames > 0) {
            this.hitstopFrames--;
            return true; // Indicates frame freeze
        }

        // 1. Calculate midpoint between fighters
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - 40;
        const dist = Math.abs(p1.x - p2.x);

        // 2. Determine target zoom (1.15 when close, down to 0.85 when far)
        const idealZoom = Math.min(1.15, Math.max(0.85, 1100 / (dist + 450)));

        if (this.cinematicFocus && this.cinematicFocus.duration > 0) {
            this.targetX = this.cinematicFocus.x;
            this.targetY = this.cinematicFocus.y;
            this.targetZoom = this.cinematicFocus.zoom;
            this.cinematicFocus.duration--;
            if (this.cinematicFocus.duration <= 0) {
                this.cinematicFocus = null;
            }
        } else {
            this.targetX = midX;
            this.targetY = midY;
            this.targetZoom = idealZoom;
        }

        // 3. Smooth Camera Follow Lerp
        const lerpSpeed = 0.12;
        this.x += (this.targetX - this.x) * lerpSpeed;
        this.y += (this.targetY - this.y) * lerpSpeed;
        this.zoom += (this.targetZoom - this.zoom) * 0.08;

        // Clamp camera position to arena boundaries
        const visibleHalfW = (CANVAS_WIDTH / 2) / this.zoom;
        const visibleHalfH = (CANVAS_HEIGHT / 2) / this.zoom;

        this.x = Math.max(ARENA_BOUNDS.minX + visibleHalfW - 50, Math.min(ARENA_BOUNDS.maxX - visibleHalfW + 50, this.x));
        this.y = Math.max(ARENA_BOUNDS.ceilingY + visibleHalfH, Math.min(ARENA_BOUNDS.groundY - visibleHalfH + 160, this.y));

        // 4. Update Screen Shake Trauma
        if (this.trauma > 0) {
            const shake = this.trauma * this.trauma; // Non-linear falloff
            const maxOffset = 22 * shake;
            this.shakeX = (Math.random() * 2 - 1) * maxOffset;
            this.shakeY = (Math.random() * 2 - 1) * maxOffset;
            this.shakeAngle = (Math.random() * 2 - 1) * (0.03 * shake);
            this.trauma = Math.max(0, this.trauma - 0.045);
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
            this.shakeAngle = 0;
        }

        return false;
    }

    applyTransform(ctx) {
        ctx.save();
        ctx.translate(CANVAS_WIDTH / 2 + this.shakeX, CANVAS_HEIGHT / 2 + this.shakeY);
        ctx.rotate(this.shakeAngle);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.x, -this.y);
    }

    restoreTransform(ctx) {
        ctx.restore();
    }
}

export const camera = new Camera();
