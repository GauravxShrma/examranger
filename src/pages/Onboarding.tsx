import React from 'react';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  return <OnboardingForm onComplete={handleOnboardingComplete} />;
};

export default Onboarding;
