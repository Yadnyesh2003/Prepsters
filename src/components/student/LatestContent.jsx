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

    // Helper to render cards
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
                className="bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full sm:w-[48%] md:w-[32%] lg:w-[31%] xl:w-[30%] flex flex-col justify-between"
                >
                <div>
                    <h4 className="text-lg font-medium mb-1 text-gray-800">{title}</h4>
                    <p className="text-xs text-gray-600">Contributed By: {contributor}</p>
                    {category.branch && ( 
                        <p className="text-xs text-gray-500">
                            Branch: {Array.isArray(category.branch) ? category.branch.join(', ') : category.branch}
                        </p>
                    )}
                    {category.subjectName && (
                        <p className="text-xs text-gray-500">
                            Subject: {Array.isArray(category.subjectName) ? category.subjectName.join(', ') : category.subjectName}
                        </p>
                    )}
                    {category.year && <p className="text-xs text-gray-500">Year: {category.year}</p>}
                    {category.institution && <p className="text-xs text-gray-500">Institution: {category.institution}</p>}
                </div>
                <button
                    onClick={() => openPdfViewer(link)}
                    className="mt-2 flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
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
                className="text-xl font-semibold mb-4">
                    Recently added Notes
            </motion.h3>
            <div className="flex flex-wrap gap-5">
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
                className="text-xl font-semibold mb-4">
                    Recently added FAQs
            </motion.h3>
            <div className="flex flex-wrap gap-5">
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
                className="text-xl font-semibold mb-4">
                    Recently added PYQs
            </motion.h3>
            <div className="flex flex-wrap gap-5">
                {renderCards(pyqDataLatest, 'Pyqs')}
            </div>
            </div>

            {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
        </div>
        </section>
    ) : null;
};

export default LatestContent;

