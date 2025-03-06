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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useMeeting } from '../context/MeetingContext';
import { generateMeetingId, generateAccountId, generatePasscode } from '../utils/ids';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setMeeting, setCurrentUser, settings, updateSettings } = useMeeting();
  const [meetingId, setMeetingId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);
  const [newMeetingInfo, setNewMeetingInfo] = useState<{ id: string; passcode: string } | null>(null);

  const handleNewMeeting = async () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }

    const newMeetingId = generateMeetingId();
    const accountId = generateAccountId();
    const meetingPasscode = passcode || generatePasscode(); // Use provided passcode or generate one
    const newUser = {
      id: accountId,
      name,
      isHost: true,
      isMuted: false,
      isVideoOff: false,
    };

    setCurrentUser(newUser);
    updateSettings({ accountId });
    setMeeting({
      id: newMeetingId,
      passcode: meetingPasscode,
      participants: [newUser],
      createdAt: new Date(),
    });

    setNewMeetingInfo({ id: newMeetingId, passcode: meetingPasscode });
    setShowMeetingInfo(true);
  };

  const handleJoinMeeting = () => {
    if (!name || !meetingId) {
      alert('Please enter your name and meeting ID');
      return;
    }

    const accountId = generateAccountId();
    const newUser = {
      id: accountId,
      name,
      isHost: false,
      isMuted: false,
      isVideoOff: false,
    };

    setCurrentUser(newUser);
    updateSettings({ accountId });
    setMeeting({
      id: meetingId,
      passcode,
      participants: [newUser],
      createdAt: new Date(),
    });

    navigate(`/meeting/${meetingId}`);
  };

  const handleJoinNewMeeting = () => {
    if (newMeetingInfo) {
      navigate(`/meeting/${newMeetingInfo.id}`);
    }
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

      <Dialog 
        open={showMeetingInfo} 
        onClose={() => setShowMeetingInfo(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Meeting Information</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Share these details with others to join your meeting:
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Meeting ID: {newMeetingInfo?.id}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
              Passcode: {newMeetingInfo?.passcode}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMeetingInfo(false)} color="inherit">
            Close
          </Button>
          <Button onClick={handleJoinNewMeeting} variant="contained" color="primary">
            Join Meeting
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 