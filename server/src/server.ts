import dotenv from "dotenv";
dotenv.config();

console.log(process.env.GEMINI_API_KEY);

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});