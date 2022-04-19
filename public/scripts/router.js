import mainPage from "./views/mainPage.js";
import registrationForm from "./views/registrationForm.js";
import profile from "./views/profile.js";
import authForm from "./views/authForm.js";
import groupForm from "./views/groupForm.js";
import albumForm from "./views/albumForm.js";

class Router {
    getRoute(url) {
        url = this.getUrlPath(url);
        
        switch(url) {
            case '/':
                this.renderPage(new mainPage());
                break;

            case '/groupForm':
                this.renderPage(new groupForm());
                break;

            case '/albumForm':
                this.renderPage(new albumForm());
                break;

            case '/registrationForm':
                this.renderPage(new registrationForm());
                break;

            case '/authForm':
                this.renderPage(new authForm());
                break;

            case '/profile':
                this.renderPage(new profile());
                break;

            default:
                title.innerHTML = '404';
                main.innerHTML = '<h1>404 - Страница не найдена</h1>';
                break;
        }
    }

    navigateTo(url) {
        history.pushState({}, null, url);
        this.getRoute(url);
    }

    renderPage(c) {
        title.innerHTML = c.title;
        main.innerHTML = c.getHTML();
        c.scripts();
    }

    getUrlPath(url) {
        if (!url.includes('//')) return url;

        let r = url.split('//')[1].split('/').slice(1)[0];
        return r != '' ? `/${r}` : '/';
    }
}

const title = document.querySelector('title'),
      main = document.querySelector('main.main'),
      router = new Router();

document.body.addEventListener('click', e => {
    let t = e.target;
    if (t.tagName === 'A' && t.dataset.link != undefined) {
        e.preventDefault();
        router.navigateTo(t.href);
    }
});

window.addEventListener('load', e => {
    e.preventDefault();
    router.getRoute(window.location.pathname);
});

window.addEventListener('popstate', (e) => router.navigateTo(e.target.location.pathname));