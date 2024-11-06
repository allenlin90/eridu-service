import { IsInt, IsDefined, IsString, IsDate, IsOptional } from "class-validator";
import { Business, UserFeature } from "./";

export class Feature {
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
    business!: Business;

    @IsDefined()
    @IsInt()
    businessId!: number;

    @IsDefined()
    userFeatures!: UserFeature[];

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
