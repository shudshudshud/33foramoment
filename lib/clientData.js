// lib/clientData.js
// This file handles client-side data management for the podcast application

import { friends } from '../data/friends';
import { podcasts } from '../data/podcasts';

// Helper function to safely parse JSON from environment variables
const safeJSONParse = (jsonString, fallback = []) => {
  try {
    return jsonString ? JSON.parse(jsonString) : fallback;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

// Get podcasts data from the data file
export function getPodcastsData() {
  return podcasts;
}

// Get friends data from the data file
export function getFriendsData() {
  return friends;
}

// Verify password is correct - simplified with direct comparison
export function verifyPassword(inputPassword) {
  if (!inputPassword) return false;
  
  // If no hashed password is provided, use environment variable
  const correctPassword = process.env.NEXT_PUBLIC_PASSWORD;
  return inputPassword === correctPassword;
}

// Verify password based on access type - simplified with direct comparison
export function verifyPasswordForAccess(inputPassword, accessType) {
  if (!inputPassword) return false;
  
  // Get the specific password for this access type
  let correctPassword;
  
  switch (accessType) {
    case 'me':
      correctPassword = process.env.NEXT_PUBLIC_OWNER_PASSWORD;
      break;
    case 'partner':
      correctPassword = process.env.NEXT_PUBLIC_PARTNER_PASSWORD;
      break;
    case 'friend':
      // This is handled separately by verifyFriendPassword
      return false;
    default:
      // Default to the original password for backward compatibility
      correctPassword = process.env.NEXT_PUBLIC_PASSWORD;
  }
  
  return inputPassword === correctPassword;
}

// Helper function to convert friend ID to environment variable format
const getFriendEnvVarName = (friendId) => {
  // Convert to uppercase and replace hyphens with underscores
  return `NEXT_PUBLIC_FRIEND_PASSWORD_${friendId.toUpperCase().replace(/-/g, '_')}`;
};

// Verify friend-specific password
export function verifyFriendPassword(inputPassword, friendId) {
  if (!inputPassword || !friendId) return false;
  
  // Get the environment variable for this friend's password
  const envVarName = `NEXT_PUBLIC_FRIEND_PASSWORD_${friendId}`;
  const correctPassword = process.env[envVarName];
  
  if (!correctPassword) {
    console.error(`[ERROR] Missing environment variable: ${envVarName}`);
    return false;
  }
  
  return inputPassword === correctPassword;
}

// Extract file ID from Google Drive URL
export function extractGoogleDriveId(driveUrl) {
  if (!driveUrl) return null;
  
  // Handle multiple Google Drive URL patterns:
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/file/d/FILE_ID/preview
  // - https://drive.google.com/open?id=FILE_ID
  // - https://docs.google.com/uc?id=FILE_ID
  // - https://drive.google.com/uc?export=view&id=FILE_ID
  // - https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  
  // First try the most common pattern with /d/ followed by ID
  const fileIdRegex = /\/d\/([a-zA-Z0-9_-]+)/i;
  const fileIdMatch = driveUrl.match(fileIdRegex);
  
  if (fileIdMatch && fileIdMatch[1]) {
    return fileIdMatch[1];
  }
  
  // Try the id= parameter pattern
  const idParamRegex = /[?&]id=([a-zA-Z0-9_-]+)/i;
  const idParamMatch = driveUrl.match(idParamRegex);
  
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }
  
  // If we get here, couldn't extract the ID
  console.error('Could not extract Google Drive ID from URL:', driveUrl);
  return null;
}

// Get audio URL from Google Drive ID (direct streaming URL)
export function getGoogleDriveAudioUrl(fileId) {
  if (!fileId) return null;
  
  // Direct streaming URL format for Google Drive
  return `https://docs.google.com/uc?export=download&id=${fileId}`;
}

// Get embed URL from Google Drive ID
export function getGoogleDriveEmbedUrl(fileId) {
  if (!fileId) return null;
  
  // Embed URL format for Google Drive
  return `https://drive.google.com/file/d/${fileId}/preview`;
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

// Get podcast audio URL - Updated to support both direct and embed URLs
export async function getPodcastAudioUrl(id, embedFormat = false) {
  const podcast = await getPodcastById(id);
  if (!podcast) return { url: null };
  
  const fileId = extractGoogleDriveId(podcast.driveUrl);
  
  // Return either the direct streaming URL or embed URL based on the parameter
  const url = embedFormat 
    ? getGoogleDriveEmbedUrl(fileId)
    : getGoogleDriveAudioUrl(fileId);
  
  return { url };
}

// Get all friends
export async function getAllFriends() {
  return getFriendsData();
}

// Get friend by ID
export async function getFriendById(id) {
  const friends = getFriendsData();
  const friend = friends.find(f => f.id === id);
  
  if (!friend) {
    console.error(`[ERROR] Friend not found: ${id}`);
    return null;
  }
  
  return friend;
}

// Get friend's podcasts
export async function getFriendPodcasts(id) {
  const podcasts = getPodcastsData();
  const friendPodcasts = podcasts.filter(p => p.friendId === id);
  
  if (!friendPodcasts.length) {
    console.log(`[INFO] No podcasts found for friend: ${id}`);
  }
  
  return friendPodcasts;
}

// Update podcast access level
export async function updatePodcastAccess(podcastId, newAccessLevel) {
  // This is a placeholder for future implementation
  // In a real app, this would update the database
  console.log(`Updating podcast ${podcastId} access to ${newAccessLevel}`);
  return true;
}