import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    title = 'Главная страница';

    getHTML() {
        return `
                <section class="last-uploaded">
                    <div class="container flex">
                        <div class="title">Последнее</div>
                    </div>
                </section>
        `;
    }

    async scripts() {
        const content = document.querySelector('section.last-uploaded div.container.flex');

        await this.xhr.sendRequest('GET', '/tracks/get')
        .then(data => {
            data = JSON.parse(data);
            data.forEach(el =>
                content.insertAdjacentHTML('beforeend', this.addRow(el.location, el.cover, el.title, el.group, el.duration)));

            Player.tracks = document.querySelectorAll('.audio__row');

            Player.tracks.forEach((track, key) => {
                track.querySelector('.audio__ctrls').addEventListener('click', () => {
                    Player.songIndex = key;
                    Player.loadAudio(track);
                    Player.playAudio();
                });
            });
        });
    }

    addRow(src, cover, title, group, duration) {
        return `
            <div class="audio__row">
                <div class="audio__ctrls">
                    <i class="material-icons">play_arrow</i>
                </div>
                <div class="src" data-src="uploads/${src}"></div>
                <img src="uploads/${cover}" alt="cover" class="audio__cover">
                <div class="flex">
                    <div class="audio__title">${title}</div>
                    -
                    <div class="audio__group">${group}</div>
                </div>
                <span class="material-icons fav-icon">favorite_border</span>
                <div class="audio__duration">${duration}</div>
            </div>
        `;
    }
}