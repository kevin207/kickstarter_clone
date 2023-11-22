"use client";
import React, { useState, useEffect } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

const Home = () => {
  const {
    isLoading,
    campaignType,
    setCampaignType,
    activeCampaigns,
    passedCampaigns,
  } = useStateContext();

  const handleCampaignType = (type) => {
    setCampaignType(type);
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        <li className="me-2">
          <button
            className={`${campaignType === "active"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } inline-block p-4 rounded-t-lg cursor-pointer`}
            onClick={() => handleCampaignType("active")}
          >
            Active Campaigns
          </button>
        </li>
        <li className="me-2">
          <button
            className={`${campaignType === "passed"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } inline-block p-4 rounded-t-lg cursor-pointer`}
            onClick={() => handleCampaignType("passed")}
          >
            Past Campaigns
          </button>
        </li>
      </ul>
      <DisplayCampaigns
        title="Active Campaigns"
        isLoading={isLoading}
        campaigns={
          campaignType === "active" ? activeCampaigns : passedCampaigns
        }
      />
    </div>
  );
};

export default Home;
