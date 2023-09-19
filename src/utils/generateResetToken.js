import { promisify } from 'util';
import crypto from 'crypto';

// Función para generar un token de restablecimiento de contraseña

export const generateResetToken = () => {
    const tokenExpirationInMilliseconds = 3600000;
    const randomBytesAsync = promisify(crypto.randomBytes); 
    return randomBytesAsync(32) 
      .then((buf) => {
        const token = buf.toString('hex');
        const expirationDate = new Date(Date.now() + tokenExpirationInMilliseconds);
        expirationDate.setTime(expirationDate.getTime() - expirationDate.getTimezoneOffset() * 60000);
        return { token, expirationDate };
      })
      .catch((error) => {
        throw new Error('Error al generar el token de restablecimiento de contraseña');
      });
  };

const token = await generateResetToken()
console.log("TOKEN GENERADO", token)

