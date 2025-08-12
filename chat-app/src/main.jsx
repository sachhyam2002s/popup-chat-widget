import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ChatBoxContextProvider } from './Contexts/ChatBoxContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChatBoxContextProvider>
        <App />
        </ChatBoxContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
