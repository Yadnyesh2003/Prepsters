import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, doc, getDoc } from "../../config/firebase";
import { useEffect, useState } from 'react';
import Loader from './Loading';

const ProfileBookmarksSection = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [bookmarkDetails, setBookmarkDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) return;

            try {
                const userRef = doc(db, "Users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserData(data);
                    await fetchBookmarkTitles(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookmarkTitles = async (userData) => {
            const details = {};

            // Fetch syllabus titles
            if (userData.bookmarkedSyllabus?.length > 0) {
                details.Syllabus = await Promise.all(
                    userData.bookmarkedSyllabus.map(id => fetchDocumentTitle(id, 'Syllabus'))
                );
            }

            // Fetch PYQs titles
            if (userData.bookmarkedPYQs?.length > 0) {
                details.PYQs = await Promise.all(
                    userData.bookmarkedPYQs.map(id => fetchDocumentTitle(id, 'PYQs'))
                );
            }

            // Fetch Notes titles
            if (userData.bookmarkedNotes?.length > 0) {
                details.Notes = await Promise.all(
                    userData.bookmarkedNotes.map(id => fetchDocumentTitle(id, 'Notes'))
                );
            }

            // Fetch FAQs titles
            if (userData.bookmarkedFAQs?.length > 0) {
                details.FAQs = await Promise.all(
                    userData.bookmarkedFAQs.map(id => fetchDocumentTitle(id, 'FAQs'))
                );
            }

            setBookmarkDetails(details);
        };

        const fetchDocumentTitle = async (docId, type) => {
            try {
                let collectionName;
                let titleField;

                switch (type) {
                    case 'Syllabus':
                        collectionName = 'Syllabus';
                        titleField = 'syllabusTitle';
                        break;
                    case 'PYQs':
                        collectionName = 'PYQs';
                        titleField = 'pyqsTitle';
                        break;
                    case 'Notes':
                        collectionName = 'Notes';
                        titleField = 'notesTitle';
                        break;
                    case 'FAQs':
                        collectionName = 'FAQs';
                        titleField = 'faqsTitle';
                        break;
                    default:
                        return { id: docId, title: `Untitled ${type}` };
                }

                const docRef = doc(db, collectionName, docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    return {
                        id: docId,
                        title: docSnap.data()[titleField] || `Untitled ${type}`
                    };
                }
                return { id: docId, title: `Untitled ${type}` };
            } catch (error) {
                console.error(`Error fetching ${type} document:`, error);
                return { id: docId, title: `Untitled ${type}` };
            }
        };

        fetchUserData();
    }, [user]);

    const hasBookmarks = () => {
        if (!userData) return false;
        return (
            (userData.bookmarkedSyllabus?.length > 0) ||
            (userData.bookmarkedPYQs?.length > 0) ||
            (userData.bookmarkedNotes?.length > 0) ||
            (userData.bookmarkedFAQs?.length > 0)
        );
    };

    const handleCardClick = (tab) => {
        navigate(`/bookmarks?tab=${tab}`);
    };

    if (loading) {
        return (
            <div className="border-t border-purple-100 p-8">
                <Loader />
            </div>
        );
    }

    return (
        <div className="p-3">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Bookmarks</h2>
                {hasBookmarks() && (
                    <button
                        onClick={() => navigate('/bookmarks')}
                        className="text-purple-600 hover:text-purple-800 font-medium text-sm sm:text-base"
                    >
                        View All →
                    </button>
                )}
            </div>

            {hasBookmarks() ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Syllabus Card */}
                    {userData.bookmarkedSyllabus?.length > 0 && (
                        <div
                            onClick={() => handleCardClick('Syllabus')}
                            className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Syllabus ({userData.bookmarkedSyllabus.length})
                            </h3>
                            <div className="space-y-2">
                                {bookmarkDetails.Syllabus?.slice(0, 3).map((item, index) => (
                                    <div key={index} className="text-sm text-gray-600 truncate">
                                        {item.title}
                                    </div>
                                ))}
                                {userData.bookmarkedSyllabus.length > 3 && (
                                    <div className="text-sm text-purple-600 font-medium">
                                        +{userData.bookmarkedSyllabus.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PYQs Card */}
                    {userData.bookmarkedPYQs?.length > 0 && (
                        <div
                            onClick={() => handleCardClick('PYQs')}
                            className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                PYQs ({userData.bookmarkedPYQs.length})
                            </h3>
                            <div className="space-y-2">
                                {bookmarkDetails.PYQs?.slice(0, 3).map((item, index) => (
                                    <div key={index} className="text-sm text-gray-600 truncate">
                                        {item.title}
                                    </div>
                                ))}
                                {userData.bookmarkedPYQs.length > 3 && (
                                    <div className="text-sm text-purple-600 font-medium">
                                        +{userData.bookmarkedPYQs.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes Card */}
                    {userData.bookmarkedNotes?.length > 0 && (
                        <div
                            onClick={() => handleCardClick('Notes')}
                            className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Notes ({userData.bookmarkedNotes.length})
                            </h3>
                            <div className="space-y-2">
                                {bookmarkDetails.Notes?.slice(0, 3).map((item, index) => (
                                    <div key={index} className="text-sm text-gray-600 truncate">
                                        {item.title}
                                    </div>
                                ))}
                                {userData.bookmarkedNotes.length > 3 && (
                                    <div className="text-sm text-purple-600 font-medium">
                                        +{userData.bookmarkedNotes.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FAQs Card */}
                    {userData.bookmarkedFAQs?.length > 0 && (
                        <div
                            onClick={() => handleCardClick('FAQs')}
                            className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                FAQs ({userData.bookmarkedFAQs.length})
                            </h3>
                            <div className="space-y-2">
                                {bookmarkDetails.FAQs?.slice(0, 3).map((item, index) => (
                                    <div key={index} className="text-sm text-gray-600 truncate">
                                        {item.title}
                                    </div>
                                ))}
                                {userData.bookmarkedFAQs.length > 3 && (
                                    <div className="text-sm text-purple-600 font-medium">
                                        +{userData.bookmarkedFAQs.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="mx-auto h-24 w-24 text-purple-300 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">No bookmarks yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Save content to access it quickly here</p>
                    <button
                        onClick={() => navigate('/syllabus')}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Browse Content
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileBookmarksSection;