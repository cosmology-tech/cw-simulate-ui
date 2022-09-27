import { useEffect } from "react";

const PageRefreshConfirmation = () => {
  useEffect(() => {
    const handler = function(event: any) {
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
