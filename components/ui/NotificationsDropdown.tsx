"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, TrendingUp, MessageSquare, CheckCircle2, CloudRain, ArrowRight } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "offer" | "price" | "payment" | "weather";
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "New Buyer Offer",
    description: "FreshFoods offered ₹26/kg for 1,000 kg Tomato.",
    time: "10 mins ago",
    read: false,
    type: "offer",
    link: "/farmer/offers",
  },
  {
    id: "notif_2",
    title: "Mandi Price Alert",
    description: "Vijayawada tomato market price rose by ₹2/kg today.",
    time: "2 hours ago",
    read: false,
    type: "price",
    link: "/farmer/markets",
  },
  {
    id: "notif_3",
    title: "Bank Payment Confirmed",
    description: "₹24,000 sent directly to your bank account for Chilli sale.",
    time: "Yesterday",
    read: true,
    type: "payment",
    link: "/farmer/transactions",
  },
  {
    id: "notif_4",
    title: "Local Weather Update",
    description: "Light rain expected in Guntur district tomorrow afternoon.",
    time: "1 day ago",
    read: true,
    type: "weather",
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "offer":
        return <MessageSquare className="w-4 h-4 text-[#D9A441]" />;
      case "price":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "payment":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "weather":
        return <CloudRain className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl p-2 text-km-neutral-500 hover:text-km-neutral-900 hover:bg-km-neutral-100 transition-all duration-200"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9A441] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D9A441]" />
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-km-neutral-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 border-b border-km-neutral-100 flex items-center justify-between bg-km-neutral-50/50">
            <div className="flex items-center gap-2">
              <span className="font-fraunces font-bold text-base text-km-neutral-900">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D9A441] text-[#0E2318]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#D9A441] hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-km-neutral-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3.5 hover:bg-amber-50/30 transition-colors cursor-pointer flex items-start gap-3 ${
                  !item.read ? "bg-amber-50/15 font-medium" : "bg-white"
                }`}
              >
                <div className="mt-0.5 w-8 h-8 rounded-xl bg-km-neutral-100 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-km-neutral-900 truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-km-neutral-400 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-km-neutral-600 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  {item.link && (
                    <Link
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D9A441] hover:underline mt-1.5"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-[#D9A441] shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-km-neutral-100 bg-km-neutral-50 text-center">
            <span className="text-[11px] text-km-neutral-400 font-medium">
              Real-time updates for prices, buyer bids, and payments
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
