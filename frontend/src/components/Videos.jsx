import React from 'react'
import Video from '../components/Video'
import {Data} from './Data.js'
import './video.css'

const Videos = () => {
  return (
    <div className='vid-container'>
        {
            Data.map((video) => {
                return <Video key={video._id} video={video} />
            })
        }
    </div>
  )
}

export default Videos