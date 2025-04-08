import React from 'react';
import { BarChart2, BookOpen, HelpCircle, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <BarChart2 className="w-8 h-8 text-white" />,
        title: 'Learning Analytics',
        description: 'Track your progress and get personalized recommendations.',
    },
    {
        icon: <BookOpen className="w-8 h-8 text-white" />,
        title: 'Study Materials',
        description: 'Access comprehensive year-wise subject materials.',
    },
    {
        icon: <HelpCircle className="w-8 h-8 text-white" />,
        title: 'Expert FAQs',
        description: 'Get answers to common questions from experts.',
    },
    {
        icon: <ListChecks className="w-8 h-8 text-white" />,
        title: 'Performance Tracking',
        description: 'Monitor your academic performance and growth.',
    },
];

function Features() {
    return (
        <section className="bg-gray-50 py-16 pb-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Key Features</h2>
                <p className="mt-2 text-gray-600 text-lg">
                    Everything you need to excel in your engineering journey.
                </p>
            </div>

            {/* Mobile = 2x2 (quadrant), Desktop = 4x1 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 ease-in-out hover:shadow-xl"
                    >
                        <div className="bg-gradient-to-br from-[#2eb9ec] to-[#1589b6] rounded-full p-4 mb-4 shadow-md">
                            {feature.icon}
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                            {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default Features;
