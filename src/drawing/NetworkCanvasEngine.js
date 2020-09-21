import convnetjs from 'convnetjs';

class NetworkCanvasEngine {
  constructor() {
    this.data = [];
    this.labels = [];
    this.ss = 16.0; // scale for drawing
    this.lix = 3;
    this.d0 = 0;
    this.d1 = 1;
    // create neural net
    this.spiralData();
    this.createNetwork();
    this.ctx = null;
    this.layerCanvasRefs = null;
  }

  prepareToDraw(ppalCanvas, layerCanvasRefs) {
    this.width = ppalCanvas.current.width;
    this.height = ppalCanvas.current.height;
    //alert(ppalCanvas.current.width);
    this.ctx = ppalCanvas.current.getContext('2d');
    this.layerCanvasRefs = layerCanvasRefs;
  }

  updateRefs() {
    this.visCtxArray = this.layerCanvasRefs.current.map((canvas) => {
      return canvas.current.getContext('2d');
    });
    this.nbLayers = this.visCtxArray.length;
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
    const start = new Date().getTime();

    const x = new convnetjs.Vol(1, 1, 2);
    for (let iters = 0; iters < 20; iters += 1) {
      for (let ix = 0; ix < this.N; ix += 1) {
        x.w = this.data[ix];
        this.trainer.train(x, this.labels[ix]);
      }
    }
    const end = new Date().getTime();
    //alert(end - start);
  }

  drawCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  drawRect(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawAxis() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgb(50,50,50)';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(this.width, this.height / 2);
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
  }

  getNbLayers() {
    return this.net.layers.length;
  }

  createNetwork() {
    this.layer_defs = [];
    this.layer_defs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: 2 });
    this.layer_defs.push({ type: 'fc', num_neurons: 6, activation: 'tanh' });
    this.layer_defs.push({ type: 'fc', num_neurons: 2, activation: 'tanh' });
    this.layer_defs.push({ type: 'softmax', num_classes: 2 });

    this.net = new convnetjs.Net();
    this.net.makeLayers(this.layer_defs);

    this.trainer = new convnetjs.SGDTrainer(this.net, {
      learning_rate: 0.01,
      momentum: 0.1,
      batch_size: 10,
      l2_decay: 0.001,
    });
  }

  reload() {
    this.createNetwork();
  }

  draw() {
    //clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.visCtxArray.forEach((visctx) =>
      visctx.clearRect(0, 0, this.width, this.height),
    );

    const netx = new convnetjs.Vol(1, 1, 2);
    const density = 5.0;
    const gridstep = 3;
    const gridx = new Array(this.nbLayers).fill([]);
    const gridy = new Array(this.nbLayers).fill([]);
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
          //ignore first layer
          for (let i = 1; i < this.nbLayers; i += 1) {
            const xt = this.net.layers[i].out_act.w[this.d0]; // in screen coords
            const yt = this.net.layers[i].out_act.w[this.d1]; // in screen coords
            gridx[i - 1].push(xt);
            gridy[i - 1].push(yt);
            gridl.push(a.w[0] > a.w[1]); // remember final label as well
          }
        }
      }
    }

    // draw axes
    this.drawAxis();

    // draw representation transformation axes for two neurons at some layer
    let mmx = [];
    let mmy = [];
    for (let i = 0; i < this.nbLayers; i += 1) {
      mmx.push(this.maxmin(gridx[i]));
      mmy.push(this.maxmin(gridy[i]));
    }

    if (this.nbLayers > 0) {
      //visctx.strokeStyle = 'rgb(50,50,50)';
      // TODO: set n for non square canvas
      const n = Math.floor(Math.sqrt(gridx[0].length)); // size of grid. Should be fine?
      const ng = gridx[0].length;
      let xraw1;
      let yraw1;
      let xraw2;
      let yraw2;
      for (let x = 0; x < n; x += 1) {
        for (let y = 0; y < n; y += 1) {
          for (let i = 0; i < this.nbLayers; i += 1) {
            this.visCtxArray[i].beginPath();
            // down
            let ix1 = x * n + y;
            let ix2 = x * n + 1;
            if (ix1 >= 0 && ix2 >= 0 && ix1 < ng && ix2 < ng && y < n - 1) {
              xraw1 = this.width * ((gridx[i][ix1] - mmx[i].minv) / mmx[i].dv);
              yraw1 = this.height * ((gridy[i][ix1] - mmy[i].minv) / mmy[i].dv);
              xraw2 = this.width * ((gridx[i][ix2] - mmx[i].minv) / mmx[i].dv);
              yraw2 = this.height * ((gridy[i][ix2] - mmy[i].minv) / mmy[i].dv);
              this.visCtxArray[i].moveTo(xraw1, yraw1);
              this.visCtxArray[i].lineTo(xraw2, yraw2);
            }

            // // and draw its color
            // if (gridl[ix1]) {
            //   this.visCtxArray[i].fillStyle = 'rgb(250, 150, 150)';
            // } else {
            //   this.visCtxArray[i].fillStyle = 'rgb(150, 250, 150)';
            // }
            // const sz = density * gridstep;
            // this.visCtxArray[i].fillRect(
            //   xraw1 - sz / 2 - 1,
            //   yraw1 - sz / 2 - 1,
            //   sz + 2,
            //   sz + 2,
            // );

            // right
            ix1 = (x + 1) * n + y;
            ix2 = x * n + y;

            if (ix1 >= 0 && ix2 >= 0 && ix1 < ng && ix2 < ng && x < n - 1) {
              for (let i = 0; i < this.nbLayers; i += 1) {
                xraw1 =
                  (this.width * (gridx[i][ix1] - mmx[i].minv)) / mmx[i].dv;
                yraw1 =
                  (this.height * (gridy[i][ix1] - mmy[i].minv)) / mmy[i].dv;
                xraw2 =
                  (this.width * (gridx[i][ix2] - mmx[i].minv)) / mmx[i].dv;
                yraw2 =
                  (this.height * (gridy[i][ix2] - mmy[i].minv)) / mmy[i].dv;
                this.visCtxArray[i].moveTo(xraw1, yraw1);
                this.visCtxArray[i].lineTo(xraw2, yraw2);
              }
            }
            this.visCtxArray[i].closePath();
          }
        }
      }
      this.visCtxArray.forEach((visctx) => visctx.stroke());
    }

    // // draw datapoints.
    // this.ctx.strokeStyle = 'rgb(0,0,0)';
    // this.ctx.lineWidth = 1;
    // let fillStyle = '';
    // for (let i = 0; i < this.N; i += 1) {
    //   if (this.labels[i] === 1) {
    //     fillStyle = 'rgb(100,200,100)';
    //   } else {
    //     fillStyle = 'rgb(200,100,100)';
    //   }

    //   this.ctx.fillStyle = fillStyle;

    //   this.drawCircle(
    //     this.ctx,
    //     this.data[i][0] * this.ss + this.width / 2,
    //     this.data[i][1] * this.ss + this.height / 2,
    //     3.0,
    //   );

    //   // also draw transformed data points while we're at it
    //   [netx.w[0], netx.w[1]] = this.data[i];
    //   var a = this.net.forward(netx, false);

    //   this.visCtxArray.forEach((ctx) => {
    //     ctx.fillStyle = fillStyle;
    //   });

    //   for (let i = 0; i < this.nbLayers; i += 1) {
    //     const xt =
    //       (this.width *
    //         (this.net.layers[i + 1].out_act.w[this.d0] - mmx[i].minv)) /
    //       mmx[i].dv; // in screen coords
    //     const yt =
    //       (this.height *
    //         (this.net.layers[i + 1].out_act.w[this.d1] - mmy[i].minv)) /
    //       mmy[i].dv; // in screen coords

    //     //alert(`${this.visCtxArray[i].fillStyle} ... ${this.labels[i]}`);
    //     this.drawCircle(this.visCtxArray[i], xt, yt, 3.0);
    //   }
    // }
  }

  drawTry() {
    debugger;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.visCtxArray.forEach((visctx) =>
      visctx.clearRect(0, 0, this.width, this.height),
    );
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.visCtxArray.forEach((visctx, i) => {
      const fill = i * 30;
      visctx.fillStyle = `rgb(250, 100, ${fill})`;
      //this.visCtxArray.fillStyle = `rgb(100,100, 100)`;
      //alert(visctx.fillStyle);
    });
    this.drawRect(this.ctx, 0, 0, this.width, this.height);
    this.visCtxArray.forEach((visctx, i) => {
      //alert(`i: ${i} i*10: ${i * 10} (i+1)*10: ${(i + 1) * 10}`);
      this.drawRect(visctx, 0, i * 30, this.width, 30);
    });
  }
}

export default NetworkCanvasEngine;
