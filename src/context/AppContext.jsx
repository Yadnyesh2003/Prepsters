import React, { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit, analytics, logEvent, setUserId, setUserProperties } from '../config/firebase'; 
import { useAuth } from './AuthContext';



export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [faqDataLatest, setFaqDataLatest] = useState([]);
    const [pyqDataLatest, setPYQDataLatest] = useState([]);
    const [notesDataLatest, setNotesDataLatest] = useState([]);
    const location = useLocation();


/*****************************************************************************************************************************/
//Google Analytics Tracker Functions

    useEffect(() => {
      if (user) {
        if(user.uid) {
          setUserId(analytics, user.uid);
          console.log("Set GA4 user_id:", user.uid);
        }
        if(user.displayName) {
          setUserProperties(analytics, {
            user_name: user.displayName,
          });
          console.log("Set GA4 user_name user property:", user.displayName);
        }
      } else {
        // Optional: clear user id when logged out
        setUserId(analytics, null);
      }
    }, [user]);



    const trackPageView = (path) => {
      const pageViewData = {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      };
      console.log("Tracking page view:", pageViewData);
      logEvent(analytics, "page_view", pageViewData);
    };

    useEffect(() => {
      trackPageView(location.pathname);
    }, [location.pathname]);

    
    const trackFilterEvent = ({
      contentType,
      filters = {},
      eventName = "filter_applied",
    }) => {
      const userName = user?.displayName || "anonymous";
      const analyticsData = {
        content_type: contentType,
        user_name: userName,
        ...filters,
      };
      console.log("Tracking filter event:", analyticsData);
      logEvent(analytics, eventName, analyticsData);
    };


    const trackPdfViewEvent = ({
      contentType,
      details = {},
      eventName = "pdf_viewed",
    }) => {
      const userName = user?.displayName || "anonymous";
    
      const analyticsData = {
        content_type: contentType,
        user_name: userName,
        ...details,  // Spread optional fields like pdf_branch, pdf_title, etc.
      };
    
      console.log("Tracking PDF view event:", analyticsData);
      logEvent(analytics, eventName, analyticsData);
    };
    
    






/*****************************************************************************************************************************/

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
            const pyqs = querySnapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            }));
            setPYQDataLatest(pyqs);
        } catch (error) {
            toast.error(`Error fetching PYQs: ${error.message}`);
        }
      };



      useEffect(() => {
        if(user){
        getFAQDataLatest();
        getPYQDataLatest();
        getNotesDataLatest();
        }
      }, [user]);
      

    const value = {
        trackPageView, trackFilterEvent, trackPdfViewEvent,
        
        navigate, toast, getFAQDataLatest, faqDataLatest, getPYQDataLatest, pyqDataLatest, 
        getNotesDataLatest, notesDataLatest
    }

    return(
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
}