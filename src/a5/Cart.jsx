// Assignment 5 – Shopping cart with useReducer + Context (coupon %, GST 18%)
import { createContext, useContext, useReducer, useState } from 'react'
const products = [{ id: 1, name: 'Milk Can 20L', price: 1200 }, { id: 2, name: 'Organic Fertilizer 50kg', price: 850 }, { id: 3, name: 'Seed Pack', price: 300 }, { id: 4, name: 'Garden Tool Set', price: 1500 }]
const COUPONS = { FARM10: 10, WELCOME20: 20 }, GST = 0.18
const Ctx = createContext()
function reducer(s, a) {
  switch (a.type) {
    case 'add': { const f = s.items.find(i => i.id === a.p.id); return { ...s, items: f ? s.items.map(i => i.id === a.p.id ? { ...i, qty: i.qty + 1 } : i) : [...s.items, { ...a.p, qty: 1 }] } }
    case 'remove': return { ...s, items: s.items.filter(i => i.id !== a.id) }
    case 'qty': return { ...s, items: s.items.map(i => i.id === a.id ? { ...i, qty: Math.max(1, i.qty + a.d) } : i) }
    case 'coupon': return { ...s, pct: a.pct, code: a.code }
    default: return s
  }
}
const ProductList = () => { const { dispatch } = useContext(Ctx); return <div className="grid">{products.map(p => <article className="card" key={p.id}><h3>{p.name}</h3><p>₹{p.price}</p><button onClick={() => dispatch({ type: 'add', p })}>Add to cart</button></article>)}</div> }
function CartView() {
  const { state, dispatch } = useContext(Ctx), [c, setC] = useState(''), [msg, setMsg] = useState('')
  const sub = state.items.reduce((t, i) => t + i.price * i.qty, 0), disc = sub * state.pct / 100, net = sub - disc, gst = net * GST, total = net + gst
  const apply = () => { const pct = COUPONS[c.trim().toUpperCase()]; if (pct) { dispatch({ type: 'coupon', pct, code: c.trim().toUpperCase() }); setMsg(pct + '% off applied.') } else setMsg('Invalid coupon. Try FARM10 or WELCOME20.') }
  return (<section><h2>Cart</h2>{state.items.length === 0 ? <p>Your cart is empty. Add a product above.</p> : <>
    {state.items.map(i => <div className="row line" key={i.id}><span>{i.name}</span><button onClick={() => dispatch({ type: 'qty', id: i.id, d: -1 })}>−</button><b>{i.qty}</b><button onClick={() => dispatch({ type: 'qty', id: i.id, d: 1 })}>+</button><span>₹{(i.price * i.qty).toFixed(2)}</span><button onClick={() => dispatch({ type: 'remove', id: i.id })}>Remove</button></div>)}
    <div className="row"><input value={c} onChange={e => setC(e.target.value)} placeholder="Coupon code" /><button onClick={apply}>Apply coupon</button><span>{msg}</span></div>
    <p>Subtotal: ₹{sub.toFixed(2)}</p>{state.pct > 0 && <p>Discount ({state.code}, {state.pct}%): −₹{disc.toFixed(2)}</p>}
    <p>GST (18%): ₹{gst.toFixed(2)}</p><h3>Grand total: ₹{total.toFixed(2)}</h3></>}</section>)
}
export default function Cart() {
  const [state, dispatch] = useReducer(reducer, { items: [], pct: 0, code: '' })
  return (<Ctx.Provider value={{ state, dispatch }}><div className="page"><header className="bar"><h1>Farm Shop</h1></header><ProductList /><CartView /></div></Ctx.Provider>)
}
