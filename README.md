# 33foramoment

# 33 For A Moment

A personal podcast project celebrating my 33rd birthday through meaningful conversations with friends.

## 📝 Project Overview

"33 For A Moment" is a web application that allows me to collect and share audio conversations with friends as I turn 33. The platform features:

- **Personal Dashboard**: A private space where I can listen to all conversations
- **Partner Access**: A dedicated page for my partner to listen to approved conversations
- **Friend Pages**: Password-protected pages for each friend to manage their conversation's visibility
- **Public Gallery**: Showcasing conversations that friends have approved for public sharing

The name is inspired by Five for Fighting's "100 Years" lyric: *"I'm 33 for a moment, still the man, but you see I'm a they, a kid on the way, a family on my mind..."*

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Hosting**: [Vercel](https://vercel.com/)
- **Audio Storage**: Google Drive
- **Security**: Client-side authentication with CryptoJS

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- npm or yarn
- A Google account for audio storage
- A [Vercel](https://vercel.com/) account for deployment

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/33foramoment.git
cd 33foramoment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Edit the `.env.local` file with your configuration

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔒 Security

This application uses:

- Client-side authentication for friend pages
- Password hashing with CryptoJS
- Environment variables for sensitive data
- Google Drive's built-in security for audio files

## 🌐 Deployment

The application is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Set up your custom domain (optional)

## 📂 Project Structure

```
33foramoment/
├── components/         # React components
│   ├── Layout/         # Layout components (Header, Footer)
│   ├── AudioPlayer.js  # Custom audio player
│   └── ...
├── lib/                # Utility functions
│   ├── auth.js         # Authentication utilities
│   ├── podcasts.js     # Podcast data handling
│   └── ...
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   ├── me/             # Personal dashboard
│   ├── partner/        # Partner access
│   ├── friends/        # Friend pages
│   └── ...
└── styles/             # CSS modules
```

## 🔄 How It Works

1. **Audio Recording**: Conversations are recorded and uploaded to Google Drive
2. **Friend Access**: Friends receive a unique password-protected URL
3. **Permission Control**: Friends can choose who can listen to their conversation
4. **Listening Experience**: A custom audio player for easy listening

## 👥 Use Cases

- **For Me**: A personal archive of meaningful conversations
- **For Friends**: A way to share thoughts and memories securely
- **For My Partner**: A window into my friendships and connections
- **For the Public**: Access to conversations that have been approved for sharing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Five for Fighting for the inspiring lyrics
- All my friends who've contributed conversations
- The Next.js and Vercel teams for their amazing tools

## 📧 Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

*"I'm 33 for a moment - no kid on the way unfortunately "*
