class Actuator {
    constructor({id,name,room,status,isOn=true}) {
        this.id = id
        this.name = name
        this.room = room
        this.isOn = isOn
        this.status = status
    }
}

export default Actuator