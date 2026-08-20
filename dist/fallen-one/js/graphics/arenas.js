// js/graphics/arenas.js - Parallax Stages & Dynamic Arena Environment

import { ARENA_BOUNDS } from '../core/constants.js';

export const ARENA_LIST = [
    {
        id: 'FUTURE_CITY',
        name: 'FUTURE CITY',
        subtitle: 'Cyber Rooftop District 04',
        imagePath: 'assets/stages/future_city.jpg',
        themeColor: '#00e5ff',
        ambientType: 'rain'
    },
    {
        id: 'TRAINING_DOJO',
        name: 'TRAINING DOJO',
        subtitle: 'Digital Tatami Temple',
        imagePath: 'assets/stages/training_dojo.jpg',
        themeColor: '#f43f5e',
        ambientType: 'sakura'
    },
    {
        id: 'VOLCANIC_CORE',
        name: 'VOLCANIC CORE',
        subtitle: 'Subterranean Magma Rift',
        imagePath: 'assets/stages/volcanic_core.jpg',
        themeColor: '#ff5722',
        ambientType: 'embers'
    },
    {
        id: 'FROZEN_BASE',
        name: 'FROZEN BASE',
        subtitle: 'Cryogenix Glacier Lab',
        imagePath: 'assets/stages/frozen_base.jpg',
        themeColor: '#38bdf8',
        ambientType: 'snow'
    },
    {
        id: 'CYBER_ARENA',
        name: 'CYBER ARENA',
        subtitle: 'Holographic Championship Dome',
        imagePath: 'assets/stages/cyber_arena.jpg',
        themeColor: '#a855f7',
        ambientType: 'lasers'
    }
];

export class ArenaManager {
    constructor() {
        this.currentArena = ARENA_LIST[0];
        this.loadedImages = {};
        this.ambients = [];
        this.initAmbients();
        this.preloadImages();
    }

    preloadImages() {
        if (typeof Image === 'undefined') return;
        ARENA_LIST.forEach(arena => {
            const img = new Image();
            img.src = arena.imagePath;
            this.loadedImages[arena.id] = img;
        });
    }

    setArena(arenaId) {
        const found = ARENA_LIST.find(a => a.id === arenaId);
        if (found) {
            this.currentArena = found;
            this.initAmbients();
        }
    }

    initAmbients() {
        this.ambients = [];
        const count = 50;
        for (let i = 0; i < count; i++) {
            this.ambients.push({
                x: Math.random() * ARENA_BOUNDS.width,
                y: Math.random() * ARENA_BOUNDS.groundY,
                speedY: 2 + Math.random() * 4,
                speedX: (Math.random() - 0.5) * 1.5,
                size: 1 + Math.random() * 3,
                alpha: 0.3 + Math.random() * 0.5,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    update() {
        const type = this.currentArena.ambientType;
        for (const amb of this.ambients) {
            if (type === 'rain') {
                amb.y += amb.speedY * 2.8;
                amb.x -= 1.8;
                if (amb.y > ARENA_BOUNDS.groundY) {
                    amb.y = 0;
                    amb.x = Math.random() * ARENA_BOUNDS.width;
                }
            } else if (type === 'sakura') {
                amb.y += amb.speedY * 0.4;
                amb.x += Math.sin(amb.y * 0.02) * 1.2;
                amb.angle += 0.03;
                if (amb.y > ARENA_BOUNDS.groundY) {
                    amb.y = 0;
                    amb.x = Math.random() * ARENA_BOUNDS.width;
                }
            } else if (type === 'embers') {
                amb.y -= amb.speedY * 0.6;
                amb.x += Math.sin(amb.y * 0.03) * 0.8;
                if (amb.y < 50) {
                    amb.y = ARENA_BOUNDS.groundY - 20;
                    amb.x = Math.random() * ARENA_BOUNDS.width;
                }
            } else if (type === 'snow') {
                amb.y += amb.speedY * 0.5;
                amb.x += Math.cos(amb.y * 0.02) * 0.8;
                if (amb.y > ARENA_BOUNDS.groundY) {
                    amb.y = 0;
                    amb.x = Math.random() * ARENA_BOUNDS.width;
                }
            } else if (type === 'lasers') {
                amb.angle += 0.02;
            }
        }
    }

    renderBackground(ctx) {
        const img = this.loadedImages[this.currentArena.id];
        if (img && img.complete && img.naturalWidth > 0) {
            // Draw wide background to cover full arena width with parallax
            ctx.drawImage(img, 0, 0, ARENA_BOUNDS.width, ARENA_BOUNDS.groundY + 120);
        } else {
            // High-tech fallback gradient
            const grad = ctx.createLinearGradient(0, 0, 0, ARENA_BOUNDS.groundY);
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, ARENA_BOUNDS.width, ARENA_BOUNDS.groundY + 120);
        }

        // Draw Stage Floor Platform line & glow
        ctx.save();
        ctx.strokeStyle = this.currentArena.themeColor;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.currentArena.themeColor;
        ctx.beginPath();
        ctx.moveTo(ARENA_BOUNDS.minX, ARENA_BOUNDS.groundY);
        ctx.lineTo(ARENA_BOUNDS.maxX, ARENA_BOUNDS.groundY);
        ctx.stroke();

        // Floor Grid Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        for (let x = ARENA_BOUNDS.minX; x <= ARENA_BOUNDS.maxX; x += 120) {
            ctx.beginPath();
            ctx.moveTo(x, ARENA_BOUNDS.groundY);
            ctx.lineTo(x + 40, ARENA_BOUNDS.groundY + 100);
            ctx.stroke();
        }

        // Render ambient particles (Rain, Sakura, Embers, Snow, Lasers)
        const type = this.currentArena.ambientType;
        for (const amb of this.ambients) {
            ctx.globalAlpha = amb.alpha;
            if (type === 'rain') {
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(amb.x, amb.y);
                ctx.lineTo(amb.x - 3, amb.y + 12);
                ctx.stroke();
            } else if (type === 'sakura') {
                ctx.save();
                ctx.translate(amb.x, amb.y);
                ctx.rotate(amb.angle);
                ctx.fillStyle = '#f472b6';
                ctx.beginPath();
                ctx.ellipse(0, 0, amb.size * 2, amb.size, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (type === 'embers') {
                ctx.fillStyle = '#fb923c';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#f97316';
                ctx.beginPath();
                ctx.arc(amb.x, amb.y, amb.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (type === 'snow') {
                ctx.fillStyle = '#e0f2fe';
                ctx.beginPath();
                ctx.arc(amb.x, amb.y, amb.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (type === 'lasers') {
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(amb.x, 0);
                ctx.lineTo(amb.x + Math.sin(amb.angle) * 120, ARENA_BOUNDS.groundY);
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}

export const arenaManager = new ArenaManager();
