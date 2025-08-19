import {useEffect} from 'react'
import {  Routes , Route , Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import { useUserStore } from './stores/userStore'
import Login from './pages/Login'
import SkillsForm from './pages/SkillsForm'
import { useGeminiStore } from './stores/geminiStore'
import Questions from './pages/Questions'
const App = () => {
  const {user , getUser} = useUserStore();
  const {question } = useGeminiStore();
  useEffect(() => {
      getUser();
  }, []);

  
  return (
    <div className='w-full h-[100dvh] bg-black overflow-x-hidden' >
      <Navbar />
    
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
        <Route path='/getQuestion' element={user ? <SkillsForm /> : <Navigate to='/login' />} />
        <Route path='/questions' element={user ? <Questions /> : <Navigate to='/login' />} />
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