import { useEffect } from "react";

// TODO: use this to warn the user when they're about to leave the
// page w/ unsaved changes
const PageRefreshConfirmation = () => {
  useEffect(() => {
    const handler = function (event: any) {
      event.preventDefault();
      event.returnValue = '';
      return null;
    };

    window.addEventListener('beforeunload', handler);

    return () => {
      window.removeEventListener('beforeunload', handler);
    }
  }, []);

  return <></>
}

export default PageRefreshConfirmation;
