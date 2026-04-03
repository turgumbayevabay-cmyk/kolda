import { useEffect, useState } from 'react'
import { db, auth, googleProvider } from './firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged, signOut, signInWithRedirect } from 'firebase/auth'
import AddForm from './AddForm'

function LoginScreen({ onBack }) {
  return (
    <div style={{ maxWidth: '390px', margin: '0 auto', fontFamily: 'sans-serif', padding: '80px 24px 0' }}>
      <span onClick={onBack} style={{ display: 'block', cursor: 'pointer', fontSize: '18px', marginBottom: '40px' }}>←</span>
      <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>Войти в Kolda</h1>
      <p style={{ color: '#888', fontSize: '14px', margin: '0 0 40px', textAlign: 'center' }}>Чтобы добавить объявление нужен аккаунт</p>
      <button onClick={() => signInWithRedirect(auth, googleProvider)} style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto', padding: '14px 24px', borderRadius: '12px', border: '1px solid #ddd', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Войти через Google
      </button>
      <p style={{ color: '#bbb', fontSize: '12px', marginTop: '24px', textAlign: 'center' }}>После входа нажми "+ Добавить" снова</p>
    </div>
  )
}

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

  const handleAddClick = () => {
    if (user) {
      setScreen('add')
    } else {
      setScreen('login')
    }
  }

  if (screen === 'login') return <LoginScreen onBack={() => setScreen('feed')} />
  if (screen === 'add') return <AddForm onBack={() => { setScreen('feed'); fetchAds() }} user={user} />

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