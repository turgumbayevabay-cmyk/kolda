import { useEffect, useState } from 'react'
import { db, auth } from './firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth'
import { googleProvider } from './firebase'
import AddForm from './AddForm'

function App() {
  const [ads, setAds] = useState([])
  const [screen, setScreen] = useState('feed')
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, u => setUser(u))
    fetchAds()
  }, [])

  const fetchAds = async () => {
    const snapshot = await getDocs(collection(db, 'ads'))
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setAds(list)
  }

  const handleAddClick = async () => {
    if (user) {
      setScreen('add')
    } else {
      await signInWithPopup(auth, googleProvider)
      setScreen('add')
    }
  }

  if (screen === 'add') {
    return <AddForm onBack={() => { setScreen('feed'); fetchAds() }} user={user} />
  }

  return (
    <div style={{ maxWidth: '390px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: 0 }}>Kolda</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '4px 0 0' }}>Алматы</p>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={user.photoURL} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span onClick={() => signOut(auth)} style={{ fontSize: '12px', color: '#888', cursor: 'pointer' }}>Выйти</span>
          </div>
        )}
      </div>

      <div style={{ padding: '16px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск объявлений..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ padding: '0 16px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { label: 'Продам', bg: '#E1F5EE', color: '#0F6E56' },
          { label: 'Услуги', bg: '#E6F1FB', color: '#185FA5' },
          { label: 'Соседи', bg: '#FAEEDA', color: '#854F0B' },
          { label: 'Совм. покупки', bg: '#EEEDFE', color: '#534AB7' }
        ].map(cat => (
          <span key={cat.label} onClick={() => setFilter(filter === cat.label ? null : cat.label)} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: filter === cat.label ? cat.color : cat.bg, color: filter === cat.label ? '#fff' : cat.color }}>
            {cat.label}
          </span>
        ))}
      </div>

      <div style={{ padding: '0 16px 100px' }}>
        {ads.filter(ad => (!filter || ad.category === filter) && (!search || ad.title.toLowerCase().includes(search.toLowerCase()))).length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Объявлений пока нет</p>
        ) : (
          ads.filter(ad => (!filter || ad.category === filter) && (!search || ad.title.toLowerCase().includes(search.toLowerCase()))).map(ad => (
            <div key={ad.id} style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 500 }}>{ad.title}</p>
                {user && ad.userId === user.uid && (
                  <span onClick={async () => { await deleteDoc(doc(db, 'ads', ad.id)); fetchAds() }} style={{ cursor: 'pointer', fontSize: '16px', color: '#ccc', padding: '0 4px' }}>×</span>
                )}
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>{ad.district} · {ad.price}</p>
              {ad.description && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#555', lineHeight: '1.4' }}>{ad.description}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                  background: ad.category === 'Продам' ? '#E1F5EE' : ad.category === 'Услуги' ? '#E6F1FB' : ad.category === 'Соседи' ? '#FAEEDA' : '#EEEDFE',
                  color: ad.category === 'Продам' ? '#0F6E56' : ad.category === 'Услуги' ? '#185FA5' : ad.category === 'Соседи' ? '#854F0B' : '#534AB7'
                }}>{ad.category}</span>
                {ad.contact && (
                  <a href={`https://wa.me/${ad.contact.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#25D366', fontWeight: 500, textDecoration: 'none' }}>WhatsApp →</a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '390px', background: '#fff', borderTop: '1px solid #eee', display: 'flex', padding: '12px 0 24px' }}>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#534AB7', fontWeight: 500 }}>Лента</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>Поиск</div>
        <div onClick={handleAddClick} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#534AB7', fontWeight: 500, cursor: 'pointer' }}>+ Добавить</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>Мои</div>
      </div>
    </div>
  )
}

export default App