export default class Profile {
  constructor (
    fname,
    sname,
    status,
    openstartup,
    aboutme,
    email,
    phone,
    dayofbirth,
    monthofbirth,
    yearofbirth,
    imageUrl,
    user = null,
    id = null
  ) {
    this.fname = fname
    this.sname = sname
    this.status = status
    this.openstartup = openstartup
    this.aboutme = aboutme
    this.email = email
    this.phone = phone
    this.dayofbirth = dayofbirth
    this.monthofbirth = monthofbirth
    this.yearofbirth = yearofbirth
    this.imageUrl = imageUrl
    this.user = user
    this.id = id
  }
}
