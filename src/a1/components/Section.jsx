export default function Section({ id, title, children }) {
  return <section id={id} className="pf-sec"><h2>{title}</h2>{children}</section>
}
