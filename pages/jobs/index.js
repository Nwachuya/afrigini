import { useState, useEffect } from 'react';
import pocketbase from '../../lib/pocketbase';
import Link from 'next/link';

export default function JobsListPage() {
    const [jobs, setJobs] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [allCompanies, setAllCompanies] = useState([]);
    
    // State for filter controls
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [sortBy, setSortBy] = useState('-created'); // Default to newest first
    
    const [isLoading, setIsLoading] = useState(true);

    // Fetch departments and companies for dropdowns
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const departments = await pocketbase.collection('departments').getFullList({ sort: 'department' });
                setAllDepartments(departments);
                const companies = await pocketbase.collection('companies').getFullList({ sort: 'company' });
                setAllCompanies(companies);
            } catch (error) {
                console.error("Failed to fetch filter data:", error);
            }
        };
        fetchFilterData();
    }, []);

    // Main function to fetch jobs based on current filters
    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const filterParts = [];

            // 1. Backend filters (always applied)
            filterParts.push(`stage = "Open"`);
            filterParts.push(`expires > "${new Date().toISOString()}"`);

            // 2. Frontend filters (applied if selected)
            if (searchTerm) {
                filterParts.push(`role ~ "${searchTerm}"`);
            }
            if (selectedDepartment) {
                filterParts.push(`department = "${selectedDepartment}"`);
            }
            if (selectedCompany) {
                filterParts.push(`company = "${selectedCompany}"`);
            }

            const finalFilter = filterParts.join(' && ');

            const records = await pocketbase.collection('jobs').getFullList({
                filter: finalFilter,
                sort: sortBy,
                expand: 'company,department',
            });
            setJobs(records);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Re-fetch jobs whenever any filter state changes
    useEffect(() => {
        fetchJobs();
    }, [searchTerm, selectedDepartment, selectedCompany, sortBy]);

    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
            <h1>Available Jobs</h1>
            <p>Browse and filter through the latest job openings.</p>
            
            {/* --- FILTER UI --- */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                padding: '20px', 
                backgroundColor: '#f9f9f9', 
                borderRadius: '8px', 
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <input 
                    type="text"
                    placeholder="Search by role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: '1', minWidth: '200px', padding: '10px' }}
                />
                <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    style={{ padding: '10px' }}
                >
                    <option value="">All Departments</option>
                    {allDepartments.map((dep) => (
                        <option key={dep.id} value={dep.id}>{dep.department}</option>
                    ))}
                </select>
                <select 
                    value={selectedCompany} 
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    style={{ padding: '10px' }}
                >
                    <option value="">All Companies</option>
                    {allCompanies.map((comp) => (
                        <option key={comp.id} value={comp.id}>{comp.company}</option>
                    ))}
                </select>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '10px' }}
                >
                    <option value="-created">Newest First</option>
                    <option value="created">Oldest First</option>
                    <option value="role">Role (A-Z)</option>
                    <option value="-role">Role (Z-A)</option>
                </select>
            </div>

            <hr style={{ margin: '20px 0' }} />

            {isLoading ? (
                <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
                <p>No jobs found matching your criteria.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {jobs.map((job) => (
                        <li key={job.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
                            {/* --- FIX: Link for the whole card --- */}
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
                                    {/* --- FIX: Separate, non-nested Link for the company --- */}
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