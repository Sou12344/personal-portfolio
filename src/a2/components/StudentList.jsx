import StudentCard from './StudentCard.jsx'
export default function StudentList({ list }) { return <div className="grid">{list.map(s => <StudentCard key={s.id} {...s} />)}</div> }
