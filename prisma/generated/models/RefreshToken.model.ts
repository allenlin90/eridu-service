import { IsInt, IsDefined, IsString, IsDate, IsOptional } from "class-validator";
import { User } from "./";

export class RefreshToken {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    uid!: string;

    @IsDefined()
    @IsDate()
    expiryDate!: Date;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

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
