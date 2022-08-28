import React from 'react'
import Navbar from '../components/Navbar'
import Videos from '../components/Videos'
// import './Home.css'

const Home = () => {
  return (
    <div className='container'>
        <Navbar />
        <Videos />
    </div>
  )
}

export default Home