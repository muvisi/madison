"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import InputField from "../src/components/InputField";
import Button from "../src/components/Button";
import Logo from "../src/components/Logo";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [colorHue, setColorHue] = useState(0);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ---------- Login Handler ----------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/account/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.detail || "Invalid username or password");
        return;
      }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("uuid", data.uuid);

      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  // ---------- Triangle Canvas ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const triangles: Triangle[] = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 30,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: `rgba(${Math.floor(150 + Math.random() * 100)}, ${Math.floor(
        100 + Math.random() * 150
      )}, ${Math.floor(150 + Math.random() * 100)}, 0.3)`,
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

        if (t.x < 0 || t.x > width) t.vx *= -1;
        if (t.y < 0 || t.y > height) t.vy *= -1;

        for (let j = i + 1; j < triangles.length; j++) {
          const t2 = triangles[j];
          const dx = t.x - t2.x;
          const dy = t.y - t2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < (t.size + t2.size) / 2) {
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

  // ---------- Rainbow Text Effect ----------
  useEffect(() => {
    let animationFrame: number;
    const updateHue = () => {
      setColorHue((prev) => (prev + 1) % 360);
      animationFrame = requestAnimationFrame(updateHue);
    };
    animationFrame = requestAnimationFrame(updateHue);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden p-4">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <div className="relative z-10 bg-white shadow-lg rounded-xl w-full max-w-md p-8 sm:p-12">
        <Logo />

        {/* Rainbow text without background */}
        <h2
          className="text-2xl font-extrabold mb-6 text-center"
          style={{
            color: `hsl(${colorHue}, 100%, 50%)`,
            transition: "color 0.1s linear",
          }}
        >
          Healthcare is Fun!
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            text={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          &copy; 2026 Madison. All rights reserved.
        </p>
      </div>
    </div>
  );
}