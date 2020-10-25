import convnetjs from 'convnetjs';

/*
now that im using a carousel for showing layers
there is no point in computing the outputs of all layers
if only one of them is being showed. fuck
*/

class NetworkCanvasEngine {
  constructor() {
    this.data = [];
    this.labels = [];
    this.ss = 25.0; // scale for drawing
    this.d0 = [];
    this.d1 = [];
    // create neural net
    this.spiralData();
    this.initNetInfo();
    this.createNetwork();
    this.ctx = null;
    this.layerCanvasRefs = null;
    this.loss = 0;
  }

  initNetInfo() {
    this.layersInfo = Array();

    this.layersInfo[0] = {
      nbNeurons: 6,
      activation: 'tanh',
    };
  }

  addLayer(nbNeurons, activation) {
    this.layersInfo[this.layersInfo.length] = {
      nbNeurons,
      activation,
    };
    this.reload();
  }

  removeLayer(layerIx) {
    this.layersInfo.splice(layerIx - 1, 1);
    this.reload();
  }

  modifyLayer(layerIx, nbNeurons, activation) {
    this.layersInfo[layerIx - 1] = {
      nbNeurons,
      activation,
    };
    this.reload();
  }

  getNbNeurons() {
    return this.net.layers.map((l) => l.out_depth).slice(1);
  }

  getLayerTypes() {
    return this.net.layers.map((l) => l.layer_type).slice(1);
  }

  getDisplayedDimensions(layerIx) {
    return {
      d0: this.d0[layerIx],
      d1: this.d1[layerIx],
    };
  }

  getNbLayers() {
    return this.nbLayers;
  }

  getLoss() {
    return Math.round((this.loss + Number.EPSILON) * 1000) / 1000;
  }

  prepareToDraw(ppalCanvas, layerCanvasRefs) {
    this.width = ppalCanvas.current.width;
    this.height = ppalCanvas.current.height;

    // as all the canvas have the same size
    this.visWidth = layerCanvasRefs.current[0].current.width;
    this.visHeight = layerCanvasRefs.current[0].current.height;
    this.ctx = ppalCanvas.current.getContext('2d');
    this.layerCanvasRefs = layerCanvasRefs;
  }

  updateRefs() {
    this.visCtxArray = this.layerCanvasRefs.current.map((canvas) => {
      return canvas.current.getContext('2d');
    });
  }

  createNetwork() {
    this.layer_defs = [];
    this.layer_defs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: 2 });
    this.layersInfo.map((layer) => {
      this.layer_defs.push({
        type: 'fc',
        num_neurons: layer.nbNeurons,
        activation: layer.activation,
      });
    });
    this.layer_defs.push({ type: 'softmax', num_classes: 2 });

    this.net = new convnetjs.Net();
    this.net.makeLayers(this.layer_defs);

    this.trainer = new convnetjs.SGDTrainer(this.net, {
      learning_rate: 0.01,
      momentum: 0.1,
      batch_size: 10,
      l2_decay: 0.001,
    });

    this.nbLayers = this.net.layers.length - 1;
    this.d0 = new Array(this.nbLayers)
      .fill(null)
      .map((d, i) => this.d0[i] || 0);
    this.d1 = new Array(this.nbLayers)
      .fill(null)
      .map((d, i) => this.d1[i] || 1);
  }

  reload() {
    this.createNetwork();
  }

  update() {
    //const start = new Date().getTime();
    let avloss = 0;
    const iters = 20;
    const x = new convnetjs.Vol(1, 1, 2);
    for (let i = 0; i < iters; i += 1) {
      for (let ix = 0; ix < this.N; ix += 1) {
        x.w = this.data[ix];
        const stats = this.trainer.train(x, this.labels[ix]);
        avloss += stats.loss;
      }
    }
    //const end = new Date().getTime();
    this.loss = avloss / (this.N * iters);
  }

  draw(frameCount) {
    // const color = Math.sin(frameCount * 0.04) * 256;

    //clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.visCtxArray.forEach((visctx) =>
      visctx.clearRect(0, 0, this.visWidth, this.visHeight),
    );
    // this.visCtxArray.forEach((visctx, i) => {
    //   this.drawRect(visctx, 0, i * 30, this.width, 30);
    // });

    const density = 5.0;
    const gridstep = 3;

    let netx = new convnetjs.Vol(1, 1, 2);
    let t = new convnetjs.Vol(1, 1, 2);
    let gridx = new Array(this.nbLayers);
    let gridy = new Array(this.nbLayers);
    for (let i = 0; i < this.nbLayers; i += 1) {
      gridx[i] = new Array(Math.floor(this.width / gridstep));
      gridy[i] = new Array(Math.floor(this.height / gridstep));
    }
    let gridl = [];
    let c = 0;
    for (let x = 0.0, cx = 0; x <= this.width; x += density, cx += 1) {
      for (let y = 0.0, cy = 0; y <= this.height; y += density, cy += 1) {
        netx.w[0] = (x - this.width / 2) / this.ss;
        netx.w[1] = (y - this.height / 2) / this.ss;
        const a = this.net.forward(netx, false);

        if (a.w[0] < a.w[1]) {
          t.w[1] = (a.w[1] - 0.5) / 0.5;
          t.w[0] = a.w[0];
        } else {
          t.w[0] = (a.w[0] - 0.5) / 0.5;
          t.w[1] = a.w[1];
        }
        //alert(`${a.w}\n${t.w}`);

        const positiveGradient = `rgb(${Math.floor(
          (1 - t.w[1]) * 256,
        )}, ${Math.floor(94 + (255 - 95) * (1 - t.w[1]))},  255)`;
        const negativeGradient = `rgb(255,${Math.floor(
          59 + (255 - 59) * (1 - t.w[0]),
        )}, ${Math.floor(33 + (255 - 33) * t.w[1])})`;
        const fillStyle = a.w[0] > a.w[1] ? negativeGradient : positiveGradient;
        this.ctx.fillStyle = fillStyle;

        // print grid
        this.ctx.fillRect(
          x - density / 2 - 1,
          y - density / 2 - 1,
          density + 2,
          density + 2,
        );

        if (cx % gridstep === 0 && cy % gridstep === 0) {
          // record the transformation information
          //ignore first layer
          for (let i = 0; i < this.nbLayers; i += 1) {
            const xt = this.net.layers[i + 1].out_act.w[this.d0[i]]; // in screen coords
            const yt = this.net.layers[i + 1].out_act.w[this.d1[i]]; // in screen coords
            gridx[i][c] = xt;
            gridy[i][c] = yt;
          }
          c++;
          gridl.push(a.w[0] > a.w[1]); // remember final label as well
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
      this.visCtxArray.forEach((visctx) => {
        visctx.strokeStyle = 'rgb(0, 0, 0)';
        visctx.lineWidth = 0.25;
      });

      // TODO: set n for non square canvas
      const n = Math.floor(Math.sqrt(gridx[0].length)); // size of grid. Should be fine?
      const ng = gridx[0].length;
      let xraw1;
      let yraw1;
      let xraw2;
      let yraw2;
      for (let i = 0; i < this.nbLayers; i += 1) {
        this.visCtxArray[i].beginPath();
        for (let x = 0; x < n; x += 1) {
          for (let y = 0; y < n; y += 1) {
            // down
            let ix1 = x * n + y;
            let ix2 = x * n + y + 1;

            if (ix1 >= 0 && ix2 >= 0 && ix1 < ng && ix2 < ng && y < n - 1) {
              xraw1 =
                this.visWidth * ((gridx[i][ix1] - mmx[i].minv) / mmx[i].dv);
              yraw1 =
                this.visHeight * ((gridy[i][ix1] - mmy[i].minv) / mmy[i].dv);
              xraw2 =
                this.visWidth * ((gridx[i][ix2] - mmx[i].minv) / mmx[i].dv);
              yraw2 =
                this.visHeight * ((gridy[i][ix2] - mmy[i].minv) / mmy[i].dv);
              this.visCtxArray[i].moveTo(xraw1, yraw1);
              this.visCtxArray[i].lineTo(xraw2, yraw2);
              c++;
            }

            // // and draw its color
            // if (gridl[ix1]) {
            //   this.visCtxArray[i].fillStyle = `rgb(0, 110, 255)`;
            // } else {
            //   this.visCtxArray[i].fillStyle = `rgb(255, 44, 44)`;
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
              xraw1 =
                (this.visWidth * (gridx[i][ix1] - mmx[i].minv)) / mmx[i].dv;
              yraw1 =
                (this.visHeight * (gridy[i][ix1] - mmy[i].minv)) / mmy[i].dv;
              xraw2 =
                (this.visWidth * (gridx[i][ix2] - mmx[i].minv)) / mmx[i].dv;
              yraw2 =
                (this.visHeight * (gridy[i][ix2] - mmy[i].minv)) / mmy[i].dv;
              this.visCtxArray[i].moveTo(xraw1, yraw1);
              this.visCtxArray[i].lineTo(xraw2, yraw2);
              c++;
            }
            this.visCtxArray[i].closePath();
          }
        }
      }
      this.visCtxArray.forEach((visctx) => visctx.stroke());
    }

    // draw datapoints.
    this.ctx.strokeStyle = 'rgb(255,255,255)';
    this.ctx.lineWidth = 1;
    const dpRadius = 4.0;
    let fillStyle = '';
    for (let i = 0; i < this.N; i += 1) {
      if (this.labels[i] === 1) {
        fillStyle = `rgb(0, 34, 255)`;
      } else {
        fillStyle = `rgb(247,43,43)`;
      }

      this.ctx.fillStyle = fillStyle;

      this.drawCircle(
        this.ctx,
        this.data[i][0] * this.ss + this.width / 2,
        this.data[i][1] * this.ss + this.height / 2,
        dpRadius - 1,
      );

      // also draw transformed data points while we're at it
      [netx.w[0], netx.w[1]] = this.data[i];
      this.net.forward(netx, false);

      this.visCtxArray.forEach((ctx) => {
        ctx.fillStyle = fillStyle;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgb(255,255,255)';
      });

      for (let i = 0; i < this.nbLayers; i += 1) {
        const xt =
          (this.visWidth *
            (this.net.layers[i + 1].out_act.w[this.d0[i]] - mmx[i].minv)) /
          mmx[i].dv; // in screen coords
        const yt =
          (this.visHeight *
            (this.net.layers[i + 1].out_act.w[this.d1[i]] - mmy[i].minv)) /
          mmy[i].dv; // in screen coords
        this.drawCircle(this.visCtxArray[i], xt, yt, dpRadius);
      }
    }
  }

  maxmin(w) {
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
  }

  cycle(layer, setDisplayingNeurons) {
    var selected_layer = this.net.layers[layer + 1];
    this.d0[layer] += 1;
    this.d1[layer] += 1;
    if (this.d1[layer] >= selected_layer.out_depth) this.d1[layer] = 0; // and wrap
    if (this.d0[layer] >= selected_layer.out_depth) this.d0[layer] = 0; // and wrap
    setDisplayingNeurons({ d0: this.d0[layer], d1: this.d1[layer] });
  }

  cycleAll() {
    for (let i = 0; i < this.nbLayers; i += 1) {
      this.cycle(i);
    }
    this.reload();
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
}

export default NetworkCanvasEngine;
