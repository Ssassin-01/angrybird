(function () {
  const proto = window.AngryBirdsBootstrap && window.AngryBirdsBootstrap.prototype;
  if (!proto) {
    throw new Error("AngryBirdsBootstrap core must load before world methods.");
  }

  Object.assign(proto, {
      createEngine() {
        // Matter.Engine? 臾쇰━ 怨꾩궛??以묒떖?낅땲??
        this.engine = this.Engine.create();
        this.world = this.engine.world;

        // 以묐젰? ?꾨옒 諛⑺뼢(y+)?쇰줈 ?묒슜?⑸땲??
        this.world.gravity.x = 0;
        this.world.gravity.y = 1.05;
      },

      createRenderer() {
        // Matter.Render???꾩옱 ?④퀎???붾쾭洹??꾨줈?좏????뚮뜑????븷?낅땲??
        // ?섏쨷???대?吏 湲곕컲 而ㅼ뒪? ?뚮뜑?щ줈 諛붽? ?뚮룄 render ?몄뒪?댁뒪瑜?洹몃?濡??ъ궗?⑺븷 ???덉뒿?덈떎.
        this.render = this.Render.create({
          canvas: this.canvas,
          engine: this.engine,
          options: {
            width: this.width,
            height: this.height,
            wireframes: false,
            background: "transparent",
            pixelRatio: 1
          }
        });

        // 湲곕낯 Matter ?뚮뜑 罹붾쾭?ㅻ뒗 ?щ챸?섍쾶 ?좎??댁꽌,
        // 媛숈? 罹붾쾭???꾩뿉 ?곕━媛 吏곸젒 諛곌꼍/?μ떇 ?덉씠?대? 源????덇쾶 ?⑸땲??
        this.render.canvas.style.background = "transparent";

        // 2?④퀎 ?붽뎄?ы빆: afterRender?먯꽌 ?먯꽑 沅ㅼ쟻??洹몃┫ ???덈룄濡??대깽?몃? ?깅줉?⑸땲??
        this.Events.on(this.render, "afterRender", () => {
          this.drawTrajectoryDots();
        });
      },

      createStaticWorld() {
        // 諛붾떏: y 700 遺洹쇱뿉???꾩껜 ?붾뱶瑜?吏吏?섎뒗 ???뺤쟻 諛붾뵒?낅땲??
        const ground = this.Bodies.rectangle(this.width / 2, 686, 1500, 120, {
          isStatic: true,
          friction: 0.95,
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        // 醫뚯슦 踰? 泥쒖옣? 臾쇰━ 媛앹껜 ?댄깉 諛⑹??⑹씠???꾩쟾???щ챸?섍쾶 留뚮벊?덈떎.
        const leftWall = this.Bodies.rectangle(-25, this.height / 2, 50, this.height + 400, {
          isStatic: true,
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        const rightWall = this.Bodies.rectangle(this.width + 25, this.height / 2, 50, this.height + 400, {
          isStatic: true,
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        const ceiling = this.Bodies.rectangle(this.width / 2, -25, this.width + 400, 50, {
          isStatic: true,
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        // 諛쒖궗? ?ъ쓽 ?쒓컖 ?붿냼??drawBackdropLayer?먯꽌 吏곸젒 洹몃━怨??덉쑝誘濡?
        // ?ш린 臾쇰━ 諛붾뵒??"?낅젰??諛⑺빐?섏? ?딆쓣 ?뺣룄濡???퀬 ?뉕쾶"留??〓땲??
        // ?대젃寃??섎㈃ 珥덈줉???붾쾭洹?諛뺤뒪媛 ?덈? ?밴만 ???먯뿉 嫄몃━???먮굦??二쇱? ?딆뒿?덈떎.
        const launcherIsland = this.Bodies.rectangle(230, 635, 260, 18, {
          isStatic: true,
          chamfer: { radius: 8 },
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        const targetIsland = this.Bodies.rectangle(980, 635, 430, 18, {
          isStatic: true,
          chamfer: { radius: 8 },
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        this.groundBody = ground;
        this.launcherIslandBody = launcherIsland;
        this.targetIslandBody = targetIsland;
        this.updateSlingshotPlacementFromGround();

        this.World.add(this.world, [
          ground,
          leftWall,
          rightWall,
          ceiling,
          launcherIsland,
          targetIsland
        ]);
      },

      createBirdAndSlingshot() {
        // 諛쒖궗泥대뒗 ?듭빱? 媛숈? ?꾩튂?먯꽌 ?쒖옉?⑸땲??
        // 異⑸룎 移댄뀒怨좊━瑜?bird濡?遺꾨━???먮㈃ MouseConstraint媛 ???덈쭔 吏묎쾶 留뚮뱾 ???덉뒿?덈떎.
        this.bird = this.Bodies.circle(
          this.anchorPoint.x,
          this.anchorPoint.y,
          this.birdRadius,
          {
            density: 0.004,
            restitution: 0.28,
            friction: 0.03,
            // 沅ㅼ쟻 ?먯꽑怨??ㅼ젣 鍮꾪뻾 沅ㅻ룄瑜?理쒕????쇱튂?쒗궎湲??꾪빐 怨듦린 ???? ?쒓굅?⑸땲??
            // 洹몃윭硫?x??1李? y??2李??앹쑝濡??덉륫??媛?ν빐??媛踰쇱슫 怨꾩궛?쇰줈???뺥솗?꾧? ?믪븘吏묐땲??
            frictionAir: 0,
            collisionFilter: {
              category: this.collisionCategories.bird
            },
            render: this.transparentRender
          }
        );

        // Constraint媛 ?ㅼ젣 怨좊Т以???븷???⑸땲??
        // 湲몄씠(length)瑜?0?쇰줈 ?먮㈃ ?듭빱??遺숈뼱 ?덈떎媛 ?밴꼈?????꾩꽦???앷퉩?덈떎.
        this.slingshotConstraint = this.Constraint.create({
          pointA: { x: this.anchorPoint.x, y: this.anchorPoint.y },
          bodyB: this.bird,
          stiffness: this.constraintIdleStiffness,
          damping: 0.04,
          length: 0,
          render: {
            visible: false
          }
        });

        this.World.add(this.world, [this.bird, this.slingshotConstraint]);
      },

      createStructureBlock(x, y, width, height, material, spriteMeta = {}, extraOptions = {}) {
        const materialConfig = this.blockMaterialConfig[material];
        const body = this.Bodies.rectangle(x, y, width, height, {
          density: materialConfig.density,
          friction: materialConfig.friction,
          frictionStatic: materialConfig.frictionStatic,
          frictionAir: materialConfig.frictionAir,
          restitution: materialConfig.restitution,
          slop: 0.01,
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender,
          ...extraOptions
        });

        body.materialType = material;
        body.isDestructible = true;
        body.isTnt = material === "tnt";
        body.structureHealth = materialConfig.health;
        body.breakThreshold = materialConfig.breakThreshold;
        // 구조물은 발사 전까지는 절대 파괴되지 않게 잠가 둡니다.
        // 지금 단계에서는 "먼저 탑이 보이고, 새가 맞았을 때만 부서지는 것"이 더 중요하므로
        // 발사 직후 gameplay 쪽에서 이 값을 실제 timestamp로 갱신해 활성화합니다.
        body.damageEnabledAt = Number.POSITIVE_INFINITY;
        body.minImpactSpeed = material === "stone" ? 3.6 : material === "wood" ? 2.8 : material === "ice" ? 2.2 : 2.4;
        body.minImpactScore = material === "stone" ? 9 : material === "wood" ? 6.5 : material === "ice" ? 4.25 : 5;

        this.attachBlockSprite(body, {
          material,
          width,
          height,
          ...spriteMeta
        });

        const inertiaMultiplier = material === "stone" ? 4.4 : material === "wood" ? 2.6 : 1.6;
        this.Body.setInertia(body, body.inertia * inertiaMultiplier);
        return body;
      },

      createShowcaseObjects() {
        // 우측 타워는 이제 "도형을 늘려서 텍스처를 얹는 방식"이 아니라,
        // blocks.png 안의 L / M / S 원본 비율을 그대로 축소한 뒤 쌓는 방식으로 만듭니다.
        // 즉, 가로 부재는 가로 비율 그대로, 세로 기둥은 같은 스프라이트를 90도 회전해 사용합니다.
        const groups = this.spriteFrames.objects.blockSpriteGroups;
        const horizontalScale = 0.17;
        const tntScale = 0.16;
        const platformTopY = this.targetIslandBody.position.y - 9;
        const towerCenterX = 975;

        const getScaledSize = (frame, scale) => ({
          width: Math.round(frame.w * scale),
          height: Math.round(frame.h * scale)
        });

        const getHorizontalBlockSpec = (frames, scale) => {
          const baseFrame = frames[0];
          const size = getScaledSize(baseFrame, scale);
          return {
            frames,
            width: size.width,
            height: size.height,
            baseRotation: 0
          };
        };

        const getVerticalBlockSpec = (frames, scale) => {
          const baseFrame = frames[0];
          const size = getScaledSize(baseFrame, scale);
          return {
            frames,
            width: size.height,
            height: size.width,
            baseRotation: Math.PI / 2
          };
        };

        const sStone = getHorizontalBlockSpec(groups.S.stone, horizontalScale);
        const sIce = getHorizontalBlockSpec(groups.S.ice, horizontalScale);
        const sWood = getHorizontalBlockSpec(groups.S.wood, horizontalScale);
        const lWood = getHorizontalBlockSpec(groups.L.wood, horizontalScale);
        const mStoneVertical = getVerticalBlockSpec(groups.M.stone, horizontalScale);
        const mIceVertical = getVerticalBlockSpec(groups.M.ice, horizontalScale);
        const tntFrame = this.spriteFrames.objects.tntBox;
        const tntSize = getScaledSize(tntFrame, tntScale);

        const baseFootY = platformTopY - sStone.height / 2;
        const baseColumnY = baseFootY - sStone.height / 2 - mStoneVertical.height / 2;
        const mainBeamY = baseColumnY - mStoneVertical.height / 2 - lWood.height / 2;
        const innerShelfY = baseColumnY + 8;
        const upperColumnY = mainBeamY - lWood.height / 2 - mIceVertical.height / 2;
        const topBeamY = upperColumnY - mIceVertical.height / 2 - sWood.height / 2;
        const topCapY = topBeamY - sWood.height * 1.15;

        const baseLeftX = towerCenterX - 58;
        const baseRightX = towerCenterX + 58;
        const upperLeftX = towerCenterX - 31;
        const upperRightX = towerCenterX + 31;
        const outerFootOffset = 58;

        const leftStoneFoot = this.createStructureBlock(towerCenterX - outerFootOffset, baseFootY, sStone.width, sStone.height, "stone", {
          frames: sStone.frames
        });
        const centerStoneFoot = this.createStructureBlock(towerCenterX, baseFootY, sStone.width, sStone.height, "stone", {
          frames: sStone.frames
        });
        const rightStoneFoot = this.createStructureBlock(towerCenterX + outerFootOffset, baseFootY, sStone.width, sStone.height, "stone", {
          frames: sStone.frames
        });

        const baseStoneLeft = this.createStructureBlock(baseLeftX, baseColumnY, mStoneVertical.width, mStoneVertical.height, "stone", {
          frames: mStoneVertical.frames,
          baseRotation: mStoneVertical.baseRotation
        });
        const baseStoneRight = this.createStructureBlock(baseRightX, baseColumnY, mStoneVertical.width, mStoneVertical.height, "stone", {
          frames: mStoneVertical.frames,
          baseRotation: mStoneVertical.baseRotation
        });

        const tntShelf = this.createStructureBlock(towerCenterX, innerShelfY, sIce.width, sIce.height, "ice", {
          frames: sIce.frames
        });

        const mainWoodBeam = this.createStructureBlock(towerCenterX, mainBeamY, lWood.width, lWood.height, "wood", {
          frames: lWood.frames
        });

        const upperIceLeft = this.createStructureBlock(upperLeftX, upperColumnY, mIceVertical.width, mIceVertical.height, "ice", {
          frames: mIceVertical.frames,
          baseRotation: mIceVertical.baseRotation
        });
        const upperIceRight = this.createStructureBlock(upperRightX, upperColumnY, mIceVertical.width, mIceVertical.height, "ice", {
          frames: mIceVertical.frames,
          baseRotation: mIceVertical.baseRotation
        });

        const topWoodBeam = this.createStructureBlock(towerCenterX, topBeamY, sWood.width, sWood.height, "wood", {
          frames: sWood.frames
        });

        const tntBlock = this.createStructureBlock(towerCenterX, innerShelfY - sIce.height / 2 - tntSize.height / 2, tntSize.width, tntSize.height, "tnt", {
          frame: tntFrame
        });

        const pigLarge = this.Bodies.circle(towerCenterX, mainBeamY - lWood.height / 2 - 24, 24, {
          restitution: 0.05,
          density: 0.0019,
          friction: 0.86,
          frictionStatic: 1.3,
          frictionAir: 0.01,
          slop: 0.01,
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        const pigSmall = this.Bodies.circle(towerCenterX, topBeamY - sWood.height / 2 - 21, 21, {
          restitution: 0.05,
          density: 0.0017,
          friction: 0.86,
          frictionStatic: 1.3,
          frictionAir: 0.01,
          slop: 0.01,
          collisionFilter: {
            category: this.collisionCategories.default
          },
          render: this.transparentRender
        });

        const topCap = this.createStructureBlock(towerCenterX, topCapY, sStone.width, sStone.height, "stone", {
          frames: sStone.frames
        });

        this.stoneBodies = [
          leftStoneFoot,
          centerStoneFoot,
          rightStoneFoot,
          baseStoneLeft,
          baseStoneRight,
          topCap
        ];
        this.woodBodies = [mainWoodBeam, topWoodBeam];
        this.glassBodies = [tntShelf, upperIceLeft, upperIceRight];
        this.tntBodies = [tntBlock];
        this.pigBodies = [pigLarge, pigSmall];
        this.crateBodies = [];

        this.World.add(this.world, [
          ...this.stoneBodies,
          ...this.woodBodies,
          ...this.glassBodies,
          ...this.tntBodies,
          pigLarge,
          pigSmall
        ]);
      },

      createMouseController() {
        // Mouse???꾩옱 罹붾쾭?ㅼ쓽 ?붾㈃???ш린瑜?湲곗??쇰줈 醫뚰몴瑜??쎌뒿?덈떎.
        // ?곕━ 寃뚯엫? HTML width/height??怨좎젙?닿퀬 CSS留??ㅼ??쇰릺誘濡?
        // 由ъ궗?댁쫰 ?뚮쭏??蹂꾨룄濡?scale??留욎떠 以섏빞 ?쒕옒洹?醫뚰몴媛 ?뺥솗?섍쾶 ?ㅼ뼱?듬땲??
        this.mouse = this.Mouse.create(this.canvas);
        this.updateMouseScale();

        this.mouseConstraint = this.MouseConstraint.create(this.engine, {
          mouse: this.mouse,
          collisionFilter: {
            mask: 0
          },
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false
            }
          }
        });

        this.render.mouse = this.mouse;
        this.World.add(this.world, this.mouseConstraint);
      },

      registerInteractionEvents() {
        // ?쒕옒洹?以??쒗븳 濡쒖쭅:
        // ?ъ씤???대깽?몄뿉????ν빐 ??醫뚰몴瑜????꾩튂??吏곸젒 諛섏쁺?섎릺, ?듭빱 湲곗? 諛섍꼍 100px ???덉쑝濡쒕쭔 ?대룞?쒗궢?덈떎.
        // 利? ?ъ슜?먭? 硫由??쒕옒洹명빐???ㅼ젣 ?덈뒗 怨좎젙 諛섍꼍 寃쎄퀎源뚯?留??곕씪?듬땲??
        this.Events.on(this.engine, "beforeUpdate", () => {
          if (!this.isDraggingBird || this.hasBirdLaunched || !this.bird) {
            return;
          }

          this.slingshotConstraint.stiffness = this.constraintDragStiffness;
          this.moveBirdToPointer();

          // ?쒕옒洹?以묒뿉???ъ슜?먭? ?먰븯??諛⑺뼢留?蹂댁씠怨??붾뱾由쇱? 理쒖냼?붾릺?꾨줉
          // ?띾룄? ?뚯쟾???좉퉸 0?쇰줈 怨좎젙?⑸땲??
          this.Body.setVelocity(this.bird, { x: 0, y: 0 });
          this.Body.setAngularVelocity(this.bird, 0);
          this.Body.setAngle(this.bird, 0);
        });

        this.registerDestructionEvents();
      },

      bindResize() {
        // 罹붾쾭???대? ?댁긽?꾨뒗 怨좎젙?섍퀬, CSS ?ш린留?議곗젅?섎뒗 Letterbox ?ㅼ??쇰쭅?낅땲??
        const resize = () => {
          const scale = Math.min(
            window.innerWidth / this.width,
            window.innerHeight / this.height
          );

          const scaledWidth = this.width * scale;
          const scaledHeight = this.height * scale;

          this.canvas.style.width = `${scaledWidth}px`;
          this.canvas.style.height = `${scaledHeight}px`;
          this.updateMouseScale();
        };

        resize();
        window.addEventListener("resize", resize);
      },

      bindTouchGuards() {
        // 紐⑤컮?쇱뿉??罹붾쾭?ㅻ? ?먭??쎌쑝濡??밴만 ??        // 釉뚮씪?곗???湲곕낯 ?ㅽ겕濡?/ ?덈줈怨좎묠 ?쒖뒪泥섍? ?쇱뼱?ㅼ? ?딅룄濡?留됱뒿?덈떎.
        this.canvas.style.touchAction = "none";

        ["touchstart", "touchmove", "touchend", "touchcancel", "gesturestart", "gesturechange"].forEach((eventName) => {
          this.canvas.addEventListener(
            eventName,
            (event) => {
              event.preventDefault();
            },
            { passive: false }
          );
        });
      },

      bindPointerEvents() {
        // ?ㅼ젣 ?쒕옒洹??낅젰? Pointer Events濡?吏곸젒 泥섎━?⑸땲??
        // ??諛⑹떇? 留덉슦???곗튂/?쒖쓣 ?섎굹??肄붾뱶 寃쎈줈?먯꽌 ?덉젙?곸쑝濡??ㅻ０ ???덉뼱??        // 紐⑤컮???곗튂 誘몃룞??臾몄젣瑜??쇳븯?????⑥뵮 ?좊━?⑸땲??
        this.canvas.addEventListener(
          "pointerdown",
          (event) => {
            if (this.hasBirdLaunched || !this.bird) {
              return;
            }

            event.preventDefault();
            this.updatePointerWorldPosition(event);

            if (!this.isPointerInsideBird(this.pointerWorldPosition)) {
              return;
            }

            this.activePointerId = event.pointerId;
            this.isDraggingBird = true;
            this.slingshotConstraint.stiffness = this.constraintDragStiffness;
            this.Body.setVelocity(this.bird, { x: 0, y: 0 });
            this.Body.setAngularVelocity(this.bird, 0);

            if (this.canvas.setPointerCapture) {
              this.canvas.setPointerCapture(event.pointerId);
            }

            this.moveBirdToPointer();
          },
          { passive: false }
        );

        this.canvas.addEventListener(
          "pointermove",
          (event) => {
            if (this.activePointerId !== null && event.pointerId !== this.activePointerId) {
              return;
            }

            event.preventDefault();
            this.updatePointerWorldPosition(event);

            if (this.isDraggingBird) {
              this.moveBirdToPointer();
            }
          },
          { passive: false }
        );

        const releasePointer = (event) => {
          if (this.activePointerId === null || event.pointerId !== this.activePointerId) {
            return;
          }

          event.preventDefault();
          this.updatePointerWorldPosition(event);
          this.activePointerId = null;

          if (
            this.canvas.releasePointerCapture &&
            this.canvas.hasPointerCapture &&
            this.canvas.hasPointerCapture(event.pointerId)
          ) {
            this.canvas.releasePointerCapture(event.pointerId);
          }

          if (!this.isDraggingBird || this.hasBirdLaunched) {
            return;
          }

          this.isDraggingBird = false;
          this.launchBird(this.getLaunchStateFromPosition(this.getClampedDragPosition()));
        };

        this.canvas.addEventListener("pointerup", releasePointer, { passive: false });
        this.canvas.addEventListener("pointercancel", releasePointer, { passive: false });
        this.canvas.addEventListener("lostpointercapture", () => {
          if (this.isDraggingBird && !this.hasBirdLaunched) {
            this.isDraggingBird = false;
            this.launchBird(this.getLaunchStateFromPosition(this.getClampedDragPosition()));
          }

          this.activePointerId = null;
        });
      },

      updateMouseScale() {
        if (!this.mouse) {
          return;
        }

        const bounds = this.canvas.getBoundingClientRect();

        if (!bounds.width || !bounds.height) {
          return;
        }

        this.Mouse.setScale(this.mouse, {
          x: this.width / bounds.width,
          y: this.height / bounds.height
        });

        this.Mouse.setOffset(this.mouse, { x: 0, y: 0 });
      },

      startSimulation() {
        // Runner??臾쇰━ ?붿쭊 ?낅뜲?댄듃留??대떦?⑸땲??
        this.runner = this.Runner.create();
        this.Runner.run(this.runner, this.engine);

        // ?뚮뜑??吏곸젒 requestAnimationFrame?쇰줈 媛먯떥??
        // Matter ?붾쾭洹??뚮뜑 + 而ㅼ뒪? 諛곌꼍 ?쒕줈?됱쓣 ??罹붾쾭?ㅼ뿉???④퍡 泥섎━?⑸땲??
        const renderLoop = () => {
          this.Render.world(this.render);
          this.drawBackdropLayer();
          this.drawForegroundLayer();
          this.renderFrameId = window.requestAnimationFrame(renderLoop);
        };

        renderLoop();
      },

  });
})();

