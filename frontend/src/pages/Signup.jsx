import { useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Shield } from "lucide-react"
import { Link } from "react-router-dom"

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    setIsLoading(false)
  }

  return (
    <div className="h-[90dvh] overflow-hidden">
      {/* Matrix Rain Effect */}
      <div className="matrix-rain">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="matrix-char"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>

      <div className="h-screen bg-black neural-grid flex items-center justify-center p-4 relative overflow-hidden">
        {/* Circuit Lines Background */}
        <div className="circuit-lines"></div>
        
        {/* Data Streams */}
        <div className="data-stream data-stream-1"></div>
        <div className="data-stream data-stream-2"></div>
        <div className="data-stream data-stream-3"></div>
        
        {/* Floating Hexagons */}
        <div className="floating-hex hex-1"></div>
        <div className="floating-hex hex-2"></div>
        <div className="floating-hex hex-3"></div>

       {/* Simple Signup Form */}
       <div className="w-full max-w-lg bg-black/80 backdrop-blur-sm border border-gray-700 rounded-xl p-8 relative z-20">
         <div className="text-center mb-6">
           <h2 className="text-3xl font-bold text-white mb-2">Sign Up</h2>
           <p className="text-base text-gray-400">Create your account</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
           {/* Name Field */}
           <div>
             <label className="block text-white font-mono text-lg mb-3">
               Full Name
             </label>
             <input
               name="name"
               type="text"
               placeholder="Enter your full name"
               value={formData.name}
               onChange={handleInputChange}
               className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-lg text-white text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors h-12"
               required
             />
           </div>

           {/* Email Field */}
           <div >
             <label className="block text-white font-mono text-lg mb-3">
               Email Address
             </label>
             <input
               name="email"
               type="email"
               placeholder="Enter your email"
               value={formData.email}
               onChange={handleInputChange}
               className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-lg text-white text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors h-12"
               required
             />
           </div>

           {/* Password Field */}
           <div>
             <label className="block text-white font-mono text-lg mb-3">
               Password
             </label>
             <div className="relative">
               <input
                 name="password"
                 type={showPassword ? "text" : "password"}
                 placeholder="Enter your password"
                 value={formData.password}
                 onChange={handleInputChange}
                 className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-lg text-white text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors pr-14 h-12"
                 required
               />
               <button
                 type="button"
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                 onClick={() => setShowPassword(!showPassword)}
               >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
             </div>
           </div>

           {/* Confirm Password Field */}
           <div>
             <label className="block text-white font-mono text-lg mb-3">
               Confirm Password
             </label>
             <div className="relative">
               <input
                 name="confirmPassword"
                 type={showConfirmPassword ? "text" : "password"}
                 placeholder="Confirm your password"
                 value={formData.confirmPassword}
                 onChange={handleInputChange}
                 className="w-full px-5 py-4 bg-gray-900 border border-gray-600 rounded-lg text-white text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors pr-14 h-12"
                 required
               />
               <button
                 type="button"
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
               >
                 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
             </div>
           </div>

           {/* Submit Button */}
           <button
             type="submit"
             disabled={isLoading}
             className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg text-base transition-colors duration-200 disabled:cursor-not-allowed mt-6 h-12"
           >
             {isLoading ? (
               <div className="flex items-center justify-center gap-3">
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-base">Creating Account...</span>
               </div>
             ) : (
               "Create Account"
             )}
           </button>
         </form>

         {/* Footer */}
         <div className="text-center mt-6 pt-4 border-t border-gray-700">
           <p className="text-gray-400 text-lg ">
             Already have an account?{" "}
             <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold text-lg">
               Sign In
             </Link>
           </p>
         </div>
       </div>
      </div>
    </div>
  )
}