import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  thumb(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /image\/jpeg|image\/png|image\/webp|image\/bmp/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return file.filename;
  }
}
