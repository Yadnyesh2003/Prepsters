import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Loader from '../../components/student/Loading';
import { AppContext } from "../../context/AppContext";
import { useAuth } from '../../context/AuthContext';
import { db, doc, getDoc, updateDoc } from "../../config/firebase";
import PdfViewer from "../../components/student/PdfViewer";

const Bookmarks = () => {
    const [activeTab, setActiveTab] = useState('Syllabus');
    const [bookmarkedItems, setBookmarkedItems] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const { toast, trackPdfViewEvent } = useContext(AppContext);

    const tabs = ['Syllabus', 'PYQs', 'Notes', 'FAQs'];

    // Fetch bookmarked items based on active tab
    useEffect(() => {
        const fetchBookmarkedItems = async () => {
            try {
                setLoading(true);
                const userId = user?.uid;
                if (!userId) {
                    setLoading(false);
                    return toast.error("You must be logged in to view bookmarks");
                }

                const userRef = doc(db, "Users", userId);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    setLoading(false);
                    return toast.error("User not found");
                }

                const userData = userSnap.data();
                const bookmarkField = `bookmarked${activeTab}`;
                const bookmarkedIds = userData[bookmarkField] || [];

                if (bookmarkedIds.length === 0) {
                    setBookmarkedItems([]);
                    setLoading(false);
                    return;
                }

                // Fetch details for each bookmarked item
                const collectionName = `${activeTab}`;
                const items = [];

                for (const id of bookmarkedIds) {
                    const itemRef = doc(db, collectionName, id);
                    const itemSnap = await getDoc(itemRef);
                    if (itemSnap.exists()) {
                        items.push({
                            id: itemSnap.id,
                            ...itemSnap.data(),
                            isBookmarked: true
                        });
                    }
                }

                setBookmarkedItems(items);
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching bookmarks: " + error.message);
                setLoading(false);
            }
        };

        fetchBookmarkedItems();
    }, [activeTab, user, toast]);

    const openPdfViewer = (url, item) => {
        setPdfUrl(url);
        trackPdfViewEvent({
            contentType: activeTab,
            details: {
                pdf_branch: item[`${activeTab.toLowerCase()}Category`]?.branch || "unknown",
                pdf_institution: item[`${activeTab.toLowerCase()}Category`]?.institution || "unknown",
                pdf_year: item[`${activeTab.toLowerCase()}Category`]?.year || "unknown",
                pdf_title: item[`${activeTab.toLowerCase()}Title`] || item.title || "untitled",
            }
        });
    };

    const closePdfViewer = () => {
        setPdfUrl(null);
    };

    const handleBookmarkToggle = async (itemId) => {
        try {
            const userId = user?.uid;
            if (!userId) return toast.error("You must be logged in to bookmark");

            const userRef = doc(db, "Users", userId);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) return toast.error("User not found");

            const userData = userSnap.data();
            const bookmarkField = `bookmarked${activeTab}`;
            const bookmarkedItems = userData[bookmarkField] || [];

            const isBookmarked = bookmarkedItems.includes(itemId);

            if (isBookmarked) {
                toast.custom(
                    (t) => (
                        <div
                            className={`${t.visible ? "animate-enter" : "animate-leave"
                                } max-w-xs w-auto bg-red-100 text-red-800 shadow-lg rounded-lg pointer-events-auto flex flex-col items-center justify-center px-6 py-4`}
                        >
                            <p className="text-sm font-medium">Remove from bookmarks?</p>
                            <div className="flex gap-4 mt-2">
                                <button
                                    onClick={async () => {
                                        const updatedBookmarks = bookmarkedItems.filter(
                                            (id) => id !== itemId
                                        );
                                        await updateDoc(userRef, { [bookmarkField]: updatedBookmarks });
                                        toast.success("Removed from bookmarks!", {
                                            autoClose: 2000, // disappears after 2 seconds
                                        });
                                        setBookmarkedItems(prev => prev.filter(item => item.id !== itemId));
                                        toast.dismiss(t.id);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ),
                    { duration: Infinity, position: "top-right" }
                );
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleClearAllBookmarks = () => {
        toast.custom(
            (t) => (
                <div
                    className={`${t.visible ? "animate-enter" : "animate-leave"
                        } max-w-xs w-auto bg-red-100 text-red-800 shadow-lg rounded-lg pointer-events-auto flex flex-col items-center justify-center px-6 py-4`}
                >
                    <p className="text-sm font-medium">Clear all {activeTab} bookmarks?</p>
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={async () => {
                                try {
                                    const userId = user?.uid;
                                    if (!userId) return toast.error("You must be logged in");

                                    const userRef = doc(db, "Users", userId);
                                    await updateDoc(userRef, { [`bookmarked${activeTab}`]: [] });
                                    setBookmarkedItems([]);
                                    toast.success(`All ${activeTab} bookmarks cleared!`);
                                    toast.dismiss(t.id);
                                } catch (error) {
                                    toast.error(error.message);
                                }
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity, position: "top-right" }
        );
    };

    const renderSyllabusCard = (item) => (
        <>
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-indigo-800">
                {item.syllabusTitle}
            </h2>
            {item.syllabusCategory?.academicYear && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Academic Year: {item.syllabusCategory.academicYear}
                </p>
            )}
            {item.syllabusCategory?.branch && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Branch: {item.syllabusCategory.branch}
                </p>
            )}
            {item.syllabusCategory?.institution && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Institution: {item.syllabusCategory.institution}
                </p>
            )}
            {item.syllabusCategory?.year && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Year: {item.syllabusCategory.year}
                </p>
            )}
            <div className="mt-2 mb-1 flex left">
                <button
                    onClick={() => openPdfViewer(item.syllabusLink, item)}
                    className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                >
                    <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                    View Syllabus
                </button>
            </div>
        </>
    );

    const renderPYQsCard = (item) => (
        <>
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-indigo-800">
                {item.pyqsTitle}
            </h2>
            {item.pyqsCategory?.academicYear && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Academic Year: {item.pyqsCategory.academicYear}
                </p>
            )}
            {item.pyqsCategory?.branch && item.pyqsCategory.branch.length > 0 && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Branch: {item.pyqsCategory.branch.join(", ")}
                </p>
            )}
            {item.pyqsCategory?.institution && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Institution: {item.pyqsCategory.institution}
                </p>
            )}
            {item.pyqsCategory?.subjectName && item.pyqsCategory.subjectName.length > 0 && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Subject: {item.pyqsCategory.subjectName.join(", ")}
                </p>
            )}
            {item.pyqsCategory?.year && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Year: {item.pyqsCategory.year}
                </p>
            )}
            <div className="mt-2 mb-1 flex left">
                <button
                    onClick={() => openPdfViewer(item.pyqsLink, item)}
                    className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                >
                    <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                    View PYQ
                </button>
            </div>
        </>
    );

    const renderNotesCard = (item) => (
        <>
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-indigo-800">
                {item.notesTitle}
            </h2>
            {item.notesCategory?.branch && item.notesCategory.branch.length > 0 && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Branch: {item.notesCategory.branch.join(", ")}
                </p>
            )}
            {item.notesCategory?.subjectName && item.notesCategory.subjectName.length > 0 && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Subject: {item.notesCategory.subjectName.join(", ")}
                </p>
            )}
            {item.notesCategory?.year && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Year: {item.notesCategory.year}
                </p>
            )}
            {item.notesRatings && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Rating: {calculateAverageRating(item.notesRatings)}/5
                </p>
            )}
            <div className="mt-2 mb-1 flex left">
                <button
                    onClick={() => openPdfViewer(item.notesLink, item)}
                    className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                >
                    <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                    View Notes
                </button>
            </div>
        </>
    );

    const renderFAQsCard = (item) => (
        <>
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-indigo-800">
                {item.faqsTitle}
            </h2>
            {item.faqsCategory?.branch && item.faqsCategory.branch.length > 0 && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Branch: {item.faqsCategory.branch.join(", ")}
                </p>
            )}
            {item.faqsCategory?.institution && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Institution: {item.faqsCategory.institution}
                </p>
            )}
            {item.faqsCategory?.subjectName && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Subject: {item.faqsCategory.subjectName}
                </p>
            )}
            {item.faqsCategory?.year && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Year: {item.faqsCategory.year}
                </p>
            )}
            {item.faqsRatings && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Rating: {calculateAverageRating(item.faqsRatings)}/5
                </p>
            )}
            <div className="mt-2 mb-1 flex left">
                <button
                    onClick={() => openPdfViewer(item.faqsLink, item)}
                    className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                >
                    <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                    View FAQs
                </button>
            </div>
        </>
    );

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / ratings.length).toFixed(1);
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">My Bookmarks</h1>

                {/* Tabs Navigation */}
                <div className="flex gap-3 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab
                                ? 'bg-white text-purple-700 shadow-md'
                                : 'bg-purple-700 text-white hover:bg-purple-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Clear All Button */}
                {bookmarkedItems.length > 0 && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleClearAllBookmarks}
                            className="text-white px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition"
                        >
                            Clear All {activeTab} Bookmarks
                        </button>
                    </div>
                )}

                {/* Bookmarks List */}
                <div className="space-y-4 ">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <Loader />
                        </div>
                    ) : bookmarkedItems.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg shadow">
                            <p className="text-gray-600 text-lg">
                                No {activeTab} bookmarks found
                            </p>
                        </div>
                    ) : (
                        bookmarkedItems.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 bg-gray-100 mb-2 flex flex-col items-start border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100"
                            >
                                {/* First Row: Content + Bookmark Button */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex-1">
                                        {activeTab === 'Syllabus' && renderSyllabusCard(item)}
                                        {activeTab === 'PYQs' && renderPYQsCard(item)}
                                        {activeTab === 'Notes' && renderNotesCard(item)}
                                        {activeTab === 'FAQs' && renderFAQsCard(item)}
                                    </div>
                                    <button onClick={() => handleBookmarkToggle(item.id)}>
                                        <img
                                            src={assets.bookmark_done}
                                            alt="bookmark"
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
            </div>
        </div>
    );
};

export default Bookmarks;