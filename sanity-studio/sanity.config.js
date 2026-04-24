import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import post from './schemas/post'

export default defineConfig({
  name: 'onlyforteachers',
  title: 'Only For Teachers',
  projectId: 'jg82obhk',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [post],
  },
})
