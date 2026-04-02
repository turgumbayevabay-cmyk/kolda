import { useEffect, useState } from 'react'
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

function App() {
  const [ads, setAds] = useState([])

  useEffect(() => {
    const fetchAds = async () => {
      const snapshot = await getDocs(collection(db, 'ads'))
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAds(list)
    }
    fetchAds()
  }, [])

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
        <span style={{ background: '#E1F5EE', color: '#0F6E56', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>Продам</span>
        <span style={{ background: '#E6F1FB', color: '#185FA5', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>Услуги</span>
        <span style={{ background: '#FAEEDA', color: '#854F0B', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>Соседи</span>
        <span style={{ background: '#EEEDFE', color: '#534AB7', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>Совмест.</span>
      </div>

      <div style={{ padding: '0 16px 100px' }}>
        {ads.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Объявлений пока нет</p>
        ) : (
          ads.map(ad => (
            <div key={ad.id} style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 500 }}>{ad.title}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{ad.district} · {ad.price}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '390px', background: '#fff', borderTop: '1px solid #eee', display: 'flex', padding: '12px 0 24px' }}>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#534AB7', fontWeight: 500 }}>Лента</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>Поиск</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>+ Добавить</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#888' }}>Мои</div>
      </div>
    </div>
  )
}

export default App