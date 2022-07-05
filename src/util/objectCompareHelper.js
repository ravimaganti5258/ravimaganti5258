export const objectCompareHelper = (obj1, obj2) => {
    const strCmpHard = JSON.stringify(obj1) === JSON.stringify(obj2);
    const strCmpSoft = JSON.stringify(obj1) == JSON.stringify(obj2);
    const objectFunctionCmp = Object.is(obj1, obj2);
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const shadowCmp = () => {
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    }
    const isShadowCmp = shadowCmp();
    const deepEqual = (object1, object2) => {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            const val1 = object1[key];
            const val2 = object2[key];
            if (val1 !== val2) {
                return false;
            }
        }
        return true;
    }
    const deepCmp = deepEqual(obj1, obj2);
    let newObj = {
        strCmpHardValue: strCmpHard,
        strCmpSoftValue: strCmpSoft,
        objectFunctionCmpValue: objectFunctionCmp,
        isShadowCmpValue: isShadowCmp,
        deepCmpValue: deepCmp,
    }
    return newObj;
}