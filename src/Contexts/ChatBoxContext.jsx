import {useState, useEffect, useRef, createContext, useContext} from 'react'
import replies from  '../quickReplies.json'
import socket from '../socket'
import { use } from 'react'

const ChatBoxContext = createContext(null)

export const ChatBoxContextProvider = ({children}) => {
  const [message, setMessage] = useState([])
  const [input, setInput] = useState('')
  // const [group, setGroup] = useState('')
  const  [groupList, setGroupList] = useState([])
  const [optionVisible, setOptionVisible] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [pendingRequest, setPendingRequest] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [previewMedia, setPreviewMedia] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])
  const [selectedFile, setSelectedFile] = useState([])
  const [previewFile, setPreviewFile] = useState([])
  const [lastOwnMsgId, setLastOwnMsgId] = useState(null)
  const [isEmoji, setIsEmoji] = useState(false)
  const [currentGroup, setCurrentGroup] = useState('')
  const [username, setUsername] = useState('')
  const [notificationMsg, setNotificationMsg] = useState('')
  
  const scrollRef = useRef(null)
  const quickReplies = replies.client  
  
  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }
    socket.on('connect', () => {
      console.log(`Connected with id: ${socket.id}`)
    })
    socket.on('connect_error', () => {
      console.error(`Connection error:`, err)
    })
    socket.on('disconnect', () => {
      console.log(`Socket disonnected.`)
    })
    return () => {
      socket.off('connect')
      socket.off('connect_error')
      socket.off('disconnect')
    }
  }, [])

  const createGroup = (groupName, adminName) => {
    socket.emit('create-group', groupName, adminName)
    setGroupList(prev => [...prev, {name: groupName, admin: adminName}])
    setCurrentGroup(groupName)
    setUsername(adminName)
    setIsAdmin(true)
    setMessage([
      {text: 'Hello! Welcome.', sender:'vendor'},
      {text: 'How can I help you?', sender:'vendor'}
    ])
  }
  const joinGroup = (groupName, username) => {
    socket.emit('join-group', groupName, username)
    setCurrentGroup(groupName)
    setUsername(username)
    setIsAdmin(false)
    setMessage([
      {text: 'Hello! Welcome.', sender:'vendor'},
      {text: 'How can I help you?', sender:'vendor'}
    ])
  }

  const handleAcceptRequest = (socketId) => {
    socket.emit('accept-request', currentGroup, socketId);
    setPendingRequest(prev => prev.filter(req => req.socketId !== socketId));
  }
  const handleRejectRequest = (socketId) => {
    socket.emit('reject-request', currentGroup, socketId);
    setPendingRequest(prev => prev.filter(req => req.socketId !== socketId));
  }

  useEffect(() => {
    socket.on('join-request', ({ socketId, username, groupName }) => {
      if (isAdmin && currentGroup === groupName) {
        setPendingRequest(prev => [...prev, { socketId, username }]);
      }
    });
    return () => {
      socket.off('join-request')
    }
  }, [isAdmin, currentGroup])

  useEffect(() => {
    socket.on('group-updated', ({ groupName, members }) => {
      setGroupList(prev => {
        const groupExist = prev.some(group => group.name === groupName);
        if(!groupExist) {
          return [...prev, {name: groupName, admin: 'Adimn Name'}];
        }
        return prev.map(group => 
          group.name === groupName ? {...group, members} : group
        );
      })
    })
    return () => {
      socket.off('group-updated')
    }
  }, [])

  useEffect(() => {
    const handleRequestAccepted = ({groupName, adminName}) => {
      setNotificationMsg(`Request accepted to join ${groupName}`);
      setTimeout(() => setNotificationMsg(''), 3000);
      setCurrentGroup(groupName);
      setGroupList(prev => {
        if (!prev.some(group => group.name === groupName)) {
          return [...prev, {name: groupName, admin: adminName}];
        }
        return prev;
      })
    }
    const handleRequestRejected = (groupName) => {
      setNotificationMsg(`Request rejected to join ${groupName}`);
      setTimeout(() => setNotificationMsg(''), 3000);
      setCurrentGroup('');
    }
    socket.on('request-accepetd', handleRequestAccepted);
    socket.on('request-rejected', handleRequestRejected);
    return () => {
      socket.off('request-accepted', handleRequestAccepted); 
      socket.off('request-rejected', handleRequestRejected);
    }
  },[socket, username])

  useEffect(() => {
    const handleReceiveMsg = (newMsg) => {
      if(newMsg.sender === socket.id || newMsg.self) {
        setMessage(prev => 
          prev.map(msg => 
            msg.id === newMsg.id ? {...msg, status: 'delivered'} : msg
          )
        )
      }else{
        setMessage(prev => [...prev, {...newMsg, status:'received'}])
        if (newMsg.group === currentGroup) {
          socket.emit('seen-message', currentGroup, newMsg.id);
        }
      }
    }
    const handleSeenMsg = (group, msgId) => {
      if (group === currentGroup) {
        setMessage(prev =>
          prev.map(msg => 
            msg.id === msgId ? {...msg, status: 'seen'} : msg
          )
        )   
      }
    }
    socket.on('receive-message', handleReceiveMsg);
    socket.on('seen-message', handleSeenMsg);
    return () =>{
      socket.off('receive-message', handleReceiveMsg);
      socket.off('seen-message', handleSeenMsg);
    }
  }, [currentGroup, socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  },[message])

  useEffect(() => {
    const interval = setInterval(()=>{
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  },[])
  const date = currentTime.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})
  const day = currentTime.toLocaleDateString([], {weekday:'short'})

  const sendMessage = (text) => {
    const customText = (text ?? input).trim()
    const isText = customText !== '';
    const isMedia = selectedMedia.length>0;  
    const isFile = selectedFile.length > 0;
    if (!isText && !isMedia && !isFile) return;
    if(!currentGroup){
      alert('Please join a group first');
      return; 
    }
    if(!isText && !isMedia && !isFile) return
    const newMsg = {
      id: Date.now(),
      sender: socket.id,
      senderName: username,
      group: currentGroup,
      timeStamp: Date.now(),
      status: 'sent',
    }
    if(isText){
      newMsg.text = customText
    }
    if(isMedia){
      newMsg.type = 'media'
      newMsg.media = previewMedia.map((url, i) => ({
        url,
        type: selectedMedia[i].type.startsWith('image/') ? 'image' : 'video' 
      }));
    }
    if (isFile){
      newMsg.type = 'file'
      newMsg.file = previewFile.map((url, i) => ({
        url,
        name: selectedFile[i].name,
        type: selectedFile[i].type
      }))
    }
    setMessage(prev => [...prev, newMsg])
    setLastOwnMsgId(newMsg.id)
    socket.emit('send-message', newMsg, currentGroup)
    socket.emit('stopTyping', currentGroup, socket.id);
    //resetting state
    setInput('')
    setOptionVisible(false)
    setPreviewMedia([])
    setSelectedMedia([])
    setPreviewFile([])
    setSelectedFile([])
    setIsEmoji(false)
  }

  const handleKey = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if(input.trim() !== '' || selectedMedia.length > 0 || selectedFile.length > 0) {
        sendMessage();
      }
    }
  }

  const handleInputChange = (e) =>{
    const value = e.target.value
    setInput(value)
    if (socket && currentGroup) {
      if (value.trim() !== '') {
        socket.emit('typing', currentGroup, socket.id)        
      }else{
        socket.emit('stopTyping', currentGroup, socket.id) 
      }
    }    
  }

  const handleMediaChange = (e) => {
    const medias = Array.from(e.target.files || []);
    const previewmedias = medias.map(file => URL.createObjectURL(file))
    if (!medias.length) return;
    setSelectedMedia(prev => [...prev, ...medias])
    setPreviewMedia(prev => [...prev, ...previewmedias])
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previewfiles = files.map(file => URL.createObjectURL(file))
    setSelectedFile(prev => [...prev, ...files])
    setPreviewFile(prev => [...prev, ...previewfiles])
  }

  useEffect(() => {
    const handleTyping = (group, senderId) => {
      if (group === currentGroup && senderId !== socket.id) {
        setIsTyping(true)
      }
    }
    const handleStopTyping = (group, senderId) => {
      if (group === currentGroup && senderId !== socket.id) {
        setIsTyping(false)
      }
    }
    socket.on('typing', handleTyping)
    socket.on('stopTyping', handleStopTyping)
    return () => {
      socket.off('typing', handleTyping)
      socket.off('stopTyping', handleStopTyping)
    }
  }, [currentGroup, socket])

  const toggleMenu = () => setShowMenu(prev => !prev)
  const onEmojiClick = (emojiObject) => {
    setInput(prevInput => prevInput + emojiObject.emoji)
  }

  return (
    <ChatBoxContext.Provider value = {{createGroup, message, input, optionVisible, isActive, isTyping, groupList, pendingRequest, isAdmin, showMenu, previewMedia, previewFile, selectedMedia, selectedFile, date, day, scrollRef, quickReplies, toggleMenu, handleMediaChange, handleFileChange, handleAcceptRequest, handleRejectRequest, sendMessage, handleKey, handleInputChange, setPreviewMedia, setSelectedFile, setPreviewFile, setIsActive, isEmoji, setIsEmoji, onEmojiClick, socket, joinGroup, lastOwnMsgId, setGroupList, setCurrentGroup, setUsername, username, currentGroup, notificationMsg}}>
        {children}
    </ChatBoxContext.Provider>
  )
}

export const useChatBox = () => useContext(ChatBoxContext)

