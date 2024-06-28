"use client";

import Image from "next/image";
import { useRef, useState, FormEvent, useEffect } from "react";
import ReCaptchaComponent from "./ReCaptcha";
import ReCAPTCHA from "react-google-recaptcha";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import slide from "@/public/login/Offer Banner.svg";
import Phone from "@/public/login/contact-us.svg";
import help from "@/public/login/faq.svg";
import { showErrorToast, showSuccessToast } from '@/utils/toast-helpers';
import { useMutation } from '@tanstack/react-query';
import Link from "next/link";
import Spinner from "./Modals/Spinner";

export default function Login() {
  const contactLink = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? `https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` : null;
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    router.prefetch(callbackUrl);
  }, []);

  const login = async () => {
    if (!isCaptchaVerified) {
      throw new Error("Please complete the reCAPTCHA verification");
    }
    const response = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
      callbackUrl,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (response?.error && !response?.ok) {
      throw new Error("Please enter correct email and password");
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setIsCaptchaVerified(!!value);
  };

  const { mutate: handleLogin, isPending: loading } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      showSuccessToast('Login successful');
      router.push(callbackUrl);
    },
    onError: (error) => {
      showErrorToast(error?.message || 'An error occurred while logging in');
    },
    onSettled: () => {
      setFormData({ email: "", password: "" });
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div className="global-container">
      <div className="left-section">
        <p className="heading">Login</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="email-field fields">
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input className="input" disabled={loading} type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="password-field fields">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input className="input" disabled={loading} type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} required />
          </div>
          <div className="Recaptcha">
            <ReCaptchaComponent ref={recaptchaRef} onChange={handleCaptchaChange} />
          </div>
          <div className="login-btn-container">
            <button type="submit" disabled={loading} className={`login-button ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300'}`}>
              {loading ? "Loading..." : "Login"}
            </button>
            <Link href="/forget-password" target="_blank">
              <p className="forgot-pass-link">Forgot Password?</p>
            </Link>
          </div>
        </form>
        <div className="btns-container">
          {contactLink && (
            <Link href={contactLink} target="_blank">
              <button className="btns">
                <Image src={Phone} alt="phone" className="Image2" />
                <p className="btn-text">Contact Us</p>
              </button>
            </Link>
          )}
          <button className="btns">
            <Image src={help} alt="help" className="Image3" />
            <p className="btn-text">FAQ</p>
          </button>
        </div>
      </div>
      <div className="right-section">
        <Image src={slide} alt="slideshow" className="Image" />
      </div>
    </div>
  );
};