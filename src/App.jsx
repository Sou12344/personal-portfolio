import { useState } from 'react'
import Portfolio from './a1/Portfolio.jsx'; import Students from './a2/Students.jsx'
import Employees from './a3/Employees.jsx'; import Weather from './a4/Weather.jsx'
import Cart from './a5/Cart.jsx'; import TaskApp from './a6/TaskApp.jsx'
const tabs = [['A1 Portfolio',Portfolio],['A2 Students',Students],['A3 Employees',Employees],['A4 Weather',Weather],['A5 Cart',Cart],['A6+A7 Tasks & Auth',TaskApp]]
export default function App() {
  const [i, setI] = useState(0); const Page = tabs[i][1]
  return (<><nav className="switcher">{tabs.map((t, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)}>{t[0]}</button>)}</nav><Page /></>)
}
