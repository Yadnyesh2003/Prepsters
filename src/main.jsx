import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LoaderProvider } from './context/ThemeContext'
import { AppContextProvider } from './context/AppContext.jsx'


createRoot(document.getElementById('root')).render(
  <LoaderProvider>
    <BrowserRouter>
    <AppContextProvider>
        <App />
    </AppContextProvider>
    </BrowserRouter>
  </LoaderProvider>
)
