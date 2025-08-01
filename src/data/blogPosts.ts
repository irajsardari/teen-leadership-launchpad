import teenLeadershipBanner from "@/assets/teen-leadership-age-13-banner.jpg";
import responsibilityBanner from "@/assets/responsibility-teen-watering-plant.jpg";
import knowYourselfBanner from "@/assets/know-yourself-teen-mirror-reflection.jpg";

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
  tags?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "6",
    title: "Know Yourself — The Beginning of Every Journey",
    author: "Dr. Iraj Sardari Baf",
    date: "2025-06-03",
    featuredImage: knowYourselfBanner,
    excerpt: "In today's fast-moving world, many teenagers feel uncertain about their identity. The most important journey of your life begins with one step — knowing yourself.",
    content: `# Know Yourself — The Beginning of Every Journey

In today's fast-moving and complicated world, it's easy to lose touch with who we really are. Many teenagers feel uncertain, lost, or confused about their identity. But let me tell you something powerful: the most important journey of your life begins with one step — knowing yourself.

This is not just advice for teenagers. Many adults go through life without truly understanding who they are, what makes them unique, and where their real strengths lie. They try to be everything, and end up feeling like they are nothing. That's why we must begin early.

---

## The Mirror of Self-Discovery

Knowing yourself means looking into the mirror — not just to see your face, but to recognize your values, talents, habits, and hopes. It means becoming aware of your strengths and weaknesses. It's like doing a personal SWOT analysis:

- **S for Strengths**: What am I good at? What comes naturally to me?
- **W for Weaknesses**: What areas do I struggle in?
- **O for Opportunities**: What paths are available for someone with my talents?
- **T for Threats**: What could stop me from growing?

But this isn't just about writing a list. It's about being honest. Sometimes, we waste years trying to fix a weakness instead of developing our true strengths. For example, if I know I'm not gifted in music, but I shine in writing or public speaking, I shouldn't spend my time trying to be an average musician. Instead, I should invest in my natural strengths — because these are the doors through which success enters.

---

## The Power of Authenticity

And here's the truth: you don't have unlimited time. Many people think they do. But real progress comes when you stop pretending and start focusing. Teenagers who begin to know themselves early in life will not only avoid confusion — they will rise above it.

🔥 **One of the biggest mistakes we can make is to imitate others who have succeeded in their own way.**

What works for someone else may not work for you — and that's okay. Be original. Because when you are original, you are already a winner.

Originality begins with self-knowledge. You must understand your unique gifts and talents. Instead of comparing yourself to someone else's story, compare yourself to who you were yesterday. If you want to grow, grow from within. If you want to lead, lead from your own foundation.

---

## Your Journey Starts Now

So how can you start this journey?

1. **Reflection**: Take time every week to write down what you enjoyed, what was difficult, and what made you feel proud.
2. **Feedback**: Ask a trusted mentor, parent, or teacher: What do you see in me that I may not see in myself?
3. **Experience**: Try different tasks, clubs, and activities. You won't know who you are unless you explore.
4. **Acceptance**: Not everyone is good at everything. And that's perfectly okay. You are not meant to be everything — you are meant to be you.

At TMA, we believe identity is not something you "find" once — it's something you build over time. And the earlier you begin this practice, the more powerful your future will be.

Because before you can lead others, you must lead yourself. And before you lead yourself — you must know who you are.

---

**Explore more insights at TMA Voices — where the future of teenage leadership is written.**`,
    slug: "know-yourself-the-beginning-of-every-journey",
    seo: {
      metaTitle: "Know Yourself — The Beginning of Every Journey | TMA Academy",
      metaDescription: "Discover why self-knowledge is the foundation of all personal growth and leadership. Learn how teenagers can begin their journey of self-discovery early.",
      keywords: ["self-awareness", "teen identity", "personal development", "self-knowledge", "teen leadership", "TMA Academy"]
    },
    category: "Identity & Self-Awareness",
    tags: ["TeenLeadership", "Identity", "EmotionalIntelligence", "SelfAwareness"]
  },
  {
    id: "5",
    title: "Responsibility: The First Step to a Life That Matters",
    author: "Dr. Iraj Sardari Baf",
    date: "2025-05-10",
    featuredImage: responsibilityBanner,
    excerpt: "Being responsible is not something you suddenly learn at 25. It's a practice, a skill, a habit that must start young - and it's the foundation of all progress.",
    content: `# Responsibility: The First Step to a Life That Matters

When we talk about life skills — leadership, decision-making, emotional intelligence, financial literacy — we often forget to name the one that comes first: Responsibility.

Being responsible is not something you suddenly learn at the age of 25. It doesn't come through lectures, textbooks, or multiple-choice exams. Responsibility is a practice. It's a skill. It's a habit. Like learning to play the piano or speak a new language, it requires repetition, commitment, and trust — starting from a young age.

---

## The Power of Small Tasks

A few years ago, I was speaking with the principal of my son's school. He proudly explained the many academic subjects they cover — science, geography, history — and the assessments they use to track student progress.

I listened and then gently replied:

"Thank you for all your efforts, but I'm not here to ask about exams or grades. What I want is for my son to be responsible — even if it starts with something small. Let him be in charge of the class marker and eraser."

At first, it seemed like a trivial request. But here's what I meant:

If my son learns to take care of the classroom tools, he's not just helping the teacher. He's learning how to take care of the people and places around him — his teacher, his classmates, his school, and eventually his family, his community, and his country.

Responsibility is a seed. When we water it, it grows into loyalty, leadership, and love.

---

## We Are Not Waiting for Dentists

Think about this: Who is responsible for your dental health — the dentist, or you?

We all know the answer. But many people still wait until it's too late — until they're in pain, until the damage is done, until someone else has to fix what they ignored.

It's the same with life.

Some people take responsibility at 15. Others still avoid it at 70. Even after a heart surgery, some go back to smoking — because they never practiced what it means to own their choices.

---

## What Teenagers Truly Need

At TMA, we believe that responsibility is not taught by lectures. It's built by trust.

Give teenagers real responsibilities — not as a punishment, but as a privilege. Let them lead a group discussion. Let them organize a simple task. Let them keep the space clean, handle the projector, care for a plant, or mentor a younger student.

Every small responsibility is a step toward becoming someone others can count on.

---

## The Foundation of All Progress

Responsibility isn't just one value among many. It is the foundation.

When you are responsible, you begin to:

- Respect your time
- Honor your relationships
- Think before you act
- Contribute instead of consuming
- And believe that your choices shape your life

If we want our teenagers to become strong, independent, kind, and capable human beings — we must stop doing everything for them. Instead, we must believe in them enough to let go.

**Responsibility is not a burden. It's a beginning.**

---

**Explore more insights at TMA Voices — where the future of teenage leadership is written.**`,
    slug: "responsibility-the-first-step-to-a-life-that-matters",
    seo: {
      metaTitle: "Responsibility: The First Step to a Life That Matters | TMA Academy",
      metaDescription: "Discover why responsibility is the foundation of all life skills and how giving teenagers real responsibilities helps them become strong, independent leaders.",
      keywords: ["responsibility", "teen leadership", "life skills", "emotional intelligence", "youth development", "TMA Academy"]
    },
    category: "Life Skills",
    tags: ["TeenLeadership", "EmotionalIntelligence", "LifeSkills", "Responsibility"]
  },
  {
    id: "4",
    title: "Where Teen Leadership Really Begins",
    author: "Dr. Iraj Sardari Baf",
    date: "2025-08-01",
    featuredImage: teenLeadershipBanner,
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
    category: "Teen Leadership",
    tags: ["TeenLeadership", "Age13", "EmotionalIntelligence", "YouthDevelopment"]
  }
];