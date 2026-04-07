// src/client.js
import { createClient } from '@sanity/client';

export const client = createClient({
  // You can find your projectId in your sanity.config.js file in the studio folder!
  projectId: 'loxotint', 
  dataset: 'production',
  useCdn: true, // Set to true for faster, cached responses
  apiVersion: '2024-04-07', // Use today's date to use the latest API features
});