const path = require("path");
const fs = require("fs");
const jsonFilePath = path.join(process.cwd(), "data", "users.json");

const readData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonFilePath, (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data.toString()));
    });
  });
};

const writeData = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(jsonFilePath, JSON.stringify(data), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Naya user banao (password already hashed aana chahiye controller se)
exports.createUser = async (email, password) => {
  const users = await readData();
  const matched = users.find((u) => u.email === email);
  if (matched) {
    throw new Error("user already exist!");
  } else {
    const userId = Date.now();
    await writeData([...users, { email, password, userId }]);
  }
};

// Email se user dhundo
exports.findUser = async (email) => {
  const users = await readData();
  const matched = users.find((u) => u.email === email);
  return matched;
};