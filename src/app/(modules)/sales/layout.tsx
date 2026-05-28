"use client"
/**
    Classification : Confidential
**/

import CommonLayout from '@/components/layout/CommonLayout';

export default function VendorManagementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CommonLayout useDecisionHooks>
      {children}
    </CommonLayout>
  );
} 