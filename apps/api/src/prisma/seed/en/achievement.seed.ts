import { Achievement, PrismaClient } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';

export const seedAchievements = async (
  prisma: PrismaClient,
): Promise<Achievement[]> => {
  console.log('🌱 Starting achievement seeding...');

  const achievementCategories = [
    'Contribution',
    'Learning',
    'Social',
    'Expert',
    'Progress',
  ];
  const achievements = [];

  const achievementData = [
    {
      name: 'First Steps',
      description: 'Create your account',
      points: 10,
      criteria: { type: 'signup', count: 1 },
    },
    {
      name: 'First Submission',
      description: 'Submit your first fact-check request',
      points: 25,
      criteria: { type: 'submissions', count: 1 },
    },
    {
      name: 'Active Contributor',
      description: 'Submit 10 fact-check requests',
      points: 100,
      criteria: { type: 'submissions', count: 10 },
    },
    {
      name: 'Super Contributor',
      description: 'Submit 50 fact-check requests',
      points: 500,
      criteria: { type: 'submissions', count: 50 },
    },
    {
      name: 'Master Contributor',
      description: 'Submit 100 fact-check requests',
      points: 1000,
      criteria: { type: 'submissions', count: 100 },
    },
    {
      name: 'Course Starter',
      description: 'Enroll in your first course',
      points: 20,
      criteria: { type: 'enrollments', count: 1 },
    },
    {
      name: 'Course Completer',
      description: 'Complete your first course',
      points: 100,
      criteria: { type: 'completions', count: 1 },
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 5 courses',
      points: 500,
      criteria: { type: 'completions', count: 5 },
    },
    {
      name: 'Scholar',
      description: 'Complete 10 courses',
      points: 1000,
      criteria: { type: 'completions', count: 10 },
    },
    {
      name: 'Expert Learner',
      description: 'Complete 25 courses',
      points: 2500,
      criteria: { type: 'completions', count: 25 },
    },
    {
      name: 'Event Attendee',
      description: 'Attend your first event',
      points: 30,
      criteria: { type: 'events', count: 1 },
    },
    {
      name: 'Event Enthusiast',
      description: 'Attend 5 events',
      points: 150,
      criteria: { type: 'events', count: 5 },
    },
    {
      name: 'Event Regular',
      description: 'Attend 10 events',
      points: 300,
      criteria: { type: 'events', count: 10 },
    },
    {
      name: 'Event Champion',
      description: 'Attend 25 events',
      points: 750,
      criteria: { type: 'events', count: 25 },
    },
    {
      name: 'Commenter',
      description: 'Leave your first comment',
      points: 15,
      criteria: { type: 'comments', count: 1 },
    },
    {
      name: 'Active Discussant',
      description: 'Leave 25 comments',
      points: 100,
      criteria: { type: 'comments', count: 25 },
    },
    {
      name: 'Discussion Leader',
      description: 'Leave 100 comments',
      points: 500,
      criteria: { type: 'comments', count: 100 },
    },
    {
      name: 'Point Milestone I',
      description: 'Earn 100 points',
      points: 50,
      criteria: { type: 'points', count: 100 },
    },
    {
      name: 'Point Milestone II',
      description: 'Earn 500 points',
      points: 100,
      criteria: { type: 'points', count: 500 },
    },
    {
      name: 'Point Milestone III',
      description: 'Earn 1000 points',
      points: 200,
      criteria: { type: 'points', count: 1000 },
    },
    {
      name: 'Point Milestone IV',
      description: 'Earn 5000 points',
      points: 500,
      criteria: { type: 'points', count: 5000 },
    },
    {
      name: 'Point Master',
      description: 'Earn 10000 points',
      points: 1000,
      criteria: { type: 'points', count: 10000 },
    },
    {
      name: 'Rising Star',
      description: 'Reach level 5',
      points: 250,
      criteria: { type: 'level', count: 5 },
    },
    {
      name: 'Veteran',
      description: 'Reach level 10',
      points: 500,
      criteria: { type: 'level', count: 10 },
    },
    {
      name: 'Legend',
      description: 'Reach level 20',
      points: 1000,
      criteria: { type: 'level', count: 20 },
    },
    {
      name: 'Early Adopter',
      description: 'Join in the first month',
      points: 100,
      criteria: { type: 'early', count: 1 },
    },
    {
      name: 'One Week Streak',
      description: 'Log in for 7 consecutive days',
      points: 50,
      criteria: { type: 'streak', count: 7 },
    },
    {
      name: 'One Month Streak',
      description: 'Log in for 30 consecutive days',
      points: 250,
      criteria: { type: 'streak', count: 30 },
    },
    {
      name: 'Helpful',
      description: 'Get 10 upvotes on your comments',
      points: 100,
      criteria: { type: 'upvotes', count: 10 },
    },
    {
      name: 'Very Helpful',
      description: 'Get 50 upvotes on your comments',
      points: 500,
      criteria: { type: 'upvotes', count: 50 },
    },
    {
      name: 'Quiz Master',
      description: 'Pass 10 quizzes',
      points: 200,
      criteria: { type: 'quizzes', count: 10 },
    },
    {
      name: 'Perfect Score',
      description: 'Get 100% on 5 quizzes',
      points: 300,
      criteria: { type: 'perfect', count: 5 },
    },
    {
      name: 'Certified',
      description: 'Earn your first certificate',
      points: 200,
      criteria: { type: 'certificates', count: 1 },
    },
    {
      name: 'Multi-Certified',
      description: 'Earn 5 certificates',
      points: 1000,
      criteria: { type: 'certificates', count: 5 },
    },
    {
      name: 'Reputation Builder',
      description: 'Reach 100 reputation',
      points: 100,
      criteria: { type: 'reputation', count: 100 },
    },
    {
      name: 'Well Known',
      description: 'Reach 500 reputation',
      points: 500,
      criteria: { type: 'reputation', count: 500 },
    },
    {
      name: 'Influencer',
      description: 'Reach 1000 reputation',
      points: 1000,
      criteria: { type: 'reputation', count: 1000 },
    },
    {
      name: 'Content Saver',
      description: 'Save 10 fact-checks',
      points: 50,
      criteria: { type: 'saved', count: 10 },
    },
    {
      name: 'Fact Collector',
      description: 'Save 50 fact-checks',
      points: 250,
      criteria: { type: 'saved', count: 50 },
    },
    {
      name: 'Sharer',
      description: 'Share 10 fact-checks',
      points: 100,
      criteria: { type: 'shares', count: 10 },
    },
    {
      name: 'Viral Sharer',
      description: 'Share 50 fact-checks',
      points: 500,
      criteria: { type: 'shares', count: 50 },
    },
    {
      name: 'Night Owl',
      description: 'Submit content after midnight',
      points: 25,
      criteria: { type: 'night', count: 1 },
    },
    {
      name: 'Early Bird',
      description: 'Submit content before 6 AM',
      points: 25,
      criteria: { type: 'morning', count: 1 },
    },
    {
      name: 'Weekend Warrior',
      description: 'Submit 10 items on weekends',
      points: 150,
      criteria: { type: 'weekend', count: 10 },
    },
    {
      name: 'Verified Master',
      description: 'Have 10 submissions verified',
      points: 500,
      criteria: { type: 'verified', count: 10 },
    },
    {
      name: 'Quality Contributor',
      description: 'Have 20 submissions verified',
      points: 1000,
      criteria: { type: 'verified', count: 20 },
    },
    {
      name: 'Completionist',
      description: 'Complete your profile 100%',
      points: 50,
      criteria: { type: 'profile', count: 100 },
    },
    {
      name: 'Social Butterfly',
      description: 'Connect with 25 users',
      points: 200,
      criteria: { type: 'connections', count: 25 },
    },
    {
      name: 'Team Player',
      description: 'Collaborate on 5 fact-checks',
      points: 300,
      criteria: { type: 'collaborations', count: 5 },
    },
    {
      name: 'Long-term Supporter',
      description: 'Active for 6 months',
      points: 500,
      criteria: { type: 'tenure', count: 180 },
    },
  ];

  for (const data of achievementData) {
    const achievement = await prisma.achievement.create({
      data: {
        ...data,
        icon: ['🏆', '⭐', '💯', '🎯', '🔥', '✨', '🎖️', '👑', '💎', '🌟'][
          randomInt(0, 9)
        ],
        category: randomElement(achievementCategories),
      },
    });
    achievements.push(achievement);
  }

  console.log(`✅ Created ${achievements.length} achievements\n`);

  return achievements;
};
