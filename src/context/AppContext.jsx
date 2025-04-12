import React, { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const navigate = useNavigate()

    const value = {
        navigate, toast
    }

    return(
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
}