import { NextRequest, NextResponse } from "next/server";

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
    
    // Extract number from problem slug if possible
    const slugParts = problemSlug.split('-');
    let problemNumber = 0;
    
    try {
      // Fetch the LeetCode page
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch LeetCode page: ${response.status}`);
      }

      const html = await response.text();
      
      // Extract basic information using regex patterns
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(' - LeetCode', '') : '';
      
      // Try to extract problem number from title or content
      const numberMatch = title.match(/^(\d+)\./);
      if (numberMatch) {
        problemNumber = parseInt(numberMatch[1]);
      }

      // Try to extract difficulty (this is basic and may not always work)
      const difficultyMatch = html.match(/(Easy|Medium|Hard)/i);
      const difficulty = difficultyMatch ? difficultyMatch[1] : '';

      return NextResponse.json({
        title: title,
        number: problemNumber,
        difficulty: difficulty,
        slug: problemSlug,
        url: url,
        success: true,
        warning: "Basic data extracted. LeetCode uses dynamic content, so please verify and manually add problem description, examples, and other details."
      });

    } catch (fetchError) {
      // If fetching fails, still return basic info from URL
      return NextResponse.json({
        title: problemSlug.split('-').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        number: problemNumber,
        difficulty: '',
        slug: problemSlug,
        url: url,
        success: false,
        warning: "Could not fetch LeetCode page. Please manually enter problem details."
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