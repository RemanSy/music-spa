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

        // Get tracks
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

        // Handle favorite tracks
        if (this.app.isAuthorized()) {
            await this.xhr.sendRequest('GET', 'users/getFavTracks')
            .then(res => {
                if (res == 0) return;
                let trcs = JSON.parse(res);

                trcs.forEach(track => {
                    let pN = document.querySelector(`[data-src="uploads/${track.location}"]`)?.parentNode;
                    if (!pN) return;
                    pN.querySelector('.fav-icon').innerHTML = 'favorite';
                });
            });
        }

        // Get recent albums
        await this.xhr.sendRequest('GET', '/albums/get')
        .then(data => {
            data = JSON.parse(data);

            for (let i = 0; i < 8; i++) {
                if (!data[i]) continue;
                sliderRow.insertAdjacentHTML('beforeend', this.addSlide(data[i].album_id, data[i].group, data[i].title, data[i].image));
            }

        });

        // Add track to favorites
        document.querySelectorAll('.add_favorite').forEach(el => {
            el.addEventListener('click', e => {
                let file = e.target.parentNode.querySelector('.src').dataset.src;
                file = file.split('/')[1];
                let d = new FormData();
                d.append('file', file);
                d.append('token', this.decodeCookie().user);

                this.xhr.sendRequest('POST', '/users/fav', d)
                .then(res => {
                    
                    if (res == 1) {
                        e.target.innerHTML = 'favorite';
                        this.showMessage('Добавлено в понравившиеся');
                    } else if (res == 0) {
                        e.target.innerHTML = 'favorite_border';
                        this.showMessage('Удалено из понравившихся');
                    } else
                        this.showMessage('Ошибка добавления');

                });
            });
        });

        // Slider
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

        // Adding slide animation
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
                <span class="material-icons fav-icon add_favorite">favorite_border</span>
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