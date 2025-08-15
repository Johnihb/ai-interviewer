import React from 'react'
import  Particles  from '../Reactbits/Particle'


const Homepage = () => {

  

  return (
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

    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Welcome to Believe Me</h1>
      <p className="text-lg mt-4">The AI Interviewer</p>
     <button className="bg-transparent h-12 w-40 text-white cursor-target px-6 py-3 font-bold rounded-full border-2 hover:bg-gray-100 transition-colors hover:text-black text-xl" >Get Started</button>  
    </div>
  </div>
  )
}

export default Homepage