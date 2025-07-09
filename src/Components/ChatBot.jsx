import { useState, useRef, useEffect } from 'react'
import { SendHorizonal, User, ArrowLeft, Bot, X} from 'lucide-react'
import botmessages from '../botChat.json'

function ChatBot(props) {
  const botChat = JSON.parse(JSON.stringify(botmessages))
  const initialBotMsg = botChat.find(option => option.id  === 'start')
  
  const [message, setMessage] = useState(initialBotMsg ? [initialBotMsg] : [])
  const [input, setInput] = useState("")
  const [currentOptionId, setcurrentOptionId] =useState('start')
  const [isTyping, setIsTyping] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const scrollRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect (() => {
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current. scrollHeight
    }
  }, [message])

  const time = currentTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
  const date = currentTime.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})
  const day = currentTime.toLocaleDateString([], {weekday:'short'})

  const currentBotMsg = botChat.find(option => option.id === currentOptionId)
  
  const handleOptionClick = (text, nextId) => {
    const userMsg = {
      text: text,
      sender: 'user',
    }
    setMessage(prev => [...prev, userMsg])
    setIsTyping(true)
    setInput('')
    setTimeout(() => {
      const nextOption = botChat.find(option => option.id === nextId)
      if (nextOption) {
        setcurrentOptionId(nextOption.id)
        setMessage(prev => [...prev, nextOption]) 
      }
      setIsTyping(false)
    }, 500)
  }
  
  const handleKey = (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }
  
  const handleInputChange = (e) => {
    setInput(e.target.value)
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }
  

  const sendMessage = () => {
    const customText = input.trim();
    if(!customText) return;
    
    const userMsg = {
      text: customText,
      sender: 'user',
    }
    setMessage(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(false)

    setTimeout(() => {
      const currentOption = botChat.find(option => option.id === currentOptionId)
      const selectedOption = currentOption?.options?.find(opt => opt.text === customText)
      const nextOption = botChat.find(option => option.id === selectedOption?.next)
      if (nextOption) {
        setcurrentOptionId(nextOption.id)
        setMessage(prev => [...prev, nextOption])
      }
      setIsTyping(false)
    }, 500)
  }


  return (
    <>
      <div className='fixed inset-0 md:inset-auto md:right-12 md:bottom-0 bg-gray-400 flex flex-col md:m-2 md:mx-5 shadow-lg h-[100svh] md:max-h-[450px] w-full md:max-w-[350px]  md:rounded-xl z-50'>
        <div className='flex items-center p-2 gap-2'>
          <button onClick={props.onExit}>
            <ArrowLeft className='w-6 h-6 cursor-pointer'/>
          </button>
          <div className="p-1 rounded-full bg-gray-300">
            <Bot />
          </div>
          <h1 className='text-2xl md:text-lg w-full font-semibold'>
            Chat Bot
          </h1>
          <div  className='flex gap-2 pr-1 cursor-pointer items-center'>
            {/* <Info className='w-6 h-6 md:w-5 md:h-5'/> */}
            <button onClick={props.onClose} className='cursor-pointer'>
              <X className='w-6 h-6'/>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className='p-1 bg-white h-full flex flex-col overflow-y-auto scrollbar-hide mx-1'>
          <span className='text-center text-xs'>
            {time}, {date}, {day}
          </span>
          {message.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'} items-end gap-1`}>
              {msg.sender === 'bot' &&(
                <div className='bg-gray-300 rounded-full flex justify-center items-center w-4 h-4'>
                  <Bot className='w-3 h-3'/>
                </div>
              )}
              <div className={`rounded-2xl px-2 py-1 text-lg md:text-sm max-w-[80%] break-words whitespace-pre-wrap mb-1 ${msg.sender === 'user' ? 'bg-blue-300' : 'bg-gray-300'}`}>
                {msg.message || msg.text}
              </div>
              {msg.sender === 'user' &&(
                <div className='bg-gray-300 rounded-full flex justify-center items-center w-4 h-4'>
                  <User className='w-3 h-3'/>
                </div>
              )}
            </div>
          ))}
        </div>

        {currentBotMsg?.options && (
          <div className='flex flex-wrap gap-1 mx-1 p-2 justify-center bg-white'>
            {currentBotMsg.options.map((userOption, idx) => (
              <button key={idx} onClick={() => handleOptionClick(userOption.text, userOption.next)} className='bg-blue-200 text-lg md:text-sm rounded-2xl px-2 p-1 hover:bg-blue-300 cursor-pointer'>
                {userOption.text}
              </button>
            ))}
          </div>
        )}
        {isTyping && (
          <div className='flex items-end gap-1 p-1 bg-white mx-1'>
            <div className='w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center'>
              <User className='w-4 h-4'/>
            </div>
            <div className='animate-pulse bg-gray-300 rounded-full px-2 py-1 text-lg md:text-sm mb-1'>
              Typing...
            </div>
          </div>
        )}

        <div className='flex gap-1 m-1'>
          <div className='rounded-lg bg-white w-full overflow-hidden flex p-1'>
            <textarea rows={1} placeholder='Type here...' className='p-1 w-full text-lg md:text-sm focus:outline-none bg-white resize-none overflow-y-auto scrollbar-hide' value={input} onChange={handleInputChange} onKeyDown={handleKey}/>
            <button onClick={sendMessage}>
              <SendHorizonal className='w-7 h-7 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-blue-600'/>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatBot
