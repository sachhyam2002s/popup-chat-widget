import React, { useState, useRef, useEffect } from 'react'
import {User2, Search, X} from 'lucide-react'
import ChatBox from '../Components/ChatBox'
import ChatBot from '../Components/ChatBot'
import {ChatBoxContextProvider} from '../Contexts/ChatBoxContext'

function ChatList(props) {
  const[isActive, setIsActive] = useState(true)
  const[isChatBoxOpen, setisChatBoxOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const scrollRef = useRef(null)

  useEffect (() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBottom = scrollRef.current.scrollHeight
    }
  },[])

  return (
    <div className='fixed md:right-12 md:bottom-0 bg-gray-400 flex flex-col md:m-2 md:mx-5 shadow-lg h-[100svh] md:max-h-[450px] w-full md:max-w-[350px]  md:rounded-xl '>
      <div className='flex justify-around m-2 px-1 gap-1 items-center text-center font-bold text-2xl md:text-xl'>
        {isAIOpen ? (<ChatBot onExit={() => setIsAIOpen(false)} onClose={props.onClose}/>):(
          <div onClick={() => setIsAIOpen(true)} className='flex items-center gap-1 cursor-pointer'>
            <p className='bg-red-500 rounded-full w-10 h-8 '>AI</p>
          </div>
          
        )}
        <p className='w-70'>Messages</p>
        <button onClick={props.onClose} className='cursor-pointer'>
            <X className='w-6 h-6'/>
        </button>
      </div>

      <div className=' bg-white mx-2 rounded-full'>
        <div className='flex items-center gap-1 py-1 px-2'>
          <textarea rows={1} placeholder='Search here..' type="searchbar" className='w-full  focus:outline-none resize-none overflow-y-auto  text-sm'/>
          <button><Search className='w-6 h-6 md:w-5 md:h-5 text-gray-5' /></button>
        </div>
      </div>

    {isChatBoxOpen ? (<ChatBoxContextProvider><ChatBox onExit={() => setisChatBoxOpen(false)} onClose={props.onClose}/></ChatBoxContextProvider>) : (
      <div ref={scrollRef} className='flex flex-col h-full m-2 rounded overflow-y-scroll scrollbar-hide'>
        <div onClick={() => setisChatBoxOpen(true)} className='flex p-2 gap-1 items-center'>
          <div className='relative'>
            <div className='flex bg-white rounded-full w-12 h-12 md:w-8 md:h-8 items-center justify-center '>
              <User2 className='w-5 h-5'/>
            </div>
            <button onClick={(e) => {e.stopPropagation(); setIsActive(prev => !prev)}} className={`absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-white`}></button>
          </div>
          <div className='flex flex-col w-full px-2'>
            <p className='text-md'>Client</p>
            <p className='text-xs'>Latest message</p>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default ChatList
