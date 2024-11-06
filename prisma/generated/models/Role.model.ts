import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { Business, Membership } from "./";

export class Role {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    uid!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsOptional()
    business?: Business;

    @IsDefined()
    @IsInt()
    businessId!: number;

    @IsDefined()
    memberships!: Membership[];

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
