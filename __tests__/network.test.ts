import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

import { setupOnlineManager } from '../src/shared/lib/network';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    addEventListener: jest.fn(() => jest.fn()),
  },
}));

const configure = NetInfo.configure as jest.Mock;
const addEventListener = NetInfo.addEventListener as jest.Mock;

describe('network status', () => {
  it('turns off the reachability check before listening', () => {
    expect(configure).toHaveBeenCalledTimes(1);
    const [{ reachabilityShouldRun }] = configure.mock.calls[0];
    expect(reachabilityShouldRun()).toBe(false);
  });

  it('still follows the connection state from the OS', () => {
    setupOnlineManager();
    expect(configure.mock.invocationCallOrder[0]).toBeLessThan(
      addEventListener.mock.invocationCallOrder[0],
    );
    const listener = addEventListener.mock.calls[0][0];

    listener({ isConnected: false, isInternetReachable: false });
    expect(onlineManager.isOnline()).toBe(false);
    listener({ isConnected: true, isInternetReachable: false });
    expect(onlineManager.isOnline()).toBe(true);
  });
});
