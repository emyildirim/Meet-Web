import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Meeting, ChatMessage, Settings, LayoutType } from '../types';

interface MeetingContextType {
  currentUser: User | null;
  meeting: Meeting | null;
  messages: ChatMessage[];
  settings: Settings;
  layout: LayoutType;
  setCurrentUser: (user: User | null) => void;
  setMeeting: (meeting: Meeting | null) => void;
  addMessage: (message: ChatMessage) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  setLayout: (layout: LayoutType) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<Settings>({
    accountId: '',
    meetingId: '',
  });
  const [layout, setLayout] = useState<LayoutType>('grid');

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleMute = useCallback(() => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
    }
  }, [currentUser]);

  const toggleVideo = useCallback(() => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null);
    }
  }, [currentUser]);

  return (
    <MeetingContext.Provider
      value={{
        currentUser,
        meeting,
        messages,
        settings,
        layout,
        setCurrentUser,
        setMeeting,
        addMessage,
        updateSettings,
        setLayout,
        toggleMute,
        toggleVideo,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
}; 