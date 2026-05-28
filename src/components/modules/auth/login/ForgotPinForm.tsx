import RecoverEmailForm from '../RecoverEmailForm'

import { useRecoverPin } from '@/hooks/modules/auth/useForgotPin'

const ForgotPinForm = () => {
  const { mutate } = useRecoverPin()

  const handleSubmit = (
    email: string,
    onSuccess: () => void,
    onFailure: () => void
  ) => {
    mutate(email, {
      onSuccess: (response) => {
        if (response?.status === 'success') {
          onSuccess()
        } else {
          onFailure()
        }
      },
      onError: onFailure,
    })
  }

  return (
    <RecoverEmailForm
      title="Forgot PIN"
      subtitle="We'll send you an email to reset your PIN."
      placeholder="Enter your email"
      buttonText="Recover PIN"
      sendingText="Sending..."
      onSubmit={handleSubmit}
      successMessageText="PIN recovery email sent!"
      failedMessageText="Failed to send PIN recovery email."
      generalErrorText="Something went wrong. Try again."
    />
  )
}

export default ForgotPinForm
