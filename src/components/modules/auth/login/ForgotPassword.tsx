import RecoverEmailForm from '../RecoverEmailForm'
import { useRecoverPassword } from '@/hooks/modules/auth/useForgotPassword'

const ForgotPassword = () => {
  const { mutate } = useRecoverPassword()

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
      title="Forgot Password"
      subtitle="We'll send you an email to recover your password."
      placeholder="Enter your email"
      buttonText="Recover Password"
      sendingText="Sending..."
      onSubmit={handleSubmit}
      successMessageText="Password recovery email sent!"
      failedMessageText="Failed to send password recovery email."
      generalErrorText="Something went wrong. Try again."
    />
  )
}

export default ForgotPassword
