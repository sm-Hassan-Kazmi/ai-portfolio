# Supabase Data Reset Guide

## ✅ Fixed! Ready to Run

The seed data file has been fixed. The "about" information is now stored in the `settings` table (not `sections`).

---

## 🎯 Use This File:

**`lib/supabase/migrations/003_seed_data_clean.sql`**

This file:
- ✅ Deletes existing data first (no duplicates)
- ✅ Uses correct table structure
- ✅ Includes all your personalized data
- ✅ Shows verification summary

---

## 📝 How to Run:

### Step 1: Copy the File
1. Open `lib/supabase/migrations/003_seed_data_clean.sql`
2. Select All (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)

### Step 2: Run in Supabase
1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Paste the SQL
4. Click **"Run"**

### Step 3: Verify Success
You should see output like:
```
=== SECTIONS SUMMARY ===
certification  7
experience     2
project        4
skill         20

=== SETTINGS SUMMARY ===
about_info
contact_info
feature_flags
seo_metadata
terminal_theme

=== TOTAL COUNTS ===
total_sections: 33
total_settings: 5
```

---

## 🔍 What Changed?

### Before (Wrong):
```sql
-- This was trying to insert "about" as a section type
INSERT INTO sections (type, ...) VALUES ('about', ...)
-- ❌ Error: "about" is not a valid type
```

### After (Correct):
```sql
-- Now stored in settings table
INSERT INTO settings (key, value, ...) VALUES ('about_info', {...})
-- ✅ Works perfectly!
```

---

## 📊 Data Structure

### Sections Table
Valid types: `skill`, `experience`, `project`, `certification`, `achievement`

**Your data:**
- 20 skills
- 2 experiences
- 4 projects
- 7 certifications

### Settings Table
Stores configuration and about info

**Your data:**
- `terminal_theme` - Theme colors
- `contact_info` - Email, phone, socials
- `seo_metadata` - SEO settings
- `feature_flags` - Feature toggles
- `about_info` - Your bio and info ✨ (NEW)

---

## 🆘 If You Still Get Errors

### "Duplicate key" error
**Solution:** The clean file already handles this by deleting first. Just run it again.

### "Permission denied" error
**Solution:** Make sure you're logged into Supabase and in the correct project.

### "Relation does not exist" error
**Solution:** Run migrations 001 and 002 first:
1. `001_initial_schema.sql`
2. `002_rls_policies.sql`
3. Then `003_seed_data_clean.sql`

---

## ✨ After Success

Once the migration runs successfully:

1. **Test locally:**
   ```bash
   npm run dev
   ```

2. **Try these commands:**
   - `about` - Shows your bio
   - `skills` - Shows all 20 skills
   - `experience` - Shows your work history
   - `projects` - Shows your 4 projects
   - `certifications` - Shows your achievements

3. **Verify in Supabase:**
   - Go to Table Editor
   - Check `sections` table (should have 33 rows)
   - Check `settings` table (should have 5 rows)

---

## 🚀 Ready to Deploy!

Once your data is in Supabase:
1. Your local dev server will show your real data
2. Deploy to Vercel with your Supabase credentials
3. Your portfolio is live with your information!

---

**Next:** Run `003_seed_data_clean.sql` in Supabase SQL Editor now! 🎉
