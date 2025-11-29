import { useState } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../lib/pocketbase';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('applicant');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Create the user in the 'users' collection
            const newUser = await pocketbase.collection('users').create({
                email,
                password,
                passwordConfirm: password,
            });

            // 2. Create the corresponding profile in the 'profiles' collection
            await pocketbase.collection('profiles').create({
                userID: newUser.id,
                role: role,
            });

            // 3. Redirect to login page on success
            router.push('/login?message=Registration successful, please log in.');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>Register</h1>
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
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                    <option value="applicant">Applicant</option>
                    <option value="company">Company</option>
                    <option value="recruiter">Recruiter</option>
                </select>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px' }}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}