export interface RawProblem {
  number: number;
  name: string;
  isStray?: boolean;
  isTruncated?: boolean;
}

export interface RawPattern {
  number: number;
  name: string;
  problems: RawProblem[];
}

export interface RawCategory {
  number: string; // e.g. "I", "II"
  name: string;
  patterns: RawPattern[];
}

export const categoriesData: RawCategory[] = [
  {
    number: "I",
    name: "Two Pointer Patterns",
    patterns: [
      {
        number: 1,
        name: "Converging",
        problems: [
          { number: 11, name: "Container With Most Water" },
          { number: 15, name: "3Sum" },
          { number: 16, name: "3Sum Closest" },
          { number: 18, name: "4Sum" },
          { number: 167, name: "Two Sum II - Input Array Is Sorted" },
          { number: 349, name: "Intersection of Two Arrays" },
          { number: 881, name: "Boats to Save People" },
          { number: 977, name: "Squares of a Sorted Array" },
          { number: 259, name: "3Sum Smaller" }
        ]
      },
      {
        number: 2,
        name: "Fast & Slow",
        problems: [
          { number: 141, name: "Linked List Cycle" },
          { number: 202, name: "Happy Number" },
          { number: 287, name: "Find the Duplicate Number" },
          { number: 392, name: "Is Subsequence" }
        ]
      },
      {
        number: 3,
        name: "Fixed Separation",
        problems: [
          { number: 19, name: "Remove Nth Node From End of List" },
          { number: 876, name: "Middle of the Linked List" },
          { number: 2095, name: "Delete the Middle Node of a Linked List" }
        ]
      },
      {
        number: 4,
        name: "In-place Array Modification",
        problems: [
          { number: 26, name: "Remove Duplicates from Sorted Array" },
          { number: 27, name: "Remove Element" },
          { number: 75, name: "Sort Colors" },
          { number: 80, name: "Remove Duplicates from Sorted Array II" },
          { number: 283, name: "Move Zeroes" },
          { number: 443, name: "String Compression" },
          { number: 905, name: "Sort Array By Parity" },
          { number: 2337, name: "Move Pieces to Obtain a String" },
          { number: 2938, name: "Separate Black and White Balls" }
        ]
      },
      {
        number: 5,
        name: "String Comparison with special characters",
        problems: [
          { number: 844, name: "Backspace String Compare" },
          { number: 1598, name: "Crawler Log Folder" },
          { number: 2390, name: "Removing Stars From a String" }
        ]
      },
      {
        number: 6,
        name: "Expanding From Center",
        problems: [
          { number: 5, name: "Longest Palindromic Substring" },
          { number: 647, name: "Palindromic Substrings" }
        ]
      },
      {
        number: 7,
        name: "String Reversal",
        problems: [
          { number: 151, name: "Reverse Words in a String" },
          { number: 344, name: "Reverse String" },
          { number: 345, name: "Reverse Vowels of a String" },
          { number: 541, name: "Reverse String II" }
        ]
      }
    ]
  },
  {
    number: "II",
    name: "Sliding Window Patterns",
    patterns: [
      {
        number: 8,
        name: "Fixed Size",
        problems: [
          { number: 346, name: "Moving Average from Data Stream" },
          { number: 643, name: "Maximum Average Subarray I" },
          { number: 2985, name: "Calculate Compressed Mean" },
          { number: 3254, name: "Find the Power of K-Size Subarrays I" },
          { number: 3318, name: "Find X-Sum of All K-Long Subarrays I" }
        ]
      },
      {
        number: 9,
        name: "Variable Size",
        problems: [
          { number: 3, name: "Longest Substring Without Repeating Characters" },
          { number: 76, name: "Minimum Window Substring" },
          { number: 209, name: "Minimum Size Subarray Sum" },
          { number: 219, name: "Contains Duplicate II" },
          { number: 424, name: "Longest Repeating Character Replacement" },
          { number: 713, name: "Subarray Product Less Than K" },
          { number: 904, name: "Fruit Into Baskets" },
          { number: 1004, name: "Max Consecutive Ones III" },
          { number: 1438, name: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit" },
          { number: 1493, name: "Longest Subarray of 1's After Deleting One Element" },
          { number: 1, name: "1", isStray: true }, // Stray "1" that appears before problem 1658 in Pattern 9
          { number: 1658, name: "Minimum Operations to Reduce X to Zero" }
        ]
      },
      {
        number: 10,
        name: "Monotonic Queue for Max/Min",
        problems: [
          { number: 239, name: "Sliding Window Maximum" },
          { number: 862, name: "Shortest Subarray with Sum at Least K" },
          { number: 1696, name: "Jump Game VI" }
        ]
      },
      {
        number: 11,
        name: "Character Frequency Matching",
        problems: [
          { number: 1, name: "Two Sum" },
          { number: 438, name: "Find All Anagrams in a String" },
          { number: 567, name: "Permutation in String" }
        ]
      }
    ]
  },
  {
    number: "III",
    name: "Tree Traversal Patterns (DFS & BFS)",
    patterns: [
      {
        number: 12,
        name: "Level Order Traversal",
        problems: [
          { number: 102, name: "Binary Tree Level Order Traversal" },
          { number: 103, name: "Binary Tree Zigzag Level Order Traversal" },
          { number: 199, name: "Binary Tree Right Side View" },
          { number: 515, name: "Find Largest Value in Each Tree Row" },
          { number: 1161, name: "Maximum Level Sum of a Binary Tree" }
        ]
      },
      {
        number: 13,
        name: "Recursive Preorder Traversal",
        problems: [
          { number: 100, name: "Same Tree" },
          { number: 101, name: "Symmetric Tree" },
          { number: 105, name: "Construct Binary Tree from Preorder and Inorder Traversal" },
          { number: 114, name: "Flatten Binary Tree to Linked List" },
          { number: 226, name: "Invert Binary Tree" },
          { number: 257, name: "Binary Tree Paths" },
          { number: 988, name: "Smallest String Starting From Leaf" }
        ]
      },
      {
        number: 14,
        name: "Recursive Inorder Traversal",
        problems: [
          { number: 94, name: "Binary Tree Inorder Traversal" },
          { number: 98, name: "Validate Binary Search Tree" },
          { number: 173, name: "Binary Search Tree Iterator" },
          { number: 230, name: "Kth Smallest Element in a BST" },
          { number: 501, name: "Find Mode in Binary Search Tree" },
          { number: 530, name: "Minimum Absolute Difference in BST" }
        ]
      },
      {
        number: 15,
        name: "Recursive Postorder Traversal",
        problems: [
          { number: 104, name: "Maximum Depth of Binary Tree" },
          { number: 110, name: "Balanced Binary Tree" },
          { number: 124, name: "Binary Tree Maximum Path Sum" },
          { number: 145, name: "Binary Tree Postorder Traversal" },
          { number: 337, name: "House Robber III" },
          { number: 366, name: "Find Leaves of Binary Tree" },
          { number: 543, name: "Diameter of Binary Tree" },
          { number: 863, name: "All Nodes Distance K in Binary Tree" },
          { number: 1110, name: "Delete Nodes And Return Forest" },
          { number: 2458, name: "Height of Binary Tree After Subtree Removal Queries" }
        ]
      },
      {
        number: 16,
        name: "Lowest Common Ancestor",
        problems: [
          { number: 235, name: "Lowest Common Ancestor of a Binary Search Tree" },
          { number: 236, name: "Lowest Common Ancestor of a Binary Tree" }
        ]
      },
      {
        number: 17,
        name: "Serialization and Deserialization",
        problems: [
          { number: 297, name: "Serialize and Deserialize Binary Tree" },
          { number: 572, name: "Subtree of Another Tree" },
          { number: 652, name: "Find Duplicate Subtrees" }
        ]
      }
    ]
  },
  {
    number: "IV",
    name: "Graph Traversal Patterns (DFS & BFS)",
    patterns: [
      {
        number: 18,
        name: "DFS - Connected Components / Island Counting",
        problems: [
          { number: 130, name: "Surrounded Regions" },
          { number: 200, name: "Number of Islands" },
          { number: 417, name: "Pacific Atlantic Water Flow" },
          { number: 547, name: "Number of Provinces" },
          { number: 695, name: "Max Area of Island" },
          { number: 733, name: "Flood Fill" },
          { number: 841, name: "Keys and Rooms" },
          { number: 1020, name: "Number of Enclaves" },
          { number: 1254, name: "Number of Closed Islands" },
          { number: 1905, name: "Count Sub Islands" },
          { number: 2101, name: "Detonate the Maximum Bombs" }
        ]
      },
      {
        number: 19,
        name: "BFS - Connected Components / Island Counting",
        problems: [
          { number: 542, name: "01 Matrix" },
          { number: 994, name: "Rotting Oranges" },
          { number: 1091, name: "Shortest Path in Binary Matrix" }
        ]
      },
      {
        number: 20,
        name: "DFS - Cycle Detection",
        problems: [
          { number: 207, name: "Course Schedule" },
          { number: 210, name: "Course Schedule II" },
          { number: 802, name: "Find Eventual Safe States" },
          { number: 1059, name: "All Paths from Source Lead to Destination" }
        ]
      },
      {
        number: 21,
        name: "BFS - Topological Sort (Kahn's Algorithm)",
        problems: [
          { number: 210, name: "Course Schedule II" },
          { number: 269, name: "Alien Dictionary" },
          { number: 310, name: "Minimum Height Trees" },
          { number: 444, name: "Sequence Reconstruction" },
          { number: 1136, name: "Parallel Courses" },
          { number: 1857, name: "Largest Color Value in a Directed Graph" },
          { number: 2050, name: "Parallel Courses III" },
          { number: 2115, name: "Find All Possible Recipes from Given Supplies" },
          { number: 2392, name: "Build a Matrix With Conditions" }
        ]
      },
      {
        number: 22,
        name: "Deep Copy / Cloning",
        problems: [
          { number: 133, name: "Clone Graph" },
          { number: 1334, name: "Find the City With the Smallest Number of Neighbors at a Threshold Distance" },
          { number: 138, name: "Copy List with Random Pointer" },
          { number: 1490, name: "Clone N-ary Tree" }
        ]
      },
      {
        number: 23,
        name: "Shortest Path",
        problems: [
          { number: 743, name: "Network Delay Time" },
          { number: 778, name: "Swim in Rising Water" },
          { number: 1514, name: "Path with Maximum Probability" },
          { number: 1631, name: "Path With Minimum Effort" },
          { number: 1976, name: "Number of Ways to Arrive at Destination" },
          { number: 2045, name: "Second Minimum Time to Reach Destination" },
          { number: 2203, name: "Minimum Weighted Subgraph With the Required Paths" },
          { number: 2290, name: "Minimum Obstacle Removal to Reach Corner" },
          { number: 2577, name: "Minimum Time to Visit a Cell In a Grid" },
          { number: 2812, name: "Find the Safest Path in a Grid" }
        ]
      },
      {
        number: 24,
        name: "Shortest Path (Bellman-Ford / BFS+K)",
        problems: [
          { number: 787, name: "Cheapest Flights Within K Stops" },
          { number: 1129, name: "Shortest Path with Alternating Colors" }
        ]
      },
      {
        number: 25,
        name: "Union-Find",
        problems: [
          { number: 200, name: "Number of Islands" },
          { number: 261, name: "Graph Valid Tree" },
          { number: 305, name: "Number of Islands II" },
          { number: 323, name: "Number of Connected Components in an Undirected Graph" },
          { number: 547, name: "Number of Provinces" },
          { number: 684, name: "Redundant Connection" },
          { number: 721, name: "Accounts Merge" },
          { number: 737, name: "Sentence Similarity II" },
          { number: 947, name: "Most Stones Removed with Same Row or Column" },
          { number: 952, name: "Largest Component Size by Common Factor" },
          { number: 959, name: "Regions Cut By Slashes" },
          { number: 1101, name: "The Earliest Moment When Everyone Become Friends" }
        ]
      },
      {
        number: 26,
        name: "Strongly Connected Components (Kosaraju / Tarjan)",
        problems: [
          { number: 210, name: "Course Schedule II" },
          { number: 547, name: "Number of Provinces" },
          { number: 1192, name: "Critical Connections in a Network" },
          { number: 2127, name: "Maximum Employees to Be Invited to a Meeting" }
        ]
      },
      {
        number: 27,
        name: "Bridges & Articulation Points (Tarjan low-link)",
        problems: [
          { number: 1192, name: "Critical Connections in a Network" },
          { number: 2360, name: "Longest Cycle in a Graph" }
        ]
      },
      {
        number: 28,
        name: "Minimum Spanning Tree (Kruskal / Prim / DSU + heap)",
        problems: [
          { number: 1135, name: "Connecting Cities With Minimum Cost" },
          { number: 1584, name: "Min Cost to Connect All Points" },
          { number: 1168, name: "Optimize Water Distribution in a Village" },
          { number: 1489, name: "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree" }
        ]
      },
      {
        number: 29,
        name: "Bidirectional BFS",
        problems: [
          { number: 127, name: "Word Ladder" },
          { number: 126, name: "Word Ladder II" },
          { number: 815, name: "Bus Routes" }
        ]
      }
    ]
  },
  {
    number: "V",
    name: "Dynamic Programming (DP) Patterns",
    patterns: [
      {
        number: 30,
        name: "Fibonacci Style",
        problems: [
          { number: 70, name: "Climbing Stairs" },
          { number: 91, name: "Decode Ways" },
          { number: 198, name: "House Robber" },
          { number: 213, name: "House Robber II" },
          { number: 337, name: "House Robber III" },
          { number: 509, name: "Fibonacci Number" },
          { number: 740, name: "Delete and Earn" },
          { number: 746, name: "Min Cost Climbing Stairs" }
        ]
      },
      {
        number: 31,
        name: "Kadane's Algorithm for Max/Min Subarray",
        problems: [
          { number: 53, name: "Maximum Subarray" },
          { number: 918, name: "Maximum Sum Circular Subarray" },
          { number: 2321, name: "Maximum Score Of Spliced Array" },
          { number: 1749, name: "Maximum Absolute Sum of Any Subarray" },
          { number: 152, name: "Maximum Product Subarray" }
        ]
      },
      {
        number: 32,
        name: "Coin Change / Unbounded Knapsack Style",
        problems: [
          { number: 322, name: "Coin Change" },
          { number: 377, name: "Combination Sum IV" },
          { number: 518, name: "Coin Change II" }
        ]
      },
      {
        number: 33,
        name: "0/1 Knapsack, Subset Sum Style",
        problems: [
          { number: 416, name: "Partition Equal Subset Sum" },
          { number: 494, name: "Target Sum" }
        ]
      },
      {
        number: 34,
        name: "Word Break Style",
        problems: [
          { number: 139, name: "Word Break" },
          { number: 140, name: "Word Break II" }
        ]
      },
      {
        number: 35,
        name: "Longest Common Subsequence - LCS",
        problems: [
          { number: 1143, name: "Longest Common Subsequence" },
          { number: 1092, name: "Shortest Common Supersequence" },
          { number: 1312, name: "Minimum Insertion Steps to Make a String Palindrome" }
        ]
      },
      {
        number: 36,
        name: "Edit Distance / Levenshtein Distance",
        problems: [
          { number: 72, name: "Edit Distance" },
          { number: 583, name: "Delete Operation for Two Strings" },
          { number: 712, name: "Minimum ASCII Delete Sum for Two Strings" }
        ]
      },
      {
        number: 37,
        name: "Unique Paths on Grid",
        problems: [
          { number: 62, name: "Unique Paths" },
          { number: 63, name: "Unique Paths II" },
          { number: 64, name: "Minimum Path Sum" },
          { number: 120, name: "Triangle" },
          { number: 221, name: "Maximal Square" },
          { number: 931, name: "Minimum Falling Path Sum" },
          { number: 1277, name: "Count Square Submatrices with All Ones" }
        ]
      },
      {
        number: 38,
        name: "Interval DP",
        problems: [
          { number: 312, name: "Burst Balloons" },
          { number: 546, name: "Remove Boxes" }
        ]
      },
      {
        number: 39,
        name: "Catalan Numbers",
        problems: [
          { number: 95, name: "Unique Binary Search Trees II" },
          { number: 96, name: "Unique Binary Search Trees" },
          { number: 241, name: "Different Ways to Add Parentheses" }
        ]
      },
      {
        number: 40,
        name: "Longest Increasing Subsequence",
        problems: [
          { number: 300, name: "Longest Increasing Subsequence" },
          { number: 354, name: "Russian Doll Envelopes" },
          { number: 1671, name: "Minimum Number of Removals to Make Mountain Array" },
          { number: 2407, name: "Longest Increasing Subsequence II" }
        ]
      },
      {
        number: 41,
        name: "Stock problems",
        problems: [
          { number: 121, name: "Best Time to Buy and Sell Stock" },
          { number: 122, name: "Best Time to Buy and Sell Stock II" },
          { number: 123, name: "Best Time to Buy and Sell Stock III" },
          { number: 188, name: "Best Time to Buy and Sell Stock IV" },
          { number: 309, name: "Best Time to Buy and Sell Stock with Cooldown" }
        ]
      }
    ]
  },
  {
    number: "VI",
    name: "Heap (Priority Queue) Patterns",
    patterns: [
      {
        number: 42,
        name: "Top K Elements",
        problems: [
          { number: 215, name: "Kth Largest Element in an Array" },
          { number: 347, name: "Top K Frequent Elements" },
          { number: 451, name: "Sort Characters By Frequency" },
          { number: 506, name: "Relative Ranks" },
          { number: 703, name: "Kth Largest Element in a Stream" },
          { number: 973, name: "K Closest Points to Origin" },
          { number: 1046, name: "Last Stone Weight" },
          { number: 2558, name: "Take Gifts From the Richest Pile" }
        ]
      },
      {
        number: 43,
        name: "Two Heaps for Median Finding",
        problems: [
          { number: 295, name: "Find Median from Data Stream" },
          { number: 1825, name: "Finding MK Average" }
        ]
      },
      {
        number: 44,
        name: "K-way Merge",
        problems: [
          { number: 23, name: "Merge k Sorted Lists" },
          { number: 373, name: "Find K Pairs with Smallest Sums" },
          { number: 378, name: "Kth Smallest Element in a Sorted Matrix" },
          { number: 632, name: "Smallest Range Covering Elements from K Lists" }
        ]
      },
      {
        number: 45,
        name: "Scheduling / Minimum Cost",
        problems: [
          { number: 253, name: "Meeting Rooms II" },
          { number: 767, name: "Reorganize String" },
          { number: 857, name: "Minimum Cost to Hire K Workers" },
          { number: 1642, name: "Furthest Building You Can Reach" },
          { number: 1792, name: "Maximum Average Pass Ratio" },
          { number: 1834, name: "Single-Threaded CPU" },
          { number: 1942, name: "The Number of the Smallest Unoccupied Chair" },
          { number: 2402, name: "Meeting Rooms III" }
        ]
      }
    ]
  },
  {
    number: "VII",
    name: "Backtracking Patterns",
    patterns: [
      {
        number: 46,
        name: "Subsets (Include/Exclude)",
        problems: [
          { number: 17, name: "Letter Combinations of a Phone Number" },
          { number: 77, name: "Combinations" },
          { number: 78, name: "Subsets" },
          { number: 90, name: "Subsets II" }
        ]
      },
      {
        number: 47,
        name: "Permutations",
        problems: [
          { number: 31, name: "Next Permutation" },
          { number: 46, name: "Permutations" },
          { number: 60, name: "Permutation Sequence" }
        ]
      },
      {
        number: 48,
        name: "Combination Sum",
        problems: [
          { number: 39, name: "Combination Sum" },
          { number: 40, name: "Combination Sum II" }
        ]
      },
      {
        number: 49,
        name: "Parentheses Generation",
        problems: [
          { number: 22, name: "Generate Parentheses" },
          { number: 301, name: "Remove Invalid Parentheses" }
        ]
      },
      {
        number: 50,
        name: "Word Search / Path Finding in Grid",
        problems: [
          { number: 79, name: "Word Search" },
          { number: 212, name: "Word Search II" },
          { number: 2018, name: "Check if Word Can Be Placed In Crossword" }
        ]
      },
      {
        number: 51,
        name: "N-Queens / Constraint Satisfaction",
        problems: [
          { number: 37, name: "Sudoku Solver" },
          { number: 51, name: "N-Queens" }
        ]
      },
      {
        number: 52,
        name: "Palindrome Partitioning",
        problems: [
          { number: 131, name: "Palindrome Partitioning" },
          { number: 132, name: "Palindrome Partitioning II" },
          { number: 1457, name: "Pseudo-Palindromic Paths in a Binary Tree" }
        ]
      }
    ]
  },
  {
    number: "VIII",
    name: "Greedy Patterns",
    patterns: [
      {
        number: 53,
        name: "Interval Merging/Scheduling",
        problems: [
          { number: 56, name: "Merge Intervals" },
          { number: 57, name: "Insert Interval" },
          { number: 759, name: "Employee Free Time" },
          { number: 986, name: "Interval List Intersections" },
          { number: 2406, name: "Divide Intervals Into Minimum Number of Groups" }
        ]
      },
      {
        number: 54,
        name: "Jump Game Reachability/Minimization",
        problems: [
          { number: 45, name: "Jump Game II" },
          { number: 55, name: "Jump Game" }
        ]
      },
      {
        number: 55,
        name: "Buy/Sell Stock",
        problems: [
          { number: 121, name: "Best Time to Buy and Sell Stock" },
          { number: 122, name: "Best Time to Buy and Sell Stock II" }
        ]
      },
      {
        number: 56,
        name: "Gas Station Circuit",
        problems: [
          { number: 134, name: "Gas Station" },
          { number: 2202, name: "Maximize the Topmost Element After K Moves" }
        ]
      },
      {
        number: 57,
        name: "Task Scheduling",
        problems: [
          { number: 621, name: "Task Scheduler" },
          { number: 767, name: "Reorganize String" },
          { number: 1054, name: "Distant Barcodes" }
        ]
      },
      {
        number: 58,
        name: "Sorting Based",
        problems: [
          { number: 455, name: "Assign Cookies" },
          { number: 135, name: "Candy" },
          { number: 406, name: "Queue Reconstruction by Height" },
          { number: 1029, name: "Two City Scheduling" }
        ]
      }
    ]
  },
  {
    number: "IX",
    name: "Binary Search Patterns",
    patterns: [
      {
        number: 59,
        name: "On Sorted Array/List",
        problems: [
          { number: 35, name: "Search Insert Position" },
          { number: 69, name: "Sqrt(x)" },
          { number: 74, name: "Search a 2D Matrix" },
          { number: 278, name: "First Bad Version" },
          { number: 374, name: "Guess Number Higher or Lower" },
          { number: 540, name: "Single Element in a Sorted Array" },
          { number: 704, name: "Binary Search" },
          { number: 1539, name: "Kth Missing Positive Number" }
        ]
      },
      {
        number: 60,
        name: "Find Min/Max in Rotated Sorted Array",
        problems: [
          { number: 33, name: "Search in Rotated Sorted Array" },
          { number: 81, name: "Search in Rotated Sorted Array II" },
          { number: 153, name: "Find Minimum in Rotated Sorted Array" },
          { number: 162, name: "Find Peak Element" },
          { number: 852, name: "Peak Index in a Mountain Array" },
          { number: 1095, name: "Find in Mountain Array" }
        ]
      },
      {
        number: 61,
        name: "On Answer / Condition Function",
        problems: [
          { number: 410, name: "Split Array Largest Sum" },
          { number: 774, name: "Minimize Max Distance to Gas Station" },
          { number: 875, name: "Koko Eating Bananas" },
          { number: 1011, name: "Capacity To Ship Packages Within D Days" },
          { number: 1482, name: "Minimum Number of Days to Make m Bouquets" },
          { number: 1760, name: "Minimum Limit of Balls in a Bag" },
          { number: 2064, name: "Minimized Maximum of Products Distributed to Any Store" },
          { number: 2226, name: "Maximum Candies Allocated to K Children" }
        ]
      },
      {
        number: 62,
        name: "Find First/Last Occurrence",
        problems: [
          { number: 34, name: "Find First and Last Position of Element in Sorted Array" },
          { number: 658, name: "Find K Closest Elements" }
        ]
      },
      {
        number: 63,
        name: "Median / Kth across Two Sorted Arrays",
        problems: [
          { number: 4, name: "Median of Two Sorted Arrays" },
          { number: 719, name: "Find K-th Smallest Pair Distance" },
          { number: 378, name: "Kth Smallest Element in a Sorted Matrix" }
        ]
      }
    ]
  },
  {
    number: "X",
    name: "Stack Patterns",
    patterns: [
      {
        number: 64,
        name: "Valid Parentheses Matching",
        problems: [
          { number: 20, name: "Valid Parentheses" },
          { number: 32, name: "Longest Valid Parentheses" },
          { number: 921, name: "Minimum Add to Make Parentheses Valid" },
          { number: 1249, name: "Minimum Remove to Make Valid Parentheses" },
          { number: 1963, name: "Minimum Number of Swaps to Make the String Balanced" }
        ]
      },
      {
        number: 65,
        name: "Monotonic Stack",
        problems: [
          { number: 402, name: "Remove K Digits" },
          { number: 496, name: "Next Greater Element I" },
          { number: 503, name: "Next Greater Element II" },
          { number: 739, name: "Daily Temperatures" },
          { number: 901, name: "Online Stock Span" },
          { number: 907, name: "Sum of Subarray Minimums" },
          { number: 962, name: "Maximum Width Ramp" },
          { number: 1475, name: "Final Prices With a Special Discount in a Shop" },
          { number: 1673, name: "Find the Most Competitive Subsequence" }
        ]
      },
      {
        number: 66,
        name: "Expression Evaluation",
        problems: [
          { number: 150, name: "Evaluate Reverse Polish Notation" },
          { number: 224, name: "Basic Calculator" },
          { number: 227, name: "Basic Calculator II" },
          { number: 772, name: "Basic Calculator III" }
        ]
      },
      {
        number: 67,
        name: "Simulation / Backtracking Helper",
        problems: [
          { number: 71, name: "Simplify Path" },
          { number: 394, name: "Decode String" },
          { number: 735, name: "Asteroid Collision" }
        ]
      },
      {
        number: 68,
        name: "Min Stack Design",
        problems: [
          { number: 155, name: "Min Stack" },
          { number: 895, name: "Maximum Frequency Stack" },
          { number: 901, name: "Online Stock Span" }
        ]
      },
      {
        number: 69,
        name: "Largest Rectangle in Histogram",
        problems: [
          { number: 84, name: "Largest Rectangle in Histogram" },
          { number: 85, name: "Maximal Rectangle" }
        ]
      }
    ]
  },
  {
    number: "XI",
    name: "Bit Manipulation Patterns",
    patterns: [
      {
        number: 70,
        name: "Bitwise XOR - Finding Single/Missing Number",
        problems: [
          { number: 136, name: "Single Number" },
          { number: 137, name: "Single Number II" },
          { number: 268, name: "Missing Number" },
          { number: 389, name: "Find the Difference" }
        ]
      },
      {
        number: 71,
        name: "Bitwise AND - Counting Set Bits (Hamming Weight)",
        problems: [
          { number: 191, name: "Number of 1 Bits" },
          { number: 231, name: "Power of Two" },
          { number: 477, name: "Total Hamming Distance" }
        ]
      },
      {
        number: 72,
        name: "Bitwise DP - Counting Bits Optimization",
        problems: [
          { number: 338, name: "Counting Bits" },
          { number: 1494, name: "Parallel Courses II" },
          { number: 1442, name: "Count Triplets That Can Form Two Arrays of Equal XOR" }
        ]
      },
      {
        number: 73,
        name: "Bitwise Operations - Power of Two/Four Check",
        problems: [
          { number: 231, name: "Power of Two" },
          { number: 342, name: "Power of Four" }
        ]
      }
    ]
  },
  {
    number: "XII",
    name: "Linked List Manipulation Patterns",
    patterns: [
      {
        number: 74,
        name: "In-place Reversal",
        problems: [
          { number: 83, name: "Remove Duplicates from Sorted List" },
          { number: 92, name: "Reverse Linked List II" },
          { number: 206, name: "Reverse Linked List" },
          { number: 25, name: "Reverse Nodes in k-Group" },
          { number: 234, name: "Palindrome Linked List" },
          { number: 82, name: "Remove Duplicates from Sorted List II" }
        ]
      },
      {
        number: 75,
        name: "Merging Two Sorted Lists",
        problems: [
          { number: 21, name: "Merge Two Sorted Lists" },
          { number: 23, name: "Merge k Sorted Lists" }
        ]
      },
      {
        number: 76,
        name: "Addition of Numbers",
        problems: [
          { number: 2, name: "Add Two Numbers" },
          { number: 369, name: "Plus One Linked List" }
        ]
      },
      {
        number: 77,
        name: "Intersection Detection",
        problems: [
          { number: 160, name: "Intersection of Two Linked Lists" },
          { number: 599, name: "Minimum Index Sum of Two Lists" }
        ]
      },
      {
        number: 78,
        name: "Reordering / Partitioning",
        problems: [
          { number: 24, name: "Swap Nodes in Pairs" },
          { number: 61, name: "Rotate List" },
          { number: 86, name: "Partition List" },
          { number: 143, name: "Reorder List" },
          { number: 328, name: "Odd Even Linked List" }
        ]
      }
    ]
  },
  {
    number: "XIII",
    name: "Array/Matrix Manipulation Patterns",
    patterns: [
      {
        number: 79,
        name: "In-place Rotation",
        problems: [
          { number: 48, name: "Rotate Image" },
          { number: 189, name: "Rotate Array" },
          { number: 867, name: "Transpose Matrix" }
        ]
      },
      {
        number: 80,
        name: "Spiral Traversal",
        problems: [
          { number: 54, name: "Spiral Matrix" },
          { number: 59, name: "Spiral Matrix II" },
          { number: 885, name: "Spiral Matrix III" },
          { number: 2326, name: "Spiral Matrix IV" }
        ]
      },
      {
        number: 81,
        name: "In-place Marking",
        problems: [
          { number: 73, name: "Set Matrix Zeroes" },
          { number: 289, name: "Game of Life" },
          { number: 498, name: "Diagonal Traverse" }
        ]
      },
      {
        number: 82,
        name: "Prefix/Suffix Products",
        problems: [
          { number: 238, name: "Product of Array Except Self" },
          { number: 845, name: "Longest Mountain in Array" },
          { number: 2483, name: "Minimum Penalty for a Shop" }
        ]
      },
      {
        number: 83,
        name: "Plus One",
        problems: [
          { number: 66, name: "Plus One" },
          { number: 43, name: "Multiply Strings" },
          { number: 989, name: "Add to Array-Form of Integer" },
          { number: 67, name: "Add Binary" }
        ]
      },
      {
        number: 84,
        name: "In-place from End",
        problems: [
          { number: 88, name: "Merge Sorted Array" },
          { number: 977, name: "Squares of a Sorted Array" }
        ]
      },
      {
        number: 85,
        name: "Cyclic Sort",
        problems: [
          { number: 41, name: "First Missing Positive" },
          { number: 268, name: "Missing Number" },
          { number: 287, name: "Find the Duplicate Number" },
          { number: 442, name: "Find All Duplicates in an Array" },
          { number: 448, name: "Find All Numbers Disappeared in an Array" }
        ]
      }
    ]
  },
  {
    number: "XIV",
    name: "String Manipulation Patterns",
    patterns: [
      {
        number: 86,
        name: "Palindrome Check",
        problems: [
          { number: 9, name: "Palindrome Number" },
          { number: 125, name: "Valid Palindrome" },
          { number: 680, name: "Valid Palindrome II" }
        ]
      },
      {
        number: 87,
        name: "Anagram Check",
        problems: [
          { number: 49, name: "Group Anagrams" },
          { number: 242, name: "Valid Anagram" }
        ]
      },
      {
        number: 88,
        name: "Roman to Integer Conversion",
        problems: [
          { number: 13, name: "Roman to Integer" },
          { number: 12, name: "Integer to Roman" }
        ]
      },
      {
        number: 89,
        name: "String to Integer (atoi)",
        problems: [
          { number: 8, name: "String to Integer (atoi)" },
          { number: 65, name: "Valid Number" }
        ]
      },
      {
        number: 90,
        name: "Manual Simulation",
        problems: [
          { number: 43, name: "Multiply Strings" },
          { number: 415, name: "Add Strings" },
          { number: 67, name: "Add Binary" }
        ]
      },
      {
        number: 91,
        name: "String Matching - Naive / KMP / Rabin-Karp",
        problems: [
          { number: 28, name: "Find the Index of the First Occurrence in a String" },
          { number: 214, name: "Shortest Palindrome" },
          { number: 686, name: "Repeated String Match" },
          { number: 796, name: "Rotate String" },
          { number: 3008, name: "Find Beautiful Indices in the Given Array II" }
        ]
      },
      {
        number: 92,
        name: "Repeated Substring Pattern Detection",
        problems: [
          { number: 459, name: "Repeated Substring Pattern" },
          { number: 28, name: "Find the Index of the First Occurrence in a String" },
          { number: 686, name: "Repeated String Match" }
        ]
      }
    ]
  },
  {
    number: "XV",
    name: "Design Patterns",
    patterns: [
      {
        number: 93,
        name: "Design (General/Specific)",
        problems: [
          { number: 146, name: "LRU Cache" },
          { number: 155, name: "Min Stack" },
          { number: 225, name: "Implement Stack using Queues" },
          { number: 232, name: "Implement Queue using Stacks" },
          { number: 251, name: "Flatten 2D Vector" },
          { number: 271, name: "Encode and Decode Strings" },
          { number: 295, name: "Find Median from Data Stream" },
          { number: 341, name: "Flatten Nested List Iterator" },
          { number: 346, name: "Moving Average from Data Stream" },
          { number: 353, name: "Design Snake Game" },
          { number: 359, name: "Logger Rate Limiter" },
          { number: 362, name: "Design Hit Counter" },
          { number: 379, name: "Design Phone Directory" },
          { number: 380, name: "Insert Delete GetRandom O(1)" },
          { number: 432, name: "All O`one Data Structure" },
          { number: 460, name: "LFU Cache" },
          { number: 604, name: "604. D...", isTruncated: true } // Truncated row: Pattern 93 ends mid-word ("604. D...")
        ]
      },
      {
        number: 94,
        name: "Tries",
        problems: [
          { number: 208, name: "Implement Trie (Prefix Tree)" },
          { number: 211, name: "Design Add and Search Words Data Structure" },
          { number: 720, name: "Longest Word in Dictionary" },
          { number: 648, name: "Replace Words" },
          { number: 425, name: "Word Squares" },
          { number: 642, name: "Design Search Autocomplete System" },
          { number: 745, name: "Prefix and Suffix Search" }
        ]
      }
    ]
  }
];
