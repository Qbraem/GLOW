import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#1e1e1e' }}>
      <Link href="/">Home</Link> |{' '}
      <Link href="/upload">Upload</Link> |{' '}
      <Link href="/settings">Settings</Link>
    </nav>
  );
}
