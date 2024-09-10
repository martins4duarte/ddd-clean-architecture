import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { DomainEvent } from "@/core/events/domain-event";
import type { AnswerComment } from "../entities/answer-comment";

export class AnswerCommentedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.ocurredAt = new Date();
    this.answerComment = answerComment
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id
  }

}