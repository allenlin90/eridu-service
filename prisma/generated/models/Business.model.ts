import { IsInt, IsDefined, IsString, IsDate, IsOptional } from "class-validator";
import { Role, Feature, Team } from "./";

export class Business {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    uid!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    roles!: Role[];

    @IsDefined()
    features!: Feature[];

    @IsDefined()
    teams!: Team[];

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsOptional()
    @IsDate()
    deletedAt?: Date;
}
