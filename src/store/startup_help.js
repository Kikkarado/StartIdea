export default class Startup {
  constructor (
    title,
    description,
    cost,
    comleted,
    raisedfunds,
    user = null,
    id = null
  ) {
    this.title = title
    this.description = description
    this.cost = cost
    this.comleted = comleted
    this.raisedfunds = raisedfunds
    this.user = user
    this.id = id
  }
}
