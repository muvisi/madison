"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import InputField from "../src/components/InputField";
import Button from "../src/components/Button";
import Logo from "../src/components/Logo";
import { login } from "../src/services/auth";

type Triangle = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
};

export default function LoginPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const triangles: Triangle[] = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 30,
      vx: (Math.random() - 0.5) * 2, // random speed
      vy: (Math.random() - 0.5) * 2,
      color: `rgba(${Math.floor(150 + Math.random() * 100)}, ${Math.floor(100 + Math.random() * 150)}, ${Math.floor(150 + Math.random() * 100)}, 0.3)`,
    }));

    const drawTriangle = (t: Triangle) => {
      ctx.beginPath();
      ctx.moveTo(t.x, t.y - t.size / 2);
      ctx.lineTo(t.x - t.size / 2, t.y + t.size / 2);
      ctx.lineTo(t.x + t.size / 2, t.y + t.size / 2);
      ctx.closePath();
      ctx.fillStyle = t.color;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < triangles.length; i++) {
        const t = triangles[i];
        t.x += t.vx;
        t.y += t.vy;

        // bounce off edges
        if (t.x < 0 || t.x > width) t.vx *= -1;
        if (t.y < 0 || t.y > height) t.vy *= -1;

        // simple collision detection and bounce
        for (let j = i + 1; j < triangles.length; j++) {
          const t2 = triangles[j];
          const dx = t.x - t2.x;
          const dy = t.y - t2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < (t.size + t2.size) / 2) {
            // swap velocities for a simple bounce
            [t.vx, t2.vx] = [t2.vx, t.vx];
            [t.vy, t2.vy] = [t2.vy, t.vy];
          }
        }

        drawTriangle(t);
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden p-4">
      {/* Canvas for 3D-like animated triangles */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      {/* Login card */}
      <div className="relative z-10 bg-white shadow-lg rounded-xl w-full max-w-md p-8 sm:p-12">
        <Logo />
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          <Button type="submit" text="Login" />
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          &copy; 2026 Madison. All rights reserved.
        </p>
      </div>
    </div>
  );
}