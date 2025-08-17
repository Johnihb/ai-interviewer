import React from 'react'
import {  Routes , Route , Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
const App = () => {
  return (
    <div className='w-full h-[100dvh] bg-black overflow-x-hidden' >
      <Navbar />
    
      <Routes>
        <Route path='/' element={<Homepage />} />
        {/* <Route path='/login' element={<Login />} />
        <Route path='*' element={<Navigate to='/' />} /> */}
        <Route path='/signup' element={<Signup />} />
      </Routes>
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App