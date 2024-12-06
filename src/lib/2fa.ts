/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "./firebase";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";

export const enable2FA = async (phoneNumber: string) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found.");
    }
    // Get the current user's multi-factor session
    const multiFactorSession = await (auth.currentUser as any)?.multiFactor.getSession();
    
    if (!multiFactorSession) throw new Error("Failed to get multi-factor session.");

    // Set up ReCAPTCHA verifier
    const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container", // This should be the ID of the HTML element where the reCAPTCHA widget is rendered
        { size: "invisible" }, // Configuration options for the reCAPTCHA widget
        auth // Pass the Auth object here
      );

    // Generate verification ID
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      {
        phoneNumber,
        session: multiFactorSession,
      },
      recaptchaVerifier
    );

    // Prompt the user for the verification code sent via SMS
    const verificationCode = prompt("Enter the verification code sent to your phone:");

    if (!verificationCode) throw new Error("Verification code is required.");

    // Create a phone credential
    const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);

    // Enroll the phone number as a second factor
    await (auth.currentUser as any)?.multiFactor.enroll(phoneCredential, "My Phone");

    alert("2FA has been enabled successfully!");
  } catch (error) {
    console.log("Error enabling 2FA:", error);
    alert(error);
  }
};

export const disable2FA = async () => {
    try {
      const enrolledFactors = (auth.currentUser as any)?.multiFactor.enrolledFactors;
  
      if (!enrolledFactors || enrolledFactors.length === 0) {
        alert("No enrolled factors found.");
        return;
      }
  
      // For simplicity, we'll unenroll the first factor (e.g., phone)
      const factorToRemove = enrolledFactors[0];
  
      await (auth.currentUser as any)?.multiFactor.unenroll(factorToRemove.uid);
  
      alert("2FA has been disabled successfully!");
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      alert(error);
    }
  };
  
