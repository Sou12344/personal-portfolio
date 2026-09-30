// Assignment 2 – App component; all data flows down through props
import { useState } from 'react'
import students from './students.js'
import Header from './components/Header.jsx'; import Footer from './components/Footer.jsx'; import StudentList from './components/StudentList.jsx'
export default function Students() {
  const [dir, setDir] = useState(null)
  const list = dir ? [...students].sort((a, b) => dir === 'asc' ? a.cgpa - b.cgpa : b.cgpa - a.cgpa) : students
  return (
    <div className="page"><Header title="Student Portal" />
      <div className="row"><button onClick={() => setDir('desc')}>CGPA high → low</button><button onClick={() => setDir('asc')}>CGPA low → high</button><button onClick={() => setDir(null)}>Reset</button></div>
      <StudentList list={list} /><Footer count={list.length} /></div>
  )
}
