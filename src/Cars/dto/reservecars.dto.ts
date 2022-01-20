import { ApiProperty } from "@nestjs/swagger";

export class RezerveCarsDto {
    @ApiProperty()
    readonly IDCar: number;
    @ApiProperty({default:'2022-01-02'})
    readonly DateStart: Date;
    @ApiProperty({default:'2022-01-06'})
    readonly DateEnd: Date;
}