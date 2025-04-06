import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase'; 
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import PdfViewer from '../student/PdfViewer';
import { assets } from '../../assets/assets';

const MyPYQs = () => {
  return (
    <h1>MyPYQs - Amdin can view & edit the aded PYQs so far.</h1>
  )
}

export default MyPYQs