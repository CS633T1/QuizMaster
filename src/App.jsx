import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import TheHomePage from "./TheHomePage";

const router = createBrowserRouter([
  { path: "/", element: <TheHomePage /> },
  { path: "/log-in", element: <LogIn /> },
  { path: "/sign-up", element: <SignUp /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
