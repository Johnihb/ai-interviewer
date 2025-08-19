import React ,{useState} from 'react'
import { useGeminiStore } from '../stores/geminiStore'
import DataDisplayUI from '../components/DataDisplayUI'
const Questions = () => {
  const {question , loading , postAnswer , feedback} = useGeminiStore();
  const [answer , setAnswer] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    postAnswer(answer);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswer((prev) => ({ ...prev, [name]: value }));
  };

  console.log("feedback" , feedback)

  if(feedback && feedback.length !== 0){
    return <DataDisplayUI data={feedback} />
  }
  return (
    <div className='mt-10'>
      <h1 className='text-2xl font-medium text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]'>{feedback ? "Feedback" : "Question"}</h1>
      <form onSubmit={handleSubmit}>
        {
          question && Array.isArray(question) && question.map((quest , index) => (
            <div key={index}>
              <p>{quest}</p>
              <textarea type="text" value={answer[`Answer${index+1}`]} name={`Answer${index+1}`} onChange={handleInputChange} className='w-full h-20 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200' />
            </div>
          ))
        }
        <button type="submit" className=' bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-500 h-10' disabled={loading}>{loading ? "Loading..." : "Submit"}</button>
      </form>
    </div>
  )
}

export default Questions