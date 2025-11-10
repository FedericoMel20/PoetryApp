const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'poemsData.json');

function readData() {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function hasAdjacentSameCategory(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].category && arr[i-1].category && arr[i].category === arr[i-1].category) return true;
  }
  return false;
}

function roundRobin(groups) {
  const keys = Object.keys(groups);
  const result = [];
  const pq = keys.map(k => ({ key: k, arr: groups[k].slice() }));
  // Sort by count desc
  pq.sort((a,b) => b.arr.length - a.arr.length);
  while (pq.some(p => p.arr.length > 0)) {
    for (let i = 0; i < pq.length; i++) {
      if (pq[i].arr.length > 0) {
        result.push(pq[i].arr.shift());
      }
    }
  }
  return result;
}

(function main(){
  try {
    const data = readData();
    // attempt random shuffles up to 2000 times
    let attempts = 0;
    let arr = data.slice();
    while (attempts < 2000) {
      shuffle(arr);
      if (!hasAdjacentSameCategory(arr)) break;
      attempts++;
    }
    if (attempts >= 2000) {
      console.log('Random shuffle failed to remove adjacent categories; falling back to round-robin');
      // fallback: group by category and interleave
      const groups = {};
      for (const item of arr) {
        const k = item.category || 'uncat';
        groups[k] = groups[k] || [];
        groups[k].push(item);
      }
      arr = roundRobin(groups);
      // if still adjacent duplicates exist, attempt simple swap fixes
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].category === arr[i-1].category) {
          // find a j > i with different category
          let j = i+1;
          while (j < arr.length && arr[j].category === arr[i].category) j++;
          if (j < arr.length) {
            const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
          }
        }
      }
    }

    // Reassign sequential ids starting at 1
    for (let i = 0; i < arr.length; i++) {
      arr[i].id = i + 1;
    }

    writeData(arr);
    console.log('Shuffled poemsData.json successfully. Total items:', arr.length);
  } catch (e) {
    console.error('Error while shuffling poems:', e);
    process.exit(1);
  }
})();
