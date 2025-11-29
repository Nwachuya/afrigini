import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../lib/pocketbase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // If user is already logged in, redirect to portal
    useEffect(() => {
        if (pocketbase.authStore.isValid) {
            router.push('/portal');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await pocketbase.collection('users').authWithPassword(email, password);
            router.push('/portal');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>Login</h1>
            {router.query.message && <p style={{ color: 'green' }}>{router.query.message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px' }}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}