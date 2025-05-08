import { Controller, Get, Query } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { Instrument } from '../entities/instrument.entity';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly service: InstrumentsService) {}

  @Get()
  async search(@Query('query') query: string): Promise<Instrument[]> {
    return this.service.search(query);
  }
}
