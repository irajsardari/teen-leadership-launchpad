export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  featuredImage: string;
  excerpt: string;
  content: string;
  slug: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "4",
    title: "Where Teen Leadership Really Begins",
    author: "Dr. Iraj Sardari Baf",
    date: "2025-08-01",
    featuredImage: "/src/assets/teen-leadership-age-13-banner.jpg",
    excerpt: "Why age 13 might be the most powerful year of a teenager's life - exploring the secret beginning of leadership in adolescence.",
    content: `# Where Teen Leadership Really Begins
## Why age 13 might be the most powerful year of a teenager's life

We often ask, "What makes a good leader?" But perhaps a better question is: "When does leadership begin?"

At the Teenagers Management Academy (TMA), we've observed something extraordinary: age 13 is not just the start of adolescence — it's the secret beginning of leadership.

## The Age of Awakening

At 13, a teenager is no longer a child but not yet fully grown. It's a delicate stage of transition. Yet within this transition lies a hidden strength. It's when:

- Identity begins to form
- Opinions start to matter more than imitation  
- A sense of justice, independence, and contribution awakens

## Why Schools Often Miss This Window

Traditional education waits until university to talk about leadership. But by then, most patterns of confidence, fear, expression, and ambition are already set.

At TMA, we believe leadership is not a college course. It's a mindset that begins much earlier — when teenagers are just discovering who they are.

## What Leadership Looks Like at 13

Leadership at 13 doesn't mean running a company. It means:

- Leading yourself through tough emotions
- Standing up for what's right
- Taking responsibility at home or school
- Organizing a group project or helping a friend

These are not small acts. They're the early bricks of leadership.

## The Role of Adults

Parents and educators often underestimate how much 13-year-olds can handle. But when trusted with responsibility, mentorship, and space to grow, many teens thrive.

At TMA, we've seen 13-year-olds:

- Give powerful speeches
- Lead school-wide initiatives
- Mentor younger students

They don't need permission to lead.
They need someone to believe they can.

## Final Thought

If we want a world of ethical, emotionally intelligent, and visionary leaders — we must start young.

Age 13 is not too early.
It might be just in time.

---

**Explore more insights at TMA Voices — where the future of teenage leadership is written.**`,
    slug: "where-teen-leadership-really-begins",
    seo: {
      metaTitle: "Where Teen Leadership Really Begins | TMA Academy",
      metaDescription: "Discover why age 13 might be the most powerful year for teenage leadership development and how TMA helps young leaders discover their potential early.",
      keywords: ["teen leadership", "teenage development", "education", "age 13", "leadership development", "TMA Academy"]
    },
    category: "Teen Leadership"
  }
];