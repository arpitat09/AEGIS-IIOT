import { useEffect, useRef } from "react";

function AnimatedCyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      createParticles();
    };

    const createParticles = () => {
      const particleCount =
        window.innerWidth < 768 ? 45 : 100;

      particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,

          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,

          radius: Math.random() * 1.8 + 0.7,

          color:
            Math.random() > 0.85
              ? "#E86F2A"
              : Math.random() > 0.55
              ? "#A6B46F"
              : "#F5F1E8",
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce from screen edges
        if (
          particle.x < 0 ||
          particle.x > canvas.width
        ) {
          particle.vx *= -1;
        }

        if (
          particle.y < 0 ||
          particle.y > canvas.height
        ) {
          particle.vy *= -1;
        }

        // Draw particle
        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const dx =
            particles[i].x - particles[j].x;

          const dy =
            particles[i].y - particles[j].y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          const maxDistance = 180;

          if (distance < maxDistance) {
            const opacity =
              (1 - distance / maxDistance) *
              0.38;

            const gradient =
              ctx.createLinearGradient(
                particles[i].x,
                particles[i].y,
                particles[j].x,
                particles[j].y
              );

            gradient.addColorStop(
              0,
              `rgba(166, 180, 111, ${opacity})`
            );

            gradient.addColorStop(
              0.5,
              `rgba(245, 241, 232, ${
                opacity * 0.65
              })`
            );

            gradient.addColorStop(
              1,
              `rgba(232, 111, 42, ${opacity})`
            );

            ctx.beginPath();

            ctx.moveTo(
              particles[i].x,
              particles[i].y
            );

            ctx.lineTo(
              particles[j].x,
              particles[j].y
            );

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      animationFrameId =
        requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    drawParticles();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      cancelAnimationFrame(
        animationFrameId
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.9,
      }}
    />
  );
}

export default AnimatedCyberBackground;