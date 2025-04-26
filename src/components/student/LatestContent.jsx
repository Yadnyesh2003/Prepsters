import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const LatestContent = () => {
    const { notesDataLatest, faqDataLatest, pyqDataLatest } = useContext(AppContext);
    const { user } = useAuth();

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

                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-indigo-700 transition"
                    >
                        <img src={assets.view_data} alt="view" className="w-4 h-4 mr-2" />
                        View
                    </a>
                </motion.div>
            );
        });
    };

    return user ? (
        <section className="w-full bg-gray-50 overflow-hidden">
            <div className="px-6 py-10 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
                    Check out our Latest Study Resources!
                </h2>

                {/* Notes */}
                <div className="mt-10">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="text-xl font-semibold mb-6 text-gray-800"
                    >
                        Recently Added Notes
                    </motion.h3>
                    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                    <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {renderCards(pyqDataLatest, 'Pyqs')}
                    </div>
                </div>
            </div>
        </section>
    ) : null;
};

export default LatestContent;
