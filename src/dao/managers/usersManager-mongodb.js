import userModel from "../models/user.model.js";

class usersManagerMongodb {
    async getAllUsers() {
        try{
            const users = await userModel.find();
            return users
        }catch(error){
            console.log(error)
            throw error;
        }
    };

    async getUserById(userId) {
        try{
            const user = await userModel.find({ _id: userId });
            return user;
        }catch(error){
            console.log(error)
            throw error;
        }
    };

    async getUserByEmail(email) {
        try{
            const user = await userModel.findOne({ email });
            return user;
        }catch(error){
            console.log(error)
            throw error;
        }
    };

    async updateUserRole(userId, updatedField) {
        try{
            const { role } = updatedField;
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    $set: { role }
                },
                { new: true, runValidators: true }
            );
            return {
                message: `Se ha actualizado el usuario!`,
                product: updatedUser,
              };
        }catch(error){
            console.log(error)
            throw error;
        }
    };

    async updatePassword(id, newPassword) {
        try {
            const { password } = newPassword;
            const updatedUser = await userModel.updateOne(
                { _id: id },
                {
                    $set: {
                        password: password
                    }
                }
            );
    
            return {
                message: `Se ha actualizado el usuario!`,
                user: updatedUser,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    

    async sendDocumentsToUser(userId, newDocuments) {
        try{
            const user = await userModel.findByIdAndUpdate(userId, { documents: newDocuments })
            return user;
        }catch(error){
            console.log(error)
            throw error;
        }
    };

    async sendProfileImage(userId, newProfile) {
        try{
            const user = await userModel.findByIdAndUpdate(userId, { profile: newProfile })
            return user;
        }catch(error){
            console.log(error)
            throw error;
        }
    };
};

export default usersManagerMongodb;