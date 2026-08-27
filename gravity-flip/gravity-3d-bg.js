// gravity-3d-bg.js — 3D Three.js Cavern Background Engine for Gravity Flip
// Features dynamic cave biomes, camera gravity flip transitions, 3D crystals, stalactites, and warp particles

class GravityThreeBG {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || typeof THREE === 'undefined') {
            console.warn('Three.js canvas or library not available.');
            return;
        }

        // Theme Palettes (RGB Hex values for smooth light lerping)
        this.THEME_PALETTES = [
            // Level 1: Amber Limestone
            {
                primary: 0xf59e0b,
                secondary: 0xffd166,
                accent: 0x8a6240,
                fog: 0x140d07,
                particles: 0xffb703
            },
            // Level 2: Luminescent Crystal Grotto
            {
                primary: 0x38bdf8,
                secondary: 0xa855f7,
                accent: 0x0284c7,
                fog: 0x040d1a,
                particles: 0x38bdf8
            },
            // Level 3: Magma Obsidian Chasm
            {
                primary: 0xf97316,
                secondary: 0xef4444,
                accent: 0x7c2d12,
                fog: 0x1a0603,
                particles: 0xf97316
            },
            // Level 4: Bioluminescent Depths
            {
                primary: 0x10b981,
                secondary: 0x34d399,
                accent: 0x064e3b,
                fog: 0x03120c,
                particles: 0x34d399
            },
            // Level 5: Ancient Runic Ruins
            {
                primary: 0xc084fc,
                secondary: 0xe879f9,
                accent: 0x581c87,
                fog: 0x0d0417,
                particles: 0xe879f9
            }
        ];

        this.currentPalette = this.THEME_PALETTES[0];
        this.targetPalette = this.THEME_PALETTES[0];
        
        // Game Motion States
        this.speed = 1.0;
        this.gravityDir = 1; // 1 = floor, -1 = ceiling
        this.targetCamRoll = 0;
        this.currentCamRoll = 0;
        this.targetCamY = 0;
        this.currentCamY = 0;
        this.pulseIntensity = 0;

        this.initThree();
        this.createSceneContent();
        this.onWindowResize();

        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    initThree() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(this.currentPalette.fog, 0.022);

        // Camera
        const width = this.canvas.clientWidth || 1000;
        const height = this.canvas.clientHeight || 600;
        this.camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 200);
        this.camera.position.set(0, 0, 18);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        this.ambientLight = new THREE.AmbientLight(this.currentPalette.primary, 0.6);
        this.scene.add(this.ambientLight);

        this.pointLight1 = new THREE.PointLight(this.currentPalette.primary, 3, 40);
        this.pointLight1.position.set(-10, 8, 5);
        this.scene.add(this.pointLight1);

        this.pointLight2 = new THREE.PointLight(this.currentPalette.secondary, 2.5, 40);
        this.pointLight2.position.set(10, -8, 2);
        this.scene.add(this.pointLight2);
    }

    createSceneContent() {
        this.sceneGroup = new THREE.Group();
        this.scene.add(this.sceneGroup);

        // 1. Floating 3D Low-Poly Cavern Stalactites & Crystals
        this.crystals = [];
        const crystalGeo = new THREE.ConeGeometry(0.8, 3.5, 5);
        
        // Ceiling & Floor rows of low-poly 3D glowing crystals
        for (let i = 0; i < 35; i++) {
            const mat = new THREE.MeshPhongMaterial({
                color: this.currentPalette.secondary,
                emissive: this.currentPalette.primary,
                emissiveIntensity: 0.35,
                flatShading: true,
                transparent: true,
                opacity: 0.85
            });

            const crystal = new THREE.Mesh(crystalGeo, mat);
            const isCeiling = Math.random() > 0.5;
            const x = (Math.random() - 0.5) * 50;
            const y = isCeiling ? 8 + Math.random() * 3 : -8 - Math.random() * 3;
            const z = -Math.random() * 60 + 5;

            crystal.position.set(x, y, z);
            crystal.rotation.x = isCeiling ? Math.PI : 0;
            crystal.rotation.z = (Math.random() - 0.5) * 0.4;
            crystal.scale.setScalar(0.7 + Math.random() * 0.8);

            crystal.userData = {
                initialX: x,
                initialY: y,
                rotSpeed: (Math.random() - 0.5) * 0.02,
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatOffset: Math.random() * Math.PI * 2
            };

            this.sceneGroup.add(crystal);
            this.crystals.push(crystal);
        }

        // 2. High-speed Cave Energy Particle Field
        this.particleCount = 450;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const scales = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 45;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
            scales[i] = Math.random() * 0.15 + 0.05;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        this.particleMat = new THREE.PointsMaterial({
            color: this.currentPalette.particles,
            size: 0.4,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particleGeo, this.particleMat);
        this.sceneGroup.add(this.particles);

        // 3. Cyber/Cavern Grid Horizon Lines (Top & Bottom)
        const gridHelperTop = new THREE.GridHelper(80, 20, this.currentPalette.primary, this.currentPalette.accent);
        gridHelperTop.position.set(0, 10, -20);
        this.sceneGroup.add(gridHelperTop);
        this.gridTop = gridHelperTop;

        const gridHelperBottom = new THREE.GridHelper(80, 20, this.currentPalette.primary, this.currentPalette.accent);
        gridHelperBottom.position.set(0, -10, -20);
        this.sceneGroup.add(gridHelperBottom);
        this.gridBottom = gridHelperBottom;
    }

    setTheme(level) {
        const index = (Math.max(1, level) - 1) % this.THEME_PALETTES.length;
        this.targetPalette = this.THEME_PALETTES[index];
    }

    setSpeed(speedMultiplier) {
        this.speed = Math.max(0.2, speedMultiplier);
    }

    setGravityDir(dir) {
        this.gravityDir = dir;
        // Gravity Flip 3D roll effect: flip camera Z roll and shift Y target
        this.targetCamRoll = dir === -1 ? Math.PI * 0.12 : -Math.PI * 0.12;
        this.targetCamY = dir === -1 ? 1.5 : -1.5;

        // Reset camera roll back towards zero after flip burst
        setTimeout(() => {
            this.targetCamRoll = 0;
            this.targetCamY = dir === -1 ? 0.8 : -0.8;
        }, 350);
    }

    triggerPulse(colorHex = null) {
        this.pulseIntensity = 1.8;
        if (colorHex) {
            this.pointLight1.color.setHex(colorHex);
        }
    }

    onWindowResize() {
        if (!this.canvas || !this.renderer || !this.camera) return;
        const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
        const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now() * 0.001;

        // 1. Smoothly Lerp Theme Colors & Fog
        const lerpSpeed = 0.04;
        this.ambientLight.color.lerp(new THREE.Color(this.targetPalette.primary), lerpSpeed);
        this.pointLight1.color.lerp(new THREE.Color(this.targetPalette.primary), lerpSpeed);
        this.pointLight2.color.lerp(new THREE.Color(this.targetPalette.secondary), lerpSpeed);
        this.particleMat.color.lerp(new THREE.Color(this.targetPalette.particles), lerpSpeed);
        this.scene.fog.color.lerp(new THREE.Color(this.targetPalette.fog), lerpSpeed);

        // 2. Pulse Decay
        if (this.pulseIntensity > 0) {
            this.pulseIntensity -= 0.05;
            this.pointLight1.intensity = 3 + this.pulseIntensity * 4;
        } else {
            this.pointLight1.intensity = 3;
        }

        // 3. Smooth Camera Gravity Roll & Elevation Interpolation
        this.currentCamRoll += (this.targetCamRoll - this.currentCamRoll) * 0.1;
        this.currentCamY += (this.targetCamY - this.currentCamY) * 0.08;

        this.camera.rotation.z = this.currentCamRoll;
        this.camera.position.y = this.currentCamY + Math.sin(time * 1.5) * 0.2;

        // 4. Move Energy Particles along Z-axis (Speed Tunnel effect)
        const pos = this.particles.geometry.attributes.position.array;
        const moveZ = 0.3 * this.speed;

        for (let i = 0; i < this.particleCount; i++) {
            pos[i * 3 + 2] += moveZ;

            // Loop back particles when passing camera
            if (pos[i * 3 + 2] > 20) {
                pos[i * 3 + 2] = -50;
                pos[i * 3] = (Math.random() - 0.5) * 45;
                pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;

        // 5. Animate Floating 3D Crystals
        this.crystals.forEach(c => {
            c.position.z += moveZ * 0.6;
            c.rotation.y += c.userData.rotSpeed;
            c.position.y = c.userData.initialY + Math.sin(time * 2 + c.userData.floatOffset) * 0.3;

            if (c.position.z > 20) {
                c.position.z = -55 - Math.random() * 10;
            }
        });

        // 6. Scroll Top & Bottom Grid Horizons
        if (this.gridTop && this.gridBottom) {
            this.gridTop.position.z = (time * 8 * this.speed) % 4 - 20;
            this.gridBottom.position.z = (time * 8 * this.speed) % 4 - 20;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Global instance handle
window.GravityThreeBG = GravityThreeBG;
