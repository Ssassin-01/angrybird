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
        this.armStructureDestruction();
      },

      armStructureDestruction(delayMs = 180) {
        const timestamp = this.engine && this.engine.timing ? this.engine.timing.timestamp : 0;
        const activateAt = timestamp + delayMs;
        const targets = [
          ...this.stoneBodies,
          ...this.woodBodies,
          ...this.glassBodies,
          ...this.crateBodies,
          ...this.tntBodies
        ];

        targets.forEach((body) => {
          if (!this.isBodyInWorld(body)) {
            return;
          }

          body.damageEnabledAt = activateAt;
        });
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

      registerDestructionEvents() {
        if (this.hasDestructionListeners) {
          return;
        }

        this.hasDestructionListeners = true;

        this.Events.on(this.engine, "collisionStart", (event) => {
          event.pairs.forEach((pair) => this.handleStructureCollision(pair));
        });

        this.Events.on(this.engine, "afterUpdate", () => {
          this.flushPendingDestruction();
        });
      },

      handleStructureCollision(pair) {
        const impact = this.getCollisionImpactScore(pair);
        const { bodyA, bodyB } = pair;
        const timestamp = this.engine && this.engine.timing ? this.engine.timing.timestamp : 0;
        const involvesStatic = Boolean(bodyA.isStatic || bodyB.isStatic);

        // 생성 직후 정착하는 접촉이나 아주 느린 미세 충돌은 피해로 취급하지 않습니다.
        // 이 완충 구간이 있어야 블록들이 "서 있는 것"만으로 스스로 삭제되지 않습니다.
        if (
          impact.score <= 0 ||
          (impact.maxSpeed < 1.8 && impact.normalSpeed < 1.2) ||
          (involvesStatic && impact.maxSpeed < 3.4 && impact.normalSpeed < 2.2)
        ) {
          return;
        }

        [bodyA, bodyB].forEach((body) => {
          if (!this.isBodyInWorld(body) || body.isStatic) {
            return;
          }

          if (timestamp < (body.damageEnabledAt || 0)) {
            return;
          }

          if (body.isTnt) {
            if (impact.score >= this.tntConfig.triggerThreshold) {
              this.queueTntExplosion(body);
            }
            return;
          }

          if (!body.isDestructible) {
            return;
          }

          if (
            impact.maxSpeed < (body.minImpactSpeed || 0) ||
            impact.score < (body.minImpactScore || 0)
          ) {
            return;
          }

          const materialResistance =
            body.materialType === "stone" ? 0.88 : body.materialType === "wood" ? 1 : body.materialType === "ice" ? 1.08 : 1;
          const appliedDamage = impact.score * materialResistance;
          body.structureHealth -= appliedDamage;

          if (appliedDamage >= body.breakThreshold || body.structureHealth <= 0) {
            this.queueBodyForRemoval(body);
          }
        });
      },

      getCollisionImpactScore(pair) {
        const relativeVelocity = this.Vector.sub(pair.bodyA.velocity, pair.bodyB.velocity);
        const relativeSpeed = this.Vector.magnitude(relativeVelocity);
        const normal = pair.collision && pair.collision.normal
          ? pair.collision.normal
          : { x: 0, y: 0 };
        const normalSpeed = Math.abs(relativeVelocity.x * normal.x + relativeVelocity.y * normal.y);
        const combinedMass = Math.max(1, pair.bodyA.mass + pair.bodyB.mass);
        const depth = pair.collision && typeof pair.collision.depth === "number"
          ? pair.collision.depth
          : 0;
        const maxSpeed = Math.max(
          this.Vector.magnitude(pair.bodyA.velocity || { x: 0, y: 0 }),
          this.Vector.magnitude(pair.bodyB.velocity || { x: 0, y: 0 })
        );
        const tangentialSpeed = Math.sqrt(Math.max(0, relativeSpeed * relativeSpeed - normalSpeed * normalSpeed));
        const compression = Math.max(0, depth - 1.5);
        const massFactor = Math.sqrt(Math.min(12, combinedMass));

        // 상대 속도보다 "실제로 정면으로 세게 박혔는지"를 더 크게 반영합니다.
        // depth(겹침량)는 보조값 정도로만 쓰고, 정지 상태의 미세 흔들림으로는 피해가 거의 생기지 않게 낮춰 둡니다.
        return {
          score: normalSpeed * massFactor * 1.35 + tangentialSpeed * 0.35 + compression * 0.45,
          normalSpeed,
          relativeSpeed,
          maxSpeed
        };
      },

      queueBodyForRemoval(body) {
        if (!this.isBodyInWorld(body) || body.isStatic) {
          return;
        }

        this.pendingBodyRemovals.add(body);
      },

      queueTntExplosion(body) {
        if (!this.isBodyInWorld(body) || body.isStatic) {
          return;
        }

        this.pendingTntExplosions.add(body);
      },

      flushPendingDestruction() {
        while (this.pendingTntExplosions.size) {
          const queuedTntBodies = Array.from(this.pendingTntExplosions);
          this.pendingTntExplosions.clear();

          queuedTntBodies.forEach((tntBody) => {
            if (this.isBodyInWorld(tntBody)) {
              this.explodeTnt(tntBody);
            }
          });
        }

        if (!this.pendingBodyRemovals.size) {
          return;
        }

        Array.from(this.pendingBodyRemovals).forEach((body) => {
          if (!this.isBodyInWorld(body)) {
            return;
          }

          this.World.remove(this.world, body);
          this.removeBodyFromCollections(body);
        });

        this.pendingBodyRemovals.clear();
      },

      explodeTnt(tntBody) {
        const center = { x: tntBody.position.x, y: tntBody.position.y };
        const radius = this.tntConfig.radius;

        this.Composite.allBodies(this.world).forEach((body) => {
          if (!this.isBodyInWorld(body) || body.isStatic || body === tntBody) {
            return;
          }

          const delta = this.Vector.sub(body.position, center);
          const distance = Math.max(1, this.Vector.magnitude(delta));

          if (distance > radius) {
            return;
          }

          const direction = this.Vector.normalise(delta);
          const falloff = 1 - distance / radius;
          const forceMagnitude = this.tntConfig.force * falloff * body.mass;

          this.Body.applyForce(body, body.position, {
            x: direction.x * forceMagnitude,
            y: direction.y * forceMagnitude - forceMagnitude * 0.18
          });

          if (body.isTnt && falloff > 0.3) {
            this.queueTntExplosion(body);
            return;
          }

          if (body.isDestructible) {
            const blastDamage = this.tntConfig.triggerThreshold * 2.1 * falloff;
            body.structureHealth -= blastDamage;

            if (blastDamage >= body.breakThreshold * 0.7 || body.structureHealth <= 0) {
              this.queueBodyForRemoval(body);
            }
          }
        });

        this.queueBodyForRemoval(tntBody);
      },

      removeBodyFromCollections(body) {
        const removeFrom = (list) => list.filter((candidate) => candidate && candidate !== body);

        this.woodBodies = removeFrom(this.woodBodies);
        this.stoneBodies = removeFrom(this.stoneBodies);
        this.glassBodies = removeFrom(this.glassBodies);
        this.crateBodies = removeFrom(this.crateBodies);
        this.tntBodies = removeFrom(this.tntBodies);
        this.pigBodies = removeFrom(this.pigBodies);
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

