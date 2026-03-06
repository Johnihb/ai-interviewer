import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useUserStore } from '../stores/userStore'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login, loading } = useUserStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      {/* Subtle ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.02)_0%,_transparent_50%)]" />
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700">

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-500 to-transparent mb-8" />

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2 animate-in fade-in zoom-in-50 duration-500 delay-200">
            <Lock className="w-5 h-5 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
            Welcome Back
          </h1>
          <p className="text-neutral-500 text-sm font-light animate-in fade-in duration-500 delay-500">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <label htmlFor="email" className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300"
            />
          </div>

          {/* Password Field */}
          <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="password" className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest transition-colors group-focus-within:text-neutral-200">
                <Lock className="w-3.5 h-3.5" />
                Password
              </label>
              <button
                type="button"
                className="text-neutral-500 text-xs hover:text-neutral-300 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300"
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <button
              type="submit"
              disabled={loading}
              className="group/btn w-full relative bg-white text-black text-sm font-medium py-3.5 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Sign Up Link */}
        <div className="text-center animate-in fade-in duration-500 delay-[600ms]">
          <p className="text-neutral-500 text-sm font-light">
            Don't have an account?{' '}
            <Link to="/signup"
              className="text-white hover:text-neutral-300 transition-colors duration-200 font-normal relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-white/50 after:transition-all after:duration-300 hover:after:w-full"
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-8" />
      </div>
    </div>
  )
}