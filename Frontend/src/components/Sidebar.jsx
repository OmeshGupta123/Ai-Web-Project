import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, Hash, House, Scissors, SquarePen, Users, Image, LogOut, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House , isFree: true},
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen, isFree: true},
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash, isFree: true },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image, isFree: true},
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser, isFree: false},
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors, isFree: false},
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText, isFree: false},
  { to: '/ai/community', label: 'Community', Icon: Users, isFree: true }
]

const Sidebar = ({ sidebar, setSidebar }) => {

  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { isGuest, setIsGuest, guestMode } = useGuest();
  const navigate = useNavigate();

  return (
    <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300  ease-in-out `}>
      <div className='my-7 w-full'>
        <img src={user?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} alt="user avatar" className='w-18 h-18 object-cover rounded-full mx-auto bg-gray-100' />
        <h1 className='mt-1 text-center'>{user?.fullName || "Guest User"}</h1>
        <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
          {navItems.map(({ to, label, Icon, isFree }) => {
            const isLocked = isGuest && guestMode === 'demo' && !isFree;

            if (isLocked) {
              return (
                <div
                  key={to}
                  onClick={() => toast.error('Premium tool locked in demo mode. Create an account to access.')}
                  className="px-3.5 py-2.5 flex items-center justify-between rounded transition-colors text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-400" />
                    {label}
                  </div>
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                </div>
              );
            }

            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors ${isActive
                    ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    {label}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
        {user ? (
          <>
            <div className={`flex gap-2 items-center cursor-pointer`} onClick={openUserProfile}>
              <img src={user.imageUrl} alt="avatar" className='w-10 h-10 object-cover rounded-full bg-gray-100' />
              <div>
                <h1 className='text-sm font-medium'>{user.fullName}</h1>
                <p className='text-xs text-gray-500'>
                  {/* <Protect plan='premium' fallback="Free">Premium</Protect> Plan */}
                </p>
              </div>
            </div>
            <LogOut onClick={() => {
              signOut();
              setIsGuest(false);
              navigate('/');
            }} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
          </>
        ) : (
          <div className='w-full flex justify-center'>
            <button
              onClick={() => setIsGuest(false)}
              className='w-full bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white py-2.5 rounded-lg font-medium hover:scale-102 active:scale-95 transition cursor-pointer'
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar