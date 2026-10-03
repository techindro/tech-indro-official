/**
 * Tech Indro - Mobile Product Telemetry (PostHog Integration)
 * Free Tier: 1,000,000 events / month.
 * Cross-Platform: iOS, Android & Expo Web with offline batching.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTHOG_API_KEY = 'phc_techindro_free_telemetry_key';
const POSTHOG_HOST = 'https://us.i.posthog.com';

const DISTINCT_ID_KEY = '@posthog_distinct_id';
const QUEUED_EVENTS_KEY = '@posthog_queued_events';

interface TelemetryEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
}

class TelemetryService {
  private distinctId: string = '';
  private eventQueue: TelemetryEvent[] = [];
  private flushTimer: any = null;
  private isInitialized: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      let id = await AsyncStorage.getItem(DISTINCT_ID_KEY);
      if (!id) {
        id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await AsyncStorage.setItem(DISTINCT_ID_KEY, id);
      }
      this.distinctId = id;
      this.isInitialized = true;

      // Restore any offline events
      const storedQueue = await AsyncStorage.getItem(QUEUED_EVENTS_KEY);
      if (storedQueue) {
        this.eventQueue = JSON.parse(storedQueue);
      }

      // Start periodic flush every 30 seconds
      this.flushTimer = setInterval(() => {
        this.flush();
      }, 30000);

      // Capture initial app launch
      this.capture('app_launched', {
        os: Platform.OS,
        version: Platform.Version
      });
    } catch (e) {
      console.warn('[Telemetry] Init warning:', e);
    }
  }

  /**
   * Identify a logged in user
   */
  public async identify(userId: string, properties: Record<string, any> = {}) {
    if (!userId) return;
    this.distinctId = String(userId);
    try {
      await AsyncStorage.setItem(DISTINCT_ID_KEY, this.distinctId);
    } catch {}

    this.capture('$identify', {
      $set: properties,
      distinct_id: this.distinctId
    });
  }

  /**
   * Capture a screen view
   */
  public screen(screenName: string, properties: Record<string, any> = {}) {
    this.capture('$screen', {
      $screen_name: screenName,
      ...properties
    });
  }

  /**
   * Capture custom interaction event (e.g. AI doubt, quiz submitted, course viewed)
   */
  public capture(eventName: string, properties: Record<string, any> = {}) {
    const eventObj: TelemetryEvent = {
      event: eventName,
      properties: {
        distinct_id: this.distinctId || 'anonymous_user',
        $os: Platform.OS,
        $os_version: String(Platform.Version),
        $lib: 'tech-indro-expo-posthog',
        platform: 'mobile_expo',
        ...properties
      },
      timestamp: new Date().toISOString()
    };

    if (__DEV__) {
      console.log(`📊 [Telemetry] Captured: "${eventName}"`, properties);
    }

    this.eventQueue.push(eventObj);

    // If queue is getting large, flush immediately
    if (this.eventQueue.length >= 10) {
      this.flush();
    }
  }

  /**
   * Flush queued events to PostHog Batch Endpoint
   */
  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(`${POSTHOG_HOST}/batch/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: POSTHOG_API_KEY,
          batch: eventsToSend.map(e => ({
            event: e.event,
            properties: e.properties,
            timestamp: e.timestamp
          }))
        })
      });

      if (!response.ok) {
        // Re-queue events on network failure
        this.eventQueue = [...eventsToSend, ...this.eventQueue];
        await AsyncStorage.setItem(QUEUED_EVENTS_KEY, JSON.stringify(this.eventQueue));
      } else {
        await AsyncStorage.removeItem(QUEUED_EVENTS_KEY);
      }
    } catch (e) {
      // Offline support: save to device storage for next time
      this.eventQueue = [...eventsToSend, ...this.eventQueue];
      try {
        await AsyncStorage.setItem(QUEUED_EVENTS_KEY, JSON.stringify(this.eventQueue.slice(-100)));
      } catch {}
    }
  }
}

export const telemetry = new TelemetryService();
