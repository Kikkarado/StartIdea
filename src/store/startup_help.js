export default class Startup {
  constructor (
    title,
    description,
    cost,
    completed,
    raisedfunds,
    user = null,
    id = null
  ) {
    this.title = title
    this.description = description
    this.cost = cost
    this.completed = completed
    this.raisedfunds = raisedfunds
    this.user = user
    this.id = id
  }
}
