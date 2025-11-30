import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../../lib/pocketbase';
import Link from 'next/link';

export default function CompanyDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [company, setCompany] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchCompanyData = async () => {
            try {
                // 1. Fetch the company details
                const companyRecord = await pocketbase.collection('companies').getOne(id);
                setCompany(companyRecord);

                // 2. Fetch all jobs associated with this company
                const jobsRecords = await pocketbase.collection('jobs').getFullList({
                    filter: `company = "${id}"`,
                    expand: 'department',
                    sort: '-created',
                });
                setCompanyJobs(jobsRecords);
            } catch (error) {
                console.error("Failed to fetch company data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyData();
    }, [id]);

    if (isLoading) {
        return <p>Loading company details...</p>;
    }

    if (!company) {
        return <p>Company not found.</p>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <Link href="/jobs">← Back to all Jobs</Link>
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                {company.logo ? (
                    <img 
                        src={company.logo} 
                        alt={`${company.company} logo`}
                        style={{ width: '100px', height: '100px', marginRight: '20px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100px', height: '100px', marginRight: '20px', backgroundColor: '#eee', borderRadius: '8px' }}></div>
                )}
                <div>
                    <h1 style={{ margin: 0 }}>{company.company}</h1>
                    {company.website && (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
                            Visit Website
                        </a>
                    )}
                </div>
            </div>

            {company.about && (
                <div style={{ marginTop: '30px' }}>
                    <h2>About Us</h2>
                    <p>{company.about}</p>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <h2>Open Positions at {company.company}</h2>
                {companyJobs.length === 0 ? (
                    <p>No open positions at the moment.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {companyJobs.map((job) => (
                            <li key={job.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
                                <Link href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3>{job.role}</h3>
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
        </div>
    );
}