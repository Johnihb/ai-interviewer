import { useEffect, useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Shield, BadgeCheck, CircleX, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useUserStore } from "../stores/userStore"
import axios from "../lib/axios"

export default function CyberpunkSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [usernameExists, setUsernameExists] = useState(null)
  const signup = useUserStore(state => state.signup)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Call the signup function from userStore
    await signup(formData)

    console.log("Form submitted:", formData)
    setIsLoading(false)
  }



  useEffect(() => {
    if (formData.name?.length < 3) {
      setUsernameExists(null)
      return
    }
    const timer = setTimeout(() => {
      axios.post('/auth/check-username', { name: formData.name }, { timeout: 2000 })
        .then((response) => {
          if (response.status === 200) {
            console.log('Username is available', response.data);
            setUsernameExists(response.data.user.exist);
          }
        }).catch((error) => {
          console.warn(error);
        })

    }, 1500);
    return () => {
      clearTimeout(timer);
    };

  }, [formData.name])



  return (
    <div className="min-h-[90dvh] flex items-center justify-center p-4 mt-16 relative overflow-hidden">

      {/* Subtle animated background grain */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.02)_0%,_transparent_50%)]" />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700"
      >
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-500 to-transparent mb-8" />

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2 animate-in fade-in zoom-in-50 duration-500 delay-200">
            <User className="w-5 h-5 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
            Create Account
          </h1>
          <p className="text-neutral-500 text-sm font-light animate-in fade-in duration-500 delay-500">
            Sign up to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <label htmlFor="name" className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200">
              <User className="w-3.5 h-3.5" />
              Username
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="john doe"
              value={formData.name}
              maxLength={20}
              minLength={3}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300"
            />
            {
              formData.name?.length > 2 && formData.name.length <= 20 && (
                usernameExists === true ? (
                  <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300"><CircleX size={14} /> Username already exists</p>
                ) : usernameExists  ? (
                  <p className="text-neutral-400/80 text-xs mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">Checking availability...</p>
                ) : (
                   <p className="text-emerald-400/80 text-xs mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300"><BadgeCheck size={14} /> Username is available</p>
                )
              )
            }

          </div>

          {/* Email Field */}
          <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
            <label htmlFor="email" className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300"
            />
          </div>

          {/* Password Field */}
          <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <label htmlFor="password" className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200">
              <Lock className="w-3.5 h-3.5" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength="6"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
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

          {/* Confirm Password Field */}
          <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]">
            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200">
              <Shield className="w-3.5 h-3.5" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                pattern={formData.password ? `^${formData.password.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$` : ""}
                title="Passwords must match"
                className="w-full px-4 py-3 pr-12 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300"
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
            <button
              type="submit"
              disabled={isLoading}
              className="group/btn w-full relative bg-white text-black text-sm font-medium py-3.5 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Footer */}
        <div className="text-center animate-in fade-in duration-500 delay-[800ms]">
          <p className="text-neutral-500 text-sm font-light">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:text-neutral-300 transition-colors duration-200 font-normal relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-white/50 after:transition-all after:duration-300 hover:after:w-full">
              Sign In
            </Link>
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-8" />
      </div>
    </div>
  )
}