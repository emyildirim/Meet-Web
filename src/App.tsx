import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { MeetingProvider } from './context/MeetingContext';
import Home from './pages/Home';
import MeetingRoom from './pages/MeetingRoom';
import Settings from './pages/Settings';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MeetingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default App;
