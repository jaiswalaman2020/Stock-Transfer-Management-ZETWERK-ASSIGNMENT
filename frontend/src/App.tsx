import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { request } from "./api/client";
import { CreateTransferForm } from "./components/forms/CreateTransferForm";
import { CreateWarehouseForm } from "./components/forms/CreateWarehouseForm";
import { TransferHistoryTable } from "./components/tables/TransferHistoryTable";
import { WarehouseStockTable } from "./components/tables/WarehouseStockTable";
import type {
  Transfer,
  TransferFormState,
  TransferStatus,
  Warehouse,
  WarehouseFormState,
} from "./types/domain";
import "./App.css";

const statusOptions: TransferStatus[] = ["pending", "approved"];

const allowedTransitions: Record<TransferStatus, TransferStatus[]> = {
  pending: ["approved"],
  approved: [],
};

const initialWarehouseForm: WarehouseFormState = {
  name: "",
  location: "",
  stockLevel: "",
};

const initialTransferForm: TransferFormState = {
  sourceWarehouse: "",
  destinationWarehouse: "",
  quantity: "",
  note: "",
};

function App() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warehouseForm, setWarehouseForm] =
    useState<WarehouseFormState>(initialWarehouseForm);
  const [transferForm, setTransferForm] =
    useState<TransferFormState>(initialTransferForm);
  const [stockDraft, setStockDraft] = useState<Record<string, number>>({});

  const canCreateTransfer = useMemo(() => {
    const quantityValue = Number(transferForm.quantity);

    return (
      Boolean(transferForm.sourceWarehouse) &&
      Boolean(transferForm.destinationWarehouse) &&
      transferForm.sourceWarehouse !== transferForm.destinationWarehouse &&
      Number.isFinite(quantityValue) &&
      quantityValue > 0
    );
  }, [transferForm]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [warehouseData, transferData] = await Promise.all([
        request<Warehouse[]>("/warehouses"),
        request<Transfer[]>("/transfers"),
      ]);

      setWarehouses(warehouseData);
      setTransfers(transferData);
      setStockDraft(
        warehouseData.reduce<Record<string, number>>(
          (accumulator, warehouse) => {
            accumulator[warehouse._id] = warehouse.stockLevel;
            return accumulator;
          },
          {},
        ),
      );

      setTransferForm((previous) => {
        if (previous.sourceWarehouse || warehouseData.length === 0) {
          return previous;
        }

        return {
          ...previous,
          sourceWarehouse: warehouseData[0]._id,
          destinationWarehouse: warehouseData[1]?._id || "",
        };
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load data",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreateWarehouse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const stockLevelValue = Number(warehouseForm.stockLevel);

    if (!Number.isFinite(stockLevelValue) || stockLevelValue < 0) {
      setError("Please enter a valid initial stock value.");
      return;
    }

    try {
      await request<Warehouse>("/warehouses", {
        method: "POST",
        body: JSON.stringify({
          ...warehouseForm,
          stockLevel: stockLevelValue,
        }),
      });

      setWarehouseForm(initialWarehouseForm);
      await loadData();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create warehouse",
      );
    }
  }

  async function handleUpdateStock(warehouseId: string) {
    setError(null);

    try {
      await request<Warehouse>(`/warehouses/${warehouseId}/stock`, {
        method: "PATCH",
        body: JSON.stringify({
          stockLevel: Number(stockDraft[warehouseId] || 0),
        }),
      });

      await loadData();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update stock",
      );
    }
  }

  async function handleCreateTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const quantityValue = Number(transferForm.quantity);

    if (!canCreateTransfer) {
      setError(
        "Please select different source and destination warehouses and a valid quantity.",
      );
      return;
    }

    try {
      await request<Transfer>("/transfers", {
        method: "POST",
        body: JSON.stringify({
          ...transferForm,
          quantity: quantityValue,
        }),
      });

      setTransferForm((previous) => ({
        ...previous,
        quantity: "",
        note: "",
      }));
      await loadData();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create transfer",
      );
    }
  }

  async function handleStatusChange(
    transferId: string,
    status: TransferStatus,
  ) {
    setError(null);

    try {
      await request<Transfer>(`/transfers/${transferId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      await loadData();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update transfer status",
      );
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Stock Transfer Management</h1>
        <p>
          Manage warehouses, transfer requests, and stock movement lifecycle.
        </p>
      </header>

      {error && <p className="error">{error}</p>}
      {isLoading && <p className="loading">Loading latest data...</p>}

      <section className="grid two-columns">
        <CreateWarehouseForm
          warehouseForm={warehouseForm}
          setWarehouseForm={setWarehouseForm}
          onSubmit={handleCreateWarehouse}
        />
        <CreateTransferForm
          transferForm={transferForm}
          setTransferForm={setTransferForm}
          warehouses={warehouses}
          canCreateTransfer={canCreateTransfer}
          onSubmit={handleCreateTransfer}
        />
      </section>

      <WarehouseStockTable
        warehouses={warehouses}
        stockDraft={stockDraft}
        setStockDraft={setStockDraft}
        onUpdateStock={handleUpdateStock}
      />

      <TransferHistoryTable
        transfers={transfers}
        statusOptions={statusOptions}
        allowedTransitions={allowedTransitions}
        onStatusChange={handleStatusChange}
      />
    </main>
  );
}

export default App;
