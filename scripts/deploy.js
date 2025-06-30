import ghpages from "gh-pages";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure .nojekyll file exists
const nojekyllPath = path.join(__dirname, "..", "dist", ".nojekyll");
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, "");
  console.log("Created .nojekyll file");
}

// Deploy to GitHub Pages
console.log("Deploying to GitHub Pages...");
ghpages.publish(
  "dist",
  {
    branch: "gh-pages",
    message: "Auto-deploy from build script",
    dotfiles: true, // Include .nojekyll file
  },
  function (err) {
    if (err) {
      console.error("Deployment error:", err);
      process.exit(1);
    } else {
      console.log("Deployment complete!");
    }
  }
);
