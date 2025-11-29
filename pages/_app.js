import Layout from '../components/Layout';
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