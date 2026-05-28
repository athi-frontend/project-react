'use client'

/**
    Classification : Confidential
**/

import CommonLayout from '@/components/layout/CommonLayout';

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CommonLayout useDecisionHooks useProjectId>{children}</CommonLayout>;
}
