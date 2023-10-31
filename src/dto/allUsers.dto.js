export default class allUsersDTO {
    constructor(users) {
      this.users = users.map((user) => ({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.userRole,
        id: user._id,
        deleted: user.deleted,
      }));
    }
  }