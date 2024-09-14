import express from 'express';
import expressWs from 'express-ws';
import wsStream from 'websocket-stream/stream.js';
import Ffmpeg from 'fluent-ffmpeg';

Ffmpeg.setFfmpegPath('D:\\FFmpeg\\ffmpeg-7.0.2-full_build\\bin\\ffmpeg.exe');

const app = express();
expressWs(app, null, {
  leaveRouterUntouched: true,
});
app.use(express.static(import.meta.dirname));
app.ws('/ws/rtsp/:id/', (ws, req) => {
  console.log('rtsp request handle.');
  ws.on('message', function(msg) {
    console.log(msg);
  });
  const stream = wsStream(ws, {
    binary: true,
    browserBufferTimeout: 10 * 1000
  }, {
    browserBufferTimeout: 10 * 1000
  });
  const url = req.query.url;
  try {
    Ffmpeg(url)
      .addInputOption('-rtsp_transport', 'tcp', '-buffer_size', '102400')
      .on('start', () => {
        console.log(`${url} Stream started.`);
      })
      .on('codecData', () => {
        console.log(`${url} Stream codecData.`);
      })
      .on('error', (err) => {
        console.error(`${url} An error occured: ${err}`);
      })
      .on('end', () => {
        console.log(`${url} Stream end.`);
      })
      .outputFormat('mp4')
      .videoCodec('copy')
      .noAudio()
      .pipe(stream);
  } catch(err) {
    console.error(err);
  }
});
app.listen(8888);
console.log('Listened port: 8888.');

