'use client';
import { useEffect } from 'react';
import { ErrorWithDigest } from '@/types/error';
import { showActionAlert } from '@/components/ui';
import { API_CLIENT_ERROR, HOME_URL } from '@/constants/common';

export default function GlobalError({
  error,
}: Readonly<{ error: ErrorWithDigest; reset: () => void }>) {

  useEffect(() => {

    // Show the custom alert (your logic)
    showActionAlert('customAlert', {
      title: API_CLIENT_ERROR.UNHANDLED_ERROR_TITLE,
      text: API_CLIENT_ERROR.UNHANDLED_ERROR_MESSAGE,
      icon: API_CLIENT_ERROR.ICON,
      cancelButton: false,
      confirmButton: true,
      confirmButtonText: API_CLIENT_ERROR.VISIT_HOME_BUTTON,
    }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = HOME_URL;
          }
        });
  }, [error]);

  return null;
}