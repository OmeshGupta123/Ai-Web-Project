import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { useGuest } from '../context/GuestContext';
import { useUser } from '@clerk/clerk-react';

const Hero = () => {
  const navigate = useNavigate();
  const { setIsGuest, setGuestMode } = useGuest();
  const { user } = useUser();

  const handleGuestLogin = () => {
    setIsGuest(true);
    setGuestMode('full');
    navigate('/ai');
  };

  const handleStartCreating = () => {
    if (!user) {
      setIsGuest(false);
      setGuestMode(null);
    }
    navigate('/ai');
  };

  const handleDemoLogin = () => {
    setIsGuest(true);
    setGuestMode('demo');
    navigate('/ai');
  };

  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>

      <div className='text-center mb-6'>
        <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>Create amazing content <br /> with <span className='text-primary'>AI tools</span></h1>
        <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>Transform your content creation with our suite of premium AI tools.Write articles, generate images, and enhance your Workflow.
        </p>
      </div>

      <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
        <button onClick={handleStartCreating} className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer'>Start creating now</button>

        {!user && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleDemoLogin}
              className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer"
            >
              Watch demo
            </button>

            <button
              onClick={handleGuestLogin}
              className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer"
            >
              Continue as Guest
            </button>
          </div>
        )}
      </div>

      <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
        <img src={assets.user_group} alt="" className='h-8' />Trusted by 10k+ people
      </div>

    </div>
  )
}

export default Hero