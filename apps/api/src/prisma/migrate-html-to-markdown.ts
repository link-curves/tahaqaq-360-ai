import { PrismaClient } from '@prisma/client';
const TurndownService = require('turndown');

const prisma = new PrismaClient();
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
  hr: '---',
});

// Configure Turndown to remove unwanted tags
turndownService.remove(['script', 'style', 'article', 'div']); // Remove these tags but keep their content

/**
 * Convert HTML to Markdown
 */
function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === '') return '';

  // Clean up the HTML first - remove class attributes and extra spacing
  let cleanHtml = html
    .replace(/class="[^"]*"/g, '') // Remove class attributes
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/<article[^>]*>/g, '') // Remove article opening tags
    .replace(/<\/article>/g, '') // Remove article closing tags
    .replace(/<div[^>]*>/g, '') // Remove div opening tags
    .replace(/<\/div>/g, '') // Remove div closing tags
    .trim();

  // Convert to Markdown
  const markdown = turndownService.turndown(cleanHtml);

  // Clean up the markdown
  return markdown
    .replace(/\n{3,}/g, '\n\n') // Remove multiple newlines
    .replace(/\*\*الباحثون:\*\*/g, '**الباحثون:**') // Fix bold formatting
    .replace(/\*\*الاتجاه /g, '**الاتجاه ') // Fix bold formatting
    .trim();
}

/**
 * Migrate Research fullContent from HTML to Markdown
 */
async function migrateResearch() {
  console.log('🔬 Migrating Research content from HTML to Markdown...');

  const researches = await prisma.research.findMany({
    select: { id: true, fullContent: true },
  });

  let updatedCount = 0;

  for (const research of researches) {
    // Check if content contains HTML tags
    if (research.fullContent && /<[^>]+>/.test(research.fullContent)) {
      const markdownContent = htmlToMarkdown(research.fullContent);

      await prisma.research.update({
        where: { id: research.id },
        data: { fullContent: markdownContent },
      });

      updatedCount++;
    }
  }

  console.log(
    `   ✅ Updated ${updatedCount} out of ${researches.length} research articles\n`,
  );
  return updatedCount;
}

/**
 * Migrate Course Lessons content from HTML to Markdown
 */
async function migrateCourseLessons() {
  console.log('📚 Migrating Course Lessons content from HTML to Markdown...');

  const lessons = await prisma.lesson.findMany({
    select: { id: true, content: true },
  });

  let updatedCount = 0;

  for (const lesson of lessons) {
    // Check if content contains HTML tags
    if (lesson.content && /<[^>]+>/.test(lesson.content)) {
      const markdownContent = htmlToMarkdown(lesson.content);

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { content: markdownContent },
      });

      updatedCount++;
    }
  }

  console.log(
    `   ✅ Updated ${updatedCount} out of ${lessons.length} lessons\n`,
  );
  return updatedCount;
}

/**
 * Migrate Event descriptions (if they contain HTML)
 */
async function migrateEvents() {
  console.log('🎪 Checking Events content...');

  const events = await prisma.event.findMany({
    select: { id: true, description: true },
  });

  let updatedCount = 0;

  for (const event of events) {
    // Check if description contains HTML tags
    if (event.description && /<[^>]+>/.test(event.description)) {
      const markdownContent = htmlToMarkdown(event.description);

      await prisma.event.update({
        where: { id: event.id },
        data: { description: markdownContent },
      });

      updatedCount++;
    }
  }

  console.log(`   ✅ Updated ${updatedCount} out of ${events.length} events\n`);
  return updatedCount;
} /**
 * Check if Fact Checks need migration (they should already be in markdown)
 */
async function checkFactChecks() {
  console.log('📰 Checking Fact Checks content...');

  const factChecks = await prisma.factCheck.findMany({
    select: { id: true, fullAnalysis: true, methodology: true },
  });

  let htmlCount = 0;

  for (const factCheck of factChecks) {
    if (
      (factCheck.fullAnalysis && /<[^>]+>/.test(factCheck.fullAnalysis)) ||
      (factCheck.methodology && /<[^>]+>/.test(factCheck.methodology))
    ) {
      htmlCount++;
    }
  }

  if (htmlCount > 0) {
    console.log(`   ⚠️  Found ${htmlCount} fact checks containing HTML`);
    console.log('   💡 Fact checks need migration\n');
  } else {
    console.log(
      `   ✅ All fact checks (${factChecks.length}) are already in Markdown format\n`,
    );
  }

  return htmlCount;
}

/**
 * Migrate Fact Checks if needed
 */
async function migrateFactChecks() {
  console.log('📰 Migrating Fact Checks content from HTML to Markdown...');

  const factChecks = await prisma.factCheck.findMany({
    select: { id: true, fullAnalysis: true, methodology: true },
  });

  let updatedCount = 0;

  for (const factCheck of factChecks) {
    const updates: any = {};

    if (factCheck.fullAnalysis && /<[^>]+>/.test(factCheck.fullAnalysis)) {
      updates.fullAnalysis = htmlToMarkdown(factCheck.fullAnalysis);
    }

    if (factCheck.methodology && /<[^>]+>/.test(factCheck.methodology)) {
      updates.methodology = htmlToMarkdown(factCheck.methodology);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.factCheck.update({
        where: { id: factCheck.id },
        data: updates,
      });

      updatedCount++;
    }
  }

  console.log(
    `   ✅ Updated ${updatedCount} out of ${factChecks.length} fact checks\n`,
  );
  return updatedCount;
}

/**
 * Check if Blog posts need migration (they should already be in markdown)
 */
async function checkBlogs() {
  console.log('📝 Checking Blog posts content...');

  const blogs = await prisma.blog.findMany({
    select: { id: true, content: true },
  });

  let htmlCount = 0;

  for (const blog of blogs) {
    if (blog.content && /<[^>]+>/.test(blog.content)) {
      htmlCount++;
    }
  }

  if (htmlCount > 0) {
    console.log(`   ⚠️  Found ${htmlCount} blog posts containing HTML`);
    console.log('   💡 Blog posts need migration\n');
  } else {
    console.log(
      `   ✅ All blog posts (${blogs.length}) are already in Markdown format\n`,
    );
  }

  return htmlCount;
}

/**
 * Main migration function
 */
async function main() {
  console.log('🌱 Starting content migration from HTML to Markdown...\n');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Check which content types need migration
    const factChecksNeedMigration = await checkFactChecks();
    const blogsNeedMigration = await checkBlogs();

    // Migrate content
    const researchCount = await migrateResearch();
    const lessonsCount = await migrateCourseLessons();
    const eventsCount = await migrateEvents();

    let factChecksCount = 0;
    if (factChecksNeedMigration > 0) {
      factChecksCount = await migrateFactChecks();
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🎉 Migration completed successfully!\n');
    console.log('📊 Migration Summary:');
    console.log('───────────────────────────────────────────────────────');
    console.log(`   🔬 Research:              ${researchCount}`);
    console.log(`   📚 Course Lessons:        ${lessonsCount}`);
    console.log(`   🎪 Events:                ${eventsCount}`);
    console.log(`   📰 Fact Checks:           ${factChecksCount}`);
    console.log('───────────────────────────────────────────────────────');

    const total = researchCount + lessonsCount + eventsCount + factChecksCount;
    console.log(`   📈 Total Records:         ${total}`);
    console.log('═══════════════════════════════════════════════════════\n');

    if (blogsNeedMigration === 0 && factChecksNeedMigration === 0) {
      console.log(
        '✨ Blog posts and Fact Checks are already in Markdown format!\n',
      );
    }

    console.log(
      '✅ You can now view content with beautiful Markdown formatting!\n',
    );
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
