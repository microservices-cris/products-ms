import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalItems = await this.product.count({ where: { available: true } });

    const totalPages = Math.ceil(totalItems / limit);

    const data = await this.product.findMany({
      where: {
        available: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      meta: {
        total: totalItems,
        page,
        lastPage: totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const {id:__, ...data} = updateProductDto;

    if (Object.keys(updateProductDto).length === 0) {
      throw new HttpException(
        'You should provide at least one field to update',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.findOne(id);

    return this.product.update({
      where: {
        id,
      },
      data: data,
    });
  }

  // Hard delete
  // async remove(id: number) {

  //   await this.findOne(id);

  //   return this.product.delete({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  // Soft delete
  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: {
        id,
      },
      data: {
        available: false,
      },
    });
  }
}
