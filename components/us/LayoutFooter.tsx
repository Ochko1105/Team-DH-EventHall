"use client";

import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export function LayoutFooter() {
  return (
    <footer className="w-full bg-black text-gray-200 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-3 lg:px-6 lg:py-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Social */}
          <div>
            <h2 className="text-lg font-semibold mb-4">EventLux</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              EventLux бол тансаг зэрэглэлийн арга хэмжээ зохион байгуулалтын
              таны итгэмжлэгдсэн платформ юм.
            </p>

            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Шуурхай холбоос</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="home" className="hover:text-white">
                  Нүүр
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Танхимууд
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Урлагийн тоглогчид
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Хөтлөгчид
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Хяналтын самбар
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Холбоо барих
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Манай үйлчилгээ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Танхим захиалга
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Урлагийн менежмент
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Арга хэмжээ төлөвлөлт
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Холбоо барих</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-blue-400" />
                +976 1234 5678
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-blue-400" />
                ochkoking@gmail.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-neutral-800 py-4 text-center text-sm text-gray-500">
        © 2025 EventLux. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
}
