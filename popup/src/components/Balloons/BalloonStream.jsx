import React, { memo } from 'react';
import Balloon from './Balloon';
import './Balloons.css';

function BalloonStream({ balloons, targetColor, theme = 'space' }) {
  return (
    <div className="balloon-stream">
      {balloons.map((b) => (
        <Balloon
          key={`${b.id}-${b.key}`}
          data={b}
          isTarget={b.color === targetColor}
          theme={theme}
        />
      ))}
    </div>
  );
}

export default memo(BalloonStream);

