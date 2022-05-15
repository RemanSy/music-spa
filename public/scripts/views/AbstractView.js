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

    decodeCookie() {
        let tmp = {};
        let cookies = document.cookie;

        if (!cookies) return false;

        cookies = cookies
        .split(';')
        .map(v => v.split('='));

        cookies.forEach(val => {
            tmp[decodeURIComponent(val[0].trim())] = decodeURIComponent(val[1].trim());
        });

        return tmp;
    }

    showMessage(text, type = 'secondary') {
        let msg = document.querySelector('.flash-message');
        let span = msg.querySelector('span');
        span.innerHTML = text;
        
        msg.classList.toggle(`alert-${type}`);

        msg.classList.toggle('shown');

        setTimeout(() => msg.classList.toggle('shown'), 4000);
    }
}