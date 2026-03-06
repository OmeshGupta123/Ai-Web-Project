import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useUser, SignIn } from '@clerk/clerk-react';
import { useGuest } from '../context/GuestContext';

const Layout = () => {

  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { isLoaded, user } = useUser();        // isLoaded = Clerk finished loading
  const { isGuest } = useGuest();

  // While Clerk is still checking auth, don't show SignIn yet
  // (isGuest may already be true from context)
  if (!isLoaded && !isGuest) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <span className='w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin'></span>
      </div>
    );
  }

  // Allow through if user is logged in OR browsing as guest
  const canAccess = user || isGuest;

  return canAccess ? (
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <img className='cursor-pointer w-32 sm:w-44' src={assets.logo} alt="logo" onClick={() => navigate('/')} />
        {/* Show guest badge in navbar */}
        {isGuest && !user && (
          <span className='text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-full font-medium'>
            Guest Mode
          </span>
        )}
        {
          sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
            : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB]'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout

