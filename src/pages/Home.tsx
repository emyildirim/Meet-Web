import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { useMeeting } from '../context/MeetingContext';
import { v4 as uuidv4 } from 'uuid';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setMeeting, setCurrentUser } = useMeeting();
  const [meetingId, setMeetingId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');

  const handleNewMeeting = async () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }

    const newMeetingId = uuidv4();
    const newUser = {
      id: uuidv4(),
      name,
      isHost: true,
      isMuted: false,
      isVideoOff: false,
    };

    setCurrentUser(newUser);
    setMeeting({
      id: newMeetingId,
      participants: [newUser],
      createdAt: new Date(),
    });

    navigate(`/meeting/${newMeetingId}`);
  };

  const handleJoinMeeting = () => {
    if (!name || !meetingId) {
      alert('Please enter your name and meeting ID');
      return;
    }

    const newUser = {
      id: uuidv4(),
      name,
      isHost: false,
      isMuted: false,
      isVideoOff: false,
    };

    setCurrentUser(newUser);
    setMeeting({
      id: meetingId,
      passcode,
      participants: [newUser],
      createdAt: new Date(),
    });

    navigate(`/meeting/${meetingId}`);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Meet
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          A simple video conferencing solution
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              helperText="Leave empty to create a new meeting"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Passcode (Optional)"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleNewMeeting}
              sx={{ mb: 2 }}
            >
              New Meeting
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleJoinMeeting}
              disabled={!meetingId}
            >
              Join Meeting
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home; 