import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Layers, BookOpenText, TrendingUp } from 'lucide-react';

const steps = [
    {
        number: '1',
        icon: <UserPlus className="w-6 h-6 text-white" />,
        title: 'Register/Login',
        description: 'Create your account or login to get started.',
        color: 'from-pink-500 to-rose-500',
    },
    {
        number: '2',
        icon: <Layers className="w-6 h-6 text-white" />,
        title: 'Select Year & Branch',
        description: 'Choose your academic year and engineering branch.',
        color: 'from-indigo-500 to-purple-500',
    },
    {
        number: '3',
        icon: <BookOpenText className="w-6 h-6 text-white" />,
        title: 'Access Materials',
        description: 'Get instant access to study materials and resources.',
        color: 'from-sky-500 to-cyan-500',
    },
    {
        number: '4',
        icon: <TrendingUp className="w-6 h-6 text-white" />,
        title: 'Track Progress',
        description: 'Monitor your learning journey and improvements.',
        color: 'from-green-500 to-emerald-500',
    },
];

function HowItWorks() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">How It Works</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                    A simple and efficient path to master your engineering journey.
                </p>
            </div>

            {/* 2x2 grid on mobile, 4x1 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="backdrop-blur-md bg-white/80 border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center"
                    >
                        <div
                            className={`bg-gradient-to-r ${step.color} w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md`}
                        >
                            {step.icon}
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">{step.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default HowItWorks;
