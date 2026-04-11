import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/ide" element={<Dashboard />} />
            </Route>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="*" element={<Signup />}>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App