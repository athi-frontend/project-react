"use client";
import React from 'react';
import { PageContainer } from '@/styles/modules/hr/employeeList';
import RiskLevelDefinitionPage from '@/components/modules/risk-management/risk-level-definition/RiskLevelDefinitionPage';
/**
      *Classification : Confidential
**/
const RiskLevelDefinitionPageWrapper: React.FC = () => {

  return (
    <PageContainer>
      <RiskLevelDefinitionPage />
    </PageContainer>
  );
};

export default RiskLevelDefinitionPageWrapper;