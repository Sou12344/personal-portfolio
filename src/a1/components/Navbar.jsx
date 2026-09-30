export default function Navbar() {
  return <nav className="pf-nav">{['about', 'education', 'skills', 'contact'].map(s => <a key={s} href={'#' + s}>{s}</a>)}</nav>
}
