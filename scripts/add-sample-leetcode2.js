const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function addSampleSolution2() {
  try {
    const solution = await prisma.leetcodeSolution.create({
      data: {
        title: "Binary Tree Inorder Traversal",
        number: 94,
        difficulty: "Medium",
        category: "Tree",
        description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Example 1:
Input: root = [1,null,2,3]
Output: [1,3,2]

Example 2:
Input: root = []
Output: []

Example 3:
Input: root = [1]
Output: [1]

Constraints:
- The number of nodes in the tree is in the range [0, 100].
- -100 <= Node.val <= 100

Follow up: Recursive solution is trivial, could you do it iteratively?`,
        approach: `There are multiple approaches to solve this problem:

**Approach 1: Recursive (Simple)**
The most straightforward approach is to use recursion following the inorder pattern: left -> root -> right.

**Approach 2: Iterative with Stack (More Challenging)**
Use a stack to simulate the recursion. We traverse left as much as possible, then process the current node, then move to the right.

**Approach 3: Morris Traversal (Advanced)**
A space-efficient approach that modifies the tree temporarily to achieve O(1) space complexity.

I'll implement the iterative approach as it's more interesting and demonstrates stack usage.

Algorithm:
1. Initialize an empty stack and result array
2. Start with the root node
3. While stack is not empty or current node is not null:
   - Go left as much as possible, pushing nodes to stack
   - When we can't go left anymore, pop from stack
   - Add the popped node's value to result
   - Move to the right child
4. Return the result`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) where h is the height of the tree",
        solution: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        stack = []
        current = root
        
        while stack or current:
            # Go to the leftmost node
            while current:
                stack.append(current)
                current = current.left
            
            # Current must be None at this point
            current = stack.pop()
            result.append(current.val)
            
            # We have visited the node and its left subtree, now visit right
            current = current.right
        
        return result
    
    # Alternative recursive solution (simpler but less interesting)
    def inorderTraversalRecursive(self, root: Optional[TreeNode]) -> List[int]:
        def inorder(node):
            if not node:
                return []
            return inorder(node.left) + [node.val] + inorder(node.right)
        
        return inorder(root)`,
        tags: ["tree", "binary-tree", "traversal", "stack", "recursion", "depth-first-search"]
      }
    });

    console.log('✅ Second sample LeetCode solution created successfully!');
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

addSampleSolution2(); 