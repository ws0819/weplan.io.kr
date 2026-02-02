import { RouterProvider } from "react-router"
import { router } from "./route/route"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastContainer } from "react-toastify"
import { HelmetProvider } from "@dr.pogodin/react-helmet"

function App() {
  const queryClient = new QueryClient()
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App
