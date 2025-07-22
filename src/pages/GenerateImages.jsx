import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const GenerateImages = () => {
 
  const style = ['Ghibli Style', 'Realistc','Anime style', 'Cartoon style', 'Fantasy style', 'Realistic style', '3D style', 'Portrait style'];

  const [selectedStyle, setSelectedStyle] = useState(style[0]);
  const [input,setInput] = useState('');
  const [publish,setPublish] = useState(false);

  const onSubmitHandler = async (e) => {
      e.preventDefault();
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

    {/* Left col  */}
    <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
      <div className='flex items-center gap-3'>
        <Sparkles className='w-6 text-[#00AD25]' />
        <h1 className='font-bold'>AI Image Generator</h1>
      </div>
      <div className='mt-5'>
          <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
          <textarea rows={4} onChange={(e) => setInput(e.target.value)} value={input} required placeholder='Describe what you want to see in the image...' className='w-full border border-gray-500 rounded-md p-2 px-3 mt-2 outline-none text-sm' />

          <p className='font-semibold mt-8'>Style</p>

          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
            {style.map((item,index) => (
              <span key={index} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}`} onClick={() => setSelectedStyle(item)}>{item}</span>
            ))}
          </div>
        </div>

        <div className='my-6 flex items-center gap-2'>
            <label className='flex relative cursor-pointer gap-1'>
              <input type="checkbox" onChange={(e) => setPublish(e.target.checked)} checked={publish} className='sr-only peer' />

              <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>

              <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
              <p className='text-sm'>Make this image public</p>
            </label>
        </div>

        <button className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          <Image className='w-5' />
          Generate Image
        </button>
    </form>

    {/* Right col  */}
    <div className='w-full max-w-lg p-4 bg-white rounded-2xl flex flex-col border border-gray-200 min-h-120 max-h-[600px]'>
          <div className='flex items-center gap-3'>
              <Image className='w-5 h-5 text-[#00AD25]' />
              <h1 className='text-xl font-semibold'>Generated Article</h1>
          </div>
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
               <Image className='w-9 h-9' />
               <p>Enter a topic and click "Generate Image" to get started</p>
            </div>

          </div>
    </div>

    </div>
  )
}

export default GenerateImages