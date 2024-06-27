import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  toString() {
    return this._value.toString()
  }

  toValue() {
    return this._value
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this._value
  }
}