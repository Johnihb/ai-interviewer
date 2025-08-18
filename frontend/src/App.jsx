import {useEffect} from 'react'
import {  Routes , Route , Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import { useUserStore } from './stores/userStore'
import Login from './pages/Login'
import GetQuestionDetails from './pages/SkillsForm'
const App = () => {
  const {user , getUser} = useUserStore();
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
        <Route path='/getQuestion' element={user ? <GetQuestionDetails /> : <Navigate to='/login' />} />
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