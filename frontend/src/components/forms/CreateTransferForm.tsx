import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { TransferFormState, Warehouse } from "../../types/domain";

type CreateTransferFormProps = {
  transferForm: TransferFormState;
  setTransferForm: Dispatch<SetStateAction<TransferFormState>>;
  warehouses: Warehouse[];
  canCreateTransfer: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function CreateTransferForm({
  transferForm,
  setTransferForm,
  warehouses,
  canCreateTransfer,
  onSubmit,
}: CreateTransferFormProps) {
  return (
    <article className="card">
      <h2>Create Transfer Request</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Source Warehouse
          <select
            required
            value={transferForm.sourceWarehouse}
            onChange={(event) =>
              setTransferForm((previous) => ({
                ...previous,
                sourceWarehouse: event.target.value,
              }))
            }
          >
            <option value="">Select source</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse._id} value={warehouse._id}>
                {warehouse.name} ({warehouse.location})
              </option>
            ))}
          </select>
        </label>
        <label>
          Destination Warehouse
          <select
            required
            value={transferForm.destinationWarehouse}
            onChange={(event) =>
              setTransferForm((previous) => ({
                ...previous,
                destinationWarehouse: event.target.value,
              }))
            }
          >
            <option value="">Select destination</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse._id} value={warehouse._id}>
                {warehouse.name} ({warehouse.location})
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantity
          <input
            required
            type="number"
            className="plain-number-input"
            value={transferForm.quantity}
            onChange={(event) =>
              setTransferForm((previous) => ({
                ...previous,
                quantity: event.target.value,
              }))
            }
            placeholder="Enter transfer quantity"
          />
        </label>
        <label>
          Note
          <textarea
            value={transferForm.note}
            onChange={(event) =>
              setTransferForm((previous) => ({
                ...previous,
                note: event.target.value,
              }))
            }
            placeholder="Urgent stock movement"
          />
        </label>
        <button type="submit" disabled={!canCreateTransfer}>
          Create Transfer
        </button>
      </form>
    </article>
  );
}
