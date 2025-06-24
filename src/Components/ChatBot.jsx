import { useState, useRef, useEffect } from 'react'
import {Phone, Video, Info, SendHorizonal, FilePlus, User, CirclePlus, Image, Camera, Smile, ArrowLeft} from 'lucide-react'

function App() {
  const [message, setMessage] = useState([])
  const [input, setInput] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showMenu, setShowMenu] = useState(false)
  const scrollRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
  })
  const time = currentTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
  const date = currentTime.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})
  const day = currentTime.toLocaleDateString([], {weekday:'short'})
  
  useEffect(() => {
    setMessage([
      {text: 'Hello! Welcome.', sender:'vendor'},
      {text: 'How can I help you?', sender:'vendor'}
    ])
  },[])

  useEffect (() => {
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current. scrollHeight
    }
  }, [message])

  const sendMessage = () => {
    const trimmed = input.trim();
    if(trimmed === '') return;
    const userMsg = {
      text: trimmed,
      sender: 'vendor',
    }
    setMessage(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(false)
  }

  const handleKey = (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      sendMessage();}
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1500)
  }

  const toggleMenu = () => setShowMenu(prev => !prev)

  return (
    <>
      <div className='fixed md:right-0 lg:right-20 md:bottom-0 flex flex-col bg-gray-400 md:rounded-xl md:m-2 md:mx-5 h-[100svh] md:max-h-[450px] w-full md:max-w-[350px] shadow-lg'>
        <div className='flex items-center p-2 gap-2'>
          <ArrowLeft className='w-12 h-12 md:w-8 md:h-8'/>
        <div className="relative">
          <div className="w-12 h-12 md:w-8 md:h-8 rounded-full bg-gray-300 flex justify-center items-center">
            <User className='w-6 h-6'/>
          </div>
          <button onClick={() => setIsActive(prev => !prev)} className={`absolute right-0 bottom-0 w-4 md:w-3 h-4 md:h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></button>
        </div>
        <h1 className='text-2xl md:text-lg font-bold w-full '>
          Client
        </h1>
        <div  className='flex gap-2 pr-1 cursor-pointer'>
          <Phone className='w-7 h-7 md:w-5 md:h-5'/>
          <Video className='w-7 h-7 md:w-5 md:h-5'/>
          <Info className='w-7 h-7 md:w-5 md:h-5'/>
        </div>
      </div>

        <div ref={scrollRef} className='p-2 flex flex-col gap-1 h-full overflow-y-auto bg-white scrollbar-hide mx-1'>
          <span className='text-center text-xs'>{time}, {date}, {day}</span>
          {message.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'} items-end gap-1`}>
              {msg.sender === 'client' &&(
                <div className='bg-gray-300 rounded-full flex justify-center items-center w-5 h-5'><User className='w-4 h-4'/></div>
              )}
              <div className={`rounded-2xl px-2 py-1 text-lg md:text-sm max-w-[80%] break-words whitespace-pre-wrap ${msg.sender === 'vendor' ? 'bg-blue-300' : 'bg-gray-300'}`}>
                {msg.text}
              </div>
              {msg.sender === 'vendor' &&(
                <div className='bg-gray-300 rounded-full flex justify-center items-center w-5 h-5'><User className='w-4 h-4'/></div>
              )}
            </div>
          ))}
        </div>
        {isTyping && (
          <div className='flex items-end gap-1 p-1 bg-white mx-1'>
            <div className='w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center'><User className='w-4 h-4'/></div>
            <div className='bg-gray-300 px-2 text-lg md:text-sm py-1 rounded-full animate-pulse'>Typing...</div>
          </div>
        )}

        <div className='flex gap-1 items-center p-1'>
          <div className='rounded-lg bg-white w-full overflow-hidden flex p-1'>
            <button onClick={toggleMenu}>
              <CirclePlus className='w-7 h-7 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-blue-500'/>
            </button>
            {showMenu &&(
              <div className='mx-1 flex gap-2 md:gap-1 bg-white text-gray-600'>
                <button className='hover:text-blue-500'>
                    <FilePlus className='w-6 h-6 md:w-5 md:h-5 cursor-pointer'/>
                  </button>
                  <button className='hover:text-blue-500'>
                    <Image className='w-6 h-6 md:w-5 md:h-5 cursor-pointer'/>
                    </button>
                  <button className='hover:text-blue-500'>
                    <Camera className='w-6 h-6 md:w-5 md:h-5 cursor-pointer'/>
                  </button>
                  <button className='hover:text-blue-500'>
                    <Smile className='w-6 h-6 md:w-5 md:h-5 cursor-pointer'/>
                  </button>
              </div>
            )}
            <textarea rows={1} placeholder='Type here...' className='p-1 w-full text-lg md:text-sm focus:outline-none bg-white resize-none overflow-y-auto ' value={input} onChange={handleInputChange} onKeyDown={handleKey}/>
          </div>
          <button onClick={sendMessage}><SendHorizonal className='w-7 h-7 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-blue-600'/></button>
        </div>
      </div>
    </>
  )
}

export default App
