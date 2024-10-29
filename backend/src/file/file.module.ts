import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (_req, file, cb) => {
          const uuid = v4();
          cb(null, `${uuid}_${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [FileController],
})
export class FileModule {}
