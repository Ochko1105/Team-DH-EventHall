"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/us/Header";
import {
  Trash2,
  Edit2,
  Users,
  Calendar,
  Building2,
  Music,
  UserCircle,
  X,
  Save,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  MapPin,
  ImageIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Tab =
  | "requests"
  | "users"
  | "bookings"
  | "event-halls"
  | "performers"
  | "hosts";

export default function AdminDataManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("requests");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [form, setForm] = useState<any[]>([]);
  const [modalState, setModalState] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    action: "accept" | "decline";
  } | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/home");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/home");
          return;
        }

        const userData = await res.json();
        if (userData.user.role !== "admin") {
          router.push("/home");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/home");
      }
    };

    checkAdmin();
  }, [router]);

  // Fetch all data
  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
      fetchFormRequests();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    try {
      const res = await fetch("/api/admin/all-data");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormRequests = async () => {
    try {
      const res = await fetch(`/api/getforms`);
      const data = await res.json();
      setForm(data.data || []);
    } catch (error) {
      console.error("Error fetching form requests:", error);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAllData();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting item");
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    const typeMap: Record<Tab, string> = {
      requests: "",
      users: "users",
      bookings: "bookings",
      "event-halls": "event-halls",
      performers: "performers",
      hosts: "hosts",
    };

    try {
      const res = await fetch(
        `/api/admin/${typeMap[activeTab]}/${editingItem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      if (res.ok) {
        fetchAllData();
        setEditingItem(null);
        setEditForm({});
      } else {
        alert("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Error updating item");
    }
  };

  const handleRequestAction = (id: string, action: "accept" | "decline") => {
    setSelectedRequest({ id, action });
  };

  const handleConfirmRequest = async () => {
    if (!selectedRequest) return;
    setLoadingId(selectedRequest.id);

    try {
      const res = await fetch(`/api/form/form-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRequest.id }),
      });

      if (res.ok) {
        setForm((prev) =>
          prev.filter((item) => item.id !== selectedRequest.id)
        );
      } else {
        console.error("API error:", await res.text());
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoadingId(null);
      setSelectedRequest(null);
    }
  };

  const handleCancelRequest = () => {
    setSelectedRequest(null);
  };

  const openModal = (images: string[], index: number) => {
    setModalState({ images, currentIndex: index });
  };

  const closeModal = () => setModalState(null);

  const prevImage = () => {
    if (!modalState) return;
    setModalState({
      ...modalState,
      currentIndex:
        (modalState.currentIndex - 1 + modalState.images.length) %
        modalState.images.length,
    });
  };

  const nextImage = () => {
    if (!modalState) return;
    setModalState({
      ...modalState,
      currentIndex: (modalState.currentIndex + 1) % modalState.images.length,
    });
  };

  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Уншиж байна...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "requests" as Tab, label: "Хүсэлтүүд", icon: FileText },
    { id: "users" as Tab, label: "Хэрэглэгчид", icon: Users },
    { id: "bookings" as Tab, label: "Захиалгууд", icon: Calendar },
    { id: "event-halls" as Tab, label: "Танхимууд", icon: Building2 },
    { id: "performers" as Tab, label: "Уран бүтээлчид", icon: Music },
    { id: "hosts" as Tab, label: "Хөтлөгч", icon: UserCircle },
  ];

  return (
    <div className="bg-black min-h-screen text-white mt-30">
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-8 bg-linear-to-r  from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Админ удирдлагын самбар
        </h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105"
                    : "bg-neutral-800/50 text-gray-300 hover:bg-neutral-700 hover:text-white border border-neutral-700"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    activeTab === tab.id ? "animate-pulse" : ""
                  }`}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          {activeTab === "requests" && (
            <FormRequestsSection
              form={form}
              onAction={handleRequestAction}
              onImageClick={openModal}
            />
          )}
          {activeTab === "users" && (
            <UsersTable
              users={data.users || []}
              onDelete={(id) => handleDelete("users", id)}
              onEdit={handleEdit}
            />
          )}
          {activeTab === "bookings" && (
            <BookingsTable
              bookings={data.bookings || []}
              onDelete={(id) => handleDelete("bookings", id)}
              onEdit={handleEdit}
            />
          )}
          {activeTab === "event-halls" && (
            <EventHallsTable
              eventHalls={data.eventHalls || []}
              onDelete={(id) => handleDelete("event-halls", id)}
              onEdit={handleEdit}
            />
          )}
          {activeTab === "performers" && (
            <PerformersTable
              performers={data.performers || []}
              onDelete={(id) => handleDelete("performers", id)}
              onEdit={handleEdit}
            />
          )}
          {activeTab === "hosts" && (
            <HostsTable
              hosts={data.hosts || []}
              onDelete={(id) => handleDelete("hosts", id)}
              onEdit={handleEdit}
            />
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-neutral-900 text-white border-neutral-800 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Засах</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              {Object.keys(editForm).map((key) => {
                if (
                  key === "id" ||
                  key === "password" ||
                  key === "createdat" ||
                  key === "created_at" ||
                  key === "updatedate"
                )
                  return null;

                if (Array.isArray(editForm[key])) {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      <Textarea
                        value={editForm[key].join(", ")}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            [key]: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        className="bg-neutral-800 border-neutral-700"
                        placeholder="Comma separated values"
                      />
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    {typeof editForm[key] === "string" &&
                    editForm[key].length > 100 ? (
                      <Textarea
                        value={editForm[key] || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [key]: e.target.value })
                        }
                        className="bg-neutral-800 border-neutral-700"
                      />
                    ) : (
                      <Input
                        type="text"
                        value={editForm[key] || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [key]: e.target.value })
                        }
                        className="bg-neutral-800 border-neutral-700"
                      />
                    )}
                  </div>
                );
              })}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="bg-neutral-800 border-neutral-700"
                >
                  Цуцлах
                </Button>
                <Button onClick={handleSave} className="bg-blue-600">
                  <Save className="w-4 h-4 mr-2" />
                  Хадгалах
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      {modalState && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeModal}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors bg-neutral-800/80 hover:bg-neutral-700 rounded-full p-2 z-10"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-800/80 px-4 py-2 rounded-full text-white text-sm">
              {modalState.currentIndex + 1} / {modalState.images.length}
            </div>

            {/* Previous Button */}
            {modalState.images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-blue-400 transition-colors bg-neutral-800/80 hover:bg-neutral-700 rounded-full p-3 z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image */}
            <img
              src={modalState.images[modalState.currentIndex]}
              alt="Modal view"
              className="max-h-[90vh] max-w-[90vw] mx-auto object-contain rounded-2xl shadow-2xl"
            />

            {/* Next Button */}
            {modalState.images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-blue-400 transition-colors bg-neutral-800/80 hover:bg-neutral-700 rounded-full p-3 z-10"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirm Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-white">
            <h2 className="text-lg font-semibold mb-4">
              Та энэ хүсэлтийг {selectedRequest.action} баталгаажуулахдаа
              итгэлтэй байна уу?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelRequest}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Цуцлах
              </button>
              <button
                onClick={handleConfirmRequest}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                {loadingId === selectedRequest.id
                  ? "Уншиж байна..."
                  : "Баталгаажуулах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Users Table Component
function UsersTable({
  users,
  onDelete,
  onEdit,
}: {
  users: any[];
  onDelete: (id: number) => void;
  onEdit: (item: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Нэр</th>
            <th className="text-left p-3">И-мэйл</th>
            <th className="text-left p-3">Эрх</th>
            <th className="text-left p-3">Утас</th>
            <th className="text-right p-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-neutral-800/50">
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.role === "admin" ? "bg-purple-600" : "bg-blue-600"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Bookings Table Component
function BookingsTable({
  bookings,
  onDelete,
  onEdit,
}: {
  bookings: any[];
  onDelete: (id: number) => void;
  onEdit: (item: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Хэрэглэгч</th>
            <th className="text-left p-3">Танхим</th>
            <th className="text-left p-3">Огноо</th>
            <th className="text-left p-3">Цаг</th>
            <th className="text-left p-3">Төлөв</th>
            <th className="text-right p-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-neutral-800/50">
              <td className="p-3">{booking.id}</td>
              <td className="p-3">{booking.User?.name}</td>
              <td className="p-3">{booking.event_halls?.name}</td>
              <td className="p-3">
                {new Date(booking.ordereddate).toLocaleDateString()}
              </td>
              <td className="p-3">
                {booking.starttime} - {booking.endtime}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    booking.status === "approved"
                      ? "bg-green-600"
                      : booking.status === "pending"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(booking)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(booking.id)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Event Halls Table Component
function EventHallsTable({
  eventHalls,
  onDelete,
  onEdit,
}: {
  eventHalls: any[];
  onDelete: (id: number) => void;
  onEdit: (item: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Нэр</th>
            <th className="text-left p-3">Байршил</th>
            <th className="text-left p-3">Багтаамж</th>
            <th className="text-left p-3">Үнэлгээ</th>
            <th className="text-right p-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {eventHalls.map((hall) => (
            <tr key={hall.id} className="border-b border-neutral-800/50">
              <td className="p-3">{hall.id}</td>
              <td className="p-3">{hall.name}</td>
              <td className="p-3">{hall.location}</td>
              <td className="p-3">{hall.capacity}</td>
              <td className="p-3">{hall.rating}</td>
              <td className="p-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(hall)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(hall.id)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Performers Table Component
function PerformersTable({
  performers,
  onDelete,
  onEdit,
}: {
  performers: any[];
  onDelete: (id: number) => void;
  onEdit: (item: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Нэр</th>
            <th className="text-left p-3">Төрөл</th>
            <th className="text-left p-3">Хэлбэр</th>
            <th className="text-left p-3">Үнэ</th>
            <th className="text-right p-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {performers.map((performer) => (
            <tr key={performer.id} className="border-b border-neutral-800/50">
              <td className="p-3">{performer.id}</td>
              <td className="p-3">{performer.name}</td>
              <td className="p-3">{performer.genre}</td>
              <td className="p-3">{performer.performance_type}</td>
              <td className="p-3">₮{performer.price?.toString()}</td>
              <td className="p-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(performer)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(performer.id)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Hosts Table Component
function HostsTable({
  hosts,
  onDelete,
  onEdit,
}: {
  hosts: any[];
  onDelete: (id: number) => void;
  onEdit: (item: any) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Нэр</th>
            <th className="text-left p-3">И-мэйл</th>
            <th className="text-left p-3">Утас</th>
            <th className="text-left p-3">Үнэлгээ</th>
            <th className="text-left p-3">Үнэ</th>
            <th className="text-right p-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map((host) => (
            <tr key={host.id} className="border-b border-neutral-800/50">
              <td className="p-3">{host.id}</td>
              <td className="p-3">{host.name}</td>
              <td className="p-3">{host.email}</td>
              <td className="p-3">{host.phone}</td>
              <td className="p-3">{host.rating}</td>
              <td className="p-3">₮{host.price}</td>
              <td className="p-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(host)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => onDelete(host.id)}
                    className="p-2 hover:bg-neutral-800 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Form Requests Section Component
function FormRequestsSection({
  form,
  onAction,
  onImageClick,
}: {
  form: any[];
  onAction: (id: string, action: "accept" | "decline") => void;
  onImageClick: (images: string[], index: number) => void;
}) {
  if (form.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 mb-6">
          <FileText className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-300 mb-2">
          Хүсэлт байхгүй байна
        </h3>
        <p className="text-gray-500">
          Танхимын бүртгэлийн хүсэлтүүд энд харагдана
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {form.map((item, index) => (
        <Card
          key={item.id}
          className="group bg-linear-to-br from-neutral-900 to-neutral-800 border border-neutral-700 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] text-white rounded-2xl overflow-hidden flex flex-col"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6 flex flex-col flex-1">
            {/* Header with Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full">
                    Шинэ хүсэлт
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-1 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {item.hallname}
                </h2>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                <Users className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Нэр</p>
                  <p className="text-base font-medium text-white">
                    {item.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">И-мэйл</p>
                  <p className="text-base font-medium text-white break-all">
                    {item.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Утас</p>
                  <p className="text-base font-medium text-white">
                    {item.number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Байршил</p>
                  <p className="text-base font-medium text-white">
                    {item.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            {item.images && item.images.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-400 font-medium">
                    Зургууд ({item.images.length})
                  </p>
                </div>
                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {item.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative group/img shrink-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageClick(item.images, idx);
                      }}
                    >
                      <img
                        src={img}
                        alt={`${item.hallname} ${idx + 1}`}
                        className="h-24 w-24 rounded-xl object-cover hover:ring-2 hover:ring-blue-400 transition-all duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto pt-4 border-t border-neutral-700">
              <button
                onClick={() => onAction(item.id, "accept")}
                className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-3 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Зөвшөөрөх
              </button>
              <button
                onClick={() => onAction(item.id, "decline")}
                className="bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Татгалзах
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
