import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  function handleClick() {
    localStorage.removeItem("email");
    navigate("/");
  }

  return (
    <div className="bg-black text-white h-10">
      <div className="w-100 h-[100%] flex justify-center items-center">
        <ul className="flex justify-between w-1/3 h-[100%] items-center">
          <li className="hover:text-orange-600"><a href="/">{t("home")}</a></li>
          <li className="hover:text-orange-600"><a href="/watch">{t("watch")}</a></li>
          <li className="hover:text-orange-600">{t("price")}</li>
          <li className="hover:text-orange-600"><a href="/login">{t("profile")}</a></li>
          <li
            className={`hover:text-orange-600 ${localStorage.getItem("email") ? "block" : "hidden"}`}
            onClick={handleClick}
          >
            {t("exit")}
          </li>
          <select className="flex flex-col bg-black text-white">
            <option onClick={() => i18n.changeLanguage("ru")} className="hover:text-orange-600">🇷🇺 Русский</option>
            <option onClick={() => i18n.changeLanguage("en")} className="hover:text-orange-600">🇬🇧 English</option>
          </select>
        </ul>

      </div>
    </div>
  );
}

