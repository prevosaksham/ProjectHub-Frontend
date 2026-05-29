import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Section */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        
        {/* Header */}
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
          onMobileOpen={() => setMobileOpen(true)}
        />

        {/* Content Wrapper */}
        <div className="relative flex-1 overflow-hidden bg-[#F5F7FB] rounded-tl-[20px]">
          
          {/* Top Curve Effect */}
          <div className="absolute -top-8 left-0 h-8 w-8 bg-white rounded-br-[32px] z-10" />

          {/* Scrollable Page */}
          <main
            className="
              h-full
              overflow-y-auto
              overflow-x-hidden
              px-3
              py-4
              sm:px-4
              md:px-6
              md:py-5
              scrollbar-thin
            "
          >
            <div className="min-h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;