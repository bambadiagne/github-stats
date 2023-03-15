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
export interface SingleUser extends User {
  email: string;
  most_starred_repo: MostStarredRepo;
  most_used_languages: string[];
  twitterUsername: string;
  websiteUrl: string;
}
export interface UserContributions extends User {
  contributionsCollection: ContributionsCollection;
}
