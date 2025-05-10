import React from 'react';
import { Users, BookOpen, TrendingUp, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    {
        icon: <Users className="w-6 h-6 text-white" />,
        label: 'Students Helped',
        value: '500+',
        bg: 'bg-gray-700',
    },
    {
        icon: <BookOpen className="w-6 h-6 text-white" />,
        label: 'Subjects Covered',
        value: '5+',
        bg: 'bg-gray-700',
    },
    {
        icon: <TrendingUp className="w-6 h-6 text-white" />,
        label: 'Success Rate',
        value: '95%',
        bg: 'bg-gray-700',
    },
    {
        icon: <FolderOpen className="w-6 h-6 text-white" />,
        label: 'Resources',
        value: '100+',
        bg: 'bg-gray-700',
    },
];

function ImpactSection() {
    return (
        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Our Impact
                </h2>
                <p className="mt-3 text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
                    Making a difference by guiding learners toward success with trust and technology.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                    >
                        <div className={`${stat.bg} p-3 rounded-full mb-4 shadow`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default ImpactSection;
