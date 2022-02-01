import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from 'class-validator';


export class OrderMonth {
    @ApiProperty()
    @IsNumber()
    readonly idCar: number;
    @IsNumber()
    @ApiProperty({default:'1'})
    readonly month: number;
    @ApiProperty({default:'2021'})
    @IsNumber()
    readonly year: number;
    @ApiProperty()
    @IsBoolean()
    readonly all: boolean;
}