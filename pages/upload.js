import { useState } from 'react';
import { storage, db, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Upload() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState('public');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) return;

    const imageRef = ref(storage, `outfits/${Date.now()}-${image.name}`);
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);

    await addDoc(collection(db, 'outfits'), {
      userId: auth.currentUser.uid,
      imageURL,
      hashtags: hashtags.split(' ').slice(0, 5),
      location,
      eventDate: new Date().toISOString().slice(0, 10),
      createdAt: Timestamp.now(),
      privacy,
    });

    router.push('/');
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Upload Outfit</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setImage(e.target.files[0])} required />
        <input type="text" placeholder="#hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <select value={privacy} onChange={e => setPrivacy(e.target.value)}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
