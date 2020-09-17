import convnetjs from 'convnetjs';

class NetworkCanvasEngine {
  constructor() {
    this.data = [];
    this.labels = [];
    this.ss = 50.0; // scale for drawing
    this.lix = 3;
    this.d0 = 0;
    this.d1 = 1;
    this.ctxList = [];
    // create neural net
    this.spiralData();
    this.createNetwork();
  }

  prepareToDraw() {
    this.ctx = this.ctxList[0];
    this.visctx = this.ctxList[1];
  }

  addCanvas(canvas) {
    if (!this.width) {
      this.width = canvas.width;
      this.height = canvas.height;
    }
    this.ctxList.push(canvas.getContext('2d'));
  }

  maxmin = function (w) {
    if (w.length === 0) {
      return {};
    } // ... ;s

    let maxv = w[0];
    let minv = w[0];
    let maxi = 0;
    let mini = 0;
    for (let i = 1; i < w.length; i += 1) {
      if (w[i] > maxv) {
        maxv = w[i];
        maxi = i;
      }
      if (w[i] < minv) {
        minv = w[i];
        mini = i;
      }
    }
    return { maxi: maxi, maxv: maxv, mini: mini, minv: minv, dv: maxv - minv };
  };

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

  spiralData() {
    this.data = [];
    this.labels = [];
    var n = 100;
    for (let i = 0; i < n; i += 1) {
      const r = (i / n) * 5 + convnetjs.randf(-0.1, 0.1);
      const t = ((1.25 * i) / n) * 2 * Math.PI + convnetjs.randf(-0.1, 0.1);
      this.data.push([r * Math.sin(t), r * Math.cos(t)]);
      this.labels.push(1);
    }
    for (let i = 0; i < n; i += 1) {
      const r = (i / n) * 5 + convnetjs.randf(-0.1, 0.1);
      const t =
        ((1.25 * i) / n) * 2 * Math.PI + Math.PI + convnetjs.randf(-0.1, 0.1);
      this.data.push([r * Math.sin(t), r * Math.cos(t)]);
      this.labels.push(0);
    }
    this.N = this.data.length;
  }

  update() {
    const x = new convnetjs.Vol(1, 1, 2);
    for (let iters = 0; iters < 5; iters += 1) {
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
    this.layer_defs = [];
    this.layer_defs.push({
      type: 'input',
      out_sx: 1,
      out_sy: 1,
      out_depth: 2,
    });
    this.layer_defs.push({
      type: 'fc',
      num_neurons: 12,
      activation: 'tanh',
    });
    this.layer_defs.push({
      type: 'fc',
      num_neurons: 12,
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

    // draw representation transformation axes for two neurons at some layer
    const mmx = this.maxmin(gridx);
    const mmy = this.maxmin(gridy);
    this.visctx.clearRect(0, 0, this.width, this.height);
    //visctx.strokeStyle = 'rgb(50,50,50)';
    const n = Math.floor(Math.sqrt(gridx.length)); // size of grid. Should be fine?
    const ng = gridx.length;
    this.visctx.beginPath();
    let xraw1;
    let yraw1;
    let xraw2;
    let yraw2;
    for (let x = 0; x < n; x += 1) {
      for (let y = 0; y < n; y += 1) {
        // down
        let ix1 = x * n + y;
        let ix2 = x * n + y + 1;
        if (ix1 >= 0 && ix2 >= 0 && ix1 < ng && ix2 < ng && y < n - 1) {
          xraw1 = this.width * ((gridx[ix1] - mmx.minv) / mmx.dv);
          yraw1 = this.height * ((gridy[ix1] - mmy.minv) / mmy.dv);
          xraw2 = this.width * ((gridx[ix2] - mmx.minv) / mmx.dv);
          yraw2 = this.height * ((gridy[ix2] - mmy.minv) / mmy.dv);
          this.visctx.moveTo(xraw1, yraw1);
          this.visctx.lineTo(xraw2, yraw2);
        }

        // and draw its color
        if (gridl[ix1]) {
          this.visctx.fillStyle = 'rgb(250, 150, 150)';
        } else {
          this.visctx.fillStyle = 'rgb(150, 250, 150)';
        }
        const sz = density * gridstep;
        this.visctx.fillRect(
          xraw1 - sz / 2 - 1,
          yraw1 - sz / 2 - 1,
          sz + 2,
          sz + 2,
        );

        // right
        ix1 = (x + 1) * n + y;
        ix2 = x * n + y;

        if (ix1 >= 0 && ix2 >= 0 && ix1 < ng && ix2 < ng && x < n - 1) {
          xraw1 = (this.width * (gridx[ix1] - mmx.minv)) / mmx.dv;
          yraw1 = (this.height * (gridy[ix1] - mmy.minv)) / mmy.dv;
          xraw2 = (this.width * (gridx[ix2] - mmx.minv)) / mmx.dv;
          yraw2 = (this.height * (gridy[ix2] - mmy.minv)) / mmy.dv;
          this.visctx.moveTo(xraw1, yraw1);
          this.visctx.lineTo(xraw2, yraw2);
        }
      }
    }
    this.visctx.stroke();

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
      [netx.w[0], netx.w[1]] = this.data[i];
      var a = this.net.forward(netx, false);

      const xt =
        (this.width *
          (this.net.layers[this.lix].out_act.w[this.d0] - mmx.minv)) /
        mmx.dv; // in screen coords
      const yt =
        (this.height *
          (this.net.layers[this.lix].out_act.w[this.d1] - mmy.minv)) /
        mmy.dv; // in screen coords
      if (this.labels[i] === 1) {
        this.visctx.fillStyle = 'rgb(100,200,100)';
      } else {
        this.visctx.fillStyle = 'rgb(200,100,100)';
      }
      this.visctx.beginPath();
      this.visctx.arc(xt, yt, 5.0, 0, Math.PI * 2, true);
      this.visctx.closePath();
      this.visctx.stroke();
      this.visctx.fill();
    }
  }
}

export default NetworkCanvasEngine;
