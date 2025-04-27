import React, { useContext, useState } from "react";
import { db, collection, addDoc, doc, setDoc, serverTimestamp, updateDoc } from "../../config/firebase";
import { useAuth } from '../../context/AuthContext'
import AccessForbidden from "../student/AccessForbidden";
import { AppContext } from "../../context/AppContext";

const AddContributors = () => {
  const [adminId, setAdminId] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [contributorRole, setContributorRole] = useState("");
  const [contributorContributions, setContributorContributions] = useState("");
  const [contributorSocial, setContributorSocial] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useContext(AppContext);
  const { isGhost, user } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if(isGhost) {
        const contributorRef = await addDoc(collection(db, "Contributors"), { 
          contributorName,
          contributorRole,
          contributorContributions,
          contributorSocial,
          adminId: user.uid,
          createdBy: user.displayName,
          createdAt: serverTimestamp(),
        });

        setAdminId("");
        setContributorName("");
        setContributorRole("");
        setContributorContributions("");
        setContributorSocial("");

        toast.success('Contributor added successfully!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' })
      }
    } catch (error) {
      toast.error(`Oops! Couldn't add the contributor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return isGhost ? (
    <div className="mx-auto mt-7 ml-3 p-6 bg-white overflow-scroll flex flex-col justify-between text-gray-700">
      <form onSubmit={handleSubmit} className="flex flex-col w-3/4 gap-4 text-gray-500">
        <div className="flex flex-col gap-2">
          {console.log('User Details', user)}
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
            type="text"
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
  ) : <AccessForbidden />;
};

export default AddContributors;