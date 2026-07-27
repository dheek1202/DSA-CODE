import fs from "fs";
import path from "path";
import { categoriesData, RawProblem } from "../lib/problems-data";

interface LeetCodeStat {
  stat: {
    question_id: number;
    frontend_question_id: number;
    question__title: string;
    question__title_slug: string;
  };
  difficulty: {
    level: number; // 1: Easy, 2: Medium, 3: Hard
  };
}

interface LeetCodeApiResponse {
  stat_status_pairs: LeetCodeStat[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function mapDifficulty(level: number): string {
  if (level === 1) return "Easy";
  if (level === 2) return "Medium";
  if (level === 3) return "Hard";
  return "Medium";
}

async function runSeed() {
  console.log("Starting LeetCode problem data seed...");
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  let leetCodeMap = new Map<number, { slug: string; difficulty: string }>();

  try {
    console.log("Fetching official LeetCode problems list...");
    const response = await fetch("https://leetcode.com/api/problems/all/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch LeetCode API: ${response.statusText}`);
    }

    const data = (await response.json()) as LeetCodeApiResponse;
    console.log(`Successfully fetched ${data.stat_status_pairs.length} LeetCode problems metadata.`);

    for (const item of data.stat_status_pairs) {
      leetCodeMap.set(item.stat.frontend_question_id, {
        slug: item.stat.question__title_slug,
        difficulty: mapDifficulty(item.difficulty.level),
      });
    }
  } catch (err: any) {
    console.warn("WARNING: Failed to fetch LeetCode API. Falling back to local slug generation. Error:", err.message);
  }

  // Seeded problems array
  const seededProblems: any[] = [];
  let orderIndex = 1;

  for (const category of categoriesData) {
    for (const pattern of category.patterns) {
      let patternOrder = 1;
      for (const rawProblem of pattern.problems) {
        // Resolve slug and difficulty
        let slug = "";
        let difficulty = "Medium";

        // Special handling for data quality issues
        if (rawProblem.isStray) {
          slug = "two-sum"; // LeetCode 1
          difficulty = "Easy";
        } else if (rawProblem.isTruncated) {
          slug = "design-compressed-string-iterator"; // LeetCode 604
          difficulty = "Easy";
        } else {
          const matched = leetCodeMap.get(rawProblem.number);
          if (matched) {
            slug = matched.slug;
            difficulty = matched.difficulty;
          } else {
            slug = slugify(rawProblem.name);
            // Deduce some common difficulties or default to Medium
            difficulty = "Medium";
          }
        }

        const seededProblem = {
          id: `problem-${rawProblem.number}-${category.number}-${pattern.number}-${patternOrder}`,
          leetcode_number: rawProblem.number,
          leetcode_slug: slug,
          name: rawProblem.name,
          category: category.name,
          category_number: category.number,
          pattern_number: pattern.number,
          pattern_name: pattern.name,
          difficulty: difficulty,
          order_in_pattern: patternOrder,
          order_overall: orderIndex,
          is_stray: !!rawProblem.isStray,
          is_truncated: !!rawProblem.isTruncated,
        };

        seededProblems.push(seededProblem);
        patternOrder++;
        orderIndex++;
      }
    }
  }

  // Write to data/problems-seeded.json
  const outputPath = path.join(dataDir, "problems-seeded.json");
  fs.writeFileSync(outputPath, JSON.stringify(seededProblems, null, 2), "utf8");
  console.log(`Successfully seeded ${seededProblems.length} problems to ${outputPath}`);

  // Also output Supabase SQL statements in a file for user convenience
  const sqlStatements = seededProblems.map(p => {
    return `INSERT INTO problems (id, leetcode_number, leetcode_slug, name, category, pattern_number, pattern_name, difficulty, order_in_pattern) VALUES ('${p.id}', ${p.leetcode_number}, '${p.leetcode_slug}', '${p.name.replace(/'/g, "''")}', '${p.category.replace(/'/g, "''")}', ${p.pattern_number}, '${p.pattern_name.replace(/'/g, "''")}', '${p.difficulty}', ${p.order_in_pattern}) ON CONFLICT (id) DO UPDATE SET leetcode_slug = EXCLUDED.leetcode_slug, difficulty = EXCLUDED.difficulty;`;
  });

  const sqlPath = path.join(dataDir, "seed-problems.sql");
  fs.writeFileSync(sqlPath, sqlStatements.join("\n"), "utf8");
  console.log(`Generated Supabase SQL seeds in ${sqlPath}`);
}

runSeed().catch(err => {
  console.error("Seeding script failed:", err);
  process.exit(1);
});
