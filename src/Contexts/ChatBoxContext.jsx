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
  const [isEmoji, setIsEmoji] = useState(false)
  const [currentRoom, setCurrentRoom] = useState('')

  socket.on('connect', () => {
    console.log(`Connected with id: ${socket.id}`)
  })
  // socket.on('connect-error', () => {
  //   console.error('connection error', err);
  // })
  useEffect(() => {
     socket.on('receive-message', (newMsg) => {
      setMessage(prev => [...prev, newMsg])
    }) 
    return () => {
      socket.off('receive-message')
    }
  }, [])

  const joinRoom = (room) => {
    if (socket && room) {
      socket.emit('join-room', room)
      setCurrentRoom(room)
      const now = Date.now()
      setMessage([
        {text: 'Hello! Welcome.', sender:'vendor', timeStamp: now},
        {text: 'How can I help you?', sender:'vendor', timeStamp: now}
      ])
    }
  }

  const scrollRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const quickReplies = JSON.parse(JSON.stringify(replies.client))
  
  const toggleMenu = () => setShowMenu(prev => !prev)
  
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
    
  // useEffect(() => {
  //   if (message.length === 0) {
      
  //   }
  // },[])

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
    const isMedia = selectedMedia  && selectedMedia.length>0;  
    const isFile = selectedFile && selectedFile.length > 0;
    if (!isText && !isMedia && !isFile) return;
    if(!currentRoom){
      alert('Please join a room first');
      return; 
    }
    const newMsg = {
      sender: socket.id,
      timeStamp: Date.now()
    }
    if(isText){
      newMsg.text = customText
    }
    if(isMedia && previewMedia.length > 0){
      newMsg.type = 'media'
      newMsg.media = previewMedia.map((url, i) => ({
        url,
        type: selectedMedia[i].type.startsWith('image/') ? 'image' : 'video' 
      }));
    }
    if (isFile && previewFile.length === selectedFile.length){
      newMsg.type = 'file'
      newMsg.file = previewFile.map((url, i) => ({
        url,
        name: selectedFile[i]?.name,
        type: selectedFile[i]?.type
      }))
    }
    setMessage(prev => [...prev, newMsg])
    if (socket.connected) {
      socket.emit('send-message', newMsg, currentRoom)
    }else{
      console.warn('socket not connected');
    }
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
    setInput (e.target.value)
    setIsTyping(true)
    if(typingTimeoutRef.current){
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(()=>{
      setIsTyping(false)
    },1000)
  }

  const onEmojiClick = (emojiObject) => {
    setInput(prevInput => prevInput + emojiObject.emoji)
  }

  return (
    <ChatBoxContext.Provider value = {{message, input, optionVisible, isActive, isTyping, showMenu, previewMedia, previewFile, selectedMedia, selectedFile, date, day, scrollRef, typingTimeoutRef, quickReplies, toggleMenu, handleMediaChange, handleFileChange, sendMessage, handleKey, handleInputChange, setPreviewMedia, setSelectedFile, setPreviewFile, setIsActive, isEmoji, setIsEmoji, onEmojiClick, socket, joinRoom, currentRoom}}>
        {children}
    </ChatBoxContext.Provider>
  )
}

export const useChatBox = () => useContext(ChatBoxContext)

