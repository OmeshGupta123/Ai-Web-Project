import { useAuth, useUser } from '@clerk/clerk-react';
import { useGuest } from '../context/GuestContext';
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {

  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const { isGuest } = useGuest();
  const [loading, setLoading] = useState(true);

  const { getToken, isLoaded, isSignedIn } = useAuth();

  const fetchCreations = async () => {
    try {
      // for if we don't want to give access to the guest of public creations.
      // const { data } = await axios.get('/api/ai/user/get-published-creations', {
      //   headers: { Authorization: `Bearer ${await getToken()}` }
      // })

      // we want to give access to the guest of public creations.
      const url = isGuest
        ? '/api/guest/ai/get-published-creations'
        : '/api/ai/user/get-published-creations';

      const config = isGuest
        ? {}
        : { headers: { Authorization: `Bearer ${await getToken()}` } };

      const { data } = await axios.get(url, config);


      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  const imageLikeToggle = async (id) => {
    if (!user || isGuest) {
      toast.error("Please login to like creations!");
      return;
    }
    try {
      const { data } = await axios.post('/api/ai/user/toggle-like-creations', { id }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success(data.message)
        await fetchCreations();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        fetchCreations();
      } else if (isGuest) {
        fetchCreations();
      } else {
        setLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, user, isGuest]);


  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation, index) => (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <img src={creation.content} alt="" className='w-full h-full object-cover rounded-lg' />
            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white'>
              <p className='text-sm hidden group-hover:block'>{creation.promt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart onClick={() => imageLikeToggle(creation.id)} className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${user && creation.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full boarder-3 boarder-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community