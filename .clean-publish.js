// CLEAN BEFORE PUBLISH
module.exports = {
  // Fields in package.json to remove
  fields: ['scripts', 'targets', 'devDependencies', 'husky', 'lint-staged'],
  // Files to remove
  files: [
    '.idea',
    '.cache',
    'docs',
    'examples',
    'public',
    'src',
    '.clean-publish.js',
    '.gitignore',
    '.npmrc',
    '.prettierrc',
    'npm-shrinkwrap.json',
  ],
  packageManager: 'npm',
};
