import { MenuItemType, AppError } from '@/types/modules/dnd/functionalBlock'
import { FUNCTIONAL_BLOCK_CONSTANTS } from '@/constants/modules/dnd/functionBlock'

const { GENERAL } = FUNCTIONAL_BLOCK_CONSTANTS

export const getTypeChecks = (type: MenuItemType) => ({
  isProduct: type === MenuItemType.PRODUCT,
  isMainBlock: type === MenuItemType.MAIN,
  isChild: type === MenuItemType.CHILD,
})

export const isAppError = (err: unknown): err is AppError => {
  if (typeof err !== GENERAL.OBJECT || err === null || !GENERAL.MESSAGE) {
    return false
  }
  const message = (err as { message: unknown }).message
  return typeof message === GENERAL.STRING
}
