export const loadImage = url => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', event => {
            resolve(img);
        });
        img.addEventListener('error', event => {
            reject(event);
        });
        img.setAttribute('src', url);
        if (img.complete) {
            resolve(img);
        }
    });
}