import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  // console.log(currentUser);
  if (!currentUser) {
    return redirect("/sign-in");
  }

  return (
    <main className="flex h-screen">
      {/* <Sidebar fullName={currentUser.fullName} avatar={currentUser.avatar} /> */}
      {/* <Sidebar {..currentUser}/> another way to write */}
      {currentUser && (
        <Sidebar
          fullname={currentUser.fullname}
          avatar={currentUser.avatar}
          email={currentUser.email}
        />
      )}
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} /> <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default layout;
