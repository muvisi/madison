"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiShield,
  FiUser,
} from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState("ldap");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/account/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, loginMethod }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "The username or password is incorrect.");
        return;
      }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("uuid", data.uuid);
      localStorage.setItem("department", data.department || "");
      router.push("/dashboard");
    } catch {
      setError("We could not connect to the service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f6f9] lg:grid lg:grid-cols-[minmax(420px,0.92fr)_1.08fr]">
      <section className="relative hidden overflow-hidden bg-[#092f57] px-14 py-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[70px] border-white/[0.04]" />
        <div className="absolute -bottom-44 -left-32 h-[32rem] w-[32rem] rounded-full border-[90px] border-[#36b79a]/10" />

        <img
          src="/madison-group-logo.png"
          alt="Madison Group"
          className="relative h-auto w-56"
        />

        <div className="relative my-auto max-w-xl">
          <span className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            Healthcare Operations
          </span>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.035em]">
            One secure workspace for connected healthcare operations.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100/80">
            Manage member data, integrations, financial workflows, and
            operational reporting with confidence.
          </p>

          <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
            {[
              "Role-based access",
              "Operational reporting",
              "Commission workflows",
              "Integration monitoring",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-blue-50">
                <FiCheckCircle className="text-[#49d0af]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-blue-200/60">
          Madison Group · Life without worry
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[460px]">
          <img
            src="/madison-group-logo.png"
            alt="Madison Group"
            className="mb-10 h-auto w-52 lg:hidden"
          />

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2b6b9c]">
              Secure access
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in with your Madison credentials to continue.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <FiShield className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-method" className="mb-2 block text-sm font-medium text-slate-700">
                Account type
              </label>
              <select
                id="login-method"
                value={loginMethod}
                onChange={(event) => setLoginMethod(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#2b6b9c] focus:ring-4 focus:ring-blue-100"
              >
                <option value="ldap">Madison network account</option>
                <option value="local">Local application account</option>
              </select>
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  required
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2b6b9c] focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2b6b9c] focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0c477d] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(12,71,125,0.22)] transition hover:bg-[#093a68] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in securely
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Protected Madison system</span>
              <span>© 2026 Madison Group</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
              <span>
                Built by <strong className="font-semibold text-slate-600">Samuel M.</strong>
              </span>
              {/* <span>
                Endorsed by <strong className="font-semibold text-slate-600">Edward T.</strong>
              </span> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
