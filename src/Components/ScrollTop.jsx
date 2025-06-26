import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollTop = ({children}) => {
    const {pathname}= useLocation();
    useEffect(()=>{
        window.scrollTo(0,0);
    },[pathname])
  return (
    <div>{children}</div>
  )
}

export default ScrollTop