import {ArrowLeft, User, X} from 'lucide-react'
import {useChatBox} from '../Contexts/ChatBoxContext'

function ChatInfo(props) {
  const { scrollRef, isActive, setIsActive, groupMembers, adminName } = useChatBox()

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
            <button onClick={() => setIsActive(prev => !prev)} className={`absolute right-0 bottom-0 w-4 md:w-3 h-4 md:h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}/>
            </div>
            <h1 className='text-2xl md:text-lg font-bold w-full '>
            {props.groupName}
            </h1>
            <div  className='flex gap-2 pr-1 items-center'>
            <button onClick={props.onClose} className='cursor-pointer'>
                <X className='w-6 h-6'/>
            </button>
            </div>
        </div>

        <div className='p-1 bg-white h-full flex flex-col overflow-y-auto scrollbar-hide mx-1 mb-1 rounded-2xl'>
          <p className='text-xl text-gray-600 font-semibold text-center mb-1'>Group Members</p>
          <div ref={scrollRef} className='flex flex-col gap-1 bg-blue-100 w-full h-full rounded-xl shadow p-2 '>
            {groupMembers.length === 0 ? (
              <p>No members yet.</p>
            ) : (
              groupMembers.map((member, i) => (
                <div key={i} className='flex p-2 md:p-1 gap-2 rounded-lg items-center bg-blue-50 cursor-pointer'>
                  <div className='relative'>
                    <div className='flex bg-gray-500 text-white rounded-full w-10 h-10 md:w-8 md:h-8 items-center justify-center '>
                      <User className='w-5 h-5'/>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'} border-2 border-gray-700`}></div>
                  </div>
                  <div className='flex w-full relative items-center'>
                    <div className='w-[80%]'>
                      <p className={`text-md font-semibold `}>{member}</p>
                      <p className={`text-xs`}>
                        {member === adminName ? 'Admin' : 'Member'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  )
}

export default ChatInfo
