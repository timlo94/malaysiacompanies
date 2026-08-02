import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import fs from 'fs';
import path from 'path';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Fetching data from SQLite to export...");
    const companies = await prisma.company.findMany({
        orderBy: { rank: 'asc' }
    });

    const publicDir = path.join(process.cwd(), 'public');
    const dataDir = path.join(publicDir, 'data');
    
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputFile = path.join(dataDir, 'companies.json');
    fs.writeFileSync(outputFile, JSON.stringify(companies, null, 2));
    
    console.log(`Successfully exported ${companies.length} companies to ${outputFile}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
