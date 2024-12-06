import React, { useState } from "react";
import { enable2FA, disable2FA } from "@/lib/2fa"; // Ensure these functions are implemented
import { Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Replace with your actual Switch component

const TwofaSetting = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleEnable2FA = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number.");
      return;
    }

    try {
      await enable2FA(phoneNumber);
      setIs2FAEnabled(true);
      alert("Two-Factor Authentication has been enabled.");
    } catch (error) {
      console.log("Error enabling 2FA:", error);
      alert("Failed to enable Two-Factor Authentication.");
    }
  };

  const handleDisable2FA = async () => {
    try {
      await disable2FA();
      setIs2FAEnabled(false);
      alert("Two-Factor Authentication has been disabled.");
    } catch (error) {
      console.log("Error disabling 2FA:", error);
      alert("Failed to disable Two-Factor Authentication.");
    }
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
      handleDisable2FA();
    } else {
      handleEnable2FA();
    }
  };

  return (
    <div className="p-4">
      {/* Enable/Disable 2FA Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-600" />
            <span>Two-Factor Authentication</span>
          </div>
          <Switch
            id="two-factor"
            checked={is2FAEnabled}
            onCheckedChange={handleToggle2FA}
          />
        </div>

        {/* Phone Input */}
        {!is2FAEnabled && (
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your phone number:
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div id="recaptcha-container" className="mt-2"></div> {/* For ReCAPTCHA */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwofaSetting;
