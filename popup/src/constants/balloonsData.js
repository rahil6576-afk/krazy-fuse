export const colorMap = {
  red: '#e63946',
  cyan: '#00b4d8',
  purple: '#9d4edd',
  gold: '#ffb703',
  green: '#38b000',
  pink: '#ff66c4',
  yellow: '#d4e157',
  blue: '#48cae4',
};

export const initialBalloons = [
  { id: 1, left: "3%", floatDuration: "11s", floatDelay: "-2s", opacity: 0.95, blur: "0px", z: 3, scale: 1.1, color: "red", swayDuration: "3.5s", swayDelay: "0s" },
  { id: 2, left: "9%", floatDuration: "14s", floatDelay: "-8s", opacity: 0.85, blur: "0px", z: 2, scale: 0.9, color: "cyan", swayDuration: "4.2s", swayDelay: "-1s" },
  { id: 3, left: "15%", floatDuration: "17s", floatDelay: "-5s", opacity: 0.65, blur: "1.5px", z: 1, scale: 0.7, color: "purple", swayDuration: "5.2s", swayDelay: "-2s" },
  { id: 4, left: "21%", floatDuration: "11.5s", floatDelay: "-9.5s", opacity: 0.92, blur: "0px", z: 2, scale: 1.0, color: "gold", swayDuration: "3.9s", swayDelay: "-2.1s" },
  { id: 5, left: "27%", floatDuration: "9.5s", floatDelay: "-4s", opacity: 1, blur: "0px", z: 4, scale: 1.25, color: "pink", swayDuration: "3.2s", swayDelay: "-0.7s" },
  { id: 6, left: "33%", floatDuration: "13.5s", floatDelay: "-1.5s", opacity: 0.85, blur: "0px", z: 2, scale: 0.85, color: "green", swayDuration: "4.8s", swayDelay: "-1.8s" },
  { id: 7, left: "39%", floatDuration: "18s", floatDelay: "-12s", opacity: 0.6, blur: "2px", z: 1, scale: 0.65, color: "blue", swayDuration: "5.5s", swayDelay: "-2.5s" },
  { id: 8, left: "45%", floatDuration: "12.5s", floatDelay: "-6s", opacity: 0.88, blur: "0px", z: 2, scale: 0.9, color: "red", swayDuration: "4.1s", swayDelay: "-1.2s" },
  { id: 9, left: "51%", floatDuration: "10s", floatDelay: "-7.5s", opacity: 0.95, blur: "0px", z: 3, scale: 1.05, color: "yellow", swayDuration: "3.8s", swayDelay: "-0.5s" },
  { id: 10, left: "57%", floatDuration: "15s", floatDelay: "-3s", opacity: 0.82, blur: "0px", z: 2, scale: 0.85, color: "purple", swayDuration: "4.6s", swayDelay: "-1.7s" },
  { id: 11, left: "63%", floatDuration: "12s", floatDelay: "-1s", opacity: 0.95, blur: "0px", z: 3, scale: 1.1, color: "gold", swayDuration: "4s", swayDelay: "-1.5s" },
  { id: 12, left: "69%", floatDuration: "16.5s", floatDelay: "-13s", opacity: 0.6, blur: "2px", z: 1, scale: 0.6, color: "cyan", swayDuration: "6s", swayDelay: "-4s" },
  { id: 13, left: "75%", floatDuration: "14.5s", floatDelay: "-8.8s", opacity: 0.9, blur: "0px", z: 2, scale: 0.95, color: "green", swayDuration: "4.5s", swayDelay: "-3s" },
  { id: 14, left: "81%", floatDuration: "10.8s", floatDelay: "-4.5s", opacity: 0.98, blur: "0px", z: 4, scale: 1.2, color: "pink", swayDuration: "3.4s", swayDelay: "-0.9s" },
  { id: 15, left: "87%", floatDuration: "13s", floatDelay: "-2.8s", opacity: 0.85, blur: "0px", z: 2, scale: 0.8, color: "yellow", swayDuration: "3.2s", swayDelay: "-0.8s" },
  { id: 16, left: "93%", floatDuration: "10.5s", floatDelay: "-6.5s", opacity: 0.95, blur: "0px", z: 3, scale: 1.15, color: "purple", swayDuration: "3.6s", swayDelay: "-0.3s" },
  { id: 17, left: "1%", floatDuration: "16s", floatDelay: "-10s", opacity: 0.65, blur: "1.5px", z: 1, scale: 0.65, color: "red", swayDuration: "5s", swayDelay: "-1.5s" },
  { id: 18, left: "48%", floatDuration: "11.2s", floatDelay: "-2.2s", opacity: 0.92, blur: "0px", z: 3, scale: 1.05, color: "cyan", swayDuration: "3.7s", swayDelay: "-1.1s" },
  { id: 19, left: "72%", floatDuration: "12.8s", floatDelay: "-5.5s", opacity: 0.88, blur: "0px", z: 2, scale: 0.9, color: "blue", swayDuration: "4.3s", swayDelay: "-2.2s" },
  { id: 20, left: "97%", floatDuration: "15.5s", floatDelay: "-11.5s", opacity: 0.7, blur: "1px", z: 1, scale: 0.75, color: "gold", swayDuration: "4.9s", swayDelay: "-3.5s" }
];

export function generateBalloonsForLevel(levelConfig) {
  const { 
    balloonCount = 14, 
    speedMultiplier = 1.0, 
    colors = ['red', 'cyan', 'gold'],
    movementStyle = 'linear',
    balloonScaleMod = 1.0 
  } = levelConfig;

  const balloons = [];
  const spacing = 94 / balloonCount;

  for (let i = 0; i < balloonCount; i++) {
    const leftPct = Math.max(3, Math.min(93, Math.round(i * spacing + 3 + (Math.random() * 3 - 1.5))));
    const baseDuration = 8.5 + (i % 5) * 1.6 + Math.random() * 1.2;
    const adjustedDuration = Math.max(2.8, baseDuration / speedMultiplier);
    const delay = -(Math.random() * adjustedDuration).toFixed(1);
    const color = colors[i % colors.length];
    const baseScale = (0.8 + (i % 4) * 0.1) * balloonScaleMod;
    const opacity = 0.88 + Math.random() * 0.12;
    const swayDur = Math.max(1.8, (3.2 + (i % 4) * 0.6) / Math.sqrt(speedMultiplier));

    balloons.push({
      id: i + 1,
      left: `${leftPct}%`,
      floatDuration: `${adjustedDuration.toFixed(1)}s`,
      floatDelay: `${delay}s`,
      opacity: Number(opacity.toFixed(2)),
      blur: "0px",
      z: (i % 4) + 1,
      scale: Number(baseScale.toFixed(2)),
      color,
      movementStyle,
      swayDuration: `${swayDur.toFixed(1)}s`,
      swayDelay: `-${(Math.random() * swayDur).toFixed(1)}s`,
      key: 0,
      isPopping: false,
    });
  }

  return balloons;
}


