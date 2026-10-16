import { useEffect, useState } from 'react';

type PersistApi = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};

export const whenHydrated = (store: PersistApi) =>
  new Promise<void>(resolve => {
    if (store.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsubscribe = store.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });

export const useHydrated = (...stores: PersistApi[]) => {
  const [hydrated, setHydrated] = useState(() =>
    stores.every(s => s.persist.hasHydrated()),
  );
  useEffect(() => {
    let active = true;
    Promise.all(stores.map(whenHydrated)).then(() => {
      if (active) {
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
    // The stores are module singletons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return hydrated;
};
