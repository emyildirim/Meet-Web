import { Buffer } from 'buffer';

// Polyfill for simple-peer
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).process = { env: {} };
  (window as any).Buffer = Buffer;
} 