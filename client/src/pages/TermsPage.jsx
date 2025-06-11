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

export default function TermsPage() {
  return (
    <PageContainer>
      <Title>Terms of Service</Title>
      <p>By using PixPotion, you agree to the following terms and conditions. Please read them carefully.</p>
      <h2>Use of Service</h2>
      <ul>
        <li>PixPotion is provided as-is without warranties.</li>
        <li>You are responsible for your account and generated content.</li>
        <li>Do not use PixPotion for illegal or harmful activities.</li>
      </ul>
      <h2>Intellectual Property</h2>
      <ul>
        <li>Generated images are yours, but PixPotion may use them for promotional purposes (with your consent).</li>
        <li>Do not infringe on third-party copyrights when using prompts or sharing images.</li>
      </ul>
      <h2>Account Termination</h2>
      <ul>
        <li>We reserve the right to suspend or terminate accounts for misuse or violation of these terms.</li>
      </ul>
      <h2>Changes to Terms</h2>
      <ul>
        <li>We may update these terms at any time. Continued use of the service implies acceptance of changes.</li>
      </ul>
      <h2>Contact</h2>
      <p>If you have questions about our terms, please contact us via the contact form.</p>
    </PageContainer>
  );
}
