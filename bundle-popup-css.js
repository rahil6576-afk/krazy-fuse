const fs = require('fs');
const path = require('path');

const cssFiles = [
  'popup/src/styles/global.css',
  'popup/src/components/Background/Stars.css',
  'popup/src/components/Balloons/Balloons.css',
  'popup/src/components/Cannon/Cannon.css',
  'popup/src/components/Effects/Effects.css',
  'popup/src/components/UI/ScoreHUD.css',
  'popup/src/components/UI/Modals.css'
];

let fullCss = '';
for (const f of cssFiles) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/\.\.\/\.\.\/assets\//g, './');
    content = content.replace(/\.\/assets\//g, './');
    fullCss += '\n/* === ' + path.basename(f) + ' === */\n' + content + '\n';
  }
}

fullCss += `
/* === Theme Selector & Card Styling === */
.theme-card-option {
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  color: #ffffff;
}

.theme-card-option:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.4);
}

.theme-card-option.theme-selected {
  border-width: 2.5px;
}

.theme-card-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
  flex-shrink: 0;
}

.theme-card-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.theme-card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.theme-card-name {
  font-size: 0.96rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theme-active-pill {
  flex-shrink: 0;
  background: #38b000;
  color: #ffffff;
  font-size: 0.58rem;
  font-weight: 900;
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  box-shadow: 0 0 10px rgba(56, 176, 0, 0.9);
  line-height: 1.2;
}

.theme-card-desc {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 600;
  line-height: 1.25;
}

.scoreboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.scoreboard-header .header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scoreboard-header .close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 1.1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
`;

fs.writeFileSync('popup-game/popup-style.css', fullCss, 'utf8');
console.log('Successfully generated popup-game/popup-style.css, size:', fullCss.length);
