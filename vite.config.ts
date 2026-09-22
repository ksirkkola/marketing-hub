import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim');

// Cache-busts built asset URLs in index.html — no-cache meta tags don't work
// inside the Hailer iframe, so this is the reliable way to force a fresh bundle.
function cacheBustPlugin(): Plugin {
  return {
    name: 'cache-bust-html',
    enforce: 'post',
    transformIndexHtml(html) {
      const ts = Date.now();
      return html.replace(/(src|href)="([^"]+\.(js|css))"/g, (_m, attr, url) => `${attr}="${url}?v=${ts}"`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cacheBustPlugin()],
  base: './',
  server: {
    port: 3000,
    cors: true,
  },
})
