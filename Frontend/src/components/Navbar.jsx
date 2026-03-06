import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import {useClerk, UserButton, useUser} from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate();
    const {user} = useUser();
    const {openSignIn} = useClerk();
  return (
    <div className='fixed z-5 w-full background-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 cursor-pointer drop-shadow-2xl'>
        <img src={assets.logo} alt="logo" className='w-46 sm:w-66'  onClick={() => {
            navigate('/')
        }} />

        {
          user ? <UserButton /> : (
        <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>Get Started <ArrowRight className='w-8 h-8' /></button>
          )
        }

        </div>
  )
}

export default Navbar