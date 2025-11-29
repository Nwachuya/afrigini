import { useState } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../lib/pocketbase';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Applicant');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Create the user in the 'users' collection
            await pocketbase.collection('users').create({
                email,
                password,
                passwordConfirm: password,
            });

            // 2. IMPORTANT: Manually authenticate the new user
            await pocketbase.collection('users').authWithPassword(email, password);

            // 3. Create the corresponding profile in the 'profiles' collection
            //    The user is now authenticated, so this request will pass the API rule.
            await pocketbase.collection('profiles').create({
                userID: pocketbase.authStore.model.id, // Use the ID from the auth store
                role: role,
            });

            // 4. Redirect to the portal on success
            router.push('/portal');

        } catch (err) {
            console.error("Registration Error:", err);
            setError(err.data?.message || err.message || 'An unknown error occurred.');
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
                    placeholder="Password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                    <option value="Applicant">Applicant</option>
                    <option value="Company">Company</option>
                    <option value="Recruiter">Recruiter</option>
                </select>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px' }}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}