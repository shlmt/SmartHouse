class User{
    constructor({id, username, email, role, coordinates=null, creditCard=null}) {
        this.id = id
        this.username = username
        this.email = email
        this.role = role
        this.creditCard = creditCard
        this.coordinates = coordinates
    }
}

export default User