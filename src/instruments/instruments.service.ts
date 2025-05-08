import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from '../entities/instrument.entity';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
  ) {}

  async search(query: string): Promise<Instrument[]> {
    if (!query) return [];

    return this.instrumentRepo.find({
      where: [{ ticker: ILike(`%${query}%`) }, { name: ILike(`%${query}%`) }],
    });
  }
}
