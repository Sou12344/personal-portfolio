// Assignment 4 – Weather Dashboard (OpenWeatherMap). Put your key in .env as VITE_OWM_KEY
import { useState, useEffect } from 'react'
const KEY = import.meta.env.VITE_OWM_KEY
const time = (t, off) => new Date((t + off) * 1000).toUTCString().slice(17, 22)
export default function Weather() {
  const [city, setCity] = useState('Mumbai'), [q, setQ] = useState('Mumbai'), [d, setD] = useState(null), [loading, setLoading] = useState(false), [err, setErr] = useState('')
  useEffect(() => {
    let live = true
    ;(async () => {
      if (!KEY) return setErr('Missing API key. Add VITE_OWM_KEY to a .env file and restart.')
      setLoading(true); setErr('')
      try {
        const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${KEY}`)
        if (r.status === 404) throw new Error('City not found. Check the spelling.')
        if (r.status === 401) throw new Error('Invalid API key (new keys can take a few hours to activate).')
        if (!r.ok) throw new Error('Weather service error (' + r.status + ').')
        const j = await r.json(); if (live) setD(j)
      } catch (e) { if (live) { setD(null); setErr(e.message === 'Failed to fetch' ? 'Network error. Check your connection.' : e.message) } }
      finally { if (live) setLoading(false) }
    })()
    return () => { live = false }
  }, [city])
  return (<div className="page"><header className="bar"><h1>Weather</h1></header>
    <form className="row" onSubmit={e => { e.preventDefault(); q.trim() && setCity(q.trim()) }}><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search city" /><button>Search</button></form>
    {loading && <div className="spinner" role="status" aria-label="Loading" />}
    {err && <p className="err">{err}</p>}
    {d && !loading && <div className="card wide"><h2>{d.name}, {d.sys.country}</h2>
      <img src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`} alt={d.weather[0].description} />
      <p className="big">{Math.round(d.main.temp)}°C</p><p>{d.weather[0].description}</p>
      <p>Humidity: {d.main.humidity}%</p><p>Wind: {d.wind.speed} m/s</p>
      <p>Sunrise: {time(d.sys.sunrise, d.timezone)} · Sunset: {time(d.sys.sunset, d.timezone)} (local)</p></div>}
  </div>)
}
