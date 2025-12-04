# Terminal Testing Guide

Use this guide to manually test all terminal functionality before deployment.

## Basic Commands

### 1. Help Command
```
help
```
**Expected:** List of all available commands with descriptions

### 2. About Command
```
about
```
**Expected:** Biographical information and introduction

### 3. Skills Command
```
skills
```
**Expected:** All skills grouped by category (Frontend, Backend, Tools, Other)

### 4. Skills with Filters
```
skills --frontend
skills --backend
skills --tools
```
**Expected:** Only skills from the specified category

### 5. Experience Command
```
experience
```
**Expected:** Work history in reverse chronological order

### 6. Projects Command
```
projects
```
**Expected:** All projects with titles and descriptions

### 7. Projects with Filter
```
projects --featured
```
**Expected:** Only featured projects

### 8. Certifications Command
```
certifications
```
**Expected:** List of certifications and achievements

### 9. Stats Command
```
stats
```
**Expected:** Portfolio statistics (project count, skill count, etc.)

### 10. History Command
```
history
```
**Expected:** List of all commands executed in current session

### 11. Clear Command
```
clear
```
**Expected:** Terminal output cleared, fresh prompt displayed

## Advanced Features

### 12. Command History Navigation
1. Type several commands
2. Press **Up Arrow** key
3. Press **Down Arrow** key

**Expected:** Navigate through command history

### 13. Tab Autocomplete
1. Type partial command: `hel`
2. Press **Tab** key

**Expected:** Command completes to `help`

### 14. Invalid Command
```
invalidcommand
```
**Expected:** Error message with suggestions for similar valid commands

### 15. Theme Switching
```
theme
theme cyberpunk
theme matrix
theme dracula
theme default
```
**Expected:** 
- `theme` alone lists available themes
- Each theme command changes terminal colors

## Edge Cases

### 16. Empty Input
1. Press **Enter** without typing anything

**Expected:** New prompt appears, no error

### 17. Multiple Spaces
```
help     
```
**Expected:** Command executes normally, extra spaces ignored

### 18. Case Sensitivity
```
HELP
Help
HeLp
```
**Expected:** All variations work (commands are case-insensitive)

### 19. Unknown Flags
```
skills --unknown
```
**Expected:** Flag ignored or error message displayed

### 20. Multiple Flags
```
skills --frontend --backend
```
**Expected:** Appropriate behavior (show both or show error)

## Performance Tests

### 21. Command Execution Speed
Execute any command and observe response time.

**Expected:** Output appears within 100ms (Requirement 1.3, 12.3)

### 22. Rapid Command Entry
Type and execute multiple commands quickly.

**Expected:** All commands execute without lag or errors

## Accessibility Tests

### 23. Keyboard Navigation
Navigate using only keyboard (no mouse).

**Expected:** All functionality accessible via keyboard

### 24. Focus Management
Tab through interactive elements.

**Expected:** Clear focus indicators visible

## Test Results Template

Copy and fill out after testing:

```
Date: ___________
Tester: ___________
Environment: Local / Vercel Preview / Production

Basic Commands:
[ ] help - Pass/Fail
[ ] about - Pass/Fail
[ ] skills - Pass/Fail
[ ] skills --frontend - Pass/Fail
[ ] skills --backend - Pass/Fail
[ ] skills --tools - Pass/Fail
[ ] experience - Pass/Fail
[ ] projects - Pass/Fail
[ ] projects --featured - Pass/Fail
[ ] certifications - Pass/Fail
[ ] stats - Pass/Fail
[ ] history - Pass/Fail
[ ] clear - Pass/Fail

Advanced Features:
[ ] Command history navigation - Pass/Fail
[ ] Tab autocomplete - Pass/Fail
[ ] Invalid command handling - Pass/Fail
[ ] Theme switching - Pass/Fail

Edge Cases:
[ ] Empty input - Pass/Fail
[ ] Multiple spaces - Pass/Fail
[ ] Case sensitivity - Pass/Fail

Performance:
[ ] Command execution < 100ms - Pass/Fail
[ ] Rapid command entry - Pass/Fail

Accessibility:
[ ] Keyboard navigation - Pass/Fail
[ ] Focus management - Pass/Fail

Issues Found:
1. ___________
2. ___________
3. ___________

Overall Status: Pass / Fail
```
