import { Route } from 'react-router-dom'
import React from 'react'
import { Routes } from 'react-router-dom'
import { Home,RemoveBackground,GenerateImages, Blogtitle,Layout, Dashboard, WriteArticle, RemoveObject, ReviewResume, Community } from './pages'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from 'react-hot-toast'

export const App = () => {

  // this code is for testing. tokens
  const {getToken} = useAuth();
  useEffect(() => {
    getToken().then((token) => console.log(token))
  },[])

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='write-article' element={<WriteArticle />} />
            <Route path='blog-titles' element={<Blogtitle />} />
            <Route path='generate-images' element={<GenerateImages />} />
            <Route path='remove-background' element={<RemoveBackground />} />
            <Route path='remove-object' element={<RemoveObject />}/>
            <Route path='review-resume' element={<ReviewResume />}/>
            <Route path='community' element={<Community />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
