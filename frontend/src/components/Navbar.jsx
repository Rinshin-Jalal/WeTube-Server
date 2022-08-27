import React, { useState } from 'react'
import './navbar.css'
import logo from '/images/logo.png'
import upload from '/images/upload.png'
import search from '/images/search.png'
import userimg from '/images/user.png'

const Navbar = () => {
    const [user, setUser] = useState(false)
  return (
    <div className='nav'>
        <div className='nav-logo'>
            <img src={logo} alt='logo' />
        </div>
        <div class="wrap">
            <div class="search">
                <input type="text" class="searchTerm" placeholder="Search for videoz" />
                <button type="submit" class="searchButton">
                    <img src={search} alt='search' />
                </button>
            </div>
        </div>
        <div className='nav-links'>
            <img src={upload} alt='upload video' />
            {
                user ? 
                    <div className='user'>
                        <img src={userimg} alt='user' />
                        <h3>User</h3>
                    </div> : 
                    <div className='login'>
                        <button type='submit' onClick={() => setUser(true)}>Login</button>
                    </div>
            }
        </div>
    </div>
  )
}

export default Navbar