import { IsString } from 'class-validator';

export class UpdateBusinessDto {
  @IsString()
  name: string;
}
