import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'loxotint', 
  dataset: 'production',
  useCdn: true, 
  apiVersion: '2024-04-07',
});