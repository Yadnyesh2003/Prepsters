"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const CONTRIBUTORS_KEY = "contributorsData";

const Contributors = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    document.title = "Contributors"
    const cachedData = localStorage.getItem(CONTRIBUTORS_KEY);
    if (cachedData) {
      setContributors(JSON.parse(cachedData));
    }

    const colRef = collection(db, "Contributors");
    // const unsubscribe = onSnapshot(colRef, async (snapshot) => {
    //   const contributorsData = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   localStorage.setItem(CONTRIBUTORS_KEY, JSON.stringify(contributorsData));
    //   setContributors(contributorsData);
    // });
    const unsubscribe = onSnapshot(colRef, async (snapshot) => {
      const contributorsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.createdAt?.toDate() - b.createdAt?.toDate()); // sorting by timestamp
    
      localStorage.setItem(CONTRIBUTORS_KEY, JSON.stringify(contributorsData));
      setContributors(contributorsData);
    });    

    triggerConfetti();

    return () => unsubscribe();
  }, []);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-16 px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12"
      >
        Greetings to all the contributors!
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contributors.map((contributor) => (
          <motion.div
            key={contributor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-2">
                {contributor.contributorName}
              </h2>
              <h3 className="text-sm text-gray-500 mb-4">
                {contributor.contributorRole}
              </h3>
              <p className="text-gray-700 text-sm mb-6">
                {contributor.contributorContributions}
              </p>
            </div>

            <a
              href={contributor.contributorSocial}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 text-sm font-medium hover:underline mt-auto"
            >
              View LinkedIn Profile
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
