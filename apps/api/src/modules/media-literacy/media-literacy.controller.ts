import { Controller } from '@nestjs/common';
import { Media-literacyService } from './media-literacy.service';

@Controller('media-literacy')
export class Media-literacyController {
  constructor(private readonly media-literacyService: Media-literacyService) {}
}
