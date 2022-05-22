import mainPage from "./views/mainPage.js";
import registrationForm from "./views/registrationForm.js";
import profile from "./views/profile.js";
import group from "./views/group.js";
import album from "./views/album.js";
import authForm from "./views/authForm.js";
import groupForm from "./views/groupForm.js";
import albumForm from "./views/albumForm.js";

export default class {
    title = document.querySelector('title');
    body = document.querySelector('main.main');
    curUrl = window.location.pathname;
    targetUrl = '';
    // Callback before routing
    preReqCallback = null;

    getRoute(url) {
        let params = this.getUrlParametersString(url) ?? '';
        url = this.getUrlPath(url);
        this.curUrl = (params != '') ? url + '?' + params : url;
        history.pushState({}, null, (params != '') ? url + '?' + params : url);
        
        switch(url) {
            case '/':
                return new mainPage();

            case '/groupForm':
                return new groupForm();

            case '/albumForm':
                return new albumForm();

            case '/registrationForm':
                return new registrationForm();

            case '/authForm':
                return new authForm();

            case '/group':
                return new group();

            case '/album':
                return new album();
            
            case '/profile':
                return new profile();

            default:
                this.title.innerHTML = '404';
                this.body.innerHTML = '<h1>404 - Страница не найдена</h1>';
        }
    }

    beforeReq(callback) {
        let cb = () => {
            let from = this.curUrl;
            let to = this.targetUrl;

            let next = (url = null) => {
                return (url != null) ? url : true;
            }

            return callback(to, from, next);
        }
        
        this.preReqCallback = cb;
    }

    navigateTo(url) {
        this.targetUrl = this.getUrlPath(url);
        let ch = this.preReqCallback();

        if (this.preReqCallback != null) {
            if (!ch)
                return;
            else if (ch === true)
                return this.renderUrl(url);
        }
        
        this.renderUrl(ch);
    }

    renderUrl(url) {
        return this.renderPage(this.getRoute(url));
    }

    renderPage(c) {
        if (!c) return false;
        this.title.innerHTML = c.title;
        this.body.innerHTML = c.getHTML();
        c.scripts();
    }

    getUrlPath(url) {
        if (!url.includes('//')) return url;
        
        let r = url.split('//')[1].split('/').slice(1)[0];
        r = r.split('?')[0];
        return r != '' ? `/${r}` : '/';
    }

    getUrlParametersString(url) {
        if (!url.includes('?')) return false;
        
        return url.split('?')[1];
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
}