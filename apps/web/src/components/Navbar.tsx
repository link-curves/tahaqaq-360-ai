import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, User } from "lucide-react";
import { TahqaqLogo } from "./ui/TahaqaqLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "الرئيسية", href: "#hero" },
    { name: "الميزات", href: "#features" },
    { name: "فحص الحقائق", href: "#fact-checking" },
    { name: "التعليم", href: "#education" },
    { name: "المدونة", href: "#blog" },
    { name: "الفعاليات", href: "#events" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-transparent"
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 lg:space-x-3 space-x-reverse flex-shrink-0">
            <TahqaqLogo
              className="transition-all duration-300"
              width={isScrolled ? 32 : 40}
              height={isScrolled ? 32 : 40}
            />
            <div className="flex flex-col">
              <span
                className={`font-bold font-['Cairo'] transition-all duration-300 ${
                  isScrolled ? "text-gray-900 text-lg" : "text-white text-xl"
                }`}
              >
                تحقق 360
              </span>
              <span
                className={`text-xs font-['Cairo'] transition-all duration-300 hidden sm:block ${
                  isScrolled ? "text-red-600" : "text-red-300"
                }`}
              >
                فحص الحقائق بالذكاء الاصطناعي
              </span>
            </div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 space-x-reverse">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`font-['Cairo'] font q-medium transition-all duration-300 hover:scale-105 relative group px-2 py-1 whitespace-nowrap ${
                  isScrolled
                    ? "text-gray-700 hover:text-red-600"
                    : "text-white hover:text-red-300"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-red-600" : "bg-red-300"
                  }`}
                ></span>
              </button>
            ))}
          </div>{" "}
          {/* Login Button and Mobile Menu */}
          <div className="flex items-center space-x-2 lg:space-x-4 space-x-reverse">
            {/* Desktop Login Button */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                className={`font-['Cairo'] transition-all duration-300 px-3 py-2 ${
                  isScrolled
                    ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    : "text-white hover:text-red-300 hover:bg-white/10"
                }`}
              >
                <User className="h-4 w-4 ml-2" />
                حسابي
              </Button>
              <Button
                size="sm"
                className={`font-['Cairo'] font-semibold transition-all duration-300 transform hover:scale-105 px-4 py-2 ${
                  isScrolled
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "bg-white text-red-600 hover:bg-gray-100 shadow-lg"
                }`}
              >
                <LogIn className="h-4 w-4 ml-2" />
                تسجيل الدخول
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 mt-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-right px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-['Cairo'] font-medium"
              >
                {item.name}
              </button>
            ))}

            {/* Mobile Login Buttons */}
            <div className="px-4 py-2 space-y-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-end font-['Cairo'] text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <User className="h-4 w-4 ml-2" />
                حسابي
              </Button>
              <Button className="w-full justify-end bg-red-600 hover:bg-red-700 text-white font-['Cairo'] font-semibold">
                <LogIn className="h-4 w-4 ml-2" />
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
