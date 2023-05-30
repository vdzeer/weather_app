import React, { useLayoutEffect } from 'react';
import { Navigation } from 'pages';
import { QueryClient, QueryClientProvider } from 'react-query';
import { initBackgroundFetch, onScheduleTask } from 'shared/utils';
import { useCurrentPosition } from 'entities/weather/model';

const queryClient = new QueryClient();

const App = () => {
  const position = useCurrentPosition();

  useLayoutEffect(() => {
    /* eslint-disable */
    (async () => {
      await initBackgroundFetch(position);
      onScheduleTask();
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
};

export default App;
