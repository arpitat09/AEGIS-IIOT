import { useEffect, useRef } from "react";

export default function AnimatedCyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let packets = [];
    let radarAngle = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 32 : 65;
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 2 + 1,
          baseAlpha: Math.random() * 0.5 + 0.3,
          isThreat: Math.random() > 0.9,
        });
      }

      // Initialize moving data packets
      packets = [];
      const packetCount = isMobile ? 6 : 14;
      for (let i = 0; i < packetCount; i++) {
        packets.push({
          p1Index: Math.floor(Math.random() * particles.length),
          p2Index: Math.floor(Math.random() * particles.length),
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.006,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxDist = window.innerWidth < 768 ? 100 : 150;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Subtle Radar Sweep in Center
      const centerX = width * 0.5;
      const centerY = height * 0.45;
      const radarRadius = Math.min(width, height) * 0.4;

      radarAngle += 0.008;
      const endX = centerX + Math.cos(radarAngle) * radarRadius;
      const endY = centerY + Math.sin(radarAngle) * radarRadius;

      ctx.save();
      const sweepGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radarRadius);
      sweepGrad.addColorStop(0, "rgba(0, 229, 168, 0.03)");
      sweepGrad.addColorStop(1, "rgba(0, 229, 168, 0.0)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

      // Radar scan line
      ctx.strokeStyle = "rgba(0, 229, 168, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();

      // 2. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isThreat
          ? `rgba(255, 107, 53, ${p.baseAlpha})`
          : `rgba(0, 229, 168, ${p.baseAlpha})`;
        ctx.fill();
      }

      // 3. Connect Nearby Particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.strokeStyle = particles[i].isThreat || particles[j].isThreat
              ? `rgba(255, 107, 53, ${alpha})`
              : `rgba(0, 229, 168, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Moving Data Packets Along Connections
      for (let k = 0; k < packets.length; k++) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          pkt.p1Index = Math.floor(Math.random() * particles.length);
          pkt.p2Index = Math.floor(Math.random() * particles.length);
        }

        const p1 = particles[pkt.p1Index];
        const p2 = particles[pkt.p2Index];
        if (p1 && p2) {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist * 1.5) {
            const curX = p1.x + dx * pkt.progress;
            const curY = p1.y + dy * pkt.progress;

            ctx.beginPath();
            ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(138, 255, 128, 0.85)";
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#00E5A8";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.8,
      }}
    />
  );
}
