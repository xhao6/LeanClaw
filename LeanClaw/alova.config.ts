import { defineConfig } from 'alova'

export default defineConfig({
  generator: [
    {
      input: 'src/api/createApis.ts',
      output: 'src/api/index.ts',
    },
  ],
})
