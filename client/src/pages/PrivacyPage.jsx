import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 32px;
  background: ${({ theme }) => theme.colors.panel};
  border-radius: 12px;
  box-shadow: 0 0 24px #0002;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 24px;
  text-align: center;
  text-transform: uppercase;
`;

export default function PrivacyPage() {
  return (
    <PageContainer>
      <Title>Privacy Policy</Title>
      <p>Your privacy is important to us. This page explains how we collect, use, and protect your personal information when you use PixPotion.</p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Account information (username, email, avatar)</li>
        <li>Generated images and prompts</li>
        <li>Usage statistics (e.g., credits used, image history)</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our services</li>
        <li>To personalize your experience</li>
        <li>To communicate with you about updates or support</li>
      </ul>
      <h2>Data Protection</h2>
      <ul>
        <li>Your data is stored securely and is never sold to third parties.</li>
        <li>You can request deletion of your account and data at any time.</li>
      </ul>
      <h2>Contact</h2>
      <p>If you have questions about our privacy policy, please contact us via the contact form.</p>
    </PageContainer>
  );
}
