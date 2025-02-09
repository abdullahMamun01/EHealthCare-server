import { Injectable } from '@nestjs/common';
import { PrismaClient, Patient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
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

  find(fields: { fieldName: string; value: string | number | boolean }[]) {
 
    if (fields && fields.length > 0) {
      this.queryFilters.filters = fields.reduce((acc, curr) => {

        acc[curr.fieldName] = curr.value;
        return acc;
      }, {});
    } else {
      this.queryFilters.filters = {};
    }

    return this
  }

  nestedFilters(filteringName: string) {
    if (this.paginateQuery[filteringName] && filteringName === 'specialities') {
      const specialties = this.paginateQuery[filteringName].split(',');
      this.queryFilters.AND = {
        doctorSpecielites: {
          some: {
            specialites: {
              OR: specialties.map((speciality) => ({
                name: {
                  contains: speciality,
                  mode: 'insensitive',
                },
              })),
            },
          },
        },
      };
    } else {
      this.queryFilters.AND = {};
    }

    return this;
  }
  async sortBy(orderBy: string = 'date_asc') {
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

  async execute<T extends keyof PrismaClient>(
    queryIncludes?: Prisma.Args<PrismaClient[T], 'findMany'>['include'],
  ) {
    if (!this.model) {
      throw new Error('Model is not set. Call setModel() first.');
    }

    const { page = 1, limit = 10 } = this.paginateQuery;
    const filters = this.queryFilters.filters || {};
    const whereAndOrder = {
      where: {
        ...(this.queryFilters.OR?.length ? { OR: this.queryFilters.OR } : {}),
        ...(this.queryFilters.AND?.length ? { AND: this.queryFilters.AND } : {}),
        ...filters,
      },
      orderBy: this.queryFilters.orderBy,
    };

    this.totalRecords = await this.model.count(whereAndOrder);
    this.computeMetaData(+page, +limit);
    const data = await this.model.findMany({
      ...whereAndOrder,
      skip: (+page - 1) * +limit,
      take: +limit,
      include: queryIncludes, 
    });

    return {
      ...sendResponse({
        message: `All data retrieved successfully`,
        success: true,
        data,
        status: 200,
      }),
      metadata: this.metadata,
    };
  }
}
