import Navbar from './Navbar.jsx'; import data from '../data.js'
export default function Header() {
  return <header className="pf-header"><h1>{data.name}</h1><p>{data.role}</p><Navbar /></header>
}
