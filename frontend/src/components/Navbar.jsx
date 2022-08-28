import React, { useState } from 'react'
import './navbar.css'
import logo from '/images/logo.png'
import upload from '/images/upload.png'
import search from '/images/search.png'
import userimg from '/images/user.png'
import menu from '/images/menu.png'

const Navbar = () => {
    const [user, setUser] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className='nav'>
        <div className='nav-logo'>
            <img src={logo} alt='logo' />
        </div>
        <div className={menuOpen ? 'wrap-expanded' : 'wrap'}>
            <div className="search">
                <input type="text" className="searchTerm" placeholder="Search for videoz" />
                <button type="submit" className="searchButton">
                    <img src={search} alt='search' />
                </button>
            </div>
        </div>
        <button className='menu' onClick={() => setMenuOpen(!menuOpen)} ><img src={menu} /></button>
        <div className={menuOpen ? 'menu-links' : 'nav-links'}>
            <div className={ menuOpen ? 'menu-link' : ''}>
                <img src={upload} alt='upload video' />
                <h1>Upload Video</h1>
            </div>
            {
                user ? 
                    <div className='user'>
                        <img src={userimg} alt='user' />
                        <h3>User</h3>
                    </div> 
                : 
                    <div className={menuOpen ? 'menu-login' : 'login'}>
                        <button type='submit' onClick={() => setUser(true)}>Sign In</button>
                    </div>
            }
        </div>
    </div>
  )
}

export default Navbar