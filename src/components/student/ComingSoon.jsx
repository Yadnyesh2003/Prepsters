import React, { useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";

const ComingSoon = () => {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useContext(AppContext);

  // Load subscribed state from localStorage
  useEffect(() => {
    const isSubscribed = localStorage.getItem("subscribed") === "true";
    setSubscribed(isSubscribed);
  }, []);

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("subscribed", "true");
      setSubscribed(true);
      setLoading(false);
      toast.success("You're on the list! We'll let you know ✨");
    }, 1000); // simulate async delay
  };

  const buttonLabel = useMemo(() => {
    if (loading) return "Subscribing...";
    return subscribed ? "Subscribed" : "Notify Me";
  }, [loading, subscribed]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg max-w-xl w-full p-10 text-center space-y-6"
      >
        <motion.h1
          className="text-4xl font-bold"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          Something Amazing is Coming Soon!
        </motion.h1>

        <p className="text-lg text-gray-200">
          We're working on something exciting that you'll love! Want to be the
          first to know when it's ready?
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleSubscribe}
            disabled={loading || subscribed}
            className={`${
              subscribed ? "bg-green-500" : "bg-yellow-400 hover:bg-yellow-500"
            } text-black px-5 py-3 rounded font-semibold`}
          >
            {buttonLabel}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="pt-4 text-sm text-gray-300"
        >
          We'll only email you when the feature is live. No spam ever 💌
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
