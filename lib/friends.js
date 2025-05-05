import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_FRIENDS_API_URL;

export async function getAllFriends() {
  const response = await fetch(`${API_URL}/friends`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch friends');
  }

  return response.json();
}

export async function getFriendById(id) {
  const response = await fetch(`${API_URL}/friends/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch friend');
  }

  return response.json();
}

export async function getFriendPodcasts(id) {
  const response = await fetch(`${API_URL}/friends/${id}/podcasts`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch friend podcasts');
  }

  return response.json();
} 