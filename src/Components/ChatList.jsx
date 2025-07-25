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
  const [showOptions, setShowOptions] = useState(false)
  const [activeOption, setActiveOption] = useState(null)
  const [joinedGroup, setJoinedGroup] = useState('')
  const [joinedUsername, setJoinedUsername] = useState('')
  const [username, setUsername] = useState('')
  const [group, setGroup] = useState('')
  const scrollRef = useRef(null)

  const { joinGroup } = useChatBox()

  const toggleGroup = () => setCreateGroup(!createGroup)
  const handleSearch = (e) => setSearchResult(e.target.value)

  const handleGroup = () => {
    if (username && group) {
      joinGroup(group, username)
      setJoinedGroup(group)
      setJoinedUsername(username)
      setisChatBoxOpen(true)
      setGroup('')
      setUsername('')
    }
  }
  
  const names= JSON.parse(JSON.stringify(user.users))
  // const names = onlineUsers.length > 0 ? onlineUsers : JSON.parse(JSON.stringify(user.users))
  
  const searchedUser = names.filter(name =>
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
            <button onClick={() => setSearchResult()}>
              <Search className='w-6 h-6 md:w-5 md:h-5 text-gray-5 cursor-pointer' />
            </button>
          </div>
        </div>

        {!isChatBoxOpen ? (
          <>
          <div className='mt-2 flex flex-col items-center gap-1'>
            {!showOptions&& (
              <button onClick = {() => setShowOptions(true)} className='bg-blue-50 text-gray-600 cursor-pointer rounded-full px-3 py-1 font-semibold'>
                Group
              </button>
            )}
            {showOptions && (
              <div className='flex gap-1 items-center text-center font-semibold bg-blue-50  py-1 px-3 rounded-full'>
                <button onClick = {() => setActiveOption('create')} className={`cursor-pointer underline-offset-4 decoration-2 ${activeOption === 'create' ? 'underline text-blue-600' : 'text-gray-600'}`}>
                  Create Group
                </button>
                <p className='flex items-center'>/</p>
                <button onClick = {() => setActiveOption('join')} className={`cursor-pointer underline-offset-4 decoration-2 ${activeOption === 'join' ? 'underline text-blue-600' : 'text-gray-600'}`}>
                  Join Group
                </button>
              </div>
            )}
            {showOptions && activeOption === 'create' && (
              <div className='flex flex-col items-center gap-2'>
                <div className='mt-1 flex flex-col gap-2'>
                  <div className='flex justify-between gap-1'>
                    <p>Admin: </p>
                    <input className='border rounded-2xl px-1 focus:outline-none bg-blue-100' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
                  </div>  
                  <div className='flex justify-between gap-1'>
                    <p>Group:</p>
                    <input className='border rounded-2xl px-1 focus:outline-none bg-blue-100' placeholder='Group' value={group} onChange={e => setGroup(e.target.value)}/>
                  </div>  
                </div>
                <button className='bg-red-500 text-white rounded-2xl px-2 cursor-pointer font-semibold' onClick={handleGroup}>
                  Create
                </button>
              </div>
            )}
            {showOptions && activeOption === 'join' && (
              <div className='flex flex-col items-center gap-2'>
                <div className='mt-1 flex flex-col gap-2'>
                  <div className='flex justify-between gap-1'>
                    <p className='font-semibold'>User: </p>
                    <input className='border rounded-2xl px-1 focus:outline-none bg-blue-100' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
                  </div>  
                  <div className='flex justify-between gap-1'>
                    <p className='font-semibold'>Group:</p>
                    <input className='border rounded-2xl px-1 focus:outline-none bg-blue-100' placeholder='Group' value={group} onChange={e => setGroup(e.target.value)}/>
                  </div>  
                </div>
                <button className='bg-red-500 text-white rounded-2xl px-3 py-1 cursor-pointer font-bold' onClick={handleGroup}>
                  Join
                </button>
              </div>
            )}
          </div>
          <div ref={scrollRef} className='flex flex-col m-2 gap-1 overflow-y-scroll scrollbar-hide'>
            {searchedUser.map((name, id) => (
              <User key={id} onClick={() => {setisChatBoxOpen(true); setSelectedUser(name)}} user={name}/>
            ))}
          </div>
        </>
        ) : (
          <ChatBox onExit={() => setisChatBoxOpen(false)} onClose={props.onClose} user= {selectedUser} username={joinedUsername} group={joinedGroup}/>
        )}
      </>
      )}
    </div>
  )
}

export default ChatList
