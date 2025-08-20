import React, { useRef } from 'react'
import  Particles  from '../Reactbits/Particle'
import ScrollReveal from '../Reactbits/ScrollReveal'
import TargetCursor from '../Reactbits/TargetCursor'
import { Link } from 'react-router-dom'

const Homepage = () => {
  const containerRef = useRef(null);

  return (
    <main>
    <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
      />
    <div style={{ width: '100%', height: '100dvh', position: 'relative' }}>
    <Particles
      particleColors={['#ffffff', '#ffffff']}
      particleCount={300}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={150}
      moveParticlesOnHover={true}
      alphaParticles={true}
      disableRotation={false}

    />
<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white gap-2">
  <h1 className="text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
    Welcome to Believe Me
  </h1>
  <h2 className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-4">
    The AI Interviewer
  </h2>
  <Link to='/signup' className="
  cursor-target
  h-6 w-22 sm:h-9 sm:w-32 
  md:h-12 md:w-44
  bg-transparent
  text-white
  font-bold
  rounded-full
  border-2 border-white
  hover:bg-white hover:text-black
  hover:shadow-lg hover:shadow-white/45
  transition-all duration-500 ease-out
  transform hover:scale-105 active:scale-95
  
  text-sm sm:text-lg md:text-xl      /* font scales up */
  grid place-items-center
">
  Get Started
</Link >


</div>

  </div>

      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] animate-pulse text-white `}> You are not welcomed here ! Thank You 🥱</p>
   

  </main>
  )
}

export default Homepage