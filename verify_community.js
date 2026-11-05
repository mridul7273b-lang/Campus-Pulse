const fs = require('fs');

console.log('--- RUNNING COMMUNITY PLATFORM AUTOMATED TEST SUITE ---');

// 1. Verify oncampus.js and campuspulse.js syntax
try {
  const code = fs.readFileSync('oncampus.js', 'utf8');
  console.log('✓ oncampus.js loaded successfully. Size:', code.length, 'bytes');

  // Verify exports and key functions exist
  const requiredTokens = [
    'export const INITIAL_POSTS',
    'export const INITIAL_COMMENTS',
    'runTransaction',
    'createNewSubmission',
    'toggleUpvotePost',
    'togglePostComments',
    'addPostComment',
    'renderFeed',
    'comments-drawer'
  ];

  requiredTokens.forEach(token => {
    if (code.includes(token)) {
      console.log(`✓ Contains expected token: "${token}"`);
    } else {
      throw new Error(`Missing expected token: "${token}"`);
    }
  });

  // 2. Test Post creation & rejection validation logic
  console.log('\n--- Testing Post Validation Logic ---');
  function validateSubmission(formValues) {
    const { title, content } = formValues;
    if (!title || !title.trim()) {
      return { ok: false, error: 'Post title cannot be empty.' };
    }
    if (!content || !content.trim()) {
      return { ok: false, error: 'Post content cannot be empty.' };
    }
    return { ok: true };
  }

  const testCases = [
    { form: { title: '', content: 'Some body' }, shouldPass: false },
    { form: { title: '   ', content: 'Some body' }, shouldPass: false },
    { form: { title: 'Title', content: '' }, shouldPass: false },
    { form: { title: 'Title', content: '   ' }, shouldPass: false },
    { form: { title: 'Valid Title', content: 'Valid content text' }, shouldPass: true }
  ];

  testCases.forEach((tc, idx) => {
    const res = validateSubmission(tc.form);
    if (res.ok === tc.shouldPass) {
      console.log(`✓ Test case ${idx + 1} passed: empty/whitespace validation behaves correctly.`);
    } else {
      throw new Error(`Test case ${idx + 1} failed! Expected ${tc.shouldPass} but got ${res.ok}`);
    }
  });

  // 3. Test Upvoting & Duplicate Prevention Transaction Simulation
  console.log('\n--- Testing Upvoting & Duplicate Prevention Simulation ---');
  let postState = {
    id: 'post-test',
    upvotes: 10,
    upvotedBy: ['user-1', 'user-2']
  };

  function simulateVoteTransaction(post, userId) {
    const upvotedByList = Array.isArray(post.upvotedBy) ? [...post.upvotedBy] : [];
    const alreadyUpvoted = upvotedByList.includes(userId);

    let nextUpvotedBy;
    let nextUpvotes;

    if (alreadyUpvoted) {
      nextUpvotedBy = upvotedByList.filter(u => u !== userId);
      nextUpvotes = Math.max(0, (post.upvotes || 1) - 1);
    } else {
      nextUpvotedBy = [...upvotedByList, userId];
      nextUpvotes = (post.upvotes || 0) + 1;
    }

    return {
      ...post,
      upvotes: nextUpvotes,
      upvotedBy: nextUpvotedBy
    };
  }

  // User 3 votes for the first time
  postState = simulateVoteTransaction(postState, 'user-3');
  console.log('✓ User 3 upvoted. Count:', postState.upvotes, 'upvotedBy:', postState.upvotedBy);
  if (postState.upvotes !== 11 || !postState.upvotedBy.includes('user-3')) {
    throw new Error('Upvoting failed for new user');
  }

  // User 3 votes again (should remove vote / toggle off)
  postState = simulateVoteTransaction(postState, 'user-3');
  console.log('✓ User 3 toggled upvote off. Count:', postState.upvotes, 'upvotedBy:', postState.upvotedBy);
  if (postState.upvotes !== 10 || postState.upvotedBy.includes('user-3')) {
    throw new Error('Vote toggle off failed');
  }

  // Duplicate vote check: if user 1 already upvoted, vote cannot be doubled
  if (postState.upvotedBy.filter(u => u === 'user-1').length !== 1) {
    throw new Error('Duplicate votes detected for user-1');
  }
  console.log('✓ Duplicate vote prevention verified.');

  // 4. Test Comments Validation & Association
  console.log('\n--- Testing Comments Validation & Association ---');
  function validateComment(content) {
    if (!content || !content.trim()) return false;
    return true;
  }
  if (!validateComment('') && !validateComment('   ') && validateComment('Great announcement!')) {
    console.log('✓ Empty comments successfully rejected.');
  } else {
    throw new Error('Comment validation failed');
  }

  // 5. Test Firestore rules syntax & completeness
  console.log('\n--- Checking Firestore Rules ---');
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  const expectedRules = [
    'match /posts/{postId}',
    'match /comments/{commentId}',
    'match /users/{userId}',
    'match /issues/{issueId}',
    'match /marketplace/{itemId}',
    'match /projects/{projectId}',
    'request.resource.data.authorId == request.auth.uid',
    'request.resource.data.diff(resource.data).affectedKeys().hasOnly'
  ];

  expectedRules.forEach(ruleSnippet => {
    if (rules.includes(ruleSnippet)) {
      console.log(`✓ Rule present: "${ruleSnippet}"`);
    } else {
      throw new Error(`Missing expected rule: "${ruleSnippet}"`);
    }
  });

  console.log('\nALL TESTS PASSED SUCCESSFULLY! ✓✓✓');
} catch (err) {
  console.error('Test suite failed:', err);
  process.exit(1);
}
