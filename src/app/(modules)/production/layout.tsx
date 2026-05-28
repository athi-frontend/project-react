'use client'

/**
    Classification : Confidential
**/

import CommonLayout from '@/components/layout/CommonLayout';

export default function ProductionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CommonLayout useDecisionHooks useProjectId>{children}</CommonLayout>;
}
