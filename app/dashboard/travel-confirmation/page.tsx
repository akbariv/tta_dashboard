"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/Sidebar";
import { AppHeader } from "../components/appheader";
import {
  Card,
  SearchInput,
  StatusBadge,
  DetailsButton,
  Column,
} from "@/app/dashboard/components/common";
import {
  getTravelConfirmationForEmployee,
  loadTravelConfirmationStore,
  persistTravelConfirmation,
  type TravelConfirmationRecord,
  approvalDetailById,
} from "@/app/dashboard/data/ttaMock";

type TravelConfirmationRow = TravelConfirmationRecord & {
  requestDate: string;
  approvalDate: string;
};

export default function TravelConfirmationPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<{
    username: string;
    name: string;
    id?: string;
    role?: string;
  } | null>(null);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<
    | "All"
    | "Waiting for approval"
    | "Waiting User's Confirmation"
    | "Confirmed"
    | "Rejected"
  >("All");
  const [category, setCategory] = React.useState("All");
  const [rows, setRows] = React.useState<TravelConfirmationRow[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = React.useState<any | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = React.useState<
    string[] | undefined
  >(undefined);
  const [selectedTravelConfirm, setSelectedTravelConfirm] =
    React.useState<TravelConfirmationRecord | null>(null);
  const [localSelectedOptionId, setLocalSelectedOptionId] = React.useState<
    string | undefined
  >(undefined);

  // Load user from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        router.replace("/");
        return;
      }
      const userData = JSON.parse(raw);
      setUser(userData);

      // Load travel confirmations for this employee
      // Use employee id (preferred) or fallback ke name
      const employeeIdForLookup =
        userData.id || userData.name || userData.username || "Unknown";
      const confirmations =
        getTravelConfirmationForEmployee(employeeIdForLookup);
      const mapped: TravelConfirmationRow[] = confirmations.map((r) => ({
        ...r,
        requestDate: new Date(r.requestDateISO).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        approvalDate: new Date(r.processedDateISO).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      }));
      setRows(mapped);
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Listen for new travel confirmations
  React.useEffect(() => {
    const handler = () => {
      if (user?.id || user?.name) {
        const employeeIdForLookup = user.id || user.name || "Unknown";
        const confirmations =
          getTravelConfirmationForEmployee(employeeIdForLookup);
        const mapped: TravelConfirmationRow[] = confirmations.map((r) => ({
          ...r,
          requestDate: new Date(r.requestDateISO).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          approvalDate: new Date(r.processedDateISO).toLocaleDateString(
            "id-ID",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          ),
        }));
        setRows(mapped);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("tta:travel-confirmation", handler as any);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tta:travel-confirmation", handler as any);
      }
    };
  }, [user?.id, user?.name]);

  // open detail modal
  const openDetail = (id: string) => {
    setSelectedId(id);
    try {
      let det = (approvalDetailById as any)[id];
      const store = loadTravelConfirmationStore();
      const rec = store[id];

      if (!det && rec) {
        det = {
          id,
          kind: "travel",
          employee: {
            name: rec.requestor,
            id: rec.requestorId ?? rec.requestor,
            department: rec.department ?? "-",
            position: "-",
          },
          travel: {
            requestId: id,
            bookingId: rec.bookingId ?? "-",
            type: "Moda Eksternal",
            destination: "-",
            departureDateISO: rec.requestDateISO,
            transportation: "-",
            estimatedCost: 0,
            options: [],
          },
          approval: {
            requestDateISO: rec.requestDateISO,
            deadlineISO: rec.processedDateISO,
            status:
              rec.status === "Waiting for approval"
                ? "Pending"
                : (rec.status as any),
          },
        };
      }

      setSelectedDetail(det ?? null);
      setSelectedOptionIds(rec?.selectedOptionIds);
      setSelectedTravelConfirm(rec ?? null);
      setLocalSelectedOptionId(rec?.selectedOptionIds?.[0]);
    } catch {
      setSelectedDetail(null);
      setSelectedOptionIds(undefined);
    }
  };

  const closeDetail = () => {
    setSelectedId(null);
    setSelectedDetail(null);
    setSelectedOptionIds(undefined);
  };

  // Handle confirm action
  // const handleConfirm = (id: string) => {
  //   const store = loadTravelConfirmationStore();
  //   if (store[id]) {
  //     store[id] = {
  //       ...store[id],
  //       status: "Confirmed",
  //       confirmationDateISO: new Date().toISOString(),
  //     };
  //     persistTravelConfirmation(id, store[id]);
  //     setRows((prev) =>
  //       prev.map((r) =>
  //         r.id === id
  //           ? {
  //               ...r,
  //               status: "Confirmed",
  //               confirmationDateISO: new Date().toISOString(),
  //             }
  //           : r
  //       )
  //     );
  //     // update modal state too
  //     setSelectedTravelConfirm(store[id]);
  //     setSelectedOptionIds(store[id].selectedOptionIds);
  //   }
  // };

  const handleConfirm = (id: string) => {
    const store = loadTravelConfirmationStore();
    const rec = store[id];
    if (!rec) return;

    // WAJIB pilih salah satu opsi dulu
    if (!rec.selectedOptionIds || rec.selectedOptionIds.length === 0) {
      alert("Please choose one transport option before confirming.");
      return;
    }

    store[id] = {
      ...rec,
      status: "Confirmed",
      confirmationDateISO: new Date().toISOString(),
    };

    persistTravelConfirmation(id, store[id]);

    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Confirmed",
              confirmationDateISO: new Date().toISOString(),
            }
          : r
      )
    );

    setSelectedTravelConfirm(store[id]);
    setSelectedOptionIds(store[id].selectedOptionIds);
  };

  // Handle reject action
  const handleReject = (id: string) => {
    const store = loadTravelConfirmationStore();
    if (store[id]) {
      store[id] = {
        ...store[id],
        status: "Rejected",
        confirmationDateISO: new Date().toISOString(),
      };
      persistTravelConfirmation(id, store[id]);
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "Rejected",
                confirmationDateISO: new Date().toISOString(),
              }
            : r
        )
      );
      // update modal state too
      setSelectedTravelConfirm(store[id]);
    }
  };

  // Filter rows
  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const passStatus = status === "All" ? true : r.status === status;
      const passCategory = category === "All" ? true : r.category === category;
      const passSearch =
        q.length === 0 ||
        [r.id, r.bookingId, r.category, r.requestor, r.department]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return passStatus && passCategory && passSearch;
    });
  }, [rows, status, category, search]);

  function logout() {
    try {
      localStorage.removeItem("authUser");
    } catch {}
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="size-full flex bg-[#f5f6fa] min-h-screen">
      <Sidebar
        activeMenu="dashboard"
        onMenuClick={(m) => {
          if (m === "logout") logout();
          else router.push("/dashboard");
        }}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader
          userName={user.name ?? "User"}
          userTitle={user.role ?? "Employee"}
          search={search}
          onSearchChange={setSearch}
          onToggleSidebar={() => {}}
          onLogout={logout}
        />

        <div className="flex-1 px-8 py-6">
          <div className="space-y-6">
            <h1 className="text-[28px] font-semibold text-slate-800">
              Travel Confirmation
            </h1>

            <Card
              title={
                <div className="inline-flex items-center gap-2">
                  <span>Travel Confirmation</span>
                  <span className="w-5 h-5 text-[11px] rounded-full bg-rose-500 text-white grid place-items-center">
                    {filteredRows.length}
                  </span>
                </div>
              }
              right={
                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 text-sm border rounded-lg"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="All">Category</option>
                    <option value="Travel Request">Travel Request</option>
                    <option value="Claim Request">Claim Request</option>
                  </select>
                  <select
                    className="px-3 py-2 text-sm border rounded-lg"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="All">Status</option>
                    <option value="Waiting for approval">
                      Waiting for approval
                    </option>
                    <option value="Waiting User's Confirmation">
                      Waiting Confirmation
                    </option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <SearchInput
                    placeholder="Search"
                    size="sm"
                    value={search}
                    onChange={setSearch}
                  />
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2">Request ID</th>
                      <th className="py-2">Booking ID</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Request Date</th>
                      <th className="py-2">Approval Date</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {filteredRows.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="py-2">{r.id}</td>
                        <td className="py-2">{r.bookingId}</td>
                        <td className="py-2">{r.category}</td>
                        <td className="py-2">{r.requestDate}</td>
                        <td className="py-2">{r.approvalDate}</td>
                        <td className="py-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              r.status === "Waiting User's Confirmation"
                                ? "bg-amber-100 text-amber-700"
                                : r.status === "Confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {r.status === "Waiting User's Confirmation"
                              ? "Waiting Confirmation"
                              : r.status === "Waiting for approval"
                              ? "Waiting for approval"
                              : r.status === "Confirmed"
                              ? "Booked"
                              : r.status}
                          </span>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            {r.status === "Waiting User's Confirmation" && (
                              <>
                                <button
                                  onClick={() => handleConfirm(r.id)}
                                  className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleReject(r.id)}
                                  className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {/* confirmed label intentionally removed from Action column; Details button remains */}
                            {r.status === "Rejected" && (
                              <span className="text-xs text-red-700 font-semibold">
                                ✗ Rejected
                              </span>
                            )}
                            <DetailsButton
                              onClick={() => openDetail(r.id)}
                              size="xs"
                              className="ml-2"
                            >
                              Details
                            </DetailsButton>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredRows.length === 0 && (
                      <tr className="border-t">
                        <td className="py-3" colSpan={7}>
                          <div className="text-center text-slate-500">
                            No travel confirmation yet
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
            {/* Detail modal */}
            {selectedId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={closeDetail}
                />
                <div className="relative w-[900px] max-w-full bg-white rounded-2xl shadow-lg p-6 z-10">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold">
                      Travel Confirmation Detail
                    </h2>
                    <button
                      onClick={closeDetail}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4">
                    {selectedDetail && selectedDetail.kind === "travel" ? (
                      <div>
                        <div className="text-sm text-slate-600">
                          Destination:{" "}
                          <strong className="text-slate-800">
                            {selectedDetail.travel.destination}
                          </strong>
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          Departure:{" "}
                          <strong className="text-slate-800">
                            {new Date(
                              selectedDetail.travel.departureDateISO
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </strong>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-sm font-medium">Options</h3>
                          <div className="mt-2 space-y-2">
                            {(selectedDetail.travel.options ?? []).map(
                              (opt: any) => {
                                const isSelected =
                                  selectedTravelConfirm?.selectedOptionIds?.includes(
                                    opt.id
                                  ) || localSelectedOptionId === opt.id;
                                // Only allow changing selection when status is Waiting User's Confirmation
                                const showRadio =
                                  selectedTravelConfirm?.status ===
                                  "Waiting User's Confirmation";
                                return (
                                  <div
                                    key={opt.id}
                                    className="flex items-center justify-between border rounded p-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      {showRadio ? (
                                        <input
                                          type="radio"
                                          name="travel-option"
                                          checked={
                                            localSelectedOptionId === opt.id
                                          }
                                          onChange={() => {
                                            // persist single selection to travel confirmation store
                                            try {
                                              const store =
                                                loadTravelConfirmationStore();
                                              const rec =
                                                store[selectedId as string];
                                              if (rec) {
                                                rec.selectedOptionIds = [
                                                  opt.id,
                                                ];
                                                persistTravelConfirmation(
                                                  selectedId as string,
                                                  rec
                                                );
                                                setSelectedOptionIds(
                                                  rec.selectedOptionIds
                                                );
                                                setSelectedTravelConfirm(rec);
                                                setLocalSelectedOptionId(
                                                  opt.id
                                                );
                                                // also update rows list state
                                                setRows((prev) =>
                                                  prev.map((r) =>
                                                    r.id === rec.id
                                                      ? {
                                                          ...r,
                                                          status: rec.status,
                                                        }
                                                      : r
                                                  )
                                                );
                                              }
                                            } catch (e) {}
                                          }}
                                        />
                                      ) : null}
                                      <div>
                                        <div className="font-medium">
                                          {opt.label} — {opt.className}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                          {opt.departureTime} →{" "}
                                          {opt.arrivalTime} •{" "}
                                          {opt.departureStation} →{" "}
                                          {opt.destinationStation}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-semibold">
                                        {(opt.price ?? 0).toLocaleString(
                                          "id-ID",
                                          {
                                            style: "currency",
                                            currency: "IDR",
                                            maximumFractionDigits: 0,
                                          }
                                        )}
                                      </div>
                                      {isSelected ? (
                                        <div className="mt-2 text-xs inline-block px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                          Selected
                                        </div>
                                      ) : (
                                        <div className="mt-2 text-xs inline-block px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                          Not selected
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        No detail available for this confirmation.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={closeDetail}
                      className="px-4 py-2 rounded border"
                    >
                      Close
                    </button>
                    {selectedTravelConfirm?.status ===
                    "Waiting User's Confirmation" ? (
                      <>
                        <button
                          onClick={() => {
                            handleReject(selectedId as string);
                            closeDetail();
                          }}
                          className="px-4 py-2 rounded bg-red-600 text-white"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleConfirm(selectedId as string);
                            closeDetail();
                          }}
                          className="px-4 py-2 rounded bg-emerald-600 text-white"
                        >
                          Confirm
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
