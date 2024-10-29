import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResultDto } from 'src/common/dtos/paginated-result.dto';

const USER_NOT_FOUND_MSG = 'Usuário não encontrado!';

@Injectable()
export class UserRepository {
  constructor() {
    if (!fs.existsSync(this.filePath)) {
      fs.mkdirSync(path.resolve('data'), { recursive: true });
      fs.writeFileSync(this.filePath, '[]');
    }
  }

  private readonly filePath = path.resolve('data', 'users.csv');

  findAll(getUsersDto?: GetUsersDto): Promise<PaginatedResultDto<User>> {
    return new Promise((resolve, reject) => {
      const users: User[] = [];
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on('data', (data) => users.push(data as User))
        .on('end', () => {
          const filteredUsers = users.filter((u) => {
            let getThisUser = true;
            if (
              getUsersDto?.name?.length &&
              !u.name
                .toLocaleLowerCase()
                .includes(getUsersDto.name.toLocaleLowerCase())
            ) {
              getThisUser = false;
            }
            if (
              getUsersDto?.email?.length &&
              !u.email
                .toLocaleLowerCase()
                .includes(getUsersDto.email.toLocaleLowerCase())
            ) {
              getThisUser = false;
            }
            if (
              getUsersDto?.phone?.length &&
              !u.phone
                .toLocaleLowerCase()
                .includes(getUsersDto.phone.toLocaleLowerCase())
            ) {
              getThisUser = false;
            }

            const userBirthDate = new Date(u.birthDate);
            if (
              ((getUsersDto?.birthDateGte?.length ||
                getUsersDto?.birthDateLte?.length) &&
                getUsersDto?.birthDateGte?.length &&
                userBirthDate.getTime() <
                  new Date(getUsersDto.birthDateGte.length).getTime()) ||
              (getUsersDto?.birthDateLte?.length &&
                userBirthDate.getTime() >
                  new Date(getUsersDto.birthDateLte.length).getTime())
            ) {
              getThisUser = false;
            }

            return getThisUser;
          });
          const { skip, take } = getUsersDto;
          const filteredUsersCount = filteredUsers.length;
          const paginatedUsers = filteredUsers.splice(skip, take);
          resolve({ result: paginatedUsers, count: filteredUsersCount });
        })
        .on('error', (err) => reject(err));
    });
  }

  async findOneById(id: number): Promise<User> {
    const { result: users } = await this.findAll({
      take: Number.MAX_SAFE_INTEGER,
    });
    const user = users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_MSG);
    return user;
  }

  generateRandomId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async save(user: User | Omit<User, 'id'>): Promise<User> {
    const { result: users } = await this.findAll({
      take: Number.MAX_SAFE_INTEGER,
    });
    if (!(user as User).id) {
      (user as User).id = this.generateRandomId();
    }
    users.push(user as User);
    await this.writeToCsv(users);
    return user as User;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const { result: users } = await this.findAll({
      take: Number.MAX_SAFE_INTEGER,
    });
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) throw new NotFoundException(USER_NOT_FOUND_MSG);
    users[index] = {
      ...users[index],
      ...updateUserDto,
    };
    await this.writeToCsv(users);
  }

  async delete(id: number): Promise<void> {
    const { result: users } = await this.findAll({
      take: Number.MAX_SAFE_INTEGER,
    });
    const filteredUsers = users.filter(
      (user) => Number(user.id) !== Number(id),
    );
    if (filteredUsers.length === users.length)
      throw new NotFoundException(USER_NOT_FOUND_MSG);
    await this.writeToCsv(filteredUsers);
  }

  private async writeToCsv(users: User[]): Promise<void> {
    const header = 'id,name,email,avatar,phone,birthDate\n';
    const rows = users.map((user) =>
      [
        user.id,
        user.name,
        user.email,
        user.avatar,
        user.phone,
        user.birthDate,
      ].join(','),
    );
    await fs.promises.writeFile(this.filePath, header + rows.join('\n'));
  }
}
