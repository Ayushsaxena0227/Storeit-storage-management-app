import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.action";
// here it is a not a client compo its a server as we havent used any event like onclick..so her ewe ll use react 19 help (form)(a server side functionality)
const Header = () => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
