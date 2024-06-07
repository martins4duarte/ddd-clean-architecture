export class Failure<E, S> {
  readonly value: E

  constructor(value: E) {
    this.value = value
  }

  isSuccess(): this is Success<E, S> {
    return false
  }

  isFailure(): this is Failure<E, S> {
    return true
  }
}


export class Success<E, S> {
  readonly value: S

  constructor(value: S) {
    this.value = value
  }

  isSuccess(): this is Success<E, S> {
    return true
  }

  isFailure(): this is Failure<E, S> {
    return false
  }
}

export const failure = <E, S>(value: E): Either<E, S> => {
  return new Failure(value)
}

export const success = <E, S>(value: S): Either<E, S> => {
  return new Success(value)
}


export type Either<E, S> = Failure<E, S> | Success<E, S>