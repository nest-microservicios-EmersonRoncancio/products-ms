import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/common/dto/pagination.dto';

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
    if (!data) throw new NotFoundException(`Product with id ${id} not found`);

    return data;
  }

  async update(updateProductDto: UpdateProductDto) {
    await this.findOne(updateProductDto.id);

    console.log(updateProductDto);
    const data = await this.product.update({
      where: {
        id: updateProductDto.id,
      },
      data: updateProductDto,
    });
    console.log(data);
    return data;
  }

  async remove(id: number) {
    await this.findOne(id);

    // const data = await this.product.delete({
    //   where: {
    //     id: id,
    //   },
    // });

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
}
