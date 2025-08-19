import React, { useState } from 'react';
import { IoHome } from "react-icons/io5";
import { CiLogin, CiLogout } from "react-icons/ci";
import { SiGnuprivacyguard } from "react-icons/si";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import { useUserStore } from "../stores/userStore";


export default function Navbar() {
  
  // Mock user state - replace with your actual useUserStore
  const {user , logout} = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <nav style={{
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
        padding: '0',
        margin: '0'
      }}>
        
        {/* Main Navigation Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative'
        }}>
          
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #00ffff, #ff00ff)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              color: 'black'
            }}>
              BM
            </div>
            <span style={{
              fontSize: window.innerWidth > 768 ? '24px' : '20px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #ffffff, #00ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Believe Me
            </span>
          </button>

          {/* Desktop Navigation - Not Logged In */}
          {!user && (
            <div style={{
              display: window.innerWidth > 768 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '8px'
            }}>
              <NavButton 
                icon={<IoHome size={20} />}
                text="Home"
                onClick={() => navigate('/')} 
              />
              <NavButton 
                icon={<CiLogin size={20} />}
                text="Login"
                onClick={() => navigate('/login')}
              />
              <NavButton 
                icon={<SiGnuprivacyguard size={18} />}
                text="Sign Up"
                onClick={() => navigate('/signup')}
              />
            </div>
          )}

          {/* Desktop Navigation - Logged In */}
          {user && (
            <div style={{
              display: window.innerWidth > 768 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '8px'
            }}>
              <NavButton 
                icon={<IoHome size={20} />}
                text="Home"
                onClick={() => navigate('/')} 
              />
              <NavButton 
                icon={<HiOutlineDocumentText size={20} />}
                text="Test"
                onClick={() => navigate('/getQuestion')}
              />
              <NavButton 
                icon={<MdDashboard size={20} />}
                text="Dashboard"
                onClick={() =>  navigate('/dashboard')}
              />
              
              {/* User Profile */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '8px',
                margin: '0 8px'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #00ff41, #00ffff)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'black'
                }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span style={{ fontSize: '14px', color: '#ffffff' }}>
                  {user.name || 'User'}
                </span>
              </div>
              
              <NavButton 
                icon={<CiLogout size={20} />}
                text="Logout"
                onClick={logout}
                isLogout={true}
              />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            style={{
              display: window.innerWidth <= 768 ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 255, 255, 0.1)';
            }}
          >
            {isMobileMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div style={{
          display: window.innerWidth <= 768 && isMobileMenuOpen ? 'block' : 'none',
          background: 'rgba(0, 0, 0, 0.95)',
          borderTop: '1px solid rgba(0, 255, 255, 0.2)',
          padding: '16px',
          animation: isMobileMenuOpen ? 'slideDown 0.3s ease' : 'slideUp 0.3s ease'
        }}>
          
          {/* Mobile Menu - Not Logged In */}
          {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <MobileNavButton 
                icon={<IoHome size={20} />}
                text="Home"
                onClick={() => navigate('/')} 
              />
              <MobileNavButton 
                icon={<CiLogin size={20} />}
                text="Login"
                onClick={() => navigate('/login')}
              />
              <MobileNavButton 
                icon={<SiGnuprivacyguard size={18} />}
                text="Sign Up"
                onClick={() => navigate('/signup')}
              />
            </div>
          )}

          {/* Mobile Menu - Logged In */}
          {user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #00ff41, #00ffff)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'black'
                }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                    {user.name || 'User'}
                  </div>
                  <div style={{ color: '#00ffff', fontSize: '14px' }}>
                    {user.email || 'user@example.com'}
                  </div>
                </div>
              </div>
              
              <MobileNavButton 
                icon={<IoHome size={20} />}
                text="Home"
                onClick={() => navigate('/')} 
              />
              <MobileNavButton 
                icon={<HiOutlineDocumentText size={20} />}
                text="Test"
                onClick={() => navigate('/getQuestion')}
              />
              <MobileNavButton 
                icon={<MdDashboard size={20} />}
                text="Dashboard"
                onClick={() => navigate('/dashboard')}
              />
              <MobileNavButton 
                icon={<CiLogout size={20} />}
                text="Logout"
                onClick={logout}
                isLogout={true}
              />
            </div>
          )}
        </div>

        {/* Demo Toggle (Remove in production) */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1001
        }}>
          
        </div>
      </nav>

    </header>
  );
}

// Desktop Navigation Button Component
function NavButton({ icon, text, onClick, isLogout = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: 'rgba(0, 255, 255, 0.05)',
        border: `1px solid ${isLogout ? 'rgba(255, 0, 100, 0.3)' : 'rgba(0, 255, 255, 0.2)'}`,
        borderRadius: '8px',
        color: isLogout ? '#ff6b9d' : 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = isLogout ? 'rgba(255, 0, 100, 0.1)' : 'rgba(0, 255, 255, 0.15)';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = isLogout ? '0 4px 12px rgba(255, 0, 100, 0.3)' : '0 4px 12px rgba(0, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(0, 255, 255, 0.05)';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      <span style={{ display: window.innerWidth > 1024 ? 'block' : 'none' }}>
        {text}
      </span>
      {icon}
    </button>
  );
}

// Mobile Navigation Button Component
function MobileNavButton({ icon, text, onClick, isLogout = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(0, 255, 255, 0.05)',
        border: `1px solid ${isLogout ? 'rgba(255, 0, 100, 0.3)' : 'rgba(0, 255, 255, 0.2)'}`,
        borderRadius: '8px',
        color: isLogout ? '#ff6b9d' : 'white',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = isLogout ? 'rgba(255, 0, 100, 0.1)' : 'rgba(0, 255, 255, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(0, 255, 255, 0.05)';
      }}
    >
      <span>{text}</span>
      {icon}
    </button>
  );
}