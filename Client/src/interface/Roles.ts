import { User } from "./User";

export interface Roles{
    id: string;
    name: string;
    user: User
    guard_name: string;
  
}