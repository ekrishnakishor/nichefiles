// src/client.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'loxotint', 
  dataset: 'production',
  // 1. MUST be false. You cannot write data to a cached CDN!
  useCdn: false, 
  apiVersion: '2024-04-07', 
  token: import.meta.env.VITE_SANITY_TOKEN, 
});