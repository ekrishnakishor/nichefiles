// src/client.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'loxotint', 
  dataset: 'production',
  useCdn: false, 
  apiVersion: '2024-04-07',
  token: import.meta.env.VITE_SANITY_TOKEN, 
});