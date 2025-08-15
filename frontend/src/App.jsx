import React from 'react'
import {  Routes , Route , Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import TargetCursor from './Reactbits/TargetCursor'
const App = () => {
  return (
    <div className='w-full h-[100dvh] bg-black overflow-x-hidden' >
      <Navbar />
    <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
      />
      <Routes>
        <Route path='/' element={<Homepage />} />
        {/* <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={<Navigate to='/' />} /> */}
      </Routes>
    </div>
  )
}

export default App