(function () {
  const proto = window.AngryBirdsBootstrap && window.AngryBirdsBootstrap.prototype;
  if (!proto) {
    throw new Error("AngryBirdsBootstrap core must load before gameplay methods.");
  }

  Object.assign(proto, {
      launchBird(launchState = this.getLaunchState()) {
        if (!this.bird || !this.slingshotConstraint || this.hasBirdLaunched) {
          return;
        }

        this.World.remove(this.world, this.slingshotConstraint);
        this.slingshotConstraint = null;
        this.hasBirdLaunched = true;

        // 諛쒖궗 ?꾩뿉???ㅼ떆 ?≫엳吏 ?딅룄濡?異⑸룎 移댄뀒怨좊━瑜?湲곕낯媛믪쑝濡?諛붽퓠?덈떎.
        this.bird.collisionFilter.category = this.collisionCategories.default;

        // ?먯꽑 沅ㅼ쟻 怨꾩궛???ъ슜???꾩튂/?띾룄瑜??ㅼ젣 諛쒖궗?먮룄 洹몃?濡??ъ슜?⑸땲??
        // ?대젃寃??섎㈃ "?덉긽 寃쎈줈"? "?ㅼ젣 泥??꾨젅????湲곗?媛믪씠 ?꾩쟾??媛숈븘吏묐땲??
        this.Body.setPosition(this.bird, launchState.position);
        this.Body.setAngle(this.bird, 0);
        this.Body.setAngularVelocity(this.bird, 0);
        this.bird.force.x = 0;
        this.bird.force.y = 0;
        this.bird.torque = 0;
        this.Body.setVelocity(this.bird, launchState.velocity);
      },

      moveBirdToPointer() {
        if (!this.bird) {
          return;
        }

        const dragPosition = this.getClampedDragPosition();
        this.Body.setPosition(this.bird, dragPosition);
      },

      clampBirdToAnchorRadius() {
        if (!this.bird) {
          return;
        }

        const pullVector = this.Vector.sub(this.bird.position, this.anchorPoint);
        const currentDistance = this.Vector.magnitude(pullVector);

        if (currentDistance <= this.maxDragDistance) {
          return;
        }

        const clampedPosition = this.Vector.add(
          this.anchorPoint,
          this.Vector.mult(
            this.Vector.normalise(pullVector),
            this.maxDragDistance
          )
        );

        this.Body.setPosition(this.bird, clampedPosition);
      },

      isPointerInsideBird(pointerPosition = this.pointerWorldPosition) {
        if (!this.bird) {
          return false;
        }

        const pointerVector = this.Vector.sub(pointerPosition, this.bird.position);
        const pointerDistance = this.Vector.magnitude(pointerVector);

        return pointerDistance <= this.birdRadius + this.pointerGrabPadding;
      },

      updatePointerWorldPosition(event) {
        this.pointerWorldPosition = this.screenToWorldPosition(event.clientX, event.clientY);
      },

      screenToWorldPosition(clientX, clientY) {
        const bounds = this.canvas.getBoundingClientRect();

        return {
          x: ((clientX - bounds.left) / bounds.width) * this.width,
          y: ((clientY - bounds.top) / bounds.height) * this.height
        };
      },

      getLaunchVelocity() {
        const launchPosition = this.isDraggingBird
          ? this.getClampedDragPosition()
          : (this.bird ? this.bird.position : this.anchorPoint);
        const stretchVector = this.Vector.sub(this.anchorPoint, launchPosition);

        return {
          x: stretchVector.x * this.launchPower,
          y: stretchVector.y * this.launchPower
        };
      },

      getLaunchState() {
        const position = this.isDraggingBird
          ? this.getClampedDragPosition()
          : (this.bird ? { x: this.bird.position.x, y: this.bird.position.y } : this.anchorPoint);

        return this.getLaunchStateFromPosition(position);
      },

      getLaunchStateFromPosition(position) {
        return {
          position: {
            x: position.x,
            y: position.y
          },
          velocity: this.getLaunchVelocityFromPosition(position)
        };
      },

      getLaunchVelocityFromPosition(position) {
        const stretchVector = this.Vector.sub(this.anchorPoint, position);

        return {
          x: stretchVector.x * this.launchPower,
          y: stretchVector.y * this.launchPower
        };
      },

      getClampedDragPosition(position = this.pointerWorldPosition) {
        const pullVector = this.Vector.sub(position, this.anchorPoint);
        const currentDistance = this.Vector.magnitude(pullVector);

        if (currentDistance <= this.maxDragDistance) {
          return {
            x: position.x,
            y: position.y
          };
        }

        return this.Vector.add(
          this.anchorPoint,
          this.Vector.mult(
            this.Vector.normalise(pullVector),
            this.maxDragDistance
          )
        );
      },

      drawTrajectoryDots() {
        // ?붽뎄?ы빆:
        // 諛쒖궗 ?꾩뿉留? 洹몃━怨??ъ슜?먭? ?ㅼ젣濡??덈? ?밴린怨??덈뒗 ?숈븞?먮쭔 ?먯꽑??蹂댁뿬 以띾땲??
        // 諛쒖궗 ?꾩뿉??利됱떆 ?④꺼???섎?濡?hasBirdLaunched ?곹깭瑜?媛숈씠 ?뺤씤?⑸땲??
        if (!this.isDraggingBird || this.hasBirdLaunched || !this.bird) {
          return;
        }

        const ctx = this.render.context;
        const launchState = this.getLaunchState();
        const start = launchState.position;
        const velocity = launchState.velocity;
        const previewBody = this.Bodies.circle(start.x, start.y, this.birdRadius, {
          frictionAir: this.bird.frictionAir
        });

        // ?먯꽑怨??ㅼ젣 諛쒖궗媛 媛숈? ?곷텇 洹쒖튃???곕Ⅴ?꾨줉,
        // ?꾩떆 body ?섎굹???ㅼ젣 諛쒖궗? ?숈씪???꾩튂/?띾룄瑜??ｊ퀬 Body.update瑜?諛섎났?⑸땲??
        // ?붾뱶 ?꾩껜瑜?蹂듭젣?섎뒗 臾닿굅??諛⑹떇???꾨땲??body ?섎굹???섑븰 ?곹깭留??곕씪媛??諛⑹떇?대씪 媛蹂띿뒿?덈떎.
        this.Body.setPosition(previewBody, start);
        this.Body.setVelocity(previewBody, velocity);

        ctx.save();

        for (let index = 1; index <= this.trajectoryDotCount; index += 1) {
          for (let subStep = 0; subStep < this.trajectoryStep; subStep += 1) {
            previewBody.force.x =
              previewBody.mass *
              this.engine.world.gravity.x *
              this.engine.world.gravity.scale;
            previewBody.force.y =
              previewBody.mass *
              this.engine.world.gravity.y *
              this.engine.world.gravity.scale;

            this.Body.update(previewBody, this.Body._baseDelta);

            previewBody.force.x = 0;
            previewBody.force.y = 0;
            previewBody.torque = 0;
          }

          // ?붾㈃ 諛??먯? 援녹씠 ??洹몃━吏 ?딆븘???섎?濡?議곌린 醫낅즺?⑸땲??
          if (
            previewBody.position.x < 0 ||
            previewBody.position.x > this.width ||
            previewBody.position.y > this.height
          ) {
            break;
          }

          const radius = Math.max(1.8, 5 - index * 0.22);
          const alpha = Math.max(0.16, 0.9 - index * 0.055);
          const strokeAlpha = Math.max(0.22, alpha * 0.82);
          const strokeWidth = Math.max(1, radius * 0.26);

          // 밝은 하늘/구름 배경 위에서도 점선이 묻히지 않도록,
          // 흰 점 바깥에 짙은 테두리를 먼저 한 번 그린 뒤 안을 채웁니다.
          // 이렇게 하면 원래의 Angry Birds식 "동그란 예측 점" 느낌은 유지하면서도
          // 어떤 배경색 위에서도 또렷하게 보입니다.
          ctx.strokeStyle = `rgba(88, 120, 146, ${strokeAlpha})`;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(previewBody.position.x, previewBody.position.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();
        }

        ctx.restore();
      },

  });
})();

