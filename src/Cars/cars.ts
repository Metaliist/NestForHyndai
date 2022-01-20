import { ApiProperty } from "@nestjs/swagger";

export class Car {
    @ApiProperty()
    ID: Number;
    @ApiProperty()
    IDcar: Number;
    @ApiProperty()
    DateStart: Date;
    @ApiProperty()
    DateEnd: Date;

    constructor(ID: number, IDcar: Number, DateStart: Date, DateEnd: Date) {
        this.ID = ID;
        this.IDcar = IDcar;
        this.DateStart = DateStart;
        this.DateEnd = DateEnd;
    }
}
