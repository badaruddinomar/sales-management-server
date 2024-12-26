export interface IUnitSearchQuery {
  name?: { $regex: string; $options: string };
  createdBy: string;
}
