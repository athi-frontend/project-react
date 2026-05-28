/**
*Classification : Confidential
**/

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ButtonGroup } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP } from '@/constants/common'
import { getAdjacentMenuUrls } from '@/lib/utils/menu'
import {
  selectCurrentMenuId,
  selectMenuData,
  useAppSelector,
} from '@/store/slices/menuSlice'
import { ButtonProps } from '@/types/components/ui/button'

interface RiskNavigationButtonGroupProps {
  projectId: number
  buttons?: ButtonProps[]
  showPrevious?: boolean
  showNext?: boolean
}

const RiskNavigationButtonGroup: React.FC<RiskNavigationButtonGroupProps> = ({
  projectId,
  buttons = [],
  showPrevious = true,
  showNext = true,
}) => {
  const router = useRouter()
  const menuData = useAppSelector(selectMenuData)
  const currentMenuId = useAppSelector(selectCurrentMenuId)
  const { previousUrl, nextUrl } = getAdjacentMenuUrls(currentMenuId, menuData)

  const navigationButtons: ButtonProps[] = []

  if (showPrevious && previousUrl) {
    navigationButtons.push({
      label: BUTTON_LABEL.BACK,
      startIcon: <KeyboardDoubleArrowLeftIcon sx={{ color: 'inherit' }} />,
      onClick: () => router.push(`/${previousUrl}/${projectId}`),
      variant: 'contained',
    })
  }

  if (showNext && nextUrl) {
    navigationButtons.push({
      label: BUTTON_LABEL.NEXT,
      endIcon: <KeyboardDoubleArrowRightIcon sx={{ color: 'inherit' }} />,
      onClick: () => router.push(`/${nextUrl}/${projectId}`),
      variant: 'contained',
    })
  }

  const buttonsToRender =
    navigationButtons.length > NUMBERMAP.ZERO
      ? [...navigationButtons, ...buttons]
      : buttons

  if (buttonsToRender.length === NUMBERMAP.ZERO) {
    return null
  }

  return <ButtonGroup buttons={buttonsToRender} />
}

export default RiskNavigationButtonGroup

