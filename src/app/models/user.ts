import { ContributionsCollection } from './contibutions';
import { MostStarredRepo } from './repo';

export interface User {
  avatarUrl: string;
  bio?: string;
  login: string;
  name?: string;
  location?: string;
  createdAt?: string;
}
export interface SingleUser extends UserContributions {
  email?: string;
  most_starred_repo?: MostStarredRepo;
  most_used_languages: string[];
  twitterUsername?: string;
  websiteUrl?: string;
}
export interface UserContributions extends User {
  contributionsCollection: ContributionsCollection;
}
export interface ListResponse<T> {
  users: T[];
}
