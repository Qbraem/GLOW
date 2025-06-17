import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import OutfitCard from '../components/OutfitCard';

export default function Home() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    async function fetchOutfits() {
      const q = query(collection(db, 'outfits'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setOutfits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchOutfits().catch(console.error);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Home Feed</h1>
      {outfits.map(o => (
        <OutfitCard key={o.id} outfit={o} />
      ))}
    </div>
  );
}
