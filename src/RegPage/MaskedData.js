/* eslint-disable indent */
import React from 'react';

export const MaskedMobile = ({ mobile }) => {
  const maskMobileNumber = (mobile) => {
    if (!mobile || typeof mobile !== 'string' || mobile.length < 3) return 'Invalid number';
    return mobile.slice(0, -3).replace(/\d/g, '*') + mobile.slice(-3);
};


  return <div>{maskMobileNumber(mobile)}</div>;
};
export const MaskedEmail = ({ email }) => {
  const maskEmail = (email) => {
    if (!email) return '';

    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 3) + '****';

    return `${maskedUsername}@${domain}`;
  };

  return <div>{maskEmail(email)}</div>;
};

