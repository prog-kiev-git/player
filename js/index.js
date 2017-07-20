const API_KEY = `86MLL630E3X98X0D`;

const searchForm = $('#search'),
      query = $('#query'),
      player = $('#player'),
      tracksList = $('#tracks'); 


tracksList.on('click', 'li', function(){
    let element = $(this);
    let id = element.data('id'),
        URI = `http://freemusicarchive.org/services/track/single/${id}.json?api_key=${API_KEY}`;
    $.get(URI, (response)=>{
       let track = JSON.parse(response);
        // console.log(track);
       player.attr('src', track.track_listen_url);
       player.attr('autoplay', true);
    })
})

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
                    
                var trackData = {
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
