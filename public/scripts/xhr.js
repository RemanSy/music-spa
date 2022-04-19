export default class {
    xhr = new XMLHttpRequest();

    sendRequest(method, url, body = []) {
        return new Promise( (resolve, reject) => {
            this.xhr.open(method, url);

            this.xhr.onload = () => {
                if (this.xhr.status >= 400) reject(this.xhr.response);
                else resolve(this.xhr.response);
            }

            this.xhr.onerror = () => reject(this.xhr.response);
            
            this.xhr.send(body);
        });
    }
}