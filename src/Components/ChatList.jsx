import { useState, useRef} from 'react'
import {Search, X, Bot} from 'lucide-react'
import ChatBox from '../Components/ChatBox'
import ChatBot from '../Components/ChatBot'
import {useChatBox} from '../Contexts/ChatBoxContext'
import user from '../users.json'
import User from '../Components/User'

function ChatList(props) {
  const [isChatBoxOpen, setisChatBoxOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [searchResult, setSearchResult] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const scrollRef = useRef(null)

  const { joinRoom } = useChatBox()

  const handleSearch = (e) => {
    setSearchResult(e.target.value)
  }
  
  const names= JSON.parse(JSON.stringify(user.users))
  console.log(names)
  
  const searchedName = names.filter(name =>
    name.toLowerCase().includes(searchResult.toLowerCase())
  )

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
            <button onClick={() => setSearchResult()}><Search className='w-6 h-6 md:w-5 md:h-5 text-gray-5 cursor-pointer' /></button>
          </div>
        </div>

        {!isChatBoxOpen ? (
          <>
          <div className='h-[80%] md:h-[20%]  mt-3 flex flex-col items-center gap-1'>
            <div className='flex gap-1 items-center'>
              <p className='font-semibold'>User: </p>
              <input className=' border rounded-2xl px-1 text-center focus:outline-none bg-blue-100' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
            </div>  
            <div className='flex gap-1 items-center'>
              <p className='font-semibold'>Room:</p>
              <input className=' border rounded-2xl px-1 text-center focus:outline-none bg-blue-100' placeholder='Room' value={room} onChange={e => setRoom(e.target.value)}/>
            </div>  
              <button className=' bg-red-400 rounded-2xl w-20 cursor-pointer' 
                onClick={() => {
                  if (username && room) {
                    joinRoom(room)
                    setisChatBoxOpen(true)
                    setSelectedUser(username)
                  }
                }}>
                  Join
              </button>
          </div>
          <div ref={scrollRef} className='flex flex-col m-2 gap-1 overflow-y-scroll scrollbar-hide'>
            {searchedName.map((name, id) => (
              <User key={id} onClick={() => {setisChatBoxOpen(true); setSelectedUser(name)}} username={name}/>
            ))}
            
          </div>
          </>
        ) : (
          <ChatBox onExit={() => setisChatBoxOpen(false)} onClose={props.onClose} user={selectedUser} username={username} room={room}/>
        )}
      </>
      )}
    </div>
  )
}

export default ChatList
