import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    title = 'Авторизация';

    getHTML() {
        return `
            <section class="registerForm">
                <div class="title">Авторизация</div>
                <div class="container flex">
                    <form action="addUser" method="POST" class="form-register">

                        <div class="form-control">
                            <label for="email">Email</label>
                            <input type="email" name="email" id="email" required>
                        </div>

                        <div class="form-control">
                            <label for="password">Пароль</label>
                            <input type="password" name="password" id="password" required>
                        </div>

                        <div class="error d-none"></div>
                        <button class="btn">Войти</button>
                    </form>
                    <a href="/registrationForm" data-link>Не зарегистрированы? Не узнали? Зарегистрируйтесь...</a>
                    </div>
            </section>
        `;
    }

    scripts() {
        const form = document.querySelector('form.form-register'),
              nav = document.querySelector('div.nav'),
              err = form.querySelector('.error');

        form.addEventListener('submit', e => {
            e.preventDefault();

            let genT = () => Math.random().toString(36).slice(2);
            let token = genT() + genT();

            err.classList.add('d-none');

            let formData = new FormData(e.target);
            formData.append('token', token);

            this.xhr.sendRequest('POST', '/users/auth', formData)
            .then(res => {
                if (res == 0) {
                    err.classList.remove('d-none');
                    err.classList.add('flex');
                    return err.innerHTML = 'Неправильный логин или пароль';
                } else if (res == 1) {
                    if (res == '') history.back();
                    
                    document.cookie = `user=${token}`;

                    this.xhr.sendRequest('GET', '/templates/nav')
                    .then(res => nav.innerHTML = res);
                } else {
                    err.classList.remove('d-none');
                    err.classList.add('flex');
                    return err.innerHTML = 'Ошибка сервера';
                }
            });
        });
    }
}