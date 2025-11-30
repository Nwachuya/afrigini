import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../../lib/pocketbase';
import Link from 'next/link';

export default function JobDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchJobDetails = async () => {
            try {
                const record = await pocketbase.collection('jobs').getOne(id, {
                    expand: 'company,department',
                });
                setJob(record);
            } catch (error) {
                console.error("Failed to fetch job details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    if (isLoading) return <p>Loading job details...</p>;
    if (!job) return <p>Job not found.</p>;

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <Link href="/jobs">← Back to all Jobs</Link>
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                {job.expand?.company?.logo ? (
                    <img 
                        src={job.expand.company.logo} 
                        alt={`${job.expand.company.company} logo`}
                        style={{ width: '80px', height: '80px', marginRight: '20px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '80px', height: '80px', marginRight: '20px', backgroundColor: '#eee', borderRadius: '8px' }}></div>
                )}
                <div>
                    <h1 style={{ margin: 0 }}>{job.role}</h1>
                    <p style={{ fontSize: '1.2em', color: '#555', margin: '5px 0' }}>
                        <strong>Company:</strong>{' '}
                        {/* --- FIX: Remove <a> tag and apply style to Link --- */}
                        <Link href={`/companies/${job.expand?.company.id}`} style={{ color: '#0070f3' }}>
                            {job.expand?.company?.company || 'N/A'}
                        </Link>
                    </p>
                    <p style={{ fontSize: '1.2em', color: '#555', margin: '5px 0' }}>
                        <strong>Department(s):</strong>{' '}
                        {job.expand?.department && job.expand.department.length > 0 ? (
                            job.expand.department.map((dep) => dep.department).join(', ')
                        ) : (
                            'N/A'
                        )}
                    </p>
                </div>
            </div>

            <hr style={{ margin: '20px 0' }} />

            <div>
                <h2>Description</h2>
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>

            {job.benefits && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Benefits</h2>
                    <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
                </div>
            )}

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <Link href={`/apply/${job.id}`}>
                    <button style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}>
                        Apply Now
                    </button>
                </Link>
            </div>
        </div>
    );
}