import { IoHome } from "react-icons/io5";
import { CiLogin , CiLogout } from "react-icons/ci";
import { SiGnuprivacyguard } from "react-icons/si";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

export default function Navbar() {


  const {user , logout} = useUserStore();

  
  return (
  <header>  
  <nav>
   { !user ? <div className=' flex w-full h-[10dvh] justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-white/2 backdrop-blur-md'>
      <Link to='/' className="cursor-target">
        <span className="text-lg sm:text-base md:text-xl lg:text-2xl font-bold">Believe Me</span>
      </Link>
      
      
      <div className="flex  gap-4 sm:gap-6 lg:gap-8 items-center">
        <Link to='/' className="cursor-target flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
          <span className="text-sm hidden md:block md:text-xl lg:text-2xl font-medium">Home</span>
          <IoHome className="w-5 h-5 sm:w-6 sm:h-6" color='white' />
        </Link>  
        
        <Link to='/login' className="cursor-target flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
          <span className="text-sm hidden md:block md:text-xl lg:text-2xl font-medium">Login</span>
          <CiLogin className="w-5 h-5 sm:w-6 sm:h-6" color='white'/>
        </Link>  
        
        <Link to='/signup' className="cursor-target flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
          <span className="text-sm hidden md:block md:text-xl lg:text-2xl font-medium">Sign Up</span>
          <SiGnuprivacyguard className="w-5 h-5 sm:w-6 sm:h-6" color='white' />
        </Link>  
      </div>
    </div>
: ''}
    {
      user ? 
      <div className="flex justify-between items-center gap-4 sm:gap-6 lg:gap-8">
        <Link to='/' className="cursor-target">
        <span className="text-lg sm:text-base md:text-xl lg:text-2xl font-bold">Believe Me</span>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">

        <Link to='/getQuestion' className="cursor-target flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
        <span className="text-sm hidden md:block md:text-xl lg:text-2xl font-medium">Test</span>
        </Link> 
        <Link to='/dashboard' className="cursor-target flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
        <span className="text-sm hidden md:block md:text-xl lg:text-2xl font-medium">Dashboard</span>
        </Link> 
      <button onClick={logout} className="cursor-target flex items-center gap-1.5 sm:gap-2 hover:text-gray-300 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
      <span className="text-sm hidden md:block md:text-xl lg:text-2xl font-medium">Logout</span>
      <CiLogout className="w-5 h-5 sm:w-6 sm:h-6" color='white'/>
    </button>
    </div>
    </div>
    
    :''
    }

    </nav>
    </header>)
}