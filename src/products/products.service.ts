import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createProductDto: CreateProductDto) {
    const data = await this.product.create({
      data: createProductDto,
    });
    return data;
  }

  async findAll(paginationDto: PaginationDto) {
    const data = await this.product.findMany({
      where: {
        available: true,
      },
      skip: ((paginationDto.page ?? 1) - 1) * (paginationDto.limit ?? 10),
      take: paginationDto.limit,
    });
    return {
      page: paginationDto.page,
      limit: paginationDto.limit,
      products: data,
    };
  }

  async findOne(id: number) {
    const data = await this.product.findUnique({
      where: {
        id: id,
        available: true,
      },
    });
    if (!data) {
      throw new RpcException({
        statusCode: 404,
        message: `Product with id ${id} not found`,
      });
    }

    return data;
  }

  async update(updateProductDto: UpdateProductDto) {
    await this.findOne(updateProductDto.id);

    const data = await this.product.update({
      where: {
        id: updateProductDto.id,
      },
      data: updateProductDto,
    });
    return data;
  }

  async remove(id: number) {
    await this.findOne(id);

    const data = await this.product.update({
      where: {
        id: id,
      },
      data: {
        available: false,
      },
    });
    return data;
  }

  async validateProductsIds(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        statusCode: 404,
        message: 'Some products were not found',
      });
    }

    return products;
  }
}
