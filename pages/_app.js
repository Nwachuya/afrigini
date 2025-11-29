import Layout from '../components/layout';
import '../styles/globals.css';

// This function wraps every page component in your application
function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;