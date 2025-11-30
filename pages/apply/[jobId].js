import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import pocketbase from '../../lib/pocketbase';
import Link from 'next/link';

export default function ApplyPage() {
    const router = useRouter();
    const { jobId } = router.query;
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // State for all form fields
    const [coverLetter, setCoverLetter] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [coverLetterFile, setCoverLetterFile] = useState(null);

    useEffect(() => {
        if (!pocketbase.authStore.isValid) {
            router.push(`/login?redirect=${router.asPath}`);
            return;
        }
        if (!jobId) return;

        const fetchJobDetails = async () => {
            try {
                const record = await pocketbase.collection('jobs').getOne(jobId, {
                    expand: 'company',
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

    const handleFileChange = (e, setter) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess(false);

        // --- THIS IS THE FIX ---
        // Create a FormData object to handle file uploads. This is the ONLY way to send files.
        const formData = new FormData();
        
        // Append all text fields with the correct names from your schema
        formData.append('applicantID', pocketbase.authStore.model.id);
        formData.append('jobID', jobId);
        formData.append('stage', 'Applied'); // Set the initial stage
        if (coverLetter) formData.append('coverLetter', coverLetter);
        if (videoURL) formData.append('videoURL', videoURL);
        
        // Append files if they exist
        if (resumeFile) formData.append('resumefile', resumeFile);
        if (coverLetterFile) formData.append('coverLetterFile', coverLetterFile);

        // --- DEBUGGING LOG ---
        // Log the FormData contents to the console to verify it before sending.
        // This will help you confirm if the issue is on the client-side or server-side.
        console.log("Submitting FormData:", formData);
        
        try {
            await pocketbase.collection('applications').create(formData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/portal');
            }, 2500);
        } catch (err) {
            console.error("Failed to submit application:", err);
            setError(err.data?.message || err.message || 'Failed to submit application. Please try again.');
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

    if (success) {
        return (
            <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
                <h1>Application Submitted!</h1>
                <p>Thank you for applying for the <strong>{job.role}</strong> position at <strong>{job.expand?.company?.company}</strong>.</p>
                <p>Your application has been received and is under review.</p>
                <Link href="/portal">
                    <button style={{ padding: '10px 20px' }}>Go to Your Portal</button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <Link href="/jobs">← Back to all Jobs</Link>
            
            <h1>Apply for: {job.role}</h1>
            <p style={{ fontSize: '1.2em', color: '#555' }}>
                <strong>Company:</strong> {job.expand?.company?.company || 'N/A'}
            </p>

            <hr style={{ margin: '20px 0' }} />
            
            <form onSubmit={handleSubmit}>
                <h2>Cover Letter</h2>
                <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you are a great fit..."
                    rows="8"
                    style={{ width: '100%', marginBottom: '20px', padding: '10px' }}
                />

                <h2>Video Introduction (Optional)</h2>
                <input
                    type="url"
                    value={videoURL}
                    onChange={(e) => setVideoURL(e.target.value)}
                    placeholder="Link to a short video introduction..."
                    style={{ width: '100%', marginBottom: '20px', padding: '10px' }}
                />
                
                <h2>Upload Documents</h2>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="resumeFile">Resume (PDF, DOC, DOCX)</label>
                    <input
                        type="file"
                        id="resumeFile"
                        onChange={(e) => handleFileChange(e, setResumeFile)}
                        accept=".pdf,.doc,.docx"
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="coverLetterFile">Cover Letter File (Optional)</label>
                    <input
                        type="file"
                        id="coverLetterFile"
                        onChange={(e) => handleFileChange(e, setCoverLetterFile)}
                        accept=".pdf,.doc,.docx"
                        style={{ width: '100%' }}
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', fontSize: '16px' }}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
}