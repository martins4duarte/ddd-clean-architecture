import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { DomainEvent } from "@/core/events/domain-event";
import type { QuestionComment } from "../entities/question-comment";

export class QuestionCommentedEvent implements DomainEvent {
  public ocurredAt: Date;
  public questionComment: QuestionComment;

  constructor(questionComment: QuestionComment) {
    this.ocurredAt = new Date();
    this.questionComment = questionComment
  }

  getAggregateId(): UniqueEntityID {
    return this.questionComment.id
  }

}