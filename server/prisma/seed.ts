import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@commitmenttracker.dev' },
    update: {},
    create: {
      email: 'admin@commitmenttracker.dev',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // ── Person 1: Pete Buttigieg ────────────────────────────
  const pete = await prisma.person.upsert({
    where: { slug: 'pete-buttigieg' },
    update: {},
    create: {
      name: 'Pete Buttigieg',
      slug: 'pete-buttigieg',
      title: 'U.S. Secretary of Transportation (2021–2025)',
      description: 'Served as the 19th United States Secretary of Transportation under President Biden from February 2021 to January 2025.',
      trackedSources: ['Congressional testimony', 'Press conferences', 'Interviews', 'Official statements'],
      coverageFrom: new Date('2021-02-03'),
      coverageTo: new Date('2025-01-20'),
    },
  });

  // Source documents for Pete
  const peteSource1 = await prisma.sourceDocument.create({
    data: {
      personId: pete.id,
      title: 'Senate Commerce Committee Hearing on Infrastructure',
      url: 'https://www.commerce.senate.gov/2021/6/22/hearing',
      sourceType: 'SPEECH',
      sourceDate: new Date('2021-06-22'),
      rawText: 'Secretary Buttigieg testified before the Senate Commerce Committee regarding the infrastructure plan. He stated: "We will see shovels in the ground on major projects within the first year of the infrastructure bill\'s passage." He also noted that the plan would "create millions of jobs" and "rebuild crumbling roads and bridges across the country." The Secretary emphasized that broadband expansion would reach every American household.',
    },
  });

  const peteSource2 = await prisma.sourceDocument.create({
    data: {
      personId: pete.id,
      title: 'DOT Press Conference on EV Charging Network',
      url: 'https://www.transportation.gov/briefing-room/2022-ev-charging',
      sourceType: 'PRESS_RELEASE',
      sourceDate: new Date('2022-02-10'),
      rawText: 'At a press conference announcing the National Electric Vehicle Infrastructure Formula Program, Secretary Buttigieg stated: "By the end of 2024, we will have 500,000 EV chargers installed across the country." He described this as a "historic investment" and said it would make electric vehicles accessible to all Americans regardless of where they live.',
    },
  });

  // Statements for Pete
  await prisma.statement.create({
    data: {
      personId: pete.id,
      sourceDocumentId: peteSource1.id,
      exactQuote: 'We will see shovels in the ground on major projects within the first year of the infrastructure bill\'s passage.',
      context: 'Testimony before the Senate Commerce Committee during a hearing on the proposed infrastructure plan, before the Bipartisan Infrastructure Law was passed.',
      interpretation: 'Major infrastructure construction projects funded by the bill would begin within 12 months of the legislation being signed into law.',
      statementType: 'PROMISE',
      sourceTitle: 'Senate Commerce Committee Hearing',
      sourceUrl: 'https://www.commerce.senate.gov/2021/6/22/hearing',
      sourceDate: new Date('2021-06-22'),
      impliedDeadline: new Date('2022-11-15'),
      measurableOutcome: 'Major infrastructure construction projects visibly underway',
      confidenceScore: 4,
      status: 'KEPT',
      adminNotes: 'The Bipartisan Infrastructure Law was signed November 15, 2021. Multiple projects broke ground within the first year.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.statement.create({
    data: {
      personId: pete.id,
      sourceDocumentId: peteSource2.id,
      exactQuote: 'By the end of 2024, we will have 500,000 EV chargers installed across the country.',
      context: 'Press conference announcing the National Electric Vehicle Infrastructure Formula Program, a $5 billion initiative under the Bipartisan Infrastructure Law.',
      interpretation: '500,000 public EV charging stations would be operational in the United States by December 31, 2024.',
      statementType: 'PROMISE',
      sourceTitle: 'DOT Press Conference on EV Charging',
      sourceUrl: 'https://www.transportation.gov/briefing-room/2022-ev-charging',
      sourceDate: new Date('2022-02-10'),
      impliedDeadline: new Date('2024-12-31'),
      measurableOutcome: '500,000 EV chargers installed and operational nationwide',
      confidenceScore: 5,
      status: 'CONTRADICTED',
      adminNotes: 'As of late 2024, approximately 192,000 public EV charging ports existed in the U.S. according to DOE data, far below the 500,000 target.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  // ── Person 2: Elon Musk ─────────────────────────────────
  const elon = await prisma.person.upsert({
    where: { slug: 'elon-musk' },
    update: {},
    create: {
      name: 'Elon Musk',
      slug: 'elon-musk',
      title: 'CEO of Tesla and SpaceX',
      description: 'Chief Executive Officer of Tesla, SpaceX, and owner of X (formerly Twitter). Known for public predictions about technology timelines.',
      trackedSources: ['Earnings calls', 'Social media posts', 'Interviews', 'Product events'],
      coverageFrom: new Date('2019-01-01'),
      coverageTo: new Date('2026-04-09'),
    },
  });

  const elonSource1 = await prisma.sourceDocument.create({
    data: {
      personId: elon.id,
      title: 'Tesla Autonomy Day Presentation',
      url: 'https://www.tesla.com/autonomy-day-2019',
      sourceType: 'SPEECH',
      sourceDate: new Date('2019-04-22'),
      rawText: 'At Tesla Autonomy Day, Elon Musk stated: "I feel very confident predicting that there will be autonomous robotaxis from Tesla next year — not in all jurisdictions because we won\'t have regulatory approval everywhere." He described a future where Tesla owners could add their cars to a ride-hailing network. "It\'s financially insane to buy anything other than a Tesla," he added.',
    },
  });

  const elonSource2 = await prisma.sourceDocument.create({
    data: {
      personId: elon.id,
      title: 'Tesla Q4 2023 Earnings Call',
      sourceType: 'TRANSCRIPT',
      sourceDate: new Date('2024-01-24'),
      rawText: 'On the Q4 2023 earnings call, Elon Musk stated regarding the Cybertruck: "We expect to deliver 250,000 Cybertrucks per year by 2025." He also mentioned that "Full Self-Driving will be solved this year" referring to 2024. Regarding the Tesla Semi, he said production would ramp "later this year."',
    },
  });

  const elonSource3 = await prisma.sourceDocument.create({
    data: {
      personId: elon.id,
      title: 'Post on X regarding Mars mission timeline',
      url: 'https://x.com/elonmusk/status/example',
      sourceType: 'SOCIAL_POST',
      sourceDate: new Date('2024-03-15'),
      rawText: 'Elon Musk posted on X: "Starship will be ready for an uncrewed Mars mission in 2026. First crewed mission to Mars in 2028."',
    },
  });

  await prisma.statement.create({
    data: {
      personId: elon.id,
      sourceDocumentId: elonSource1.id,
      exactQuote: 'I feel very confident predicting that there will be autonomous robotaxis from Tesla next year.',
      context: 'Tesla Autonomy Day event in April 2019, presenting the company\'s self-driving roadmap to investors and media.',
      interpretation: 'Tesla would launch a commercial autonomous robotaxi service by the end of 2020.',
      statementType: 'PREDICTION',
      sourceTitle: 'Tesla Autonomy Day 2019',
      sourceUrl: 'https://www.tesla.com/autonomy-day-2019',
      sourceDate: new Date('2019-04-22'),
      impliedDeadline: new Date('2020-12-31'),
      measurableOutcome: 'Commercial autonomous robotaxi service operating without safety drivers',
      confidenceScore: 5,
      status: 'DELAYED',
      adminNotes: 'As of 2026, Tesla has launched limited robotaxi testing but no commercial service matching the 2020 prediction. The timeline has been revised multiple times.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.statement.create({
    data: {
      personId: elon.id,
      sourceDocumentId: elonSource2.id,
      exactQuote: 'We expect to deliver 250,000 Cybertrucks per year by 2025.',
      context: 'Tesla Q4 2023 earnings call, discussing production targets for the recently launched Cybertruck.',
      interpretation: 'Tesla\'s Cybertruck annual production rate would reach 250,000 units during 2025.',
      statementType: 'PREDICTION',
      sourceTitle: 'Tesla Q4 2023 Earnings Call',
      sourceDate: new Date('2024-01-24'),
      impliedDeadline: new Date('2025-12-31'),
      measurableOutcome: 'Cybertruck production rate at 250,000 units per year',
      confidenceScore: 4,
      status: 'UNRESOLVED',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.statement.create({
    data: {
      personId: elon.id,
      sourceDocumentId: elonSource2.id,
      exactQuote: 'Full Self-Driving will be solved this year.',
      context: 'Tesla Q4 2023 earnings call, referring to calendar year 2024.',
      interpretation: 'Tesla\'s Full Self-Driving software would achieve full autonomy (no driver supervision required) by end of 2024.',
      statementType: 'PREDICTION',
      sourceTitle: 'Tesla Q4 2023 Earnings Call',
      sourceDate: new Date('2024-01-24'),
      impliedDeadline: new Date('2024-12-31'),
      measurableOutcome: 'FSD operating without human supervision, regulatory approval for driverless operation',
      confidenceScore: 5,
      status: 'CONTRADICTED',
      adminNotes: 'Tesla FSD remained a Level 2 driver-assistance system through 2024, requiring constant driver supervision. No regulatory approval for driverless operation was obtained.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.statement.create({
    data: {
      personId: elon.id,
      sourceDocumentId: elonSource3.id,
      exactQuote: 'Starship will be ready for an uncrewed Mars mission in 2026.',
      context: 'Post on X (formerly Twitter) discussing SpaceX Mars mission timeline.',
      interpretation: 'A SpaceX Starship vehicle would launch on a trajectory to Mars without crew aboard during 2026.',
      statementType: 'PREDICTION',
      sourceTitle: 'Post on X',
      sourceUrl: 'https://x.com/elonmusk/status/example',
      sourceDate: new Date('2024-03-15'),
      impliedDeadline: new Date('2026-12-31'),
      measurableOutcome: 'Starship launches on Mars trajectory',
      confidenceScore: 3,
      status: 'UNRESOLVED',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  // ── Person 3: Sam Altman ────────────────────────────────
  const sam = await prisma.person.upsert({
    where: { slug: 'sam-altman' },
    update: {},
    create: {
      name: 'Sam Altman',
      slug: 'sam-altman',
      title: 'CEO of OpenAI',
      description: 'Chief Executive Officer of OpenAI. Frequently makes public statements about AI development timelines and capabilities.',
      trackedSources: ['Interviews', 'Blog posts', 'Congressional testimony', 'Conference talks', 'Social media'],
      coverageFrom: new Date('2023-01-01'),
      coverageTo: new Date('2026-04-09'),
    },
  });

  const samSource1 = await prisma.sourceDocument.create({
    data: {
      personId: sam.id,
      title: 'Senate Judiciary Subcommittee Hearing on AI Oversight',
      url: 'https://www.judiciary.senate.gov/committee-activity/hearings/2023/05/16/oversight-of-ai',
      sourceType: 'SPEECH',
      sourceDate: new Date('2023-05-16'),
      rawText: 'Sam Altman testified before the Senate Judiciary Subcommittee on Privacy, Technology, and the Law. He stated: "I think if this technology goes wrong, it can go quite wrong. And we want to be vocal about that." He also said: "We think that regulatory intervention by governments will be critical to mitigate the risks of increasingly powerful AI systems." He called for the creation of a new regulatory agency for AI.',
    },
  });

  const samSource2 = await prisma.sourceDocument.create({
    data: {
      personId: sam.id,
      title: 'Interview at World Economic Forum, Davos 2024',
      sourceType: 'INTERVIEW',
      sourceDate: new Date('2024-01-18'),
      rawText: 'At the World Economic Forum in Davos, Sam Altman said in an interview: "AGI is going to come. I think it\'s going to come sooner than most people think." He also stated: "We will have systems that can reason and plan and execute complex tasks by the end of this year." Regarding OpenAI\'s structure, he said: "OpenAI will remain a capped-profit company — we are not going to become a traditional for-profit."',
    },
  });

  await prisma.statement.create({
    data: {
      personId: sam.id,
      sourceDocumentId: samSource1.id,
      exactQuote: 'We think that regulatory intervention by governments will be critical to mitigate the risks of increasingly powerful AI systems.',
      context: 'Testimony before the Senate Judiciary Subcommittee on Privacy, Technology, and the Law, in a hearing specifically about AI oversight.',
      interpretation: 'OpenAI\'s CEO publicly advocates for government regulation of AI systems, positioning the company as supportive of external oversight.',
      statementType: 'COMMITMENT',
      sourceTitle: 'Senate Judiciary Subcommittee Hearing',
      sourceUrl: 'https://www.judiciary.senate.gov/committee-activity/hearings/2023/05/16/oversight-of-ai',
      sourceDate: new Date('2023-05-16'),
      measurableOutcome: 'OpenAI actively supports and cooperates with AI regulatory efforts',
      confidenceScore: 3,
      status: 'UNRESOLVED',
      adminNotes: 'OpenAI has engaged with regulatory discussions but has also lobbied against certain provisions in proposed AI legislation. The degree of active support is debatable.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.statement.create({
    data: {
      personId: sam.id,
      sourceDocumentId: samSource2.id,
      exactQuote: 'OpenAI will remain a capped-profit company — we are not going to become a traditional for-profit.',
      context: 'Interview at the World Economic Forum in Davos, January 2024, when asked about OpenAI\'s corporate structure.',
      interpretation: 'OpenAI would maintain its capped-profit structure and not convert to a standard for-profit corporation.',
      statementType: 'COMMITMENT',
      sourceTitle: 'WEF Davos Interview',
      sourceDate: new Date('2024-01-18'),
      measurableOutcome: 'OpenAI retains capped-profit structure',
      confidenceScore: 5,
      status: 'CONTRADICTED',
      adminNotes: 'In December 2024, OpenAI announced plans to restructure as a for-profit public benefit corporation, abandoning the capped-profit model.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.statement.create({
    data: {
      personId: sam.id,
      sourceDocumentId: samSource2.id,
      exactQuote: 'We will have systems that can reason and plan and execute complex tasks by the end of this year.',
      context: 'Davos 2024 interview, referring to AI capabilities expected by the end of 2024.',
      interpretation: 'OpenAI would release AI systems capable of autonomous multi-step reasoning, planning, and task execution by December 2024.',
      statementType: 'PREDICTION',
      sourceTitle: 'WEF Davos Interview',
      sourceDate: new Date('2024-01-18'),
      impliedDeadline: new Date('2024-12-31'),
      measurableOutcome: 'AI system released that can autonomously reason, plan, and execute complex multi-step tasks',
      confidenceScore: 3,
      status: 'PARTIALLY_FULFILLED',
      adminNotes: 'OpenAI released o1 and o3 models in 2024 with improved reasoning capabilities. However, these systems still require human oversight for complex tasks and do not autonomously execute real-world actions.',
      approved: true,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  // One unapproved statement for the review queue
  await prisma.statement.create({
    data: {
      personId: sam.id,
      sourceDocumentId: samSource2.id,
      exactQuote: 'AGI is going to come. I think it\'s going to come sooner than most people think.',
      context: 'Davos 2024 interview, discussing the timeline for artificial general intelligence.',
      interpretation: 'AGI will arrive sooner than the general public and most experts currently expect.',
      statementType: 'PREDICTION',
      sourceTitle: 'WEF Davos Interview',
      sourceDate: new Date('2024-01-18'),
      measurableOutcome: 'Achievement of AGI as defined by OpenAI or broad expert consensus',
      confidenceScore: 1,
      status: 'TOO_VAGUE',
      adminNotes: 'Statement lacks a specific timeline or definition of AGI, making it difficult to verify.',
      approved: false,
      aiExtracted: true,
      aiConfidence: 0.72,
    },
  });

  // Add sample evidence
  const keptStatement = await prisma.statement.findFirst({
    where: { status: 'KEPT', approved: true },
  });

  if (keptStatement) {
    await prisma.evidence.create({
      data: {
        statementId: keptStatement.id,
        addedById: admin.id,
        excerpt: 'The Federal Highway Administration reported that over 7,000 infrastructure projects broke ground within the first 12 months of the Bipartisan Infrastructure Law\'s passage, including major bridge and highway reconstruction.',
        evidenceDate: new Date('2022-11-15'),
        evidenceType: 'GOVERNMENT_DATA',
        sourceUrl: 'https://www.fhwa.dot.gov/bipartisan-infrastructure-law/',
        sourceTitle: 'FHWA Bipartisan Infrastructure Law Dashboard',
        notes: 'Official government tracking data confirms multiple major projects commenced within the stated timeframe.',
        statusChange: 'KEPT',
      },
    });
  }

  const contradictedEV = await prisma.statement.findFirst({
    where: { exactQuote: { contains: '500,000 EV chargers' } },
  });

  if (contradictedEV) {
    await prisma.evidence.create({
      data: {
        statementId: contradictedEV.id,
        addedById: admin.id,
        excerpt: 'As of Q3 2024, the United States had approximately 192,000 public EV charging ports, according to the Department of Energy\'s Alternative Fuels Station Locator.',
        evidenceDate: new Date('2024-10-01'),
        evidenceType: 'GOVERNMENT_DATA',
        sourceUrl: 'https://afdc.energy.gov/stations',
        sourceTitle: 'DOE Alternative Fuels Station Locator',
        notes: 'The actual count of 192,000 falls significantly short of the 500,000 target stated for end of 2024.',
        statusChange: 'CONTRADICTED',
      },
    });
  }

  console.log('Seed data created successfully');
  console.log('Admin login: admin@commitmenttracker.dev / admin123');
  console.log(`Created persons: ${pete.name}, ${elon.name}, ${sam.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
