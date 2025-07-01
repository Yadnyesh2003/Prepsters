import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useUserSync } from '../hooks/useUserSync';



export const AppContext = createContext()

export const AppContextProvider = (props) => {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [faqDataLatest, setFaqDataLatest] = useState([]);
  const [pyqDataLatest, setPYQDataLatest] = useState([]);
  const [notesDataLatest, setNotesDataLatest] = useState([]);



  const getNotesDataLatest = async () => {
    try {
      const notesQuery = query(
        collection(db, 'Notes'),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      const querySnapshot = await getDocs(notesQuery);
      const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotesDataLatest(notes);
    } catch (error) {
      toast.error(`Error fetching Notes: ${error.message}`);
    }
  };

  const getFAQDataLatest = async () => {
    try {
      const faqQuery = query(
        collection(db, 'FAQs'),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      const querySnapshot = await getDocs(faqQuery);
      const faqs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaqDataLatest(faqs);
    } catch (error) {
      toast.error(`Error fetching FAQs: ${error.message}`);
    }
  };

  const getPYQDataLatest = async () => {
    try {
      const pyqQuery = query(
        collection(db, 'PYQs'),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      const querySnapshot = await getDocs(pyqQuery);
      const pyqs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPYQDataLatest(pyqs);
    } catch (error) {
      toast.error(`Error fetching PYQs: ${error.message}`);
    }
  };



  useEffect(() => {
    if (user) {
      getFAQDataLatest();
      getPYQDataLatest();
      getNotesDataLatest();
    }
  }, [user]);


  const value = {
    navigate, toast, getFAQDataLatest, faqDataLatest, getPYQDataLatest, pyqDataLatest,
    getNotesDataLatest, notesDataLatest
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}