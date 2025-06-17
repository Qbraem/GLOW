import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import OutfitCard from '../../components/OutfitCard';

export default function Event() {
  const router = useRouter();
  const { name } = router.query;
  const [outfits, setOutfits] = useState([]);
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    if (!name) return;
    async function fetchOutfits() {
      const q = query(
        collection(db, 'outfits'),
        where('location', '==', name),
        orderBy(sort === 'recent' ? 'createdAt' : 'likeCount', 'desc')
      );
      const snapshot = await getDocs(q);
      setOutfits(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchOutfits().catch(console.error);
  }, [name, sort]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Event: {name}</h1>
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="recent">Most recent</option>
        <option value="likes">Most likes</option>
      </select>
      {outfits.map(o => (
        <OutfitCard key={o.id} outfit={o} />
      ))}
    </div>
  );
}
