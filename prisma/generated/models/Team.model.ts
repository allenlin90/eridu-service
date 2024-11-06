import { IsInt, IsDefined, IsString, IsOptional, IsDate } from "class-validator";
import { Business, Membership } from "./";

export class Team {
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

    @IsOptional()
    @IsInt()
    parentTeamId?: number;

    @IsOptional()
    parentTeam?: Team;

    @IsDefined()
    subTeams!: Team[];

    @IsOptional()
    @IsInt()
    hierarchyLevel?: number;

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
