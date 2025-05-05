import { requireAuth } from '../../lib/auth';
import { getAllPodcasts, getPodcastById } from '../../lib/podcasts';

export default async function handler(req, res) {
  try {
    await requireAuth(req, res, async () => {
      if (req.method === 'GET') {
        const { id } = req.query;

        if (id) {
          const podcast = await getPodcastById(id);
          return res.status(200).json(podcast);
        }

        const podcasts = await getAllPodcasts();
        return res.status(200).json(podcasts);
      }

      res.status(405).json({ error: 'Method not allowed' });
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 