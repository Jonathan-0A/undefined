import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const dist = path.join(__dirname, "../frontend/dist");

// export default function distPath(req, res, next) {
//   res.sendFile(path.join(dist, "index.html"), (err) => {
//     if (err) {
//       console.error("Error loading the page:", err);
//       res.status(500).json({ message: "Error loading the page" });
//     }
//   });
// }
