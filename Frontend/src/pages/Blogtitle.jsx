import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Hash, Sparkle, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Blogtitle = () => {
  const Category = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'];

  const [selectCategory, setSelectCategory] = useState(Category[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const promt = `Make Blogtitle on ${input} and the category is ${selectCategory}`

      const { data } = await axios.post('/api/ai/generate-blog-title', {
        promt: promt
      },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.messgage);
      }
    } catch (error) {
      toast.error(error.messgage)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left col  */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='font-bold'>AI Title Generator</h1>
        </div>
        <div className='mt-5'>
          <p className='mt-6 text-sm font-medium'>Keyword</p>
          <input onChange={(e) => setInput(e.target.value)} value={input} required type="text" placeholder='The future of artificial intelligence is...' className='w-full border border-gray-500 rounded-md p-2 px-3 mt-2 outline-none text-sm' />

          <p className='font-semibold mt-8'>Category</p>

          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
            {Category.map((item, index) => (
              <span key={index} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectCategory === item ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`} onClick={() => setSelectCategory(item)}>{item}</span>
            ))}
          </div>
        </div>
        <br />

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {!loading ? <Hash className='w-5' /> : <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>}
          Generate Title
        </button>
      </form>

      {/* Right col  */}
      {
        !content ? (<div className='w-full max-w-lg p-4 bg-white rounded-2xl flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-xl font-semibold'>Generated Titles</h1>
          </div>
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Hash className='w-9 h-9' />
              <p>Enter a topic and click "Generate Title" to get started</p>
            </div>

          </div>
        </div>) : (
          <div className='mt-3 w-full max-w-xl p-4 bg-white rounded-2xl border border-gray-200 min-h-120 max-h-[600px] overflow-y-scroll'>
             <div className='flex items-center gap-3 '>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-xl font-semibold'>Generated Titles</h1>
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

export default Blogtitle