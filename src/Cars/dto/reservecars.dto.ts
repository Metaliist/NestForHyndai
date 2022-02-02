import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ReserveCarsDto {
  @ApiProperty()
  readonly idCar: number;
  @ApiProperty({ default: '2022-01-02' })
  readonly dateStart: Date;

  @ApiProperty({ default: new Date() })
  @Transform((v) => new Date(v.value))
  readonly dateEnd: Date;
}
