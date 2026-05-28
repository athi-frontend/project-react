"use client"
import React from 'react'
import { LogoImage } from '@/styles/modules/auth/login'
import { LOGIN_CONSTANTS } from '@/constants/modules/auth/login'
import { NUMBERMAP } from '@/constants/common'
const { IMG } = LOGIN_CONSTANTS


const Logo: React.FC = () => {
  return <LogoImage width={NUMBERMAP.ONEEIGHTY} height={NUMBERMAP.HUNDRED} src={IMG} alt="eQMS Logo" loading="lazy" />
}

export default Logo
