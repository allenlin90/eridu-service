import { IsInt, IsDefined, IsString, IsDate, IsOptional } from "class-validator";
import { User, Feature } from "./";

export class UserFeature {
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
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

    @IsDefined()
    feature!: Feature;

    @IsDefined()
    @IsInt()
    featureId!: number;

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
