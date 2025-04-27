import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import PdfViewer from './PdfViewer';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const LatestContent = () => {
    const { notesDataLatest, faqDataLatest, pyqDataLatest } = useContext(AppContext);
    const [pdfUrl, setPdfUrl] = useState(null);
    const { user } = useAuth();

    const openPdfViewer = (url) => setPdfUrl(url);
    const closePdfViewer = () => setPdfUrl(null);

    const renderCards = (data, type) => {
        if (!Array.isArray(data)) return null;

        return data.map((item, idx) => {
            const title = item[`${type.toLowerCase()}Title`];
            const link = item[`${type.toLowerCase()}Link`];
            const contributor = item.contributorName;
            const category = item[`${type.toLowerCase()}Category`] || {};

            return (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    key={idx}
                    className="bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full hover:shadow-indigo-500 hover:bg-indigo-100 transform transition-transform duration-300 hover:scale-105"
                >
                    <div>
                        <h4 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-gray-800">{title}</h4>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700">Contributed By: {contributor}</p>

                        {category.branch && (
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 truncate overflow-hidden whitespace-nowrap">
                            Branch: {Array.isArray(category.branch) ? category.branch.join(', ') : category.branch}
                            </p>
                        )}

                        {category.subjectName && (
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 truncate overflow-hidden whitespace-nowrap">
                            Subject: {Array.isArray(category.subjectName) ? category.subjectName.join(', ') : category.subjectName}
                            </p>
                        )}

                        {category.year && (
                            <p className="text-xs sm:text-sm md:text-base text-gray-700">Year: {category.year}</p>
                        )}

                        {category.institution && (
                            <p className="text-xs sm:text-sm md:text-base text-gray-700">Institution: {category.institution}</p>
                        )}
                        </div>

                    <div className="mt-2 mb-1 flex justify-center">
                        <button
                        onClick={() => openPdfViewer(link)}
                        className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                        >
                        <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                        View
                        </button>
                    </div>
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
                        className="text-xl font-semibold mb-4"
                    >
                        Recently added Notes
                    </motion.h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {renderCards(notesDataLatest, 'Notes')}
                    </div>
                </div>

                {/* FAQS */}
                <div className="mt-8">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="text-xl font-semibold mb-4"
                    >
                        Recently added FAQs
                    </motion.h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {renderCards(faqDataLatest, 'Faqs')}
                    </div>
                </div>

                {/* PYQS */}
                <div className="mt-8">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="text-xl font-semibold mb-4"
                    >
                        Recently added PYQs
                    </motion.h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {renderCards(pyqDataLatest, 'Pyqs')}
                    </div>
                </div>

                {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
            </div>
        </section>
    ) : null;
};

export default LatestContent;
