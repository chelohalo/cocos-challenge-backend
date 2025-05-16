export interface PositionDTO {
  instrumentid: number;
  ticker: string;
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  returnPercentage: number;
}

export interface PortfolioDTO {
  cash: number;
  totalValue: number;
  positions: PositionDTO[];
}
