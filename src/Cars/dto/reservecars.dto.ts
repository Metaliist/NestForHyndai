import { ApiProperty } from "@nestjs/swagger";

export class RezerveCarsDto {
    @ApiProperty()
    readonly IDCar: number;
    @ApiProperty()
    readonly DateStart: Date;
    @ApiProperty()
    readonly DateEnd: Date;
}