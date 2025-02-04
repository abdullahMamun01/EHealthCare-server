import { Injectable } from '@nestjs/common';
import { PrismaClient, Patient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import sendResponse from 'src/utils/sendResponse';

@Injectable()
export class PaginationService {
  private model: any;
  private paginateQuery: any = {};
  private totalRecords = 0;
  private metadata = {};
  private queryFilters: any = {};
  constructor(private readonly prismaService: PrismaService) {}

  async setModel(modelName: string) {
    this.model = this.prismaService[modelName];
  }
  paginate(paginateQuery: any) {
    this.paginateQuery = paginateQuery;
    return this;
  }

  computeMetaData(page: number, limit: number) {
    const totalPages = Math.ceil(this.totalRecords / limit);
    const hasNextPage = totalPages > page;
    const prevPage = +page > 1 ? +page - 1 : null;
    const nextPage = hasNextPage ? +page + 1 : null;
    this.metadata = {
      hasNextPage,
      toalRecords: this.totalRecords,
      totalPages,
      page,
      prevPage,
      nextPage,
    };
  }
  search(search: string, fieldsName: string[]) {
    const whereCondition = fieldsName.map((field) => ({
      [field]: {
        contains: search,
        mode: 'insensitive',
      },
    }));
    this.queryFilters.OR = whereCondition;

    return this;
  }

  async sortBy( orderBy: string = 'date_asc') {
    let field = 'createdAt';
    let order: 'asc' | 'desc' = 'asc';

    const sortedFields = orderBy?.split('_');
    if (sortedFields.length === 2) {
      const [inputField, inputOrder] = sortedFields;

      field = inputField === 'date' ? 'createdAt' : inputField;
      if (inputOrder === 'asc' || inputOrder === 'desc') {
        order = inputOrder;
      }
    }

    this.queryFilters.orderBy = {
      [field]: order,
    };

    return this;
  }

  async execute() {
    const { page = 1, limit } = this.paginateQuery;
    this.totalRecords = await this.model.count({
      where: this.queryFilters.OR ? { OR: this.queryFilters.OR } : {},
      orderBy: this.queryFilters.orderBy,
    });

    this.computeMetaData(+page, +limit);
    const data = await this.model.findMany({
      where: this.queryFilters.OR ? { OR: this.queryFilters.OR } : {},
      orderBy: this.queryFilters.orderBy,
      skip: (+page - 1) * +limit,
      take: +limit,
    });

    return {
      ...sendResponse({
        message: `All  data retrieve successfull`,
        success: true,
        data,
        status: 200,
      }),
      metadata: this.metadata,
    };
  }
}
