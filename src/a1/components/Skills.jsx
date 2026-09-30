import Section from './Section.jsx'; import data from '../data.js'
export default function Skills() {
  return <Section id="skills" title="Skills"><ul className="chips">{data.skills.map(s => <li key={s}>{s}</li>)}</ul></Section>
}
