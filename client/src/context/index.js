"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import {
  useAddress,
  useContract,
  useDisconnect,
  useContractWrite,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [campaignType, setCampaignType] = useState("Active");
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [passedCampaigns, setPassedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const address = useAddress();
  const disconnect = useDisconnect();

  const { contract } = useContract(
    "0x7fC790F9CbE3Cd2Ff486607265E1664Ba484B77E"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  // const connect = useMetamask();
  const connect = () => {
    return (
      <ConnectWallet
        className="wallet"
        modalTitle={"Connect Wallet"}
        switchToActiveChain={true}
        modalSize={"compact"}
        welcomeScreen={{}}
      />
    );
  };

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, 
          form.title,
          form.issuer, 
          form.description,
          form.target,
          new Date(form.deadline).getTime().split(' ').slice(0, -3).join(' '), 
          form.image,
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      issuer: campaign.issuer,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaings;
  };

  const getCampaign = async (pId) => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.pId === parseInt(pId)
    );

    return filteredCampaigns[0];
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const claimFunds = async (pId) => {
    const data = await contract.call("finalizeCampaign", [pId]);
    return data;
  };

  const refetchCampaigns = async () => {
    const data = await getCampaigns();
    const activeCampaigns = data.filter((campaign) => campaign.deadline > Date.now());
    const passedCampaigns = data.filter((campaign) => campaign.deadline < Date.now());

    setActiveCampaigns(activeCampaigns);
    setPassedCampaigns(passedCampaigns);
  };

  const states = {
    address,
    activeCampaigns,
    setActiveCampaigns,
    passedCampaigns,
    setPassedCampaigns,
    campaignType,
    setCampaignType,
    isLoading,
    setIsLoading,
    contract,
    connect,
    disconnect,
    createCampaign: publishCampaign,
    getCampaigns,
    getCampaign,
    getUserCampaigns,
    donate,
    getDonations,
    claimFunds,
    refetchCampaigns,
  }

  // Get all campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      const data = await getCampaigns();
      const activeCampaigns = data.filter((campaign) => campaign.deadline > Date.now());
      const passedCampaigns = data.filter((campaign) => campaign.deadline < Date.now());

      setActiveCampaigns(activeCampaigns);
      setPassedCampaigns(passedCampaigns);
      setIsLoading(false);
    };

    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <StateContext.Provider
      value={states}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
