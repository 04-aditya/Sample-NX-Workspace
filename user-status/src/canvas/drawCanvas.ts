const drawCanvas = (
  canvas: HTMLCanvasElement,
  scrollPosition: number,
  cursorPosition: { x: number; y: number } | null
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const circleRadius = 40;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(64, 64, 64, 0.5)';
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

  ctx.beginPath();
  ctx.moveTo(50, height / 2);
  ctx.lineTo(width - 50, height / 2);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollRatio = Math.min(scrollPosition / maxScroll, 1);
  const circleX = 50 + scrollRatio * (width - 100);

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

  ctx.font = 'bold 100px Arial';
  ctx.fillStyle = 'black';
  const text = 'Welcome';
  const textX = width / 2 - ctx.measureText(text).width / 2;
  const textY = height / 2 - 40;
  ctx.fillText(text, textX, textY);

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

    const isTextOverlappingCircle =
      cursorPosition.x + circleRadius >= textX - 10 &&
      cursorPosition.x - circleRadius <= textX + ctx.measureText(text).width &&
      cursorPosition.y + circleRadius >= textY - 80 &&
      cursorPosition.y - circleRadius <= textY;

    if (isTextOverlappingCircle) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        cursorPosition.x + 10,
        cursorPosition.y + 10,
        circleRadius,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.fillStyle = 'white';
      ctx.fillText(text, textX, textY);
      ctx.restore();
    }
  }
};

export default drawCanvas;
