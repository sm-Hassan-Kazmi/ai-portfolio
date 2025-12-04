/**
 * Test script to verify Row-Level Security policies
 * Run this after setting up the database to ensure RLS is working correctly
 * 
 * Usage: node --loader ts-node/esm lib/supabase/test-rls.ts
 */

import { supabase, createAdminClient } from './client';

async function testRLSPolicies() {
  console.log('🔒 Testing Row-Level Security Policies\n');

  // Test 1: Public read access to visible sections
  console.log('Test 1: Public read access to visible sections');
  try {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('is_visible', true);

    if (error) {
      console.error('❌ Failed:', error.message);
    } else {
      console.log(`✅ Success: Retrieved ${data?.length || 0} visible sections`);
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }

  // Test 2: Public cannot read hidden sections
  console.log('\nTest 2: Public cannot read hidden sections');
  try {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('is_visible', false);

    if (error) {
      console.error('❌ Failed:', error.message);
    } else {
      console.log(`✅ Success: Retrieved ${data?.length || 0} hidden sections (should be 0)`);
      if (data && data.length > 0) {
        console.warn('⚠️  Warning: RLS may not be working correctly - hidden sections are visible');
      }
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }

  // Test 3: Public read access to settings
  console.log('\nTest 3: Public read access to settings');
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.error('❌ Failed:', error.message);
    } else {
      console.log(`✅ Success: Retrieved ${data?.length || 0} settings`);
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }

  // Test 4: Public cannot insert sections (should fail)
  console.log('\nTest 4: Public cannot insert sections (should fail)');
  try {
    const { data, error } = await supabase
      .from('sections')
      .insert({
        type: 'skill',
        title: 'Test Skill',
        description: 'This should fail',
        display_order: 0,
      });

    if (error) {
      console.log('✅ Success: Insert correctly blocked by RLS');
    } else {
      console.warn('⚠️  Warning: RLS may not be working - public insert succeeded');
    }
  } catch (err) {
    console.log('✅ Success: Insert correctly blocked');
  }

  // Test 5: Admin client can read all sections (including hidden)
  console.log('\nTest 5: Admin client can read all sections');
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('sections')
      .select('*');

    if (error) {
      console.error('❌ Failed:', error.message);
    } else {
      console.log(`✅ Success: Admin retrieved ${data?.length || 0} total sections`);
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }

  // Test 6: Public can insert analytics events
  console.log('\nTest 6: Public can insert analytics events');
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: 'test_event',
        event_data: { test: true },
        session_id: 'test-session',
      });

    if (error) {
      console.error('❌ Failed:', error.message);
    } else {
      console.log('✅ Success: Analytics event inserted');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }

  console.log('\n✨ RLS Policy Tests Complete\n');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testRLSPolicies().catch(console.error);
}

export { testRLSPolicies };
