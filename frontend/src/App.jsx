import {  Routes , Route , Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import { useUserStore } from './stores/userStore'
import Login from './pages/Login'
import SkillsForm from './pages/SkillsForm'
import Questions from './pages/Questions'
import PageNotFound from './pages/NotFoundPage'
import { lazy, Suspense, useEffect, useState } from 'react'
const App = () => {
  const user  = useUserStore(state=> state.user);
  const getUser = useUserStore(state=> state.getUser);
  const loading = useUserStore(state=> state.loading);
  const [authChecked, setAuthChecked] = useState(false);

  
  useEffect(() => {
    getUser().then(()=>{setAuthChecked(true)}).catch((error)=>{console.error('error' , error)});
  }, [getUser]);


  const HomePage = lazy(() => import('./pages/Homepage'))
  const Dashboard = lazy(() => import('./pages/Dashboard')) 
  
  if (loading || !authChecked) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading...</div>} >
      <Navbar />
    
      <Routes>
        <Route path='/' element={user ? <Navigate to='/dashboard' />  : <HomePage /> } />
        <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
        <Route path='/skillsForm' element={user ? <SkillsForm /> : <Navigate to='/login' />} />
        <Route path='/questions' element={user ? <Questions /> : <Navigate to='/login' />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to='/login' />} />

        <Route path='*' element={<PageNotFound />} />
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
    </Suspense>
  )
}

export default App