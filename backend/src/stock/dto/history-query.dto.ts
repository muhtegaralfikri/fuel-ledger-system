// /backend/src/stock/dto/history-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class StockHistoryQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: "Filter jenis transaksi. 'IN' untuk tambah stok, 'OUT' untuk pemakaian.",
    enum: ['IN', 'OUT'],
  })
  @IsOptional()
  @IsIn(['IN', 'OUT'])
  type?: 'IN' | 'OUT';
}
