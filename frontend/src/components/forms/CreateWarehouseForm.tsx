import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { WarehouseFormState } from "../../types/domain";

type CreateWarehouseFormProps = {
  warehouseForm: WarehouseFormState;
  setWarehouseForm: Dispatch<SetStateAction<WarehouseFormState>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function CreateWarehouseForm({
  warehouseForm,
  setWarehouseForm,
  onSubmit,
}: CreateWarehouseFormProps) {
  return (
    <article className="card">
      <h2>Create Warehouse</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Name
          <input
            required
            value={warehouseForm.name}
            onChange={(event) =>
              setWarehouseForm((previous) => ({
                ...previous,
                name: event.target.value,
              }))
            }
            placeholder="Warehouse A"
          />
        </label>
        <label>
          Location
          <input
            required
            value={warehouseForm.location}
            onChange={(event) =>
              setWarehouseForm((previous) => ({
                ...previous,
                location: event.target.value,
              }))
            }
            placeholder="Mumbai"
          />
        </label>
        <label>
          Initial Stock
          <input
            required
            type="number"
            className="plain-number-input"
            value={warehouseForm.stockLevel}
            onChange={(event) =>
              setWarehouseForm((previous) => ({
                ...previous,
                stockLevel: event.target.value,
              }))
            }
            placeholder="Enter initial stock"
          />
        </label>
        <button type="submit">Create Warehouse</button>
      </form>
    </article>
  );
}
