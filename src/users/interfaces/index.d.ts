export interface UserPermissions {
  [team_id: string]: {
    business_id: string;
    business_name: string;
    team_id: string;
    team_name: string;
    scope: string[];
  };
}
