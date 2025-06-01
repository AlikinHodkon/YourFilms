import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./pages/Main.tsx";
import Watch from "./pages/Watch.tsx";
import Profile from "./pages/Profile.tsx";
import Login from "./pages/Login.tsx";
import FilmData from "./pages/FilmData.tsx";
import Admin from "./pages/Admin.tsx";
import Registration from "./pages/Registration.tsx";
import { useTranslation } from "react-i18next";
import "./i18.ts"; // Подключаем переводы

function App() {
    const { t } = useTranslation(); // Убеждаемся, что i18n работает

    const router = createBrowserRouter([
        { path: "/", element: <Main /> },
        { path: "/watch", element: <Watch /> },
        { path: "/watch/:id", element: <FilmData /> },
        { path: "/profile", element: <Profile /> },
        { path: "/login", element: <Login /> },
        { path: "/registration", element: <Registration /> },
        { path: "/admin", element: <Admin /> }
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
