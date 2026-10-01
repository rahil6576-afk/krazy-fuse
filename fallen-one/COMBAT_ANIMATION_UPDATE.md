# Fallen One — Combat Animation & VFX Update

Implemented without replacing the existing frame-data/collision engine.

## Added
- Per-character combat style profiles for AARAV, SOLAR, FROST, VOLT, SHADOW and TERRA.
- Per-move melee hitbox reach/width/height tuning.
- Projectile travel distance derived from the character's style/range profile.
- Attack-specific startup, active and recovery body motion layered over the existing sprite poses.
- Character-specific attack release particles, shockwaves and movement bursts.
- Character-specific dash dust colors.
- Jump/landing impact FX.
- Heavy/tank ground propagation FX.
- Distinct combat identities: precision, heavy, zoning, rushdown, assassin and tank.

## Main files
- `js/graphics/combatStyle.js` — style, range and animation profiles.
- `js/entities/fighter.js` — applies profiles to attacks and movement events.
- `js/graphics/fighterSprites.js` — attack body motion and visual attack accents.
- `js/graphics/particleSystem.js` — attack release and movement VFX.

## Range philosophy
Ranges are tuned as practical hitbox reach rather than UI-only numbers. Long-range specials/projectiles use larger travel distances while point-blank attacks stay compact.
