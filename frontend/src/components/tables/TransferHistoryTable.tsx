import type { Transfer, TransferStatus } from "../../types/domain";
import { Spinner } from "../ui/Spinner";

type TransferHistoryTableProps = {
  transfers: Transfer[];
  statusOptions: TransferStatus[];
  allowedTransitions: Record<TransferStatus, TransferStatus[]>;
  updatingTransferId: string | null;
  onStatusChange: (transferId: string, status: TransferStatus) => Promise<void>;
};

export function TransferHistoryTable({
  transfers,
  statusOptions,
  allowedTransitions,
  updatingTransferId,
  onStatusChange,
}: TransferHistoryTableProps) {
  return (
    <section className="card">
      <h2>Transfer History</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Qty</th>
              <th>Note</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer._id}>
                <td>
                  {transfer.sourceWarehouse.name} (
                  {transfer.sourceWarehouse.location})
                </td>
                <td>
                  {transfer.destinationWarehouse.name} (
                  {transfer.destinationWarehouse.location})
                </td>
                <td>{transfer.quantity}</td>
                <td>{transfer.note || "-"}</td>
                <td>
                  <div className="status-field">
                    <select
                      value={transfer.status}
                      disabled={updatingTransferId === transfer._id}
                      onChange={(event) => {
                        void onStatusChange(
                          transfer._id,
                          event.target.value as TransferStatus,
                        );
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                          disabled={
                            status !== transfer.status &&
                            !(
                              allowedTransitions[
                                transfer.status as TransferStatus
                              ] ?? []
                            ).includes(status)
                          }
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                    {updatingTransferId === transfer._id && (
                      <Spinner size="sm" />
                    )}
                  </div>
                </td>
                <td>{new Date(transfer.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {transfers.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No transfers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
