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
      <div className="w-full h-full flex justify-center items-center">
        <ul className="flex justify-between w-1/2 h-full items-center">
          <li className="hover:text-orange-600"><a href="/">{t("home")}</a></li>
          <li className="hover:text-orange-600"><a href="/watch">{t("watch")}</a></li>
          {localStorage.getItem("email") === "admin" && 
            (
              <li className="hover:text-orange-600"><a href="/genres">{t("genres")}</a></li>
            )
          }
          {localStorage.getItem("email") === "admin" && 
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
          <select className="bg-black text-white">
            <option onClick={() => i18n.changeLanguage("ru")} className="hover:text-orange-600">🇷🇺 Русский</option>
            <option onClick={() => i18n.changeLanguage("en")} className="hover:text-orange-600">🇬🇧 English</option>
          </select>
        </ul>
      </div>
    </div>
  );
}
