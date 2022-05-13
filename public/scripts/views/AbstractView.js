import XHR from "../xhr.js";

export default class {
    xhr = new XHR();
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
}