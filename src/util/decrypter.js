import base64 from 'react-native-base64'

export function decrypter(text) {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    let value = '';

    if (base64regex.test(text) === true) {
        value = base64.decode(text);
    } else {
        value = text;
    }
    return value;
}