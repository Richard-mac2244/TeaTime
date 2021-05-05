export const drawRect = (detections, ctx) => {
  detections.forEach(predictions => {
    // Get preidction results
    const [x, y, width, height] = prediction['bbox'];
    const text = prediction['class'];

    // Style of stroke
    const color = 'green';
    ctx.stokeStyle = color;
    ctx.font = '18px Arial';
    ctx.fillStyle = color;

    // Draw rectangle
    ctx.beginPath();
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height);
    ctx.stoke();
  })
}
