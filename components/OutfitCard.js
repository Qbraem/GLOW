import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function OutfitCard({ outfit }) {
  const [loveCount, setLoveCount] = useState(0);
  const [flameCount, setFlameCount] = useState(0);
  const [userLoveId, setUserLoveId] = useState(null);
  const [userFlameId, setUserFlameId] = useState(null);

  useEffect(() => {
    async function fetchLikes() {
      const qLove = query(collection(db, 'likes'), where('outfitId', '==', outfit.id), where('type', '==', 'love'));
      const qFlame = query(collection(db, 'likes'), where('outfitId', '==', outfit.id), where('type', '==', 'flame'));

      const [snapLove, snapFlame] = await Promise.all([getDocs(qLove), getDocs(qFlame)]);
      setLoveCount(snapLove.size);
      setFlameCount(snapFlame.size);

      const user = auth.currentUser;
      if (user) {
        snapLove.forEach(d => { if (d.data().userId === user.uid) setUserLoveId(d.id); });
        snapFlame.forEach(d => { if (d.data().userId === user.uid) setUserFlameId(d.id); });
      }
    }
    fetchLikes().catch(console.error);
  }, [outfit.id]);

  async function toggle(type) {
    const user = auth.currentUser;
    if (!user) return alert('Login first');
    const existingId = type === 'love' ? userLoveId : userFlameId;

    if (existingId) {
      await deleteDoc(doc(db, 'likes', existingId));
      if (type === 'love') { setLoveCount(loveCount - 1); setUserLoveId(null); }
      else { setFlameCount(flameCount - 1); setUserFlameId(null); }
    } else {
      const docRef = await addDoc(collection(db, 'likes'), { outfitId: outfit.id, userId: user.uid, type });
      if (type === 'love') { setLoveCount(loveCount + 1); setUserLoveId(docRef.id); }
      else { setFlameCount(flameCount + 1); setUserFlameId(docRef.id); }
    }
  }

  return (
    <div style={{ border: '1px solid #333', padding: '1rem', margin: '1rem 0' }}>
      <img src={outfit.imageURL} alt="outfit" style={{ width: '100%' }} />
      <p>{outfit.hashtags?.join(' ')}</p>
      <p>{outfit.city}</p>
      <button onClick={() => toggle('flame')}>🔥 {flameCount}</button>
      <button onClick={() => toggle('love')}>❤️ {loveCount}</button>
    </div>
  );
}
