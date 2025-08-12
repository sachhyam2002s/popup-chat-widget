const io = require('socket.io')(3000, {
    path: "/custom-socket",
    cors:{
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"]
    }
})

let groups = {}

io.on('connect', socket => {
    console.log(`${socket.id} connected`); 
    //create group
    socket.on('create-group', (groupName, adminName) => {        
        if (!groups[groupName]) {
            groups[groupName] = {admin: socket.id, adminName, members: [{socketId:socket.id, username: adminName}], requests:[]}
            socket.join(groupName)
            socket.emit('group-created', {groupName, adminName});
            console.log("group and admin", {groupName, adminName});
            
        }else{
            socket.emit('group-exists', groupName);
        }
    })
    //join group
    socket.on('join-group', (groupName, username) => {
        const group = groups[groupName];
        if (group) {
            const request = {socketId: socket.id, username};
            if (!group.requests.some(req => req.socketId ===socket.id)) {
                group.requests.push(request);
                io.to(group.admin).emit('join-request', {socketId: socket.id, username, groupName})
            }else{
                socket.emit('join-request-already-sent', groupName)
            }
        }else{
            socket.emit('group-not-found', groupName);
        }
    }) 
    //acccept request
    socket.on('accept-request', (groupName, requestSocketId) => {
        const group = groups[groupName];
        if (group) {
            const request = group.requests.find(req => req.socketId === requestSocketId)
            if (request) {
                group.members.push({ socketId: requestSocketId, username: request.username })
                group.requests = group.requests.filter(req => req.socketId !== requestSocketId);
                const requesterSocket = io.sockets.sockets.get(requestSocketId);
                const adminName = group.adminName;
                if (requesterSocket) {
                    requesterSocket.join(groupName);
                    io.to(requestSocketId).emit('request-accepted', {groupName, adminName});
                }
                group.members.map(socketId => {
                    if (socketId === group.admin) {
                        return group.adminName
                    }
                    const req = group.requests.find(r => r.socketId === socketId)
                    return req ? req.username : 'Unknown'
                })
                io.to(groupName).emit('group-updated', {
                    groupName,
                    members: group.members.map(m => m.username),
                    admin: group.admin,
                    adminName: group.adminName
                });
            }
        }
    })
    //reject request
    socket.on('reject-request', (groupName, requestSocketId) => {
        const group = groups[groupName];
        if (group) {
            group.requests = group.requests.filter(req => req.socketId !== requestSocketId);
            io.to(requestSocketId).emit('request-rejected', groupName);
        }
    })
    //send message
    socket.on('send-message', (newMsg, group) => {
        if (!group) {
            socket.broadcast.emit('receive-message', newMsg)
        }else{
            io.to(group).emit('receive-message', newMsg)
        }
    }) 
    //seen message
    socket.on('seen-message', (group, msgId) => {
      socket.to(group).emit('seen-message', group, msgId);
    });
    //typing indicators
    socket.on('typing', (group, senderId) => {
        socket.to(group).emit('typing', group, senderId)
    })
    socket.on('stopTyping', (group, senderId) => {
        socket.to(group).emit('stopTyping', group, senderId)
    })

    //disconnection
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        for (const groupName in groups) {
            const group = groups[groupName];
            group.members = group.members.filter(member => member !== socket.id);
            group.requests = group.requests.filter(req => req.socketId !== socket.id);
            if (group.admin === socket.id) {
                io.to(group.admin).emit('group-deleted', {groupName, adminName: group.adminName});
                delete groups[groupName];
            }
        }
    })
})