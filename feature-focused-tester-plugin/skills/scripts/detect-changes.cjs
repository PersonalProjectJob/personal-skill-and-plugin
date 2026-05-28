const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '=== Change Impact Analyzer ===');

try {
  let diffOutput = '';
  try {
    diffOutput = execSync('git diff --name-only HEAD', { encoding: 'utf8' });
  } catch (err) {
    console.warn('Could not run git diff. Listing src files...');
  }

  const files = diffOutput
    .split('\n')
    .map(f => f.trim())
    .filter(f => f.startsWith('src/') && (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx')));

  if (files.length === 0) {
    console.log('\x1b[33m%s\x1b[0m', 'No uncommitted source code changes detected in src/.');
    console.log('To run target verification on all files, please specify a file manually.');
    process.exit(0);
  }

  console.log(`\nDetected ${files.length} changed source file(s):`);
  files.forEach(file => {
    console.log(` - \x1b[32m${file}\x1b[0m`);
  });

  console.log('\n--- Suggested Test Mapping ---');
  const relatedTests = [];

  files.forEach(file => {
    const filename = path.basename(file);
    const nameWithoutExt = path.parse(filename).name;
    
    const possibleUnitTest = path.join('tests', 'unit', `${nameWithoutExt}.test.jsx`);
    const possibleUnitTestJS = path.join('tests', 'unit', `${nameWithoutExt}.test.js`);
    
    let foundTest = false;
    if (fs.existsSync(possibleUnitTest)) {
      console.log(`Unit Test Found: \x1b[36m${possibleUnitTest}\x1b[0m (for ${file})`);
      relatedTests.push(possibleUnitTest);
      foundTest = true;
    } else if (fs.existsSync(possibleUnitTestJS)) {
      console.log(`Unit Test Found: \x1b[36m${possibleUnitTestJS}\x1b[0m (for ${file})`);
      relatedTests.push(possibleUnitTestJS);
      foundTest = true;
    }

    if (!foundTest) {
      console.log(`\x1b[33mMissing Unit Test:\x1b[0m No direct unit test file found for ${filename}.`);
      console.log(` > Recommended action: Create \x1b[35mtests/unit/${nameWithoutExt}.test.jsx\x1b[0m`);
    }
  });

  if (relatedTests.length > 0) {
    console.log('\n\x1b[32m%s\x1b[0m', 'Suggested Test Commands:');
    console.log(`Unit Test:  npx vitest run --related ${files.join(',')}`);
    console.log(`E2E Test:   npx start-server-and-test dev http://localhost:3000 "npx vitest run --config vitest.e2e.config.js"`);
  }

} catch (error) {
  console.error('Error running change detection:', error.message);
  process.exit(1);
}
