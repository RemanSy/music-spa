const Player = {
    tracks : [],
    player : document.querySelector('.player'),
    playBtn : document.querySelector('#play_arrow'),
    nextBtn : document.querySelector('#next_arrow'),
    prevBtn : document.querySelector('#prev_arrow'),
    audio : new Audio(),
    progressContainer : document.querySelector('.progress__container'),
    progress : document.querySelector('.progress'),
    volumeContainer : document.querySelector('.volume__container'),
    volume : document.querySelector('.volume'),
    toggleVolumeIcon : document.querySelector('.toggle__volume'),
    songIndex : 0,
    songs : [],

    loadAudio : function(div) {
        Player.audio.src = div.querySelector('.src').dataset.src;
        Player.player.querySelector('.audio__title').innerText = div.querySelector('.audio__title').innerText;
        Player.player.querySelector('.audio__group').innerText = div.querySelector('.audio__group').innerText;
        Player.playBtn.classList.remove('play');
    },

    playAudio : function() {
        let isPlaying = Player.playBtn.classList.contains('play');

        if (isPlaying) {
            Player.playBtn.innerText = 'play_arrow';
            Player.playBtn.classList.remove('play');
            Player.audio.pause();
        } else {
            Player.playBtn.innerText = 'pause';
            Player.playBtn.classList.add('play');
            Player.audio.play();
        }
    },

    updateProgress : function(e) {
        const duration = this.duration;
        const time = this.currentTime;
        
        Player.progress.style.width = `${time / duration * 100}%`;
    },

    setProgress : function(e) {
        const clickX = e.offsetX;
        const width = this.clientWidth;
        
        Player.audio.currentTime = clickX / width * Player.audio.duration;
    },

    setVolume : function(e) {
        const height = this.clientHeight;
        const offsetY = Math.abs(height - e.offsetY);
    
        Player.audio.volume = offsetY / height;
        Player.volume.style.height = `${offsetY / height * 100}%`;
    },

    toggleVolume : function() {
        if  (Player.audio.volume != 0) {
            Player.audio.prevVol = Player.audio.volume;
            Player.audio.volume = 0;
            this.innerText = 'volume_off';
            Player.volume.style.height = '0%';
        } else if (Player.audio.volume == 0) {
            Player.audio.volume = Player.audio.prevVol;
            this.innerText = 'volume_up';
            Player.volume.style.height = `${100 * Player.audio.volume}%`;
        }
    },

    nextSong : function() {
        Player.songIndex++;
        
        if (Player.songIndex > Player.tracks.length - 1) Player.songIndex = 0;
        
        if (Player.tracks.length == 0) return;

        Player.loadAudio(Player.tracks[Player.songIndex]);
        Player.playAudio();
    },

    prevSong : function() {
        Player.songIndex--;

        if (Player.songIndex < 0) Player.songIndex = Player.tracks.length - 1;

        if (Player.tracks.length == 0) return;

        Player.loadAudio(Player.tracks[Player.songIndex]);
        Player.playAudio();
    }
}

// Player event listeners
Player.playBtn.addEventListener('click', Player.playAudio);

Player.audio.addEventListener('timeupdate', Player.updateProgress);

Player.audio.addEventListener('ended', Player.nextSong);

Player.progressContainer.addEventListener('click', Player.setProgress);

Player.nextBtn.addEventListener('click', Player.nextSong);

Player.prevBtn.addEventListener('click', Player.prevSong);

Player.toggleVolumeIcon.addEventListener('mouseover', function () { Player.player.querySelector('.ch_volume').style.display = 'flex' });

Player.player.querySelector('.ch_volume').addEventListener('mouseleave', function () { this.style.display = 'none' });

// Player.toggleVolumeIcon.addEventListener('mouseleave', function () { setTimeout(() => Player.player.querySelector('.ch_volume').style.display = 'none', 500 )});

Player.toggleVolumeIcon.addEventListener('click', Player.toggleVolume);

Player.volumeContainer.addEventListener('click', Player.setVolume);