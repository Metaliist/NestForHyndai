import { ApiProperty } from "@nestjs/swagger";


export class OrderMonth {
    @ApiProperty()
    readonly IDCar: number;
    @ApiProperty({default:'2022-01'})
    readonly Month: string;
    @ApiProperty()
    readonly all: boolean;
}