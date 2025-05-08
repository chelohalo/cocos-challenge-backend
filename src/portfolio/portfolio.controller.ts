import { Controller, Get, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDTO } from './dto/portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get(':userId')
  async getPortfolio(@Param('userId') userId: number): Promise<PortfolioDTO> {
    return this.service.getPortfolio(userId);
  }
}
