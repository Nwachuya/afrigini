import { useState, useEffect } from 'react';
import pocketbase from '../../lib/pocketbase';
import Link from 'next/link';

export default function JobsListPage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    if (isLoading) {
        return <p>Loading jobs...</p>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1>Available Jobs</h1>
            <p>Browse through the latest job openings.</p>
            
            <hr style={{ margin: '20px 0' }} />

            {jobs.length === 0 ? (
                <p>No jobs are available at the moment. Check back soon!</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {jobs.map((job) => (
                        <li key={job.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
                            <Link href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    {job.expand?.company?.logo ? (
                                        <img 
                                            src={job.expand.company.logo} 
                                            alt={`${job.expand.company.company} logo`}
                                            style={{ width: '50px', height: '50px', marginRight: '15px', borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', marginRight: '15px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
                                    )}
                                    <h3 style={{ margin: 0 }}>{job.role}</h3>
                                </div>
                                
                                <p>
                                    <strong>Company:</strong>{' '}
                                    {/* --- FIX: Remove <a> tag and apply style to Link --- */}
                                    <Link href={`/companies/${job.expand?.company.id}`} style={{ color: '#0070f3' }}>
                                        {job.expand?.company?.company || 'N/A'}
                                    </Link>
                                </p>
                                <p>
                                    <strong>Department(s):</strong>{' '}
                                    {job.expand?.department && job.expand.department.length > 0 ? (
                                        job.expand.department.map((dep) => dep.department).join(', ')
                                    ) : (
                                        'N/A'
                                    )}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}