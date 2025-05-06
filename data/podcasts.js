export const podcasts = [
  {
    id: "podcast-malcolm",
    title: "Conversation with Malcolm",
    description: "We talk about mainly professional stuff tbh",
    friendId: "malcolm",
    accessLevel: "me",
    recordedDate: "2025-04-27",
    duration: "42:18",
    coverImage: "/images/default-cover.jpg",
    driveUrl: process.env.NEXT_PUBLIC_DRIVE_URL_MALCOLM
  },
  {
    id: "podcast-venessa",
    title: "Conversation with Venessa",
    description: "Lady's a supermom and super professional",
    friendId: "venessa",
    accessLevel: "partner",
    recordedDate: "2025-04-24",
    duration: "38:45",
    coverImage: "/images/default-cover.jpg",
    driveUrl: process.env.NEXT_PUBLIC_DRIVE_URL_VENESSA
  },
  {
    id: "podcast-public-example",
    title: "Introduction to 33 for a Moment",
    description: "An introduction to what this podcast series is all about",
    friendId: "friend-example",
    accessLevel: "public",
    recordedDate: "2025-05-01",
    duration: "15:30",
    coverImage: "/images/default-cover.jpg",
    driveUrl: process.env.NEXT_PUBLIC_DRIVE_URL_FRIEND_EXAMPLE
  }
]; 