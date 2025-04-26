import { motion } from 'framer-motion';
import parth from '../../assets/1(2).png';
import yadnu from '../../assets/cropped_image.png';
import Footer from '../../components/student/Footer';

function AboutUs() {

  const timelineData = [
    {
      date: "Apr 7, 2024",
      title: "Mark Mikrol opened the request",
      description:
        "Various versions have evolved over the years, sometimes by accident, sometimes on purpose injected humour and the like.",
      icon: (
        <svg className="fill-emerald-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
        </svg>
      ),
    },
    {
      date: "Apr 7, 2024",
      title: "John Mirkovic commented the request",
      description:
        "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path className="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
          <path className="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
        </svg>
      ),
    },
    {
      date: "Apr 8, 2024",
      title: "Vlad Patterson commented the request",
      description:
        "Letraset sheets containing passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Ipsum.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path className="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
          <path className="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
        </svg>
      ),
    },
    {
      date: "Apr 8, 2024",
      title: "Mila Capentino commented the request",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path className="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
          <path className="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
        </svg>
      ),
    },
    {
      date: "Apr 9, 2024",
      title: "Mark Mikrol closed the request",
      description: "If you are going to use a passage of Lorem Ipsum!",
      icon: (
        <svg className="fill-red-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <section className="relative min-h-screen bg-gradient-to-br from-white via-sky-50 to-indigo-100 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating gradient circles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-indigo-300 to-sky-300 rounded-full blur-[100px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.2, 0.3, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/3 -right-20 w-96 h-96 bg-gradient-to-r from-sky-200 to-indigo-200 rounded-full blur-[120px]"
          />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
        </div>

        {/* Main Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-full max-w-6xl mx-auto p-8 sm:p-12 bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-indigo-100/50 mb-5"
        >
          {/* Decorative border accent */}
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent pointer-events-none overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent origin-left"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-300 mb-4 tracking-tight">
                About <span className="font-extrabold">TTE</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-sky-400 rounded-full mb-6"></div>
            </motion.div>

            {/* Subheading */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl font-medium text-indigo-800 mb-8 leading-snug"
            >
              Transforming Technical Education for the Next Generation of Innovators
            </motion.h3>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, staggerChildren: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4 mb-10"
            >
              <motion.p
                className="text-gray-700 text-lg sm:text-xl leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                TTE (<span className="font-semibold text-indigo-600">Transform Technical Education</span>) is revolutionizing engineering education by bridging the gap between academic theory and real-world application.
              </motion.p>

              <motion.p
                className="text-gray-700 text-lg sm:text-xl leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Our platform combines cutting-edge learning resources with personalized mentorship, empowering students to not just pass exams, but to become the innovators and problem-solvers of tomorrow.
              </motion.p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <motion.a
                href="/resources/course-list"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative px-8 py-4 sm:py-3 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">Explore Courses</span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.a>

              <motion.a
                href="/"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative px-8 py-4 sm:py-3 rounded-full bg-white text-indigo-600 font-semibold text-lg border-2 border-indigo-200 hover:border-indigo-300 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">Learn More</span>
                <span className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Founders Section */}
        <div className="relative max-w-7xl mx-auto px-6 mt-16">
          {/* Title with Y-Axis Animation */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-indigo-700 text-center mb-16"
          >
            Our Founders
          </motion.h2>

          {/* Founders Layout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 mb-24"
          >
            {/* Founder 1 Image (Circular, Slides from Left) */}
            <motion.div
              variants={{
                hidden: { x: '-100%', opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 100, delay: 0.2 }}
              className="relative group flex-shrink-0"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <img
                src={yadnu}
                alt="Dr. James Wilson"
                className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-full border-4 border-white shadow-lg z-10 relative transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-indigo-200/50"
              />
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 -z-10 transition-all duration-500 group-hover:animate-pulse-slow"></div>
            </motion.div>

            {/* Text Card with Y-Axis Animation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 80, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-2xl text-center md:text-left border border-white/30"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">Meet the Visionaries</h3>
              <p className="text-base md:text-lg text-gray-700">
                Founded in 2018 by Dr. James Wilson and Dr. Sarah Chen, TTE was born from a shared passion for transforming engineering education. With over 30 years of combined experience in academia and industry, our founders identified critical gaps in how engineering students were being prepared for exams and professional challenges. Their complementary expertise in technical education and digital learning has shaped TTE into a platform that combines rigorous academic content with innovative teaching methodologies.
              </p>
            </motion.div>

            {/* Founder 2 Image (Circular, Slides from Right) */}
            <motion.div
              variants={{
                hidden: { x: '100%', opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 100, delay: 0.2 }}
              className="relative group flex-shrink-0"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 via-teal-500 to-emerald-500 blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <img
                src={parth}
                alt="Dr. Sarah Chen"
                className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-full border-4 border-white shadow-lg z-10 relative transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-sky-200/50"
              />
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-sky-400 via-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 -z-10 transition-all duration-500 group-hover:animate-pulse-slow"></div>
            </motion.div>
          </motion.div>
        </div>


        <div className="min-h-screen py-20 overflow-hidden relative bg-transparent">
          {/* Decorative Floating Orbs */}
          {/* <div className="absolute inset-0 pointer-events-none opacity-20">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-10 w-24 h-24 bg-teal-200 rounded-full blur-3xl"
            />
          </div> */}

          {/* Timeline Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-indigo-700 text-center mb-12 relative z-10"
          >
            Our Journey
          </motion.h2>

          {/* Timeline Vertical Line and Items */}
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 md:before:ml-32 before:w-0.5 before:bg-gradient-to-b before:from-indigo-300 via-indigo-400 to-indigo-300 before:shadow-sm">
            {timelineData.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  {/* Icon and Date */}
                  <div className="flex flex-col items-center space-y-2 md:space-y-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.8, type: "spring", stiffness: 100, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 shadow-md"
                    >
                      {item.icon}
                    </motion.div>
                    <motion.time
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.1 }}
                      viewport={{ once: true }}
                      className="font-caveat text-sm text-indigo-700 mt-1 text-center"
                    >
                      {item.date}
                    </motion.time>
                  </div>

                  {/* Title and Description */}
                  <div className="flex flex-col ml-14 md:ml-0">
                    <motion.h3
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 + 0.2 }}
                      viewport={{ once: true }}
                      className="text-base md:text-lg font-semibold text-gray-900 mb-2"
                    >
                      {item.title}
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, ease: "easeOut", delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                      className="bg-white/80 backdrop-blur-md p-4 rounded-md border border-gray-200 text-xs md:text-sm text-gray-600 shadow-sm"
                    >
                      {item.description}
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>





      </section>
      <Footer />
    </div>
  );
}

export default AboutUs;