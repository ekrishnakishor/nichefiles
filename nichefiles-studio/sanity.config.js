// sanity.config.js
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { codeInput } from '@sanity/code-input' // <-- Add this import

export default defineConfig({
  name: 'default',
  title: 'nichefiles-studio',

  projectId: 'loxotint', // (This will be auto-filled for you)
  dataset: 'production',

  plugins: [deskTool(), visionTool(), codeInput()], // <-- Add codeInput() here

  schema: {
    types: schemaTypes,
  },
})