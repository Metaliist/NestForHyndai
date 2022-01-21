import { ApiProperty } from "@nestjs/swagger";

export class RezerveCarsDto {
    @ApiProperty()
    readonly idCar: number;
    @ApiProperty({default:'2022-01-02'})
    readonly dateStart: Date;
    @ApiProperty({default:'2022-01-06'})
    readonly dateEnd: Date;
}