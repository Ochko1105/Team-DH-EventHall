/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export default function SearchFunction({
  styleDesktop,
}: {
  styleDesktop?: string;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!searchValue) {
      setResults(null);
      return;
    }

    const timeout = setTimeout(() => handleSearch(), 300);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ searchValue }),
      });
      const data = await res.json();
      setResults(data);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const ResultItem = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      className="cursor-pointer px-3 py-2 rounded-md hover:bg-neutral-800 transition-colors"
    >
      {children}
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <PopoverTrigger
        onClick={() => {
          setIsOpen(true);
          setFirstOpen(true);
        }}
      >
        <Input
          type="text"
          placeholder="Эвэнт, дуучин, хөтлөгч..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`${styleDesktop} border-neutral-600 bg-neutral-900 text-white w-54`}
        />
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-[300px] bg-neutral-900 border border-neutral-700 text-white shadow-none rounded-lg p-2 z-1001"
      >
        {!searchValue && firstOpen && (
          <p className="text-gray-400 text-center text-sm font-light py-3">
            Та хүссэн зүйлээ хайгаарай ✨
          </p>
        )}

        {loading && (
          <p className="text-gray-400 text-center text-sm font-light py-3">
            Хайж байна...
          </p>
        )}

        {results && !loading && searchValue && (
          <div className="space-y-1 max-h-80 overflow-auto">
            {/* Event Halls */}
            {results?.halls?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-400 mt-2 mb-1 ml-3">
                  🏛 Event Halls
                </h3>
                <div className="space-y-1">
                  {results.halls.map((hall: any) => (
                    <ResultItem
                      key={hall.id}
                      onClick={() => router.push(`/event-halls/${hall.id}`)}
                    >
                      <div className="flex flex-col text-sm">
                        <span>{hall.name}</span>
                        <p className="text-neutral-500 text-xs">
                          {hall.location}
                        </p>
                      </div>
                    </ResultItem>
                  ))}
                </div>
              </div>
            )}

            {/* Performers */}
            {results?.performers?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mt-2 mb-1 ml-3">
                  🎤 Performers
                </h3>
                <div className="space-y-1">
                  {results.performers.map((p: any) => (
                    <ResultItem key={p.id}>
                      <span className="text-sm">{p.name}</span>
                      <p className="text-gray-500 text-xs">{p.genre}</p>
                    </ResultItem>
                  ))}
                </div>
              </div>
            )}

            {/* Hosts */}
            {results?.hosts?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mt-2 mb-1 ml-3">
                  🎙 Hosts
                </h3>
                <div className="space-y-1">
                  {results.hosts.map((h: any) => (
                    <ResultItem key={h.id}>
                      <span className="text-sm">{h.name}</span>
                      <p className="text-gray-500 text-xs">{h.contact_phone}</p>
                    </ResultItem>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results?.halls?.length === 0 &&
              results?.performers?.length === 0 &&
              results?.hosts?.length === 0 && (
                <p className="text-gray-500 text-center text-sm py-3 font-light">
                  Илэрц олдсонгүй.
                </p>
              )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
