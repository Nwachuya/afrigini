import { useState, useEffect } from 'react';
import pocketbase from '../../lib/pocketbase';
import Link from 'next/link';

export default function CompaniesListPage() {
    const [companies, setCompanies] = useState([]);
    const [jobCounts, setJobCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch all companies
                const companiesRecords = await pocketbase.collection('companies').getFullList({
                    sort: 'company',
                });

                // 2. Fetch all jobs to count them per company
                const jobsRecords = await pocketbase.collection('jobs').getFullList({
                    fields: 'company', // Only fetch the company ID to save bandwidth
                });

                // 3. Create a map of job counts per company ID
                const counts = jobsRecords.reduce((acc, job) => {
                    acc[job.company] = (acc[job.company] || 0) + 1;
                    return acc;
                }, {});

                setCompanies(companiesRecords);
                setJobCounts(counts);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <p>Loading companies...</p>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <h1>Companies</h1>
            <p>Discover great places to work.</p>
            
            <hr style={{ margin: '20px 0' }} />

            {companies.length === 0 ? (
                <p>No companies found.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {companies.map((company) => (
                        <Link href={`/companies/${company.id}`} key={company.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div 
                                key={company.id} 
                                style={{ 
                                    border: '1px solid #ddd', 
                                    borderRadius: '8px', 
                                    padding: '20px', 
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {company.logo ? (
                                    <img 
                                        src={company.logo} 
                                        alt={`${company.company} logo`}
                                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', marginBottom: '15px' }}
                                    />
                                ) : (
                                    <div style={{ width: '80px', height: '80px', backgroundColor: '#eee', borderRadius: '8px', margin: '0 auto 15px' }}></div>
                                )}
                                <h3 style={{ margin: '10px 0' }}>{company.company}</h3>
                                <p style={{ color: '#666' }}>
                                    {jobCounts[company.id] || 0} open position{(jobCounts[company.id] || 0) !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}