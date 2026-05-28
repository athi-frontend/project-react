import { FILE_SIZE_LIMITS } from '@/constants/common'

export const validateFileSize = (
  files: File[],
  setErrors: (prevErrors: any) => void
) => {
  let hasError = false

  files.forEach((file) => {
    if (file.size > FILE_SIZE_LIMITS.MAX_SIZE) {
      hasError = true
    }
  })

  setErrors((prevErrors: any) => {
    const updatedErrors = { ...prevErrors }
    if (hasError) {
      updatedErrors.documents = FILE_SIZE_LIMITS.ERROR_MESSAGE
    } else {
      updatedErrors.documents = ''
    }
    return updatedErrors
  })
}
