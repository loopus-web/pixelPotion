import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Intro = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ContactPage = () => {
  return (
    <ContactContainer>
      <Title>Contact Us</Title>
      <Intro>Contact us for any question or suggestion. We’ll get back to you as soon as possible.</Intro>
      <Form action="https://formspree.io/f/your_form_id" method="POST">
        <Input type="text" name="name" placeholder="Your name" required />
        <Input type="email" name="email" placeholder="Your email" required />
        <Textarea name="message" placeholder="Your message" rows={5} required />
        <Button type="submit">Send</Button>
      </Form>
    </ContactContainer>
  );
};

export default ContactPage;
