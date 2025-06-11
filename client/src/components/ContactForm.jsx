import React, { useState } from 'react';
import styled from 'styled-components';
import RetroButton from './ui/RetroButton';

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: ${({ theme }) => theme.borders.panel};
  padding: 2rem;
  max-width: 500px;
  margin: 2rem auto;
  border-radius: 12px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Field = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
  min-height: 100px;
`;

const SuccessMsg = styled.div`
  color: ${({ theme }) => theme.colors.success};
  text-align: center;
  margin-top: 1rem;
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-top: 1rem;
`;

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  return (
    <FormContainer>
      <Title>Contact Us</Title>
      <form
        action="https://formspree.io/f/xvgaodpr"
        method="POST"
        onSubmit={() => setTimeout(() => setSuccess(true), 200)}
      >
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </Field>
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </Field>
        <Field>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" required />
        </Field>
        <RetroButton color="primary" type="submit">Send</RetroButton>
      </form>
      {success && <SuccessMsg>Thank you! Your message has been sent.</SuccessMsg>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </FormContainer>
  );
}
