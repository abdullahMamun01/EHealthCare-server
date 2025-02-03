import { Injectable } from '@nestjs/common';
import { PrismaClient, Patient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class PaginationService {
  constructor(private readonly prismaService: PrismaService) {}
  async paginate(modelName: string, paginateQuery: any) {
    const { page = 1, limit = 10 } = paginateQuery;
    const toalRecords = await this.prismaService[modelName].count();
    const totalPages = Math.ceil(toalRecords / limit);
    const data = await this.prismaService[modelName].findMany({
      skip: (+page - 1) * (+limit),
      take: (+limit),
    });
    const hasNextPage = totalPages > page;
    const prevPage = +page - 1 > 0 ? +page - 1 : +page;
    const nextPage = hasNextPage ? +page + 1 : null;

    return {
      ...sendResponse({
        message: `All ${modelName} data retrieve successfull`,
        success: true,
        data,
        status: 200,
      }),
      metadata: {
        hasNextPage,
        toalRecords,
        totalPages,
        page,
        prevPage,
        nextPage,
      },
    };
  }
}
