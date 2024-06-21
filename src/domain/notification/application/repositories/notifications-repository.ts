import { Notification } from "../../enterprise/entities/notification";

export interface NotificationsRepository {
  findById(id: string): Promise<Notification | null>;
  create(question: Notification): Promise<void>;
  save(question: Notification): Promise<void>;
}