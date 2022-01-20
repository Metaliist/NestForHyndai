import { ApiProperty } from "@nestjs/swagger";

export class OrderMonth {
    @ApiProperty()
    readonly IDCar: number;
    @ApiProperty()
    readonly Month: string;
    @ApiProperty()
    readonly all: boolean;
}