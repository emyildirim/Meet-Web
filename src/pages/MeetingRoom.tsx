import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  IconButton,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  GridView,
  Person,
  Send,
  ExitToApp,
} from '@mui/icons-material';
import { useMeeting } from '../context/MeetingContext';
import { getMediaStream, getScreenStream, stopStream } from '../utils/webrtc';
import { ChatMessage } from '../types';

const MeetingRoom: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    meeting,
    messages,
    addMessage,
    toggleMute,
    toggleVideo,
    layout,
    setLayout,
  } = useMeeting();
  const [message, setMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!currentUser || !meeting) {
      navigate('/');
      return;
    }

    const initializeMedia = async () => {
      try {
        const stream = await getMediaStream();
        currentUser.stream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    return () => {
      if (currentUser.stream) {
        stopStream(currentUser.stream);
      }
    };
  }, [currentUser, meeting, navigate]);

  const handleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        if (screenShareRef.current?.srcObject) {
          stopStream(screenShareRef.current.srcObject as MediaStream);
          screenShareRef.current.srcObject = null;
        }
      } else {
        const stream = await getScreenStream();
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error handling screen share:', error);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !currentUser) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: message,
      timestamp: new Date(),
    };

    addMessage(newMessage);
    setMessage('');
  };

  const handleLeaveMeeting = () => {
    if (currentUser?.stream) {
      stopStream(currentUser.stream);
    }
    navigate('/');
  };

  if (!currentUser || !meeting) return null;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          {/* Video Grid */}
          <Box sx={{ flex: 1, position: 'relative', bgcolor: 'black', borderRadius: 1 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={currentUser.isMuted}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: currentUser.isVideoOff ? 'none' : 'block',
              }}
            />
            {currentUser.isVideoOff && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                }}
              >
                <Typography variant="h4">{currentUser.name}</Typography>
              </Box>
            )}
          </Box>

          {/* Controls */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton
              color={currentUser.isMuted ? 'error' : 'primary'}
              onClick={toggleMute}
              size="large"
            >
              {currentUser.isMuted ? <MicOff /> : <Mic />}
            </IconButton>
            <IconButton
              color={currentUser.isVideoOff ? 'error' : 'primary'}
              onClick={toggleVideo}
              size="large"
            >
              {currentUser.isVideoOff ? <VideocamOff /> : <Videocam />}
            </IconButton>
            <IconButton
              color={isScreenSharing ? 'primary' : 'default'}
              onClick={handleScreenShare}
              size="large"
            >
              {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
              size="large"
            >
              {layout === 'grid' ? <Person /> : <GridView />}
            </IconButton>
            <IconButton color="error" onClick={handleLeaveMeeting} size="large">
              <ExitToApp />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Panel */}
        <Paper sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Chat</Typography>
          </Box>
          <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((msg) => (
              <ListItem key={msg.id} alignItems="flex-start">
                <ListItemText
                  primary={msg.senderName}
                  secondary={msg.content}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MeetingRoom; 