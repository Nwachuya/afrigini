import { useState } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../lib/pocketbase';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // --- CHANGE: Set the default role to the capitalized version ---
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
            const newUser = await pocketbase.collection('users').create({
                email,
                password,
                passwordConfirm: password,
            });

            // 2. Create the corresponding profile in the 'profiles' collection
            await pocketbase.collection('profiles').create({
                userID: newUser.id,
                role: role, // This will now send the correctly capitalized value
            });

            // 3. Redirect to login page on success
            router.push('/login?message=Registration successful, please log in.');

        } catch (err) {
            console.error(err);
            setError('Registration failed. Please check the console for details.');
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
                    {/* --- CHANGE: Update the option values to be capitalized --- */}
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