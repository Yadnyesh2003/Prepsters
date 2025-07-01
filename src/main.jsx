import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LoaderProvider } from './context/ThemeContext'
import { AppContextProvider } from './context/AppContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext';


createRoot(document.getElementById('root')).render(
  <LoaderProvider>
    <BrowserRouter>
      <AuthProvider>
        <AppContextProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </AppContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </LoaderProvider>
)
