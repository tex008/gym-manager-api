export class DailyCheckInLimitExceededError extends Error {
  constructor() {
    super('Daily check-in limit exceeded.')
  }
}
