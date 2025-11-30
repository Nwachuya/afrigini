import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import pocketbase from '../lib/pocketbase';

const Layout = ({ children }) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const isValid = pocketbase.authStore.isValid;
            setIsLoggedIn(isValid);
            if (isValid) {
                const user = pocketbase.authStore.model;
                setUserRole(user?.role || null);
            } else {
                setUserRole(null);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, [router.pathname]);

    const handleLogout = () => {
        pocketbase.authStore.clear();
        router.push('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Left Sidebar */}
            <aside style={{
                width: isSidebarExpanded ? '240px' : '70px',
                background: '#1a1a1a',
                transition: 'width 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                zIndex: 1000
            }}>
                {/* Logo Section */}
                <div style={{ 
                    padding: '1.5rem', 
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {isSidebarExpanded && (
                        <Link href={isLoggedIn ? "/portal" : "/"} style={{ textDecoration: 'none', color: 'white' }}>
                            <h2 style={{ margin: 0, fontSize: '20px' }}>Afrigini</h2>
                        </Link>
                    )}
                    <button 
                        onClick={toggleSidebar}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '20px',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title={isSidebarExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isSidebarExpanded ? '«' : '»'}
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    {isLoading ? (
                        <div style={{ color: '#888', padding: '1rem', textAlign: 'center' }}>
                            {isSidebarExpanded ? 'Loading...' : '...'}
                        </div>
                    ) : (
                        <div>
                            <Link 
                                href="/jobs" 
                                style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1.25rem',
                                    textDecoration: 'none', 
                                    color: '#e0e0e0',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#2a2a2a'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                title="Jobs"
                            >
                                <span style={{ fontSize: '20px', minWidth: '24px' }}>💼</span>
                                {isSidebarExpanded && <span style={{ marginLeft: '12px' }}>Jobs</span>}
                            </Link>
                            
                            <Link 
                                href="/companies" 
                                style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1.25rem',
                                    textDecoration: 'none', 
                                    color: '#e0e0e0',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#2a2a2a'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                title="Companies"
                            >
                                <span style={{ fontSize: '20px', minWidth: '24px' }}>🏢</span>
                                {isSidebarExpanded && <span style={{ marginLeft: '12px' }}>Companies</span>}
                            </Link>
                            
                            {isLoggedIn && (
                                <>
                                    <div style={{ borderTop: '1px solid #333', margin: '0.5rem 0' }} />
                                    
                                    <Link 
                                        href="/portal" 
                                        style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.75rem 1.25rem',
                                            textDecoration: 'none', 
                                            color: '#e0e0e0',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#2a2a2a'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        title="Portal"
                                    >
                                        <span style={{ fontSize: '20px', minWidth: '24px' }}>🏠</span>
                                        {isSidebarExpanded && <span style={{ marginLeft: '12px' }}>Portal</span>}
                                    </Link>
                                    
                                    {userRole === 'Applicant' && (
                                        <Link 
                                            href="/applications" 
                                            style={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0.75rem 1.25rem',
                                                textDecoration: 'none', 
                                                color: '#e0e0e0',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#2a2a2a'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                            title="My Applications"
                                        >
                                            <span style={{ fontSize: '20px', minWidth: '24px' }}>📄</span>
                                            {isSidebarExpanded && <span style={{ marginLeft: '12px' }}>My Applications</span>}
                                        </Link>
                                    )}
                                    
                                    {(userRole === 'Company' || userRole === 'Recruiter') && (
                                        <Link 
                                            href="/post-job" 
                                            style={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0.75rem 1.25rem',
                                                textDecoration: 'none', 
                                                color: '#e0e0e0',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#2a2a2a'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                            title="Post a Job"
                                        >
                                            <span style={{ fontSize: '20px', minWidth: '24px' }}>➕</span>
                                            {isSidebarExpanded && <span style={{ marginLeft: '12px' }}>Post a Job</span>}
                                        </Link>
                                    )}
                                    
                                    <div style={{ borderTop: '1px solid #333', margin: '0.5rem 0' }} />
                                    
                                    <button 
                                        onClick={handleLogout}
                                        style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.75rem 1.25rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#ff6b6b',
                                            cursor: 'pointer',
                                            width: '100%',
                                            textAlign: 'left',
                                            fontSize: '16px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#2a2a2a'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        title="Logout"
                                    >
                                        <span style={{ fontSize: '20px', minWidth: '24px' }}>🚪</span>
                                        {isSidebarExpanded && <span style={{ marginLeft: '12px' }}>Logout</span>}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                marginLeft: isSidebarExpanded ? '240px' : '70px',
                transition: 'margin-left 0.3s ease'
            }}>
                <main style={{ padding: '2rem', flex: 1, background: '#f5f5f5' }}>
                    {children}
                </main>

                <footer style={{ textAlign: 'center', padding: '1rem', background: '#f0f0f0', borderTop: '1px solid #ddd' }}>
                    <p style={{ margin: 0, color: '#666' }}>&copy; {new Date().getFullYear()} Afrigini</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;