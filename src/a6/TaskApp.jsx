// Assignment 6 (Task Manager + routing) and Assignment 7 (auth: login/logout, remember me, JWT simulation)
import { createContext, useContext, useState, useEffect } from 'react'
import { HashRouter, Routes, Route, NavLink, Link, Navigate, useParams, useNavigate, Outlet } from 'react-router-dom'

/* ---------- A7: auth ---------- */
const AuthCtx = createContext(), TaskCtx = createContext()
const b64 = o => btoa(JSON.stringify(o)).replace(/=/g, '')
const makeJwt = user => `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: user, iat: Date.now(), exp: Date.now() + 36e5 })}.simulated-signature`
const readJwt = t => { try { const p = JSON.parse(atob(t.split('.')[1])); return p.exp > Date.now() ? p : null } catch { return null } }
const strength = p => { const s = [p.length >= 8, /[A-Z]/.test(p), /[a-z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length; return p ? (s <= 2 ? 'Weak' : s <= 4 ? 'Medium' : 'Strong') : '' }
function AuthProvider({ children }) {
  const load = () => { const t = localStorage.getItem('jwt') || sessionStorage.getItem('jwt'); const p = t && readJwt(t); return p ? p.sub : null }
  const [user, setUser] = useState(load)
  const login = (u, remember) => { const t = makeJwt(u); (remember ? localStorage : sessionStorage).setItem('jwt', t); setUser(u) }
  const logout = () => { localStorage.removeItem('jwt'); sessionStorage.removeItem('jwt'); setUser(null) }
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}
function Login() {
  const { user, login } = useContext(AuthCtx), nav = useNavigate()
  const [u, setU] = useState(''), [p, setP] = useState(''), [rem, setRem] = useState(false), [errs, setErrs] = useState({})
  if (user) return <Navigate to="/" replace />
  const submit = e => { e.preventDefault(); const er = {}; if (!u.trim()) er.u = 'Username is required.'; if (!p) er.p = 'Password is required.'; setErrs(er); if (!Object.keys(er).length) { login(u.trim(), rem); nav('/') } }
  return (<form className="form login" onSubmit={submit}><h2>Sign in</h2>
    <input placeholder="Username" value={u} onChange={e => setU(e.target.value)} />{errs.u && <p className="err">{errs.u}</p>}
    <input type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)} />{errs.p && <p className="err">{errs.p}</p>}
    {p && <p className={'str ' + strength(p)}>Password strength: {strength(p)}</p>}
    <label><input type="checkbox" checked={rem} onChange={e => setRem(e.target.checked)} /> Remember me</label><button>Sign in</button></form>)
}
const Protected = () => { const { user } = useContext(AuthCtx); return user ? <Outlet /> : <Navigate to="/login" replace /> }

/* ---------- A6: tasks ---------- */
const DUE = '2026-08-28'
const fmt = iso => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks') || '[]'))
  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks])
  const add = t => setTasks(x => [...x, { ...t, id: Date.now(), raised: new Date().toISOString(), due: DUE, status: 'Raised' }])
  const update = (id, patch) => setTasks(x => x.map(t => t.id === id ? { ...t, ...patch } : t))
  const remove = id => setTasks(x => x.filter(t => t.id !== id))
  return <TaskCtx.Provider value={{ tasks, add, update, remove }}>{children}</TaskCtx.Provider>
}
const Dashboard = () => { const { tasks } = useContext(TaskCtx), { user } = useContext(AuthCtx)
  return (<div><h2>Welcome, {user}</h2><div className="grid">{['Raised', 'Pending', 'Closed'].map(s => <div className="card" key={s}><h3>{s}</h3><p className="big">{tasks.filter(t => t.status === s).length}</p></div>)}</div></div>) }
function TaskRow({ t }) { const { update, remove } = useContext(TaskCtx)
  return (<div className="card row line"><Link to={`/tasks/${t.id}`}><b>{t.header}</b></Link><span className={'tag ' + t.priority}>{t.priority}</span><span>{t.category}</span>
    <select value={t.status} onChange={e => update(t.id, { status: e.target.value })}>{['Raised', 'Pending', 'Closed'].map(s => <option key={s}>{s}</option>)}</select>
    <button onClick={() => window.confirm('Delete this task?') && remove(t.id)}>Delete</button></div>) }
function Tasks() { const { tasks } = useContext(TaskCtx), [p, setP] = useState('All'), [s, setS] = useState('All')
  const list = tasks.filter(t => t.status !== 'Closed' || s === 'Closed').filter(t => (p === 'All' || t.priority === p) && (s === 'All' || t.status === s))
  return (<div><h2>Tasks</h2><div className="row"><select value={p} onChange={e => setP(e.target.value)}>{['All', 'High', 'Medium', 'Low'].map(x => <option key={x}>{x}</option>)}</select>
    <select value={s} onChange={e => setS(e.target.value)}>{['All', 'Raised', 'Pending', 'Closed'].map(x => <option key={x}>{x}</option>)}</select></div>
    {list.length ? list.map(t => <TaskRow key={t.id} t={t} />) : <p>No tasks here. <Link to="/add">Add one</Link>.</p>}</div>) }
function AddTask() { const { add } = useContext(TaskCtx), nav = useNavigate(), [f, setF] = useState({ header: '', description: '', priority: 'Medium', category: 'Academic' }), [err, setErr] = useState('')
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = e => { e.preventDefault(); if (!f.header.trim()) return setErr('Task header is required.'); add(f); nav('/tasks') }
  return (<form className="form" onSubmit={submit}><h2>Add task</h2><input placeholder="Task header" value={f.header} onChange={set('header')} />
    <textarea placeholder="Task description" value={f.description} onChange={set('description')} />
    <select value={f.priority} onChange={set('priority')}>{['High', 'Medium', 'Low'].map(x => <option key={x}>{x}</option>)}</select>
    <select value={f.category} onChange={set('category')}>{['Academic', 'Personal'].map(x => <option key={x}>{x}</option>)}</select>
    <p>Due: 28 Aug 2026 · Raised time is recorded automatically.</p>{err && <p className="err">{err}</p>}<button>Save task</button></form>) }
function Details() { const { id } = useParams(), { tasks, update } = useContext(TaskCtx), t = tasks.find(x => x.id === +id)
  if (!t) return <p>Task not found. <Link to="/tasks">Back to tasks</Link></p>
  return (<div className="card wide"><h2>{t.header}</h2><p>{t.description || 'No description.'}</p><p>Priority: {t.priority} · Category: {t.category}</p>
    <p>Raised: {fmt(t.raised)}</p><p>Due: 28 Aug 2026</p><p>Status: {t.status}</p>
    <button disabled={t.status === 'Closed'} onClick={() => update(t.id, { status: 'Closed' })}>Mark complete</button></div>) }
const Completed = () => { const { tasks } = useContext(TaskCtx), list = tasks.filter(t => t.status === 'Closed')
  return (<div><h2>Completed tasks</h2>{list.length ? list.map(t => <div className="card" key={t.id}><Link to={`/tasks/${t.id}`}>{t.header}</Link></div>) : <p>Nothing completed yet.</p>}</div>) }
function Shell() { const { user, logout } = useContext(AuthCtx)
  return (<div className="page"><header className="bar"><h1>Task Manager</h1>{user && <><nav className="row">{[['/', 'Dashboard'], ['/tasks', 'Tasks'], ['/add', 'Add Task'], ['/completed', 'Completed']].map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}</nav><button onClick={logout}>Log out</button></>}</header>
    <Outlet /></div>) }
export default function TaskApp() {
  return (<HashRouter><AuthProvider><TaskProvider><Routes><Route element={<Shell />}>
    <Route path="/login" element={<Login />} />
    <Route element={<Protected />}><Route index element={<Dashboard />} /><Route path="tasks" element={<Tasks />} /><Route path="tasks/:id" element={<Details />} /><Route path="add" element={<AddTask />} /><Route path="completed" element={<Completed />} /></Route>
    <Route path="*" element={<Navigate to="/" />} /></Route></Routes></TaskProvider></AuthProvider></HashRouter>)
}
