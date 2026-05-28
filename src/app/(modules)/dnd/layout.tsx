'use client'

import CommonLayout from '@/components/layout/CommonLayout';

/**
*Classification : Confidential
**/

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CommonLayout useDecisionHooks useProjectId>{children}</CommonLayout>;
}
