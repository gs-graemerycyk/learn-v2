"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  MessageCircle,
  Calendar,
  GraduationCap,
  Users,
  LifeBuoy,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Package, label: "Product" },
  { icon: MessageCircle, label: "Discussions" },
  { icon: Calendar, label: "Events" },
  { icon: GraduationCap, label: "Academy" },
  { icon: Users, label: "Groups" },
  { icon: LifeBuoy, label: "Support" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-[220px] flex-col bg-[#FDFEFF] border-r border-black/[0.04]">
      {/* Logo */}
      <div className="flex h-16 items-center px-7">
        <a href="/" className="flex items-center gap-2.5">
          <svg
            width="28"
            height="28"
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M132.151 192.669C132.366 170.641 126.781 152.727 119.677 152.657C112.573 152.588 106.639 170.39 106.424 192.418C106.208 214.446 111.793 232.361 118.897 232.43C126.002 232.499 131.935 214.698 132.151 192.669Z" fill="currentColor"/>
            <path d="M90.9432 187.666C103.035 169.252 108.023 151.162 102.084 147.263C96.1449 143.363 81.5286 155.13 69.4374 173.545C57.3456 191.959 52.3578 210.048 58.2966 213.948C64.2354 217.848 78.8514 206.081 90.9432 187.666Z" fill="currentColor"/>
            <path d="M58.9377 161.246C79.0662 152.293 93.0423 139.773 90.1545 133.281C87.2673 126.79 68.6097 128.786 48.4815 137.739C28.3534 146.692 14.3771 159.212 17.2645 165.704C20.1519 172.195 38.8098 170.2 58.9377 161.246Z" fill="currentColor"/>
            <path d="M87.7386 115.077C88.8195 108.055 72.045 99.6458 50.2722 96.2945C28.4987 92.9432 9.972 95.9192 8.89122 102.941C7.81044 109.963 24.5849 118.371 46.3581 121.723C68.1309 125.074 86.658 122.098 87.7386 115.077Z" fill="currentColor"/>
            <path d="M95.5566 98.3502C100.261 93.027 90.6942 76.8849 74.1873 62.2965C57.6807 47.7078 40.4853 40.197 35.7804 45.5205C31.0755 50.844 40.6428 66.9861 57.1497 81.5745C73.6566 96.1632 90.852 103.674 95.5566 98.3502Z" fill="currentColor"/>
            <path d="M111.129 88.5738C117.965 86.6394 118.644 67.8873 112.646 46.6902C106.648 25.493 96.2435 9.87745 89.4074 11.8119C82.5713 13.7463 81.8921 32.4981 87.89 53.6955C93.8882 74.8923 104.293 90.5082 111.129 88.5738Z" fill="currentColor"/>
            <path d="M153.401 54.3552C159.816 33.2805 159.507 14.5187 152.71 12.4499C145.913 10.381 135.203 25.7883 128.788 46.8633C122.373 67.9377 122.682 86.6997 129.479 88.7685C136.276 90.8373 146.986 75.4302 153.401 54.3552Z" fill="currentColor"/>
            <path d="M183.61 82.8318C200.398 68.5686 210.28 52.617 205.679 47.2026C201.079 41.7882 183.741 48.9618 166.952 63.2244C150.163 77.4876 140.282 93.4395 144.882 98.8539C149.482 104.268 166.821 97.095 183.61 82.8318Z" fill="currentColor"/>
            <path d="M193.594 123.129C215.429 120.208 232.366 112.131 231.423 105.089C230.482 98.0477 212.017 94.7075 190.182 97.6283C168.347 100.549 151.41 108.626 152.352 115.668C153.294 122.709 171.758 126.05 193.594 123.129Z" fill="currentColor"/>
            <path d="M221.761 167.717C224.776 161.284 211.05 148.49 191.102 139.142C171.155 129.793 152.54 127.43 149.525 133.863C146.51 140.297 160.236 153.09 180.184 162.439C200.132 171.787 218.747 174.15 221.761 167.717Z" fill="currentColor"/>
            <path d="M179.8 215.184C185.814 211.402 181.184 193.218 169.458 174.569C157.732 155.919 143.351 143.867 137.336 147.649C131.322 151.43 135.952 169.614 147.678 188.264C159.404 206.913 173.786 218.966 179.8 215.184Z" fill="currentColor"/>
          </svg>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Orbit
          </span>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                  item.active
                    ? "bg-black/[0.05] text-foreground"
                    : "text-black/40 hover:text-black/60 hover:bg-black/[0.02]"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile — bottom */}
      <div className="px-4 pb-5 flex flex-col gap-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/[0.02]">
          <Avatar className="h-8 w-8 shrink-0 ring-1 ring-black/[0.06]">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face" />
            <AvatarFallback className="text-xs">SN</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-[13.5px] font-medium text-foreground truncate">Sarah Nakamura</div>
            <div className="text-[12px] text-black/35 truncate">Member</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
