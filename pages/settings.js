import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    quote: '',
    city: '',
    gender: '',
  });

  useEffect(() => {
    async function loadProfile() {
      const ref = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(prev => ({ ...prev, ...snap.data() }));
      }
    }
    if (auth.currentUser) loadProfile().catch(console.error);
  }, []);

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ref = doc(db, 'users', auth.currentUser.uid);
    await setDoc(ref, profile, { merge: true });
    alert('Saved');
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Profile Settings</h1>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={profile.username} onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" value={profile.bio} onChange={handleChange} />
        <input name="quote" placeholder="Personality quote" value={profile.quote} onChange={handleChange} />
        <input name="city" placeholder="City" value={profile.city} onChange={handleChange} />
        <input name="gender" placeholder="Gender" value={profile.gender} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
