import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import OutfitCard from '../../components/OutfitCard';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function fetchProfile() {
      const userRef = doc(db, 'users', id);
      const snap = await getDoc(userRef);
      if (snap.exists()) setUser(snap.data());

      const q = query(collection(db, 'outfits'), where('userId', '==', id));
      const snapshot = await getDocs(q);
      setOutfits(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchProfile().catch(console.error);
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{user.username}</h1>
      <p>{user.bio}</p>
      {outfits.map(o => (
        <OutfitCard key={o.id} outfit={o} />
      ))}
    </div>
  );
}
