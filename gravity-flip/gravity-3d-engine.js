// gravity-3d-engine.js — Refined 3D Forward Dodge Runner Engine for Gravity Flip
// Features Z-Axis Forward Corridor Motion, 3D Left/Right Steering, Upward/Downward Gravity Flipping, 3D Multi-Lane Spikes, and Box3 Collisions

class Gravity3DEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas || typeof THREE === 'undefined') {
            console.error('Three.js canvas or library unavailable.');
            return;
        }

        // Vibrant 3D Cavern Biome Color Palettes
        this.BIOMES = [
            // Level 1: Amber Quartz
            {
                name: 'AMBER QUARTZ CAVERN',
                primary: 0xf59e0b,
                secondary: 0xfcd34d,
                accent: 0xd97706,
                rockMain: 0x78350f,
                rockHighlight: 0xfcb813,
                glassColor: 0xffb703,
                fog: 0x1c0d02,
                bgHex: 0x271203
            },
            // Level 2: Sapphire Crystal Grotto
            {
                name: 'SAPPHIRE CRYSTAL GROTTO',
                primary: 0x38bdf8,
                secondary: 0xc084fc,
                accent: 0x0284c7,
                rockMain: 0x1e3a8a,
                rockHighlight: 0x38bdf8,
                glassColor: 0x38bdf8,
                fog: 0x031224,
                bgHex: 0x061c36
            },
            // Level 3: Ruby Magma Chasm
            {
                name: 'RUBY MAGMA CHASM',
                primary: 0xf97316,
                secondary: 0xfca5a5,
                accent: 0xb91c1c,
                rockMain: 0x7f1d1d,
                rockHighlight: 0xef4444,
                glassColor: 0xef4444,
                fog: 0x220503,
                bgHex: 0x330804
            },
            // Level 4: Emerald Bioluminescent Depths
            {
                name: 'EMERALD BIOLUMINESCENT DEPTHS',
                primary: 0x10b981,
                secondary: 0x6ee7b7,
                accent: 0x047857,
                rockMain: 0x064e3b,
                rockHighlight: 0x34d399,
                glassColor: 0x34d399,
                fog: 0x02160f,
                bgHex: 0x042419
            },
            // Level 5: Amethyst Runic Void
            {
                name: 'AMETHYST RUNIC VOID',
                primary: 0xc084fc,
                secondary: 0xf472b6,
                accent: 0x7e22ce,
                rockMain: 0x581c87,
                rockHighlight: 0xe879f9,
                glassColor: 0xe879f9,
                fog: 0x120324,
                bgHex: 0x1c0636
            }
        ];

        this.currentBiome = this.BIOMES[0];
        this.targetBiome = this.BIOMES[0];

        // 3D Tunnel World Bounds
        this.FLOOR_Y = -2.8;
        this.CEIL_Y = 2.8;
        this.MIN_X = -3.6;
        this.MAX_X = 3.6;
        this.PLAYER_Z = 6.2;

        // Player 3D Position & Physics State
        this.playerX = 0;
        this.targetX = 0;
        this.playerY = this.FLOOR_Y;
        this.playerVy = 0;
        this.gravDir = 1; // 1 = Floor, -1 = Ceiling
        this.isGrounded = true;
        this.targetCamRoll = 0;
        this.currentCamRoll = 0;
        this.runCycle = 0;

        // Game Motion State
        this.speed = 1.0;
        this.distance = 0;
        this.shakeTimer = 0;

        // Scene Entity Collections
        this.obstacles = [];
        this.collectibles = [];
        this.shards = [];

        this.initThree();
        this.createHighQuality3DPlayer();
        this.createForwardTunnelCorridor();
        this.onWindowResize();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    initThree() {
        // Scene with vibrant biome background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.currentBiome.bgHex);
        this.scene.fog = new THREE.FogExp2(this.currentBiome.fog, 0.015);

        // Forward Perspective Camera looking down -Z axis corridor
        const width = this.canvas.clientWidth || 1000;
        const height = this.canvas.clientHeight || 600;
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 180);
        this.camera.position.set(0, 0.4, 10.5);
        this.camera.lookAt(0, 0, -60);

        // WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: false,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // High Intensity Ambient Light to prevent pitch black scenes
        this.ambientLight = new THREE.AmbientLight(this.currentBiome.primary, 1.8);
        this.scene.add(this.ambientLight);

        // Dynamic Point Lights in the Tunnel
        this.torchLight1 = new THREE.PointLight(this.currentBiome.primary, 6.0, 60);
        this.torchLight1.position.set(0, 2.5, -5);
        this.scene.add(this.torchLight1);

        this.torchLight2 = new THREE.PointLight(this.currentBiome.secondary, 5.0, 60);
        this.torchLight2.position.set(0, -2.5, -30);
        this.scene.add(this.torchLight2);

        // Directional Sun Light
        this.dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
        this.dirLight.position.set(0, 15, 5);
        this.scene.add(this.dirLight);
    }

    createHighQuality3DPlayer() {
        this.playerGroup = new THREE.Group();
        this.playerGroup.position.set(this.playerX, this.FLOOR_Y, this.PLAYER_Z);
        this.scene.add(this.playerGroup);

        // Bright Rim Light attached to Player so character pops out
        this.playerRimLight = new THREE.PointLight(0xfff5c0, 2.5, 8);
        this.playerRimLight.position.set(0, 1.2, 0.5);
        this.playerGroup.add(this.playerRimLight);

        // 1. Torso / High-Tech Suit
        const suitMat = new THREE.MeshPhongMaterial({
            color: 0x0284c7,
            emissive: 0x0369a1,
            emissiveIntensity: 0.4,
            shininess: 60
        });
        const chestGeo = new THREE.BoxGeometry(0.65, 0.85, 0.55);
        this.torso = new THREE.Mesh(chestGeo, suitMat);
        this.torso.position.y = 0.65;
        this.playerGroup.add(this.torso);

        // Metallic Armor Plate
        const armorMat = new THREE.MeshPhongMaterial({ color: 0xfcd34d, emissive: 0xd97706, emissiveIntensity: 0.3, shininess: 90 });
        const armorPlate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.22), armorMat);
        armorPlate.position.set(0, 0.68, -0.22);
        this.playerGroup.add(armorPlate);

        // Utility Belt
        const beltMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 80 });
        const belt = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.15, 0.58), beltMat);
        belt.position.y = 0.28;
        this.playerGroup.add(belt);

        // Backpack / Energy Jetpack
        const packMat = new THREE.MeshPhongMaterial({ color: 0x1e293b, shininess: 70 });
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.65, 0.35), packMat);
        pack.position.set(0, 0.7, 0.38);
        this.playerGroup.add(pack);

        // 2. Head & Futuristic Helmet with Neon Visor facing -Z
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 1.25, 0);
        this.playerGroup.add(headGroup);

        const helmetMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.3, shininess: 100 });
        const helmetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), helmetMat);
        headGroup.add(helmetMesh);

        // Glowing Neon Visor facing forward down -Z
        const visorMat = new THREE.MeshPhongMaterial({
            color: 0x38bdf8,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.95,
            shininess: 100
        });
        const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16, 1, false, 0, Math.PI), visorMat);
        visor.position.set(0, 0.02, -0.15);
        headGroup.add(visor);

        // Headlamp Spotlight pointing forward down the tunnel (-Z)
        this.headlamp = new THREE.SpotLight(0xffffff, 6.0, 50, Math.PI / 4, 0.3);
        this.headlamp.position.set(0, 1.35, -0.4);
        this.headlamp.target.position.set(0, 0.5, -50);
        this.playerGroup.add(this.headlamp);
        this.playerGroup.add(this.headlamp.target);

        // Volumetric Headlamp Beam Cone Mesh
        const beamMat = new THREE.MeshBasicMaterial({
            color: 0xfff5c0,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const beamMesh = new THREE.Mesh(new THREE.ConeGeometry(5.0, 20, 16, 1, true), beamMat);
        beamMesh.rotation.x = -Math.PI / 2;
        beamMesh.position.set(0, 0.8, -10.0);
        this.playerGroup.add(beamMesh);

        // 3. Segmented Limbs
        const limbMat = new THREE.MeshPhongMaterial({ color: 0x0f172a, shininess: 40 });
        const bootMat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 80 });

        // Left Leg
        this.leftLegGroup = new THREE.Group();
        this.leftLegGroup.position.set(-0.2, 0.22, 0);
        const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.35, 8), limbMat);
        lThigh.position.y = -0.18;
        this.leftLegGroup.add(lThigh);
        const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.3), bootMat);
        lBoot.position.set(0, -0.36, -0.05);
        this.leftLegGroup.add(lBoot);
        this.playerGroup.add(this.leftLegGroup);

        // Right Leg
        this.rightLegGroup = new THREE.Group();
        this.rightLegGroup.position.set(0.2, 0.22, 0);
        const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.35, 8), limbMat);
        rThigh.position.y = -0.18;
        this.rightLegGroup.add(rThigh);
        const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.3), bootMat);
        rBoot.position.set(0, -0.36, -0.05);
        this.rightLegGroup.add(rBoot);
        this.playerGroup.add(this.rightLegGroup);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.5, 8);
        this.leftArm = new THREE.Mesh(armGeo, suitMat);
        this.leftArm.position.set(-0.4, 0.7, 0);
        this.playerGroup.add(this.leftArm);

        this.rightArm = new THREE.Mesh(armGeo, suitMat);
        this.rightArm.position.set(0.4, 0.7, 0);
        this.playerGroup.add(this.rightArm);

        // 4. Chrono Shield Orb Mesh
        const shieldMat = new THREE.MeshPhongMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.5,
            wireframe: true
        });
        this.shieldMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 2), shieldMat);
        this.shieldMesh.position.y = 0.7;
        this.shieldMesh.visible = false;
        this.playerGroup.add(this.shieldMesh);

        // 3D Bounding Box for Collisions
        this.playerBox = new THREE.Box3();
    }

    createForwardTunnelCorridor() {
        this.corridorGroup = new THREE.Group();
        this.scene.add(this.corridorGroup);

        // 1. Bedrock Floor Track (Extending down Z-axis)
        const trackLength = 260;
        this.floorMat = new THREE.MeshPhongMaterial({
            color: this.currentBiome.rockMain,
            emissive: this.currentBiome.accent,
            emissiveIntensity: 0.2,
            flatShading: true,
            shininess: 30
        });

        this.floorMesh = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, trackLength), this.floorMat);
        this.floorMesh.position.set(0, this.FLOOR_Y - 0.2, -trackLength / 2 + 20);
        this.corridorGroup.add(this.floorMesh);

        // 2. Bedrock Ceiling Track
        this.ceilMat = new THREE.MeshPhongMaterial({
            color: this.currentBiome.rockMain,
            emissive: this.currentBiome.accent,
            emissiveIntensity: 0.2,
            flatShading: true,
            shininess: 30
        });
        this.ceilMesh = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, trackLength), this.ceilMat);
        this.ceilMesh.position.set(0, this.CEIL_Y + 0.2, -trackLength / 2 + 20);
        this.corridorGroup.add(this.ceilMesh);

        // 3. Side Walls & Glowing Crystal Arches down the Tunnel
        for (let z = 15; z > -170; z -= 10) {
            const archMat = new THREE.MeshPhongMaterial({
                color: this.currentBiome.rockHighlight,
                emissive: this.currentBiome.primary,
                emissiveIntensity: 0.35,
                flatShading: true
            });

            // Left Wall Pillar
            const pLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.85, 8, 6), archMat);
            pLeft.position.set(-7.5, 0, z);
            this.corridorGroup.add(pLeft);

            // Right Wall Pillar
            const pRight = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.85, 8, 6), archMat);
            pRight.position.set(7.5, 0, z);
            this.corridorGroup.add(pRight);
        }
    }

    setBiome(level) {
        const index = (Math.max(1, level) - 1) % this.BIOMES.length;
        this.targetBiome = this.BIOMES[index];
    }

    setSpeed(speedVal) {
        this.speed = Math.max(0.2, speedVal);
    }

    steerLeft(amount = 0.28) {
        this.targetX = Math.max(this.MIN_X, this.targetX - amount);
    }

    steerRight(amount = 0.28) {
        this.targetX = Math.min(this.MAX_X, this.targetX + amount);
    }

    setPlayerHorizontal(normX) {
        this.targetX = normX * this.MAX_X;
    }

    flipGravity() {
        this.gravDir *= -1;
        this.isGrounded = false;
        this.playerVy = this.gravDir * 0.45;

        // Camera Z Roll Flip target (0 = Upright, Math.PI = Upside Down)
        this.targetCamRoll = this.gravDir === -1 ? Math.PI : 0;

        // Landing dust particles
        this.createRockExplosion(this.playerX, this.playerY, this.currentBiome.primary, 18);
    }

    // Shatter a 3D obstacle into tumbling shards on collision or hit
    shatterMesh(meshGroup, colorHex = null) {
        const shardColor = colorHex || this.currentBiome.glassColor;
        const centerPos = meshGroup.position.clone();

        this.scene.remove(meshGroup);

        for (let i = 0; i < 24; i++) {
            const size = 0.15 + Math.random() * 0.25;
            const geo = Math.random() > 0.5 ? new THREE.BoxGeometry(size, size, size) : new THREE.TetrahedronGeometry(size);
            const mat = new THREE.MeshPhongMaterial({
                color: shardColor,
                emissive: shardColor,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.9,
                shininess: 90
            });

            const shard = new THREE.Mesh(geo, mat);
            shard.position.copy(centerPos);
            shard.position.x += (Math.random() - 0.5) * 0.8;
            shard.position.y += (Math.random() - 0.5) * 0.8;
            shard.position.z += (Math.random() - 0.5) * 0.8;

            const vx = (Math.random() - 0.5) * 0.35;
            const vy = (Math.random() - 0.5) * 0.35 + 0.1;
            const vz = (Math.random() - 0.5) * 0.35 - 0.2;

            const rotX = (Math.random() - 0.5) * 0.3;
            const rotY = (Math.random() - 0.5) * 0.3;

            this.scene.add(shard);
            this.shards.push({
                mesh: shard,
                vx, vy, vz,
                rotX, rotY,
                life: 38
            });
        }
    }

    spawn3DObstacle(obsData) {
        const group = new THREE.Group();

        if (obsData.type === 'STALACTITE' || obsData.type === 'STALAGMITE' || obsData.type === 'FALLING_STALACTITE') {
            // Faceted Cone Rock Spike
            const geo = new THREE.ConeGeometry(0.95, 3.4, 7);
            const mat = new THREE.MeshPhongMaterial({
                color: this.currentBiome.rockHighlight,
                emissive: this.currentBiome.primary,
                emissiveIntensity: 0.55,
                flatShading: true,
                shininess: 80
            });
            const cone = new THREE.Mesh(geo, mat);

            if (obsData.dir === 'top' || obsData.type === 'STALACTITE' || obsData.type === 'FALLING_STALACTITE') {
                cone.rotation.x = Math.PI;
            }
            group.add(cone);
        } else if (obsData.type === 'ROTATING_SAW') {
            // Spinning Energy Saw Blade
            const sawGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.16, 16);
            const sawMat = new THREE.MeshPhongMaterial({
                color: 0xef4444,
                emissive: 0xef4444,
                emissiveIntensity: 0.7,
                shininess: 100
            });
            const saw = new THREE.Mesh(sawGeo, sawMat);
            group.add(saw);
        } else {
            // Glass Barrier Wall / Pillar
            const geo = new THREE.BoxGeometry(2.6, 3.6, 0.5);
            const mat = new THREE.MeshPhongMaterial({
                color: this.currentBiome.secondary,
                emissive: this.currentBiome.primary,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.88
            });
            const wall = new THREE.Mesh(geo, mat);
            group.add(wall);
        }

        // Spawn far down the tunnel along -Z axis
        const z3D = -110 - Math.random() * 10;
        const y3D = obsData.dir === 'top' || obsData.type === 'STALACTITE' ? this.CEIL_Y - 1.2 : this.FLOOR_Y + 1.2;

        // Position across Left, Center, or Right lanes
        let x3D = 0;
        if (obsData.lane === 'left') x3D = -2.6;
        else if (obsData.lane === 'right') x3D = 2.6;
        else if (obsData.lane === 'center') x3D = 0;
        else x3D = (Math.random() - 0.5) * 4.8;

        group.position.set(x3D, y3D, z3D);
        this.scene.add(group);

        this.obstacles.push({
            data: obsData,
            mesh: group,
            box: new THREE.Box3()
        });
    }

    spawn3DCollectible(colData) {
        const group = new THREE.Group();

        if (colData.type === 'GEM' || colData.type === 'PYRAMID') {
            // 3D Gem Crystal (Octahedron Geometry)
            const geo = new THREE.OctahedronGeometry(0.65);
            const mat = new THREE.MeshPhongMaterial({
                color: 0xffd166,
                emissive: 0xf59e0b,
                emissiveIntensity: 0.8,
                shininess: 100
            });
            const gem = new THREE.Mesh(geo, mat);
            group.add(gem);

            const pLight = new THREE.PointLight(0xffd166, 3.0, 9);
            group.add(pLight);
        } else {
            // Powerup Relic Orb (Shield, Magnet, Slow-Mo)
            const geo = new THREE.DodecahedronGeometry(0.7);
            const mat = new THREE.MeshPhongMaterial({
                color: colData.type === 'SHIELD' ? 0x38bdf8 : (colData.type === 'MAGNET' ? 0xa855f7 : 0x34d399),
                emissive: 0xffffff,
                emissiveIntensity: 0.6,
                wireframe: true
            });
            group.add(new THREE.Mesh(geo, mat));
        }

        const z3D = -110 - Math.random() * 10;
        const y3D = (Math.random() - 0.5) * 3.5;
        let x3D = 0;
        if (colData.lane === 'left') x3D = -2.6;
        else if (colData.lane === 'right') x3D = 2.6;
        else x3D = (Math.random() - 0.5) * 4.2;

        group.position.set(x3D, y3D, z3D);
        this.scene.add(group);

        this.collectibles.push({
            data: colData,
            mesh: group,
            box: new THREE.Box3()
        });
    }

    createRockExplosion(x3D, y3D, colorHex, count = 20) {
        for (let i = 0; i < count; i++) {
            const geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
            const mat = new THREE.MeshPhongMaterial({ color: colorHex, flatShading: true });
            const p = new THREE.Mesh(geo, mat);
            p.position.set(x3D, y3D, this.PLAYER_Z);

            const vx = (Math.random() - 0.5) * 0.3;
            const vy = (Math.random() - 0.5) * 0.3;
            const vz = (Math.random() - 0.5) * 0.3;

            this.scene.add(p);
            this.shards.push({ mesh: p, vx, vy, vz, rotX: 0.1, rotY: 0.1, life: 25 });
        }
    }

    triggerPulse(colorHex) {
        if (colorHex) {
            this.torchLight1.color.setHex(colorHex);
        }
        this.torchLight1.intensity = 8.0;
    }

    triggerShake(duration = 20) {
        this.shakeTimer = duration;
    }

    updatePhysicsAndAnimations(playerState) {
        const time = performance.now() * 0.001;

        // 1. Lerp Biome Colors
        const lerpSpd = 0.05;
        this.ambientLight.color.lerp(new THREE.Color(this.targetBiome.primary), lerpSpd);
        this.torchLight1.color.lerp(new THREE.Color(this.targetBiome.primary), lerpSpd);
        this.torchLight2.color.lerp(new THREE.Color(this.targetBiome.secondary), lerpSpd);
        this.floorMat.color.lerp(new THREE.Color(this.targetBiome.rockMain), lerpSpd);
        this.ceilMat.color.lerp(new THREE.Color(this.targetBiome.rockMain), lerpSpd);
        this.scene.fog.color.lerp(new THREE.Color(this.targetBiome.fog), lerpSpd);
        this.scene.background.lerp(new THREE.Color(this.targetBiome.bgHex), lerpSpd);

        // Torch light decay
        if (this.torchLight1.intensity > 6.0) {
            this.torchLight1.intensity -= 0.1;
        }

        // 2. Smooth Left/Right Player Steering Interpolation
        this.playerX += (this.targetX - this.playerX) * 0.18;
        this.playerGroup.position.x = this.playerX;
        
        // Gentle body roll tilt when steering
        this.playerGroup.rotation.z = (this.targetX - this.playerX) * -0.15;

        // 3. 3D Player Gravity Physics & Vertical Movement
        const gravAcc = this.gravDir * 0.025;
        this.playerVy += gravAcc;
        this.playerY += this.playerVy;

        if (this.gravDir === 1 && this.playerY <= this.FLOOR_Y) {
            this.playerY = this.FLOOR_Y;
            this.playerVy = 0;
            this.isGrounded = true;
        } else if (this.gravDir === -1 && this.playerY >= this.CEIL_Y) {
            this.playerY = this.CEIL_Y;
            this.playerVy = 0;
            this.isGrounded = true;
        }

        this.playerGroup.position.y = this.playerY;

        // Smooth Camera Z Roll Interpolation for Gravity Flip
        this.currentCamRoll += (this.targetCamRoll - this.currentCamRoll) * 0.12;
        this.camera.rotation.z = this.currentCamRoll;

        // Running limb animation
        if (this.isGrounded) {
            this.runCycle += this.speed * 0.3;
            this.leftLegGroup.rotation.x = Math.sin(this.runCycle) * 0.65;
            this.rightLegGroup.rotation.x = -Math.sin(this.runCycle) * 0.65;
            this.leftArm.rotation.x = -Math.sin(this.runCycle) * 0.55;
            this.rightArm.rotation.x = Math.sin(this.runCycle) * 0.55;
        }

        // Shield Mesh
        if (this.shieldMesh) {
            this.shieldMesh.visible = !!playerState.shield;
            if (this.shieldMesh.visible) {
                this.shieldMesh.rotation.y += 0.06;
            }
        }

        // Update Player Bounding Box
        this.playerBox.setFromObject(this.playerGroup);

        // 4. Move 3D Obstacles Forward down +Z axis towards Player
        const moveDist = 0.55 * this.speed;
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.mesh.position.z += moveDist;

            if (obs.data.type === 'ROTATING_SAW') {
                obs.mesh.rotation.z += 0.22;
            }

            // Remove when passing behind camera
            if (obs.mesh.position.z > 15) {
                this.scene.remove(obs.mesh);
                this.obstacles.splice(i, 1);
            }
        }

        // 5. Move 3D Collectibles / Relics Forward
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const col = this.collectibles[i];
            col.mesh.position.z += moveDist;
            col.mesh.rotation.y += 0.06;

            // Magnet Attraction towards Player
            if (playerState.magnetTimer > 0) {
                const dx = this.playerX - col.mesh.position.x;
                const dy = this.playerY - col.mesh.position.y;
                const dz = this.PLAYER_Z - col.mesh.position.z;
                const dist = Math.hypot(dx, dy, dz);
                if (dist < 12.0) {
                    col.mesh.position.x += (dx / dist) * 0.35;
                    col.mesh.position.y += (dy / dist) * 0.35;
                    col.mesh.position.z += (dz / dist) * 0.35;
                }
            }

            if (col.mesh.position.z > 15) {
                this.scene.remove(col.mesh);
                this.collectibles.splice(i, 1);
            }
        }

        // 6. Update 3D Shattered Crystal Shards Physics
        for (let i = this.shards.length - 1; i >= 0; i--) {
            const s = this.shards[i];
            s.mesh.position.x += s.vx;
            s.mesh.position.y += s.vy;
            s.mesh.position.z += s.vz;
            s.mesh.rotation.x += s.rotX;
            s.mesh.rotation.y += s.rotY;

            s.life--;
            if (s.life <= 0) {
                this.scene.remove(s.mesh);
                this.shards.splice(i, 1);
            }
        }

        // 7. Camera Shake & Follow
        if (this.shakeTimer > 0) {
            this.shakeTimer--;
            this.camera.position.x = (Math.random() - 0.5) * 0.45;
            this.camera.position.y = 0.4 + (Math.random() - 0.5) * 0.45;
        } else {
            this.camera.position.x = this.playerX * 0.35;
            this.camera.position.y = 0.4;
        }

        // Render Frame
        this.renderer.render(this.scene, this.camera);
    }

    check3DPlayerCollisions(onObstacleHit, onCollectibleHit) {
        this.playerBox.setFromObject(this.playerGroup);

        // Player Collision with Obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.box.setFromObject(obs.mesh);

            if (this.playerBox.intersectsBox(obs.box)) {
                const removeObs = onObstacleHit(obs.data);
                if (removeObs) {
                    this.shatterMesh(obs.mesh, 0xef4444);
                    this.obstacles.splice(i, 1);
                }
            }
        }

        // Player Pickup of Crystals / Relics
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const col = this.collectibles[i];
            col.box.setFromObject(col.mesh);

            if (this.playerBox.intersectsBox(col.box)) {
                onCollectibleHit(col.data);
                this.shatterMesh(col.mesh, 0xffd166);
                this.collectibles.splice(i, 1);
            }
        }
    }

    clearScene() {
        this.obstacles.forEach(o => this.scene.remove(o.mesh));
        this.collectibles.forEach(c => this.scene.remove(c.mesh));
        this.shards.forEach(s => this.scene.remove(s.mesh));
        this.obstacles = [];
        this.collectibles = [];
        this.shards = [];
    }

    onWindowResize() {
        if (!this.canvas || !this.renderer || !this.camera) return;
        const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
        const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    }
}

window.Gravity3DEngine = Gravity3DEngine;
