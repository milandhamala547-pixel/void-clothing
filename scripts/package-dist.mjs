import { cpSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pkgDir = path.join(root, 'dist-package');
const version = process.env.npm_package_version || '1.0.0';
const archiveName = `void-clothing-v${version}`;

rmSync(pkgDir, { recursive: true, force: true });
mkdirSync(pkgDir, { recursive: true });

cpSync(path.join(root, 'dist'), path.join(pkgDir, 'dist'), { recursive: true });
cpSync(path.join(root, 'server.js'), path.join(pkgDir, 'server.js'));

const prodPackage = {
  name: 'void-clothing',
  version,
  description: 'VOID - Minimal Wear E-commerce (production bundle)',
  main: 'server.js',
  scripts: {
    start: 'node server.js'
  },
  dependencies: {
    'body-parser': '^1.20.2',
    cors: '^2.8.5',
    dotenv: '^16.0.3',
    express: '^4.18.2',
    nodemailer: '^8.0.10'
  },
  engines: {
    node: '>=18'
  }
};

writeFileSync(
  path.join(pkgDir, 'package.json'),
  JSON.stringify(prodPackage, null, 2) + '\n'
);

cpSync(path.join(root, '.env.example'), path.join(pkgDir, '.env.example'));

const archivePath = path.join(root, `${archiveName}.tar.gz`);
execSync(`tar -czf "${archivePath}" -C "${root}" dist-package`, { stdio: 'inherit' });

console.log(`\nDistribution package ready: ${archivePath}`);
console.log('To deploy: extract, copy .env.example to .env, run npm install && npm start');
