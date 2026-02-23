import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useChangeTierStore } from "../../../store/changeTierStore";
import UpgradePartnershipModal from "./components/UpgradePartnershipModal";
import DowngradePartnershipModal from "./components/DowngradePartnershipModal";
import BobcatPartnerInfoModal from "./components/BobcatPartnerInfoModal";
import IberianLynxInfoModal from "./components/IberianLynxInfoModal";
import EurasianLynxInfoModal from "./components/EurasianLynxInfoModal";
import { partnerService } from "../../../services/partnerService/partnerService";

const ChangeTierContent: React.FC = () => {
  const {
    servicePartnerTiers,
    selectedTier,
    currentTier,
    loading,
    error,
    setSelectedTier,
    fetchTierInfo,
    fetchServicePartnerTiers,
  } = useChangeTierStore();

  // Modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showBobcatInfoModal, setShowBobcatInfoModal] = useState(false);
  const [showIberianInfoModal, setShowIberianInfoModal] = useState(false);
  const [showEurasianInfoModal, setShowEurasianInfoModal] = useState(false);
  const [downgradeTier, setDowngradeTier] = useState<number | null>(null);

  const tierNames = React.useMemo(() => {
    return servicePartnerTiers.reduce((acc, tier) => {
      acc[tier.id] = tier.name; 
      return acc;
    }, {} as Record<number, string>);
  }, [servicePartnerTiers]);

  useEffect(() => {
    fetchTierInfo();
    fetchServicePartnerTiers();
  }, [fetchServicePartnerTiers, fetchTierInfo]);

  const handleTierChange = (tierValue: number) => {
    setSelectedTier(tierValue);
  };

  const handleBobcatInfoClick = () => {
    setShowBobcatInfoModal(true);
  };

  const handleIberianInfoClick = () => {
    setShowIberianInfoModal(true);
  };

  const handleEurasianInfoClick = () => {
    setShowEurasianInfoModal(true);
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleDowngradeClick = (tierValue: number) => {
    setDowngradeTier(tierValue);
    setShowDowngradeModal(true);
  };

  const handleSubmit = async () => {
    const currentTierDetails = servicePartnerTiers.find(tier => tier.id === currentTier);
    const selectedTierDetails = servicePartnerTiers.find(tier => tier.id === selectedTier);

    // If selectedTierDetails is not found, always show an error.
    if (!selectedTierDetails) {
      Swal.fire("Error", "Selected tier details not found.", "error");
      return;
    }

    // Case 1: No current tier (currentTier is 0 or invalid), and a valid selectedTier. Treat as an upgrade.
    if (!currentTierDetails) {
      handleUpgradeClick(); // This will open the upgrade modal
      return;
    }

    // If same level, just show success
    if (selectedTierDetails.display_order === currentTierDetails.display_order) {
      Swal.fire("Success!", "Partnership level updated successfully!", "success");
      return;
    }

    // If selected tier is a downgrade
    if (selectedTierDetails.display_order < currentTierDetails.display_order) {
      handleDowngradeClick(selectedTier);
      return;
    }

    // If selected tier is an upgrade
    if (selectedTierDetails.display_order > currentTierDetails.display_order) {
      handleUpgradeClick();
      return;
    }
  };

  const handleUpgradeConfirm = () => {
    setShowUpgradeModal(false);
    fetchTierInfo(); // Re-fetch to update currentTier
    // Handle upgrade logic if needed (e.g., show a success message if no API call is needed here)
  };

  const handleDowngradeConfirm = async () => {
    if (downgradeTier) {
      try {
        await partnerService.updateTier(downgradeTier);
        setSelectedTier(downgradeTier);
        fetchTierInfo(); // Re-fetch to update currentTier
        setShowDowngradeModal(false);
        setDowngradeTier(null);
        Swal.fire("Success!", "Your partnership level has been updated successfully.", "success");
      } catch (error) {
        console.error("Error updating tier:", error);
        Swal.fire("Error", "Failed to update partnership level.", "error");
      }
    }
  };

  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="card-title mb-0">Change Partnership Level</h4>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="text-center py-3">Loading tier information...</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <>
            <p className="lead mb-3 text-start">
              Choose Your Level - How Busy Do You Want to Be?
            </p>
            <form
              className="text-start"
              id="form-change-tier"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="row">
                <div className="col-md-12">
                  <p>
                    We offer three partnership levels so you can choose how
                    much work and how quickly you want to take on
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="form-floating mb-4">
                    {servicePartnerTiers.map((tier) => (
                      <div className="form-check text-start" key={tier.id}>
                        <input
                          className="form-check-input tierClass"
                          value={tier.id}
                          type="radio"
                          name="service_partner_tier"
                          id={`service_partner_tier${tier.id}`}
                          checked={selectedTier === tier.id}
                          onChange={() => handleTierChange(tier.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`service_partner_tier${tier.id}`}
                        >
                          {tier.name}
                        </label>
                        <i
                          className="uil uil-info-circle tierDetails"
                          onClick={() => {
                            if (tier.id === 8) {
                              handleBobcatInfoClick();
                            } else if (tier.id === 10) {
                              handleIberianInfoClick();
                            }
                            else if (tier.id === 9) {
                              handleEurasianInfoClick();
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    ))}
                    <p className="pt-1">
                      ➡️{" "}
                      <span className="underline-2 blue">
                        Need help deciding?
                      </span>
                      No worries - you can always adjust later.
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill btn-login"
                    id="submit-change-tier"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Render Modal Components */}
      <UpgradePartnershipModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onConfirm={handleUpgradeConfirm}
      />

      <DowngradePartnershipModal
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        onConfirm={handleDowngradeConfirm}
        newTier={downgradeTier || 0}
        tierNames={tierNames}
      />

      <BobcatPartnerInfoModal
        isOpen={showBobcatInfoModal}
        onClose={() => setShowBobcatInfoModal(false)}
      />

      <IberianLynxInfoModal
        isOpen={showIberianInfoModal}
        onClose={() => setShowIberianInfoModal(false)}
      />

      <EurasianLynxInfoModal
        isOpen={showEurasianInfoModal}
        onClose={() => setShowEurasianInfoModal(false)}
      />
    </div>
  );
};

export default ChangeTierContent;
