import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { sendOtpToEmail, verifyOtp } from './utils';

const OtpModal = ({ isOpen, onClose, email, onOtpSuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text').slice(0, 6);
    setOtp([...pastedData.split("")]);
  };

  const handleVerify = async () => {
    try {
      const otpString = otp.join("");
      await verifyOtp(email, otpString);
      toast.success("Verify successful!", { autoClose: 2000 });
      onOtpSuccess(); // Call the success callback
      onClose(); // Close the modal on successful verification
    } catch (error) {
      toast.error("Invalid OTP. Please try again.", { autoClose: 2000 });
    }
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget || e.target.className === 'modal-close') {
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay modal-overlay-otp" onClick={closeModal}>
        <div className="modal-content modal-content-otp" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: "22px", color: "#007bff" }}>Verify</h3>
          <span className="modal-close" onClick={closeModal}>
            &times;
          </span>
          </div>
          <p style={{ fontSize: "14px" }}>Your code was sent to you via email</p>
          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
                className="otp-input"
              />
            ))}
          </div>
          <button onClick={handleVerify} className="verify-button">Verify</button>
          <p style={{ marginTop: "20px", fontSize: "14px" }}>
            Didn't receive code? <span onClick={() => sendOtpToEmail(email)} className="request-again">Request again</span>
          </p>
        </div>
      </div>
    )
  );
};

export default OtpModal;
