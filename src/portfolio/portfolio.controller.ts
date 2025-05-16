import { Controller, Get, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDTO } from './dto/portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get(':userid')
  async getPortfolio(@Param('userid') userid: number): Promise<PortfolioDTO> {
    return this.service.getPortfolio(userid);
  }
}
