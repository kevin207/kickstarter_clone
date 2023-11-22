/* eslint-disable @next/next/no-img-element */
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./FundCard";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const router = useRouter();

  const handleNavigate = (campaign) => {
    router.push(`/campaign-details/${campaign.pId}`);
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {/* {title} ({campaigns.length}) */}
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src="/assets/loader.svg"
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            There aren&apos;t any campaigns yet.
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={uuidv4()}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
