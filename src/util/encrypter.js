import base64 from 'react-native-base64'

export function encrypter(text) {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    let value = '';

    if (base64regex.test(text) === true) {
        value = text;
    } else {
        value = base64.encode(text);
    }
    return value;
}