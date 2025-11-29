import { useState, useEffect } from 'react';
import pocketbase from '../lib/pocketbase';
import Link from 'next/link';

export default function HomePage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch all jobs and expand the 'company' relation to show the company name
                const records = await pocketbase.collection('jobs').getFullList({
                    sort: '-created',
                    expand: 'company',
                });
                setJobs(records);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []); // The empty array means this effect runs only once when the component mounts

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1>Welcome to Afrigini</h1>
                <p>Your gateway to amazing career opportunities.</p>
                <div>
                    <Link href="/login">
                        <button style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
                    </Link>
                    <Link href="/register">
                        <button style={{ margin: '10px', padding: '10px 20px' }}>Register</button>
                    </Link>
                </div>
            </header>

            <hr style={{ margin: '40px 0' }} />

            <main>
                <h2>Latest Job Postings</h2>
                {isLoading ? (
                    <p>Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p>No jobs are available at the moment. Check back soon!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {jobs.map((job) => (
                            <li key={job.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
                                <h3>{job.role}</h3>
                                <p>
                                    <strong>Company:</strong> {job.expand?.company?.company || 'N/A'}
                                </p>
                                <p>
                                    <strong>Department:</strong> {job.expand?.department?.department || 'N/A'}
                                </p>
                                {/* To apply, users need to be logged in */}
                                <Link href="/login">
                                    <button style={{ marginTop: '10px' }}>Login to Apply</button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}