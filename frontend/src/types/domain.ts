export type TransferStatus = "pending" | "approved";

export type Warehouse = {
  _id: string;
  name: string;
  location: string;
  stockLevel: number;
  createdAt: string;
  updatedAt: string;
};

export type Transfer = {
  _id: string;
  sourceWarehouse: Warehouse;
  destinationWarehouse: Warehouse;
  quantity: number;
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type WarehouseFormState = {
  name: string;
  location: string;
  stockLevel: string;
};

export type TransferFormState = {
  sourceWarehouse: string;
  destinationWarehouse: string;
  quantity: string;
  note: string;
};
