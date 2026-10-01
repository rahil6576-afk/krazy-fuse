// Combat style profiles: per-fighter animation personality, attack reach and VFX.
// Ranges are measured from the fighter's origin and expressed as hitbox offset/size.

const BASE = {
  LIGHT_PUNCH: { offsetX: 36, width: 42, height: 25, offsetY: -95 },
  HEAVY_PUNCH: { offsetX: 48, width: 64, height: 32, offsetY: -95 },
  LIGHT_KICK: { offsetX: 42, width: 48, height: 28, offsetY: -48 },
  HEAVY_KICK: { offsetX: 52, width: 66, height: 40, offsetY: -72 },
  SPECIAL_1: { offsetX: 58, width: 72, height: 42, offsetY: -92 },
  SPECIAL_2: { offsetX: 120, width: 150, height: 42, offsetY: -45 },
  SPECIAL_3: { offsetX: 90, width: 150, height: 70, offsetY: -55 },
  RISING_KICK: { offsetX: 34, width: 58, height: 82, offsetY: -120 },
  ULTIMATE: { offsetX: 140, width: 280, height: 160, offsetY: -110 }
};

export const COMBAT_STYLES = {
  AARAV: {
    archetype: 'precision', color: '#00e5ff', trail: 'energy',
    movement: { idle: 1, walk: 1, dash: 1.05 },
    ranges: { ...BASE, HEAVY_PUNCH: { offsetX: 52, width: 76, height: 34 }, SPECIAL_1: { offsetX: 58, width: 76, height: 44 }, SPECIAL_2: { offsetX: 44, width: 42, height: 34 }, ULTIMATE: { offsetX: 230, width: 620, height: 210, offsetY: -100 } }
  },
  SOLAR: {
    archetype: 'heavy', color: '#ff6b2c', trail: 'flame',
    movement: { idle: 1.0, walk: 1.0, dash: 1.0 },
    ranges: { ...BASE, LIGHT_PUNCH: { offsetX: 42, width: 52 }, HEAVY_PUNCH: { offsetX: 56, width: 82 }, LIGHT_KICK: { offsetX: 46, width: 58 }, HEAVY_KICK: { offsetX: 62, width: 92, height: 48 }, SPECIAL_1: { offsetX: 72, width: 100 }, SPECIAL_2: { offsetX: 95, width: 180, height: 46 }, RISING_KICK: { offsetX: 38, width: 66, height: 92 }, ULTIMATE: { offsetX: 230, width: 700, height: 250, offsetY: -130 } }
  },
  FROST: {
    archetype: 'zoning', color: '#38bdf8', trail: 'ice',
    movement: { idle: 1.02, walk: 1.0, dash: 1.0 },
    ranges: { ...BASE, LIGHT_PUNCH: { offsetX: 40, width: 48 }, HEAVY_PUNCH: { offsetX: 58, width: 86 }, LIGHT_KICK: { offsetX: 50, width: 64 }, HEAVY_KICK: { offsetX: 62, width: 88 }, SPECIAL_1: { offsetX: 70, width: 110 }, SPECIAL_2: { offsetX: 44, width: 40 }, RISING_KICK: { offsetX: 34, width: 64, height: 92 }, ULTIMATE: { offsetX: 260, width: 760, height: 240, offsetY: -115 } }
  },
  VOLT: {
    archetype: 'rushdown', color: '#facc15', trail: 'lightning',
    movement: { idle: 1.15, walk: 1.18, dash: 1.3 },
    ranges: { ...BASE, LIGHT_PUNCH: { offsetX: 38, width: 46 }, HEAVY_PUNCH: { offsetX: 52, width: 70 }, LIGHT_KICK: { offsetX: 46, width: 54 }, HEAVY_KICK: { offsetX: 60, width: 76 }, SPECIAL_1: { offsetX: 82, width: 120 }, SPECIAL_2: { offsetX: 46, width: 38 }, RISING_KICK: { offsetX: 36, width: 64, height: 96 }, ULTIMATE: { offsetX: 250, width: 780, height: 250, offsetY: -120 } }
  },
  SHADOW: {
    archetype: 'assassin', color: '#a855f7', trail: 'shadow',
    movement: { idle: 1.1, walk: 1.1, dash: 1.2 },
    ranges: { ...BASE, LIGHT_PUNCH: { offsetX: 42, width: 50 }, HEAVY_PUNCH: { offsetX: 62, width: 92 }, LIGHT_KICK: { offsetX: 50, width: 62 }, HEAVY_KICK: { offsetX: 68, width: 92 }, SPECIAL_1: { offsetX: 78, width: 120 }, SPECIAL_2: { offsetX: 44, width: 42 }, RISING_KICK: { offsetX: 38, width: 70, height: 100 }, ULTIMATE: { offsetX: 260, width: 820, height: 260, offsetY: -120 } }
  },
  TERRA: {
    archetype: 'tank', color: '#22c55e', trail: 'earth',
    movement: { idle: 1.0, walk: 1.0, dash: 1.0 },
    ranges: { ...BASE, LIGHT_PUNCH: { offsetX: 44, width: 54 }, HEAVY_PUNCH: { offsetX: 58, width: 86 }, LIGHT_KICK: { offsetX: 50, width: 66 }, HEAVY_KICK: { offsetX: 66, width: 100 }, SPECIAL_1: { offsetX: 76, width: 115 }, SPECIAL_2: { offsetX: 110, width: 210, height: 48 }, SPECIAL_3: { offsetX: 95, width: 180, height: 80 }, RISING_KICK: { offsetX: 38, width: 68, height: 96 }, ULTIMATE: { offsetX: 250, width: 760, height: 270, offsetY: -125 } }
  }
};

export function getCombatStyle(charId) {
  return COMBAT_STYLES[charId] || COMBAT_STYLES.AARAV;
}

export function getAttackRange(charId, attackType, original) {
  const profile = getCombatStyle(charId);
  const key = attackType;
  const range = profile.ranges[key];
  if (!range || !original?.hitbox) return original;
  return {
    ...original,
    hitbox: {
      ...original.hitbox,
      offsetX: range.offsetX ?? original.hitbox.offsetX,
      width: range.width ?? original.hitbox.width,
      height: range.height ?? original.hitbox.height,
      offsetY: range.offsetY ?? original.hitbox.offsetY
    }
  };
}

export function getAttackMotion(fighter) {
  const f = fighter;
  const atk = f.currentAttackData?.type;
  const phase = f.attackPhase;
  const frame = f.attackFrame || 0;
  const style = getCombatStyle(f.charId);
  let x = 0, y = 0, sx = 1, sy = 1, rot = 0;
  const t = Math.min(1, frame / Math.max(1, f.currentAttackData?.startup || 1));

  if (!atk) return { x, y, sx, sy, rot, intensity: 0 };

  if (phase === 'STARTUP') {
    sx = atk.includes('HEAVY') || atk === 'RISING_KICK' ? 0.91 : 0.96;
    sy = atk.includes('HEAVY') || atk === 'RISING_KICK' ? 1.07 : 1.03;
    x = -4 - t * (style.archetype === 'heavy' ? 7 : 3);
    rot = atk.includes('KICK') ? -0.05 : -0.025;
  } else if (phase === 'ACTIVE') {
    const heavy = atk.includes('HEAVY') || atk === 'RISING_KICK' || atk.includes('SPECIAL');
    const speed = style.archetype === 'rushdown' ? 1.3 : style.archetype === 'heavy' ? 0.82 : 1;
    x = (heavy ? 10 : 6) * speed;
    sx = heavy ? 1.10 : 1.06;
    sy = heavy ? 0.93 : 0.97;
    rot = atk.includes('KICK') ? 0.08 : 0.045;
    if (style.archetype === 'assassin') x += 6;
    if (style.archetype === 'tank') { x -= 2; sy = 0.90; }
  } else if (phase === 'RECOVERY') {
    const recovery = Math.min(1, frame / Math.max(1, f.currentAttackData?.recovery || 1));
    x = 8 * (1 - recovery);
    sx = 1.04 - recovery * 0.04;
    sy = 0.96 + recovery * 0.04;
    rot = 0.04 * (1 - recovery);
  }

  return { x, y, sx, sy, rot, intensity: phase === 'ACTIVE' ? 1 : phase === 'STARTUP' ? 0.45 : 0.25 };
}
