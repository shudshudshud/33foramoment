// lib/clientData.js
// This file handles client-side data management for the podcast application
import CryptoJS from 'crypto-js';

// Helper function to safely parse JSON from environment variables
const safeJSONParse = (jsonString, fallback = []) => {
  try {
    return jsonString ? JSON.parse(jsonString) : fallback;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

// Get podcast data from environment or use defaults
export function getPodcastsData() {
  // For client-side, use window if available
  if (typeof window !== 'undefined' && window.__PODCASTS_DATA__) {
    return window.__PODCASTS_DATA__;
  }
  
  // For server-side rendering
  const envData = process.env.INITIAL_PODCASTS_DATA;
  
  const defaultPodcasts = [
    {
      id: "podcast-example",
      title: "Example Podcast",
      description: "This is an example podcast",
      friendId: "friend-example",
      driveUrl: "https://drive.google.com/file/d/EXAMPLE_ID/preview",
      accessLevel: "public",
      recordedDate: "2025-04-01",
      duration: "15:00",
      coverImage: "/images/default-cover.jpg"
    }
  ];
  
  return safeJSONParse(envData, defaultPodcasts);
}

// Get friends data from environment or use defaults
export function getFriendsData() {
  // For client-side, use window if available
  if (typeof window !== 'undefined' && window.__FRIENDS_DATA__) {
    return window.__FRIENDS_DATA__;
  }
  
  // For server-side rendering
  const envData = process.env.INITIAL_FRIENDS_DATA;
  
  const defaultFriends = [
    {
      id: "friend-example",
      name: "Example Friend",
      hasResponded: true,
      bio: "This is an example friend profile",
      avatar: "/images/default-avatar.jpg"
    }
  ];
  
  return safeJSONParse(envData, defaultFriends);
}

// Verify password is correct
export function verifyPassword(inputPassword, hashedPassword) {
  if (!hashedPassword) {
    // If no hashed password is provided, use environment variable
    const correctPassword = process.env.NEXT_PUBLIC_PASSWORD;
    return inputPassword === correctPassword;
  }
  
  // If hashed password is provided, compare hash
  const authSecret = process.env.AUTH_SECRET_KEY || 'default_secret_key';
  const hash = CryptoJS.HmacSHA256(inputPassword, authSecret).toString();
  return hash === hashedPassword;
}

// Get audio URL from Google Drive ID
export function getGoogleDriveAudioUrl(fileId) {
  if (!fileId) return null;
  
  // Direct streaming URL format for Google Drive
  return `https://docs.google.com/uc?export=download&id=${fileId}`;
}

// Extract file ID from Google Drive URL
export function extractGoogleDriveId(driveUrl) {
  if (!driveUrl) return null;
  
  // Extract ID from various Google Drive URL formats
  const regex = /(?:file\/d\/|id=|open\?id=)([a-zA-Z0-9_-]+)/;
  const match = driveUrl.match(regex);
  
  return match ? match[1] : null;
}

// Filter podcasts based on access level
export function filterPodcastsByAccess(podcasts, accessLevel) {
  return podcasts.filter(podcast => {
    if (accessLevel === 'me') {
      // Owner can see all podcasts
      return true;
    } else if (accessLevel === 'partner') {
      // Partner can see podcasts marked for partner or public
      return ['partner', 'public'].includes(podcast.accessLevel);
    } else {
      // Public can only see public podcasts
      return podcast.accessLevel === 'public';
    }
  });
}

// Get podcast by ID
export async function getPodcastById(id) {
  const podcasts = getPodcastsData();
  return podcasts.find(p => p.id === id) || null;
}

// Get all podcasts
export async function getAllPodcasts() {
  return getPodcastsData();
}

// Get podcast audio URL
export async function getPodcastAudioUrl(id) {
  const podcast = await getPodcastById(id);
  if (!podcast) return { url: null };
  
  const fileId = extractGoogleDriveId(podcast.driveUrl);
  const url = getGoogleDriveAudioUrl(fileId);
  
  return { url };
}

// Get all friends
export async function getAllFriends() {
  return getFriendsData();
}

// Get friend by ID
export async function getFriendById(id) {
  const friends = getFriendsData();
  return friends.find(f => f.id === id) || null;
}

// Get friend's podcasts
export async function getFriendPodcasts(id) {
  const podcasts = getPodcastsData();
  return podcasts.filter(p => p.friendId === id);
}