import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = (page - 1) * limit;

  // Filtering
  const search = searchParams.get('search') || '';
  const sector = searchParams.get('sector') || 'All';

  // Sorting
  const sort = searchParams.get('sort') || 'rank';
  const order = searchParams.get('order') === 'desc' ? 'desc' : 'asc';

  // Construct where clause
  const where: Prisma.CompanyWhereInput = {};

  if (sector && sector !== 'All') {
    where.sector = sector;
  }

  if (search) {
    where.OR = [
      { company: { contains: search } },
      { sector: { contains: search } }
    ];
  }

  try {
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: {
          [sort]: order,
        },
        skip: offset,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      data: companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
