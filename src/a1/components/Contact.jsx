import Section from './Section.jsx'; import data from '../data.js'
export default function Contact() {
  const c = data.contact
  return <Section id="contact" title="Contact"><p>{c.email}<br />{c.phone}<br />{c.city}</p></Section>
}
