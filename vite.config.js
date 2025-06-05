import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	root: "./src/frontend",
	plugins: [react(), tailwindcss()],
	build: {
		outDir: "../../public",
		emptyOutDir: true,
	},
});
