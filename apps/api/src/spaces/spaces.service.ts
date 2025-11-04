import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId, Types } from 'mongoose';
import { Space } from './schemas/space.schema';
import { Article } from '../articles/schemas/article.schema';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(
    @InjectModel(Space.name) private spaceModel: Model<Space>,
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async create(createSpaceDto: CreateSpaceDto, userId: string) {
    const space = new this.spaceModel({
      ...createSpaceDto,
      authorId: userId,
    });
    return await space.save();
  }

  async findAll() {
    return await this.spaceModel.find().exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`ID ${id} inválido`);
    }
    const space = await this.spaceModel.findById(id).exec();
    if (!space) {
      throw new NotFoundException(`Espaço com ID ${id} não encontrado`);
    }
    return space;
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`ID ${id} inválido`);
    }
    const space = await this.spaceModel
      .findByIdAndUpdate(id, updateSpaceDto, { new: true })
      .exec();
    if (!space) {
      throw new NotFoundException(`Espaço com ID ${id} não encontrado`);
    }
    return space;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`ID ${id} inválido`);
    }

    const space = await this.spaceModel.findById(id).exec();
    if (!space) {
      throw new NotFoundException(`Espaço com ID ${id} não encontrado`);
    }

    await this.articleModel
      .deleteMany({
        $or: [{ spaceId: id }, { spaceId: new Types.ObjectId(id) }],
      })
      .exec();
    const result = await this.spaceModel.findByIdAndDelete(id).exec();
    return result;
  }
}
