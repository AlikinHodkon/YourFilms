import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Main from "./pages/Main.tsx";
import Watch from "./pages/Watch.tsx";
import Profile from "./pages/Profile.tsx";
import Login from "./pages/Login.tsx";
import FilmData from "./pages/FilmData.tsx";
import Admin from "./pages/Admin.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Main />
        },
        {
            path: "/watch",
            element: <Watch />
        },
        {
            path: "/watch/:id",
            element: <FilmData />
        },
        {
            path: "/profile",
            element: <Profile />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/admin",
            element: <Admin />
        }
    ])
  return (
      <div>
        <RouterProvider router={router} />
      </div>
  )
}

export default App
