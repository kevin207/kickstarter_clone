// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string issuer;
        string description;
        bool claimed;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }
    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _issuer,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.issuer = _issuer;
        campaign.description = _description;
        campaign.claimed = false;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        // CAN ONLY DONATE WHEN DEADLINE IS NOT MET
        if (block.timestamp < campaign.deadline) {
            campaign.donators.push(msg.sender);
            campaign.donations.push(amount);

            campaign.amountCollected += amount;
        }
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function finalizeCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];

        // Check if the message sender is the owner of the campaign
        require(
            msg.sender == campaign.owner,
            "Only the campaign owner can finalize the campaign."
        );

        // Check if the deadline has passed
        require(
            block.timestamp >= campaign.deadline,
            "Campaign is still ongoing."
        );

        // Check if the campaign already claimed
        require(campaign.claimed == false, "Campaign already claimed");

        if (campaign.amountCollected >= campaign.target) {
            // If target is met or exceeded, transfer funds to campaign owner
            (bool sent, ) = payable(campaign.owner).call{
                value: campaign.amountCollected
            }("");
            require(sent, "Failed to send Ether");
            campaign.claimed = true; // Mark as claimed
        } else {
            // If target is not met, refund donors
            for (uint i = 0; i < campaign.donators.length; i++) {
                (bool refunded, ) = payable(campaign.donators[i]).call{
                    value: campaign.donations[i]
                }("");
                require(refunded, "Failed to refund Ether");
            }
        }
    }
}
