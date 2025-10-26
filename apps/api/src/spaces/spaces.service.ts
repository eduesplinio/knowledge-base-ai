import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space } from './schemas/space.schema';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(@InjectModel(Space.name) private spaceModel: Model<Space>) {}

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
    const space = await this.spaceModel.findById(id).exec();
    if (!space) {
      throw new NotFoundException(`Space com ID ${id} não encontrado`);
    }
    return space;
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto) {
    const space = await this.spaceModel
      .findByIdAndUpdate(id, updateSpaceDto, { new: true })
      .exec();
    if (!space) {
      throw new NotFoundException(`Space com ID ${id} não encontrado`);
    }
    return space;
  }

  async remove(id: string) {
    const result = await this.spaceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Space com ID ${id} não encontrado`);
    }
    return result;
  }
}
