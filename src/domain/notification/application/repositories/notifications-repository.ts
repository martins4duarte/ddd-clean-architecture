import { Notification } from "../../enterprise/entities/notification";

export interface NotificationsRepository {
  create(question: Notification): Promise<void>;
}