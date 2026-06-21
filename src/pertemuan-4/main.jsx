import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import WisataApp from './WisataApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WisataApp />
  </StrictMode>,
)
