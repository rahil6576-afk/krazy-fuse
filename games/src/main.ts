import {
  Application,
  Assets,
  Sprite,
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

(async () => {
  // 1. Create a new high-performance PixiJS v8 Application
  const app = new Application();

  // Initialize with modern dark background and resize handling
  await app.init({
    background: "#080b18",
    resizeTo: window,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  // Append canvas to container
  const containerEl = document.getElementById("pixi-container");
  if (containerEl) {
    containerEl.appendChild(app.canvas);
  } else {
    document.body.appendChild(app.canvas);
  }

  // 2. Background Grid Graphics
  const gridGraphics = new Graphics();
  app.stage.addChild(gridGraphics);

  const drawBackground = () => {
    gridGraphics.clear();
    const w = app.screen.width;
    const h = app.screen.height;

    // Draw subtle glowing cyber grid lines
    gridGraphics.setStrokeStyle({ width: 1, color: 0x1f2945, alpha: 0.35 });
    for (let x = 0; x < w; x += 50) {
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, h);
    }
    for (let y = 0; y < h; y += 50) {
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(w, y);
    }
    gridGraphics.stroke();
  };

  drawBackground();
  window.addEventListener("resize", drawBackground);

  // 3. Load Sprite Assets
  let bunnyTexture;
  try {
    bunnyTexture = await Assets.load("/assets/bunny.png");
  } catch {
    // Fallback if asset is missing
    const g = new Graphics();
    g.circle(0, 0, 16);
    g.fill({ color: 0x00f0ff });
    bunnyTexture = app.renderer.generateTexture(g);
  }

  // 4. Sprites Container
  const spritesContainer = new Container();
  app.stage.addChild(spritesContainer);

  interface PhysicsSprite {
    sprite: Sprite;
    vx: number;
    vy: number;
    rotSpeed: number;
  }

  const sprites: PhysicsSprite[] = [];

  const spawnSprite = (x: number, y: number) => {
    const sprite = new Sprite(bunnyTexture);
    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    sprite.scale.set(1 + Math.random() * 0.8);
    sprite.tint = [0x4353ff, 0x00f0ff, 0xff007f, 0xffd700, 0x10b981][
      Math.floor(Math.random() * 5)
    ];

    spritesContainer.addChild(sprite);

    sprites.push({
      sprite,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      rotSpeed: (Math.random() - 0.5) * 0.1,
    });

    if (sprites.length > 150) {
      const oldest = sprites.shift();
      if (oldest) {
        spritesContainer.removeChild(oldest.sprite);
        oldest.sprite.destroy();
      }
    }
  };

  // Spawn initial cluster
  const cx = app.screen.width / 2;
  const cy = app.screen.height / 2;
  for (let i = 0; i < 25; i++) {
    spawnSprite(
      cx + (Math.random() * 200 - 100),
      cy + (Math.random() * 200 - 100),
    );
  }

  // 5. Header Title Text in PixiJS
  const titleStyle = new TextStyle({
    fontFamily: "Outfit, sans-serif",
    fontSize: 28,
    fontWeight: "bold",
    fill: "#ffffff",
    dropShadow: {
      alpha: 0.6,
      angle: 1.5,
      blur: 8,
      color: "#4353ff",
      distance: 3,
    },
  });

  const titleText = new Text({
    text: "⚡ PIXI.JS WebGL Acceleration",
    style: titleStyle,
  });
  titleText.anchor.set(0.5, 0);
  titleText.position.set(app.screen.width / 2, 70);
  app.stage.addChild(titleText);

  window.addEventListener("resize", () => {
    titleText.position.set(app.screen.width / 2, 70);
  });

  // 6. Interactive Click / Touch Particle Spawning
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;

  app.stage.on("pointerdown", (e) => {
    for (let i = 0; i < 8; i++) {
      spawnSprite(e.global.x, e.global.y);
    }
  });

  app.stage.on("pointermove", (e) => {
    if (e.buttons > 0) {
      spawnSprite(e.global.x, e.global.y);
    }
  });

  // 7. 60FPS Game Physics Loop
  app.ticker.add((time) => {
    const w = app.screen.width;
    const h = app.screen.height;
    const dt = time.deltaTime;

    for (const item of sprites) {
      item.sprite.x += item.vx * dt;
      item.sprite.y += item.vy * dt;
      item.vy += 0.25 * dt; // Gravity
      item.sprite.rotation += item.rotSpeed * dt;

      // Bounce off walls
      if (item.sprite.x < 20) {
        item.sprite.x = 20;
        item.vx *= -0.85;
      } else if (item.sprite.x > w - 20) {
        item.sprite.x = w - 20;
        item.vx *= -0.85;
      }

      // Bounce off floor
      if (item.sprite.y > h - 40) {
        item.sprite.y = h - 40;
        item.vy *= -0.75;
        item.vx *= 0.98;
      }
    }
  });
})();
