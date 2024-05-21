import { randomUUID } from "node:crypto"

interface QuestionProps {
  title: string
  authorId: string
  content: string
}

export class Question {
  public id: string
  public title: string
  public authorId: string
  public content: string

  constructor(props: QuestionProps, id?: string) {
    this.id = id ?? randomUUID()
    this.authorId = props.authorId
    this.title = props.title
    this.content = props.content
  }
}