import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a3a5c',
          color: '#fff',
          fontFamily: 'IBM Plex Mono',
          fontSize: '0.8rem'
        }
      }}
    />
  </React.StrictMode>
)