import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../../lib/pocketbase';

export default function ApplyPage() {
    const router = useRouter();
    const { jobId } = router.query; // Gets the jobId from the URL
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // 1. Redirect if not logged in
        if (!pocketbase.authStore.isValid) {
            // Store the intended destination so we can redirect back after login
            router.push(`/login?redirect=${router.asPath}`);
            return;
        }

        // 2. If logged in but jobId is not ready, wait
        if (!jobId) {
            return; 
        }

        // 3. Fetch job details
        const fetchJobDetails = async () => {
            try {
                const record = await pocketbase.collection('jobs').getOne(jobId, {
                    expand: 'company,department',
                });
                setJob(record);
            } catch (err) {
                console.error("Failed to fetch job details:", err);
                setError('Could not find the job you are applying for.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, router]);

    const handleApply = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const user = pocketbase.authStore.model;
            // This assumes you have an 'applications' collection with a 'job' and 'applicant' relation
            await pocketbase.collection('applications').create({
                job: jobId,
                applicant: user.id,
                // You can add more fields here, like a cover letter
            });
            
            alert('Application submitted successfully!');
            router.push('/portal'); // Redirect to user's dashboard after applying

        } catch (err) {
            console.error("Failed to submit application:", err);
            setError(err.message || 'Failed to submit application.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p>Loading application form...</p>;
    }

    if (error && !job) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!job) {
        return <p>Job not found.</p>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h1>Apply for: {job.role}</h1>
            <p><strong>Company:</strong> {job.expand?.company?.company}</p>
            <hr style={{ margin: '20px 0' }} />
            
            <form onSubmit={handleApply}>
                {/* You can add more form fields here, like a cover letter */}
                <p>Are you sure you want to submit your application for this position?</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px' }}>
                    {isSubmitting ? 'Submitting...' : 'Confirm Application'}
                </button>
            </form>
        </div>
    );
}