import {SendHorizonal, User, CirclePlus, FilePlus, Image, ArrowLeft, X, File, Smile, CircleX, CheckCheck, Check, Info} from 'lucide-react'
import {useChatBox} from '../Contexts/ChatBoxContext'
import EmojiPicker from 'emoji-picker-react'
import ChatInfo from './ChatInfo';

function ChatBox(props) {
  const {
    message,
    input,
    optionVisible,
    toggleMenu,
    isActive,
    scrollRef,
    date, 
    day,
    isTyping,
    pendingRequest,
    isAdmin,
    handleAcceptRequest,
    handleRejectRequest,
    quickReplies,
    showMenu,
    selectedMedia,
    previewMedia,
    selectedFile,
    previewFile, 
    handleInputChange,
    handleKey,  
    handleMediaChange,
    handleFileChange,
    sendMessage,
    setIsActive,
    setPreviewMedia, 
    setSelectedMedia,
    setPreviewFile,
    setSelectedFile,
    isEmoji,
    setIsEmoji,
    onEmojiClick,
    socket,
    notificationMsg,
    currentGroup,
    username,
    isInfo,
    setIsInfo
  } = useChatBox();

  const chatHeaderName = currentGroup || username || props.user
  
  return (
    <div>
    <div className='fixed md:right-12 bottom-0 bg-gray-400 flex flex-col md:m-2 md:mx-5 shadow-lg h-[100svh] md:max-h-[450px] w-full md:max-w-[350px]  md:rounded-xl '>
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
          {chatHeaderName}
        </h1>
        <div  className='flex gap-2 pr-1 '>
          {isInfo ? (
            <ChatInfo onExit={() => setIsInfo(false)} onClose={props.onClose} groupName={chatHeaderName}/>
          ):(
            <button onClick={() => setIsInfo(true)}>
              <Info className='w-5 h-5 cursor-pointer' />
            </button>
          )}
          <button onClick={props.onClose} className='cursor-pointer'>
            <X className='w-6 h-6'/>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className='p-1 bg-white h-full flex flex-col gap-1 overflow-y-auto scrollbar-hide mx-1'>
        <span className='text-xs text-center'>
          {date}, {day}
        </span>
        {notificationMsg && (
          <div className='bg-blue-100 text-blue-500 text-center rounded-md mx-2 py-1'>
            {notificationMsg}
          </div>
        )}
        {message.filter(Boolean).map((msg, i) => {
          const showTime = i === 1 ||
          (i>1 &&
            msg.timeStamp &&
            message[i-1]?.timeStamp &&
            msg.timeStamp - message[i-1].timeStamp >= 120000
          ) 
          
          return(
            <div key={msg.id || i}>
              {showTime && msg.timeStamp && (
                <div className={`text-xs text-gray-500 mx-5 text-center `}>
                  {new Date(msg.timeStamp).toLocaleTimeString([], {hour:'2-digit', minute: '2-digit'})}
                </div>
              )}
              <div className={`flex ${msg.sender === socket.id ? 'justify-end' : 'justify-start'} items-end`}>
                {msg.sender !== socket.id && (
                  <div className='bg-gray-300 rounded-full flex justify-center items-center w-4 h-4'>
                    <User className='w-3 h-3'/>
                  </div>
                )}
                {msg.text && (
                  <div className='flex flex-col items-start max-w-[80%]'>
                    <span className='ml-1 text-xs text-gray-500'>{msg.sender === socket.id ? msg.senderName : '' }</span>
                    <div className={`mx-1 rounded-2xl px-2 py-1 text-lg md:text-sm  break-all whitespace-pre-wrap ${msg.sender === socket.id ? 'bg-blue-300' : 'bg-gray-300'}`}>
                      {msg.text}
                    </div>
                  </div>
                )}
                <div>
                  {Array.isArray(msg.media) && msg.media.length > 0 && (
                    <div className={`flex flex-col mx-1 ${msg.sender === socket.id ? 'items-end' : 'items-start'}`}>
                      <span className='ml-1 text-xs text-gray-500'>{msg.sender !== socket.id ? msg.senderName : '' }</span>
                      {msg.media.map((media, idx) => 
                        media.type === 'image' ? (
                          <img key={idx} src={media.url} alt="image" className={`max-w-90 md:max-w-60 max-h-90 rounded-lg mb-1 ${msg.sender === socket.id ? 'items-end' : 'items-start'}`}/>
                        ) : (
                          <video key={idx} src={media.url} alt='video' className='max-w-90 md:max-w-60 max-h-90 rounded-lg mb-1' controls/>
                        )
                      )}
                    </div>
                  )}
                  {Array.isArray(msg.file) && (
                    <div className={`flex flex-col mx-1 ${msg.sender === socket.id ? 'items-end' : 'items-start'}`}>
                      <span className='ml-1 text-xs text-gray-500'>{msg.sender !== socket.id ? msg.senderName : ''}</span>
                      {msg.file.map((file, idx) => (
                        <div key={idx} className={`flex items-center gap-1  rounded-lg px-2 py-1 mb-1 ${msg.sender === socket.id ? 'bg-blue-300' : 'bg-gray-300'}`}>
                          <File className='w-6 h-6 stroke-1 text-gray-700'/>
                          <a href={file.url} download={file.name} className='text-xs  max-w-80 md:max-w-50 break-all underline hover:text-blue-500'>
                            {file.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.sender === socket.id &&(
                  <div className='bg-gray-300 rounded-full flex justify-center items-center w-4 h-4'>
                    <User className='w-3 h-3'/>
                  </div>
                )}
              </div>
                {msg.sender === socket.id && (
                  <div className={`flex items-center gap-1 justify-end text-xs ${msg.status === 'sent' ? 'text-gray-500' : msg.status === 'seen' ? 'text-blue-600' : msg.status === 'delivered' ? 'text-gray-500' : 'text-red-500'} mx-1`}>
                    {msg.status === 'seen' && (
                      <>
                        <p>Seen</p>
                        <CheckCheck className='w-4 h-4'/>
                      </>
                    )} 
                    {msg.status === 'delivered' && (
                      <>
                        <p>Delivered</p>
                        <CheckCheck className='w-4 h-4'/>
                      </>
                    )}
                    {msg.status === 'sent' && (
                      <>
                        <p>Sent</p>
                        <Check className='w-4 h-4'/>
                      </>
                    )}
                    {msg.status === 'failed' && (
                      <>
                        <CircleX className='w-4 h-4'/>
                        <p>Message not sent.</p>
                      </>
                    )}
                  </div>
                )}
            </div>
          )
        })}
        
      </div>

      {isTyping && (
        <div className='flex items-end gap-1 p-1 bg-white mx-1'>
          <div className='w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center'><User className='w-4 h-4'/></div>
          <div className='animate-pulse bg-gray-300 rounded-full px-2 py-1 text-lg md:text-sm mb-1'>Typing...</div>
        </div>
      )}

      {optionVisible &&(
        <div className='flex flex-wrap gap-1 mx-1 p-2 justify-center bg-white'>
          {quickReplies.map((reply, idx) => (
            <button key={idx} onClick={() => sendMessage(reply)} className='bg-blue-200 text-lg md:text-sm rounded-2xl px-2 p-1 hover:bg-blue-300 cursor-pointer'>
              {reply}
            </button>
          ))}
        </div>
      )}

      {isAdmin && pendingRequest.map(req => (
        <div key={req.socketId} className='flex  flex-col mx-1 items-center justify-center rounded-3xl mt-1  text-white p-2 gap-1 '>
          <span className='w-60'>{req.username} has requested to join the chat.</span>
          <div className='flex items-center gap-2 '>
            <button className='bg-blue-400 p-1 px-2 rounded-full cursor-pointer' onClick={() => handleAcceptRequest(req.socketId, req.username)}>Accept</button>
            <button className='bg-red-400 p-1 px-2 rounded-full cursor-pointer' onClick={() => handleRejectRequest(req.socketId)}>Cancel</button>
          </div>
        </div>
      ))}

      {Array.isArray(previewMedia) && previewMedia.length > 0 && (
        <div className='flex flex-wrap mx-1 bg-white'>
          {previewMedia.map((media, idx) => (
            <div key={idx} className='relative w-20 h-15 m-1'>
              {selectedMedia[idx] && selectedMedia[idx].type.startsWith('image/') ? (
                <img src={media} alt="image preview" className='w-full h-full object-cover rounded'/>
              ):(
                <video src={media} alt='video preview' className='w-full h-full object-cover rounded'></video>
              )}
              <button className='absolute right-0 top-0' 
                onClick={() => {
                  setPreviewMedia(prev => prev.filter((_, i) => i !== idx))
                  setSelectedMedia(prev => prev.filter((_, i) => i !== idx))
                  }}>
                <X className='w-4 h-4 text-white cursor-pointer hover:text-red-500' />
              </button>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(previewFile) && previewFile.length > 0 && (
        <div className='flex flex-wrap mx-1 bg-white'>
          {previewFile.map((file, idx) => (
            <div key={idx} className='relative flex flex-wrap md:w-40 m-1 bg-gray-200 p-1 rounded'>
              <File className='w-6 h-6 text-gray-600 '/>
              {selectedFile[idx] && (
                <a className='text-xs break-all underline text-center'>
                  {selectedFile[idx].name}
                </a>
              )}
              <button className='absolute right-0 top-0' 
                onClick={() => {
                  setPreviewFile(prev => prev.filter((_, i) => i !== idx))
                  setSelectedFile(prev => prev.filter((_, i) => i !== idx))
                  }}>
                <X className='w-4 h-4 text-black cursor-pointer hover:text-red-500' />
              </button>
            </div>
          ))}
        </div>
      )}

      {isEmoji && (
        <div className='absolute left-2 bottom-14 md:bottom-12 bg-gray-200 p-1 rounded-lg shadow-inner '>
          <EmojiPicker onEmojiClick={onEmojiClick} className='md:max-w-[250px] h-[50vh] md:max-h-[40vh]'/>
        </div>
      )}

      <div className='flex gap-1 m-1'>
          <div className='rounded-lg bg-white w-full overflow-hidden flex p-1'>
            <button onClick={toggleMenu}>
              <CirclePlus className='w-7 h-7 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-blue-500'/>
            </button>
             {showMenu && (
              <div className='mx-1 flex items-center gap-2 md:gap-1 bg-white text-gray-600'>
                <label htmlFor='fileInput'>
                  <FilePlus className='w-6 h-6 md:w-5 md:h-5 cursor-pointer hover:text-blue-500'/>
                </label>
                <input className='hidden' type="file" multiple id='fileInput' onChange={handleFileChange}/>

                <label htmlFor="media">
                  <Image className='w-6 h-6 md:w-5 md:h-5 cursor-pointer hover:text-blue-500'/>
                </label>
                <input className='hidden' type="file" id='media' accept='image/*,video/*' multiple onChange={handleMediaChange}/>

                <label htmlFor="emoji">
                  <Smile onClick={() => setIsEmoji(!isEmoji)} className='w-6 h-6 md:w-5 md:h-5 cursor-pointer hover:text-blue-500'/>
                </label>
              </div>
             )}
            <textarea rows={1} placeholder='Type here...' type='text' className='p-1 w-full text-lg md:text-sm focus:outline-none bg-white resize-none overflow-y-auto scrollbar-hide' value={input} onChange={handleInputChange} onKeyDown={handleKey}/>
            <button onClick={() => sendMessage()}>
              <SendHorizonal className='w-7 h-7 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-blue-600'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
