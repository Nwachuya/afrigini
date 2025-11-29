import Link from 'next/link';
import pocketbase from '../lib/pocketbase';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Layout = ({ children }) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // This effect will run whenever the route changes
    useEffect(() => {
        setIsLoggedIn(pocketbase.authStore.isValid);
    }, [router.pathname]);

    const handleLogout = () => {
        pocketbase.authStore.clear();
        router.push('/login'); // Redirect to login after logout
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{ background: '#f0f0f0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'black' }}>
                    <h1>Afrigini</h1>
                </Link>
                <nav>
                    {isLoggedIn ? (
                        <>
                            <Link href="/portal" style={{ marginRight: '1rem' }}>Portal</Link>
                            <Link href="/jobs" style={{ marginRight: '1rem' }}>Jobs</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" style={{ marginRight: '1rem' }}>Login</Link>
                            <Link href="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>
            <main style={{ padding: '2rem', flex: 1 }}>
                {children}
            </main>
            <footer style={{ textAlign: 'center', padding: '1rem', background: '#f0f0f0' }}>
                <p>&copy; {new Date().getFullYear()} Afrigini</p>
            </footer>
        </div>
    );
};

export default Layout;