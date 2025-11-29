import PocketBase from 'pocketbase';

// Use the environment variable for the PocketBase URL.
// The '||' part provides a fallback to a local URL for other environments.
const pb = new PocketBase(process.env.POCKETBASE_URL);

// Disable auto-cancelation for better UX in React
pb.autoCancellation(false);

export default pb;