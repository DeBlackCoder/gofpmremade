export type GroupTag = "Men" | "Women" | "Youth" | "Families" | "All Ages";

export interface CommunityGroup {
  id: string;
  name: string;
  tag: GroupTag;
  meets: string;
  leader: string;
  bio: string;
  spots: number | null; // null = open / unlimited
}
