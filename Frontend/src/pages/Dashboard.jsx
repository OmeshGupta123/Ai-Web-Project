import React, { useEffect, useState } from 'react'
import { Gem, Sparkles } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useGuest } from '../context/GuestContext';
import CreationItem from '../components/CreationItem';
import axios from 'axios'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {

  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { isGuest } = useGuest();

  const getDashboardData = async () => {

    if (isGuest) {
      setCreations([]);
      setLoading(false);
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await axios.get('/api/ai/user/get-user-creations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || "Failed to load creations")
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      getDashboardData();
    } else if (isGuest) {
      setLoading(false);
      setCreations([]);
    }

  }, [isLoaded, isSignedIn, user, isGuest]);


  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>

        {/* Total Creations Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creation</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>

        {/* Active plan name  */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active plan</p>
            <h2 className='text-xl font-semibold'>
              Free
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>

      </div>

      {
        loading ?
          (
            <div className='flex justify-center items-center h-3/4'>
              <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'></div>
            </div>
          ) : (
            <div className='space-y-3'>
              <p className='mt-6 mb-4'>Recent Creation</p>
              {
                creations.map((item) => <CreationItem key={item.id} item={item} />)
              }
            </div >
          )
      }

    </div >
  )
}

export default Dashboard