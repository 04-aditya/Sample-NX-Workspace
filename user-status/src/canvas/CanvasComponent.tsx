import React, { useRef } from 'react';
import useScrollPosition from './useScrollPosition';
import useCursorPosition from './useCursorPosition';
import drawCanvas from './drawCanvas';

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollPosition = useScrollPosition();
  const cursorPosition = useCursorPosition();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawCanvas(canvas, scrollPosition, cursorPosition);
    }
  }, [scrollPosition, cursorPosition]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: -1,
        cursor: 'none',
      }}
    />
  );
};

export default CanvasComponent;
