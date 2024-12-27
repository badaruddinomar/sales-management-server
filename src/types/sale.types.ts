export interface ISaleSearchQuery {
  name?: { $regex: string; $options: string };
  createdBy: string;
}
