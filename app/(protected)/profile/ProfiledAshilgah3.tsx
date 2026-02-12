"use client";

import RequestCard from "./ProfiledAshiglah2";

export default function RequestsList({
  requests,
  onActionClick,
}: {
  requests: any;
  onActionClick: any;
}) {
  return (
    <div className="space-y-3">
      {requests.map((request: any) => (
        <RequestCard
          key={request.id}
          request={request}
          onActionClick={onActionClick}
        />
      ))}
    </div>
  );
}
