(function () {
  const proto = window.AngryBirdsBootstrap && window.AngryBirdsBootstrap.prototype;
  if (!proto) {
    throw new Error("AngryBirdsBootstrap core must load before render methods.");
  }

  Object.assign(proto, {
      drawBackdropLayer() {
        const ctx = this.render.context;

        // destination-over瑜??곕㈃ ?대? 洹몃젮吏?Matter 諛붾뵒 ?ㅼ뿉 諛곌꼍??源붾┰?덈떎.
        // 利? 臾쇰━ 媛앹껜??洹몃?濡??먭퀬 ?숈씪??罹붾쾭?ㅼ뿉???섎뒛/???띻꼍???ㅼそ ?덉씠?대줈 異붽??????덉뒿?덈떎.
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";

        if (this.assetsLoaded && this.images.map) {
          this.drawSkySpriteBackdrop(ctx);
          this.drawSunGlow(ctx);
          this.drawFarIslands(ctx);
          this.drawAtmosphericMist(ctx);
        } else {
          const skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
          skyGradient.addColorStop(0, this.palette.skyTop);
          skyGradient.addColorStop(0.55, this.palette.skyMid);
          skyGradient.addColorStop(1, this.palette.skyBottom);
          ctx.fillStyle = skyGradient;
          ctx.fillRect(0, 0, this.width, this.height);

          this.drawSunGlow(ctx);
          this.drawSunBeams(ctx);
          this.drawCloudBank(ctx);
          this.drawFarIslands(ctx);
          this.drawAtmosphericMist(ctx);
          this.drawBackgroundHills(ctx);
          this.drawBackdropVegetation(ctx);
          this.drawGroundRibbon(ctx);
        }

        ctx.restore();
      },

      drawForegroundLayer() {
        const ctx = this.render.context;
        ctx.save();

        this.drawStageGround(ctx);
        this.drawLauncherIslandDecor(ctx);
        this.drawTargetIslandDecor(ctx);
        this.drawStructureArt(ctx);
        this.drawSlingshot(ctx);
        this.drawPauseButton(ctx);
        this.drawTopHudLabel(ctx);

        ctx.restore();
      },

      drawStageGround(ctx) {
        // ?ъ슜?먭? 諛붾줈 "???대씪怨??몄떇?????덈룄濡?
        // ?꾨㈃ ?덉씠?댁뿉 ?볤퀬 ?먭볼??珥덉썝 吏?뺤쓣 吏곸젒 源앸땲??
        // ?댁쟾泥섎읆 諛곌꼍 ?ㅼ뿉 ?댁쭩 鍮꾩튂???먮굦???꾨땲?? ?ㅻ툕?앺듃 ?꾨옒瑜??ㅼ젣濡?諛쏆튂??諛붾떏?낅땲??
        ctx.save();

        const dirt = ctx.createLinearGradient(0, 615, 0, this.height);
        dirt.addColorStop(0, "#b78444");
        dirt.addColorStop(0.25, "#98662f");
        dirt.addColorStop(1, "#5c3413");
        ctx.fillStyle = dirt;
        ctx.beginPath();
        ctx.moveTo(0, 620);
        ctx.quadraticCurveTo(160, 592, 315, 612);
        ctx.quadraticCurveTo(470, 584, 650, 616);
        ctx.quadraticCurveTo(870, 585, 1055, 610);
        ctx.quadraticCurveTo(1170, 592, 1280, 604);
        ctx.lineTo(1280, this.height);
        ctx.lineTo(0, this.height);
        ctx.closePath();
        ctx.fill();

        const grass = ctx.createLinearGradient(0, 580, 0, 646);
        grass.addColorStop(0, "#d9ff8a");
        grass.addColorStop(0.32, "#95e147");
        grass.addColorStop(0.7, "#5eb726");
        grass.addColorStop(1, "#3f8f1f");
        ctx.fillStyle = grass;
        ctx.beginPath();
        ctx.moveTo(0, 606);
        for (let x = 0; x <= this.width; x += 72) {
          ctx.quadraticCurveTo(x + 26, 590 + (x % 144 === 0 ? -10 : 8), x + 72, 606);
        }
        ctx.lineTo(this.width, 640);
        ctx.lineTo(0, 640);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#78d332";
        ctx.beginPath();
        ctx.ellipse(230, 628, 210, 46, -0.03, Math.PI, 0);
        ctx.ellipse(980, 626, 270, 50, 0.015, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.beginPath();
        ctx.ellipse(220, 607, 118, 12, -0.04, 0, Math.PI * 2);
        ctx.ellipse(950, 606, 150, 13, 0.02, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(49, 98, 29, 0.28)";
        ctx.beginPath();
        ctx.ellipse(235, 653, 160, 18, 0, 0, Math.PI * 2);
        ctx.ellipse(980, 652, 245, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },

      drawSunGlow(ctx) {
        const glow = ctx.createRadialGradient(930, 145, 30, 930, 145, 210);
        glow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        glow.addColorStop(0.18, "rgba(255, 247, 185, 0.65)");
        glow.addColorStop(0.45, "rgba(255, 247, 185, 0.18)");
        glow.addColorStop(1, "rgba(255, 247, 185, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(930, 145, 220, 0, Math.PI * 2);
        ctx.fill();
      },

      drawSunBeams(ctx) {
        ctx.save();
        ctx.translate(905, 120);
        ctx.rotate(-0.22);
        for (let index = 0; index < 5; index += 1) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 - index * 0.012})`;
          ctx.beginPath();
          ctx.moveTo(-20, 0);
          ctx.lineTo(330, -30 - index * 8);
          ctx.lineTo(330, 30 + index * 8);
          ctx.closePath();
          ctx.fill();
          ctx.rotate(0.17);
        }
        ctx.restore();
      },

      drawCloudBank(ctx) {
        const cloudShapes = [
          [250, 135, 140, 46, 0.28],
          [410, 95, 155, 52, 0.22],
          [735, 225, 110, 38, 0.2],
          [1080, 120, 170, 56, 0.16],
          [890, 315, 150, 48, 0.13],
          [1110, 460, 220, 72, 0.1]
        ];

        cloudShapes.forEach(([x, y, w, h, alpha]) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.ellipse(x, y, w, h, -0.2, 0, Math.PI * 2);
          ctx.fill();
        });

        const streak = ctx.createLinearGradient(0, 70, this.width, 310);
        streak.addColorStop(0, "rgba(255,255,255,0)");
        streak.addColorStop(0.35, "rgba(255,255,255,0.18)");
        streak.addColorStop(0.75, "rgba(255,255,255,0.06)");
        streak.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = streak;
        ctx.fillRect(0, 60, this.width, 250);
      },

      drawFarIslands(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.22;

        [
          { x: 1020, y: 130, w: 210, h: 260 },
          { x: 1180, y: 80, w: 240, h: 330 },
          { x: 800, y: 390, w: 190, h: 180 }
        ].forEach((shape) => {
          const gradient = ctx.createLinearGradient(shape.x, shape.y, shape.x, shape.y + shape.h);
          gradient.addColorStop(0, "rgba(77, 182, 255, 0.55)");
          gradient.addColorStop(1, "rgba(42, 102, 175, 0.12)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(shape.x, shape.y + 40);
          ctx.quadraticCurveTo(shape.x + shape.w * 0.45, shape.y - 20, shape.x + shape.w, shape.y + 40);
          ctx.lineTo(shape.x + shape.w * 0.65, shape.y + shape.h);
          ctx.lineTo(shape.x + shape.w * 0.35, shape.y + shape.h);
          ctx.closePath();
          ctx.fill();
        });

        ctx.restore();
      },

      drawAtmosphericMist(ctx) {
        ctx.save();
        const mist = ctx.createLinearGradient(0, 420, 0, this.height);
        mist.addColorStop(0, "rgba(255,255,255,0)");
        mist.addColorStop(0.45, "rgba(236, 252, 255, 0.22)");
        mist.addColorStop(1, "rgba(255,255,255,0.55)");
        ctx.fillStyle = mist;
        ctx.fillRect(0, 390, this.width, this.height - 390);
        ctx.restore();
      },

      drawBackgroundHills(ctx) {
        ctx.save();

        const backHill = ctx.createLinearGradient(0, 520, 0, 720);
        backHill.addColorStop(0, "rgba(95, 196, 122, 0.12)");
        backHill.addColorStop(1, "rgba(44, 118, 70, 0.52)");
        ctx.fillStyle = backHill;
        ctx.beginPath();
        ctx.moveTo(0, 610);
        ctx.quadraticCurveTo(150, 535, 320, 600);
        ctx.quadraticCurveTo(505, 540, 690, 612);
        ctx.quadraticCurveTo(875, 542, 1055, 606);
        ctx.quadraticCurveTo(1170, 555, 1280, 598);
        ctx.lineTo(1280, 720);
        ctx.lineTo(0, 720);
        ctx.closePath();
        ctx.fill();

        const frontHill = ctx.createLinearGradient(0, 590, 0, 720);
        frontHill.addColorStop(0, "rgba(126, 223, 95, 0.16)");
        frontHill.addColorStop(1, "rgba(55, 144, 66, 0.7)");
        ctx.fillStyle = frontHill;
        ctx.beginPath();
        ctx.moveTo(0, 654);
        ctx.quadraticCurveTo(130, 608, 270, 648);
        ctx.quadraticCurveTo(420, 606, 610, 654);
        ctx.quadraticCurveTo(760, 612, 945, 650);
        ctx.quadraticCurveTo(1110, 612, 1280, 648);
        ctx.lineTo(1280, 720);
        ctx.lineTo(0, 720);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      },

      drawBackdropVegetation(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(16, 58, 38, 0.8)";
        this.drawTreeSilhouette(ctx, 35, 365, 1.2);
        this.drawTreeSilhouette(ctx, 1250, 118, 0.65);
        this.drawTreeSilhouette(ctx, 50, 165, 0.9);
        ctx.restore();
      },

      drawGroundRibbon(ctx) {
        ctx.save();
        // ?섎떒 ?꾩껜???뺤떎??蹂댁씠??"珥덈줉 吏硫???源앸땲??
        // ?댁쟾泥섎읆 ?뉗? ?좉? ?꾨땲?? 硫由ъ꽌 遊먮룄 諛붾줈 ?낆씠?쇨퀬 ?먭뺨吏??뺣룄???먭퍡濡?洹몃┰?덈떎.
        const dirtGradient = ctx.createLinearGradient(0, 620, 0, this.height);
        dirtGradient.addColorStop(0, "#b9894b");
        dirtGradient.addColorStop(0.22, "#9f7038");
        dirtGradient.addColorStop(1, "#593414");
        ctx.fillStyle = dirtGradient;
        ctx.beginPath();
        ctx.moveTo(0, 632);
        ctx.quadraticCurveTo(150, 612, 300, 628);
        ctx.quadraticCurveTo(520, 604, 730, 632);
        ctx.quadraticCurveTo(980, 606, 1280, 628);
        ctx.lineTo(1280, this.height);
        ctx.lineTo(0, this.height);
        ctx.closePath();
        ctx.fill();

        const grassGradient = ctx.createLinearGradient(0, 590, 0, 650);
        grassGradient.addColorStop(0, "#d5ff86");
        grassGradient.addColorStop(0.35, "#91df44");
        grassGradient.addColorStop(1, "#4e9e24");
        ctx.fillStyle = grassGradient;
        ctx.beginPath();
        ctx.moveTo(0, 622);
        for (let x = 0; x <= this.width; x += 80) {
          ctx.quadraticCurveTo(x + 35, 600 + (x % 160 === 0 ? -10 : 8), x + 80, 622);
        }
        ctx.lineTo(this.width, 658);
        ctx.lineTo(0, 658);
        ctx.closePath();
        ctx.fill();

        // 醫뚯슦 ?뚮젅??援ъ뿭 ?꾨옒???붾뵒 ?붾뜒?????뱀뼱??        // ?덉킑怨?援ъ“臾쇱씠 諛붾떏 ?꾩뿉 諛뺥? ?덈뒗 ?먮굦??媛뺥솕?⑸땲??
        const moundGradient = ctx.createLinearGradient(0, 585, 0, 675);
        moundGradient.addColorStop(0, "#bfff78");
        moundGradient.addColorStop(0.45, "#6dc92e");
        moundGradient.addColorStop(1, "#3e881f");
        ctx.fillStyle = moundGradient;
        ctx.beginPath();
        ctx.ellipse(235, 635, 180, 44, -0.03, Math.PI, 0);
        ctx.ellipse(980, 633, 260, 48, 0.02, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.beginPath();
        ctx.ellipse(250, 620, 120, 12, -0.04, 0, Math.PI * 2);
        ctx.ellipse(955, 618, 155, 14, 0.01, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(53, 108, 34, 0.32)";
        ctx.beginPath();
        ctx.ellipse(245, 650, 150, 18, 0, 0, Math.PI * 2);
        ctx.ellipse(980, 650, 230, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      },

      drawIslandBase(ctx, x, y, width, height) {
        const left = x - width / 2;
        const top = y - height / 2;

        const cliffGradient = ctx.createLinearGradient(left, top, left, top + height);
        cliffGradient.addColorStop(0, this.palette.cliffLight);
        cliffGradient.addColorStop(0.45, this.palette.cliffMid);
        cliffGradient.addColorStop(1, this.palette.cliffDark);

        ctx.fillStyle = cliffGradient;
        ctx.beginPath();
        ctx.moveTo(left + 36, top + 15);
        ctx.bezierCurveTo(left - 10, top + 55, left + 35, top + 120, left + 58, top + height - 25);
        ctx.bezierCurveTo(left + width * 0.35, top + height + 25, left + width * 0.65, top + height + 10, left + width - 34, top + height - 22);
        ctx.bezierCurveTo(left + width - 10, top + 135, left + width + 10, top + 48, left + width - 22, top + 12);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(69, 50, 28, 0.45)";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = "rgba(73, 90, 122, 0.22)";
        ctx.beginPath();
        ctx.ellipse(x + width * 0.14, top + height * 0.5, width * 0.18, 44, -0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.palette.islandGrass;
        ctx.beginPath();
        ctx.moveTo(left + 12, top + 18);
        ctx.quadraticCurveTo(x, top - 22, left + width - 12, top + 18);
        ctx.quadraticCurveTo(x, top + 52, left + 12, top + 18);
        ctx.fill();

        ctx.fillStyle = "rgba(183, 255, 143, 0.7)";
        ctx.beginPath();
        ctx.ellipse(x - width * 0.12, top + 16, width * 0.2, 10, -0.06, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(40, 103, 56, 0.26)";
        ctx.beginPath();
        ctx.ellipse(x - 20, top + 60, width * 0.26, 18, -0.12, 0, Math.PI * 2);
        ctx.fill();
      },

      drawLauncherIslandDecor(ctx) {
        this.drawFlowerCluster(ctx, 172, 679, 0.9);
        this.drawFlowerCluster(ctx, 308, 682, 0.75);
        this.drawBush(ctx, 118, 684, 1.08);
        this.drawBush(ctx, 168, 657, 0.72);
        this.drawGrassTuft(ctx, 274, 679, 1.1);
      },

      drawTargetIslandDecor(ctx) {
        this.drawFlowerCluster(ctx, 846, 684, 1.05);
        this.drawFlowerCluster(ctx, 1106, 685, 1.05);
        this.drawFlowerCluster(ctx, 1196, 690, 0.95);
        this.drawBush(ctx, 920, 688, 0.9);
        this.drawBush(ctx, 1062, 664, 0.7);
        this.drawGrassTuft(ctx, 1006, 682, 1.25);
        this.drawDecorativeRoof(ctx, 975, 334);
        this.drawBalloonCluster(ctx, 872, 474, 0.95);
      },

      drawStructureArt(ctx) {
        this.crateBodies.forEach((body) => this.drawCrate(ctx, body));
        this.glassBodies.forEach((body) => this.drawGlassBlock(ctx, body));
        this.woodBodies.forEach((body) => this.drawWoodBlock(ctx, body));
        this.pigBodies.forEach((body, index) => this.drawPig(ctx, body, index === 1));
      },

      updateSlingshotPlacementFromGround() {
        if (!this.groundBody) {
          return;
        }

        const groundTopY = this.groundBody.bounds.min.y;
        const frontForkHeight = this.slingshotFrontForkHeight;
        const frontForkTopY = groundTopY - frontForkHeight;

        // ?덉킑 蹂몄껜??Y??"??理쒖긽??- ?덉킑 ?믪씠 / 2" 怨듭떇?쇰줈 怨꾩궛?⑸땲??
        // ?대젃寃??섎㈃ ?ㅽ봽?쇱씠?몄쓽 ?섎떒????긽 ?붾뵒? ?뺥솗??留욌떯怨?
        // ?댁긽?꾨굹 ?대? 諛곗튂媛 諛붾뚯뼱???덉킑??怨듭쨷???⑥? ?딆뒿?덈떎.
        this.slingshotAnchor.position.x = 250;
        this.slingshotAnchor.position.y = groundTopY - frontForkHeight / 2;
        this.slingshotFootY = groundTopY;

        // ?ㅼ젣 臾쇰━ ?듭빱(?덇? 留ㅻ떖由щ뒗 ?????덉킑 ?곷떒 ?ы겕???ъ씠???덉뼱???섎?濡?
        // ?묒???蹂몄껜 ?꾩튂?먯꽌 ?ㅼ떆 ?곷? ?ㅽ봽?뗭쑝濡?怨꾩궛?⑸땲??
        this.anchorPoint.x = this.slingshotAnchor.position.x + 2;
        this.anchorPoint.y = frontForkTopY + 46;
        this.pointerWorldPosition.x = this.anchorPoint.x;
        this.pointerWorldPosition.y = this.anchorPoint.y;
      },

      getSlingshotRenderData() {
        const slingshotRenderX = this.slingshotAnchor.position.x;
        const slingshotRenderFootY = this.slingshotAnchor.position.y + this.slingshotGroundContactOffset;
        const frontForkX = slingshotRenderX + this.slingshotFrontForkOffsetX;
        const frontForkY = slingshotRenderFootY - this.slingshotFrontForkHeight;
        const backForkX = slingshotRenderX + this.slingshotBackForkOffsetX;
        const backForkY = slingshotRenderFootY - this.slingshotBackForkHeight + this.slingshotBackForkOffsetY;
        const backBandStartX = slingshotRenderX + this.slingshotBandOffsets.backStartX;
        const backBandStartY = slingshotRenderFootY + this.slingshotBandOffsets.backStartY;
        const frontBandStartX = slingshotRenderX + this.slingshotBandOffsets.frontStartX;
        const frontBandStartY = slingshotRenderFootY + this.slingshotBandOffsets.frontStartY;

        return {
          slingshotRenderX,
          slingshotRenderFootY,
          frontFork: {
            frame: this.spriteFrames.objects.slingshotIdleLeft,
            x: frontForkX,
            y: frontForkY,
            width: this.slingshotFrontForkWidth,
            height: this.slingshotFrontForkHeight
          },
          backFork: {
            frame: this.spriteFrames.objects.slingshotIdleRight,
            x: backForkX,
            y: backForkY,
            width: this.slingshotBackForkWidth,
            height: this.slingshotBackForkHeight
          },
          backBandStart: {
            x: backBandStartX,
            y: backBandStartY
          },
          frontBandStart: {
            x: frontBandStartX,
            y: frontBandStartY
          },
          restBand: {
            x: slingshotRenderX + 10,
            y: slingshotRenderFootY - 146
          }
        };
      },

      drawRubberBand(ctx, fromX, fromY, toX, toY) {
        ctx.save();
        ctx.strokeStyle = "#301708";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.restore();
      },

      drawSlingshot(ctx) {
        if (!this.assetsLoaded || !this.slingshotSprite) {
          if (this.bird) {
            this.drawBird(ctx, this.bird.position);
          }
          return;
        }

        const birdPosition = this.bird ? this.bird.position : this.anchorPoint;
        const renderData = this.getSlingshotRenderData();
        const shouldDrawBands = Boolean(this.slingshotConstraint) && !this.hasBirdLaunched;

        // ?덉씠???쒖꽌???덈?濡?諛붽씀吏 ?딆뒿?덈떎.
        // 1. ?ㅼそ 湲곕뫁 -> 2. ?ㅼそ 怨좊Т以?-> 3. ??-> 4. ?욎そ 怨좊Т以?-> 5. ?욎そ 湲곕뫁
        this.drawImageFrame(
          ctx,
          this.slingshotSprite,
          renderData.backFork.frame,
          renderData.backFork.x,
          renderData.backFork.y,
          renderData.backFork.width,
          renderData.backFork.height
        );

        // 2. ?ㅼそ 怨좊Т以?        // ?쒖옉?먯? 湲곕뫁 ?대?吏 ?덉쓽 寃? 諛대뱶 遺遺꾩쑝濡??섎룞 蹂댁젙??醫뚰몴瑜??ъ슜?⑸땲??
        // ?덇? 諛쒖궗?섍린 ??Constraint ?쒖꽦 ?곹깭)???뚮쭔 ??以묒떖源뚯? ?좎쓣 湲뗭뒿?덈떎.
        if (shouldDrawBands) {
          this.drawRubberBand(
            ctx,
            renderData.backBandStart.x,
            renderData.backBandStart.y,
            birdPosition.x,
            birdPosition.y
          );
        }

        // 3. 새
        this.drawBird(ctx, birdPosition);

        // 4. 앞쪽 고무줄
        if (shouldDrawBands) {
          this.drawRubberBand(
            ctx,
            renderData.frontBandStart.x,
            renderData.frontBandStart.y,
            birdPosition.x,
            birdPosition.y
          );
        }

        // 5. ?욎そ 湲곕뫁
        this.drawImageFrame(
          ctx,
          this.slingshotSprite,
          renderData.frontFork.frame,
          renderData.frontFork.x,
          renderData.frontFork.y,
          renderData.frontFork.width,
          renderData.frontFork.height
        );
      },

      getSlingshotPullDistance() {
        if (!this.bird || this.hasBirdLaunched) {
          return 0;
        }

        return this.Vector.magnitude(this.Vector.sub(this.bird.position, this.anchorPoint));
      },

      getSlingshotStateByDistance(distance) {
        // ?듭빱? ???ъ씠??嫄곕━留뚯쑝濡??곹깭瑜?寃곗젙?⑸땲??
        // 5px 誘몃쭔: DEFAULT, 5px ?댁긽 50px 誘몃쭔: PULLED_50, 50px ?댁긽: PULLED_100
        if (distance < this.slingshotDistanceThresholds.defaultMax) {
          return this.SLINGSHOT_STATE.DEFAULT;
        }

        if (distance < this.slingshotDistanceThresholds.pulled50Max) {
          return this.SLINGSHOT_STATE.PULLED_50;
        }

        return this.SLINGSHOT_STATE.PULLED_100;
      },

      drawSlingshotState(ctx, state) {
        if (!this.assetsLoaded || !this.slingshotSprite || !this.slingshotStateSprites[state]) {
          return;
        }

        if (state === this.SLINGSHOT_STATE.DEFAULT) {
          this.drawDefaultSlingshotState(ctx);
          return;
        }

        const stateFrame = this.slingshotStateSprites[state];

        // PULLED_50 / PULLED_100? ?ㅽ봽?쇱씠???쒗듃 ?섎떒???꾩꽦 ?ъ쫰瑜?洹몃?濡??ъ슜?⑸땲??
        // source 醫뚰몴(sx, sy, sw, sh)???쒗듃?먯꽌 ?섎씪???쎌? 踰붿쐞?닿퀬,
        // destination 醫뚰몴(dx, dy, dw, dh)??罹붾쾭???꾩쓽 怨좎젙 ?덉킑 ?꾩튂?낅땲??
        // dy??slingshotFootY瑜?湲곗??쇰줈 ??λ릺???곹깭 ?꾪솚 ??蹂몄껜媛 ?ㅻ━吏 ?딆뒿?덈떎.
        ctx.drawImage(
          this.slingshotSprite,
          stateFrame.sx,
          stateFrame.sy,
          stateFrame.sw,
          stateFrame.sh,
          stateFrame.dx,
          stateFrame.dy,
          stateFrame.dw,
          stateFrame.dh
        );
      },

      drawDefaultSlingshotState(ctx) {
        const stateFrame = this.slingshotStateSprites[this.SLINGSHOT_STATE.DEFAULT];
        const { leftFork, rightFork, strap } = stateFrame;

        // DEFAULT??Slingshot.png 醫뚯륫 ?곷떒???ы겕媛 遺꾨━???뺥깭濡??ㅼ뼱 ?덉쑝誘濡?        // ??媛쒖쓽 source ?곸뿭??媛곴컖 ?섎씪 怨좎젙 醫뚰몴??諛곗튂?⑸땲??
        ctx.drawImage(
          this.slingshotSprite,
          leftFork.sx,
          leftFork.sy,
          leftFork.sw,
          leftFork.sh,
          leftFork.dx,
          leftFork.dy,
          leftFork.dw,
          leftFork.dh
        );

        ctx.drawImage(
          this.slingshotSprite,
          rightFork.sx,
          rightFork.sy,
          rightFork.sw,
          rightFork.sh,
          rightFork.dx,
          rightFork.dy,
          rightFork.dw,
          rightFork.dh
        );

        // 湲곕낯 ?먯꽭???꾩꽦??諛대뱶 ?꾨젅?꾩씠 ?놁뼱???ы겕 ?앹젏留??ㅽ봽?쇱씠?몄뿉 留욎텛怨?
        // 怨좊Т以꾧낵 ?뚯슦移섎뒗 Canvas API濡??뉕쾶 ?곌껐?⑸땲??
        const pouchX = this.anchorPoint.x - strap.pouchWidth / 2 + 2;
        const pouchY = this.anchorPoint.y + 6;

        ctx.save();
        ctx.lineCap = "round";
        ctx.strokeStyle = "#5a2d10";
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(strap.leftX, strap.y);
        ctx.quadraticCurveTo(
          this.anchorPoint.x - 14,
          this.anchorPoint.y - 8,
          pouchX + 4,
          pouchY + 3
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(strap.rightX, strap.y + 1);
        ctx.quadraticCurveTo(
          this.anchorPoint.x + 13,
          this.anchorPoint.y - 8,
          pouchX + strap.pouchWidth - 4,
          pouchY + 3
        );
        ctx.stroke();

        ctx.fillStyle = "#3c2415";
        ctx.beginPath();
        this.drawRoundedRect(ctx, pouchX, pouchY, strap.pouchWidth, strap.pouchHeight, 6);
        ctx.fill();
        ctx.restore();
      },

      drawSlingshotLegacy(ctx) {
        const birdPosition = this.bird ? this.bird.position : this.anchorPoint;
        const idleRightFrame = this.spriteFrames.objects.slingshotIdleRight;
        const idleWholeFrame = this.spriteFrames.objects.slingshotIdleWhole;
        const activeMidFrame = this.spriteFrames.objects.slingshotActive;
        const activeFullFrame = this.spriteFrames.objects.slingshotPullFull;
        const slingshotFootY = 628;
        const dragDistance = this.bird
          ? this.Vector.magnitude(this.Vector.sub(birdPosition, this.anchorPoint))
          : 0;
        const dragRatio = Math.min(1, dragDistance / this.maxDragDistance);
        const useFullPullSprite = this.isDraggingBird && dragRatio > 0.72;
        const activeFrame = useFullPullSprite ? activeFullFrame : activeMidFrame;
        const activeX = useFullPullSprite ? this.anchorPoint.x - 70 : this.anchorPoint.x - 58;
        const activeWidth = useFullPullSprite ? 146 : 126;
        const activeHeight = useFullPullSprite ? 220 : 205;
        const activeY = slingshotFootY - activeHeight;
        const leftBandX = useFullPullSprite ? activeX + 39 : activeX + 42;
        const rightBandX = useFullPullSprite ? activeX + 87 : activeX + 74;
        const bandY = useFullPullSprite ? activeY + 34 : activeY + 36;
        const isIdleLoaded = !this.isDraggingBird && !this.hasBirdLaunched;

        if (isIdleLoaded && this.assetsLoaded && this.images.slingshot && idleWholeFrame && idleRightFrame) {
          // 湲곕낯 ?湲??먯꽭??"?꾩꽦???덉킑 ?ㅻ（????洹몃?濡??곕릺,
          // 罹붾쾭???대━?묒쑝濡??ㅼそ/?욎そ???섎닠 洹몃┰?덈떎.
          // ?대젃寃??섎㈃ ?ы겕 媛꾧꺽 ?먯껜???먮낯 ?ㅽ봽?쇱씠?몃? 洹몃?濡??좎??섎㈃??
          // ?덈쭔 洹??ъ씠???먯뿰?ㅻ읇寃??쇱썙 ?ｌ쓣 ???덉뒿?덈떎.
          const idleX = this.anchorPoint.x - 58;
          const idleWidth = 126;
          const idleHeight = 205;
          const idleY = slingshotFootY - idleHeight;
          const frontArmX = this.anchorPoint.x + 6;
          const frontArmY = this.anchorPoint.y - 84;
          const frontArmWidth = 39;
          const frontArmHeight = 116;
          const leftForkX = idleX + 43;
          const rightForkX = idleX + 77;
          const forkY = idleY + 36;
          const idleBirdPosition = {
            x: this.anchorPoint.x + 2,
            y: this.anchorPoint.y - 4
          };
          const pouchX = idleBirdPosition.x - 13;
          const pouchY = idleBirdPosition.y + 10;

          ctx.save();
          ctx.lineCap = "round";
          ctx.strokeStyle = "#5a2d10";
          ctx.lineWidth = 5;

          // 湲곕낯 ?곹깭??怨좊Т以꾩? ?덈Т ?쏀뙺??吏곸꽑蹂대떎
          // ?댁쭩 泥섏쭊 怨≪꽑??"?μ쟾???곹깭"瑜????먯뿰?ㅻ읇寃?蹂댁뿬以띾땲??
          ctx.beginPath();
          ctx.moveTo(leftForkX, forkY);
          ctx.quadraticCurveTo(
            this.anchorPoint.x - 15,
            this.anchorPoint.y - 7,
            pouchX + 3,
            pouchY + 4
          );
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(rightForkX, forkY + 1);
          ctx.quadraticCurveTo(
            this.anchorPoint.x + 12,
            this.anchorPoint.y - 7,
            pouchX + 23,
            pouchY + 4
          );
          ctx.stroke();

          ctx.fillStyle = "#3c2415";
          ctx.beginPath();
          this.drawRoundedRect(
            ctx,
            pouchX,
            pouchY,
            26,
            12,
            6
          );
          ctx.fill();
          ctx.restore();

          this.drawImageFrame(
            ctx,
            this.images.slingshot,
            idleWholeFrame,
            idleX,
            idleY,
            idleWidth,
            idleHeight
          );

          this.drawBird(ctx, idleBirdPosition);

          this.drawImageFrame(
            ctx,
            this.images.slingshot,
            idleRightFrame,
            frontArmX,
            frontArmY,
            frontArmWidth,
            frontArmHeight
          );
          return;
        }

        // ?덉? ?덉킑 ?ㅼそ ?덉씠?댁뿉 癒쇱? 洹몃젮??
        // ?ъ슜?먭? ?밴만 ?뚮룄 ?덉킑 ?ы겕 ?욎쓣 媛濡쒖?瑜댁? ?딄쾶 留뚮벊?덈떎.
        // ?湲??곹깭?먯꽌??吏㏐퀬 ?먯뒯??怨≪꽑, ?쒕옒洹?以묒뿉???쏀뙺??吏곸꽑?쇰줈 諛붾뚭쾶 ?댁꽌
        // "媛留뚰엳 ?덉쓣 ??? "?밴린怨??덉쓣 ????紐⑥뀡 李⑥씠媛 ?먭뺨吏?꾨줉 ?⑸땲??
        if (this.slingshotConstraint && !this.hasBirdLaunched) {
          ctx.save();
          ctx.lineCap = "round";

          if (this.isDraggingBird) {
            ctx.strokeStyle = "#2e1404";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(leftBandX, bandY);
            ctx.lineTo(birdPosition.x, birdPosition.y);
            ctx.lineTo(rightBandX, bandY + 1);
            ctx.stroke();

            ctx.strokeStyle = "#5a2d10";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(leftBandX, bandY);
            ctx.lineTo(birdPosition.x, birdPosition.y);
            ctx.lineTo(rightBandX, bandY + 1);
            ctx.stroke();

            ctx.fillStyle = "#3c2415";
            ctx.beginPath();
            this.drawRoundedRect(
              ctx,
              birdPosition.x - 16,
              birdPosition.y - 8,
              32,
              16,
              7
            );
            ctx.fill();
          } else {
            ctx.strokeStyle = "#5a2d10";
            ctx.lineWidth = 6;

            ctx.beginPath();
            ctx.moveTo(leftBandX, bandY);
            ctx.quadraticCurveTo(
              this.anchorPoint.x - 10,
              this.anchorPoint.y - 10,
              this.anchorPoint.x - 5,
              this.anchorPoint.y + 6
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(rightBandX, bandY + 1);
            ctx.quadraticCurveTo(
              this.anchorPoint.x + 10,
              this.anchorPoint.y - 10,
              this.anchorPoint.x + 5,
              this.anchorPoint.y + 6
            );
            ctx.stroke();

            ctx.fillStyle = "#3c2415";
            ctx.beginPath();
            this.drawRoundedRect(
              ctx,
              this.anchorPoint.x - 14,
              this.anchorPoint.y - 2,
              28,
              12,
              6
            );
            ctx.fill();
          }

          ctx.restore();
        }

        this.drawBird(ctx, birdPosition);

        if (this.assetsLoaded && this.images.slingshot && activeFrame) {
          this.drawImageFrame(ctx, this.images.slingshot, activeFrame, activeX, activeY, activeWidth, activeHeight);
        }
      },

      updateSlingshotPlacementFromGround() {
        if (!this.groundBody) {
          return;
        }

        const groundTopY = this.groundBody.bounds.min.y;
        const slingshotFootY = groundTopY + this.slingshotGroundEmbedDepth;

        // ?덉킑 ?섎떒 湲곗??먯쓣 ???쀫㈃?먯꽌 吏곸젒 怨꾩궛?⑸땲??
        // ??媛믪쓣 ?곕㈃ ?덉킑 ?쒖옉?먯씠 怨듭쨷???꾨땲???붾뵒/??寃쎄퀎??諛뺥엺 寃껋쿂??蹂댁엯?덈떎.
        this.slingshotAnchor.position.x = 250;
        this.slingshotAnchor.position.y = slingshotFootY;
        this.slingshotFootY = slingshotFootY;

        // 湲곕낯 ?곹깭?먯꽌 ?덇? ???ы겕 ?ъ씠???뱁? 蹂댁씠???꾩튂瑜??ㅼ젣 臾쇰━ ?듭빱濡??ъ슜?⑸땲??
        this.anchorPoint.x = this.slingshotAnchor.position.x + 4;
        this.anchorPoint.y = this.slingshotFootY - 122;
        this.pointerWorldPosition.x = this.anchorPoint.x;
        this.pointerWorldPosition.y = this.anchorPoint.y;
      },

      getSlingshotPullDistance() {
        if (!this.bird || this.hasBirdLaunched) {
          return 0;
        }

        return this.Vector.magnitude(this.Vector.sub(this.bird.position, this.anchorPoint));
      },

      getSlingshotStateByDistance(distance) {
        if (distance < this.slingshotVisualThresholds.pulled50) {
          return this.SLINGSHOT_STATE.DEFAULT;
        }

        if (distance < this.slingshotVisualThresholds.pulled100) {
          return this.SLINGSHOT_STATE.PULLED_50;
        }

        return this.SLINGSHOT_STATE.PULLED_100;
      },

      getSlingshotRenderData() {
        const baseX = this.slingshotAnchor.position.x;
        const footY = this.slingshotFootY;
        const state = this.getSlingshotStateByDistance(this.getSlingshotPullDistance());
        const shouldDrawLoadedBird = Boolean(this.bird) && !this.hasBirdLaunched;

        return {
          state,
          shouldDrawLoadedBird,
          idleBirdPosition: {
            x: this.anchorPoint.x + this.idleBirdOffset.x,
            y: this.anchorPoint.y + this.idleBirdOffset.y
          },
          idle: {
            rightPiece: {
              frame: this.spriteFrames.objects.slingshotPieceRight,
              x: baseX + this.idleRightPiece.offsetX,
              y: footY - this.idleRightPiece.height + this.idleRightPiece.offsetY,
              width: this.idleRightPiece.width,
              height: this.idleRightPiece.height
            },
            leftPiece: {
              frame: this.spriteFrames.objects.slingshotPieceLeft,
              x: baseX + this.idleLeftPiece.offsetX,
              y: footY - this.idleLeftPiece.height + this.idleLeftPiece.offsetY,
              width: this.idleLeftPiece.width,
              height: this.idleLeftPiece.height
            },
            bandBackStart: {
              x: baseX + this.idleBandOffsets.backStartX,
              y: footY + this.idleBandOffsets.backStartY
            },
            bandFrontStart: {
              x: baseX + this.idleBandOffsets.frontStartX,
              y: footY + this.idleBandOffsets.frontStartY
            }
          },
          pulled50: {
            frame: this.spriteFrames.objects.slingshotPull50,
            x: baseX + this.pullSprite50.offsetX,
            y: footY - this.pullSprite50.height + this.pullSprite50.offsetY,
            width: this.pullSprite50.width,
            height: this.pullSprite50.height,
            bandBackStart: {
              x: baseX + this.pullSprite50.bandBackOffsetX,
              y: footY + this.pullSprite50.bandBackOffsetY
            },
            bandFrontStart: {
              x: baseX + this.pullSprite50.bandFrontOffsetX,
              y: footY + this.pullSprite50.bandFrontOffsetY
            }
          },
          pulled100: {
            frame: this.spriteFrames.objects.slingshotPull100,
            x: baseX + this.pullSprite100.offsetX,
            y: footY - this.pullSprite100.height + this.pullSprite100.offsetY,
            width: this.pullSprite100.width,
            height: this.pullSprite100.height,
            bandBackStart: {
              x: baseX + this.pullSprite100.bandBackOffsetX,
              y: footY + this.pullSprite100.bandBackOffsetY
            },
            bandFrontStart: {
              x: baseX + this.pullSprite100.bandFrontOffsetX,
              y: footY + this.pullSprite100.bandFrontOffsetY
            }
          }
        };
      },

      drawRubberBand(ctx, fromX, fromY, toX, toY) {
        ctx.save();
        ctx.strokeStyle = "#2e1404";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.strokeStyle = "#5a2d10";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.restore();
      },

      drawIdleSlingshot(ctx, renderData) {
        // 湲곕낯 ?곹깭:
        // 1) 醫뚯륫 ?곷떒 1踰덉㎏ 議곌컖??"?곗륫 ?덉킑 議곌컖(??"?쇰줈 ?ъ슜
        // 2) 洹??꾩뿉 ?덈? 洹몃┝
        // 3) 醫뚯륫 ?곷떒 2踰덉㎏ 議곌컖??"醫뚯륫 ?덉킑 議곌컖(??"?쇰줈 ??뼱
        // ?덇? ?덉킑 ?덉뿉 嫄몄퀜 ?덈뒗 ?먮굦??留뚮벊?덈떎.
        this.drawImageFrame(
          ctx,
          this.slingshotSprite,
          renderData.idle.rightPiece.frame,
          renderData.idle.rightPiece.x,
          renderData.idle.rightPiece.y,
          renderData.idle.rightPiece.width,
          renderData.idle.rightPiece.height
        );

        if (renderData.shouldDrawLoadedBird) {
          this.drawBird(ctx, renderData.idleBirdPosition);
        }

        this.drawImageFrame(
          ctx,
          this.slingshotSprite,
          renderData.idle.leftPiece.frame,
          renderData.idle.leftPiece.x,
          renderData.idle.leftPiece.y,
          renderData.idle.leftPiece.width,
          renderData.idle.leftPiece.height
        );
      },

      drawPulledSlingshot(ctx, renderData, birdPosition) {
        const pose =
          renderData.state === this.SLINGSHOT_STATE.PULLED_100
            ? renderData.pulled100
            : renderData.pulled50;

        // ?밴릿 ?곹깭???곗륫 ?섎떒???꾩꽦 ?ъ쫰 ???μ쓣 ?곷땲??
        // 蹂몄껜??drawImage濡?怨좎젙?섍퀬, 怨좊Т以꾨쭔 ??醫뚰몴瑜??곕씪媛???좎쑝濡??ㅼ떆 洹몃젮 以띾땲??
        this.drawImageFrame(
          ctx,
          this.slingshotSprite,
          pose.frame,
          pose.x,
          pose.y,
          pose.width,
          pose.height
        );

        if (!renderData.shouldDrawLoadedBird) {
          return;
        }

        this.drawRubberBand(
          ctx,
          pose.bandBackStart.x,
          pose.bandBackStart.y,
          birdPosition.x,
          birdPosition.y
        );

        this.drawRubberBand(
          ctx,
          pose.bandFrontStart.x,
          pose.bandFrontStart.y,
          birdPosition.x,
          birdPosition.y
        );

        this.drawBird(ctx, birdPosition);
      },

      drawSlingshot(ctx) {
        if (!this.assetsLoaded || !this.slingshotSprite) {
          if (this.bird) {
            this.drawBird(ctx, this.bird.position);
          }
          return;
        }

        const renderData = this.getSlingshotRenderData();
        const birdPosition = this.bird ? this.bird.position : renderData.idleBirdPosition;

        if (
          renderData.state === this.SLINGSHOT_STATE.DEFAULT ||
          !renderData.shouldDrawLoadedBird
        ) {
          this.drawIdleSlingshot(ctx, renderData);
          return;
        }

        this.drawPulledSlingshot(ctx, renderData, birdPosition);
      },

      drawBird(ctx, position) {
        const isLoaded = !this.hasBirdLaunched;
        ctx.save();
        ctx.translate(position.x, position.y);

        const bodyGradient = ctx.createRadialGradient(-10, -12, 4, 0, 0, 28);
        bodyGradient.addColorStop(0, "#ff7662");
        bodyGradient.addColorStop(0.7, "#d92d25");
        bodyGradient.addColorStop(1, "#8c1010");
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f3e7d1";
        ctx.beginPath();
        ctx.ellipse(-2, 11, 13, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#7c0808";
        ctx.beginPath();
        ctx.arc(11, -16, 4.5, 0, Math.PI * 2);
        ctx.arc(2, -20, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#8e2418";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-18, -11);
        ctx.lineTo(-2, -16);
        ctx.moveTo(4, -16);
        ctx.lineTo(18, -11);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(-8, -2, 7.5, 8.2, 0, 0, Math.PI * 2);
        ctx.ellipse(8, -2, 7.5, 8.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#1f130b";
        ctx.beginPath();
        ctx.arc(-8, -1, 3.2, 0, Math.PI * 2);
        ctx.arc(8, -1, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f8a31d";
        ctx.beginPath();
        ctx.moveTo(-2, 4);
        ctx.lineTo(12, 8);
        ctx.lineTo(-2, 13);
        ctx.closePath();
        ctx.fill();

        if (isLoaded) {
          ctx.strokeStyle = "rgba(255,255,255,0.25)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(-7, -12, 9, 3.7, 5.7);
          ctx.stroke();
        }

        ctx.restore();
      },

      drawPig(ctx, body, hasHat = false) {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        const radius = body.circleRadius || 24;
        const pigGradient = ctx.createRadialGradient(-6, -8, 3, 0, 0, radius);
        pigGradient.addColorStop(0, "#baff8d");
        pigGradient.addColorStop(0.72, "#7bdd47");
        pigGradient.addColorStop(1, "#469c22");
        ctx.fillStyle = pigGradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#8fe055";
        ctx.beginPath();
        ctx.arc(-10, -radius + 10, 6, 0, Math.PI * 2);
        ctx.arc(10, -radius + 10, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#98ef63";
        ctx.beginPath();
        ctx.ellipse(0, 6, radius * 0.45, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#3b8d21";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-7, -7, 5.4, 0, Math.PI * 2);
        ctx.arc(7, -7, 5.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#17210d";
        ctx.beginPath();
        ctx.arc(-7, -6, 2.3, 0, Math.PI * 2);
        ctx.arc(7, -6, 2.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#6fb84a";
        ctx.beginPath();
        ctx.arc(-7, 6, 2.8, 0, Math.PI * 2);
        ctx.arc(7, 6, 2.8, 0, Math.PI * 2);
        ctx.fill();

        if (hasHat) {
          ctx.fillStyle = "#efc057";
          ctx.beginPath();
          ctx.moveTo(-14, -radius - 2);
          ctx.lineTo(14, -radius - 2);
          ctx.lineTo(0, -radius - 16);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      },

      drawGlassBlock(ctx, body) {
        this.drawBodyRect(ctx, body, (width, height) => {
          const gradient = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
          gradient.addColorStop(0, "rgba(215, 250, 255, 0.95)");
          gradient.addColorStop(0.45, "rgba(147, 225, 248, 0.82)");
          gradient.addColorStop(1, "rgba(91, 174, 210, 0.88)");
          ctx.fillStyle = gradient;
          ctx.strokeStyle = "#6bb5cf";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          this.drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "rgba(255,255,255,0.26)";
          ctx.beginPath();
          this.drawRoundedRect(ctx, -width / 2 + 4, -height / 2 + 4, width * 0.3, height - 8, 4);
          ctx.fill();
        });
      },

      drawWoodBlock(ctx, body) {
        this.drawBodyRect(ctx, body, (width, height) => {
          const gradient = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
          gradient.addColorStop(0, "#9e642e");
          gradient.addColorStop(0.5, "#d3944f");
          gradient.addColorStop(1, "#8c4f24");
          ctx.fillStyle = gradient;
          ctx.strokeStyle = "#6c3516";
          ctx.lineWidth = 4;
          ctx.beginPath();
          this.drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 6);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = "rgba(113, 59, 22, 0.6)";
          ctx.lineWidth = 2;
          for (let y = -height / 2 + 6; y < height / 2; y += 10) {
            ctx.beginPath();
            ctx.moveTo(-width / 2 + 6, y);
            ctx.lineTo(width / 2 - 6, y + 2);
            ctx.stroke();
          }
        });
      },

      drawCrate(ctx, body) {
        this.drawBodyRect(ctx, body, (width, height) => {
          const gradient = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
          gradient.addColorStop(0, "#e4b66a");
          gradient.addColorStop(0.55, "#d89645");
          gradient.addColorStop(1, "#9b5b24");
          ctx.fillStyle = gradient;
          ctx.strokeStyle = "#834315";
          ctx.lineWidth = 4;
          ctx.beginPath();
          this.drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 5);
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = "#f3d3a0";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-width / 2 + 6, -height / 2 + 6);
          ctx.lineTo(width / 2 - 6, height / 2 - 6);
          ctx.moveTo(width / 2 - 6, -height / 2 + 6);
          ctx.lineTo(-width / 2 + 6, height / 2 - 6);
          ctx.stroke();
        });
      },

      drawBodyRect(ctx, body, painter) {
        const width = body.bounds.max.x - body.bounds.min.x;
        const height = body.bounds.max.y - body.bounds.min.y;
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        painter(width, height);
        ctx.restore();
      },

      drawDecorativeRoof(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#f2d56a";
        ctx.strokeStyle = "#ca9828";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-56, 22);
        ctx.lineTo(0, -18);
        ctx.lineTo(58, 22);
        ctx.lineTo(48, 28);
        ctx.lineTo(-48, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },

      drawGrassPad(ctx, x, y, width, height) {
        ctx.save();
        ctx.fillStyle = "#54b921";
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y);
        ctx.quadraticCurveTo(x, y - height * 0.8, x + width / 2, y);
        ctx.quadraticCurveTo(x, y + height * 0.3, x - width / 2, y);
        ctx.fill();

        ctx.fillStyle = "#8dff58";
        ctx.beginPath();
        ctx.ellipse(x - width * 0.12, y - 7, width * 0.26, 7, -0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },

      drawFlowerCluster(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        for (let index = 0; index < 5; index += 1) {
          ctx.fillStyle = this.palette.blossom;
          ctx.beginPath();
          ctx.ellipse(10 * Math.cos(index * 1.26), 10 * Math.sin(index * 1.26), 12, 7, index * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#f0a22f";
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },

      drawBush(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = this.palette.leafDark;
        ctx.beginPath();
        ctx.arc(-18, 0, 16, 0, Math.PI * 2);
        ctx.arc(0, -6, 19, 0, Math.PI * 2);
        ctx.arc(18, 2, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.palette.leafLight;
        ctx.beginPath();
        ctx.arc(-6, -10, 11, 0, Math.PI * 2);
        ctx.arc(9, -2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },

      drawGrassTuft(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = "#4b9f22";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        for (let index = -2; index <= 2; index += 1) {
          ctx.beginPath();
          ctx.moveTo(index * 4, 10);
          ctx.quadraticCurveTo(index * 6, -4, index * 10, -14 - Math.abs(index) * 2);
          ctx.stroke();
        }
        ctx.restore();
      },

      drawBalloonCluster(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ["#ff8c74", "#ffd27c", "#8dffb1"].forEach((color, index) => {
          ctx.strokeStyle = "rgba(87,70,44,0.6)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(index * 10 - 8, 48);
          ctx.lineTo(index * 8 - 12, 6);
          ctx.stroke();

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.ellipse(index * 10 - 10, 0, 13, 18, -0.12 + index * 0.08, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      },

      drawTreeSilhouette(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillRect(-6, 10, 12, 80);
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.arc(-34, 18, 28, 0, Math.PI * 2);
        ctx.arc(32, 20, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },

      drawPauseButton(ctx) {
        ctx.save();
        ctx.translate(78, 86);
        const grad = ctx.createLinearGradient(0, -34, 0, 34);
        grad.addColorStop(0, "#ffcf61");
        grad.addColorStop(1, "#ec8c1c");
        ctx.fillStyle = grad;
        ctx.strokeStyle = "#a85d10";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff6df";
        ctx.fillRect(-13, -16, 9, 32);
        ctx.fillRect(4, -16, 9, 32);
        ctx.restore();
      },

      drawTopHudLabel(ctx) {
        ctx.save();

        const panelX = 1045;
        const panelY = 56;
        const panelWidth = 190;
        const panelHeight = 42;
        const tailY = 20;

        ctx.fillStyle = "#5b7483";
        ctx.strokeStyle = "#2f4350";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(panelX - 20, panelY + 10);
        ctx.lineTo(panelX, panelY);
        ctx.lineTo(panelX + panelWidth, panelY);
        ctx.lineTo(panelX + panelWidth - 24, panelY + panelHeight);
        ctx.lineTo(panelX - 40, panelY + panelHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f8f8f8";
        ctx.font = "italic bold 26px Georgia, serif";
        ctx.fillText("000120", panelX + 52, panelY + 29);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px Georgia, serif";
        ctx.fillText("0", 1220, 126);

        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.font = "bold 18px Trebuchet MS, Verdana, sans-serif";
        ctx.fillText("Birds 3", 1108, 131);

        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "bold 14px Trebuchet MS, Verdana, sans-serif";
        ctx.fillText("Sky Ruins", 1093, tailY + 20);

        ctx.restore();
      },

      drawBackdropLayer() {
        const ctx = this.render.context;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";

        if (this.assetsLoaded && this.images.sky) {
          this.drawSkySpriteBackdrop(ctx);
          this.drawImageSlice(ctx, this.images.tree, 0, 690, this.images.tree.width, 170, 0, 460, this.width, 82, 0.12, "darken");
          this.drawImageSlice(ctx, this.images.parallax, 0, 228, this.images.parallax.width, 78, 0, 534, this.width, 34, 0.16, "darken");
        } else {
          const skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
          skyGradient.addColorStop(0, this.palette.skyTop);
          skyGradient.addColorStop(0.55, this.palette.skyMid);
          skyGradient.addColorStop(1, this.palette.skyBottom);
          ctx.fillStyle = skyGradient;
          ctx.fillRect(0, 0, this.width, this.height);

          this.drawSunGlow(ctx);
          this.drawSunBeams(ctx);
          this.drawCloudBank(ctx);
          this.drawFarIslands(ctx);
          this.drawAtmosphericMist(ctx);
          this.drawBackgroundHills(ctx);
          this.drawBackdropVegetation(ctx);
          this.drawGroundRibbon(ctx);
        }

        ctx.restore();
      },

      drawStageGround(ctx) {
        ctx.save();

        if (this.assetsLoaded && this.images.ground) {
          ctx.fillStyle = "#6a4a24";
          ctx.fillRect(0, 646, this.width, this.height - 646);

          this.drawImageSlice(ctx, this.images.ingameGround, 411, 0, 411, 342, 0, 622, this.width, 46, 1);
          this.drawImageSlice(ctx, this.images.ground, 0, 820, this.images.ground.width, 180, 0, 602, this.width, 118, 1);

          ctx.fillStyle = "rgba(26, 39, 64, 0.14)";
          ctx.beginPath();
          ctx.ellipse(230, 646, 152, 18, 0, 0, Math.PI * 2);
          ctx.ellipse(980, 646, 244, 20, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const dirt = ctx.createLinearGradient(0, 615, 0, this.height);
          dirt.addColorStop(0, "#b78444");
          dirt.addColorStop(0.25, "#98662f");
          dirt.addColorStop(1, "#5c3413");
          ctx.fillStyle = dirt;
          ctx.beginPath();
          ctx.moveTo(0, 620);
          ctx.quadraticCurveTo(160, 592, 315, 612);
          ctx.quadraticCurveTo(470, 584, 650, 616);
          ctx.quadraticCurveTo(870, 585, 1055, 610);
          ctx.quadraticCurveTo(1170, 592, 1280, 604);
          ctx.lineTo(1280, this.height);
          ctx.lineTo(0, this.height);
          ctx.closePath();
          ctx.fill();

          const grass = ctx.createLinearGradient(0, 580, 0, 646);
          grass.addColorStop(0, "#d9ff8a");
          grass.addColorStop(0.32, "#95e147");
          grass.addColorStop(0.7, "#5eb726");
          grass.addColorStop(1, "#3f8f1f");
          ctx.fillStyle = grass;
          ctx.beginPath();
          ctx.moveTo(0, 606);
          for (let x = 0; x <= this.width; x += 72) {
            ctx.quadraticCurveTo(x + 26, 590 + (x % 144 === 0 ? -10 : 8), x + 72, 606);
          }
          ctx.lineTo(this.width, 640);
          ctx.lineTo(0, 640);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      },

      drawLauncherIslandDecor(ctx) {
        if (this.assetsLoaded && this.images.parallax) {
          return;
        }

        this.drawFlowerCluster(ctx, 172, 679, 0.9);
        this.drawFlowerCluster(ctx, 308, 682, 0.75);
        this.drawBush(ctx, 118, 684, 1.08);
        this.drawBush(ctx, 168, 657, 0.72);
        this.drawGrassTuft(ctx, 274, 679, 1.1);
      },

      drawTargetIslandDecor(ctx) {
        if (this.assetsLoaded && this.images.parallax) {
          this.drawDecorativeRoof(ctx, 975, 292);
          return;
        }

        this.drawFlowerCluster(ctx, 846, 684, 1.05);
        this.drawFlowerCluster(ctx, 1106, 685, 1.05);
        this.drawFlowerCluster(ctx, 1196, 690, 0.95);
        this.drawBush(ctx, 920, 688, 0.9);
        this.drawBush(ctx, 1062, 664, 0.7);
        this.drawGrassTuft(ctx, 1006, 682, 1.25);
        this.drawDecorativeRoof(ctx, 975, 292);
        this.drawBalloonCluster(ctx, 872, 474, 0.95);
      },

      drawBird(ctx, position) {
        if (this.assetsLoaded && this.images.red && this.spriteFrames.characters.red.length) {
          const speed = this.bird ? this.Vector.magnitude(this.bird.velocity) : 0;
          let frameIndex = 0;

          if (this.hasBirdLaunched) {
            frameIndex = speed > 14 ? 2 : 3;
          } else if (this.isDraggingBird) {
            frameIndex = 1;
          }

          const frame = this.spriteFrames.characters.red[frameIndex] || this.spriteFrames.characters.red[0];
          const size = this.hasBirdLaunched ? 64 : 60;
          const rotation = this.hasBirdLaunched && this.bird ? this.bird.angle : 0;
          const aspect = frame.w / Math.max(frame.h, 1);
          const width = aspect >= 1 ? size : size * aspect;
          const height = aspect >= 1 ? size / aspect : size;

          // ?ㅽ봽?쇱씠?몃? ?뺤궗媛곹삎?쇰줈 ?듭?濡??뚮윭 洹몃━吏 ?딄퀬,
          // ?ㅼ젣 ?꾨젅??鍮꾩쑉???좎???梨?媛??湲?蹂留?紐⑺몴 ?ш린??留욎땅?덈떎.
          // ?대젃寃??댁빞 ?덉쓽 癒몃━/紐명넻???꾩븘?섎줈 李뚮??섏? ?딆뒿?덈떎.
          this.drawSpriteCentered(
            ctx,
            this.images.red,
            frame,
            position.x,
            position.y - 1,
            width,
            height,
            rotation
          );
          return;
        }

        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.fillStyle = this.palette.birdRed;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },

      drawPig(ctx, body, hasHat = false) {
        if (this.assetsLoaded && this.images.pig && this.spriteFrames.characters.pig.length) {
          const frameIndex = hasHat ? 1 : 0;
          const frame = this.spriteFrames.characters.pig[frameIndex] || this.spriteFrames.characters.pig[0];
          const radius = body.circleRadius || 24;
          const size = radius * 2.18;
          const aspect = frame.w / Math.max(frame.h, 1);
          const width = aspect >= 1 ? size : size * aspect;
          const height = aspect >= 1 ? size / aspect : size;

          this.drawSpriteCentered(
            ctx,
            this.images.pig,
            frame,
            body.position.x,
            body.position.y - 1,
            width,
            height,
            body.angle
          );

          if (hasHat) {
            ctx.save();
            ctx.translate(body.position.x, body.position.y - radius - 12);
            ctx.fillStyle = "#efc057";
            ctx.beginPath();
            ctx.moveTo(-14, 2);
            ctx.lineTo(14, 2);
            ctx.lineTo(0, -12);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          return;
        }

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.fillStyle = this.palette.pig;
        ctx.beginPath();
        ctx.arc(0, 0, body.circleRadius || 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },

      drawGlassBlock(ctx, body) {
        if (this.assetsLoaded && this.images.blocks) {
          const frame = (body.spriteMeta && body.spriteMeta.frame) || this.getBlockFrame(body, "ice");
          this.drawStructureSprite(ctx, body, frame);
          return;
        }

        this.drawBodyRect(ctx, body, (width, height) => {
          const gradient = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
          gradient.addColorStop(0, "rgba(215, 250, 255, 0.95)");
          gradient.addColorStop(0.45, "rgba(147, 225, 248, 0.82)");
          gradient.addColorStop(1, "rgba(91, 174, 210, 0.88)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          this.drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 6);
          ctx.fill();
        });
      },

      drawWoodBlock(ctx, body) {
        if (this.assetsLoaded && this.images.blocks) {
          const frame = (body.spriteMeta && body.spriteMeta.frame) || this.getBlockFrame(body, "wood");
          this.drawStructureSprite(ctx, body, frame);
          return;
        }

        this.drawBodyRect(ctx, body, (width, height) => {
          ctx.fillStyle = "#c7843d";
          ctx.beginPath();
          this.drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 6);
          ctx.fill();
        });
      },

      drawCrate(ctx, body) {
        if (this.assetsLoaded && this.images.blocks) {
          const frame = (body.spriteMeta && body.spriteMeta.frame) || this.spriteFrames.objects.woodSquare;
          this.drawStructureSprite(ctx, body, frame);
          return;
        }

        this.drawBodyRect(ctx, body, (width, height) => {
          ctx.fillStyle = "#d89645";
          ctx.beginPath();
          this.drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 5);
          ctx.fill();
        });
      },

      drawSkySpriteBackdrop(ctx) {
        this.drawImageCover(ctx, this.images.sky, 0, 0, this.width, this.height, 1);
      },

      attachBlockSprite(body, spriteMeta) {
        body.spriteMeta = {
          frame: spriteMeta.frame,
          baseRotation: spriteMeta.baseRotation || 0,
          material: spriteMeta.material || "generic",
          width: spriteMeta.width,
          height: spriteMeta.height
        };
      },

      drawImageCover(ctx, image, x, y, width, height, alpha = 1) {
        if (!image) {
          return;
        }

        const scale = Math.max(width / image.width, height / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const offsetX = x + (width - drawWidth) / 2;
        const offsetY = y + (height - drawHeight) / 2;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        ctx.restore();
      },

      drawImageSlice(
        ctx,
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        x,
        y,
        width,
        height,
        alpha = 1,
        compositeOperation = "source-over"
      ) {
        if (!image) {
          return;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.globalCompositeOperation = compositeOperation;
        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          x,
          y,
          width,
          height
        );
        ctx.restore();
      },

      getBlockFrame(body, material) {
        const width = (body.spriteMeta && body.spriteMeta.width) || (body.bounds.max.x - body.bounds.min.x);
        const height = (body.spriteMeta && body.spriteMeta.height) || (body.bounds.max.y - body.bounds.min.y);
        const ratio = width / Math.max(height, 1);

        if (material === "ice") {
          if (ratio > 1.65) {
            return this.spriteFrames.objects.iceBeam;
          }
          return this.spriteFrames.objects.iceSquare;
        }

        if (ratio > 1.65) {
          return this.spriteFrames.objects.woodBeam;
        }
        return this.spriteFrames.objects.woodSquare;
      },

      drawStructureSprite(ctx, body, frame) {
        if (!frame || !this.images.blocks) {
          return;
        }

        const width = (body.spriteMeta && body.spriteMeta.width) || (body.bounds.max.x - body.bounds.min.x);
        const height = (body.spriteMeta && body.spriteMeta.height) || (body.bounds.max.y - body.bounds.min.y);
        const rotation = body.angle + ((body.spriteMeta && body.spriteMeta.baseRotation) || 0);
        const isVerticalIce =
          body.spriteMeta &&
          body.spriteMeta.material === "ice" &&
          Math.abs(body.spriteMeta.baseRotation || 0) > 0.1;
        const safeFrame = isVerticalIce
          ? this.createInsetFrame(frame, 1, 1)
          : this.createInsetFrame(frame, 1, 1);

        // 釉붾줉 ?ㅽ봽?쇱씠?몃뒗 ?섎굹??atlas ?덉뿉 諛붿쭩 遺숈뼱 ?덇린 ?뚮Ц??
        // 異뺤냼/?뚯쟾 ?뚮뜑留곸쓣 ?섎㈃ ??????쎌????욎뿬 ?ㅼ뼱?????덉뒿?덈떎.
        // ?쇱쓬 湲곕뫁?먯꽌 ?ㅻⅨ ?띿뒪泥섍? ?댁뼱??蹂댁씠???꾩긽??留됯린 ?꾪빐
        // 媛?μ옄由щ? ?댁쭩 ?덉そ?쇰줈 源롮? ?꾨젅?꾨쭔 ?ъ슜?섍퀬 smoothing???뺣땲??
        this.drawSpriteCentered(
          ctx,
          this.images.blocks,
          safeFrame,
          body.position.x,
          body.position.y,
          width,
          height,
          rotation,
          true
        );
        this.drawStructureOutline(
          ctx,
          body.position.x,
          body.position.y,
          width,
          height,
          rotation,
          body.spriteMeta ? body.spriteMeta.material : undefined
        );
      },

      drawImageFrame(ctx, image, frame, x, y, width, height) {
        ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, x, y, width, height);
      },

      drawSpriteCentered(ctx, image, frame, x, y, width, height, rotation = 0, disableSmoothing = false) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        if (disableSmoothing) {
          ctx.imageSmoothingEnabled = false;
        }
        this.drawImageFrame(ctx, image, frame, -width / 2, -height / 2, width, height);
        ctx.restore();
      },

      createInsetFrame(frame, insetX = 0, insetY = 0) {
        return {
          x: frame.x + insetX,
          y: frame.y + insetY,
          w: Math.max(1, frame.w - insetX * 2),
          h: Math.max(1, frame.h - insetY * 2)
        };
      },

      drawStructureOutline(ctx, x, y, width, height, rotation, material = "generic") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        if (material === "ice") {
          ctx.strokeStyle = "rgba(65, 104, 137, 0.88)";
          ctx.lineWidth = 2;
        } else if (material === "wood") {
          ctx.strokeStyle = "rgba(108, 63, 24, 0.9)";
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
          ctx.lineWidth = 1.5;
        }

        ctx.beginPath();
        ctx.rect(-width / 2, -height / 2, width, height);
        ctx.stroke();
        ctx.restore();
      },

      drawRoundedRect(ctx, x, y, width, height, radius) {
        const safeRadius = Math.min(radius, width / 2, height / 2);
        ctx.moveTo(x + safeRadius, y);
        ctx.lineTo(x + width - safeRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
        ctx.lineTo(x + width, y + height - safeRadius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
        ctx.lineTo(x + safeRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
        ctx.lineTo(x, y + safeRadius);
        ctx.quadraticCurveTo(x, y, x + safeRadius, y);
        ctx.closePath();
      },
  });
})();

