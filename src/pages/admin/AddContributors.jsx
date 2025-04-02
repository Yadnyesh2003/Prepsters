import React, { useState } from "react";
import { db, collection, addDoc, doc, setDoc, serverTimestamp, updateDoc } from "../../config/firebase";

const AddContributors = () => {
  const [adminId, setAdminId] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [contributorRole, setContributorRole] = useState("");
  const [contributorContributions, setContributorContributions] = useState("");
  const [contributorSocial, setContributorSocial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Save the contributor data to Firestore
      const contributorRef = await addDoc(collection(db, "contributors"), { 
        adminId: 'user.auth.id',
        contributorName,
        contributorRole,
        contributorContributions,
        contributorSocial,
      });

      setAdminId("");
      setContributorName("");
      setContributorRole("");
      setContributorContributions("");
      setContributorSocial("");

      alert("Contributor added successfully!");
    } catch (error) {
      setError("Error adding contributor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-7 ml-3 p-6 bg-white overflow-scroll flex flex-col justify-between text-gray-700">

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col w-3/4 gap-4 text-gray-500">
        <div className="flex flex-col gap-2">
          <label className="text-lg text-left">Contributor Name</label>
          <input
            type="text"
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg text-left">Contributor Role</label>
          <input
            type="text"
            value={contributorRole}
            onChange={(e) => setContributorRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg text-left">Contributor Contributions</label>
          <textarea
            value={contributorContributions}
            onChange={(e) => setContributorContributions(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg text-left">Contributor Social URL</label>
          <input
            type="url"
            value={contributorSocial}
            onChange={(e) => setContributorSocial(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-max p-2 bg-black text-white py-2.5 px-8 rounded my-4 hover:bg-gray-400 hover:text-black"
          disabled={loading}
        >
          {loading ? "Adding Contributor..." : "ADD CONTRIBUTOR"}
        </button>
      </form>
    </div>
  );
};

export default AddContributors;