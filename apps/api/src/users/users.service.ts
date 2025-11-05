import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SyncUserDto } from './dto/sync-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async sync(syncUserDto: SyncUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { githubId: syncUserDto.githubId },
      syncUserDto,
      { upsert: true, new: true },
    );
    return user;
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
