"use client";

import Image from "next/image";
import { useRef, useState, FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import slide from "@/public/login/Offer Banner.svg";
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useMutation } from '@tanstack/react-query';
import Link from "next/link";
import ReCaptchaComponent from "../ReCaptcha";
import Spinner from "../Modals/Spinner";

export default function ResetPassword({ token }: { token: string }) {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const resetPassword = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!isCaptchaVerified) {
      throw new Error("Please complete the reCAPTCHA verification");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await fetch('/api/reset-password/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'An error occurred while resetting password');
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setIsCaptchaVerified(!!value);
  };

  const { mutate: handleResetPassword, isPending: loading } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      showSuccessToast('Your password has been changed successfully');
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
    onSettled: () => {
      setPassword('');
      setConfirmPassword('');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleResetPassword();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className="global-container">
      <div className="left-section">
        <p className="heading">Reset Password</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="email-field fields">
            <label htmlFor="password" className="label">
              New Password
            </label>
            <input className="input" disabled={loading} type="password" name="password" id="password" value={password} onChange={handlePasswordChange} required />
          </div>
          <div className="email-field fields">
            <label htmlFor="confirm-password" className="label">
              Confirm Password
            </label>
            <input className="input" disabled={loading} type="password" name="confirmPassword" id="confirm-password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          </div>
          <div className="Recaptcha">
            <ReCaptchaComponent ref={recaptchaRef} onChange={handleCaptchaChange} />
          </div>
          <div className="login-btn-container">
            <button type="submit" disabled={loading} className={`login-button ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300'}`}>
              {loading ? "Loading..." : "Submit"}
            </button>
            <Link href="/login" target="blank">
              <p className="forgot-pass-link">Back to login</p>
            </Link>
          </div>
        </form>
      </div>
      <div className="right-section">
        <Image src={slide} alt="slideshow" className="Image" />
      </div>
    </div>
  );
};