import { NextRequest, NextResponse } from "next/server";

// Common LeetCode problems database for better auto-fill
const COMMON_PROBLEMS: Record<number, { title: string; difficulty: string }> = {
  1: { title: "Two Sum", difficulty: "Easy" },
  2: { title: "Add Two Numbers", difficulty: "Medium" },
  3: { title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
  4: { title: "Median of Two Sorted Arrays", difficulty: "Hard" },
  5: { title: "Longest Palindromic Substring", difficulty: "Medium" },
  7: { title: "Reverse Integer", difficulty: "Medium" },
  9: { title: "Palindrome Number", difficulty: "Easy" },
  11: { title: "Container With Most Water", difficulty: "Medium" },
  13: { title: "Roman to Integer", difficulty: "Easy" },
  14: { title: "Longest Common Prefix", difficulty: "Easy" },
  15: { title: "3Sum", difficulty: "Medium" },
  20: { title: "Valid Parentheses", difficulty: "Easy" },
  21: { title: "Merge Two Sorted Lists", difficulty: "Easy" },
  26: { title: "Remove Duplicates from Sorted Array", difficulty: "Easy" },
  27: { title: "Remove Element", difficulty: "Easy" },
  33: { title: "Search in Rotated Sorted Array", difficulty: "Medium" },
  35: { title: "Search Insert Position", difficulty: "Easy" },
  38: { title: "Count and Say", difficulty: "Medium" },
  42: { title: "Trapping Rain Water", difficulty: "Hard" },
  46: { title: "Permutations", difficulty: "Medium" },
  48: { title: "Rotate Image", difficulty: "Medium" },
  49: { title: "Group Anagrams", difficulty: "Medium" },
  53: { title: "Maximum Subarray", difficulty: "Medium" },
  54: { title: "Spiral Matrix", difficulty: "Medium" },
  56: { title: "Merge Intervals", difficulty: "Medium" },
  62: { title: "Unique Paths", difficulty: "Medium" },
  70: { title: "Climbing Stairs", difficulty: "Easy" },
  72: { title: "Edit Distance", difficulty: "Hard" },
  75: { title: "Sort Colors", difficulty: "Medium" },
  76: { title: "Minimum Window Substring", difficulty: "Hard" },
  78: { title: "Subsets", difficulty: "Medium" },
  79: { title: "Word Search", difficulty: "Medium" },
  88: { title: "Merge Sorted Array", difficulty: "Easy" },
  94: { title: "Binary Tree Inorder Traversal", difficulty: "Easy" },
  98: { title: "Validate Binary Search Tree", difficulty: "Medium" },
  101: { title: "Symmetric Tree", difficulty: "Easy" },
  102: { title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
  104: { title: "Maximum Depth of Binary Tree", difficulty: "Easy" },
  121: { title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
  124: { title: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
  125: { title: "Valid Palindrome", difficulty: "Easy" },
  136: { title: "Single Number", difficulty: "Easy" },
  139: { title: "Word Break", difficulty: "Medium" },
  141: { title: "Linked List Cycle", difficulty: "Easy" },
  146: { title: "LRU Cache", difficulty: "Medium" },
  152: { title: "Maximum Product Subarray", difficulty: "Medium" },
  153: { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium" },
  155: { title: "Min Stack", difficulty: "Medium" },
  167: { title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium" },
  169: { title: "Majority Element", difficulty: "Easy" },
  190: { title: "Reverse Bits", difficulty: "Easy" },
  191: { title: "Number of 1 Bits", difficulty: "Easy" },
  198: { title: "House Robber", difficulty: "Medium" },
  200: { title: "Number of Islands", difficulty: "Medium" },
  206: { title: "Reverse Linked List", difficulty: "Easy" },
  208: { title: "Implement Trie (Prefix Tree)", difficulty: "Medium" },
  217: { title: "Contains Duplicate", difficulty: "Easy" },
  226: { title: "Invert Binary Tree", difficulty: "Easy" },
  238: { title: "Product of Array Except Self", difficulty: "Medium" },
  242: { title: "Valid Anagram", difficulty: "Easy" },
  268: { title: "Missing Number", difficulty: "Easy" },
  283: { title: "Move Zeroes", difficulty: "Easy" },
  295: { title: "Find Median from Data Stream", difficulty: "Hard" },
  297: { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
  300: { title: "Longest Increasing Subsequence", difficulty: "Medium" },
  322: { title: "Coin Change", difficulty: "Medium" },
  338: { title: "Counting Bits", difficulty: "Easy" },
  347: { title: "Top K Frequent Elements", difficulty: "Medium" },
  371: { title: "Sum of Two Integers", difficulty: "Medium" },
  383: { title: "Ransom Note", difficulty: "Easy" },
  392: { title: "Is Subsequence", difficulty: "Easy" },
  394: { title: "Decode String", difficulty: "Medium" },
  416: { title: "Partition Equal Subset Sum", difficulty: "Medium" },
  448: { title: "Find All Numbers Disappeared in an Array", difficulty: "Easy" },
  461: { title: "Hamming Distance", difficulty: "Easy" },
  509: { title: "Fibonacci Number", difficulty: "Easy" },
  518: { title: "Coin Change II", difficulty: "Medium" },
  543: { title: "Diameter of Binary Tree", difficulty: "Easy" },
  572: { title: "Subtree of Another Tree", difficulty: "Easy" },
  617: { title: "Merge Two Binary Trees", difficulty: "Easy" },
  647: { title: "Palindromic Substrings", difficulty: "Medium" },
  704: { title: "Binary Search", difficulty: "Easy" },
  746: { title: "Min Cost Climbing Stairs", difficulty: "Easy" },
  763: { title: "Partition Labels", difficulty: "Medium" },
  844: { title: "Backspace String Compare", difficulty: "Easy" },
  876: { title: "Middle of the Linked List", difficulty: "Easy" },
  977: { title: "Squares of a Sorted Array", difficulty: "Easy" },
  1046: { title: "Last Stone Weight", difficulty: "Easy" },
  1143: { title: "Longest Common Subsequence", difficulty: "Medium" },
  1480: { title: "Running Sum of 1d Array", difficulty: "Easy" },
  1672: { title: "Richest Customer Wealth", difficulty: "Easy" },
  1768: { title: "Merge Strings Alternately", difficulty: "Easy" }
};

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes('leetcode.com')) {
      return NextResponse.json(
        { error: "Please provide a valid LeetCode URL" },
        { status: 400 }
      );
    }

    // Extract problem number and slug from URL
    const urlMatch = url.match(/\/problems\/([^\/]+)/);
    const problemSlug = urlMatch ? urlMatch[1] : '';
    
    // Better extraction of problem number from URL
    let problemNumber = 0;
    
    // Try to find problem number in URL path (some URLs have /problems/1-two-sum/ format)
    const numberFromPath = url.match(/\/problems\/(\d+)-/);
    if (numberFromPath) {
      problemNumber = parseInt(numberFromPath[1]);
    }
    
    // Generate a clean title from slug as fallback
    let fallbackTitle = problemSlug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    // If we extracted a number from the URL, remove it from the title
    if (problemNumber > 0) {
      fallbackTitle = fallbackTitle.replace(/^\d+\s*/, '');
    }
    
    try {
      // Attempt to fetch the LeetCode page with improved headers
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Extract basic information using improved regex patterns
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      let extractedTitle = titleMatch ? titleMatch[1].replace(' - LeetCode', '').trim() : fallbackTitle;
      
      // Try to extract problem number from title if not found in URL
      if (problemNumber === 0) {
        const numberMatch = extractedTitle.match(/^(\d+)\./);
        if (numberMatch) {
          problemNumber = parseInt(numberMatch[1]);
          // Remove number from title for cleaner display
          extractedTitle = extractedTitle.replace(/^\d+\.\s*/, '');
        }
      }

      // Try to extract difficulty with multiple patterns
      let difficulty = '';
      const difficultyPatterns = [
        /class="[^"]*difficulty[^"]*"[^>]*>.*?(Easy|Medium|Hard)/i,
        /"difficulty":\s*"(Easy|Medium|Hard)"/i,
        /\b(Easy|Medium|Hard)\b/i
      ];
      
      for (const pattern of difficultyPatterns) {
        const match = html.match(pattern);
        if (match) {
          difficulty = match[1];
          break;
        }
      }

      console.log(`Successfully scraped LeetCode page: ${extractedTitle} (${problemNumber}) - ${difficulty}`);

      return NextResponse.json({
        title: extractedTitle,
        number: problemNumber,
        difficulty: difficulty,
        slug: problemSlug,
        url: url,
        success: true,
        warning: difficulty === '' ? 
          "Basic data extracted. Could not determine difficulty - please verify and set manually." :
          "Basic data extracted successfully! Please verify the information and add problem description, approach, and solution code."
      });

    } catch (fetchError) {
      console.error("Failed to fetch LeetCode page:", fetchError);
      
      // Enhanced fallback: try to extract number from common LeetCode URL patterns
      if (problemNumber === 0) {
        // Try different number extraction patterns
        const patterns = [
          /(\d+)\.\s*[a-zA-Z]/, // Number followed by dot and letters (from title-like strings)
          /problem[\s-]?(\d+)/i, // "problem 123" or "problem-123"
          /leetcode[\s-]?(\d+)/i // "leetcode 123" or "leetcode-123"
        ];
        
        for (const pattern of patterns) {
          const match = problemSlug.match(pattern);
          if (match) {
            problemNumber = parseInt(match[1]);
            break;
          }
        }
      }

      // Check if we have this problem in our database
      const knownProblem = COMMON_PROBLEMS[problemNumber];
      const finalTitle = knownProblem ? knownProblem.title : fallbackTitle;
      const finalDifficulty = knownProblem ? knownProblem.difficulty : '';

      return NextResponse.json({
        title: finalTitle,
        number: problemNumber,
        difficulty: finalDifficulty,
        slug: problemSlug,
        url: url,
        success: knownProblem ? true : false,
        warning: knownProblem ? 
          "Problem found in database! Information auto-filled. Please verify and add problem description, approach, and solution code." :
          "Could not fetch LeetCode page due to anti-bot protection. Basic info extracted from URL - please manually verify and add difficulty, description, and other details."
      });
    }

  } catch (error) {
    console.error("Error processing LeetCode URL:", error);
    return NextResponse.json(
      { error: "Failed to process LeetCode URL. Please enter the details manually." },
      { status: 500 }
    );
  }
} 