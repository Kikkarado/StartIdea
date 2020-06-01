export default class Donation {
  constructor (
    uid,
    idstartup,
    donation,
    title,
    profit,
    startupStatus
  ) {
    this.uid = uid
    this.idstartup = idstartup
    this.donation = donation
    this.title = title
    this.profit = profit
    this.startupStatus = startupStatus
  }
}
