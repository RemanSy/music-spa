import Form from "./Form.js";

export default class extends Form {
    title = 'Группа';

    getHTML() {
        return `
            <section class="group">
                <div class="container flex">
                    <div class="meta">
                        <div class="image_container">
                            <img src="uploads/4469404a433dc6e01e89d6af88068ff3.jpg" class="group__img">
                        </div>
                        <div class="info">
                            
                            <div>Исполнитель</div>
                            <div class="group__title">Disturbed</div>
                            <div class="buttons">
                                <button class="listen btn"><i class="material-icons">play_arrow</i> Слушать</button>
                                <span class="material-icons fav-icon btn">favorite_border</span>
                            </div>

                        </div>
                    </div>
                    <div class="menu">
                        <span data-class="start-tracks" id="menu_tracks">Треки</span>
                        <span data-class="start-albums" id="menu_albums">Альбомы</span>
                        <div class="animation start-tracks"></div>
                    </div>
                    <ol class="track_list">

                    </ol>
                    
                    <div class="container flex albums_list">
                    
                    </div>
                </div>
            </section>
        `;
    }

    async scripts() {
        const params = this.getUrlParameters(window.location.href);
        const trackList = document.querySelector('.track_list');
        const albumList = document.querySelector('.albums_list');
        const menuAlbums = document.querySelector('#menu_albums');
        const menuTracks = document.querySelector('#menu_tracks');

        if (!params.gid) return console.log('ID doesn\'t exist');

        document.querySelectorAll('.menu span').forEach(el => {
            el.addEventListener('click', e => {
                let anim = document.querySelector('.menu .animation');
                anim.className = 'animation';
                anim.classList.add(e.target.dataset.class);
            });
        });

        this.xhr.sendRequest('GET', `groups/get?id=${params.gid}`)
        .then(res => {
            console.log(res);
        });

        menuTracks.addEventListener('click', async () => {
            albumList.style.display = 'none';
            trackList.style.display = 'block';
            trackList.innerHTML = '';

            // Load tracks
            await this.xhr.sendRequest('GET', `/groups/getTracks?id=${params.gid}`)
            .then(res => {
                let tracks = JSON.parse(res);
                trackList.innerHTML = '';
                
                tracks.forEach(track => {
                    trackList.insertAdjacentHTML('beforeend', this.loadTrack(track.title, track.group, track.duration, track.location));
                });
            });

            // Load tracks into player
            Player.tracks = document.querySelectorAll('li.track_info');

            Player.tracks.forEach((track, key) => {
                track.addEventListener('click', () => {
                    Player.songIndex = key;
                    Player.loadAudio(track);
                    Player.playAudio();
                });
            });
        });


        menuAlbums.addEventListener('click', async () => {
            albumList.style.display = 'flex';
            trackList.style.display = 'none';
            albumList.innerHTML = '';

            // Load albums
            await this.xhr.sendRequest('GET', `/groups/getAlbums?id=${params.gid}`)
            .then(res => {
                let albums = JSON.parse(res);
                trackList.innerHTML = '';

                albums.forEach(album => {
                    albumList.insertAdjacentHTML('afterbegin', this.loadAlbum(album.album_id, album.group, album.title, album.image));
                });
            });

            document.querySelectorAll('.album_el').forEach(el => {
                el.addEventListener('mouseover', function() { el.querySelector('.el__text').classList.add('shown') });
    
                el.addEventListener('mouseout', function() { el.querySelector('.el__text').classList.remove('shown') });
            });
        });

        document.querySelector('#menu_tracks').click();

    }

    loadTrack(title, group, duration, location) {
        return `
        <li class="track_info flex justify-evenly">
            <div class="audio__ctrls">
                <i class="material-icons">play_arrow</i>
            </div>
            <span class="audio__title">${title}</span>
            <span class="audio__group">${group}</span>
            <span class="material-icons fav-icon add_favorite">favorite_border</span>
            <span class="duration">${duration}</span>
            <div class="src" data-src="uploads/${location}"></div>
        </li>
        `;
    };

    loadAlbum(aId, aGTitle, aAlbum, aCover) {
        return `
            <div class="album_el" style="background-image : url('uploads/${aCover}')">
                <div class="el__text">
                    <a href="/album?alid=${aId}" data-link>
                        <span>${aGTitle}</span>
                        <span>${aAlbum}</span>
                    </a>
                </div>
            </div>
        `;
    }
}