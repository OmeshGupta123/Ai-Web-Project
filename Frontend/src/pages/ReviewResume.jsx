import { useAuth } from '@clerk/clerk-react';
import { useGuest } from '../context/GuestContext';
import axios from 'axios';
import { Check, FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();
  const { isGuest, guestMode } = useGuest();

  const onSubmitHandler = async (e) => {
    e.preventDefault();


    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('resume', input);

      const apiUrl = isGuest ? '/api/guest/ai/resume-review' : '/api/ai/resume-review';
      const headers = isGuest ? { 'x-guest-mode': guestMode } : { Authorization: `Bearer ${await getToken()}` };

      const { data } = await axios.post(apiUrl, formData, { headers })
      if (data.success) {
        setContent(data.content);
      } else {
        const errorMsg = data.message || "An error occurred";
        if (errorMsg.toLowerCase().includes('limit') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('body') || errorMsg.includes('429')) {
          toast.error("Gemini API limit is over. Please try again later.");
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      let errorMsg = '';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      } else {
        errorMsg = error.message || "An error occurred";
      }
      if (errorMsg.toLowerCase().includes('limit') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('body') || errorMsg.includes('429')) {
        toast.error("Gemini API limit is over. Please try again later.");
      } else {
        toast.error(errorMsg);
      }
    }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left col  */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Resume Review</h1>
        </div>
        <div className='mt-5'>
          <p className='mt-6 text-sm font-medium'>Upload Resume</p>
          <label className='rounded-md p-2 px-3 mt-2 text-sm text-white flex items-center cursor-pointer font-bold'>
            <p className='bg-blue-700 rounded-full p-2 flex flex-wrap'>Choose File</p>
            <input
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setInput(e.target.files[0])}
              className="hidden"

            />
            {/* Show file name if selected */}
            {input ? (
              <p className='flex flex-wrap text-xl text-green-500 font-normal mt-1 gap-3 ml-5 mb-3'>
                {input.name}
                <Check />
              </p>
            ) : <p className='flex flex-wrap text-black text-sm font-normal mt-1 gap-3 ml-5 mb-3'>
              No file chosen
            </p>}
          </label>

          <p className='text-xs text-gray-500 font-light mt-1'>Supports PDF format only.</p>

          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            {!loading ? <FileText className='w-5' /> : <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>}
            Review Resume
          </button>
        </div>
      </form>

      {/* Right col  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-2xl flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-scroll'>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Analysis Result</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          {!content ? (
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <FileText className='w-9 h-9' />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          ) : (
            <div className='h-120 p-1 text-sm text-slate-600 reset-tw '>
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewResume