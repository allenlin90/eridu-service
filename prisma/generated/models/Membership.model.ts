import { IsInt, IsDefined, IsString, IsDate, IsOptional } from "class-validator";
import { User, Team, Role } from "./";

export class Membership {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    uid!: string;

    @IsDefined()
    @IsString()
    type!: string;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

    @IsDefined()
    team!: Team;

    @IsDefined()
    @IsInt()
    teamId!: number;

    @IsDefined()
    role!: Role;

    @IsDefined()
    @IsInt()
    roleId!: number;

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
