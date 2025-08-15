import React, { useRef } from 'react'
import  Particles  from '../Reactbits/Particle'
import ScrollReveal from '../Reactbits/ScrollReveal'


const Homepage = () => {
  const containerRef = useRef(null);

  return (
    <main>
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
  <button className="
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
  py-2 sm:py-3 md:py-4               /* vertical padding scales with font */
  px-6 sm:px-8 md:px-10              /* horizontal padding also scales */
">
  Get Started
</button>


</div>


  </div>
  <ScrollReveal
  scrollContainerRef={containerRef}
  baseOpacity={0}
  enableBlur={true}
  baseRotation={5}
  blurStrength={10}
  className="text-center w-full h-[100dvh]"
  >
    <h2  className={`my-5 `}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl  `}>When does a man die? When he is hit by a bullet? No! When he suffers a disease? No! When he ate a soup made out of a poisonous mushroom? No! A man dies when he is forgotten!</p>
    </h2>

</ScrollReveal>
  </main>
  )
}

export default Homepage