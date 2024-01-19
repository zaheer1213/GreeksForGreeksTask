import React, { useEffect, useRef } from "react";

const BarChartComponent = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    const barWidth = 40;
    const barSpacing = 20;
    const startX = 50;
    const startY = 350;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let xPos = startX;

    for (const label in data) {
      const barHeight = -data[label] * 5; // Adjust the scaling factor as needed

      // Draw the bar
      ctx.fillStyle = "blue";
      ctx.fillRect(xPos, startY, barWidth, barHeight);

      // Draw the label below the bar
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(label, xPos + barWidth / 2, startY + 20);

      // Draw the value on top of the bar
      ctx.fillText(data[label], xPos + barWidth / 2, startY + barHeight - 10);

      // Move to the next position
      xPos += barWidth + barSpacing;
    }
  }, [data]);

  return <canvas ref={canvasRef}></canvas>;
};

export default BarChartComponent;
