class User{
    constructor({id, username, email, role, coordinates=null}) {
        this.id = id
        this.username = username
        this.email = email
        this.role = role
        this.creditCard = undefined
        this.coordinates = coordinates
    }
}

export default User