export interface IProductSearchQuery {
  name?: { $regex: string; $options: string };
  category?: string;
  createdBy: string;
}
