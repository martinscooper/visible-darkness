import convnetjs from 'convnetjs';

class NetworkCanvasEngine {
  constructor() {
    this.data = [];
    this.labels = [];
    this.ss = 50.0; // scale for drawing
    this.lix = 1;
    this.d0 = 0;
    this.d1 = 1;
    // create neural net
    this.layer_defs = [];
    this.circleData();
    this.createNetwork();
  }

  setCanvas(canvas) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  circleData() {
    for (let i = 0; i < 50; i += 1) {
      const r = convnetjs.randf(0.0, 2.0);
      const t = convnetjs.randf(0.0, 2 * Math.PI);
      this.data.push([r * Math.sin(t), r * Math.cos(t)]);
      this.labels.push(1);
    }
    for (let i = 0; i < 50; i += 1) {
      const r = convnetjs.randf(3.0, 5.0);
      const t = (2 * Math.PI * i) / 50.0;
      this.data.push([r * Math.sin(t), r * Math.cos(t)]);
      this.labels.push(0);
    }
    this.N = this.data.length;
  }

  update() {
    const x = new convnetjs.Vol(1, 1, 2);
    for (let iters = 0; iters < 20; iters += 1) {
      for (let ix = 0; ix < this.N; ix += 1) {
        x.w = this.data[ix];
        this.trainer.train(x, this.labels[ix]);
      }
    }
  }

  drawCircle(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  }

  drawRect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawAxis(WIDTH, HEIGHT) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgb(50,50,50)';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(0, HEIGHT / 2);
    this.ctx.lineTo(WIDTH, HEIGHT / 2);
    this.ctx.moveTo(WIDTH / 2, 0);
    this.ctx.lineTo(WIDTH / 2, HEIGHT);
    this.ctx.stroke();
  }

  createNetwork() {
    this.layer_defs.push({
      type: 'input',
      out_sx: 1,
      out_sy: 1,
      out_depth: 2,
    });
    this.layer_defs.push({
      type: 'fc',
      num_neurons: 6,
      activation: 'tanh',
    });
    this.layer_defs.push({
      type: 'fc',
      num_neurons: 2,
      activation: 'tanh',
    });
    this.layer_defs.push({
      type: 'softmax',
      num_classes: 2,
    });
    this.net = new convnetjs.Net();
    this.net.makeLayers(this.layer_defs);
    this.trainer = new convnetjs.SGDTrainer(this.net, {
      learning_rate: 0.01,
      momentum: 0.1,
      batch_size: 10,
      l2_decay: 0.001,
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update();
    const netx = new convnetjs.Vol(1, 1, 2);
    const density = 5.0;
    const gridstep = 2;
    const gridx = [];
    const gridy = [];
    const gridl = [];
    for (let x = 0.0, cx = 0; x <= this.width; x += density, cx += 1) {
      for (let y = 0.0, cy = 0; y <= this.height; y += density, cy += 1) {
        netx.w[0] = (x - this.width / 2) / this.ss;
        netx.w[1] = (y - this.height / 2) / this.ss;
        const a = this.net.forward(netx, false);

        //  if (a.w[0] > a.w[1]) ctx.fillStyle = "rgb(250, 150, 150)";
        //  else ctx.fillStyle = "rgb(150, 250, 150)";

        this.ctx.fillStyle = `rgb( ${Math.floor(a.w[0] * 255)}, ${Math.floor(
          a.w[1] * 255,
        )}, 100, ${a.w[0] > a.w[1] ? a.w[0] : a.w[1]})`;

        this.ctx.fillRect(
          x - density / 2 - 1,
          y - density / 2 - 1,
          density + 2,
          density + 2,
        );

        if (cx % gridstep === 0 && cy % gridstep === 0) {
          // record the transformation information
          const xt = this.net.layers[this.lix].out_act.w[this.d0]; // in screen coords
          const yt = this.net.layers[this.lix].out_act.w[this.d1]; // in screen coords
          gridx.push(xt);
          gridy.push(yt);
          gridl.push(a.w[0] > a.w[1]); // remember final label as well
        }
      }
    }

    // draw axes
    this.drawAxis(this.width, this.height);

    // // draw representation transformation axes for two neurons at some layer
    // const mmx = convnetjs.cnnutil.maxmin(gridx);
    // const mmy = convnetjs.cnnutil.maxmin(gridy);
    // //visctx.clearRect(0, 0, visWIDTH, visHEIGHT);
    // //visctx.strokeStyle = 'rgb(50,50,50)';
    // const n = Math.floor(Math.sqrt(gridx.length)); // size of grid. Should be fine?
    // const ng = gridx.length;
    // visctx.beginPath();
    // let xraw1;
    // let yraw1;
    // let xraw2;
    // let yraw2;
    // for (let x = 0; x < n; x += 1) {
    //   for (let y = 0; y < n; y += 1) {
    //     // down
    //     let ix1 = x * n + y;
    //     let ix2 = x * n + y + 1;
    //     if (ix1 >= 0 && ix2 >= 0 && ix1 < ng && ix2 < ng && y < n - 1) {
    //       xraw1 = visWIDTH * ((gridx[ix1] - mmx.minv) / mmx.dv);
    //       yraw1 = visHEIGHT * ((gridy[ix1] - mmy.minv) / mmy.dv);
    //       xraw2 = visWIDTH * ((gridx[ix2] - mmx.minv) / mmx.dv);
    //       yraw2 = visHEIGHT * ((gridy[ix2] - mmy.minv) / mmy.dv);
    //       visctx.moveTo(xraw1, yraw1);
    //       visctx.lineTo(xraw2, yraw2);
    //     }

    //     // and draw its color
    //     if (gridl[ix1]) {
    //       visctx.fillStyle = 'rgb(250, 150, 150)';
    //     } else {
    //       visctx.fillStyle = 'rgb(150, 250, 150)';
    //     }
    //     const sz = density * gridstep;
    //     visctx.fillRect(xraw1 - sz / 2 - 1, yraw1 - sz / 2 - 1, sz + 2, sz + 2);

    //     // right
    //     ix1 = (x + 1) * n + y;
    //     ix2 = x * n + y;

    //     if (ix1 >= 0 && ix2 >= 0 && ix1 < ng && ix2 < ng && x < n - 1) {
    //       xraw1 = (visWIDTH * (gridx[ix1] - mmx.minv)) / mmx.dv;
    //       yraw1 = (visHEIGHT * (gridy[ix1] - mmy.minv)) / mmy.dv;
    //       xraw2 = (visWIDTH * (gridx[ix2] - mmx.minv)) / mmx.dv;
    //       yraw2 = (visHEIGHT * (gridy[ix2] - mmy.minv)) / mmy.dv;
    //       visctx.moveTo(xraw1, yraw1);
    //       visctx.lineTo(xraw2, yraw2);
    //     }
    //   }
    // }
    // visctx.stroke();

    // draw datapoints.
    this.ctx.strokeStyle = 'rgb(0,0,0)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.N; i += 1) {
      if (this.labels[i] === 1) {
        this.ctx.fillStyle = 'rgb(100,200,100)';
      } else {
        this.ctx.fillStyle = 'rgb(200,100,100)';
      }

      this.drawCircle(
        this.data[i][0] * this.ss + this.width / 2,
        this.data[i][1] * this.ss + this.height / 2,
        5.0,
      );

      // also draw transformed data points while we're at it
      // [netx.w[0], netx.w[1]] = this.data[i];
      // const xt =
      //   (visWIDTH * (this.net.layers[this.lix].out_act.w[this.d0] - mmx.minv)) /
      //   mmx.dv; // in screen coords
      // const yt =
      //   (visHEIGHT *
      //     (this.net.layers[this.lix].out_act.w[this.d1] - mmy.minv)) /
      //   mmy.dv; // in screen coords
      // if (this.labels[i] === 1) {
      //   visctx.fillStyle = 'rgb(100,200,100)';
      // } else {
      //   visctx.fillStyle = 'rgb(200,100,100)';
      // }
      // visctx.beginPath();
      // visctx.arc(xt, yt, 5.0, 0, Math.PI * 2, true);
      // visctx.closePath();
      // visctx.stroke();
      // visctx.fill();
    }
  }
}

export default NetworkCanvasEngine;
