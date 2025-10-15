import { Controller } from '@nestjs/common';
import { MediaLiteracyService } from './media-literacy.service';

@Controller('media-literacy')
export class MediaLiteracyController {
  constructor(private readonly mediaLiteracyService: MediaLiteracyService) {}
}
