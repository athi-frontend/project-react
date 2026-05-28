import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postDraftSave, fetchDraftSave, DraftSavePayload, FetchDraftPayload } from '@/services/modules/regulation/draftSave';
import { DRAFT_SAVE_CONFIG } from '@/constants/modules/regulation/draftSave';
import { selectCurrentMenuId } from '@/store/slices/menuSlice';
import { useSelector } from 'react-redux';
import { showActionAlert } from '@/components/ui';
import { NUMBERMAP } from '@/constants/common';

/**
    Classification : Confidential
**/

interface UseDraftSaveOptions {
  debounceMs?: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  context_type?: string;
  queryKey?: string
  context_instance_id?: number | string | null
  enableFetch?: boolean;
  onFetchSuccess?: (data: any) => void;
  onFetchError?: (error: any) => void;
}


export const useDraftSave = (options: UseDraftSaveOptions = {}) => {
  const {
    debounceMs = DRAFT_SAVE_CONFIG.DEBOUNCE_MS,
    onSuccess,
    onError,
    context_type = 'project',
    queryKey,
    context_instance_id,
    enableFetch = false,
    onFetchSuccess,
    onFetchError
  } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initialFetchRef = useRef<boolean>(false);
  const pendingDraftDataRef = useRef<any>(null);
  const historyStatePushedRef = useRef<boolean>(false);
  const checkUnsavedDraftRef = useRef<(() => Promise<boolean>) | null>(null);
  const currentPageUrlRef = useRef<string>(window.location.href);
  const isHandlingPopStateRef = useRef<boolean>(false);
  const ignoreNextPopStateRef = useRef<boolean>(false);
  const currentUrlRef = useRef<string>(typeof window !== 'undefined' ? window.location.href : '');
  const currentPathnameRef = useRef<string>(typeof window !== 'undefined' ? window.location.pathname : '');
  const isHandlingUrlChangeRef = useRef<boolean>(false);
  const draftMenuIdRef = useRef<number | string | null>(null); // Store menu_id when draft is created
  const menu_id = useSelector(selectCurrentMenuId)
  // Memoize the enabled condition to prevent unnecessary re-renders
  const isFetchEnabled = useMemo(() => {
    return enableFetch && !!context_type && !!menu_id;
  }, [enableFetch, context_type, context_instance_id, menu_id]);

  // Fetch draft query
  const fetchQuery = useQuery({
    queryKey: ['draft', context_type, context_instance_id, menu_id, queryKey],
    queryFn: async () => {
      const payload: FetchDraftPayload = {
        context_type,
        context_instance_id: context_instance_id ?? null,
        menu_id: menu_id
      };
      return await fetchDraftSave(payload);
    },
    enabled: isFetchEnabled,// 5 minutes - prevents unnecessary refetches
    // v5: prevents showing old data while loading
    placeholderData: undefined,

    // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    structuralSharing: false,
    refetchOnWindowFocus: false, // Prevents refetch on window focus
    refetchOnMount: false, // Prevents refetch on component mount if data exists
  });

  // Handle fetch success and error callbacks
  useEffect(() => {
    if (fetchQuery.isSuccess && fetchQuery.data) {
      initialFetchRef.current = true;
      onFetchSuccess?.(fetchQuery.data);
    }
  }, [fetchQuery.isSuccess, fetchQuery.data, onFetchSuccess]);

  useEffect(() => {
    if (fetchQuery.isError && fetchQuery.error) {
      onFetchError?.(fetchQuery.error);
    }
  }, [fetchQuery.isError, fetchQuery.error, onFetchError]);

  const mutation = useMutation({
    mutationFn: async (payload: DraftSavePayload) => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const result = await postDraftSave(payload, abortController.signal);
        return result;
      } catch (error: any) {
        // Don't treat abort errors as actual errors
        if (error.name === 'AbortError') {
          throw new Error('Request was cancelled');
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Clear pending draft data and timeout when successfully saved
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      pendingDraftDataRef.current = null;
      onSuccess?.();
    },
    onError: (error) => {
      // Don't call onError for cancelled requests
      if (error.message !== 'Request was cancelled') {
        onError?.(error);
      }
    },
  });

  const debouncedDraftSave = useCallback(
    (formData: any) => {
      // Store pending draft data
      pendingDraftDataRef.current = formData;

      // Store menu_id when draft is first created (use current menu_id)
      draftMenuIdRef.current ??= menu_id;
      // Store current URL and push history state to intercept back button (non-blocking)
      if (!historyStatePushedRef.current) {
        currentPageUrlRef.current = window.location.href;
        window.history.pushState(null, '', window.location.href);
        historyStatePushedRef.current = true;
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        const instanceId = formData.project_id ?? context_instance_id ?? '';
        // Use stored menu_id (from when draft was created) instead of current menu_id
        const menuId = draftMenuIdRef.current ?? menu_id ?? '';
        const payload: DraftSavePayload = {
          draft_data: JSON.stringify(formData.form_data),
          context_instance_id: instanceId,
          menu_id: menuId,
          documents: formData.upload_documents,
          context_type: context_type
        };
        mutation.mutate(payload);
      }, debounceMs);
    },
    [mutation, debounceMs, context_instance_id, menu_id, context_type]
  );


  const clearDraftSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    pendingDraftDataRef.current = null;
    draftMenuIdRef.current = null; // Clear stored menu_id
    historyStatePushedRef.current = false; // Reset history state flag
    mutation.reset(); // Reset mutation state
  }, [mutation]);

  // Check if there's unsaved draft data
  const hasUnsavedDraftData = useCallback(() => {
    // Check if there's pending draft data (not yet saved)
    // Only check for actual pending data, not just timeout
    return pendingDraftDataRef.current !== null;
  }, []);

  // Show alert and get user confirmation before leaving
  const checkUnsavedDraftBeforeLeave = useCallback(async (): Promise<boolean> => {
    // Check directly from refs to avoid function call issues
    // Only check for actual pending data, not just timeout
    const hasPendingData = pendingDraftDataRef.current !== null;

    if (!hasPendingData) {
      return true; // No unsaved data, allow action
    }

    try {
      const result = await showActionAlert('customAlert', {
        title: 'Unsaved Changes',
        text: 'Do you want to save them as a draft?',
        icon: 'warning',
        cancelButton: true,
        confirmButtonText: "Save as Draft",
        cancelButtonText: "Discard",
        confirmButton: true,
      });

      if (result.isConfirmed) {
        // User confirmed - save draft immediately
        const pendingData = pendingDraftDataRef.current;
        if (pendingData) {
          // Clear the timeout if exists
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          // Save draft immediately without debounce
          const instanceId = pendingData.project_id ?? context_instance_id ?? null;
          // Use stored menu_id (from when draft was created) instead of current menu_id
          const menuId = draftMenuIdRef.current ?? menu_id ?? '';
          const payload: DraftSavePayload = {
            draft_data: JSON.stringify(pendingData.form_data),
            context_instance_id: instanceId,
            menu_id: menuId,
            documents: pendingData.upload_documents,
            context_type: context_type
          };

          // Trigger immediate save
          mutation.mutate(payload);
        }

        // Clear pending data after triggering save
        pendingDraftDataRef.current = null;
      } else {
        // User cancelled - clear draft data
        clearDraftSave();
      }

      return result.isConfirmed; // true if user confirms, false if cancels
    } catch (error) {
      console.error('Error showing draft alert:', error);
      return false; // On error, prevent action
    }
  }, [clearDraftSave, mutation, context_instance_id, menu_id, context_type]);

  // Store the latest callback in a ref for use in effects
  useEffect(() => {
    checkUnsavedDraftRef.current = checkUnsavedDraftBeforeLeave;
  }, [checkUnsavedDraftBeforeLeave]);

  // Handle browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check directly from refs to avoid function call issues
      const hasPendingData = timeoutRef.current !== null || pendingDraftDataRef.current !== null;
      if (hasPendingData) {
        e.preventDefault();
        return ''; // Some browsers require return value
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty deps - we check refs directly

  // Handle browser back button - show popup, handle draft, but always allow navigation
  useEffect(() => {
    const handlePopState = async (e: PopStateEvent) => {
      // Ignore if we're already handling or if we should ignore this event (programmatic navigation)
      if (isHandlingPopStateRef.current || ignoreNextPopStateRef.current || isHandlingUrlChangeRef.current) {
        ignoreNextPopStateRef.current = false; // Reset the flag
        return;
      }

      // Check directly from refs to avoid infinite loops
      // Only check for actual pending data, not just timeout
      const hasPendingData = pendingDraftDataRef.current !== null;

      if (hasPendingData && checkUnsavedDraftRef.current) {
        isHandlingPopStateRef.current = true;
        isHandlingUrlChangeRef.current = true; // Prevent URL change handler from also triggering

        // Update URL ref immediately to prevent URL change handler from detecting this change
        currentUrlRef.current = window.location.href;

        try {
          // Show popup - navigation has already happened, just handle draft
          await checkUnsavedDraftRef.current();
          ignoreNextPopStateRef.current = true;
          handlePopStateTrigger()
        } catch (error) {
          console.error('Error handling popstate:', error);
          setTimeout(() => {
            isHandlingPopStateRef.current = false;
            isHandlingUrlChangeRef.current = false;
          }, NUMBERMAP.FIVEHUNDRED);
        }
      } else {
        // No pending data, just update the URL ref
        currentUrlRef.current = window.location.href;
      }
    };

    // Always set up the listener
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Set up once only - we check refs directly in the handler

  const handlePopStateTrigger = () => {
    setTimeout(() => {
      window.history.go(-1);
      // Keep flags set longer to prevent URL change handler from triggering
      setTimeout(() => {
        isHandlingPopStateRef.current = false;
        isHandlingUrlChangeRef.current = false;
      }, NUMBERMAP.FIVEHUNDRED);
    }, NUMBERMAP.FIFTY);
  }
  const finalTrigger = (currentUrl: string, currentPathname: string) => {
    // Add a small delay before resetting to prevent rapid re-triggering
    setTimeout(() => {
      isHandlingUrlChangeRef.current = false;
      currentUrlRef.current = currentUrl;
      currentPathnameRef.current = currentPathname;
    }, NUMBERMAP.TWOTHOUSAND);
  }
  // Monitor URL changes for app router navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastCheckTime = NUMBERMAP.ZERO;
    const DEBOUNCE_MS = NUMBERMAP.ONEFIFTY; // Reduced debounce for faster detection

    const checkUrlChange = () => {
      // Always check popstate handler flag first - if it's handling, skip completely
      if (isHandlingPopStateRef.current) {
        // Update URL refs to match current URL to prevent triggering when popstate finishes
        currentUrlRef.current = window.location.href;
        currentPathnameRef.current = window.location.pathname;
        return;
      }

      const now = Date.now();
      // Debounce to prevent multiple rapid checks
      if (now - lastCheckTime < DEBOUNCE_MS) {
        return;
      }
      lastCheckTime = now;

      const currentUrl = window.location.href;
      const currentPathname = window.location.pathname;

      // Check both URL and pathname changes (Next.js might change pathname without full URL change)
      const urlChanged = currentUrl !== currentUrlRef.current;
      const pathnameChanged = currentPathname !== currentPathnameRef.current;

      // Ignore if nothing changed or we're already handling
      if ((!urlChanged && !pathnameChanged) || isHandlingUrlChangeRef.current) {
        return;
      }

      // Check if there's unsaved draft data
      const hasPendingData = pendingDraftDataRef.current !== null;

      if (hasPendingData && checkUnsavedDraftRef.current) {
        isHandlingUrlChangeRef.current = true;

        // Show popup and handle draft - navigation already happened, just handle draft
        checkUnsavedDraftRef.current()
          .then(() => {
            // Draft is handled based on user choice (cleared if confirmed, kept if cancelled)
            // Navigation always proceeds regardless of user choice
          })
          .catch((error) => {
            console.error('Error handling URL change:', error);
          })
          .finally(() => {
            finalTrigger(currentUrl, currentPathname)
          });
      } else {
        // No unsaved data, just update the refs
        currentUrlRef.current = currentUrl;
        currentPathnameRef.current = currentPathname;
      }
    };

    // Check URL changes more frequently for app router navigation
    const intervalId = setInterval(checkUrlChange, NUMBERMAP.ONEFIFTY);

    // Override history methods to detect programmatic navigation (Next.js router uses these)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      // Defer check to after render phase to avoid updating Router during QuotationForm render
      queueMicrotask(() => {
        setTimeout(checkUrlChange, NUMBERMAP.FIFTY);
      });
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      // Defer check to after render phase to avoid updating Router during QuotationForm render
      queueMicrotask(() => {
        setTimeout(checkUrlChange, NUMBERMAP.FIFTY);
      });
    };

    // Also listen to popstate events (in case Next.js triggers them)
    const handleHistoryChange = () => {
      if (!isHandlingPopStateRef.current) {
        // Defer check to after render phase to avoid updating Router during render
        queueMicrotask(() => {
          setTimeout(checkUrlChange, NUMBERMAP.FIFTY);
        });
      }
    };

    window.addEventListener('popstate', handleHistoryChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('popstate', handleHistoryChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []); // Run once on mount



  return {
    draftSave: debouncedDraftSave,
    clearDraftSave,
    isDraftSaving: mutation.isPending,
    isDraftSaved: mutation.isSuccess,
    draftSaveError: mutation.error,
    // Fetch functionality
    fetchDraft: fetchQuery.refetch,
    draftData: fetchQuery.data,
    isFetchingDraft: fetchQuery.isFetching,
    fetchDraftError: fetchQuery.error,
    isFetchEnabled: isFetchEnabled,
    // Unsaved draft check functionality
    hasUnsavedDraftData,
    checkUnsavedDraftBeforeLeave,
  };
};