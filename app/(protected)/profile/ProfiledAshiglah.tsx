"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";

interface Request {
  event_halls: {
    id: string;
    name: string;
    location: string;
  };
  date: string;
  starttime: string;
  id: string;
  userName: string;
  email: string;
  role: "Performer" | "Host";
  submittedAt: Date;
  message?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  action: "accept" | "decline";
  request: Request;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  action,
  request,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isAccept = action === "accept";
  const Icon = isAccept ? CheckCircle2 : XCircle;
  const iconColor = isAccept ? "text-primary" : "text-destructive";
  const buttonColor = isAccept
    ? "bg-primary text-primary-foreground hover:bg-primary/90"
    : "bg-destructive text-destructive-foreground hover:bg-destructive/90";

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/profileapprove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: request.id,
          status: isAccept ? "approved" : "cancelled",
        }),
      });

      if (!response) {
        throw new Error("Failed to update booking status");
      }

      // Амжилттай бол parent component руу мэдэгдэл
      onConfirm();
    } catch (error) {
      console.error(error);
      alert("Status update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-4 rounded-full bg-muted p-3">
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <DialogTitle className="text-center">
            {isAccept
              ? `Approve ${request.event_halls.name}`
              : `Reject the request from ${request.userName}`}
          </DialogTitle>
          <DialogDescription className="text-center"></DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-muted p-4">
          <div className="space-y-2 text-sm">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-black">
                Газрын нэр : {request.event_halls.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Байршил : {request.event_halls.location}
              </p>
              <p className="text-sm text-muted-foreground">
                Өдөр : {new Date(request.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Эхлэх цаг : {request.starttime}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isLoading}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 ${buttonColor}`}
          >
            {isLoading ? "Processing..." : isAccept ? "Accept" : "Decline"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
