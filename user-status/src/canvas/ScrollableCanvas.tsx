import React, { useEffect, useRef, useState } from 'react';

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const circleRadius = 40; // Updated circle radius

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the math grid
    ctx.strokeStyle = 'rgba(64, 64, 64, 0.5)'; // Dark grey with transparency
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(50, height / 2);
    ctx.lineTo(width - 50, height / 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Calculate circle position based on scroll
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollRatio = Math.min(scrollPosition / maxScroll, 1);
    const circleX = 50 + scrollRatio * (width - 100);

    // Draw the circle with gradient
    const gradient = ctx.createLinearGradient(
      circleX - 20,
      height / 2 - 20,
      circleX + 20,
      height / 2 + 20
    );
    gradient.addColorStop(0, 'seagreen');
    gradient.addColorStop(1, 'black');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(circleX, height / 2, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw the title text in black
    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = 'black';
    const text = 'Welcome';
    const textX = width / 2 - ctx.measureText(text).width / 2;
    const textY = height / 2 - 40;
    ctx.fillText(text, textX, textY);

    // Draw a black circle around the cursor
    if (cursorPosition) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.beginPath();
      ctx.arc(
        cursorPosition.x + 10,
        cursorPosition.y + 10,
        circleRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Check if text is overlapping the cursor circle
      const isTextOverlappingCircle =
        cursorPosition.x + circleRadius >= textX - 10 &&
        cursorPosition.x - circleRadius <=
          textX + ctx.measureText(text).width &&
        cursorPosition.y + circleRadius >= textY - 80 &&
        cursorPosition.y - circleRadius <= textY;

      if (isTextOverlappingCircle) {
        // Save the current state
        ctx.save();

        // Create a clipping region for the circle
        ctx.beginPath();
        ctx.arc(
          cursorPosition.x + 10,
          cursorPosition.y + 10,
          circleRadius,
          0,
          Math.PI * 2
        );
        ctx.clip();

        // Draw the green part of the text only where it overlaps with the circle
        ctx.fillStyle = 'white';
        ctx.fillText(text, textX, textY);

        // Restore the previous state
        ctx.restore();
      }
    }
  }, [scrollPosition, cursorPosition]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
