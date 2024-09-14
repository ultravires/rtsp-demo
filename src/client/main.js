import flvjs from 'flv.js';

if (flvjs.isSupported()) {
  /**
   * @type {HTMLVideoElement}
   */
  const videoElement = document.getElementById('videoElement');
  const flvPlayer = flvjs.createPlayer({
    type: 'flv',
    url: 'ws://127.0.0.1:8888/ws/rtsp/1/?url=rtsp://stream.strba.sk:1935/strba/VYHLAD_JAZERO.stream',
    isLive: true,
    hasAudio: false,
    hasVideo: true,
    withCredentials: true,
    cors: true
  }, {
    enableWorker: false,
    enableStashBuffer: false,
    lazyLoad: false,
    lazyLoadMaxDuration: 0,
    lazyLoadRecoverDuration: 0,
    deferLoadAfterSourceOpen: false,
    fixAudioTimestampGap: true,
    autoCleanupSourceBuffer: true
  });
  if (videoElement) {
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    setTimeout(() => {
      flvPlayer.play();
    }, 1000)
  } else {
    flvPlayer.unload();
    flvPlayer.destroy();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      flvPlayer.play();
    } else {
      flvPlayer.pause();
    }
  });

  window.onclose = () => {
    flvPlayer.unload();
    flvPlayer.destroy();
  };
}
