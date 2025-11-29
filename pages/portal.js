import { useEffect } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../lib/pocketbase';
import Link from 'next/link';

export default function Portal() {
    const router = useRouter();

    useEffect(() => {
        // Redirect if not logged in
        if (!pocketbase.authStore.isValid) {
            router.push('/login');
        }
    }, [router]);

    const user = pocketbase.authStore.model;

    return (
        <div>
            <h1>Welcome to Your Portal</h1>
            <p>
                You are logged in as <strong>{user?.email}</strong>.
            </p>
            <div style={{ marginTop: '20px' }}>
                <Link href="/jobs">
                    <button style={{ padding: '10px 20px', fontSize: '16px' }}>View All Jobs</button>
                </Link>
            </div>
        </div>
    );
}