import {io} from 'socket.io-client'

const socket = io('http://localhost:3000', {
    path: "/custom-socket"
})

export default socket;