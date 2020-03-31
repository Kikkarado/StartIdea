export default class Profile {
  constructor (
    fname,
    sname,
    status,
    user = null,
    id = null
  ) {
    this.fname = fname
    this.sname = sname
    this.status = status
    this.user = user
    this.id = id
  }
}
