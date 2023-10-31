import { usersRepo } from "../repositories/index.js"

export class usersService {
    constructor() {
        this.usersRepository = usersRepo;
    };

    getAllUsers = async() => {
        try{
            const users = await this.usersRepository.getAllUsers();
            return users;
        }catch(error){
            console.log(error)
        }
    };

    getUserById = async(userId) => {
        try{
            const user = await this.usersRepository.getUserById(userId);
            return user;
        }catch(error){
            console.log(error)
        }
    };

    getUserByEmail = async (email) => {
        try{
            const user = await this.usersRepository.getUserByEmail(email);
            return user;
        }catch(error){
            console.log(error)
        }
    };

    updateUserRole = async (userId, updatedField) => {
        try{
            const updatedUser = await this.usersRepository.updateUserRole(userId, updatedField);
            return updatedUser;
        }catch(error){
            console.log(error)
        }
    };

    updatePassword = async (id, newPassword) => {
        try{
            if (!newPassword) {
                throw new Error('La contraseña no puede estar vacía.');
              }
              
              const updatedPassword = await this.usersRepository.updatePassword(id, newPassword);
              return updatedPassword;
        }catch(error){
            console.log(error)
        }
    };

    sendDocumentsToUser = async(userId, newDocuments) =>{
        try{
            const user = await this.usersRepository.sendDocumentsToUser(userId, newDocuments);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        return user;
        }catch(error){
            console.log(error)
        }
    };

    sendProfileImage = async(userId, newProfile) => {
        try{
            const user = await this.usersRepository.sendProfileImage(userId, newProfile);
            
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
              }

            return user;
        }catch(error){
            console.log(error)
        }
    }
};