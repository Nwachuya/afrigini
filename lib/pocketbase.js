import PocketBase from 'pocketbase';

// Directly using your live PocketBase URL
const pb = new PocketBase('https://afpb.canvass.africa');

// Disable auto-cancelation for better UX in React
pb.autoCancellation(false);

export default pb;