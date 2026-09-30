import Section from './Section.jsx'; import data from '../data.js'
export default function Education() {
  return <Section id="education" title="Education">{data.education.map(([d, s, y]) => <p key={d}><b>{d}</b><br />{s}, {y}</p>)}</Section>
}
