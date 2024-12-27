export interface ISaleSearchQuery {
  customerName?: { $regex: string; $options: string };
  customerPhone?: { $regex: string; $options: string };
  createdBy: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}
