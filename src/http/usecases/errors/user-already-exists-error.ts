export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Oops. User with same email already exists.')
  }
}
