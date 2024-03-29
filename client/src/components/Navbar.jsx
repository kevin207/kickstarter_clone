import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStateContext } from "../context";
import { navlinks } from "../constants";

const Navbar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* SEARCH BAR */}
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 h-[52px] text-3xl text-green-400 font-bold">
        KickStarter Clone
      </div>

      {/* CONNECT WALLET + ADD CAMPAIGN */}
      <div className="sm:flex hidden flex-row justify-end gap-4">
        {/* NEW CONNECT BUTTON */}
        {connect()}

        <Link href="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src="/assets/thirdweb.png"
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* SMALL SCREEN NAAVIGATION */}
      <div className="sm:hidden flex justify-between items-center relative">
        <Link
          href="/"
          className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer"
        >
          <img
            src={"/assets/logo.svg"}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </Link>

        <img
          src={"/assets/menu.svg"}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  router.push(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            {/* NEW CONNECT BUTTON */}
            {connect()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
