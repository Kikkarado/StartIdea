export default class Profile {
  constructor (
    fname,
    sname,
    status,
    openstartup,
    user = null,
    id = null
  ) {
    this.fname = fname
    this.sname = sname
    this.status = status
    this.openstartup = openstartup
    this.user = user
    this.id = id
  }
}
