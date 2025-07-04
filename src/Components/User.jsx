import {User2} from 'lucide-react'
import { useState } from 'react';

function User(props) {
  const [isActive, setIsActive] = useState(true)
  const [msgCount, setMsgCount] = useState(0)
  const [isUnseenMsg, setIsUnseenMsg] = useState(false) 
  const add = () => {
    if (msgCount < 10) {
      setMsgCount(msgCount + 1)
      setIsUnseenMsg(true)
    }
  }
  const remove = () => {
    if (msgCount > 0) {
      setMsgCount(msgCount - 1)
      if (msgCount -1 === 0){
        setIsUnseenMsg(false)
      }
    }
  }
  const handleUnseenMsg = (e) => {
    setMsgCount(0)
    setIsUnseenMsg(false)
  }
  
  return (
    <div onClick={props.onClick} className='flex p-2 md:p-1 gap-2 items-center bg-blue-50 rounded-lg cursor-pointer'>
        <div className='relative'>
            <div className='flex bg-gray-500 text-white rounded-full w-12 h-12 md:w-8 md:h-8 items-center justify-center '>
                <User2 className='w-5 h-5'/>
            </div>
          <button onClick={(e) => {e.stopPropagation(); setIsActive(prev => !prev)}} className={`absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-gray-700`}></button>
        </div>
        <div className='flex w-full relative items-center'>
          <div className='w-[80%]'>
            <p className={`text-md font-semibold ${isUnseenMsg ? 'text-blue-300': 'text-black'}`}>{props.username}</p>
            <p className={`text-xs`}>
              {isActive ? 'Online' : 'Offline'}
            </p>
          </div>
          <div className='flex gap-1'>
            <button onClick={(e) => {e.stopPropagation(); add()}}>+</button>
            <button onClick={(e) => {e.stopPropagation(); remove()}}>-</button>
          </div>
          {msgCount >=1 && (
            <div className='absolute right-0 border-1 border-red-300 rounded-full w-4 h-4 bg-red-300 text-xs flex items-center justify-center font-semibold' value={msgCount} onClick={(e) => {e.stopPropagation(); handleUnseenMsg(e)}}>
            {msgCount}
          </div>
          )}
        </div>
    </div>
  )
}

export default User
