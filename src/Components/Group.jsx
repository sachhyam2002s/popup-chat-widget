import {useState} from 'react'
import {User2} from 'lucide-react'
import {useChatBox} from '../Contexts/ChatBoxContext'


function Group(props) {
  // const { isActive, setIsActive } = useChatBox()
    const [isActive, setIsActive] = useState(false)
    const [msgCount, setMsgCount] = useState(0)
    const [isUnseenMsg, setIsUnseenMsg] = useState(false) 

    const add = () => {
        setMsgCount(msgCount + 1)
        setIsUnseenMsg(true)
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
      e.stopPropagation()
      setMsgCount(0)
      setIsUnseenMsg(false)
    }

    return (
        <div onClick={props.onClick} className='flex p-2 md:p-1 gap-2 rounded-lg items-center bg-blue-50 cursor-pointer'>
            <div className='relative'>
                <div className='flex bg-gray-500 text-white rounded-full w-12 h-12 md:w-10 md:h-10 items-center justify-center '>
                    <User2 className='w-5 h-5'/>
                </div>
              <button onClick={(e) => {e.stopPropagation(); setIsActive(prev => !prev)}} className={`absolute bottom-0 right-0 w-4 h-4 md:w-3 md:h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-gray-700`}></button>
            </div>
            <div className='flex w-full relative items-center'>
              <div className='w-[80%]'>
                <p className={`text-md font-semibold ${isUnseenMsg ? 'text-blue-500': 'text-black'}`}>{props.group}</p>
                <span className='text-xs text-gray-500'>Admin: {props.admin}</span>
              </div>
              <div className='flex gap-1 ml-2'>
                <button onClick={(e) => {e.stopPropagation(); add()}}>+</button>
                <button onClick={(e) => {e.stopPropagation(); remove()}}>-</button>
              </div>
              {msgCount >=1 && (
                <div className='absolute right-0 border-1 border-red-300 rounded-full w-4 h-4 bg-red-300 text-xs flex items-center justify-center font-semibold' onClick={(e) => {e.stopPropagation(); handleUnseenMsg(e)}}>
                  {msgCount}
                </div>
              )}
            </div>
        </div>
    )
}

export default Group
