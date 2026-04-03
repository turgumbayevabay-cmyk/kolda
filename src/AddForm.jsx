import { useState } from 'react'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

function AddForm({ onBack, user }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [district, setDistrict] = useState('')
  const [contact, setContact] = useState('')
  const [category, setCategory] = useState('Продам')
  const [loading, setLoading] = useState(false)

  const districts = ['Алмалы', 'Алатау', 'Бостандык', 'Жетысу', 'Медеу', 'Наурызбай', 'Турксиб']

  const handleSubmit = async () => {
    if (!title || !district || !contact) return alert('Заполни обязательные поля')
    setLoading(true)
    await addDoc(collection(db, 'ads'), {
      title, description, price, district, contact, category,
      userId: user.uid,
      userName: user.displayName,
      createdAt: new Date()
    })
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

        <div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Заголовок *</p>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Детская коляска" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Категория</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Продам', 'Услуги', 'Соседи', 'Совм. покупки'].map(cat => (
              <span key={cat} onClick={() => setCategory(cat)} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: category === cat ? '#534AB7' : '#f0f0f0', color: category === cat ? '#fff' : '#333' }}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Описание</p>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Расскажи подробнее..." rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', resize: 'none' }} />
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Цена (₸)</p>
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Например: 15 000 или Договорная" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Район *</p>
          <select value={district} onChange={e => setDistrict(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', background: '#fff' }}>
            <option value="">Выбери район</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Контакт (WhatsApp) *</p>
          <input value={contact} onChange={e => setContact(e.target.value)} placeholder="+7 700 000 00 00" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ padding: '14px', borderRadius: '10px', border: 'none', background: '#534AB7', color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', marginTop: '4px' }}>
          {loading ? 'Публикуем...' : 'Опубликовать'}
        </button>

      </div>
    </div>
  )
}

export default AddForm