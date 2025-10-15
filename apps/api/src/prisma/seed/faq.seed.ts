import { FAQ, PrismaClient } from '@prisma/client';
import { randomInt } from './helpers/seed.helper';

export const seedFAQs = async (prisma: PrismaClient): Promise<FAQ[]> => {
  const faqs = [];

  const faqData = [
    {
      q: 'How do I submit a fact-check request?',
      a: 'Click the "Submit for Fact-Check" button and fill out the form with details about the claim.',
      cat: 'Submissions',
    },
    {
      q: 'How long does fact-checking take?',
      a: 'Typically 3-7 business days depending on complexity.',
      cat: 'Submissions',
    },
    {
      q: 'Can I submit anonymously?',
      a: 'Yes, you can choose to submit anonymously when filling out the form.',
      cat: 'Submissions',
    },
    {
      q: 'What types of content can I submit?',
      a: 'You can submit text, images, videos, audio, or links.',
      cat: 'Submissions',
    },
    {
      q: 'How are fact-checks prioritized?',
      a: 'Based on impact, urgency, and public interest.',
      cat: 'Submissions',
    },
    {
      q: 'Are the courses free?',
      a: 'Yes, all courses are completely free.',
      cat: 'Courses',
    },
    {
      q: 'Do I get a certificate?',
      a: 'Yes, upon completing a course you receive a verified certificate.',
      cat: 'Courses',
    },
    {
      q: 'Can I take courses at my own pace?',
      a: 'Absolutely! All courses are self-paced.',
      cat: 'Courses',
    },
    {
      q: 'Are there prerequisites?',
      a: 'Some advanced courses have prerequisites listed on the course page.',
      cat: 'Courses',
    },
    {
      q: 'Can I download course materials?',
      a: 'Yes, most lessons include downloadable resources.',
      cat: 'Courses',
    },
    {
      q: 'How do I register for events?',
      a: 'Click "Register" on the event page and fill out the form.',
      cat: 'Events',
    },
    {
      q: 'Are events free to attend?',
      a: 'Yes, all our events are free.',
      cat: 'Events',
    },
    {
      q: 'Can I attend events virtually?',
      a: 'Many events offer virtual attendance options.',
      cat: 'Events',
    },
    {
      q: 'Will I receive event recordings?',
      a: 'Registered attendees receive recordings after the event.',
      cat: 'Events',
    },
    {
      q: 'Can I cancel my registration?',
      a: 'Yes, you can cancel anytime before the event.',
      cat: 'Events',
    },
    {
      q: 'How do I earn points?',
      a: 'By submitting content, attending events, completing courses, and engaging.',
      cat: 'Gamification',
    },
    {
      q: 'What can I do with points?',
      a: 'Points increase your level and unlock achievements.',
      cat: 'Gamification',
    },
    {
      q: 'How do achievements work?',
      a: 'Achievements are unlocked by completing specific actions.',
      cat: 'Gamification',
    },
    {
      q: 'Can I see the leaderboard?',
      a: 'Yes, visit the Leaderboard page to see top contributors.',
      cat: 'Gamification',
    },
    {
      q: 'What is reputation?',
      a: 'Reputation reflects the quality of your contributions.',
      cat: 'Gamification',
    },
    {
      q: 'How do I verify a certificate?',
      a: 'Enter the certificate number on our verification page.',
      cat: 'Certificates',
    },
    {
      q: 'Can I download my certificate?',
      a: 'Yes, certificates are available as PDF downloads.',
      cat: 'Certificates',
    },
    {
      q: 'Do certificates expire?',
      a: 'No, our certificates are valid indefinitely.',
      cat: 'Certificates',
    },
    {
      q: 'Can employers verify certificates?',
      a: 'Yes, using the unique verification code.',
      cat: 'Certificates',
    },
    {
      q: 'How do I update my profile?',
      a: 'Go to Settings > Profile to update your information.',
      cat: 'Account',
    },
    {
      q: 'Can I change my username?',
      a: 'Yes, in your profile settings.',
      cat: 'Account',
    },
    {
      q: 'How do I delete my account?',
      a: 'Contact support or use the Delete Account option in settings.',
      cat: 'Account',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes, we use industry-standard security measures.',
      cat: 'Account',
    },
    {
      q: 'Can I connect with Google?',
      a: 'Yes, you can sign in with Google.',
      cat: 'Account',
    },
    {
      q: 'What is your fact-checking methodology?',
      a: 'We follow international fact-checking standards and consult multiple sources.',
      cat: 'Methodology',
    },
    {
      q: 'Who are your fact-checkers?',
      a: 'Trained journalists, researchers, and subject matter experts.',
      cat: 'Methodology',
    },
    {
      q: 'How do you rate claims?',
      a: 'Using a standardized veracity scale from True to False.',
      cat: 'Methodology',
    },
    {
      q: 'Can I dispute a fact-check?',
      a: 'Yes, contact us with additional evidence for review.',
      cat: 'Methodology',
    },
    {
      q: 'How do I report misinformation?',
      a: 'Use the "Report" button or submit via our contact form.',
      cat: 'Safety',
    },
    {
      q: 'How do I save fact-checks?',
      a: 'Click the bookmark icon on any fact-check.',
      cat: 'Features',
    },
    {
      q: 'Can I share fact-checks?',
      a: 'Yes, use the share buttons on each fact-check page.',
      cat: 'Features',
    },
    {
      q: 'How do notifications work?',
      a: 'You receive notifications for important updates and responses.',
      cat: 'Features',
    },
    {
      q: 'Can I comment on fact-checks?',
      a: 'Yes, registered users can comment on published fact-checks.',
      cat: 'Features',
    },
    {
      q: 'Is there a mobile app?',
      a: 'Currently web-only, mobile apps coming soon.',
      cat: 'Platform',
    },
    {
      q: 'Which browsers are supported?',
      a: 'All modern browsers including Chrome, Firefox, Safari, and Edge.',
      cat: 'Platform',
    },
    {
      q: 'Do you have an API?',
      a: 'Yes, contact us for API access.',
      cat: 'Platform',
    },
    {
      q: 'How can I support Tahaqaq 360?',
      a: 'Share our content, participate in events, and spread awareness.',
      cat: 'Community',
    },
    {
      q: 'Can I volunteer?',
      a: 'Yes! Contact us about volunteer opportunities.',
      cat: 'Community',
    },
    {
      q: 'How do I become a moderator?',
      a: 'Active contributors may be invited to become moderators.',
      cat: 'Community',
    },
    {
      q: 'Can I host an event?',
      a: 'Yes, submit a host request through our events page.',
      cat: 'Community',
    },
    {
      q: 'How do I contact support?',
      a: 'Use our contact form or email support@tahaqaq360.com',
      cat: 'Support',
    },
    {
      q: 'What are your response times?',
      a: 'We aim to respond within 24-48 hours.',
      cat: 'Support',
    },
    {
      q: 'Can I suggest features?',
      a: 'Absolutely! We welcome feedback and suggestions.',
      cat: 'Support',
    },
    {
      q: 'Where can I report bugs?',
      a: 'Use the contact form or email technical@tahaqaq360.com',
      cat: 'Support',
    },
    {
      q: 'Is Tahaqaq 360 non-profit?',
      a: 'Yes, we are a non-profit organization.',
      cat: 'About',
    },
  ];

  for (let i = 0; i < faqData.length; i++) {
    const faq = await prisma.fAQ.create({
      data: {
        question: faqData[i].q,
        answer: faqData[i].a,
        category: faqData[i].cat,
        order: i + 1,
        isPublished: true,
        views: randomInt(10, 1000),
      },
    });
    faqs.push(faq);
  }
  return faqs;
};
