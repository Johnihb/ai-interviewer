import { useState } from 'react';
import { useGeminiStore } from '../stores/geminiStore';
export default function SkillsForm() {
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [count, setCount] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const {getQuestion} = useGeminiStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { skills, experience, count, difficulty });
    getQuestion({skills , experience , count , difficulty});
  };

  const handleCancel = () => {
    setSkills('');
    setExperience('');
    setCount('');
    setDifficulty('');
    console.log('Form cancelled and reset');
  };

  return (
    <div className="h-[90dvh] flex items-center justify-center px-6 flex-col gap-4">
      <div className="w-full max-w-md  rounded-2xl p-8 border border-gray-700">
        {/* Header */}
        <div className="h-20 mb-6">
          <h1 className="text-cyan-400 text-3xl font-medium text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            Skills Assessment
          </h1>
          <p className="text-gray-400 text-lg text-center">
            Enter your skill details below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xl flex flex-col gap-4">
          {/* Skills Field */}
          <div className="mb-4">
            <label className="block text-xl text-green-400 font-medium mb-3 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
              Skills
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200 h-10"
            />
          </div>

          {/* Experience Field */}
          <div className="mb-4">
            <label className="block text-purple-400 text-xl font-medium mb-3 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
              Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-200 h-10 text-lg"
            >
              <option value="" disabled >Select experience level</option>
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (2-4 years)</option>
              <option value="advanced">Advanced (5-8 years)</option>
              <option value="expert">Expert (8+ years)</option>
            </select>
          </div>

          {/* Count Field */}
          <div className="mb-4">
            <label className="block text-yellow-400 text-xl font-medium mb-3 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
              Count
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Number of projects/years"
              min="0"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-200 h-10 "
            />
          </div>

          {/* Difficulty Field */}
          <div className="mb-6">
            <label className="block text-pink-400 text-xl font-medium mb-3 drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 focus:shadow-[0_0_15px_rgba(244,114,182,0.3)] transition-all duration-200 text-lg h-10"
            >
              <option value="" >Select difficulty level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 text-xl">
            <button
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-500 h-10"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-transparent border border-red-500 hover:border-red-400 text-red-400 hover:text-red-300 font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}