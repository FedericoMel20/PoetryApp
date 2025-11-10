const fs = require("fs");
const path = "D:/NPU adventure/Semester 5/Mobile Device Programming/PoetryApp/src/data/poemsData.json";

try {
  const data = fs.readFileSync(path, "utf8");
  console.log("✅ File read successfully:");
  console.log(data);
} catch (err) {
  console.error("❌ Error reading file:", err);
}
