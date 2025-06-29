// components/CaptchaModal.jsx
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const CaptchaModal = ({ show, onVerify, onClose }) => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
        <h2 className="text-lg font-semibold mb-4">Please complete the CAPTCHA</h2>
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={onVerify}
        />
        <button
          className="mt-4 text-sm text-red-600 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CaptchaModal;
