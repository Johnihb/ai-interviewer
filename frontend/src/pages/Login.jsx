import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  


  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="h-[90dvh] overflow-hidden bg-black flex items-center justify-center px-6 flex-col gap-4">
        
        {/* Header */}
        <div className="h-20 mb-6">
          <h1 className="text-white text-2xl font-2xl text-center ">
            Login to your account
          </h1>
          <p className="text-gray-400 text-md text-center">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl p-8 border border-white">
        

        <form onSubmit={handleLogin} className='flex flex-col gap-4'>

        {/* Email Field */}
        <div className="mb-4 ">
          <label className="h-8 block text-white text-lg font-medium mb-3">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 h-10"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-white text-lg font-medium">
              Password
            </label>
            <a 
              href="#" 
              className="text-gray-400 text-sm hover:text-white transition-colors duration-200"
            >
              Forgot your password?
            </a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 h-10"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-2xl py-3 rounded-lg transition-colors duration-200 mb-4 h-10"
        >
          Login
        </button>
        </form>


        {/* Sign Up Link */}
        <Link to='/signup' className="text-center h-12 flex items-center justify-center ">
          <p className="text-gray-400 text-lg ">
            Don't have an account?{' '}
            <a href="#" className="text-white underline hover:no-underline transition-all duration-200">
              Sign up
            </a>
          </p>
        </Link>
      </div>
    </div>
  );
}