// Quick test to verify command registration
const { commandExecutor } = require('./lib/commands/command-executor.ts');

console.log('Testing command registration...');
console.log('Registered commands:', commandExecutor.getAllCommands().map(c => c.name));
console.log('Has help command:', commandExecutor.hasCommand('help'));
console.log('Has about command:', commandExecutor.hasCommand('about'));
console.log('Has skills command:', commandExecutor.hasCommand('skills'));
