import data from '../data.js'
export default function Footer() { return <footer className="pf-footer">© {new Date().getFullYear()} {data.name}</footer> }
