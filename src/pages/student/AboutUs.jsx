import { motion } from 'framer-motion';
import parth from '../../assets/1(2).png';
import yadnu from '../../assets/profile_founder.jpeg';
import Footer from '../../components/student/Footer';
import {assets} from '../../assets/assets';
import { useEffect } from 'react';

function AboutUs() {

  useEffect(()=>{
    document.title = "About Us"
  },[])

  const timelineData = [
    {
      date: "23rd October, 2023",
      title: "🚀 Launch of Our First Google Site – The Third Tier Engineers",
      description:
        "It all started with a cracked idea during Sem 3 by Yadnyesh, who launched a simple Google Site packed with PYQs and concise notes. Shared among friends in the IT branch, this platform quickly became a hit, helping 60+ students crush their exams! With the motto ‘Minimize Effort, Maximize Output,’ we centralized smart learning—and that was just the beginning!",
      icon: (
        <svg className="fill-emerald-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
        </svg>
      ),
    },
    {
      date: "May, 2024",
      title: "📊 Game-Changer Alert – FAQs Based on PYQ Analysis!",
      description:
        "FAQs revolutionized our approach! We broke down PYQs subject-wise and filtered them into high-frequency questions—10 to 15 per module. Students now had a laser-focused target to score up to 80% with just a night’s prep! This killer feature DOUBLED our user count and boosted our confidence sky high 🚀🔥",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path className="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
          <path className="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
        </svg>
      ),
    },
    {
      date: "Nov, 2024",
      title: "📈 Massive Growth – From Rejection to Revolution!",
      description:
        "May 2024 exams brought insane growth! With 550+ users, 12K+ event counts, and over 10K page visits, our tiny Google Site evolved into a campus legend. We dropped curated notes, numericals, diagrams, and perfect answers across all IT subjects. Many who once laughed at this 'cracked idea' are now our fans. Quietly, we kept building. Now, we’re eyeing our biggest leap: turning this into a dynamic, student-powered platform!",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path className="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
          <path className="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
        </svg>
      ),
    },
    {
      date: "5th March, 2025",
      title: "⚙️ Dev Mode ON – Building Our Dream Project Begins!",
      description:
        "Let’s gooo! We kicked off the development of a full-fledged web app! From finalizing our Tech Stack to learning, debugging, and actually coding everything ourselves—this phase was all hustle. With a launch target for April end, our goal is clear: to give students the best crash-course style resource hub ever made! May 2025 exams? Don’t stress. We gotchu. Late night? Just open FAQs. Chill, ace, repeat. 💻📚💪",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path className="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
          <path className="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
        </svg>
      ),
    },
    {
      date: "12th May, 2025",
      title: "🎉 THE BIG DAY – Official Launch of Our Dream Learning Platform!",
      description:
        "After months of sleepless nights, bug fights, and feature-building chaos, we’re LIVE! 🎯 Our new web-based platform backed by a selfless student community is rolling out for beta testing this exam season. We’re expecting a quadruple surge in users—'cause it’s FREE, effective, and built FOR students BY students. The Third Tier Engineers isn’t just a platform—it’s a MOVEMENT. Let’s make history, amigos 🤝💯",
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
                <span className="font-extrabold">The Third Tier Engineers</span>
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
              🕐 One-night prep? 🌙📖 With us, it’s not just possible — it’s the plan. ✅🔥
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
                className="text-gray-700 text-lg sm:text-xl leading-relaxed text-justify"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                🎓 Hey! Welcome to <span className="font-semibold text-indigo-600">The Third Tier Engineers</span> — the ultimate exam-hack zone built by students, for students!
              </motion.p>

              <motion.p
                className="sm:text-xl text-base md:text-lg text-gray-700 leading-relaxed text-justify"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                🚀 What started as a cracked idea during Semester 3 is now a powerful learning platform trusted by 100s across Mumbai University.
                Whether you're pulling an all-nighter 🌙 or starting prep a week before, we've got your back with 📚 crisp, exam-ready notes, ✅ frequency-based FAQs,
                📂 a complete PYQ library, and 🎯 syllabus breakdowns — all in one place and absolutely FREE! 🆓 Why struggle when you can study smart? Join our
                selfless student community today and start scoring higher with lesser stress. 💡📈
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
                src={assets.yadnyesh}
                alt="Yadnyesh Firke"
                className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-full border-4 border-white shadow-lg z-10 relative transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-indigo-200/50"
              />
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 -z-10 transition-all duration-500 group-hover:animate-pulse-slow"></div>
            </motion.div>

            {/* Text Card with Y-Axis Animation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 80, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-2xl md:text-left border border-white/30 "
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-4">👨‍💻 Meet the Visionaries</h3>
              <p className="text-base md:text-lg text-gray-700 text-justify">
                Yadnyesh Firke (SAKEC - IT, Mumbai) & Parth Narkhede (VIIT - Comps, Pune) — we're the minds & coffee-fueled souls ☕ behind <span className="font-semibold text-indigo-600">The Third Tier Engineers</span>. From the Batch of 2026, just two regular engineering students with an irregularly big vision.
                It all began when Yadnyesh launched a simple Google Site during Sem 3 📅, packed with handwritten notes and PYQs for friends. What started as a “just-helping-bros-out” idea soon helped 60+ students crack their exams with ease 💯. Meanwhile, Parth jumped on board, and
                together we turned late-night study trends 🌙📚 into a movement — one that makes learning smart, fun, and community-driven.


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
                src={assets.parth}
                alt="Dr. Sarah Chen"
                className="w-64 h-64 md:w-72 md:h-72 object-cover rounded-full border-4 border-white shadow-lg z-10 relative transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-sky-200/50"
              />
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-sky-400 via-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 -z-10 transition-all duration-500 group-hover:animate-pulse-slow"></div>
            </motion.div>
          </motion.div>
        </div>

        {/* Why Join Us Section */}
        <div className="relative max-w-7xl mx-auto px-6 mt-16">
          {/* Section Title with Animation */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-indigo-700 text-center mb-16"
          >
            Why Join Us?
          </motion.h2>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-5xl mx-auto text-center md:text-left border border-white/30"
          >
            <p className="text-base md:text-lg text-gray-700 text-justify">
              Over months, we studied 📖, coded 🧑‍💻, failed 🐞, debugged 💥, and finally built a platform we wish we had from day one. With features like exam-focused notes, analyzed FAQs, year-wise PYQ libraries, and no-nonsense summaries — this isn’t just a project, it's a rebellion against boring textbooks and stressful study marathons 🎯🔥<br /><br />
              We're not just aspiring developers — we're builders of a student-first learning revolution. If you're someone who believes in sharing knowledge, solving problems, and helping others ace their goals… guess what? You belong here 🙌<br /><br />
              Join us. Contribute. Build. Because <span className="font-semibold text-indigo-600">The Third Tier Engineers</span> is more than a name — it’s a community of underdogs turning into achievers. 🚀🌟
            </p>
          </motion.div>
        </div>


        <div className="min-h-screen py-20 overflow-hidden relative bg-transparent">
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
                      className="bg-white/80 backdrop-blur-md p-4 rounded-md border border-gray-200 text-xs md:text-sm text-gray-600 shadow-sm text-justify"
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