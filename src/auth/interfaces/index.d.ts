import { User } from '@prisma/client';

// TODO: convert to branded type
export type UserId = User['id'];
