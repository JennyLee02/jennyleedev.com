const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function addSampleSolution() {
  try {
    const solution = await prisma.leetcodeSolution.create({
      data: {
        title: "Two Sum - Hash Table Solution",
        number: 1,
        difficulty: "Easy",
        category: "Hash Table",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
        approach: `The key insight is to use a hash table (dictionary) to store the numbers we have seen so far and their indices.

As we iterate through the array, for each number, we calculate what number we need to find (target - current number). If that number exists in our hash table, we have found our answer.

This approach transforms the problem from O(n²) brute force to O(n) time complexity by trading space for time.

Step-by-step:
1. Create an empty hash table
2. For each number in the array:
   - Calculate complement = target - current number
   - If complement exists in hash table, return indices
   - Otherwise, store current number and its index in hash table
3. Continue until solution is found`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        solution: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Hash table to store number -> index mapping
        num_to_index = {}
        
        for i, num in enumerate(nums):
            # Calculate what number we need to find
            complement = target - num
            
            # If complement exists in our hash table, we found the answer
            if complement in num_to_index:
                return [num_to_index[complement], i]
            
            # Store current number and its index
            num_to_index[num] = i
        
        # This should never be reached given problem constraints
        return []`,
        tags: ["hash-table", "array", "two-pointers", "leetcode-easy", "fundamental"]
      }
    });

    console.log('✅ Sample LeetCode solution created successfully!');
    console.log('Solution ID:', solution.id);
    console.log('Title:', solution.title);
    console.log('Category:', solution.category);
    console.log('Difficulty:', solution.difficulty);

  } catch (error) {
    console.error('❌ Error creating sample solution:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleSolution(); 