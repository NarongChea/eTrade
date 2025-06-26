import React from 'react'
import errorImage from '../../public/error404.gif'
const Error404 = () => {
  return (

        <div className='w-full h-[592px] flex justify-center items-center  ' style={{backgroundColor : 'rgba(235,231,235)'}}>
            <div className='w-[700px]'>
                <img className='w-full h-full object-cover' src={errorImage} alt="Error Image " />
            </div>
        </div>

  )
}

export default Error404