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

                <section class="releases">
                    <div class="container flex">
                        <div class="slider">
                            <span class="material-icons arrow-left">arrow_back_ios</span>
                            <span class="material-icons arrow-right">arrow_forward_ios</span>
                            
                            <div class="sliderRow"></div>
                        </div>
                    </div>
                </section>
        `;
    }

    async scripts() {
        const content = document.querySelector('section.last-uploaded div.container.flex');
        const sliderRow = document.querySelector('.releases .slider .sliderRow');

        await this.xhr.sendRequest('GET', '/tracks/get')
        .then(data => {
            data = JSON.parse(data);
            
            for (let i = data.length - 1; i > data.length - 7; i--)
                content.insertAdjacentHTML('beforeend', this.addRow(data[i].location, data[i].cover, data[i].title, data[i].group, data[i].duration));

            Player.tracks = document.querySelectorAll('.audio__row');

            Player.tracks.forEach((track, key) => {
                track.querySelector('.audio__ctrls').addEventListener('click', () => {
                    Player.songIndex = key;
                    Player.loadAudio(track);
                    Player.playAudio();
                });
            });
        });

        await this.xhr.sendRequest('GET', '/albums/get')
        .then(data => {
            data = JSON.parse(data);

            for (let i = 0; i < 8; i++) {
                if (!data[i]) continue;
                sliderRow.insertAdjacentHTML('beforeend', this.addSlide(data[i].album_id, data[i].group, data[i].title, data[i].image));
            }

        });

        const arrowR = document.querySelector('.slider .arrow-right');
        const arrowL = document.querySelector('.slider .arrow-left');

        let slideIndex = 0;
        let slides = document.querySelectorAll('.slider .slide').length;

        arrowR.addEventListener('click', () => {
            if (slideIndex + 5 <= slides) {
                slideIndex += 1;
                sliderRow.style.marginLeft = `${slideIndex * -258}px`;
            }
        });

        arrowL.addEventListener('click', () => {
            if (slideIndex >= 1) {
                slideIndex -= 1;
                sliderRow.style.marginLeft = `${slideIndex * -258}px`;
            }
        });

        document.querySelectorAll('.slider .slide').forEach(slide => {
                slide.addEventListener('mouseover', function() { slide.querySelector('.slide__text').classList.add('shown') });

                slide.addEventListener('mouseout', function() { slide.querySelector('.slide__text').classList.remove('shown') });
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

    addSlide(aId, aGTitle, aAlbum, aCover) {
        return `
            <div class="slide" style="background-image : url('uploads/${aCover}')">
                <div class="slide__text">
                    <a href="/album?alid=${aId}" data-link>
                        <span>${aGTitle}</span>
                        <span>${aAlbum}</span>
                    </a>
                </div>
            </div>
        `;
    }
}