import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useGuest } from '../context/GuestContext';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' }
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('')

  const { getToken } = useAuth();
  const { isGuest, guestMode } = useGuest();

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      setLoading(true);
      const promt = `Write an article about ${input} in ${selectedLength.text}`

      const apiUrl = isGuest ? '/api/guest/ai/generate-article' : '/api/ai/generate-article';
      const headers = isGuest ? { 'x-guest-mode': guestMode } : { Authorization: `Bearer ${await getToken()}` };

      const { data } = await axios.post(
        apiUrl,
        { promt: promt, length: selectedLength.length },
        { headers }
      );

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start gap-4 text-slate-700'>

      {/* Left col  */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='font-bold'>Article Configuration</h1>
        </div>
        <div className='mt-5'>
          <p className='mt-6 text-sm font-medium'>Article Topic</p>
          <input onChange={(e) => setInput(e.target.value)} value={input} required type="text" placeholder='The future of artificial intelligence is...' className='w-full border border-gray-500 rounded-md p-2 px-3 mt-2 outline-none text-sm' />

          <p className='font-semibold mt-8'>Article Length</p>

          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
            {articleLength.map((item, index) => (
              <span key={index} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`} onClick={() => setSelectedLength(item)}>{item.text}</span>
            ))}
          </div>
        </div>
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {/* <Edit className='w-5' /> */}
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Edit className='w-5' />}
          Generate Article
        </button>
      </form>

      {/* Right col  */}
      {
        !content ? (
          <div className='w-full max-w-lg p-4 bg-white rounded-2xl flex flex-col border border-gray-200 min-h-120 max-h-[600px]'>
            <div className='flex items-center gap-3'>
              <Edit className='w-5 h-5 text-[#4A7AFF]' />
              <h1 className='text-xl font-semibold'>Generated Article</h1>
            </div>
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Edit className='w-9 h-9' />
                <p>Enter a topic and click "Generate articles" to get started</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='mt-3 w-full max-w-xl p-4 bg-white rounded-2xl border border-gray-200 min-h-120 max-h-[600px] overflow-y-scroll'>
            <div className='flex items-center gap-3'>
              <Edit className='w-5 h-5 text-[#4A7AFF]' />
              <h1 className='text-xl font-semibold'>Generated Article</h1>
            </div>
            <div className='h-120 p-1 text-sm text-slate-600 reset-tw'>
              <Markdown>{content}</Markdown>

            </div>
          </div>
        )
      }
    </div>
  )
}


export default WriteArticle