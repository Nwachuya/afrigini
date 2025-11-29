import { useState, useEffect } from 'react';
import pocketbase from '../lib/pocketbase';
import Link from 'next/link';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect now runs for everyone, logged in or not
        const fetchJobs = async () => {
            try {
                const records = await pocketbase.collection('jobs').getFullList({
                    sort: '-created',
                    expand: 'company,department',
                });
                setJobs(records);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []); // Removed router dependency as it's no longer needed for the redirect

    if (isLoading) {
        return <p>Loading jobs...</p>;
    }

    return (
        <div>
            <h1>Available Jobs</h1>
            <p>Browse through the latest job openings.</p>
            
            <hr style={{ margin: '20px 0' }} />

            {jobs.length === 0 ? (
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
                            {/* --- CHANGE: Link to a new application page --- */}
                            <Link href={`/apply/${job.id}`}>
                                <button style={{ marginTop: '10px' }}>Apply Now</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}