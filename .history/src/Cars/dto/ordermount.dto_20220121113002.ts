import { ApiProperty } from "@nestjs/swagger";


export class OrderMonth {
    @ApiProperty()
    readonly idCar: number;
    @ApiProperty({default:'2022-01'})
    readonly month: string;
    @ApiProperty()
    readonly all: boolean;
}