import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TahqaqLogo } from "./ui/TahaqaqLogo";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer
      className="bg-gradient-to-br from-gray-900 via-slate-900 to-red-950 text-white py-20"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Company Info - Takes more space */}
          <div className="lg:col-span-6">
            {" "}
            {/* Logo and Brand */}
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <TahqaqLogo className="ml-4" width={40} height={40} />
                <div>
                  <h2 className="text-3xl font-bold font-['Cairo'] text-white">
                    تحقق 360
                  </h2>
                  <p className="text-red-300 text-sm font-['Cairo'] mt-1">
                    منصة فحص الحقائق بالذكاء الاصطناعي
                  </p>
                </div>
              </div>
            </div>
            {/* Description */}
            <p className="text-gray-300 mb-8 font-['Cairo'] leading-relaxed text-lg max-w-lg">
              نمكن الأفراد والمؤسسات بأدوات فحص الحقائق المدعومة بالذكاء
              الاصطناعي والتعليم الشامل لمحو الأمية الإعلامية لمكافحة المعلومات
              المضللة في عصرنا الرقمي
            </p>
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300 font-['Cairo']">
                <Mail className="h-5 w-5 ml-4 text-red-400 flex-shrink-0" />
                <span className="text-base">info@tahaqaq360.com</span>
              </div>
              <div className="flex items-center text-gray-300 font-['Cairo']">
                <Phone className="h-5 w-5 ml-4 text-red-400 flex-shrink-0" />
                <span className="text-base">+971 4 123 4567</span>
              </div>
              <div className="flex items-center text-gray-300 font-['Cairo']">
                <MapPin className="h-5 w-5 ml-4 text-red-400 flex-shrink-0" />
                <span className="text-base">دبي، الإمارات العربية المتحدة</span>
              </div>
            </div>{" "}
            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/Tahaqaq.lb"
                className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-300 p-3 rounded-lg"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/Tahaqaq360/"
                className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-300 p-3 rounded-lg"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/tahaqaq360/"
                className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-300 p-3 rounded-lg"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold mb-6 font-['Cairo'] text-white border-b border-red-600 pb-2">
              روابط سريعة
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/fact-checks"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  فحص الحقائق
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  الفعاليات وورش العمل
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  الدورات التعليمية
                </Link>
              </li>
              <li>
                <Link
                  to="/research"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  الأبحاث والمقالات
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#features")}
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform text-right"
                >
                  ميزات المنصة
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold mb-6 font-['Cairo'] text-white border-b border-red-600 pb-2">
              الدعم والمساعدة
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  مركز المساعدة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  واجهة برمجة التطبيقات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  دليل المطورين
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-base block hover:translate-x-2 transform"
                >
                  التواصل معنا
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-400 font-['Cairo'] text-center lg:text-right">
              © 2025 تحقق 360. جميع الحقوق محفوظة. | بناء مستقبل أكثر وعياً
              بالمعلومات
            </p>
            <div className="flex space-x-8 space-x-reverse">
              <a
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-sm"
              >
                سياسة الخصوصية
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-sm"
              >
                شروط الاستخدام
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors duration-300 font-['Cairo'] text-sm"
              >
                بيان إمكانية الوصول
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
