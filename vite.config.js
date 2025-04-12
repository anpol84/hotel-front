import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

export default defineConfig({
	plugins: [react(), ViteMinifyPlugin()],
	define: {
		'process.env.VITE_API_PATH': JSON.stringify(process.env.VITE_API_PATH),
	},
	server: {
		watch: {
			usePolling: true,
		},
		host: true,
		strictPort: true,
		port: 80,
	},
	preview: {
		host: true,
		strictPort: true,
		port: 80,
	},
})
