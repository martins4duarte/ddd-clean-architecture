import { Slug } from "./value-objects/slug"
import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import moment from "moment"

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {

  private touch() {
    this.props.updatedAt = moment.utc().toDate()
  }
  
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return moment.utc().diff(this.props.createdAt) <= 3
  }

  get excerpt() {
    return this.content
      .substring(0, 120)
      .trimEnd()
      .concat('...')
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug'>, 
    id? : UniqueEntityID
  ): Question {

    const question = new Question({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.title),
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return question
  }
}
