"use client"
/**
    Classification : Confidential
**/

import CommonLayout from '@/components/layout/CommonLayout';

export default function InfrastructureManagementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CommonLayout useDecisionHooks>
      {children}
    </CommonLayout>
  );
}

