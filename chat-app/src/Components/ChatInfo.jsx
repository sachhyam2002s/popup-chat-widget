import {ArrowLeft, User, X} from 'lucide-react'
import {useState} from 'react'


function ChatInfo(props) {
    const [isActive, setIsActive] = useState(true)
  return (
      <div className='fixed inset-0 md:inset-auto md:right-12 md:bottom-0 bg-gray-400 flex flex-col md:m-2 md:mx-5 shadow-lg h-[100svh] md:max-h-[450px] w-full md:max-w-[350px]  md:rounded-xl z-50'>
        <div className='flex items-center p-2 gap-2'>
          <button onClick={props.onExit}>
            <ArrowLeft className='w-6 h-6 cursor-pointer'/>
          </button>
          <div className="relative">
            <div className="w-12 h-12 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className='w-6 h-6'/>
            </div>
            <button onClick={() => setIsActive(active => !active)} className={`absolute right-0 bottom-0 w-4 md:w-3 h-4 md:h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}/>
            </div>
            <h1 className='text-2xl md:text-lg font-bold w-full '>
            {props.group || props.username || props.user}
            </h1>
            <div  className='flex gap-2 pr-1 items-center'>
            <button onClick={props.onClose} className='cursor-pointer'>
                <X className='w-6 h-6'/>
            </button>
            </div>
        </div>

        <div  className='p-1 bg-white h-full flex flex-col overflow-y-auto scrollbar-hide mx-1'>
          <p className='font-semibold text-center'>Group Members</p>
        </div>
      </div>
  )
}

export default ChatInfo
