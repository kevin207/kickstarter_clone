/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { navlinks } from "../constants";
import { useStateContext } from "../context";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-[#2c2f32]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const router = useRouter();
  const { disconnect, address } = useStateContext();
  const [isActive, setIsActive] = useState("Dashboard");

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      {/* SIDEBAR LOGO */}
      <Link href="/">
        <Icon
          styles="w-[52px] h-[52px] bg-[#2c2f32]"
          imgUrl="/assets/logo.svg"
        />
      </Link>

      {/* SIDEBAR MENU AND LOGOUT */}
      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  router.push(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon
          styles="grayscale shadow-secondary hover:bg-[#2c2f32] hover:grayscale-0"
          imgUrl={"/assets/logout.svg"}
          handleClick={() => {
            disconnect();
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
