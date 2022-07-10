class BrakeBanner {
  constructor(selector) {
    // 创建 PIXI 对象
    this.app = new PIXI.Application({
      with: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window,
    });
    // 将其添加到页面中
    document.querySelector(selector).appendChild(this.app.view);
    this.stage = this.app.stage;
    // 创建一个加载器事例
    this.loader = new PIXI.Loader();
    // 添加资源到加载器
    this.loader.add("btn.png", "images/btn.png");
    this.loader.add("btn_circle.png", "images/btn_circle.png");
    this.loader.add("brake_bike.png", "images/brake_bike.png");
    this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png");
    this.loader.add("brake_lever.png", "images/brake_lever.png");
    // 开始加载资源
    this.loader.load();
    // 资源加载完成的监听
    this.loader.onComplete.add(() => {
      this.show();
    });
  }
  show() {
    let actionButton = this.createActionButton();
    // 将按钮容器 actionButton 移动到页面的位置
    actionButton.scale.x = actionButton.scale.y = 0.5;

    // 创建一个容器
    let bikeContainer = new PIXI.Container();
    this.stage.addChild(bikeContainer);
    bikeContainer.scale.x = bikeContainer.scale.y = 0.3;
    const bikeImg = new PIXI.Sprite(
      this.loader.resources["brake_bike.png"].texture
    );
    const bikeHandlerbarImage = new PIXI.Sprite(
      this.loader.resources["brake_handlerbar.png"].texture
    );
    const bikeLeverImg = new PIXI.Sprite(
      this.loader.resources["brake_lever.png"].texture
    );
    bikeContainer.addChild(bikeImg);
    bikeContainer.addChild(bikeLeverImg);
    bikeContainer.addChild(bikeHandlerbarImage);

    bikeLeverImg.pivot.x = bikeLeverImg.pivot.y = 455;
    bikeLeverImg.x = 722;
    bikeLeverImg.y = 900;
    bikeImg.alpha = 0.5;
    // 将容器添加到场景
    this.stage.addChild(actionButton);
    // 增加点击
    actionButton.interactive = true;
    // 点击是鼠标变为手
    actionButton.buttonMode = true;
    // 鼠标压下
    actionButton.on("mousedown", () => {
      gsap.to(bikeLeverImg, { duration: 0.4, rotation: (Math.PI / 180) * -30 });
      gsap.to(bikeImg, { duration: 0.4, alpha: 1 });
      pause();
    });
    // 鼠标抬起
    actionButton.on("mouseup", () => {
      gsap.to(bikeLeverImg, { duration: 0.4, rotation: 0 });
      gsap.to(bikeImg, { duration: 0.4, alpha: 0.5 });
      start();
    });

    let resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width;
      bikeContainer.y = window.innerHeight - bikeContainer.height;
      actionButton.x = window.innerWidth - bikeContainer.width + 160;
      actionButton.y = window.innerHeight - bikeContainer.height + 220;
    };
    window.addEventListener("resize", resize);
    resize();

    // 创建粒子
    let particleContainer = new PIXI.Container();
    this.stage.addChild(particleContainer);
    // 修改粒子容器旋转点
    particleContainer.pivot.x = window.innerWidth / 2;
    particleContainer.pivot.y = window.innerHeight / 2;
    // 修改粒子容器中心
    particleContainer.x = window.innerWidth / 2;
    particleContainer.y = window.innerHeight / 2;
    // 旋转容器以实现粒子斜向移动
    particleContainer.rotation = (35 * Math.PI) / 180;
    let particle = [];
    // 颜色数组
    const colors = [0xf1cf54, 0xb5cea8, 0xf1cf54];
    for (let i = 0; i < 10; i++) {
      // 绘制圆形
      let gr = new PIXI.Graphics();
      gr.beginFill(colors[Math.floor(Math.random() * colors.length)]);
      gr.drawCircle(0, 0, 6);
      gr.endFill();
      let pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr: gr,
      };
      gr.x = pItem.sx;
      gr.y = pItem.sy;
      particle.push(pItem);
      particleContainer.addChild(gr);
    }

    // 设置一个初始速度
    let speed = 0;
    function loop() {
      speed += 0.5;
      speed = Math.min(speed, 20);
      for (let i = 0; i < particle.length; i++) {
        let pItem = particle[i];
        pItem.gr.y += speed;
        if (speed >= 20) {
          pItem.gr.scale.y = 40;
          pItem.gr.scale.x = 0.04;
        }
        if (pItem.gr.y > window.innerHeight) {
          pItem.gr.y = 0;
        }
      }
    }
    // 开始
    function start() {
      // 创建循环动画函数
      gsap.ticker.add(loop);
    }
    // 暂停
    function pause() {
      // 移除动画
      gsap.ticker.remove(loop);
      for (let i = 0; i < particle.length; i++) {
        let pItem = particle[i];
        pItem.gr.scale.x = pItem.gr.scale.y = 1;
        gsap.to(pItem.gr, {
          duration: 0.6,
          x: pItem.sx,
          y: pItem.sy,
          ease: "elastic.out",
        });
      }
    }
    start();
  }
  createActionButton() {
    // 创建一个容器
    let actionButton = new PIXI.Container();
    // 选取加载器中的资源
    let btnImage = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
    let btnCircle = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    let btnCircle2 = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    // 添加到场景
    actionButton.addChild(btnImage);
    actionButton.addChild(btnCircle);
    actionButton.addChild(btnCircle2);

    // 修改圆心
    btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2;
    btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2;
    btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2;

    // 缩放圆环
    btnCircle.scale.x = btnCircle.scale.y = 0.8;
    // 实用化 gsap 制作动画 缩放
    gsap.to(btnCircle.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 });
    // 渐变
    gsap.to(btnCircle, { duration: 1, alpha: 0, repeat: -1 });
    return actionButton;
  }
}
