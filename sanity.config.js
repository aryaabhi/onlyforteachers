import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity-studio/schemas/index'

export default defineConfig({
  name: 'onlyforteachers',
  title: 'Only For Teachers',
  projectId: 'jg82obhk',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
