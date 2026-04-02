import { useEffect, useState } from 'react'
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'
import AddForm from './AddForm'

function App() {
  const [ads, setAds] = useState([])
  const [screen, setScreen] = useState('feed')
  const [filter, setFilter] = useState(null)

  const fetchAds = async () => {
    const snapshot = await getDocs(collection(db, 'ads'))
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setAds(list)
  }

  useEffect(() => {
    fetchAds()
  }, [])

  if (screen === 'add') {
    return <AddForm onBack={() => { setScreen('feed'); fetchAds() }} />
  }

  return (
    <div style={{ maxWidth: '390px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '22px', margin: 0 }}>Kolda</h1>
        <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>Алматы</p>
      </div>

      <div style={{ padding: '16px' }}>
        <input placeholder="Поиск объявлений..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
      </div>
<div style={{ padding: '0 16px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
  {[
    { label: 'Продам', bg: '#E1F5EE', color: '#0F6E56' },
    { label: 'Услуги', bg: '#E6F1FB', color: '#185FA5' },
    { label: 'Соседи', bg: '#FAEEDA', color: '#854F0B' },
    { label: 'Совмест.', bg: '#EEEDFE', color: '#534AB7' }
  ].map(cat => (
    <span key={cat.label} onClick={() => setFilter(filter === cat.label ? null : cat.label)} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: filter === cat.label ? cat.color : cat.bg, color: filter === cat.label ? '#fff' : cat.color }}>
      {cat.label}
    </span>
  ))}
</div>

      <div style={{ padding: '0 16px 100px' }}>
        {ads.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Объявлений пока нет</p>
        ) : (
          ads.filter(ad => !filter || ad.category === filter).map(ad => (
            <div key={ad.id} style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
  <p style={{ margin: '0 0 4px', fontWeight: 500 }}>{ad.title}</p>
  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888' }}>{ad.district} · {ad.price}</p>
  <span style={{
    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
    background: ad.category === 'Продам' ? '#E1F5EE' : ad.category === 'Услуги' ? '#E6F1FB' : ad.category === 'Соседи' ? '#FAEEDA' : '#EEEDFE',
    color: ad.category === 'Продам' ? '#0F6E56' : ad.category === 'Услуги' ? '#185FA5' : ad.category === 'Соседи' ? '#854F0B' : '#534AB7'
  }}>{ad.category}</span>
</div>
          ))
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '390px', background: '#fff', borderTop: '1px solid #eee', display: 'flex', padding: '12px 0 24px' }}>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#534AB7', fontWeight: 500 }}>Лента</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>Поиск</div>
        <div onClick={() => setScreen('add')} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#534AB7', fontWeight: 500, cursor: 'pointer' }}>+ Добавить</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>Мои</div>
      </div>
    </div>
  )
}

export default App