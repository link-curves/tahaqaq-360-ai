import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  Send,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TahqaqLogo } from "./ui/TahaqaqLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "الرئيسية", href: "/", isRoute: true },
    { name: "فحص الحقائق", href: "/fact-checks", isRoute: true },
    { name: "الفعاليات", href: "/events", isRoute: true },
    { name: "الدورات", href: "/learning", isRoute: true },
    ...(isAuthenticated
      ? [{ name: "دوراتي", href: "/my-courses", isRoute: true }]
      : []),
    { name: "الأبحاث", href: "/research", isRoute: true },
    { name: "المدونة", href: "/blog", isRoute: true },
    { name: "الميزات", href: "#features", isRoute: false },
    { name: "التعليم", href: "#education", isRoute: false },
  ];

  const scrollToSection = (href: string) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to home after logout
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  console.log("User in Navbar:", user, isAuthenticated);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-200/80"
          : "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100/50"
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="flex justify-between items-center h-16 xl:h-20">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 xl:space-x-3 space-x-reverse flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <TahqaqLogo
              className="transition-all duration-300"
              width={isScrolled ? 32 : 40}
              height={isScrolled ? 32 : 40}
            />
            <div className="flex flex-col">
              <span
                className={`font-bold font-['Cairo'] transition-all duration-300 text-gray-900 ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}
              >
                تحقق 360
              </span>
              <span className="text-xs font-['Cairo'] transition-all duration-300 hidden sm:block text-red-600">
                فحص الحقائق بالذكاء الاصطناعي
              </span>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6 2xl:space-x-8 space-x-reverse">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="font-['Cairo'] font-medium transition-all duration-300 hover:scale-105 relative group px-2 py-1 whitespace-nowrap text-gray-700 hover:text-red-600"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-red-600"></span>
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="font-['Cairo'] font-medium transition-all duration-300 hover:scale-105 relative group px-2 py-1 whitespace-nowrap text-gray-700 hover:text-red-600"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-red-600"></span>
                </button>
              )
            )}
          </div>{" "}
          {/* Login Button and Mobile Menu */}
          <div className="flex items-center space-x-2 xl:space-x-4 space-x-reverse">
            {/* Desktop Authentication */}
            <div className="hidden xl:flex items-center space-x-2 2xl:space-x-3 space-x-reverse">
              {isAuthenticated && user ? (
                // Authenticated user dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:bg-gray-100 hover:ring-2 hover:ring-red-200 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="bg-red-600 text-white text-sm font-semibold">
                          {getUserInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    align="start"
                    alignOffset={0}
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-3 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-md mb-1">
                      <Avatar className="h-10 w-10 ring-2 ring-red-200">
                        <AvatarImage
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="bg-red-600 text-white text-sm font-semibold">
                          {getUserInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="w-[160px] truncate text-xs text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/submit")}>
                      <Send className="mr-2 h-4 w-4" />
                      <span>إرسال محتوى</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/my-submissions")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>طلباتي</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-courses")}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>دوراتي</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>الإعدادات</span>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>لوحة الإدارة</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Not authenticated - show login button
                <Button
                  onClick={() => navigate("/login")}
                  size="sm"
                  className="font-['Cairo'] font-semibold transition-all duration-300 transform hover:scale-105 px-4 py-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4 ml-2" />
                  تسجيل الدخول
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 rounded-lg transition-all duration-300 text-gray-700 hover:bg-gray-100"
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
          className={`xl:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 mt-2">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-right px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-['Cairo'] font-medium"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-right px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-['Cairo'] font-medium"
                >
                  {item.name}
                </button>
              )
            )}

            {/* Mobile Authentication */}
            <div className="px-4 py-2 space-y-2 border-t border-gray-200">
              {isAuthenticated && user ? (
                // Authenticated user - mobile
                <>
                  <div className="px-2w py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="bg-red-600 text-white">
                          {getUserInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-end font-['Cairo'] text-gray-700 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 ml-2" />
                    الملف الشخصي
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-end font-['Cairo'] text-gray-700 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      navigate("/my-courses");
                      setIsOpen(false);
                    }}
                  >
                    <GraduationCap className="h-4 w-4 ml-2" />
                    دوراتي
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-end font-['Cairo'] text-gray-700 hover:text-red-600 hover:bg-red-50"
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    الإعدادات
                  </Button>
                  {user.role === "admin" && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/admin");
                        setIsOpen(false);
                      }}
                      className="w-full justify-end font-['Cairo'] text-gray-700 hover:text-red-600 hover:bg-red-50"
                    >
                      <Settings className="h-4 w-4 ml-2" />
                      لوحة الإدارة
                    </Button>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-end font-['Cairo'] text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                // Not authenticated - mobile
                <Button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full justify-end bg-red-600 hover:bg-red-700 text-white font-['Cairo'] font-semibold"
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4 ml-2" />
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
