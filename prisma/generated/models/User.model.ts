import { IsInt, IsDefined, IsString, IsOptional, IsBoolean, IsDate } from "class-validator";
import { Membership, UserFeature, RefreshToken, ResetToken, PermissionsCache } from "./";

export class User {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    uid!: string;

    @IsDefined()
    @IsString()
    email!: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsDefined()
    @IsString()
    password!: string;

    @IsDefined()
    @IsBoolean()
    isAdmin!: boolean;

    @IsDefined()
    @IsBoolean()
    isEmailConfirmed!: boolean;

    @IsDefined()
    memberships!: Membership[];

    @IsDefined()
    features!: UserFeature[];

    @IsDefined()
    refreshTokens!: RefreshToken[];

    @IsDefined()
    resetTokens!: ResetToken[];

    @IsOptional()
    permissionsCache?: PermissionsCache;

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
