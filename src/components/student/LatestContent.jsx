import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
// import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import PdfViewer from './PdfViewer';

const LatestContent = () => {
    const { notesDataLatest, faqDataLatest, pyqDataLatest } = useContext(AppContext);
    const { user } = useAuth();
    const [pdfUrl, setPdfUrl] = useState(null);

    const openPdfViewer = (url) => {
        setPdfUrl(url);
        console.log("URL", url);
    }
    const closePdfViewer = () => setPdfUrl(null);

    const renderCards = (data, type) => {
        if (!Array.isArray(data)) return null;

        return data.map((item, idx) => {
            const title = item[`${type.toLowerCase()}Title`] || 'Untitled';
            const link = item[`${type.toLowerCase()}Link`] || '#';
            const contributor = item.contributorName || 'Unknown';
            const category = item[`${type.toLowerCase()}Category`] || {};

            return (
                <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex flex-col justify-between h-full overflow-hidden"
                >
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <h4 className="text-base font-semibold text-gray-800 line-clamp-2">{title}</h4>
                        <p className="text-xs text-gray-600 truncate">Contributed By: {contributor}</p>

                        {category.branch && (
                            <p className="text-xs text-gray-500 truncate">
                                Branch: {Array.isArray(category.branch) ? category.branch.join(', ') : category.branch}
                            </p>
                        )}
                        {category.subjectName && (
                            <p className="text-xs text-gray-500 truncate">
                                Subject: {Array.isArray(category.subjectName) ? category.subjectName.join(', ') : category.subjectName}
                            </p>
                        )}
                        {category.year && <p className="text-xs text-gray-500 truncate">Year: {category.year}</p>}
                        {category.institution && <p className="text-xs text-gray-500 truncate">Institution: {category.institution}</p>}
                    </div>

                    <button
                        type="button"
                        onClick={() => openPdfViewer(link)}
                        className="mt-3 inline-flex items-center justify-center bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-indigo-700 transition"
                    >
                        <img src={assets.view_data} alt="view" className="w-4 h-4 mr-2" />
                        View
                    </button>

                </motion.div>
            );
        });
    };

    return user ? (
        <section className="relative w-full">
            <div className="px-4 py-8 w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Check out our Latest Study Resources!</h2>

                {/* NOTES */}
                <div className="mt-8">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="text-xl font-semibold mb-6 text-gray-800"
                    >
                        Recently Added Notes
                    </motion.h3>
                    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                        {renderCards(notesDataLatest, 'Notes')}
                    </div>
                </div>

                {/* FAQs */}
                <div className="mt-12">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="text-xl font-semibold mb-6 text-gray-800"
                    >
                        Recently Added FAQs
                    </motion.h3>
                    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                        {renderCards(faqDataLatest, 'Faqs')}
                    </div>
                </div>

                {/* PYQs */}
                <div className="mt-12">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="text-xl font-semibold mb-6 text-gray-800"
                    >
                        Recently Added PYQs
                    </motion.h3>
                    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                        {renderCards(pyqDataLatest, 'Pyqs')}
                    </div>
                </div>
                {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
            </div>
        </section>
    ) : null;
};

export default LatestContent;
