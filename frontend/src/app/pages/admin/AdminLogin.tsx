import { useState, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuth";

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // If already authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A140A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #1E3A1E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2D5016 0%, transparent 40%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center">
            <span className="font-display text-[18px] tracking-[0.25em] font-bold text-white">FELIZARDO'S</span>
            <span className="text-[9px] tracking-[0.45em] text-white/35 mt-0.5">EVENT PLACE</span>
          </div>
          <div className="mt-5">
            <p className="text-white/40 text-[13px] tracking-wide">Admin Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-white/45 text-[13px] mb-8">Access the admin dashboard</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-[13px]">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] tracking-[0.2em] text-white/40 uppercase mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full bg-white/8 border border-white/12 rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#A8C88A]/60 focus:ring-1 focus:ring-[#A8C88A]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] tracking-[0.2em] text-white/40 uppercase mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white/8 border border-white/12 rounded-xl pl-10 pr-11 py-3 text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#A8C88A]/60 focus:ring-1 focus:ring-[#A8C88A]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D5016] hover:bg-[#3A6B1E] text-white py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        {/* Demo credentials hint */}
        {/* <div className="mt-5 bg-white/4 border border-white/8 rounded-xl px-5 py-4">
          <p className="text-white/30 text-[11px] tracking-wide uppercase mb-2">Demo Credentials</p>
          <p className="text-white/50 text-[12px] font-mono">admin@felizardos.com</p>
          <p className="text-white/50 text-[12px] font-mono">felizardos2025</p>
        </div> */}

        <p className="text-center text-white/20 text-[11px] mt-6">
          This portal is for authorized staff only.
        </p>
      </motion.div>
    </div>
  );
}
