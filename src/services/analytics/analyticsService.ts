import { v4 as uuidv4 } from "uuid";

export interface AnalyticsEvent {
  eventType:
    | "send_message"
    | "click_quick_reply"
    | "open_chat"
    | "close_chat"
    | "view_product"
    | "page_view";
  eventData?: Record<string, unknown>;
}

export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: string;
  screenResolution: string;
  userAgent: string;
  language: string;
}

export interface PageInfo {
  url: string;
  path: string;
  title: string;
  referrer: string;
}

export interface TrackingData {
  eventId: string;
  timestamp: string;
  sessionId: string;
  event: AnalyticsEvent;
  device: DeviceInfo;
  page: PageInfo;
}

class AnalyticsService {
  private apiEndpoint: string | null = null;
  private sessionId: string;
  private localStorage: Storage | null;

  constructor() {
    this.localStorage =
      typeof window !== "undefined" ? window.localStorage : null;
    this.sessionId = this.getOrCreateSessionId();
  }

  setApiEndpoint(endpoint: string) {
    this.apiEndpoint = endpoint;
  }

  private getOrCreateSessionId(): string {
    if (!this.localStorage) return uuidv4();

    const sessionId = this.localStorage.getItem("davision_session_id");
    if (sessionId) return sessionId;

    const newSessionId = uuidv4();
    this.localStorage.setItem("davision_session_id", newSessionId);
    return newSessionId;
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === "undefined") {
      return {
        browser: "unknown",
        browserVersion: "unknown",
        os: "unknown",
        osVersion: "unknown",
        deviceType: "unknown",
        screenResolution: "unknown",
        userAgent: "unknown",
        language: "unknown",
      };
    }

    const ua = navigator.userAgent;
    let browser = "unknown";
    let browserVersion = "unknown";
    let os = "unknown";
    let osVersion = "unknown";
    let deviceType = "desktop";

    if (ua.indexOf("Chrome") !== -1) {
      browser = "Chrome";
      browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)![1];
    } else if (ua.indexOf("Firefox") !== -1) {
      browser = "Firefox";
      browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)![1];
    } else if (ua.indexOf("Safari") !== -1) {
      browser = "Safari";
      browserVersion = ua.match(/Version\/(\d+\.\d+)/)![1];
    } else if (ua.indexOf("MSIE") !== -1 || ua.indexOf("Trident/") !== -1) {
      browser = "Internet Explorer";
      browserVersion = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)![1];
    } else if (ua.indexOf("Edge") !== -1) {
      browser = "Edge";
      browserVersion = ua.match(/Edge\/(\d+\.\d+)/)![1];
    }

    if (ua.indexOf("Windows") !== -1) {
      os = "Windows";
      osVersion = ua.match(/Windows NT (\d+\.\d+)/)![1];
    } else if (ua.indexOf("Mac") !== -1) {
      os = "MacOS";
      osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)![1].replace("_", ".");
    } else if (ua.indexOf("Linux") !== -1) {
      os = "Linux";
    } else if (ua.indexOf("Android") !== -1) {
      os = "Android";
      osVersion = ua.match(/Android (\d+\.\d+)/)![1];
      deviceType = "mobile";
    } else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) {
      os = "iOS";
      osVersion = ua.match(/OS (\d+_\d+)/)![1].replace("_", ".");
      deviceType = ua.indexOf("iPad") !== -1 ? "tablet" : "mobile";
    }

    if (deviceType === "desktop" && window.innerWidth <= 768) {
      deviceType = "mobile";
    }

    return {
      browser,
      browserVersion,
      os,
      osVersion,
      deviceType,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: ua,
      language: navigator.language,
    };
  }

  private getPageInfo(): PageInfo {
    if (typeof window === "undefined") {
      return {
        url: "",
        path: "",
        title: "",
        referrer: "",
      };
    }

    return {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    };
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    const trackingData: TrackingData = {
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      event,
      device: this.getDeviceInfo(),
      page: this.getPageInfo(),
    };

    if (!this.apiEndpoint) return;

    try {
      await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });
    } catch {
      // Silent fail in production
    }
  }
}

export const analyticsService = new AnalyticsService();
