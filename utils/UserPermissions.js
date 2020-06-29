import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

class UserPermissions{
    getCameraPermission = async () => {
        if(Constants.platform.ios){
            const perms = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if(perms.status != 'granted'){
                alert("Você Precisa dar Permição para o App usar a Câmera!")
            }
        }
    }
}

export default new UserPermissions();