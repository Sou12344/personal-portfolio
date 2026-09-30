export default function StudentCard({ name, roll, dept, sem, cgpa }) {
  return (
    <article className="card">
      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`} alt={name} width="72" height="72" />
      <h3>{name}</h3><p>Roll No: {roll}</p><p>{dept} · Sem {sem}</p><p><b>CGPA {cgpa.toFixed(1)}</b></p>
    </article>
  )
}
