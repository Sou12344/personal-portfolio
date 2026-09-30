// Assignment 1 – Portfolio (components live in ./components)
import Header from './components/Header.jsx'; import About from './components/About.jsx'
import Education from './components/Education.jsx'; import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'; import Footer from './components/Footer.jsx'
export default function Portfolio() {
  return <div className="pf"><Header /><main><About /><Education /><Skills /><Contact /></main><Footer /></div>
}
