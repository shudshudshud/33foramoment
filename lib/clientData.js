// lib/clientData.js
// This file handles client-side data management for the podcast application

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
      avatar: "/images/default-avatar.jpg",
      password: "example_password"
    }
  ];
  
  return safeJSONParse(envData, defaultFriends);
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

// Verify friend-specific password - simplified with direct comparison
export function verifyFriendPassword(inputPassword, friendId) {
  if (!inputPassword || !friendId) return false;
  
  // Get all friend data
  const friends = getFriendsData();
  
  // Find the specific friend
  const friend = friends.find(f => f.id === friendId);
  
  // If friend not found or has no password, authentication fails
  if (!friend || !friend.password) return false;
  
  // Compare passwords directly
  return inputPassword === friend.password;
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
  return friends.find(f => f.id === id) || null;
}

// Get friend's podcasts
export async function getFriendPodcasts(id) {
  const podcasts = getPodcastsData();
  return podcasts.filter(p => p.friendId === id);
}

// Update podcast access level
export async function updatePodcastAccess(podcastId, newAccessLevel) {
  // This would typically connect to an API to update the data
  // For this example, we'll just simulate success
  console.log(`Changing podcast ${podcastId} access level to ${newAccessLevel}`);
  
  // In a real implementation, you would update the database or storage
  // For now, we'll return success after a small delay to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}