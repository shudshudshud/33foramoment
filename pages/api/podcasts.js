// pages/api/podcasts.js
import { getPodcastsData, extractGoogleDriveId, getGoogleDriveAudioUrl } from '../../lib/clientData';

// This is a serverless function that will handle podcast data requests
export default function handler(req, res) {
  try {
    // Get method from request
    const { method } = req;
    
    // Only allow GET requests
    if (method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get query parameters
    const { id, audioUrl } = req.query;
    
    // Get all podcast data
    const podcasts = getPodcastsData();
    
    // If ID is provided, return specific podcast
    if (id) {
      const podcast = podcasts.find(p => p.id === id);
      
      // If podcast not found, return 404
      if (!podcast) {
        return res.status(404).json({ error: 'Podcast not found' });
      }
      
      // If audioUrl flag is set, return the audio URL for the podcast
      if (audioUrl) {
        const fileId = extractGoogleDriveId(podcast.driveUrl);
        const url = getGoogleDriveAudioUrl(fileId);
        
        return res.status(200).json({ url });
      }
      
      // Return the podcast data
      return res.status(200).json(podcast);
    }
    
    // Return all podcasts
    return res.status(200).json(podcasts);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}