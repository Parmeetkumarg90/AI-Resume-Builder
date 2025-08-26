import { AllRoutes } from './Router';
import { useState, useEffect } from 'react';
import sessionStore from './store';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await sessionStore.getState().init();
      setLoading(false);
    })();
  }, []);

  if (loading) { return <>Loading Your Page</> }

  return (
    <AllRoutes />
  )
}

export default App;