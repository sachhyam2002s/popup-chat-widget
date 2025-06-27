import React, { useState, useRef, useEffect } from 'react'
import {User2, Search, X, Bot} from 'lucide-react'
import ChatBox from '../Components/ChatBox'
import ChatBot from '../Components/ChatBot'
import {ChatBoxContextProvider} from '../Contexts/ChatBoxContext'

function ChatList(props) {
  const [isActive, setIsActive] = useState(true)
  const [isChatBoxOpen, setisChatBoxOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [searchResult, setSearchResult] = useState('')
  const scrollRef = useRef(null)

  const handleSearch = (e) => {
    setSearchResult(e.target.value)
    console.log(searchResult);
  }

  return (
    <div className='fixed md:right-12 md:bottom-0 bg-blue-200 flex flex-col md:m-2 md:mx-5 shadow-lg h-[100svh] md:max-h-[450px] w-full md:max-w-[350px]  md:rounded-xl '>
      <div className='flex m-2 px-1 justify-around items-center'>
        {isAIOpen ? (
          <ChatBot onExit={() => setIsAIOpen(false)} onClose={props.onClose}/>
        ):(
          <div onClick={() => setIsAIOpen(true)} className=' flex items-center gap-1 cursor-pointer'>
            <p className=' bg-red-500 rounded-full w-10 h-8 flex items-center justify-center text-white'>
              <Bot className=' w-6 h-6'/>
            </p>
          </div>
        )}
        <p className='w-70 font-bold text-center text-2xl md:text-xl'>Chats</p>
          <button onClick={props.onClose} className='cursor-pointer'>
              <X className='w-6 h-6'/>
          </button>
      </div>

      {!isAIOpen && (
      <>
        <div className=' bg-white mx-2 rounded-full'>
          <div className='flex items-center gap-1 py-1 px-2'>
            <input type="text" placeholder='Search...' className='w-full px-1 focus:outline-none  text-sm' value={searchResult} onChange={handleSearch}/>
            <button onClick={() => setSearchResult()}><Search className='w-6 h-6 md:w-5 md:h-5 text-gray-5' /></button>
          </div>
        </div>

        {isChatBoxOpen ? (
          <ChatBoxContextProvider>
            <ChatBox onExit={() => setisChatBoxOpen(false)} onClose={props.onClose}/>
          </ChatBoxContextProvider>
        ) : (
          <div ref={scrollRef} className='flex flex-col gap-1 h-full m-2 rounded overflow-y-scroll scrollbar-hide'>
            {searchResult ? (
              <div></div>
            ) : (
              <>
              <div onClick={() => setisChatBoxOpen(true)} className='flex p-2 md:p-1 gap-2 items-center bg-blue-50 rounded-lg cursor-pointer'>
                <div className='relative'>
                  <div className='flex bg-gray-500 text-white rounded-full w-12 h-12 md:w-8 md:h-8 items-center justify-center '>
                    <User2 className='w-5 h-5'/>
                  </div>
                  <button onClick={(e) => {e.stopPropagation(); setIsActive(prev => !prev)}} className={`absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-gray-700`}></button>
                </div>
                <div className='flex flex-col w-full'>
                  <p className='text-md font-semibold'>Client</p>
                  <p className='text-xs'>Latest message</p>
                </div>
              </div>
              <div onClick={() => setisChatBoxOpen(true)} className='flex p-2 md:p-1 gap-2 items-center bg-blue-50 rounded-lg cursor-pointer'>
                <div className='relative'>
                  <div className='flex bg-gray-500 text-white rounded-full w-12 h-12 md:w-8 md:h-8 items-center justify-center '>
                    <User2 className='w-5 h-5'/>
                  </div>
                  <button onClick={(e) => {e.stopPropagation(); setIsActive(prev => !prev)}} className={`absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-gray-700`}></button>
                </div>
                <div className='flex flex-col w-full'>
                  <p className='text-md font-semibold'>Vendor</p>
                  <p className='text-xs'>Latest message</p>
                </div>
              </div>
              <div onClick={() => setisChatBoxOpen(true)} className='flex p-2 md:p-1 gap-2 items-center bg-blue-50 rounded-lg cursor-pointer'>
                <div className='relative'>
                  <div className='flex bg-gray-500 text-white rounded-full w-12 h-12 md:w-8 md:h-8 items-center justify-center '>
                    <User2 className='w-5 h-5'/>
                  </div>
                  <button onClick={(e) => {e.stopPropagation(); setIsActive(prev => !prev)}} className={`absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-gray-700`}></button>
                </div>
                <div className='flex flex-col w-full'>
                  <p className='text-md font-semibold'>Wlink</p>
                  <p className='text-xs'>Latest message</p>
                </div>
              </div>
            </>
            )}
          </div>
        )}
      </>
      )}
    </div>
  )
}

export default ChatList
