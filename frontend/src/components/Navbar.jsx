import React, { useState } from 'react';
import { Home, LogIn, LogOut, UserPlus, FileText, LayoutDashboard, Menu, X } from 'lucide-react';
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
      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">

        {/* Main Navigation Container */}
        <div className="flex justify-between items-center px-5 py-3.5 max-w-7xl mx-auto">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white/80 font-semibold text-xs tracking-tight transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/20">
              BM
            </div>
            <span className="text-lg font-light tracking-tight text-white">
              Believe <span className="font-medium">Me</span>
            </span>
          </Link>

          {/* Desktop Navigation - Not Logged In */}
          {!user && (
            <div className="hidden md:flex items-center gap-1.5">
              <NavLink
                to="/"
                icon={<Home className="w-4 h-4" />}
                text="Home"
              />
              <NavLink
                to="/login"
                icon={<LogIn className="w-4 h-4" />}
                text="Login"
              />
              <NavLink
                to="/signup"
                icon={<UserPlus className="w-4 h-4" />}
                text="Sign Up"
              />
            </div>
          )}

          {/* Desktop Navigation - Logged In */}
          {user && (
            <div className="hidden md:flex items-center gap-1.5">
              <NavLink
                to="/"
                icon={<Home className="w-4 h-4" />}
                text="Home"
              />
              <NavLink
                to="/skillsForm"
                icon={<FileText className="w-4 h-4" />}
                text="Test"
              />
              <NavLink
                to="/dashboard"
                icon={<LayoutDashboard className="w-4 h-4" />}
                text="Dashboard"
              />

              {/* User Profile */}
              <div className="flex items-center gap-2.5 px-3 py-2 ml-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                <div className="w-6 h-6 bg-white/15 rounded-full flex items-center justify-center text-white/80 font-medium text-[10px] uppercase">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm text-white/70 font-light">
                  {user.name || 'User'}
                </span>
              </div>

              <NavButton
                icon={<LogOut className="w-4 h-4" />}
                text="Logout"
                onClick={logout}
                isLogout={true}
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-9 h-9 bg-white/[0.04] border border-white/[0.08] rounded-xl text-neutral-400 transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-4.5 h-4.5" />
            ) : (
              <Menu className="w-4.5 h-4.5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? 'max-h-screen opacity-100 visible'
            : 'max-h-0 opacity-0 invisible overflow-hidden'
          }`}>
          <div className="bg-black/95 backdrop-blur-xl border-t border-white/[0.06] p-4">

            {/* Mobile Menu - Not Logged In */}
            {!user && (
              <div className="flex flex-col gap-1.5">
                <MobileNavLink
                  to="/"
                  icon={<Home className="w-4 h-4" />}
                  text="Home"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink
                  to="/login"
                  icon={<LogIn className="w-4 h-4" />}
                  text="Login"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink
                  to="/signup"
                  icon={<UserPlus className="w-4 h-4" />}
                  text="Sign Up"
                  onClick={closeMobileMenu}
                />
              </div>
            )}

            {/* Mobile Menu - Logged In */}
            {user && (
              <div className="flex flex-col gap-1.5">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-1.5">
                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/80 font-medium text-sm uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {user.name || 'User'}
                    </div>
                    <div className="text-neutral-500 text-xs truncate">
                      {user.email || 'user@example.com'}
                    </div>
                  </div>
                </div>

                <MobileNavLink
                  to="/"
                  icon={<Home className="w-4 h-4" />}
                  text="Home"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink
                  to="/skillsForm"
                  icon={<FileText className="w-4 h-4" />}
                  text="Test"
                  onClick={closeMobileMenu}
                />
                <MobileNavLink
                  to="/dashboard"
                  icon={<LayoutDashboard className="w-4 h-4" />}
                  text="Dashboard"
                  onClick={closeMobileMenu}
                />
                <MobileNavButton
                  icon={<LogOut className="w-4 h-4" />}
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
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-light transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/[0.06] active:scale-95"
    >
      {icon}
      <span className="hidden lg:block">{text}</span>
    </Link>
  );
}

// Desktop Navigation Button Component (for logout)
function NavButton({ icon, text, onClick, isLogout = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        cursor-pointer
        flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-light transition-all duration-300
        ${isLogout
          ? 'text-neutral-500 hover:text-red-400 hover:bg-red-500/[0.06]'
          : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
        }
        active:scale-95
      `}
    >
      {icon}
      <span className="hidden lg:block">{text}</span>
    </button>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, icon, text, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between w-full p-3.5 rounded-xl text-sm font-light transition-all duration-200 text-neutral-400 hover:text-white hover:bg-white/[0.04] active:scale-[0.98]"
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
        flex items-center justify-between w-full p-3.5 rounded-xl text-sm font-light transition-all duration-200
        ${isLogout
          ? 'text-neutral-500 hover:text-red-400 hover:bg-red-500/[0.04]'
          : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
        }
        active:scale-[0.98]
      `}
    >
      <span>{text}</span>
      {icon}
    </button>
  );
}