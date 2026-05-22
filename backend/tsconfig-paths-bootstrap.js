const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

tsConfigPaths.register({
  baseUrl: path.join(__dirname, 'dist'),
  paths: {
    'src/*': ['src/*'],
    'prisma/*': ['prisma/*']
  }
});