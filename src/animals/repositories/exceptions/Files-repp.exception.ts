import { HttpException } from '@nestjs/common';

export class FilesRepoException extends HttpException {
  constructor(newMessage: string) {
    super(newMessage, 500);
  }
}
