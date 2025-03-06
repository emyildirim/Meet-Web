import SimplePeer from 'simple-peer';

export const getMediaStream = async (constraints: MediaStreamConstraints = {
  video: true,
  audio: true,
}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
};

export const getScreenStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    return stream;
  } catch (error) {
    console.error('Error accessing screen share:', error);
    throw error;
  }
};

export const createPeerConnection = (initiator: boolean, stream: MediaStream) => {
  const peer = new SimplePeer({
    initiator,
    trickle: false,
    stream,
  });

  return peer;
};

export const stopStream = (stream: MediaStream) => {
  stream.getTracks().forEach(track => track.stop());
};

export const getAudioInputs = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'audioinput');
  } catch (error) {
    console.error('Error getting audio inputs:', error);
    return [];
  }
};

export const getVideoInputs = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error getting video inputs:', error);
    return [];
  }
}; 