// youtube api
//----------------------------------
export function loadYoutubeApi() {
  console.log('player detected')
  var tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  var firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

  let player

  function onYouTubeIframeAPIReady(videoID) {
    if (videoID) {
      player = new YT.Player(videoID, {
        width: 1280,
        height: 720,
        videoId: videoID,
        playerVars: { autoplay: 1, playsinline: 1 },
        events: {
          onReady: onPlayerReady,
        },
      })
    }
  }

  function onPlayerReady(event) {
    // event.target.mute()
    // event.target.setVolume(70);
    event.target.playVideo()
    currentBtn.classList.add('d-none')
    document.querySelector('iframe').contentWindow.postMessage('text', '*')
  }

  const playVideo = document.querySelectorAll('.yt-play-btn svg')

  let currentBtn

  playVideo.forEach((btn) => {
    btn.addEventListener('click', () => {
      let videoURL = btn
        .closest('.video-container')
        .getAttribute('data-video-id')

      onYouTubeIframeAPIReady(videoURL)

      currentBtn = btn.closest('.overlay')
    })
  })
}
