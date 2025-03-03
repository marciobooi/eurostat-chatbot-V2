import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Use the plugin you have installed

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/eurostat-chatbot-V2/",
});
