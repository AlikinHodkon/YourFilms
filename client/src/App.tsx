import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Main from "./pages/Main.tsx";
import Watch from "./pages/Watch.tsx";
import Profile from "./pages/Profile.tsx";
import Login from "./pages/Login.tsx";

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
            path: "/profile",
            element: <Profile />
        },
        {
            path: "/login",
            element: <Login />
        }
    ])
  return (
      <div>
        <RouterProvider router={router} />
      </div>
  )
}

export default App
