import React from 'react'
import Particles  from '../Reactbits/Particle'

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
  </div>
  )
}

export default Homepage