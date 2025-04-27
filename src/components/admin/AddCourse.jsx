import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import Quill from 'quill';
import uniqid from 'uniqid'
import 'quill/dist/quill.snow.css';
import { assets } from '../../assets/assets'
import { db, collection, addDoc, doc, setDoc, serverTimestamp, updateDoc } from "../../config/firebase"; // import the necessary firestore methods
import AccessForbidden from '../student/AccessForbidden';
import { AppContext } from '../../context/AppContext';

export default function AddCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [chapters, setChapters] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [courseThumbnail, setCourseThumbnail] = useState("");
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
  });
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState("");

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const { toast } = useContext(AppContext);
  const { isGhost, user } = useAuth();
  
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if(action === 'add') 
      {
      const title = prompt('Enter Chapter Name:');
      if (title) 
        {
        const newChapter = 
        {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapse: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1:1,
        };
          setChapters([...chapters, newChapter])
        }
      }
    else if (action === 'remove') 
      {
        setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
      }
    else if (action === 'toggle') 
      {
        setChapters(
          chapters.map((chapter)=>
          chapter.chapterId === chapterId ? {...chapter, collapse: !chapter.collapse} : chapter
        )
        )
      }

  };

  const handleThumbnailChange = (e) => {
    const inputUrl = e.target.value;
    setCourseThumbnail(inputUrl); // Temporarily set the input value
  
    const match = inputUrl.match(/\/d\/([^/]+)\//); // Extract File ID correctly
    if (match) {
      const fileId = match[1];
      const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
  
      setCourseThumbnail(thumbnailUrl); // Update with the modified URL
    }
  };

  const handleBranchChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBranches((prev) =>
      checked ? [...prev, value] : prev.filter((branch) => branch !== value)
    );
  };

  const handleYearChange = (e) => {
    const { value, checked } = e.target;
    setSelectedYears((prev) =>
      checked ? [...prev, value] : prev.filter((year) => year !== value)
    );
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopUp(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, chapterContent: chapter.chapterContent.filter((_, index) => index !== lectureIndex) }
            : chapter)
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) =>
        chapter.chapterId === currentChapterId
          ? {
              ...chapter,
              chapterContent: [
                ...chapter.chapterContent,
                {
                  ...lectureDetails,
                  lectureOrder: chapter.chapterContent.length > 0
                    ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                    : 1,
                  lectureId: uniqid(),
                },
              ],
            }
          : chapter
      )
    );
    setShowPopUp(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const courseDescription = quillRef.current.root.innerHTML;
    try {
      if(isGhost) {
        const courseRef = await addDoc(collection(db, "courses"), {
          courseTitle,
          courseDescription,
          courseThumbnail,
          isPublished: true,
          category: {
            branch: selectedBranches,
            year: selectedYears,
          },
          chapters,
          adminId: user.uid,
          createdBy: user.displayName,
          createdAt: serverTimestamp(),
        });
        toast.success("Course added successfully!");

        await updateDoc(courseRef, {
          courseId: courseRef.id
        });

        setCourseTitle("");
        setCourseThumbnail("");
        quillRef.current.root.innerHTML = "";
        setSelectedBranches([]);
        setSelectedYears([]);
        setLectureDetails([]);
        setCurrentChapterId("");
        setAdminId("")
        setChapters([]);
      } else {
        toast('Unauthorized Access!', {icon: '🚫'})
      }
    } catch (error) {
      toast.error(`Oops! Couldn't add the Course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return isGhost ? (
    <div className="overflow-scroll flex flex-col items-start justify-between p-8  text-gray-700">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-w-md w-3/4 text-gray-500">
        <div className="flex flex-col gap-2">
          <label className="text-lg text-left">Course Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full p-2 text-gray-700 rounded-lg border border-gray-700"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg text-left">Course Thumbnail URL</label>
          <input
            type="text"
            value={courseThumbnail}
            onChange={handleThumbnailChange}
            className="w-full p-2 text-gray-700 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg text-left">Course Description</label>
          <div ref={editorRef} className='border border-gray-700'></div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg text-left">Category</p>

          {/* Branch Selection */}
          <div className="space-y-2">
            <p className="text-lg text-left">Branch</p>
            <div className="flex flex-col gap-2">
              {[
                "Computer Engineering",
                "Information Technology",
                "Electronics & Telecommunication",
                "Artificial Intelligence & Data Science",
                "Electronics & Computer Science",
              ].map((branch) => (
                <label key={branch} className="flex items-center gap-2 hover:text-amber-400">
                  <input
                    type="checkbox"
                    value={branch}
                    checked={selectedBranches.includes(branch)}
                    onChange={handleBranchChange}
                    className="accent-blue-600 "
                  />
                  <span>{branch}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year Selection */}
          <div className="space-y-2">
            <p className="text-lg text-left ">Year</p>
            <div className="flex flex-col gap-2">
              {["First Year", "Second Year", "Third Year", "Final Year"].map((year) => (
                <label key={year} className="flex items-center gap-2  hover:text-amber-300">
                  <input
                    type="checkbox"
                    value={year}
                    checked={selectedYears.includes(year)}
                    onChange={handleYearChange}
                    className="accent-blue-600"
                  />
                  <span>{year}</span>
                </label>
              ))}
            </div>
          </div>
        </div>


        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className=" rounded-lg mb-4 shadow-md">
              <div className="flex justify-between items-center p-4 border-b-1 border-gray-700">
                <div className="flex items-center space-x-2">
                  <img
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={14}
                    alt="dropdown icon"
                    className={`cursor-pointer hover:bg-blue-500 transition-transform ${chapter.collapse ? 'rotate-90' : ''}`}
                  />
                  <span className="font-semibold">{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                <span className="text-gray-400">{chapter.chapterContent.length} Lectures</span>
                <img
                  onClick={() => handleChapter('remove', chapter.chapterId)}
                  src={assets.cross_icon}
                  alt="remove chapter"
                  className="cursor-pointer hover:bg-blue-500"
                />
              </div>
              {!chapter.collapse && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex justify-between items-center mb-2">
                      <span>{lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -
                        <a href={lecture.lectureUrl} target="_blank" className="text-blue-400">Link</a>
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt="remove lecture"
                        className="cursor-pointer hover:bg-blue-500"
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                      />
                    </div>
                  ))}
                  <div
                    className="bg-blue-100 text-gray-500 p-2 rounded cursor-pointer mt-2 w-auto hover:bg-blue-400 hover:text-gray-800"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}
          <div
            className = 'flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer hover:bg-blue-400 hover:text-black'
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </div>
        </div>

        {showPopUp && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white text-gray-700 p-6 rounded-lg relative w-full max-w-md">
              <h2 className="text-lg mb-4 font-semibold">Add Lecture</h2>
              <div className="mb-4">
                <label className="text-lg ">Lecture Title</label>
                <input
                  type="text"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  className="w-full p-3 text-gray-700 rounded-lg border-1 border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="text-lg">Duration (minutes)</label>
                <input
                  type="number"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  className="w-full p-3 text-gray-700 rounded-lg border-1 border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="text-lg ">Lecture URL</label>
                <input
                  type="text"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) => {
                    const inputUrl = e.target.value;
                    const cleanUrl = inputUrl.split("?")[0]; 
                    setLectureDetails({ ...lectureDetails, lectureUrl: cleanUrl });
                  }}
                  className="w-full p-3 text-gray-700 rounded-lg border-1 border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={addLecture}
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
              >
                Add Lecture
              </button>

              <img
                onClick={() => setShowPopUp(false)}
                src={assets.cross_icon}
                alt="close"
                className="absolute top-4 right-4 w-4 cursor-pointer hover:bg-blue-200"
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className='bg-black text-white w-max py-2.5 px-8 rounded my-4 hover:bg-gray-400 hover:text-black'
          disabled={loading}
          >
          {loading ? "Adding Course" : "ADD COURSE"}
        </button>
      </form>
    </div>
  ) : <AccessForbidden />
}
