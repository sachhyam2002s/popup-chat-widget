import {useState, useEffect, useRef, createContext, useContext} from 'react'
import replies from  '../../public/quickReplies.json'

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

  const scrollRef = useRef(null)
  const typingTimeoutRef = useRef(null)
    
  const quickReplies = JSON.parse(JSON.stringify(replies.client))

  useEffect(() => {
    const interval = setInterval(()=>{
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  },[])
  const time = currentTime.toLocaleTimeString([], {hour:'2-digit', minute: '2-digit'});
  const date = currentTime.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})
  const day = currentTime.toLocaleDateString([], {weekday:'short'})
    
  useEffect(() => {
    if (message.length === 0) {
      setMessage([
        {text: 'Hello! Welcome.', sender:'vendor'},
        {text: 'How can I help you?', sender:'vendor'}
      ])
    }
  },[])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  },[message])

  const toggleMenu = () => setShowMenu(prev => !prev)

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
    const newMsg = {
      sender: 'client'
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
    //reset state
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
    <ChatBoxContext.Provider value = {{message, input, optionVisible, isActive, isTyping, showMenu, previewMedia, previewFile, selectedMedia, selectedFile, time, date, day, scrollRef, typingTimeoutRef, quickReplies, toggleMenu, handleMediaChange, handleFileChange, sendMessage, handleKey, handleInputChange, setPreviewMedia, setSelectedFile, setPreviewFile, setIsActive, isEmoji, setIsEmoji, onEmojiClick}}>
        {children}
    </ChatBoxContext.Provider>
  )
}

export const useChatBox = () => useContext(ChatBoxContext)

