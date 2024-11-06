import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsString, IsDate, IsOptional } from "class-validator";
import { User } from "./";

export class PermissionsCache {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

    @IsDefined()
    permissions!: Prisma.JsonValue;

    @IsDefined()
    @IsString()
    version!: string;

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
