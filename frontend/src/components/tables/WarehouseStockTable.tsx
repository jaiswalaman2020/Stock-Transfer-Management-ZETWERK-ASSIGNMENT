import type { Dispatch, SetStateAction } from "react";
import { Spinner } from "../ui/Spinner";
import type { Warehouse } from "../../types/domain";

type WarehouseStockTableProps = {
  warehouses: Warehouse[];
  stockDraft: Record<string, number>;
  setStockDraft: Dispatch<SetStateAction<Record<string, number>>>;
  updatingWarehouseId: string | null;
  onUpdateStock: (warehouseId: string) => Promise<void>;
};

export function WarehouseStockTable({
  warehouses,
  stockDraft,
  setStockDraft,
  updatingWarehouseId,
  onUpdateStock,
}: WarehouseStockTableProps) {
  return (
    <section className="card">
      <h2>Warehouses & Stock</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Current Stock</th>
              <th>Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse._id}>
                <td>{warehouse.name}</td>
                <td>{warehouse.location}</td>
                <td>{warehouse.stockLevel}</td>
                <td className="inline-actions">
                  <input
                    type="number"
                    value={stockDraft[warehouse._id] ?? warehouse.stockLevel}
                    onChange={(event) =>
                      setStockDraft((previous) => ({
                        ...previous,
                        [warehouse._id]: Number(event.target.value),
                      }))
                    }
                  />
                  <button
                    type="button"
                    disabled={updatingWarehouseId === warehouse._id}
                    onClick={() => {
                      void onUpdateStock(warehouse._id);
                    }}
                  >
                    {updatingWarehouseId === warehouse._id ? (
                      <span className="button-content">
                        <Spinner size="sm" />
                        Saving...
                      </span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {warehouses.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">
                  No warehouses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
