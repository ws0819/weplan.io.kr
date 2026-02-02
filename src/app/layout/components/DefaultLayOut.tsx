import { Outlet } from "react-router";
import Header from "../Header";
import Footer from "../Footer";

function DefaultLayOut() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      <main className="mobile-view  page-layout sm:web-view">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default DefaultLayOut