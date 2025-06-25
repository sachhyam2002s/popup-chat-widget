import React, { useEffect, useState } from 'react'
import {MessageCircle} from 'lucide-react'
import ChatList from './Components/ChatList'

function App() {
  const[isOpen, setIsOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768)

  useEffect (() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  },)  

  return (
    <>
    <div className='bg-black w-full h-dvh'>
    {isOpen && 
      <ChatList  onClose={() => setIsOpen(false)}/>
    }
    { (!isSmallScreen || !isOpen) && (
    <button onClick={() => setIsOpen(!isOpen)} className='fixed right-5 bottom-2 w-10 h-8 rounded-full bg-gray-500 text-white flex justify-center items-center cursor-pointer'>
      <MessageCircle/>
    </button>
    )}
    </div>
    </>
  )
}

export default App
