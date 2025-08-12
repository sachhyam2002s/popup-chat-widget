import {useState, useEffect, useRef, createContext, useContext, useMemo} from 'react'
import replies from  '../quickReplies.json'
import socket from '../socket'

const ChatBoxContext = createContext(null)

export const ChatBoxContextProvider = ({children}) => {
  const [message, setMessage] = useState([])
  const [input, setInput] = useState('')
  const [groupList, setGroupList] = useState([])
  const [groupMembers, setGroupMembers] = useState([])
  const [pendingRequest, setPendingRequest] = useState([])
  const [currentGroup, setCurrentGroup] = useState('')
  const [username, setUsername] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [isEmoji, setIsEmoji] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [previewMedia, setPreviewMedia] = useState([])
  const [selectedMedia, setSelectedMedia] = useState([])
  const [previewFile, setPreviewFile] = useState([])
  const [selectedFile, setSelectedFile] = useState([])
  const [lastOwnMsgId, setLastOwnMsgId] = useState(null)
  const [optionVisible, setOptionVisible] = useState(true)
  const [isInfo, setIsInfo] = useState(false)
  
  const scrollRef = useRef(null)
  const quickReplies = replies.client  

  const date = currentTime.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})
  const day = currentTime.toLocaleDateString([], {weekday:'short'})
  const adminName = useMemo(() => groupList.find(g => g.name === currentGroup)?.admin, [groupList, currentGroup])
  
  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }
    socket.on('connect', () => {
      console.log(`Connected with id: ${socket.id}`)
    })
    socket.on('connect_error', (err) => {
      console.error(`Connection error:`, err)
    })
    socket.on('disconnect', () => {
      console.log(`Socket disonnected.`)
    })
    return () => {
      socket.off('connect')
      socket.off('connect_error')
      socket.off('disconnect')
    }
  }, [])

  const createGroup = (groupName, adminName) => {
    socket.emit('create-group', groupName, adminName)
    setCurrentGroup(groupName)
    setUsername(adminName)
    setIsAdmin(true)
    welcomeMessage()
  }
  const joinGroup = (groupName, username) => {
    socket.emit('join-group', groupName, username)
    setCurrentGroup(groupName)
    console.log(username)
    setUsername(username)
    setIsAdmin(false)
    welcomeMessage()
  }

  const welcomeMessage = () => {
    setMessage([
      {text: 'Hello! Welcome.', sender:'vendor'},
      {text: 'How can I help you?', sender:'vendor'}
    ])
  }

  const handleAcceptRequest = (socketId, username) => {    
    socket.emit('accept-request', currentGroup, socketId);
    setGroupMembers(prev => [...prev, username])
    setPendingRequest(prev => prev.filter(req => req.socketId !== socketId));
  }
  const handleRejectRequest = (socketId) => {
    socket.emit('reject-request', currentGroup, socketId);
    setPendingRequest(prev => prev.filter(req => req.socketId !== socketId));
  }

  useEffect(() => {
    socket.on('join-request', ({ socketId, username, groupName }) => {
      if (isAdmin && groupName === currentGroup) {
        setPendingRequest(prev => {
          if (!prev.some(req => req.socketId === socketId)) {
            return [...prev, { socketId, username }]
          }
          return prev
        })
      }
    });
    return () => {
      socket.off('join-request')
    }
  }, [isAdmin, currentGroup])

  useEffect(() => {
    socket.on('group-updated', ({ groupName, members, admin, adminName }) => {
      setGroupList(prev => {
        const groupExist = prev.some(g => g.name === groupName);
        if(!groupExist) {
          return [...prev, {name: groupName, admin: adminName}];
        }
        return prev.map(g => 
          g.name === groupName ? {...g, members, admin: adminName} : g
        );
      })
      if (groupName === currentGroup) {
        setGroupMembers(members)
        setIsAdmin(admin === socket.id)
      }
    })
    return () => {
      socket.off('group-updated')
    }
  }, [currentGroup])

  useEffect(() => {
    const handleRequestAccepted = ({groupName, adminName}) => {
      setNotificationMsg(`Request accepted to join ${groupName}`);
      setTimeout(() => setNotificationMsg(''), 3000);
      setCurrentGroup(groupName);
      setGroupList(prev => {
        if (!prev.some(group => group.name === groupName)) {
          return [...prev, {name: groupName, admin: adminName}];
        }
        return prev;
      })
    }
    const handleRequestRejected = (groupName) => {
      setNotificationMsg(`Request rejected to join ${groupName}`);
      setTimeout(() => setNotificationMsg(''), 3000);
      setCurrentGroup('');
    }
    const handleGroupExists = (groupName) => {
      setNotificationMsg(`Group ${groupName} already exists.`);
      setTimeout(() => setNotificationMsg(''), 3000);
    }
    const handleGroupNotFound = (groupName) => {
      setNotificationMsg(`Group ${groupName} not found.`);
      setTimeout(() => setNotificationMsg(''), 3000);
    }
    const handleJoinRequestAlreadySent = (groupName) => {
      setNotificationMsg(`You have already sent a request to join ${groupName}.`);
      setTimeout(() => setNotificationMsg(''), 3000);
    }
    const handleGroupCreated = ({groupName, adminName}) => {
      setNotificationMsg(`Group "${groupName}" created successfully.`);
      setTimeout(() => setNotificationMsg(''), 3000);
      setGroupList(prev => {
        if (!prev.some(group => group.name === groupName)) {
          return [...prev, {name: groupName, admin: adminName}]
        }
        return prev
      })
    }
    const handleGroupDeleted = ({groupName, adminName}) =>{
      setNotificationMsg(`Group "${groupName}" (admin: ${adminName}) has been deleted.`)
      setTimeout(() => setNotificationMsg(''), 3000)
      setGroupList(prev => prev.filter(group => group.name !== groupName));
      if (currentGroup === groupName) {
        setCurrentGroup(''); 
        setIsAdmin(false);
      }
    }
    socket.on('request-accepted', handleRequestAccepted);
    socket.on('request-rejected', handleRequestRejected);
    socket.on('group-exists', handleGroupExists); 
    socket.on('group-not-found', handleGroupNotFound);
    socket.on('join-request-already-sent', handleJoinRequestAlreadySent); 
    socket.on('group-created', handleGroupCreated); 
    socket.on('group-deleted', handleGroupDeleted);
    return () => {
      socket.off('request-accepted'); 
      socket.off('request-rejected');
      socket.off('group-exists');
      socket.off('group-not-found');
      socket.off('join-request-already-sent');
      socket.off('group-created');
      socket.off('group-deleted');
    }
  },[currentGroup])

  useEffect(() => {
    const handleReceiveMsg = (newMsg) => {
      if(newMsg.sender === socket.id) {
        setMessage(prev => 
          prev.map(msg => 
            msg.id === newMsg.id ? {...msg, status: 'delivered'} : msg
          )
        )
      }else{
        setMessage(prev => [...prev, {...newMsg, status:'received'}])
        if (newMsg.group === currentGroup) {
          socket.emit('seen-message', currentGroup, newMsg.id);
        }
      }
    }
    const handleSeenMsg = (group, msgId) => {
      if (group === currentGroup) {
        setMessage(prev =>
          prev.map(msg => 
            msg.id === msgId ? {...msg, status: 'seen'} : msg
          )
        )   
      }
    }
    socket.on('receive-message', handleReceiveMsg);
    socket.on('seen-message', handleSeenMsg);
    return () =>{
      socket.off('receive-message');
      socket.off('seen-message');
    }
  }, [currentGroup]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  },[message])

  useEffect(() => {
    const interval = setInterval(()=>{
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  },[])

  const sendMessage = (text) => {
    const customText = (text ?? input).trim()
    const isText = customText !== '';
    const isMedia = selectedMedia.length>0;  
    const isFile = selectedFile.length > 0;
    if (!isText && !isMedia && !isFile) return;
    if(!currentGroup){
      setNotificationMsg('Please join a group first.')
      setTimeout(() => setNotificationMsg(''), 3000)
      return; 
    }
    const newMsg = {
      id: Date.now(),
      sender: socket.id,
      senderName: username,
      group: currentGroup,
      timeStamp: Date.now(),
      status: 'sent',
    }
    if(isText){
      newMsg.text = customText
    }
    if(isMedia){
      newMsg.type = 'media'
      newMsg.media = previewMedia.map((url, i) => ({
        url,
        type: selectedMedia[i].type.startsWith('image/') ? 'image' : 'video' 
      }));
    }
    if (isFile){
      newMsg.type = 'file'
      newMsg.file = previewFile.map((url, i) => ({
        url,
        name: selectedFile[i].name,
        type: selectedFile[i].type
      }))
    }
    setMessage(prev => [...prev, newMsg])
    setLastOwnMsgId(newMsg.id)
    socket.emit('send-message', newMsg, currentGroup)
    socket.emit('stopTyping', currentGroup, socket.id);
    //resetting state
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
      if(input.trim() !== '' || selectedMedia.length > 0 || selectedFile.length > 0) {
        sendMessage();
      }
    }
  }

  const handleInputChange = (e) =>{
    const value = e.target.value
    setInput(value)
    if (socket && currentGroup) {
      if (value.trim() !== '') {
        socket.emit('typing', currentGroup, socket.id)        
      }else{
        socket.emit('stopTyping', currentGroup, socket.id) 
      }
    }    
  }

  const handleMediaChange = (e) => {
    const medias = Array.from(e.target.files || []);
    const previewmedias = medias.map(file => URL.createObjectURL(file))
    if (!medias.length) return;
    setSelectedMedia(prev => [...prev, ...medias])
    setPreviewMedia(prev => [...prev, ...previewmedias])
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previewfiles = files.map(file => URL.createObjectURL(file))
    setSelectedFile(prev => [...prev, ...files])
    setPreviewFile(prev => [...prev, ...previewfiles])
  }

  useEffect(() => {
    const handleTyping = (group, senderId) => {
      if (group === currentGroup && senderId !== socket.id) {
        setIsTyping(true)
      }
    }
    const handleStopTyping = (group, senderId) => {
      if (group === currentGroup && senderId !== socket.id) {
        setIsTyping(false)
      }
    }
    socket.on('typing', handleTyping)
    socket.on('stopTyping', handleStopTyping)
    return () => {
      socket.off('typing', handleTyping)
      socket.off('stopTyping', handleStopTyping)
    }
  }, [currentGroup, socket])

  const toggleMenu = () => setShowMenu(prev => !prev)
  const onEmojiClick = (emojiObject) => {
    setInput(prevInput => prevInput + emojiObject.emoji)
  }



  return (
    <ChatBoxContext.Provider value = {{createGroup, message, input, optionVisible, isActive, isTyping, groupList, pendingRequest, isAdmin, showMenu, previewMedia, previewFile, selectedMedia, selectedFile, date, day, scrollRef, quickReplies, toggleMenu, handleMediaChange, handleFileChange, handleAcceptRequest, handleRejectRequest, sendMessage, handleKey, handleInputChange, setPreviewMedia, setSelectedFile, setPreviewFile, setIsActive, isEmoji, setIsEmoji, onEmojiClick, socket, joinGroup, lastOwnMsgId, setGroupList, setCurrentGroup, setUsername, username, currentGroup, notificationMsg, isInfo, setIsInfo, groupMembers, adminName}}>
        {children}
    </ChatBoxContext.Provider>
  )
}

export const useChatBox = () => useContext(ChatBoxContext)

