import React, { useState } from 'react';
import { IoHome } from "react-icons/io5";
import { CiLogin, CiLogout } from "react-icons/ci";
import { SiGnuprivacyguard } from "react-icons/si";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

export default function Navbar() {
  const { user, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-black/85 backdrop-blur-lg border-b border-cyan-500/20">
        
        {/* Main Navigation Container */}
        <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-cyan-500/10 hover:scale-105 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center text-black font-bold text-sm shadow-lg">
              BM
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Believe Me
            </span>
          </Link>

          {/* Desktop Navigation - Not Logged In */}
          {!user && (
            <div className="hidden md:flex items-center gap-2">
              <NavLink 
                to="/"
                icon={<IoHome className="w-5 h-5" />}
                text="Home"
              />
              <NavLink 
                to="/login"
                icon={<CiLogin className="w-5 h-5" />}
                text="Login"
              />
              <NavLink 
                to="/signup"
                icon={<SiGnuprivacyguard className="w-4 h-4" />}
                text="Sign Up"
              />
            </div>
          )}

          {/* Desktop Navigation - Logged In */}
          {user && (
            <div className="hidden md:flex items-center gap-2 ">
              <NavLink 
                to="/"
                icon={<IoHome className="w-5 h-5" />}
                text="Home"
              />
              <NavLink 
                to="/getQuestion"
                icon={<HiOutlineDocumentText className="w-5 h-5" />}
                text="Test"
              />
              <NavLink 
                to="/dashboard"
                icon={<MdDashboard className="w-5 h-5 cursor-" />}
                text="Dashboard"
              />
              
              {/* User Profile */}
              <div className="flex items-center gap-2 px-3 py-2 mx-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg cursor-target">
                <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xs">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm text-white font-medium">
                  {user.name || 'User'}
                </span>
              </div>
              
              <NavButton 
                icon={<CiLogout className="w-5 h-5" />}
                text="Logout"
                onClick={logout}
                isLogout={true}
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-white transition-all duration-300 hover:bg-cyan-500/20"
          >
            {isMobileMenuOpen ? (
              <RiCloseLine className="w-6 h-6" />
            ) : (
              <RiMenu3Line className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}>
          <div className="bg-black/95 border-t border-cyan-500/20 p-4">
            
            {/* Mobile Menu - Not Logged In */}
            {!user && (
              <div className="flex flex-col gap-2">
                <MobileNavLink 
                  to="/"
                  icon={<IoHome className="w-5 h-5" />}
                  text="Home"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink 
                  to="/login"
                  icon={<CiLogin className="w-5 h-5" />}
                  text="Login"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink 
                  to="/signup"
                  icon={<SiGnuprivacyguard className="w-4 h-4" />}
                  text="Sign Up"
                  onClick={closeMobileMenu}
                />
              </div>
            )}

            {/* Mobile Menu - Logged In */}
            {user && (
              <div className="flex flex-col gap-2">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg mb-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-base">
                      {user.name || 'User'}
                    </div>
                    <div className="text-cyan-400 text-sm">
                      {user.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
                
                <MobileNavLink 
                  to="/"
                  icon={<IoHome className="w-5 h-5" />}
                  text="Home"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink 
                  to="/getQuestion"
                  icon={<HiOutlineDocumentText className="w-5 h-5" />}
                  text="Test"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink 
                  to="/dashboard"
                  icon={<MdDashboard className="w-5 h-5" />}
                  text="Dashboard"
                  onClick={closeMobileMenu}
                />
                <MobileNavButton 
                  icon={<CiLogout className="w-5 h-5" />}
                  text="Logout"
                  onClick={handleLogout}
                  isLogout={true}
                />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

// Desktop Navigation Link Component
function NavLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-cyan-500/5 border border-cyan-500/20 text-white hover:bg-cyan-500/15 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 active:scale-95 cursor-target cursor-pointer"
    >
      <span className="hidden lg:block">{text}</span>
      {icon}
    </Link>
  );
}

// Desktop Navigation Button Component (for logout)
function NavButton({ icon, text, onClick, isLogout = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        cursor-target
        cursor-pointer
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
        ${isLogout 
          ? 'bg-red-500/5 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20' 
          : 'bg-cyan-500/5 border border-cyan-500/20 text-white hover:bg-cyan-500/15 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/20'
        }
        hover:-translate-y-0.5 active:scale-95
      `}
    >
      <span className="hidden lg:block">{text}</span>
      {icon}
    </button>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, icon, text, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between w-full p-3 rounded-lg text-base font-medium transition-all duration-300 bg-cyan-500/5 border border-cyan-500/20 text-white hover:bg-cyan-500/15 active:scale-95"
    >
      <span>{text}</span>
      {icon}
    </Link>
  );
}

// Mobile Navigation Button Component (for logout)
function MobileNavButton({ icon, text, onClick, isLogout = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between w-full p-3 rounded-lg text-base font-medium transition-all duration-300
        ${isLogout 
          ? 'bg-red-500/5 border border-red-500/30 text-red-400 hover:bg-red-500/10' 
          : 'bg-cyan-500/5 border border-cyan-500/20 text-white hover:bg-cyan-500/15'
        }
        active:scale-95
      `}
    >
      <span>{text}</span>
      {icon}
    </button>
  );
}