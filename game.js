    function drawStartupError(message) {
      const canvas = document.getElementById("game-canvas");
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#10263a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px Trebuchet MS, Verdana, sans-serif";
      ctx.fillText("Game failed to start", 56, 88);

      ctx.font = "20px Trebuchet MS, Verdana, sans-serif";
      const safeMessage = String(message || "Unknown error");
      ctx.fillText(safeMessage, 56, 132);
      ctx.fillText("Open the browser console for more details.", 56, 166);
    }

    window.addEventListener("load", async () => {
      try {
        if (!window.Matter) {
          throw new Error("Matter.js failed to load from CDN.");
        }

        const game = new AngryBirdsBootstrap();
        await game.init();
      } catch (error) {
        console.error(error);
        drawStartupError(error && error.message ? error.message : error);
      }
    });


