"use client"
/**
    Classification : Confidential
**/

import CommonLayout from '@/components/layout/CommonLayout';

export default function RiskManagementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CommonLayout useProjectId useDecisionHooks>
      {children}
    </CommonLayout>
  );
} 