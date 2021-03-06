const API_KEY = `86MLL630E3X98X0D`;

const searchForm = $('#search'),
      query = $('#query'),
      player = $('#player'),
      tracksList = $('#tracks'),
      playerTemplate = $('.player-custom'),
      control = {
          btn: $('#control'),
          prev: $('#prev'),
          next: $('#next')
      };

let changeTrack = function(direction) {
    return function(){
        let current = tracksList.find('.in-player');
        let nextItem = current[direction]();
        onPlayTrack(nextItem);
    }
}

let nextTrack = changeTrack('next'),
    prevTrack = changeTrack('prev');

control.prev.on('click', prevTrack);
control.next.on('click', nextTrack);

control.btn.on('click', function(e){
    if (e.target !== e.currentTarget) {
        let elem = $(e.target);
        elem.addClass('hidden')
            .siblings()
            .removeClass('hidden');

        if (elem.hasClass('play')) {
            player.get(0).play();
        } else {
            player.get(0).pause();
        }
    }
});
tracksList.on('click', 'li', function(){
    let element = $(this);
    onPlayTrack(element);
})

function onPlayTrack(element){
    let id = element.attr('data-id'),
        indexInList = element.index();

    if (indexInList < 0 || indexInList > 19) return;
    
    element.addClass('in-player')
           .siblings()
           .removeClass('in-player');

    playerTemplate.removeClass('hidden')
                .find('.play')
                .addClass('hidden')
                .next()
                .removeClass('hidden');  
           
    let URI = `http://freemusicarchive.org/services/track/single/${id}.json?api_key=${API_KEY}`;
    $.get(URI, (response)=>{
       let track = JSON.parse(response);
       console.log('in player ->', track);
       $('#album_img').attr('src', track.track_image_file);
       player.attr('src', track.track_listen_url);
       player.attr('autoplay', true);
    })
}

searchForm.on('submit', (event) => {
    event.preventDefault();
    let requestText = query.val();
    if (requestText) {
        const URI = `https://freemusicarchive.org/api/trackSearch?q=${requestText}&limit=20&api_key=${API_KEY}`
        $.get(URI,(data) => {
            let parsed = JSON.parse(data).aRows;
            tracksList.html('');
            parsed.forEach(item => {
                let indexOfArtist = item.indexOf(']'),
                    indexOfId = item.lastIndexOf('(');
                    
                let trackData = {
                    artist: item.slice(1,indexOfArtist),
                    title: item.slice(indexOfArtist + 1, indexOfId),
                    id: item.slice(indexOfId + 1, -1)
                }
                
                tracksList.append(`
                    <li data-id="${trackData.id}">
                      <strong> 
                        ${trackData.artist}
                      </strong>
                      <em>
                        ${trackData.title}
                      </em> 
                    </li>
                `)
            })
            
        });
    }
})
