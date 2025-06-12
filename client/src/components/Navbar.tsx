import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Navbar() {
  const navigate = useNavigate();
    const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Убираем localStorage

  // ✅ Проверка статуса админа при загрузке Navbar
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin-status", { withCredentials: true })
    .then((response) => {
      setIsAdmin(response.data.isAdmin); // ✅ Обновляем состояние
    })
    .catch(() => {
      setIsAdmin(false);
    });
  }, []);

  function handleClick() {
    axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true })
    .then(() => {
      localStorage.removeItem("email");
      setIsAdmin(false); // ✅ Очистка состояния админа
      navigate("/");
    })
    .catch(err => console.error("Ошибка выхода:", err));
  }

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng )
    setCurrentLanguage(lng);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }

    const handleStorageChange = (event: {key: string, newValue: string}) => {
      if (event.key === 'i18nextLng') {
        setCurrentLanguage(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [i18n]);

  return (
    <div className="bg-black text-white h-10">
      <div className="w-full h-full flex justify-center items-center">
        <ul className="flex justify-between w-1/2 h-full items-center">
          <li className="hover:text-orange-600"><a href="/">{t("home")}</a></li>
          <li className="hover:text-orange-600"><a href="/watch">{t("watch")}</a></li>
          {isAdmin &&
            (
              <li className="hover:text-orange-600"><a href="/genres">{t("genres")}</a></li>
            )
          }
          {isAdmin &&
            (
              <li className="hover:text-orange-600"><a href="/directors">{t("directors")}</a></li>
            )
          }
          <li className="hover:text-orange-600"><a href="/login">{t("profile")}</a></li>
          <li
            className={`hover:text-orange-600 ${localStorage.getItem("email") ? "block" : "hidden"}`}
            onClick={handleClick}
          >
            {t("exit")}
          </li>
          <li>
            <select
              className="bg-black text-white"
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="ru" className="hover:text-orange-600">🇷🇺 Русский</option>
              <option value="en" className="hover:text-orange-600">🇬🇧 English</option>
            </select>
          </li>
        </ul>
      </div>
    </div>
  );
}
