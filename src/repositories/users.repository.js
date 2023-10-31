export default class UsersRepository {
    
    constructor(dao){
        this.dao = dao;
    }; 

    getAllUsers = async() => {
        try{
            const users = await this.dao.getAllUsers();
            return users
        }catch(error){
            console.log(error)
        }
    };

    getUserById = async(userId) => {
        try{
            const user = await this.dao.getUserById(userId);
            return user;
        }catch(error){
            console.log(error)
        }
    };

    getUserByEmail = async (email) => {
        try{
            const user = await this.dao.getUserByEmail(email);
            return user;
        }catch(error){
            console.log(error)
        }
    };

    updateUserRole = async (userId, updatedField) => {
        try{
            const updatedUser = await this.dao.updateUserRole(userId, updatedField);
            return updatedUser;
        }catch(error){
            console.log(error)
        }
    };

    updatePassword = async (id, newPassword) => {
        try{
            const updatedPassword = await this.dao.updatePassword(id, newPassword);
            return updatedPassword;
        }catch(error){
            console.log(error)
        }
    };

    sendDocumentsToUser = async(userId, newDocuments) => {
        try{
            const user = await this.dao.sendDocumentsToUser(userId, newDocuments);
            return user;
        }catch(error){
            console.log(error)
        }
    };

    sendProfileImage = async(userId, newProfile) => {
        try{
            const user = await this.dao.sendProfileImage(userId, newProfile);
            return user;
        }catch(error){
            console.log(error)
        }
    };
}