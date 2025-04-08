import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LoaderProvider } from './context/ThemeContext'


createRoot(document.getElementById('root')).render(
  <LoaderProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LoaderProvider>,
)
