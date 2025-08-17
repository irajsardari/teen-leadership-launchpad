export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  linkedinUrl?: string;
  role?: string;
}

export const authors: Record<string, Author> = {
  'dr-iraj-sardari-baf': {
    id: 'dr-iraj-sardari-baf',
    name: 'Dr. Iraj Sardari Baf',
    bio: 'Dr. Iraj Sardari Baf is the founder of the Teenagers Management Academy (TMA), with over two decades of leadership experience in banking, education, and organizational behavior. A passionate advocate for youth empowerment, he writes about teenage leadership, emotional intelligence, and the future of education.',
    avatar: '/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png',
    role: 'Founder & Educational Leader'
  },
  'ali-bagheri': {
    id: 'ali-bagheri',
    name: 'Ali Bagheri',
    bio: 'Ali Bagheri is an entrepreneur and businessman in Oman. He started working at the age of 11 and, now in his 40s, leads a successful business. As the father of three teenagers, he is passionate about helping the next generation build better lives by making the right choices early. Through sharing his experiences, he hopes to inspire teenagers to plant good seeds today for a meaningful harvest tomorrow.',
    avatar: '/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png',
    role: 'Entrepreneur & Business Leader'
  },
  'tma-academy': {
    id: 'tma-academy',
    name: 'Teenagers Management Academy (TMA)',
    bio: 'The Teenagers Management Academy (TMA) is a pioneering educational institution dedicated to developing teenage leadership, emotional intelligence, and life skills. Our expert team of educators and researchers creates content to guide teenagers through their formative years with evidence-based insights and practical wisdom.',
    avatar: '/lovable-uploads/fc2e671f-8b1e-4540-a554-140cadbf1d9e.png',
    role: 'Educational Institution'
  }
};

export const getAuthorByName = (authorName: string): Author | null => {
  const author = Object.values(authors).find(a => a.name === authorName);
  return author || null;
};