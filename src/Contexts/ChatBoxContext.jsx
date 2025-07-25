import {useState, useEffect, useRef, createContext, useContext} from 'react'
import replies from  '../quickReplies.json'
import socket from '../socket'

const ChatBoxContext = createContext(null)

export const ChatBoxContextProvider = ({children}) => {
  const [message, setMessage] = useState([])
  const [input, setInput] = useState('')
  const [optionVisible, setOptionVisible] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
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
  
  const scrollRef = useRef(null)
  const quickReplies = replies.client  
  
  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }
    socket.on('connect', () => {
      console.log(`Connected with id: ${socket.id}`)
    })
    return () => {
      socket.off('connect')
    }
  }, [])

  const joinGroup = (group, username) => {
    if (socket && group) {
      socket.emit('join-group', group, username)
      setCurrentGroup(group)
      setUsername(username)
    }
    setMessage([
      {text: 'Hello! Welcome.', sender:'vendor'},
      {text: 'How can I help you?', sender:'vendor'}
    ])
  }

  useEffect(() => {
    const handleReceiveMsg = (newMsg) => {
      if(newMsg.sender === socket.id || newMsg.self) {
        setMessage(prev => 
          prev.map(msg => 
            msg.id === newMsg.id ? {...msg, status: 'delivered'} : msg
          )
        )
      }else{
        setMessage(prev => [...prev, {...newMsg, status:'sent'}])
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
  }, [currentGroup]);

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

  const handleMediaChange = (e) => {
    const medias = Array.from(e.target.files || []);
    const previewmedias = medias.map(file => URL.createObjectURL(file))
    if (!medias) return;
    setSelectedMedia(medias)
    setPreviewMedia(previewmedias)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previewfiles = files.map(file => URL.createObjectURL(file))
    setSelectedFile(prev => [...prev, ...files])
    setPreviewFile(prev => [...prev, ...previewfiles])
  }

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
      if(input.trim() !== '' || previewMedia){
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
    <ChatBoxContext.Provider value = {{message, input, optionVisible, isActive, isTyping, showMenu, previewMedia, previewFile, selectedMedia, selectedFile, date, day, scrollRef, quickReplies, toggleMenu, handleMediaChange, handleFileChange, sendMessage, handleKey, handleInputChange, setPreviewMedia, setSelectedFile, setPreviewFile, setIsActive, isEmoji, setIsEmoji, onEmojiClick, socket, joinGroup, lastOwnMsgId}}>
        {children}
    </ChatBoxContext.Provider>
  )
}

export const useChatBox = () => useContext(ChatBoxContext)

