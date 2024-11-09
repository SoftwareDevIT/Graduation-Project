
import { User } from "./User";
import {Permission} from './Permissions'
export interface Roles{
    id: string;
    name: string;
    user: User
    permissions: Permission
}