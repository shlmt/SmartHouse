class User{
    constructor({id, username, email, role}) {
        this.id = id
        this.username = username
        this.email = email
        this.role = role
        this.creditCard = undefined
    }
}

export default User