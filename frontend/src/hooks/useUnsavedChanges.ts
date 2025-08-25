import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useUnsavedChanges = (hasUnsavedChanges: boolean) => {
  const router = useRouter();

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      return e.returnValue;
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [hasUnsavedChanges, handleBeforeUnload]);

  const confirmNavigation = useCallback(() => {
    if (hasUnsavedChanges) {
      return window.confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }, [hasUnsavedChanges]);

  return { confirmNavigation };
};