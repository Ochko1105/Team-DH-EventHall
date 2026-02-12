"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import RequestsList from "./ProfiledAshilgah3";
import ConfirmationModal from "./ProfiledAshiglah";

interface Request {
  id: string;
  userName: string;
  email: string;
  role: "Performer" | "Host";
  submittedAt: Date;
  message?: string;
}

const mockRequests: Request[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Performer",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    message: "I would love to perform at your platform",
  },
  {
    id: "2",
    userName: "Marcus Chen",
    email: "marcus@example.com",
    role: "Host",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    message: "Interested in hosting events",
  },
  {
    id: "3",
    userName: "Emily Rodriguez",
    email: "emily@example.com",
    role: "Performer",
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    action: "accept" | "decline";
  } | null>(null);
  const getUserBookings = async () => {
    try {
      const res = await fetch(`/api/user-bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: 1 }),
      });
      const data = await res.json();

      // pending-ийг эхэнд гаргах
      const sortedBookings = data.bookings.sort((a: any, b: any) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0; // бусад нь id-ийн дарааллаар
      });

      setUserBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    }
  };

  useEffect(() => {
    getUserBookings();
  }, []);

  const handleActionClick = (
    requestId: string,
    action: "accept" | "decline"
  ) => {
    setSelectedRequest({ id: requestId, action });
  };

  const handleConfirm = () => {
    if (!selectedRequest) return;

    const request = userBookings.find(
      (r: { id: string }) => r.id === selectedRequest.id
    );
    if (!request) return;

    setUserBookings(
      userBookings.filter((r: { id: string }) => r.id !== selectedRequest.id)
    );
    setSelectedRequest(null);
  };

  const handleCancel = () => {
    setSelectedRequest(null);
  };
  if (!userBookings) return <div>Loading...</div>;

  return (
    <div>
      <main className="min-h-screen  from-background via-background to-muted/30 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 ">
            <h1 className="text-balance text-white text-3xl font-bold tracking-tight md:text-4xl">
              Таньд ирсэн нэгдсэн хүсэлтүүд
            </h1>
          </div>

          {/* Stats Bar */}
          <div>
            <div className="flex  gap-4 mb-19">
              <Card className="border-0 bg-neutral-900 text-white">
                <CardContent className="pt-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <CheckCircle2 className="h-6 w-6  text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Хүлээгдэж буй нийт хүсэлтүүд
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          userBookings.filter(
                            (booking: any) => booking.status === "pending"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-neutral-900 text-white">
                <CardContent className="pt-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <CheckCircle2 className="h-6 w-6  text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Нийт батлагдсан хүсэлтүүд
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          userBookings.filter(
                            (booking: any) => booking.status === "approved"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-neutral-900 text-white">
                <CardContent className="pt-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <CheckCircle2 className="h-6 w-6  text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Нийт татгалзсан хүсэлтүүд
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          userBookings.filter(
                            (booking: any) => booking.status === "cancelled"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Requests List or Empty State */}
          {userBookings.length > 0 ? (
            <RequestsList
              requests={userBookings}
              onActionClick={handleActionClick}
            />
          ) : (
            <Card className="border-0 bg-neutral-900 text-white text-center">
              <CardContent className="py-16">
                <div className="flex justify-center">
                  <div className="rounded-full bg-muted p-3">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold  text-white">
                  Бүгдийг нь шалгалаа!
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Одоогоор хүлээгдэж буй хүсэлт байхгүй байна. Шинэ хүсэлтүүдийг
                  дараа дахин шалгана уу.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Confirmation Modal */}
        {selectedRequest && (
          <ConfirmationModal
            isOpen={!!selectedRequest}
            action={selectedRequest.action}
            request={
              userBookings.find(
                (r: { id: string }) => r.id === selectedRequest.id
              )!
            }
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}
