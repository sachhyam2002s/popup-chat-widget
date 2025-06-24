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
    <div className='bg-blue-300 w-full h-dvh'>
    {isOpen && 
      <ChatList  onClose={() => setIsOpen(false)}/>
    }
    { (!isSmallScreen || !isOpen) && (
    <button onClick={() => setIsOpen(!isOpen)} className='fixed right-5 bottom-5 w-10 h-8 rounded-full bg-gray-600 text-white flex justify-center items-center'>
      <MessageCircle/>
    </button>
    )}
    </div>
    </>
  )
}

export default App
