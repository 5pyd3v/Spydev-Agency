import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

// The local/system DNS resolver on some networks refuses SRV queries (used by
// `mongodb+srv://` URIs), even though A/AAAA lookups work fine. Point this
// process's resolver at public DNS so Atlas SRV discovery doesn't fail with
// ECONNREFUSED — this only affects this Node process, not the OS.
if (env.MONGO_URI.startsWith('mongodb+srv://')) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

export async function connectDB(): Promise<void> {
  mongoose.connection.on('connected', () => {
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  await mongoose.connect(env.MONGO_URI);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
