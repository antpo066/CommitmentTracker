import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@commitmenttracker.dev' },
    update: {},
    create: {
      email: 'admin@commitmenttracker.dev',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create sample persons
  const personA = await prisma.person.upsert({
    where: { slug: 'jane-mayor' },
    update: {},
    create: {
      name: 'Jane Mayor',
      slug: 'jane-mayor',
      title: 'City Mayor',
      description: 'Current mayor of Springfield, elected 2023.',
    },
  });

  const personB = await prisma.person.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      title: 'Technology Company',
      description: 'A technology company known for consumer products.',
    },
  });

  const personC = await prisma.person.upsert({
    where: { slug: 'senator-smith' },
    update: {},
    create: {
      name: 'Senator Smith',
      slug: 'senator-smith',
      title: 'U.S. Senator',
      description: 'Senior senator from the state of Freedonia.',
    },
  });

  // Create sample statements
  const statements = [
    {
      personId: personA.id,
      exactQuote: 'We will complete the new downtown transit hub by the end of 2025.',
      source: 'City Council Press Conference',
      sourceUrl: 'https://example.com/press/transit-hub',
      sourceType: 'SPEECH' as const,
      dateMade: new Date('2024-01-15'),
      statementType: 'PROMISE' as const,
      impliedDeadline: new Date('2025-12-31'),
      measurableOutcome: 'Downtown transit hub construction completed and operational',
      confidenceScore: 4,
      status: 'UNRESOLVED' as const,
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    {
      personId: personA.id,
      exactQuote: 'Property taxes will not increase during my first term.',
      source: 'Campaign Rally',
      sourceUrl: 'https://example.com/campaign/rally-oct',
      sourceType: 'SPEECH' as const,
      dateMade: new Date('2023-10-05'),
      statementType: 'COMMITMENT' as const,
      impliedDeadline: new Date('2027-01-01'),
      measurableOutcome: 'No property tax rate increase enacted',
      confidenceScore: 5,
      status: 'UNRESOLVED' as const,
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    {
      personId: personB.id,
      exactQuote: 'Acme will achieve carbon neutrality across all operations by 2026.',
      source: 'Annual Sustainability Report 2024',
      sourceUrl: 'https://example.com/acme/sustainability-2024',
      sourceType: 'ARTICLE_URL' as const,
      dateMade: new Date('2024-03-20'),
      statementType: 'COMMITMENT' as const,
      impliedDeadline: new Date('2026-12-31'),
      measurableOutcome: 'Third-party verified carbon neutral certification',
      confidenceScore: 3,
      status: 'UNRESOLVED' as const,
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    {
      personId: personB.id,
      exactQuote: 'We expect our new AI assistant to surpass 10 million users within the first quarter.',
      source: 'Product Launch Keynote',
      sourceUrl: 'https://example.com/acme/keynote-2024',
      sourceType: 'YOUTUBE_TRANSCRIPT' as const,
      dateMade: new Date('2024-06-01'),
      statementType: 'PREDICTION' as const,
      impliedDeadline: new Date('2024-09-01'),
      measurableOutcome: '10 million active users for AI assistant product',
      confidenceScore: 2,
      status: 'DELAYED' as const,
      evidenceNote: 'Company reported 6.2M users at end of Q3 2024, below target.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    {
      personId: personC.id,
      exactQuote: 'I will introduce a bipartisan bill to reform prescription drug pricing before the summer recess.',
      source: 'Senate Floor Speech',
      sourceUrl: 'https://example.com/senate/floor-speech-jan',
      sourceType: 'SPEECH' as const,
      dateMade: new Date('2024-01-28'),
      statementType: 'PROMISE' as const,
      impliedDeadline: new Date('2024-08-01'),
      measurableOutcome: 'Bill introduced in Senate',
      confidenceScore: 4,
      status: 'KEPT' as const,
      evidenceNote: 'Bill S.4521 introduced on June 12, 2024 with bipartisan co-sponsors.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    {
      personId: personC.id,
      exactQuote: 'Inflation will be under 2% by the midterm elections.',
      source: 'Interview on Morning News',
      sourceUrl: 'https://example.com/news/interview-smith',
      sourceType: 'INTERVIEW' as const,
      dateMade: new Date('2023-11-15'),
      statementType: 'PREDICTION' as const,
      impliedDeadline: new Date('2026-11-03'),
      measurableOutcome: 'CPI annual rate below 2%',
      confidenceScore: 2,
      status: 'UNRESOLVED' as const,
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    // One unapproved statement for the review queue
    {
      personId: personA.id,
      exactQuote: 'Every school in the district will have full-day pre-K by next fall.',
      source: 'Town Hall Meeting',
      sourceType: 'PASTED_TEXT' as const,
      dateMade: new Date('2024-11-10'),
      statementType: 'PROMISE' as const,
      impliedDeadline: new Date('2025-09-01'),
      measurableOutcome: 'Full-day pre-K programs in all district schools',
      confidenceScore: 3,
      status: 'UNRESOLVED' as const,
      approved: false,
    },
    {
      personId: personB.id,
      exactQuote: 'We are committed to hiring 5,000 new employees in the Midwest by Q2.',
      source: 'Tweet',
      sourceUrl: 'https://example.com/tweet/acme-hiring',
      sourceType: 'TWEET' as const,
      dateMade: new Date('2025-01-05'),
      statementType: 'COMMITMENT' as const,
      impliedDeadline: new Date('2025-06-30'),
      measurableOutcome: '5,000 new hires in Midwest locations',
      confidenceScore: 3,
      status: 'UNRESOLVED' as const,
      approved: false,
    },
  ];

  for (const stmt of statements) {
    await prisma.statement.create({ data: stmt });
  }

  // Add sample notes
  const approvedStatements = await prisma.statement.findMany({
    where: { approved: true },
    take: 2,
  });

  if (approvedStatements.length >= 2) {
    await prisma.note.create({
      data: {
        statementId: approvedStatements[0].id,
        authorId: admin.id,
        content: 'Construction permits were filed in March 2024. Groundbreaking ceremony held April 2024.',
        noteType: 'CONTEXT',
      },
    });

    await prisma.note.create({
      data: {
        statementId: approvedStatements[1].id,
        authorId: admin.id,
        content: 'A small fee increase for city services was enacted in 2024, but property tax rate remained unchanged.',
        noteType: 'DISPUTE',
      },
    });
  }

  console.log('Seed data created successfully');
  console.log(`Admin login: admin@commitmenttracker.dev / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
