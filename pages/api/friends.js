import { requireAuth } from '../../lib/auth';
import { getAllFriends, getFriendById, getFriendPodcasts } from '../../lib/friends';

export default async function handler(req, res) {
  try {
    await requireAuth(req, res, async () => {
      if (req.method === 'GET') {
        const { id, podcasts } = req.query;

        if (id) {
          if (podcasts) {
            const friendPodcasts = await getFriendPodcasts(id);
            return res.status(200).json(friendPodcasts);
          }

          const friend = await getFriendById(id);
          return res.status(200).json(friend);
        }

        const friends = await getAllFriends();
        return res.status(200).json(friends);
      }

      res.status(405).json({ error: 'Method not allowed' });
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 