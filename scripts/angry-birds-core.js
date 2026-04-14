(function () {
  class AngryBirdsBootstrap {
    constructor() {
      // 寃뚯엫??湲곗? 醫뚰몴怨꾩엯?덈떎. ?댄썑 紐⑤뱺 諛곗튂 怨꾩궛? ???ш린瑜?湲곗??쇰줈 吏꾪뻾?⑸땲??
      this.width = 1280;
      this.height = 720;

      // DOM? 罹붾쾭???섎굹留??ъ슜?섍퀬, 紐⑤뱺 洹몃옒?쎌? ??罹붾쾭???덉뿉??洹몃┰?덈떎.
      this.canvas = document.getElementById("game-canvas");

      // Matter.js 二쇱슂 紐⑤뱢??援ъ“ 遺꾪빐?댁꽌 蹂꾩묶?쇰줈 蹂닿??⑸땲??
      this.Engine = Matter.Engine;
      this.Render = Matter.Render;
      this.Runner = Matter.Runner;
      this.World = Matter.World;
      this.Bodies = Matter.Bodies;
      this.Body = Matter.Body;
      this.Constraint = Matter.Constraint;
      this.Mouse = Matter.Mouse;
      this.MouseConstraint = Matter.MouseConstraint;
      this.Events = Matter.Events;
      this.Vector = Matter.Vector;

      // ?섏쨷??而ㅼ뒪? ?뚮뜑留곸쑝濡??뺤옣?섍린 ?쎈룄濡??붿쭊/?뚮뜑/?щ꼫瑜?硫ㅻ쾭濡?遺꾨━?⑸땲??
      this.engine = null;
      this.world = null;
      this.render = null;
      this.runner = null;
      this.mouse = null;
      this.mouseConstraint = null;
      this.groundBody = null;
      this.launcherIslandBody = null;
      this.targetIslandBody = null;
      this.woodBodies = [];
      this.glassBodies = [];
      this.crateBodies = [];
      this.pigBodies = [];

      // requestAnimationFrame ID瑜???ν빐 ?먮㈃ 異뷀썑 ?뺤?/?ъ떆???쒖뼱媛 ?ъ썙吏묐땲??
      this.renderFrameId = null;

      // 2?④퀎遺?곕뒗 ?덉킑 ?곹샇?묒슜???꾩슂???곹깭瑜?紐낇솗??遺꾨━???〓땲??
      // ?덉킑 ?ㅻ━媛 諛붾떏???먯뿰?ㅻ읇寃??우븘 蹂댁씠?꾨줉 ?듭빱瑜?議곌툑 ???꾨옒濡??대┰?덈떎.
      this.anchorPoint = { x: 250, y: 496 };
      this.birdRadius = 20;
      this.maxDragDistance = 100;
      this.launchPower = 0.18;
      this.trajectoryDotCount = 13;
      this.trajectoryStep = 5;
      this.isDraggingBird = false;
      this.hasBirdLaunched = false;
      this.bird = null;
      this.slingshotConstraint = null;
      this.pointerGrabPadding = 16;
      this.activePointerId = null;
      this.constraintIdleStiffness = 0.12;
      this.constraintDragStiffness = 0;
      this.pointerWorldPosition = {
        x: this.anchorPoint.x,
        y: this.anchorPoint.y
      };
      this.slingshotAnchor = {
        position: {
          x: this.anchorPoint.x,
          y: this.anchorPoint.y
        }
      };
      this.slingshotFootY = 628;
      this.slingshotSprite = null;
      this.SLINGSHOT_STATE = Object.freeze({
        DEFAULT: "default",
        PULLED_50: "pulled_50",
        PULLED_100: "pulled_100"
      });
      this.slingshotVisualThresholds = {
        pulled50: 28,
        pulled100: 68
      };
      // ?덉킑 ?묒?/諛곗튂 蹂댁젙媛?
      // groundEmbedDepth???덉킑 ?섎떒???붾뵒?좊낫???댁쭩 ?꾨옒???ㅼ뼱媛?꾨줉 留뚮뱶??媛믪엯?덈떎.
      // idleRightPiece / idleLeftPiece??湲곕낯 ?곹깭?먯꽌 ???뚯툩瑜??먯뿰?ㅻ읇寃?寃뱀튂寃??섎뒗 媛믪엯?덈떎.
      // pullSprite50 / pullSprite100? ?곗륫 ?섎떒 ?ㅽ봽?쇱씠?몃? 媛곴컖 50%, 100% ?밴? ?곹깭濡?洹몃┫ ???곷땲??
      // idleBandOffsets? pullSprite*.band* 媛믪? 怨좊Т以꾩씠 臾띠씠???쎌? ?쒖옉?먯쓣 ?먯쑝濡?蹂댁젙??媛믪엯?덈떎.
      this.slingshotGroundEmbedDepth = 4;
      this.slingshotFrontBaseOffsetX = 12;
      this.loadedBirdOffsetFromFrontBase = { x: -15, y: -133 };
      this.idleBirdOffset = { x: 0, y: 0 };
      this.idleRightPiece = {
        width: 42,
        height: 206,
        // 첫 번째 스프라이트(우측 새총 조각)는 바닥에 닿는 메인 기둥입니다.
        // anchorX는 "이 이미지의 바닥 중심"이 왼쪽에서 얼마나 떨어졌는지 뜻합니다.
        // 이 값을 기준으로 0%, 50%, 100% 상태 모두 같은 X축에 고정합니다.
        anchorX: 12,
        offsetY: 0
      };
      this.idleLeftPiece = {
        width: 44,
        height: 126,
        // 두 번째 스프라이트(좌측 새총 조각)는 땅까지 내려오지 않는 짧은 팔입니다.
        // 그래서 바닥 기준이 아니라 "우측 기둥에 얼마나 붙을지"를 상대 좌표로 잡습니다.
        offsetXFromRightPiece: -28.5, //-29
        offsetYFromRightPiece: -6.5 //-4
      };
      this.pullSprite50 = {
        width: 84,
        height: 204,
        anchorX: 70,
        offsetY: 0,
        bandBackLocalX: 36,
        bandBackLocalY: 52,
        bandFrontLocalX: 60,
        bandFrontLocalY: 52
      };
      this.pullSprite100 = {
        width: 102,
        height: 190,
        anchorX: 90,
        offsetY: -1,
        bandBackLocalX: 46,
        bandBackLocalY: 43,
        bandFrontLocalX: 77,
        bandFrontLocalY: 43
      };
      // 새총 렌더 수동 보정값
      this.slingshotGroundContactOffset = 82;
      this.slingshotFrontForkWidth = 48;
      this.slingshotFrontForkHeight = 164;
      this.slingshotBackForkWidth = 38;
      this.slingshotBackForkHeight = 128;
      this.slingshotFrontForkOffsetX = -24;
      this.slingshotBackForkOffsetX = -8;
      this.slingshotBackForkOffsetY = -18;
      this.slingshotBandOffsets = {
        backStartX: -12,
        backStartY: -160,
        frontStartX: 3,
        frontStartY: -142
      };

      // MouseConstraint媛 ?덈쭔 吏묒쓣 ???덈룄濡?異⑸룎 移댄뀒怨좊━瑜?遺꾨━?⑸땲??
      this.collisionCategories = {
        default: 0x0001,
        bird: 0x0002
      };

      this.transparentRender = {
        fillStyle: "rgba(0, 0, 0, 0)",
        strokeStyle: "rgba(0, 0, 0, 0)",
        lineWidth: 0
      };

      // 諛곌꼍/?뚮쭏 ?됱긽??紐⑥븘??愿由ы븯硫??댄썑 ?꾪듃 援먯껜媛 ?명빀?덈떎.
      this.palette = {
        skyTop: "#69d8ff",
        skyMid: "#9ee8ff",
        skyBottom: "#d9fbff",
        islandGrass: "#7dde3a",
        islandShadow: "#235f3f",
        cliffLight: "#f6de9d",
        cliffMid: "#c1a16a",
        cliffDark: "#6c5d44",
        wood: "#c7843d",
        woodDark: "#7f4a25",
        glass: "rgba(176, 236, 255, 0.65)",
        pig: "#7fe14b",
        pigDark: "#3d9220",
        birdRed: "#db2a2a",
        uiGold: "#ffcc4a",
        uiGoldDark: "#c98717",
        uiPanel: "#435768",
        uiPanelDark: "#243543",
        stoneBlue: "#6ea9cb",
        mistWhite: "rgba(255,255,255,0.65)",
        leafDark: "#194f30",
        leafLight: "#7ce445",
        blossom: "#fff5e8"
      };

      // ?ㅼ젣 ?ㅽ봽?쇱씠???대?吏瑜???踰덈쭔 濡쒕뱶?대몢怨? ?댄썑 ?뚮뜑留곸뿉?쒕뒗
      // ??罹먯떆瑜??ъ궗?⑺빀?덈떎. 留??꾨젅???대?吏瑜??ㅼ떆 留뚮뱾吏 ?딅룄濡?        // 誘몃━ 以鍮꾪븯??寃껋씠 以묒슂?⑸땲??
      this.images = {};
      this.assetsLoaded = false;
      this.spriteSources = {
        red: "assets/images/characters/red.png",
        pig: "assets/images/characters/pig.png",
        blocks: "assets/images/objects/blocks.png",
        slingshot: "assets/images/objects/Slingshot.png",
        sky: "assets/images/ui/sky.png",
        tree: "assets/images/ui/tree.png",
        ground: "assets/images/ui/ground.png",
        ingameGround: "assets/images/ui/ingameground.png",
        parallax: "assets/images/ui/ingame_parallax.png"
      };

      // ?ㅼ젣 ?대?吏?ㅼ쓣 蹂대땲 罹먮┃?곕뒗 "媛濡?5移??ㅽ듃由?, 援ъ“臾쇱?
      // "8 x 5??媛源뚯슫 ?꾪??쇱뒪" ?뺥깭??듬땲??
      this.spriteFrames = {
        characters: {
          red: [],
          pig: []
        },
        objects: {}
      };
    }

    async init() {
      await this.loadVisualAssets();
      this.createEngine();
      this.createRenderer();
      this.createStaticWorld();
      this.createBirdAndSlingshot();
      this.createShowcaseObjects();
      this.createMouseController();
      this.registerInteractionEvents();
      this.bindResize();
      this.bindTouchGuards();
      this.bindPointerEvents();
      this.startSimulation();
    }

    async loadVisualAssets() {
      const entries = Object.entries(this.spriteSources);
      const loadedEntries = await Promise.all(
        entries.map(async ([key, src]) => [key, await this.loadImage(src)])
      );

      this.images = Object.fromEntries(loadedEntries);
      this.slingshotSprite = this.images.slingshot || null;
      this.buildSpriteMetadata();
      this.assetsLoaded = true;
    }

    loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`?대?吏瑜?遺덈윭?ㅼ? 紐삵뻽?듬땲?? ${src}`));
        image.src = src;
      });
    }

    buildSpriteMetadata() {
      const redSheet = this.images.red;
      const pigSheet = this.images.pig;
      const blockSheet = this.images.blocks;

      if (redSheet) {
        this.spriteFrames.characters.red = [
          { x: 22, y: 130, w: 111, h: 109 },
          { x: 133, y: 130, w: 128, h: 109 },
          { x: 273, y: 130, w: 126, h: 109 },
          { x: 399, y: 130, w: 133, h: 109 },
          { x: 532, y: 130, w: 101, h: 109 }
        ];
      }

      if (pigSheet) {
        this.spriteFrames.characters.pig = [
          { x: 10, y: 118, w: 120, h: 128 },
          { x: 142, y: 118, w: 121, h: 128 },
          { x: 274, y: 118, w: 121, h: 128 },
          { x: 404, y: 123, w: 126, h: 122 },
          { x: 539, y: 118, w: 121, h: 128 }
        ];
      }

      if (blockSheet) {

        // ?곷떒 3媛??됱? ?ъ쭏蹂?wood / ice / stone) 援ъ“媛 ?쇱젙?⑸땲??
        // ?꾩옱 ?ㅽ뀒?댁???紐⑹옱? ?쇱쓬 湲곕뫁 ?꾩＜?대?濡??꾩슂??移몃쭔 ?대쫫?쇰줈 留ㅽ븨?⑸땲??
        this.spriteFrames.objects = {
          woodBeam: { x: 2276, y: 2394, w: 1098, h: 72 },
          woodBeamCore: { x: 2308, y: 2402, w: 1034, h: 56 },
          woodBeamClean: { x: 2368, y: 2400, w: 690, h: 56 },
          woodSquare: { x: 2038, y: 808, w: 196, h: 196 },
          iceBeam: { x: 2276, y: 2478, w: 1098, h: 78 },
          iceBeamCore: { x: 2308, y: 2488, w: 1034, h: 58 },
          iceBeamClean: { x: 2332, y: 2484, w: 700, h: 62 },
          iceColumnClean: { x: 2700, y: 2490, w: 120, h: 54 },
          slingshotPieceRight: { x: 38, y: 5, w: 38, h: 199 },
          slingshotPieceLeft: { x: 105, y: 7, w: 43, h: 124 },
          slingshotPull50: { x: 322, y: 253, w: 80, h: 194 },
          slingshotPull100: { x: 443, y: 255, w: 97, h: 180 },
          iceSquare: { x: 548, y: 784, w: 312, h: 306 },
          stoneSquare: { x: 258, y: 594, w: 286, h: 286 }
        };
      }
    }

    createStripFrames(image, frameCount, crop = {}) {
      const frameWidth = image.width / frameCount;
      const xInset = frameWidth * (crop.xInsetRatio || 0);
      const yInset = image.height * (crop.yInsetRatio || 0);
      const width = frameWidth * (crop.widthRatio || 1);
      const height = image.height * (crop.heightRatio || 1);

      return Array.from({ length: frameCount }, (_, frameIndex) => ({
        x: frameIndex * frameWidth + xInset,
        y: yInset,
        w: width,
        h: height
      }));
    }

  }

  window.AngryBirdsBootstrap = AngryBirdsBootstrap;
})();

