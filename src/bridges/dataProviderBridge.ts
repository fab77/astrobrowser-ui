import { dataProviderStore } from '../stores/DataProviderStore';
import { bus } from '../bus';
import type { TapRepoLoadedPayload } from '../types';


// Call this once during app bootstrap (e.g., in app.ts)
export function initDataProviderBridge() {
  const onLoaded = (payload: TapRepoLoadedPayload) => {
    dataProviderStore.set(payload?.dataProvider);
  };
  bus.on('tap:repoLoaded', onLoaded);
}
