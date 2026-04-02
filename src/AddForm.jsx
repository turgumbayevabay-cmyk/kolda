import { useState } from 'react'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

function AddForm({ onBack }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [district, setDistrict] = useState('')
  const [category, setCategory] = useState('Продам')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !district) return
    setLoading(true)
    await addDoc(collection(db, 'ads'), { title, price, district, category })
    setLoading(false)
    onBack()
  }

  return (
    <div style={{ maxWidth: '390px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '18px' }}>←</span>
        <h1 style={{ fontSize: '18px', margin: 0 }}>Новое объявление</h1>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Продам', 'Услуги', 'Соседи', 'Совмест.'].map(cat => (
            <span key={cat} onClick={() => setCategory(cat)} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: category === cat ? '#534AB7' : '#f0f0f0', color: category === cat ? '#fff' : '#333' }}>
              {cat}
            </span>
          ))}
        </div>

        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Цена (₸)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />

        <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="Район Алматы" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />

        <button onClick={handleSubmit} disabled={loading} style={{ padding: '14px', borderRadius: '10px', border: 'none', background: '#534AB7', color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
          {loading ? 'Публикуем...' : 'Опубликовать'}
        </button>
      </div>
    </div>
  )
}

export default AddForm