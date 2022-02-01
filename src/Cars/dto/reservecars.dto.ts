import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class RezerveCarsDto {
    @ApiProperty()
    @IsNumber()
    readonly idCar: number;
    @ApiProperty({default:new Date(2022,1,4)})
    @Transform((v) => new Date(v.value))
    @IsDate()
    readonly dateStart: Date;
    @ApiProperty({default:new Date(2022,1,5)})
    @Transform((v) => new Date(v.value))
    @IsDate()
    readonly dateEnd: Date;
}