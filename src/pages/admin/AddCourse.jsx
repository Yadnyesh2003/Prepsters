import React, { useState, useEffect, useRef, useContext } from 'react';
import Quill from 'quill';
import uniqid from 'uniqid'
import 'quill/dist/quill.snow.css';
import { assets } from '../../assets/assets'
import { db, collection, addDoc, doc, setDoc, serverTimestamp, updateDoc } from "../../config/firebase"; // import the necessary firestore methods

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

  const quillRef = useRef(null);
  const editorRef = useRef(null);
  
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Enter Course Description...",
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

  // Handle checkbox selection for branches
  const handleBranchChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBranches((prev) =>
      checked ? [...prev, value] : prev.filter((branch) => branch !== value)
    );
  };

  // Handle checkbox selection for years
  const handleYearChange = (e) => {
    const { value, checked } = e.target;
    setSelectedYears((prev) =>
      checked ? [...prev, value] : prev.filter((year) => year !== value)
    );
  };

  //Function to handle Add details of lecture & remove a lecture.
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopUp(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) =>                 //ChatGPT Optimised
          chapter.chapterId === chapterId
            ? { ...chapter, chapterContent: chapter.chapterContent.filter((_, index) => index !== lectureIndex) }
            : chapter)
      );
    }
  };

  //Funtion to Add lectures into the Chapter.
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
      lectureUrl: '',
      isPreviewFree: false,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseDescription = quillRef.current.root.innerHTML;
    try {
      const courseRef = await addDoc(collection(db, "courses"), {
        courseTitle,
        courseDescription,
        courseThumbnail,
        isPublished: true,
        createdAt: serverTimestamp(),
        updatedAt: null,
        courseRatings: [],
        educator: "",
        category: {
          branch: selectedBranches,
          year: selectedYears,
        },
        chapters
      });

      // for (const chapter of chapters) {
      //   const chapterRef = await addDoc(collection(db, `courses/${courseRef.id}/courseContent`), {
      //     chapters
      //   });
      // }
      alert("Course added successfully!");

      await updateDoc(courseRef, {
        courseId: courseRef.id  // Add the courseId field with the generated ID
      });

      setCourseTitle("");
      setCourseThumbnail("");
      quillRef.current.root.innerHTML = "";
      setSelectedBranches([]);
      setSelectedYears([]);
      setLectureDetails([]);
      setCurrentChapterId("");
      setChapters([]);

    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Course Title</label>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />


        <label className="block mb-2">Course Thumbnail URL</label>
        <input
          type="text"
          value={courseThumbnail}
          onChange={(e) => setCourseThumbnail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2">Course Description</label>
        <div ref={editorRef} className="h-40 border rounded mb-4"></div>

        <div>
        <label>Category</label>

        {/* Branch Selection */}
        <div>
          <label>Branch</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="Computer Engineering"
                checked={selectedBranches.includes("Computer Engineering")}
                onChange={handleBranchChange}
              />
              Computer Engineering
            </label>
            <label>
              <input
                type="checkbox"
                value="Information Technology"
                checked={selectedBranches.includes("Information Technology")}
                onChange={handleBranchChange}
              />
              Information Technology
            </label>
            <label>
              <input
                type="checkbox"
                value="Electronics"
                checked={selectedBranches.includes("Electronics")}
                onChange={handleBranchChange}
              />
              Electronics
            </label>
          </div>
        </div>

        {/* Year Selection */}
        <div>
          <label>Year</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="FY"
                checked={selectedYears.includes("FY")}
                onChange={handleYearChange}
              />
              FY
            </label>
            <label>
              <input
                type="checkbox"
                value="SY"
                checked={selectedYears.includes("SY")}
                onChange={handleYearChange}
              />
              SY
            </label>
            <label>
              <input
                type="checkbox"
                value="TY"
                checked={selectedYears.includes("TY")}
                onChange={handleYearChange}
              />
              TY
            </label>
            <label>
              <input
                type="checkbox"
                value="Btech"
                checked={selectedYears.includes("Btech")}
                onChange={handleYearChange}
              />
              Btech
            </label>
          </div>
        </div>
      </div>


        {/* Adding Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex)=>(
            <div key={chapterIndex} className='bg-white border rounded-lg mb-4'>
              <div className='flex justify-between items-center p-4 border-b'>
                <div className='flex items-center'>
                  <img onClick={()=> handleChapter('toggle', chapter.chapterId)}
                  src={assets.dropdown_icon} width={14} alt="dropdown icon" 
                  className={`mr-2 cursor-pointer hover:bg-blue-200 transition-all ${chapter.collapse && '-rotate-90'}`}
                  />
                  <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                <img onClick={()=> handleChapter('remove', chapter.chapterId)}
                src={assets.cross_icon} alt="cross icon" className='cursor-pointer hover:bg-blue-200'/>
              </div>
              {!chapter.collapse && (
                <div className='p-4'>
                  {chapter.chapterContent.map((lecture, lectureIndex)=> (
                    <div key={lectureIndex} className='flex justify-between items-center mb-2'>
                      <span>
                        {lectureIndex+1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - 
                        <a href={lecture.lectureUrl} target="_blank" className='text-blue-500'>Link</a> -
                        {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                      <img src={assets.cross_icon} alt="cross icon" className='cursor-pointer hover:bg-blue-200'
                      onClick={()=> handleLecture('remove', chapter.chapterId, lectureIndex)}/>
                    </div>
                  ))}
                  <div className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2 hover:bg-gray-300 hover:text-black' 
                  onClick={()=> handleLecture('add', chapter.chapterId)}>
                    + Add Lecture
                  </div>
                </div>
              )}

            </div>
          ))}
          <div className='flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer hover:bg-blue-400 hover:text-black'
          onClick={()=> handleChapter('add')}>
            + Add Chapter
          </div>
          {showPopUp && (
            <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                <div className="mb-2">
                  <p>Lecture Title</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <p>Duration (minutes)</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <p>Lecture URL</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <p>Is Preview Free?</p>
                  <input
                    type="checkbox"
                    className="mt-1 scale-125"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                </div>

                <button type='button' onClick={addLecture} className='w-full bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 hover:text-black'>Add</button>

                <img onClick={() => setShowPopUp(false)} src={assets.cross_icon} alt="cross icon" 
                className='absolute top-4 right-4 w-4 cursor-pointer hover:bg-blue-200'/>

              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Course
        </button>
      </form>
    </div>
  );
}