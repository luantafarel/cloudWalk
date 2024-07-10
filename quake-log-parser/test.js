const fs = require('fs');

function readJSONFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file from path: ${filePath}`);
      } else {
        try {
          const obj = JSON.parse(data);
          resolve(obj);
        } catch (parseError) {
          reject(`Error parsing JSON from file: ${filePath}`);
        }
      }
    });
  });
}

function compareObjects(obj1, obj2, path = '') {
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  allKeys.forEach(key => {
    const newPath = path ? `${path}.${key}` : key;
    if (!(key in obj1)) {
      console.log(`Error: Missing ${newPath} in first object.`);
    } else if (!(key in obj2)) {
      console.log(`Error: Missing ${newPath} in second object.`);
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      compareObjects(obj1[key], obj2[key], newPath);
    } else if (obj1[key] !== obj2[key]) {
      console.log(`Error: Different values for ${newPath}.`);
    }
  });
}

async function compareJSONFiles(file1, file2) {
  try {
    const obj1 = await readJSONFile(file1);
    const obj2 = await readJSONFile(file2);
    compareObjects(obj1, obj2);
  } catch (error) {
    console.error(error);
  }
}

// Example usage
const file1Path = '../goresponse.json';
const file2Path = '../noderesponse.json';
compareJSONFiles(file1Path, file2Path);