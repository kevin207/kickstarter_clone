/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../../context";
import { useRouter } from "next/navigation";
import { CountBox, CustomButton, Loader } from "../../../components";
import {
  calculateBarPercentage,
  daysLeft,
  checkIfActive,
  checkIfTargetMet,
  formatDate,
} from "../../../utils";

const CampaignDetails = ({ params }) => {
  const router = useRouter();
  const [campaign, setCampaign] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [amount, setAmount] = useState("0.01");
  const [donators, setDonators] = useState([]);
  const { donate, getDonations, contract, address, getCampaign } =
    useStateContext();

  const remainingDays = daysLeft(campaign.deadline);
  const stillActive = checkIfActive(campaign.deadline);
  const targetMet = checkIfTargetMet(campaign.amountCollected, campaign.target);

  const fetchDonators = async () => {
    const data = await getDonations(params.id);
    setDonators(data);
    setIsFetching(false);
  };
  const getCampaignDetail = async () => {
    const data = await getCampaign(params.id);
    setCampaign(data);
    setIsFetching(false);
  };

  const handleDonate = async () => {
    try {
      setIsLoading(true);
      await donate(campaign.pId, amount);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      getCampaignDetail();
      fetchDonators();
    }
  }, [contract, address]);

  return (
    <div>
      {/* TRANSACTION LOADING */}
      {isLoading && <Loader />}

      {/* FETCH LOADING */}
      {isFetching ? (
        <img
          src="/assets/loader.svg"
          alt="loader"
          className="w-[100px] h-[100px] object-contain"
        />
      ) : (
        <>
          <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
            <div className="flex-1 flex-col">
              <div className="relative">
                {!targetMet && !stillActive && (
                  <div className="absolute bg-[rgba(0,0,0,0.5)] rounded-xl h-[100%] w-[100%] flex justify-center items-center">
                    <img
                      src={"/assets/failed.png"}
                      alt="fail"
                      className=" object-cover rounded-xl select-none "
                    />
                  </div>
                )}

                {targetMet && (
                  <div className="absolute bg-[rgba(0,0,0,0.5)] rounded-xl h-[100%] w-[100%] flex justify-center items-center">
                    <img
                      src={"/assets/success.png"}
                      alt="fail"
                      className=" object-cover rounded-xl select-none "
                    />
                  </div>
                )}

                <img
                  src={campaign.image}
                  alt="campaign"
                  className="w-full h-[410px] object-cover rounded-xl"
                />
              </div>

              <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
                <div
                  className="absolute h-full bg-[#4acd8d]"
                  style={{
                    width: `${calculateBarPercentage(
                      campaign.target,
                      campaign.amountCollected
                    )}%`,
                    maxWidth: "100%",
                  }}
                />
              </div>

              <p className="mt-4 text-sm font-epilogue text-white">
                Until {formatDate(campaign.deadline)}
              </p>
            </div>

            <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
              {stillActive ? (
                <CountBox title="Days Left" value={remainingDays} />
              ) : (
                <CountBox title="Finished" value={"-"} />
              )}

              <CountBox
                title={
                  calculateBarPercentage(
                    campaign.target,
                    campaign.amountCollected
                  ) < 100
                    ? `Raised of ${campaign.target}`
                    : `Pledged of ${campaign.target}`
                }
                value={campaign.amountCollected}
                pledged={
                  calculateBarPercentage(
                    campaign.target,
                    campaign.amountCollected
                  ) < 100
                    ? false
                    : true
                }
              />
              <CountBox title="Total Backers" value={donators.length} />
            </div>
          </div>

          <div className="mt-[40px] flex lg:flex-row flex-col gap-5 mb-8">
            <div className="flex-[2] flex flex-col gap-[40px]">
              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                  Creator
                </h4>

                <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                  <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                    <img
                      src="/assets/thirdweb.png"
                      alt="user"
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                      {campaign.owner || "Test"}
                    </h4>
                    <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                      {campaign.issuer}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                  Story
                </h4>

                <div className="mt-[20px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                    {campaign.description}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                  Donators
                </h4>

                <div className="mt-[20px] flex flex-col gap-4">
                  {donators.length > 0 ? (
                    donators.map((item, index) => (
                      <div
                        key={`${item.donator}-${index}`}
                        className="flex justify-between items-center gap-4"
                      >
                        <p className="font-epilogue font-normal text-[12px] text-[#b2b3bd] leading-[26px] break-ll">
                          {index + 1}. {item.donator}
                        </p>
                        <p className="font-epilogue font-normal text-[12px] text-[#808191] leading-[26px] break-ll">
                          {item.donation} ETH
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                      No donators yet. Be the first one!
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Fund
              </h4>

              <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                  Fund the campaign
                </p>
                <div className="mt-[30px]">
                  <input
                    disabled={!stillActive}
                    type="number"
                    placeholder="ETH 0.1"
                    step="0.01"
                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                    <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                      Back it because you believe in it.
                    </h4>
                    <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                      Support the project for no reward, just because it speaks
                      to you.
                    </p>
                  </div>

                  <CustomButton
                    disabled={!stillActive}
                    btnType="button"
                    title={stillActive ? "Fund Campaign" : "Campaign Finished"}
                    styles={
                      stillActive ? "w-full bg-[#8c6dfd]" : "w-full bg-[gray]"
                    }
                    handleClick={handleDonate}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignDetails;
