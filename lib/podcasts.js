import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_PODCAST_API_URL;

export async function getAllPodcasts() {
  const response = await fetch(`${API_URL}/podcasts`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch podcasts');
  }

  return response.json();
}

export async function getPodcastById(id) {
  const response = await fetch(`${API_URL}/podcasts/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch podcast');
  }

  return response.json();
}

export async function getPodcastAudioUrl(id) {
  const response = await fetch(`${API_URL}/podcasts/${id}/audio`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch podcast audio');
  }

  return response.json();
} 