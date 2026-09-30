// Assignment 3 – Employee Directory (add / edit / delete / search / count / department filter)
import { useState } from 'react'
const depts = ['Crops', 'Dairy', 'Poultry', 'Machinery', 'Admin']
const blank = { name: '', empId: '', dept: depts[0], gender: 'Female', phone: '', local: '', permanent: '' }
const seed = [{ id: 1, name: 'Ravi Kumar', empId: 'F001', dept: 'Dairy', gender: 'Male', phone: '9876500001', local: 'Farm Quarters 4', permanent: 'Village Rampur' }]
export default function Employees() {
  const [list, setList] = useState(seed), [form, setForm] = useState(blank), [editId, setEditId] = useState(null)
  const [q, setQ] = useState(''), [df, setDf] = useState('All'), [err, setErr] = useState('')
  const set = k => e => setForm({ ...form, [k]: e.target.value })
  const save = e => {
    e.preventDefault()
    if (!form.name.trim() || !form.empId.trim()) return setErr('Name and Employee ID are required.')
    if (!/^\d{10}$/.test(form.phone)) return setErr('Phone must be 10 digits.')
    if (list.some(x => x.empId === form.empId && x.id !== editId)) return setErr('Employee ID already exists.')
    setErr('')
    editId ? setList(list.map(x => x.id === editId ? { ...form, id: editId } : x)) : setList([...list, { ...form, id: Date.now() }])
    setForm(blank); setEditId(null)
  }
  const shown = list.filter(x => (df === 'All' || x.dept === df) && (x.name + x.empId).toLowerCase().includes(q.toLowerCase()))
  return (<div className="page"><header className="bar"><h1>Farm Employee Directory</h1></header>
    <form className="form" onSubmit={save}>
      <input placeholder="Name" value={form.name} onChange={set('name')} /><input placeholder="Employee ID" value={form.empId} onChange={set('empId')} />
      <select value={form.dept} onChange={set('dept')}>{depts.map(d => <option key={d}>{d}</option>)}</select>
      <select value={form.gender} onChange={set('gender')}><option>Female</option><option>Male</option><option>Other</option></select>
      <input placeholder="Phone (10 digits)" value={form.phone} onChange={set('phone')} />
      <input placeholder="Local address" value={form.local} onChange={set('local')} /><input placeholder="Permanent address" value={form.permanent} onChange={set('permanent')} />
      <button>{editId ? 'Save changes' : 'Add employee'}</button>
      {editId && <button type="button" onClick={() => { setForm(blank); setEditId(null) }}>Cancel</button>}
    </form>
    {err && <p className="err">{err}</p>}
    <div className="row"><input placeholder="Search name or ID" value={q} onChange={e => setQ(e.target.value)} />
      <select value={df} onChange={e => setDf(e.target.value)}><option>All</option>{depts.map(d => <option key={d}>{d}</option>)}</select>
      <b>Employees: {shown.length} of {list.length}</b></div>
    {shown.length === 0 ? <p>No employees match. Add one above.</p> :
      <div className="tablewrap"><table><thead><tr><th>Name</th><th>ID</th><th>Dept</th><th>Gender</th><th>Phone</th><th>Local</th><th>Permanent</th><th></th></tr></thead>
        <tbody>{shown.map(x => <tr key={x.id}><td>{x.name}</td><td>{x.empId}</td><td>{x.dept}</td><td>{x.gender}</td><td>{x.phone}</td><td>{x.local}</td><td>{x.permanent}</td>
          <td><button onClick={() => { setForm(x); setEditId(x.id) }}>Edit</button> <button onClick={() => window.confirm('Delete ' + x.name + '?') && setList(list.filter(y => y.id !== x.id))}>Delete</button></td></tr>)}</tbody></table></div>}
  </div>)
}
