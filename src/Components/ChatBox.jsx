import {Phone, Video, Info, SendHorizonal, User, CirclePlus, FilePlus, Image, ArrowLeft, X, File, Smile,} from 'lucide-react'
import {useChatBox} from '../Contexts/ChatBoxContext'
import EmojiPicker from 'emoji-picker-react'


function ChatBox(props) {
  const {
    message,
    input,
    optionVisible,
    toggleMenu,
    isActive,
    scrollRef,
    time,
    date, 
    day,
    isTyping,
    quickReplies,
    previewMedia,
    showMenu,
    selectedMedia,
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
    onEmojiClick
  } = useChatBox();

  return (
    <>
    <div className='fixed md:right-12 bottom-0 bg-gray-400 flex flex-col md:m-2 md:mx-5 shadow-lg h-[100svh] md:max-h-[450px] w-full md:max-w-[350px]  md:rounded-xl '>
      <div className='flex items-center p-2 gap-2'>
        <button onClick={props.onExit}><ArrowLeft className='w-6 h-6 cursor-pointer'/></button>
        <div className="relative">
          <div className="w-12 h-12 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className='w-6 h-6'/>
          </div>
          <button onClick={() => setIsActive(active => !active)} className={`absolute right-0 bottom-0 w-4 md:w-3 h-4 md:h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></button>
        </div>
        <h1 className='text-2xl md:text-lg font-bold w-full '>
          {props.title}Vendor
        </h1>
        <div  className='flex gap-2 pr-1 cursor-pointer'>
          <Phone className='w-7 h-7 md:w-5 md:h-5'/>
          <Video className='w-7 h-7 md:w-5 md:h-5'/>
          <Info className='w-7 h-7 md:w-5 md:h-5'/>
          <button onClick={props.onClose} className='cursor-pointer'>
            <X className='w-6 h-6'/>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className='p-1 bg-white h-full flex flex-col gap-1 overflow-y-auto scrollbar-hide mx-1'>
        <span className='text-xs text-center'>
          {time}, {date}, {day}
        </span>
        {message.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'} items-end gap-1`}>
            {msg.sender === 'vendor' && (
              <div className='bg-gray-300 rounded-full flex justify-center items-center w-4 h-4'>
                <User className='w-3 h-3'/>
              </div>
            )}
            {/* <div className='flex flex-wrap gap-1'> */}
            {msg.text && (
              <div className={`rounded-2xl px-2 py-1 text-lg md:text-sm max-w-[80%] break-words whitespace-pre-wrap mb-1 ${msg.sender === 'client' ? 'bg-blue-300' : 'bg-gray-300'}`}>
                {msg.text}
              </div>
            )}
            <div>
              {Array.isArray(msg.media) && msg.media.map((media, idx) => (
                media.type === 'image' ? (
                <img key={idx} src={media.url} alt="image" className='max-w-90 md:max-w-60 max-h-90 rounded-lg mb-1'/>
              ) : (
                <video key={idx} src={media.url} alt='video' className='max-w-90 md:max-w-60 max-h-90 rounded-lg mb-1'/>
              )
              ))}
              {Array.isArray(msg.file) && (
                <div className='flex items-end flex-col gap-1 '>
                  {msg.file.map((file, idx) => (
                    <div key={idx} className='flex items-center gap-1 bg-gray-300 rounded-lg px-2 py-1'>
                      <File className='w-6 h-6 stroke-1 text-gray-700'/>
                      <a href={file.url} download={file.name} className='text-xs break-all underline hover:text-blue-500'>
                        {file.name}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* </div> */}
            {msg.sender === 'client' &&(
              <div className='bg-gray-300 rounded-full flex justify-center items-center w-4 h-4'><User className='w-3 h-3'/></div>
            )}
          </div>
        ))}
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
            <button key={idx} onClick={() => sendMessage(reply)} className='bg-blue-200 text-lg md:text-sm rounded-2xl px-2 p-1 hover:bg-blue-300'>
              {reply}
            </button>
          ))}
        </div>
      )}

      {Array.isArray(previewMedia) && previewMedia.length > 0 && (
        <div className='flex flex-wrap mx-1 bg-white'>
          {previewMedia.map((media, idx) => (
            <div key={idx} className='relative w-20 h-15 m-1'>
              {selectedMedia[idx] && selectedMedia[idx].type.startsWith('image/') ? (
                <img src={media} alt="preview" className='w-full h-full object-cover rounded'/>
              ):(
                <video src={media} alt='preview' className='w-full h-full object-cover rounded'></video>
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
        <div className='absolute left-4 md:left-2 bottom-15 md:bottom-12 bg-gray-200 p-1 rounded-lg shadow-inner '>
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
    </>
  )
}

export default ChatBox
