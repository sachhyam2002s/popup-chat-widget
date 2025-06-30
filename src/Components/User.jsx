import {User2} from 'lucide-react'
import { useState } from 'react';

function User(props) {
    const [isActive, setIsActive] = useState(true)
  return (
    <div onClick={props.onClick} className='flex p-2 md:p-1 gap-2 items-center bg-blue-50 rounded-lg cursor-pointer'>
        <div className='relative'>
            <div className='flex bg-gray-500 text-white rounded-full w-12 h-12 md:w-8 md:h-8 items-center justify-center '>
                <User2 className='w-5 h-5'/>
            </div>
          <button onClick={(e) => {e.stopPropagation(); setIsActive(prev => !prev)}} className={`absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-gray-700`}></button>
        </div>
        <div className='flex flex-col w-full'>
            <p className='text-md font-semibold'>{props.username}</p>
            <p className='text-xs'>Latest message</p>
        </div>
    </div>
  )
}

export default User
