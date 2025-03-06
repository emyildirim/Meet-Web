# Meet - Simple Video Conferencing Web App

A simplified Zoom-like web application built using React and TypeScript. This application provides essential video conferencing features like audio/video controls, participant views, chat, and screen sharing.

## Features

- ✅ New Meeting & Join Meeting – Generate a unique meeting ID or enter an existing one to join
- ✅ Audio & Video Controls – Enable/disable microphone and camera
- ✅ Participants Panel – Two layouts for viewing meeting participants
- ✅ Chat – A simple text chat within the meeting
- ✅ Screen Sharing – Basic screen-sharing functionality
- ✅ Audio/Video Settings – Simple settings to select input/output devices
- ✅ Meeting Credentials – Users will have a Meeting ID, Account ID, and Meeting Passcode (available in settings)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A modern web browser with WebRTC support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meet-web.git
cd meet-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Starting a New Meeting**
   - Enter your name
   - Click "New Meeting"
   - Share the generated Meeting ID with others

2. **Joining a Meeting**
   - Enter your name
   - Enter the Meeting ID
   - Enter the passcode (if required)
   - Click "Join Meeting"

3. **In Meeting**
   - Use the control buttons to toggle audio/video
   - Switch between grid and speaker views
   - Use the chat panel to communicate
   - Share your screen when needed

4. **Settings**
   - Access settings to configure audio/video devices
   - Manage your account and meeting credentials

## Technologies Used

- React
- TypeScript
- Material-UI
- WebRTC
- Simple-Peer
- Socket.IO Client
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
