export default class Startup {
  constructor (
    title,
    shortdescription,
    fulldescription,
    cost,
    completed,
    raisedfunds,
    user = null,
    id = null
  ) {
    this.title = title
    this.shortdescription = shortdescription
    this.fulldescription = fulldescription
    this.cost = cost
    this.completed = completed
    this.raisedfunds = raisedfunds
    this.user = user
    this.id = id
  }
}
