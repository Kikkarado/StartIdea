export default class Startup {
  constructor (
    title,
    shortdescription,
    fulldescription,
    cost,
    completed,
    raisedfunds,
    deadline,
    approved,
    user = null,
    id = null
  ) {
    this.title = title
    this.shortdescription = shortdescription
    this.fulldescription = fulldescription
    this.cost = cost
    this.completed = completed
    this.raisedfunds = raisedfunds
    this.deadline = deadline
    this.approved = approved
    this.user = user
    this.id = id
  }
}
