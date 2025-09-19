import { hash } from '@node-rs/argon2';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

const users = [
  {
    username: 'admin',
    email: 'admin@gmail.com',
    emailVerified: true,
  },
  {
    username: 'user',
    email: 'yourtestmail@gmail.com',
    emailVerified: true,
  },
];

const tickets = [
  {
    title: 'Ticket 1',
    content: 'This is the first ticket from the database.',
    status: 'DONE' as const,
    deadline: new Date().toISOString().split('T')[0],
    bounty: 499,
  },
  {
    title: 'Ticket 2',
    content: 'This is the second ticket from the database.',
    status: 'OPEN' as const,
    deadline: new Date().toISOString().split('T')[0],
    bounty: 399,
  },
  {
    title: 'Ticket 3',
    content: 'This is the third ticket from the database.',
    status: 'IN_PROGRESS' as const,
    deadline: new Date().toISOString().split('T')[0],
    bounty: 599,
  },
];

const comments = [
  { content: 'First comment from DB.' },
  { content: 'Second comment from DB.' },
  { content: 'Third comment from DB.' },
];

const seed = async () => {
  console.time('Prisma Total Seeding Time:');

  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.membership.deleteMany();

  const dbOrganization = await prisma.organization.create({
    data: {
      name: 'Organization 1',
    },
  });

  const passwordHash = await hash('tajomstvo');

  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      passwordHash,
    })),
  });

  await prisma.membership.createMany({
    data: [
      {
        userId: dbUsers[0].id,
        organizationId: dbOrganization.id,
        isActive: true,
        membershipRole: 'ADMIN',
      },
      {
        userId: dbUsers[1].id,
        organizationId: dbOrganization.id,
        isActive: false,
        membershipRole: 'MEMBER',
      },
    ],
  });

  const dbTickets = await prisma.ticket.createManyAndReturn({
    data: tickets.map((ticket) => ({
      ...ticket,
      userId: dbUsers[0].id,
      organizationId: dbOrganization.id,
    })),
  });

  await prisma.comment.createMany({
    data: comments.map((comment) => ({
      ...comment,
      userId: dbUsers[1].id,
      ticketId: dbTickets[0].id,
    })),
  });

  console.timeEnd('Prisma Total Seeding Time:');
};

seed();
