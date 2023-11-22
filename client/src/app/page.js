"use client";
import React, { useState, useEffect } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaignType, setCampaignType] = useState("Active");
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [passedCampaigns, setPassedCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    const data = await getCampaigns();

    const activeCampaigns = data.filter(
      (campaign) => campaign.deadline > Date.now()
    );
    const passedCampaigns = data.filter(
      (campaign) => campaign.deadline < Date.now()
    );
    setActiveCampaigns(activeCampaigns);
    setPassedCampaigns(passedCampaigns);
    setIsLoading(false);
  };

  const handleCampaignType = (type) => {
    setCampaignType(type);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <div className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        <li className="me-2">
          <button
            className={`${
              campaignType === "Active"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            } inline-block p-4 rounded-t-lg cursor-pointer`}
            onClick={() => handleCampaignType("Active")}
          >
            Active Campaigns
          </button>
        </li>
        <li className="me-2">
          <button
            className={`${
              campaignType === "Past"
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            } inline-block p-4 rounded-t-lg cursor-pointer`}
            onClick={() => handleCampaignType("Past")}
          >
            Past Campaigns
          </button>
        </li>
      </ul>
      <DisplayCampaigns
        title={`${campaignType} Campaigns`}
        isLoading={isLoading}
        campaigns={
          campaignType === "Active" ? activeCampaigns : passedCampaigns
        }
      />
    </div>
  );
};

export default Home;
