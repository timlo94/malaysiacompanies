import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    const top5 = await prisma.company.findMany({
        orderBy: { rank: 'asc' },
        take: 5
    });
    console.log(JSON.stringify(top5, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
