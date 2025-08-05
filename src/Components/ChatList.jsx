import { useState, useRef, useEffect } from 'react'
import {Search, X, Bot} from 'lucide-react'
import ChatBox from '../Components/ChatBox'
import ChatBot from '../Components/ChatBot'
import {useChatBox} from '../Contexts/ChatBoxContext'
import user from '../users.json'
import User from '../Components/User'
import Group from '../Components/Group'

function ChatList(props) {
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [searchResult, setSearchResult] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [activeOption, setActiveOption] = useState(null)
  const [joinedGroup, setJoinedGroup] = useState('')
  const [joinedUsername, setJoinedUsername] = useState('')
  const [username, setUsername] = useState('')
  const [group, setGroup] = useState('')
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState('')

  const scrollRef = useRef(null)

  const { joinGroup, createGroup, groupList, socket, setGroupList, setCurrentGroup, setUsername: setContextUsername } = useChatBox()

  const handleCreateGroup = () => {
    if (username && group) {
      createGroup(group, username)
      setJoinedGroup(group)
      setJoinedUsername(username)
      setIsChatBoxOpen(true)
      setGroup('')
      setUsername('')
      setIsWaitingForApproval(false)
    }
  }

  const handleJoinGroup = () => {
    if (username && group) {
      joinGroup(group, username)
      setNotificationMsg(`Request sent to join group "${group}". Wait for admin approval.`)
      setTimeout(() => setNotificationMsg(''), 3000)
      setIsWaitingForApproval(true)
      setGroup('')
      setUsername('')
    }
  }

  useEffect(() => { 
    const handleRequestAccepted = ({ groupName, adminName }) => {
      setGroupList(prev => {
        if (!prev.some(g => g.name === groupName)) {
          return [...prev, { name: groupName, admin: adminName }]
        }
        return prev
      })
      setJoinedGroup(groupName)
      setJoinedUsername(username)
      setIsWaitingForApproval(false)
      setNotificationMsg(`You request to join the group: "${groupName}" is approved.`)
      setTimeout(() => setNotificationMsg(''), 3000)
    }
    const handleGroupExists = (groupName) => {
      setNotificationMsg(`Group "${groupName}" already exists.`);
      setTimeout(() => setNotificationMsg(''), 3000);
    }
    const handleGroupNotFound = (groupName) => {
      setNotificationMsg(`Group "${groupName}" not found.`);
      setTimeout(() => setNotificationMsg(''), 3000);
    }
    const handleJoinRequestAlreadySent = (groupName) => {
      setNotificationMsg(`You have already sent a request to join  "${groupName}".`);
      setTimeout(() => setNotificationMsg(''), 3000);
    }
    // const handleGroupDeleted = (groupName, adminName) => {
    //   setNotificationMsg(`Group "${groupName}" (admin: ${adminName}) has been deleted.`);
    //   setTimeout(() => setNotificationMsg(''), 3000);
    //   setGroupList(prev => prev.filter(group => group.name  !== groupName))
    //   if (joinedGroup === groupName){
    //     setIsChatBoxOpen(false)
    //     setJoinedGroup('')
    //     setJoinedUsername('')
    //   }
    // }
    socket.on('request-accepted', handleRequestAccepted);
    socket.on('group-exists', handleGroupExists);
    socket.on('group-not-found', handleGroupNotFound);
    socket.on('join-request-already-sent', handleJoinRequestAlreadySent);
    // socket.on('group-deleted', handleGroupDeleted);
    return () => {
      socket.off('request-accepted', handleRequestAccepted);
      socket.off('group-exists', handleGroupExists);
      socket.off('group-not-found', handleGroupNotFound);
      socket.off('join-request-already-sent', handleJoinRequestAlreadySent);
      // socket.off('group-deleted', handleGroupDeleted);
    }
  },[socket, setGroupList, joinedGroup, username])

  const handleSearch = (e) => setSearchResult(e.target.value)
    
  const names= [...user.users]
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
            <button onClick={() => setSearchResult('')}>
              <Search className='w-6 h-6 md:w-5 md:h-5 text-gray-5 cursor-pointer' />
            </button>
          </div>
        </div>

        {!isChatBoxOpen ? (
          <>
          <div className='mt-2 flex flex-col items-center gap-1'>
            {notificationMsg && (
              <div className='bg-blue-100 text-blue-500 text-center rounded-md mx-2 py-1'>
                {notificationMsg}
              </div>
            )}
            {!showOptions && (
              <button onClick = {() => setShowOptions(true)} className='bg-blue-50 text-gray-600 cursor-pointer rounded-full px-3 py-1 font-semibold'>
                Group
              </button>
            )}
            {showOptions && (
              <div className='flex gap-1 items-center text-center font-semibold bg-blue-50  py-1 px-3 rounded-full'>
                <button onClick = {() => setActiveOption('create')} className={`cursor-pointer underline-offset-4 decoration-2 ${activeOption === 'create' ? 'underline text-blue-600' : 'text-gray-600'}`}>
                  Create Group
                </button>
                <button onClick={() => setShowOptions(false)}>
                  <X className='w-4 h-4 cursor-pointer stroke-3 text-gray-700'/>
                </button>
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
                <button className='bg-red-500 text-white rounded-2xl px-3 py-1 cursor-pointer font-semibold' onClick={handleCreateGroup}>
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
                <button className='bg-red-500 text-white rounded-2xl px-3 py-1 cursor-pointer font-bold' onClick={handleJoinGroup}>
                  Join
                </button>
              </div>
            )}
          </div>
          <div ref={scrollRef} className='flex flex-col m-2 gap-1 overflow-y-scroll scrollbar-hide'>
            {searchedUser.map((name, id) => (
              <User key={id} onClick={() => {setIsChatBoxOpen(true); setSelectedUser(name)}} user={name}/>
            ))}
            {Array.isArray(groupList) && groupList.map((groupItem, id) => (
              <Group key={id} onClick={() => {setJoinedGroup(groupItem.name); setJoinedUsername(groupItem.admin); setIsChatBoxOpen(true); setCurrentGroup(groupItem.name); setContextUsername(username);}} group={groupItem.name} admin={groupItem.admin}/>
            ))}
          </div>
        </>
        ) : (
          <ChatBox onExit={() => setIsChatBoxOpen(false)} onClose={props.onClose} user={selectedUser} username={joinedUsername} group={joinedGroup}/>
        )}
      </>
      )}
    </div>
  )
}

export default ChatList
