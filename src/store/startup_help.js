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
    imageUrl1,
    imageUrl2,
    imageUrl3,
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
    this.imageUrl1 = imageUrl1
    this.imageUrl2 = imageUrl2
    this.imageUrl3 = imageUrl3
    this.user = user
    this.id = id
  }
}
