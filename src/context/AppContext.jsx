import React, { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const [isGhost, setisGhost] = useState(true)

    const navigate = useNavigate()

    const value = {
        isGhost, setisGhost, navigate
    }

    return(
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
}