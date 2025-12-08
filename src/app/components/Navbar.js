'use client';

import { useRouter, useParams, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import LanguageButton from "./LanguageButton";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();
  const t = useTranslation(locale);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push(`/${locale}/login`);
    setMenuOpen(false); // close menu on logout
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-gray-900 text-white shadow-md px-10 sm:px-8 py-2 z-50 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className=" flex justify-between  font-poppins items-start font-bold ">
                  <Image src="/images/logo.png" height="80" width="80" alt="this is our logo" priority />
               
                </div>
        

          {/* Hamburger for small screens */}
          <div className="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Inline menu for large screens */}
          <div className="hidden sm:flex items-center gap-4">
            <LanguageButton />
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center gap-6 z-[100]">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X size={32} />
          </button>
          <LanguageButton />
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded bg-red-500 hover:bg-red-600 transition text-lg"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
