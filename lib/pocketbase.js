import PocketBase from 'pocketbase';

// In Codespaces, your PocketBase URL might be different.
// If you are running PocketBase in the same Codespace, this might work.
// If not, you'll need to use the forwarded URL.
const pb = new PocketBase('https://afpb.canvass.africa');

// Disable auto-cancelation for better UX in React
pb.autoCancellation(false);

export default pb;