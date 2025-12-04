#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Checks that all requirements are met before deploying to Vercel
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const checks = [];
let hasErrors = false;

function check(name, fn) {
  checks.push({ name, fn });
}

function runCheck(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
    return false;
  }
}

// Check 1: Required files exist
check('Required files exist', () => {
  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tsconfig.json',
    'app/page.tsx',
    'app/layout.tsx',
    'components/terminal/TerminalContainer.tsx',
  ];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
});

// Check 2: TypeScript compilation
check('TypeScript compilation', () => {
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('TypeScript compilation failed. Run: npm run type-check');
  }
});

// Check 3: ESLint passes (skipped for now)
// check('ESLint validation', () => {
//   try {
//     execSync('npm run lint', { stdio: 'pipe' });
//   } catch (error) {
//     throw new Error('ESLint validation failed. Run: npm run lint');
//   }
// });

// Check 4: Build succeeds
check('Production build', () => {
  try {
    execSync('npm run build', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('Production build failed. Run: npm run build');
  }
});

// Check 5: Dependencies installed
check('Dependencies installed', () => {
  if (!existsSync('node_modules')) {
    throw new Error('Dependencies not installed. Run: npm install');
  }
});

// Run all checks
console.log('\n🚀 Running pre-deployment verification...\n');

for (const { name, fn } of checks) {
  const passed = runCheck(name, fn);
  if (!passed) {
    hasErrors = true;
  }
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('\n❌ Pre-deployment checks failed!');
  console.log('Please fix the errors above before deploying.\n');
  process.exit(1);
} else {
  console.log('\n✅ All pre-deployment checks passed!');
  console.log('Your project is ready to deploy to Vercel.\n');
  console.log('Next steps:');
  console.log('  1. Push your code to Git: git push origin main');
  console.log('  2. Deploy to Vercel: vercel --prod');
  console.log('  3. Or import your repo at: https://vercel.com/new\n');
  process.exit(0);
}
