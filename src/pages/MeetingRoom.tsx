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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useMeeting } from '../context/MeetingContext';
import { getMediaStream, getScreenStream, stopStream, getAudioInputs, getVideoInputs } from '../utils/webrtc';
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
    settings,
    updateSettings,
  } = useMeeting();
  const [message, setMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
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

  useEffect(() => {
    const loadDevices = async () => {
      const audioDevices = await getAudioInputs();
      const videoDevices = await getVideoInputs();
      setAudioInputs(audioDevices);
      setVideoInputs(videoDevices);
    };

    loadDevices();
  }, []);

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

  const handleDeviceChange = async (type: 'audio' | 'video', deviceId: string) => {
    updateSettings(type === 'audio' ? { audioInput: deviceId } : { videoInput: deviceId });
    
    // Restart stream with new device
    if (currentUser?.stream) {
      stopStream(currentUser.stream);
    }
    
    try {
      const newStream = await getMediaStream({
        audio: type === 'audio' ? { deviceId } : true,
        video: type === 'video' ? { deviceId } : true,
      });
      
      if (currentUser) {
        currentUser.stream = newStream;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error switching device:', error);
    }
  };

  const handleToggleMute = () => {
    if (currentUser?.stream) {
      const audioTrack = currentUser.stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = currentUser.isMuted; // Enable if currently muted, disable if currently unmuted
      }
    }
    toggleMute();
  };

  const handleToggleVideo = () => {
    if (currentUser?.stream) {
      const videoTrack = currentUser.stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = currentUser.isVideoOff; // Enable if currently off, disable if currently on
      }
    }
    toggleVideo();
  };

  if (!currentUser || !meeting) return null;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main Content Area */}
        <Box 
          sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}
        >
          {/* Video Grid */}
          <Box sx={{ 
            flex: 1,
            flexDirection: 'column', 
            position: 'relative', 
            bgcolor: 'black', 
            borderRadius: { xs: 2, sm: 3, md: 4 },
            width: {
              xs: '100%',     // Full width on mobile
              sm: '98%',      // 98% width on small screens
              md: '95%',      // 95% width on medium screens
              lg: '90%'       // 90% width on large screens
            },
            height: {
              xs: '60vh',     // 60% of viewport height on mobile
              sm: '70vh',     // 70% of viewport height on small screens
              md: '80vh',     // 80% of viewport height on medium screens
              lg: '85vh'      // 85% of viewport height on large screens
            },
            margin: '0 auto',
            aspectRatio: '16/9',
            overflow: 'hidden'
          }}>
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
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 2,
            borderRadius: 2,
            zIndex: 10,
          }}>
            <IconButton
              color={currentUser.isMuted ? 'error' : 'primary'}
              onClick={handleToggleMute}
              size="large"
            >
              {currentUser.isMuted ? <MicOff /> : <Mic />}
            </IconButton>
            <IconButton
              color={currentUser.isVideoOff ? 'error' : 'primary'}
              onClick={handleToggleVideo}
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
            <IconButton
              color="primary"
              onClick={() => setShowSettings(true)}
              size="large"
            >
              <SettingsIcon />
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

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Meeting Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Meeting Information</Typography>
            <Typography variant="body1" gutterBottom>
              Meeting ID: {meeting?.id}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your Name: {currentUser?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your ID: {currentUser?.id}
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Device Settings</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Microphone</InputLabel>
                  <Select
                    value={settings.audioInput || ''}
                    label="Microphone"
                    onChange={(e) => handleDeviceChange('audio', e.target.value)}
                  >
                    {audioInputs.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Camera</InputLabel>
                  <Select
                    value={settings.videoInput || ''}
                    label="Camera"
                    onChange={(e) => handleDeviceChange('video', e.target.value)}
                  >
                    {videoInputs.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeetingRoom; 