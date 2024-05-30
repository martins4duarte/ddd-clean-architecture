import moment from "moment"
import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  createdAt?: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {

  private touch() {
    this.props.updatedAt = moment.utc().toDate()
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.props.content
      .substring(0, 120)
      .trimEnd()
      .concat('...')
  }

  static create(props: Optional<AnswerProps, 'createdAt'>, id? : UniqueEntityID): Answer {
    const answer = new Answer({
      ...props,
    }, id)

    return answer
  }

}