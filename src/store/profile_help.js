export default class Profile {
  constructor (
    fname,
    sname,
    status,
    openstartup,
    aboutme,
    mail,
    phone,
    dateofbirth,
    user = null,
    id = null
  ) {
    this.fname = fname
    this.sname = sname
    this.status = status
    this.openstartup = openstartup
    this.aboutme = aboutme
    this.mail = mail
    this.phone = phone
    this.dateofbirth = dateofbirth
    this.user = user
    this.id = id
  }
}
