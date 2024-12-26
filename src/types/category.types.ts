export interface ICategorySearchQuery {
  name?: { $regex: string; $options: string };
  createdBy: string;
}
