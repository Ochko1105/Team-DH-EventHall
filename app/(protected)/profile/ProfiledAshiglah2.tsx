"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function RequestCard({
  request,
  onActionClick,
}: {
  request: any;
  onActionClick: any;
}) {
  if (!request.hallid) {
    return null;
  }
  const isApproved = request.status === "approved";

  return (
    <Card className="border-0 bg-neutral-900 transition-all hover:shadow-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Request Info */}
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-white">
              {request.event_halls.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {request.event_halls.location}
            </p>
            <p className="text-sm text-muted-foreground">
              Өдөр: {new Date(request.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Эхлэх цаг: {request.starttime}
            </p>
            <p className="text-sm text-muted-foreground">
              Дуусах цаг: {request.endtime}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTimeAgo(new Date(request.ordereddate))}
            </p>
          </div>

          {/* Action / Status */}
          <div className="flex gap-2 md:flex-col lg:flex-row">
            {request.status === "approved" && (
              <span className="flex-1 px-3 py-2 text-sm font-semibold text-green-800 bg-green-200 rounded-full text-center">
                Approved
              </span>
            )}
            {request.status === "pending" && (
              <>
                <Button
                  onClick={() => onActionClick(request.id, "accept")}
                  size="sm"
                  className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Accept</span>
                  <span className="sm:hidden">OK</span>
                </Button>
                <Button
                  onClick={() => onActionClick(request.id, "decline")}
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 border-border text-foreground hover:bg-muted"
                >
                  <XCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Decline</span>
                  <span className="sm:hidden">No</span>
                </Button>
              </>
            )}
            {request.status === "cancelled" && (
              <span className="flex-1 px-3 py-2 text-sm font-semibold text-red-800 bg-red-200 rounded-full text-center">
                Cancelled
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
