module.exports = {
    recursive: true,       // Look for tests in subdirectories
    timeout: 5000,         // Set a timeout of 5 seconds for each test
    reporter: 'spec',      // Use 'spec' reporter for output
    exit: true,            // Ensure Mocha exits after tests
    require: ['@babel/register'], // Required if using ES6+ code
    "spec": "test/**/*.js"
  };
  