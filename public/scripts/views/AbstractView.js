import XHR from "../xhr.js";
import app from "../app.js";

export default class {
    xhr = new XHR();
    app = app;
    title = '';

    getHTML() {

    }

    scripts() {

    }

    getUrlParameters(url) {
        if (!url.includes('?')) return false;
        let o = {};
        
        let r = url.split('?')[1].split('&');
        r = r.map((param) => {return param.split('=')});
        r.forEach(param => {
            o[param[0]] = param[1];
        });

        return o;
    }

    decodeCookie() {
        return this.app.router.decodeCookie();
    }

    showMessage(text, type = 'secondary') {
        return this.app.showMessage(text, type);
    }
}