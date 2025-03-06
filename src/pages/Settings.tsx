import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useMeeting } from '../context/MeetingContext';
import { getAudioInputs, getVideoInputs } from '../utils/webrtc';

interface Device {
  deviceId: string;
  label: string;
}

const Settings: React.FC = () => {
  const { settings, updateSettings } = useMeeting();
  const [audioInputs, setAudioInputs] = useState<Device[]>([]);
  const [videoInputs, setVideoInputs] = useState<Device[]>([]);
  const [accountId, setAccountId] = useState(settings.accountId);
  const [meetingId, setMeetingId] = useState(settings.meetingId);
  const [passcode, setPasscode] = useState(settings.passcode || '');

  useEffect(() => {
    const loadDevices = async () => {
      const audioDevices = await getAudioInputs();
      const videoDevices = await getVideoInputs();
      setAudioInputs(audioDevices);
      setVideoInputs(videoDevices);
    };

    loadDevices();
  }, []);

  const handleSave = () => {
    updateSettings({
      accountId,
      meetingId,
      passcode: passcode || undefined,
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Account Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account ID"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting ID"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Device Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Device Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Microphone</InputLabel>
                  <Select
                    value={settings.audioInput || ''}
                    label="Microphone"
                    onChange={(e) => updateSettings({ audioInput: e.target.value })}
                  >
                    {audioInputs.map((device) => (
                      <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Camera</InputLabel>
                  <Select
                    value={settings.videoInput || ''}
                    label="Camera"
                    onChange={(e) => updateSettings({ videoInput: e.target.value })}
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
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Settings; 