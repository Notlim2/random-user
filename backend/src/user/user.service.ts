import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ExternalUserDto } from './dto/external-user.dto';

@Injectable()
export class UserService {
  private readonly apiUrl: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('RANDOM_DATA_API_URL');
  }

  async fetchRandomUser() {
    const response = await firstValueFrom(
      this.httpService.get<ExternalUserDto>(this.apiUrl),
    );
    const foundUser = response.data;
    return {
      avatar: foundUser.avatar,
      birthDate: foundUser.date_of_birth,
      email: foundUser.email,
      name: `${foundUser.first_name} ${foundUser.last_name}`,
      phone: foundUser.phone_number,
    } as Omit<User, 'id'>;
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOneById(id);
  }

  async findAll(getUsersDto: GetUsersDto) {
    return this.userRepository.findAll(getUsersDto);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.save(createUserDto);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
