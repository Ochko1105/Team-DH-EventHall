/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { ButtonOfNav } from "./ButtonOfNav";

import {
  Building,
  ChevronDown,
  Home,
  LayoutDashboard,
  Music,
  Search,
  UserIcon,
  Users,
  X,
} from "lucide-react";

import { BottomNavButton } from "./BottomNavButton";
import { AuthForm } from "./AuthForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Logo } from "./Logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchFunction from "./Searchbar";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

export const Header = () => {
  const [isPhoneSearchOpen, setIsPhoneSearchOpen] = useState(false);
  const router = useRouter();
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [hasMounted, setHasMounted] = useState(false);

  const styleDesktop =
    "pl-10 h-10 rounded-[20px] bg-neutral-800 border-none w-full text-sm";
  const styleMobile =
    "w-full pl-10 h-9 rounded-[20px] bg-neutral-800 border-none text-white text-sm justify-center ";

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      setHasMounted(true);
    };
    checkAuth();
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      {/* DESKTOP HEADER */}
      <div className="hidden lg:flex text-white w-full h-20 items-center justify-between bg-black/50 backdrop-blur-sm px-10">
        <div className="flex-1 flex justify-start">
          <Logo />
        </div>

        <div className="flex items-center gap-10 font-bold ">
          <ButtonOfNav href="/home" text="Home" />
          <ButtonOfNav href="/event-halls" text="Event Halls" />
          <ButtonOfNav href="/performers" text="Performers" />
          <ButtonOfNav href="/host" text="Hosts" />
          <ButtonOfNav href="/dashboard" text="Dashboard" />
        </div>

        <div className="flex-1 flex justify-end items-center">
          <div className="flex items-center w-full max-w-[220px]">
            <Search className="mr-[-36] w-5 z-10 text-neutral-500" />
            <SearchFunction styleDesktop={styleDesktop} />
          </div>
          {hasMounted && (
            <>
              {isLoggedIn ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-2 rounded-full bg-neutral-900 transition-colors h-10 px-4 flex items-center gap-2 w-40">
                      <UserIcon className="h-4 text-neutral-400" />
                      <span className="font-medium text-sm truncate">
                        {user?.name || "User"}
                      </span>
                      <ChevronDown className="h-4 text-neutral-500" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-60 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 
             text-white rounded-xl shadow-2xl p-2"
                  >
                    {/* User Section */}
                    {user?.name && (
                      <div className="px-4 py-3 border-b border-neutral-800/60">
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-neutral-400">
                          {user.email}
                        </div>
                      </div>
                    )}

                    {/* Menu Links */}
                    <div className="py-2">
                      <button
                        onClick={() => router.push("/editProfile")}
                        className="w-full text-left px-4 py-2.5 text-sm rounded-lg 
                 hover:bg-neutral-800/60 transition-all duration-150"
                      >
                        👤 Миний профайл
                      </button>

                      <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full text-left px-4 py-2.5 text-sm rounded-lg 
                 hover:bg-neutral-800/60 transition-all duration-150"
                      >
                        📦 Миний захиалгууд
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-800/60 my-1" />

                    {/* Logout */}
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2.5 text-sm rounded-lg text-red-400 
               hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
                    >
                      🚪 Гарах
                    </button>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthView("login");
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-transparent rounded-md h-10 px-4 text-sm"
                  >
                    Нэвтрэх
                  </button>
                  <button
                    onClick={() => {
                      setAuthView("signup");
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-blue-600 rounded-md px-4 h-10 text-sm"
                  >
                    Бүртгүүлэх
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 flex lg:hidden h-16 w-full items-center bg-black/50 px-4 text-white backdrop-blur-sm">
        {!isPhoneSearchOpen ? (
          <Logo />
        ) : (
          <div
            onClick={() => setIsPhoneSearchOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </div>
        )}

        <div className="flex-1 mx-4">
          {isPhoneSearchOpen && (
            <div className="flex items-center justify-center">
              <Search className="mr-[-36] w-5 z-10 text-neutral-500" />
              <SearchFunction styleDesktop={styleMobile} />
            </div>
          )}
        </div>

        {!isPhoneSearchOpen ? (
          <div className="flex items-center gap-3">
            <Search
              className="w-6 h-6 text-neutral-300 hover:text-white"
              onClick={() => setIsPhoneSearchOpen(true)}
            />
            {hasMounted && (
              <>
                {isLoggedIn ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-neutral-800 transition-colors">
                        <UserIcon className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-60 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 
             text-white rounded-xl shadow-2xl p-2"
                    >
                      {/* User Section */}
                      {user?.name && (
                        <div className="px-4 py-3 border-b border-neutral-800/60">
                          <div className="font-semibold text-sm">
                            {user.name}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {user.email}
                          </div>
                        </div>
                      )}

                      {/* Menu Links */}
                      <div className="py-2">
                        <button
                          onClick={() => router.push("/editProfile")}
                          className="w-full text-left px-4 py-2.5 text-sm rounded-lg 
                 hover:bg-neutral-800/60 transition-all duration-150"
                        >
                          👤 Миний профайл
                        </button>

                        <button
                          onClick={() => router.push("/dashboard")}
                          className="w-full text-left px-4 py-2.5 text-sm rounded-lg 
                 hover:bg-neutral-800/60 transition-all duration-150"
                        >
                          📦 Миний захиалгууд
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-neutral-800/60 my-1" />

                      {/* Logout */}
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2.5 text-sm rounded-lg text-red-400 
               hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
                      >
                        🚪 Гарах
                      </button>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthView("login");
                        setIsAuthModalOpen(true);
                      }}
                      className="bg-transparent rounded-md h-9 px-3 text-xs"
                    >
                      Нэвтрэх
                    </button>
                    <button
                      onClick={() => {
                        setAuthView("signup");
                        setIsAuthModalOpen(true);
                      }}
                      className="bg-blue-600 rounded-md px-3 h-9 text-xs"
                    >
                      Бүртгүүлэх
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-black/50 backdrop-blur-sm lg:hidden">
        <BottomNavButton
          href="/home"
          label="Home"
          icon={<Home className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/event-halls"
          label="Halls"
          icon={<Building className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/performers"
          label="Performers"
          icon={<Music className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/host"
          label="Hosts"
          icon={<Users className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/dashboard"
          label="Dashboard"
          icon={<LayoutDashboard className="w-5 h-5" />}
        />
      </div>

      {/* AUTH MODAL (NO STRUCTURE BREAKING) */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md w-fit data-[state=open]:bg-black/60 data-[state=open]:backdrop-blur-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {authView === "login" ? "Log In" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <AuthForm
            view={authView}
            onViewChange={setAuthView}
            onLoginSuccess={(userData: any) => setUser(userData)}
          />
        </DialogContent>
      </Dialog>

      {/* LOGOUT MODAL (FIXED) */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent
          className="
      max-w-sm p-0 border-none shadow-xl rounded-2xl 
      bg-neutral-900/80 backdrop-blur-xl
      animate-in fade-in zoom-in-90 duration-200
    "
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Гарах</DialogTitle>
          </DialogHeader>

          <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-3 text-center">Гарах</h2>

            <p className="text-center text-neutral-400 mb-8 leading-relaxed">
              Та системээс гарах гэж байна. Үргэлжлүүлэх үү?
            </p>

            <div className="flex gap-4">
              {/* Cancel Button */}
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="
            w-full py-3 rounded-lg font-semibold
            bg-neutral-800 hover:bg-neutral-700
            transition-colors duration-200
          "
              >
                Үгүй
              </button>

              {/* Confirm Button */}
              <button
                onClick={confirmLogout}
                className="
            w-full py-3 rounded-lg font-semibold
            bg-blue-600 hover:bg-blue-700
            transition-colors duration-200
          "
              >
                Тийм
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
