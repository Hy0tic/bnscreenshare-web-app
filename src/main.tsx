import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./index.css";

import { SignalRProvider } from './components/SignalR/SignalRContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SignalRProvider>
      <App/>
    </SignalRProvider>
  </React.StrictMode>,
)
