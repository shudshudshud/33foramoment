// pages/api/friends.js
import { getFriendsData, getPodcastsData } from '../../lib/clientData';

export default function handler(req, res) {
  try {
    // Get method from request
    const { method } = req;
    
    // Only allow GET requests
    if (method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get query parameters
    const { id, podcasts } = req.query;
    
    // Get all friends data
    const friendsData = getFriendsData();
    
    // If ID is provided, return specific friend
    if (id) {
      const friend = friendsData.find(f => f.id === id);
      
      // If friend not found, return 404
      if (!friend) {
        return res.status(404).json({ error: 'Friend not found' });
      }
      
      // If podcasts flag is set, return the podcasts for this friend
      if (podcasts) {
        const allPodcasts = getPodcastsData();
        const friendPodcasts = allPodcasts.filter(p => p.friendId === id);
        
        return res.status(200).json(friendPodcasts);
      }
      
      // Return the friend data
      return res.status(200).json(friend);
    }
    
    // Return all friends
    return res.status(200).json(friendsData);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}