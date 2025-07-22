import { Check, Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveBackground = () => {

  const [input, setInput] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
          <label className='rounded-md p-2 px-3 mt-2 text-sm text-white flex items-center cursor-pointer font-bold'>
            <p className='bg-blue-700 rounded-full p-2 flex flex-wrap'>Choose File</p>
            <input
              type="file"
              accept="image/*"
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
          ) : <p className='flex flex-wrap text-sm text-black font-normal mt-1 gap-3 ml-5 mb-3'>
              No file chosen
            </p>}
          </label>

        
          <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, And other image format</p>

          <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            <Eraser className='w-5' />
            Remove Background
          </button>
        </div>
      </form>

      {/* Right col  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-2xl flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
            <Eraser className='w-9 h-9' />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default RemoveBackground