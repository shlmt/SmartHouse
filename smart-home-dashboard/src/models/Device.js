class Device {
    constructor({id,name,room,type,status,isOn=true}) {
        this.id = id
        this.name = name
        this.room = room
        this.type = type
        this.isOn = isOn
        this.status = status
    }
}

export default Device