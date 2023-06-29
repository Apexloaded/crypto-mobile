export interface NotificationMessage {
  icon?: string;
  title?: string;
  msg?: string;
  btn: {
    url?: string;
    title?: string;
  };
}
