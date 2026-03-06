import { useAuth } from '@clerk/clerk-react';
import { useGuest } from '../context/GuestContext';
import axios from 'axios';
import { Check, Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

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
      formData.append('image', input);

      const apiUrl = isGuest ? '/api/guest/ai/remove-image-background' : '/api/ai/remove-image-background';
      const headers = isGuest ? { 'x-guest-mode': guestMode } : { Authorization: `Bearer ${await getToken()}` };

      const { data } = await axios.post(apiUrl, formData, { headers })
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left col  */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Background Removal</h1>
        </div>
        <div className='mt-5'>
          <p className='mt-6 text-sm font-medium'>Upload image</p>
          <label className='rounded-md p-2 px-3 mt-2 text-sm text-white items-center cursor-pointer font-bold'>
            <p className='bg-blue-700 rounded-full p-2 w-fit'>Choose File</p>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setInput(e.target.files[0])}
              className="hidden"

            />
            {/* Show file name if selected */}
            {input ? (
              <p className='flex text-xl text-green-500 font-normal mt-1 gap-3 ml-5 mb-3'>
                {input.name}
                <Check />
              </p>
            ) : <p className='flex flex-wrap text-sm text-black font-normal mt-1 gap-3 ml-5 mb-3'>
              No file chosen
            </p>}
          </label>


          <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, And other image format</p>

          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            {!loading ? <Eraser className='w-5' /> : <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>}
            Remove Background
          </button>
        </div>
      </form>

      {/* Right col  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-2xl flex flex-col border border-gray-200 min-h-120 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Process Image</h1>
        </div>

        {
          !content ? (<div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          </div>
          ) : (
            <div className='mt-3 h-full'>
              <img src={content} alt="image" className='w-full h-full rounded-xl' />
            </div>
          )
        }

      </div>
    </div>
  )
}


export default RemoveBackground