import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function ApiImage() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: 'images',
          filename: (req, file, callback) => {
            if (!file.originalname) throw new Error('image has no name');
            callback(null, file.originalname);
          },
        }),
      }),
    ),
  );
}
