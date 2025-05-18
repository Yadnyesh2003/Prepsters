import search_icon from './search_icon.svg'
import cross_icon from './cross_icon.svg'
import arrow_icon from './arrow_icon.svg'
import down_arrow_icon from './down_arrow_icon.svg'
import time_left_clock_icon from './time_left_clock_icon.svg'
import time_clock_icon from './time_clock_icon.svg'
import home_icon from './home_icon.svg'
import add_icon from './add_icon.svg'
import my_course_icon from './my_course_icon.svg'
import person_tick_icon from './person_tick_icon.svg'
import file_upload_icon from './file_upload_icon.svg'
import appointments_icon from './appointments_icon.svg'
import earning_icon from './earning_icon.svg'
import dropdown_icon from './dropdown_icon.svg'
import patients_icon from './patients_icon.svg'
import play_icon from './play_icon.svg'
import blue_tick_icon from './blue_tick_icon.svg'
import lesson_icon from './lesson_icon.svg'
import tte_transparent_logo from './tte_transparent_logo.png'
import edit_data from './edit_data.png'
import delete_data from './delete_data.png'
import view_data from './view_data.png'
import close_button from './close_button.png'
import access_forbidden from './access_forbidden.png'
import default_student_avatar from './default_student_avatar.png'
import star_white from './star_white.png'
import star_yellow from './star_yellow.png'
import parth from './1(2).png'
import yadnyesh from './profile_founder.jpeg'
import hero_img from './hero_image.jpeg'

import popSoundFile from './pop.mp3';

export const assets = {
  search_icon,
  arrow_icon,
  dropdown_icon,
  cross_icon,
  down_arrow_icon,
  time_left_clock_icon,
  time_clock_icon,
  home_icon,
  add_icon,
  my_course_icon,
  person_tick_icon,
  file_upload_icon,
  appointments_icon,
  earning_icon,
  patients_icon,
  play_icon,
  blue_tick_icon,
  lesson_icon,
  tte_transparent_logo,
  edit_data,
  delete_data,
  view_data,
  close_button,
  access_forbidden,
  default_student_avatar,
  star_white,
  star_yellow,
  parth,
  yadnyesh,
  hero_img
}

export const popSound = new Audio(popSoundFile);

export const branches = [
  { value: "General Science & Humanities", label: "General Science & Humanities" },
  { value: "Computer Engineering", label: "Computer Engineering" },
  { value: "Information Technology", label: "Information Technology" },
  // { value: "Electronics & Telecommunication", label: "Electronics & Telecommunication" },
  { value: "Artificial Intelligence & Data Science", label: "Artificial Intelligence & Data Science" },
  // { value: "Electronics & Computer Science", label: "Electronics & Computer Science" },
  // { value: "Cyber Security", label: "Cyber Security" },
  // { value: "Electrical Engineering", label: "Electrical Engineering" },
  // { value: "Mechanical Engineering", label: "Mechanical Engineering" },
];

export const years = [
  { value: "First Year", label: "First Year" },
  { value: "Second Year", label: "Second Year" },
  { value: "Third Year", label: "Third Year" },
  // { value: "Final Year", label: "Final Year" },
];

export const subjects = [

  //FIRST YEAR SUBJECTS (SEM 1)
  { value: "Engineering Mathematics 1", label: "Engineering Mathematics 1" },
  { value: "Engineering Physics 1", label: "Engineering Physics 1" },
  { value: "Engineering Chemistry 1", label: "Engineering Chemistry 1" },
  { value: "Engineering Mechanics", label: "Engineering Mechanics" },
  { value: "Basic Electrical & Electronics Engineering", label: "Basic Electrical & Electronics Engineering" },
  { value: "C Programming", label: "C Programming" },

  //FIRST YEAR SUBJECTS (SEM 2)
  { value: "Engineering Mathematics 2", label: "Engineering Mathematics 2" },
  { value: "Engineering Physics 2", label: "Engineering Physics 2" },
  { value: "Engineering Chemistry 2", label: "Engineering Chemistry 2" },
  { value: "Engineering Graphics", label: "Engineering Graphics" },
  { value: "Python Programming", label: "Python Programming" },

  //COMPUTER & IT THEORY EXAM SUBJECTS (SEM 3 TO SEM 6)
  { value: "Engineering Mathematics 3", label: "Engineering Mathematics 3" },
  { value: "Engineering Mathematics 4", label: "Engineering Mathematics 4" },
  { value: "Discrete Structures & Graph Theory", label: "Discrete Structures & Graph Theory" },
  { value: "Data Structures and Analysis", label: "Data Structures and Analysis" },
  { value: "Data Structures", label: "Data Structures" },
  { value: "Analysis Of Algorithms", label: "Analysis Of Algorithms" },
  { value: "Database Management System", label: "Database Management System" },
  { value: "Computer Organization & Architecture", label: "Computer Organization & Architecture" },
  { value: "Digital Logic & Computer Architecture", label: "Digital Logic & Computer Architecture" },
  { value: "Microprocessor", label: "Microprocessor" },
  { value: "Computer Graphics", label: "Computer Graphics" },
  { value: "Principle of Communication", label: "Principle of Communication" },
  { value: "Paradigms and Computer Programming Fundamentals", label: "Paradigms and Computer Programming Fundamentals" },
  { value: "Java Programming", label: "Java Programming" },
  { value: "Operating Systems", label: "Operating Systems" },
  { value: "Computer Network & Network Design", label: "Computer Network & Network Design" },
  { value: "Computer Network", label: "Computer Network" },
  { value: "Automata Theory", label: "Automata Theory" },
  { value: "Theoretical Computer Science", label: "Theoretical Computer Science" },
  // { value: "Theory Of Computation", label: "Theory Of Computation" },
  { value: "Internet Programming", label: "Internet Programming" },
  { value: "Computer Network Security", label: "Computer Network Security" },
  { value: "Cryptography & Network Security", label: "Cryptography & Network Security" },
  { value: "Cryptography & System Security", label: "Cryptography & System Security" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Entrepreneurship and E-Business", label: "Entrepreneurship and E-Business" },
  { value: "Microcontroller Embedded Programming", label: "Microcontroller Embedded Programming" },
  { value: "Advance Data Management Technologies", label: "Advance Data Management Technologies" },
  { value: "Advanced Data Structures & Analaysis", label: "Advance Data Structures & Analysis" },
  { value: "Computer Graphics & Multimedia System", label: "Computer Graphics & Multimedia System" },
  { value: "Probabilistic Graphical Models", label: "Probabilistic Graphical Models" },
  { value: "Data Warehousing & Mining", label: "Data Warehousing & Mining" },
  { value: "System Programming & Compiler Construction", label: "System Programming & Compiler Construction" },
  { value: "Mobile Computing", label: "Mobile Computing" },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "Internet Of Things", label: "Internet Of Things" },
  { value: "Digital Signal & Image Processing", label: "Digital Signal & Image Processing" },
  { value: "Quantitative Analysis", label: "Quantitative Analysis" },
  { value: "Data Mining & Busisness Intelligence", label: "Data Mining & Business Intelligence" },
  { value: "Web X.0", label: "Web X.0" },
  { value: "Artificial Intelligence & Data Science 1", label: "Artificial Intelligence & Data Science 1" },
  { value: "Wireless Technology", label: "Wireless Technology" },
  { value: "Software Architecture", label: "Software Architecture" },
  { value: "Green IT", label: "Green IT" },
  { value: "Image Processing", label: "Image Processing" },
  { value: "Ethical Hacking & Forensics", label: "Ethical Hacking & Forensics" },

  //AIDS THEORY EXAM SUBJECTS (SEM 5 TO SEM 6)
  { value: "Web Computing", label: "Web Computing" },
  { value: "Statistics for Artificial Intelligence & Data Science", label: "Statistics for Artificial Intelligence & Data Science" },
  { value: "Advanced Algorithms", label: "Advanced Algorithms" },
  { value: "High Performance Computing", label: "High Performance Computing" },
  { value: "Distributed Computing", label: "Distributed Computing" },
  { value: "Image & Video Processing", label: "Image & Video Processing" },
  { value: "Data Analytics and Visualization", label: "Data Analytics and Visualization" },
  { value: "Software Engineering and Project Management", label: "Software Engineering and Project Management"},
  { value: "Machine Learning", label: "Machine Learning" },

];

export const institutions = [
  { value: "Mumbai University", label: "Mumbai University" },
  { value: "Shah & Anchor Kutchhi College Of Engineering", label: "Shah & Anchor Kutchhi College Of Engineering" },
];

export const contributors = [
  { value: "Yadnyesh Firke", label: "Yadnyesh Firke" },
  { value: "Parth Narkhede", label: "Parth Narkhede" },
  { value: "Parth Chavan", label: "Parth Chavan" },
  { value: "Vishal Singh", label: "Vishal Singh" },
  { value: "Tejas Savla", label: "Tejas Savla" },

];

export const academicYears = [
  { value: "Dec 24", label: "Dec 24" },
  { value: "May 24", label: "May 24" },
  { value: "Dec 23", label: "Dec 23" },
  { value: "May 23", label: "May 23" },
  { value: "Dec 22", label: "Dec 22" },
  { value: "May 22", label: "May 22" },
  { value: "Dec 21", label: "Dec 21" },
  { value: "May 21", label: "May 21" },
  { value: "Dec 20", label: "Dec 20" },
  { value: "May 20", label: "May 20" },
  { value: "Dec 19", label: "Dec 19" },
  { value: "May 19", label: "May 19" },
  { value: "Dec 18", label: "Dec 18" },
  { value: "May 18", label: "May 18" }
];

