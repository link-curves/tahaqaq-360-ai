import { Controller } from '@nestjs/common';
import { Fact-checksService } from './fact-checks.service';

@Controller('fact-checks')
export class Fact-checksController {
  constructor(private readonly fact-checksService: Fact-checksService) {}
}
