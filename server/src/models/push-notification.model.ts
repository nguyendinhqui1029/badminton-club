export interface PushNotificationPayload {
  notification: {
    title: string;
    icon: string;
    data: {
      onActionClick: {
        default: {
          operation: string;
          url: string;
        }
      }
    }
  }
}