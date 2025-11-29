import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../lib/pocketbase';

export default function Portal() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Redirect if not logged in
        if (!pocketbase.authStore.isValid) {
            router.push('/login');
            return;
        }

        const fetchJobs = async () => {
            try {
                const records = await pocketbase.collection('jobs').getFullList({
                    sort: '-created',
                    expand: 'company',
                });
                setJobs(records);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                if (error.status === 401) { // Unauthorized
                    pocketbase.authStore.clear();
                    router.push('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [router]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Job Portal</h1>
            <p>Welcome, {pocketbase.authStore.model?.email}</p>
            
            <hr style={{ margin: '20px 0' }} />

            <h2>Available Jobs</h2>
            {jobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
            ) : (
                <ul>
                    {jobs.map((job) => (
                        <li key={job.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', listStyle: 'none' }}>
                            <h3>{job.role}</h3>
                            <p><strong>Company:</strong> {job.expand?.company?.company || 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}