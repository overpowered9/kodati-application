import { forwardRef, Ref } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaComponent = forwardRef(
  ({ onChange }: { onChange: (value: string | null) => void }, ref: Ref<ReCAPTCHA>) => {
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!RECAPTCHA_SITE_KEY) {
      return (
        <div>
          <p>reCAPTCHA is not configured properly.</p>
          <p>Please contact the site administrator.</p>
        </div>
      );
    }

    return (
      <div style={{ transform: "scale(0.85)", transformOrigin: "0 0" }}>
        <ReCAPTCHA ref={ref} sitekey={RECAPTCHA_SITE_KEY} onChange={onChange} />
      </div>
    );
  }
);

export default ReCaptchaComponent;