import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { useUserStore } from "./stores/userStore";
import { lazy, Suspense } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "./lib/axios";

// Lazy loaded pages
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const SkillsForm = lazy(() => import("./pages/SkillsForm"));
const Questions = lazy(() => import("./pages/Questions"));
const PageNotFound = lazy(() => import("./pages/NotFoundPage"));
const HomePage = lazy(() => import("./pages/Homepage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CV = lazy(() => import("./pages/CV"));
const CVResult = lazy(() => import("./pages/CVResult"));

const CVResultRoute = () => {
  const [result, setResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    axios
      .get("/gemini/existing-cvResult")
      .then((res) => {
        const status =
          res.data?.user?.cvStatus || res.data?.user?.session?.cvStatus || null;
        const cvResult =
          res.data?.user?.session?.cvResult || res.data?.user?.cvResult || null;

        if (status === "reviewed" && cvResult) {
          setResult(cvResult);
        } else {
          setRedirectTo("/cv");
        }
      })
      .catch((err) => {
        console.error("Failed to load CV result:", err);
        setRedirectTo("/cv");
      })
      .finally(() => setLoadingResult(false));
  }, []);

  if (redirectTo) return <Navigate to={redirectTo} replace />;
  if (loadingResult) return <div>Loading CV result...</div>;
  if (!result) return <Navigate to="/cv" replace />;

  return <CVResult data={result} />;
};

const App = () => {
  const user  = useUserStore(state=> state.user);
  const getUser = useUserStore(state=> state.getUser);
  const loading = useUserStore(state=> state.loading);
  const [authChecked, setAuthChecked] = useState(false);

  
  useEffect(() => {
    getUser().then(()=>{setAuthChecked(true)}).catch((error)=>{console.error('error' , error)});
  }, [getUser]);

  
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
        <Route path='/cv' element={user ? <CV /> : <Navigate to='/login' />} />
        <Route path='/cv-result' element={user ? <CVResultRoute /> : <Navigate to='/login' />} />

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

export default App ;