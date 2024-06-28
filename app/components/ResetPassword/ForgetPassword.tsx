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

export default function ForgetPassword() {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [email, setEmail] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const resetRequest = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!isCaptchaVerified) {
      throw new Error("Please complete the reCAPTCHA verification");
    }

    const response = await fetch('/api/reset-password/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'An error occurred while sending the reset password email');
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setIsCaptchaVerified(!!value);
  };

  const { mutate: handleResetRequest, isPending: loading } = useMutation({
    mutationFn: resetRequest,
    onSuccess: () => {
      showSuccessToast('Password reset email sent successfully');
    },
    onError: (error) => {
      showErrorToast(error?.message);
    },
    onSettled: () => {
      setEmail('');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleResetRequest();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className="global-container">
      <div className="left-section">
        <p className="heading">Forget Password</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="email-field fields">
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input className="input" disabled={loading} type="email" name="email" id="email" value={email} onChange={handleChange} required />
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