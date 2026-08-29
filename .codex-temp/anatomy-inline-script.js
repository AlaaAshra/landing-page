
    (() => {
      const LOOP_MS = 10800;

      // Swap these paths with the cropped PNG exports from the real atlas.
      // The demo remains self-contained by drawing a neutral placeholder texture
      // if a file is not present at the configured URL.
      const TEXTURE_URLS = {
        baseFront: "textures/anatomy/skeleton-front.png",
        cardioFront: "textures/anatomy/skeleton-cardiovascular-front.png",
        combinedFront: "textures/anatomy/skeleton-cardio-digestive-front.png",
        combinedQuarter: "textures/anatomy/skeleton-cardio-digestive-three-quarter.png",
        torsoClose: "textures/anatomy/skeleton-cardio-digestive-torso-close.png",
        baseReturn: "textures/anatomy/skeleton-back-to-front.png"
      };

      const frame = document.getElementById("frame");
      const atlas = document.querySelector(".atlas");
      const cursor = document.getElementById("cursor");
      const ring = document.getElementById("click-ring");
      const tooltip = document.getElementById("tooltip");
      const scanGlow = document.getElementById("scan-glow");
      const shadow = document.getElementById("model-shadow");
      const cardioRow = document.getElementById("system-cardio");
      const digestiveRow = document.getElementById("system-digestive");
      const articularRow = document.getElementById("system-articular");

      const clamp01 = (v) => Math.max(0, Math.min(1, v));
      const ease = (v) => {
        v = clamp01(v);
        return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
      };
      const lerp = (a, b, t) => a + (b - a) * t;
      const range = (t, start, end) => ease((t - start) / (end - start));

      function fitFrame() {
        const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
        frame.style.setProperty("--demo-scale", scale.toFixed(4));
      }

      function stateProgress(t, onStart, onEnd, offStart, offEnd) {
        if (t < onStart) return 0;
        if (t < onEnd) return range(t, onStart, onEnd);
        if (t < offStart) return 1;
        if (t < offEnd) return 1 - range(t, offStart, offEnd);
        return 0;
      }

      function applySystemState(el, value) {
        el.classList.toggle("is-active", value > 0.52);
        el.style.setProperty("--expand", value.toFixed(3));
      }

      function tweenPoint(t, start, end, from, to) {
        const p = range(t, start, end);
        return {
          x: lerp(from.x, to.x, p),
          y: lerp(from.y, to.y, p)
        };
      }

      function cursorPoint(t) {
        const points = {
          idle: { x: 990, y: 294 },
          cardio: { x: 37, y: 173 },
          digestive: { x: 37, y: 205 },
          model: { x: 725, y: 327 },
          torso: { x: 759, y: 349 },
          exit: { x: 1060, y: 470 }
        };

        if (t < 1.45) return points.idle;
        if (t < 2.08) return tweenPoint(t, 1.45, 2.08, points.idle, points.cardio);
        if (t < 2.42) return points.cardio;
        if (t < 3.05) return tweenPoint(t, 2.42, 3.05, points.cardio, points.digestive);
        if (t < 3.40) return points.digestive;
        if (t < 5.85) return tweenPoint(t, 3.40, 5.85, points.digestive, points.model);
        if (t < 7.75) return tweenPoint(t, 5.85, 6.25, points.model, points.torso);
        if (t < 8.25) return tweenPoint(t, 7.75, 8.25, points.torso, points.digestive);
        if (t < 8.58) return points.digestive;
        if (t < 9.06) return tweenPoint(t, 8.58, 9.06, points.digestive, points.cardio);
        if (t < 9.40) return points.cardio;
        return tweenPoint(t, 9.40, 10.80, points.cardio, points.exit);
      }

      function pulseAt(t, center, width) {
        const d = Math.abs(t - center) / width;
        return clamp01(1 - d);
      }

      function makePlaceholderTexture(key) {
        const canvas = document.createElement("canvas");
        canvas.width = 900;
        canvas.height = 1300;
        const ctx = canvas.getContext("2d");
        const label = {
          baseFront: "SKELETON FRONT PNG",
          cardioFront: "CARDIO OVERLAY PNG",
          combinedFront: "COMBINED FRONT PNG",
          combinedQuarter: "3/4 ANGLE PNG",
          torsoClose: "TORSO CLOSE-UP PNG",
          baseReturn: "BASE RETURN PNG"
        }[key] || "ATLAS PNG";

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const glow = ctx.createRadialGradient(450, 600, 40, 450, 600, 520);
        glow.addColorStop(0, "rgba(125,170,220,0.30)");
        glow.addColorStop(0.46, "rgba(60,100,150,0.14)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        if (key === "combinedQuarter") {
          ctx.translate(78, 0);
          ctx.scale(0.86, 1);
        }
        if (key === "torsoClose") {
          ctx.translate(-36, -188);
          ctx.scale(1.18, 1.18);
        }

        ctx.strokeStyle = "rgba(221,229,232,0.70)";
        ctx.lineWidth = 18;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fillStyle = "rgba(215,226,228,0.16)";

        ctx.beginPath();
        ctx.ellipse(450, 182, 66, 82, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(450, 266);
        ctx.bezierCurveTo(444, 350, 442, 470, 450, 640);
        ctx.stroke();

        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(342, 372);
        ctx.bezierCurveTo(395, 342, 500, 342, 558, 372);
        ctx.moveTo(322, 458);
        ctx.bezierCurveTo(392, 424, 508, 424, 580, 458);
        ctx.moveTo(334, 552);
        ctx.bezierCurveTo(396, 524, 504, 524, 566, 552);
        ctx.stroke();

        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(335, 370);
        ctx.bezierCurveTo(278, 455, 260, 602, 254, 815);
        ctx.moveTo(565, 370);
        ctx.bezierCurveTo(622, 455, 640, 602, 646, 815);
        ctx.moveTo(410, 630);
        ctx.bezierCurveTo(388, 770, 375, 890, 360, 1120);
        ctx.moveTo(490, 630);
        ctx.bezierCurveTo(512, 770, 525, 890, 540, 1120);
        ctx.stroke();

        if (key === "cardioFront" || key === "combinedFront" || key === "combinedQuarter" || key === "torsoClose") {
          ctx.strokeStyle = "rgba(221,68,96,0.78)";
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.moveTo(450, 342);
          ctx.bezierCurveTo(395, 430, 382, 525, 335, 632);
          ctx.moveTo(450, 342);
          ctx.bezierCurveTo(510, 430, 526, 522, 588, 640);
          ctx.moveTo(450, 344);
          ctx.bezierCurveTo(432, 470, 452, 610, 438, 765);
          ctx.stroke();
        }

        if (key === "combinedFront" || key === "combinedQuarter" || key === "torsoClose") {
          ctx.strokeStyle = "rgba(221,169,92,0.82)";
          ctx.lineWidth = 16;
          ctx.beginPath();
          ctx.ellipse(450, 545, 92, 142, -0.08, 0, Math.PI * 2);
          ctx.moveTo(505, 665);
          ctx.bezierCurveTo(570, 760, 530, 850, 470, 920);
          ctx.stroke();
        }

        ctx.restore();

        ctx.fillStyle = "rgba(192,211,236,0.86)";
        ctx.font = "700 33px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, 450, 1220);
        ctx.fillStyle = "rgba(115,135,168,0.78)";
        ctx.font = "600 22px system-ui, sans-serif";
        ctx.fillText("Replace URL in TEXTURE_URLS", 450, 1260);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        texture.needsUpdate = true;
        return texture;
      }

      function loadTexture(key) {
        return new Promise((resolve) => {
          const loader = new THREE.TextureLoader();
          loader.load(
            TEXTURE_URLS[key],
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = 8;
              resolve(texture);
            },
            undefined,
            () => resolve(makePlaceholderTexture(key))
          );
        });
      }

      function makeCurvedPlane(width, height, segX, segY) {
        const geometry = new THREE.PlaneGeometry(width, height, segX, segY);
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 1) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const nx = x / (width / 2);
          const ny = y / (height / 2);
          const z = -0.12 * nx * nx + 0.035 * Math.sin((ny + 0.4) * Math.PI);
          pos.setZ(i, z);
        }
        geometry.computeVertexNormals();
        return geometry;
      }

      function setupThree() {
        if (!window.THREE) {
          document.getElementById("three-error").style.display = "grid";
          return null;
        }

        const sceneEl = document.getElementById("scene");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0, 6.2);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        sceneEl.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const geometry = makeCurvedPlane(2.52, 3.64, 26, 34);
        const meshByKey = {};

        const ambient = new THREE.AmbientLight(0xffffff, 1.1);
        const keyLight = new THREE.DirectionalLight(0x9dc7ff, 1.5);
        keyLight.position.set(2.5, 3.2, 4.5);
        scene.add(ambient, keyLight);

        const ready = Promise.all(Object.keys(TEXTURE_URLS).map((key) => loadTexture(key).then((texture) => {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.DoubleSide
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.z = Object.keys(meshByKey).length * 0.008;
          group.add(mesh);
          meshByKey[key] = mesh;
        })));

        function resize() {
          const rect = sceneEl.getBoundingClientRect();
          renderer.setSize(rect.width, rect.height, false);
          camera.aspect = rect.width / Math.max(1, rect.height);
          camera.updateProjectionMatrix();
        }

        window.addEventListener("resize", resize);
        resize();

        return { renderer, scene, camera, group, meshByKey, ready, resize };
      }

      const three = setupThree();

      function setOpacities(t) {
        if (!three) return;
        const meshes = three.meshByKey;
        const keys = Object.keys(meshes);
        keys.forEach((key) => {
          meshes[key].material.opacity = 0;
        });

        const cardio = range(t, 1.98, 2.48);
        const digestive = range(t, 3.02, 3.52);
        const quarter = range(t, 4.02, 4.85);
        const torso = range(t, 5.03, 5.95);
        const returnBase = range(t, 8.35, 9.65);

        const baseOpacity = 1 - cardio;
        const cardioOpacity = cardio * (1 - digestive);
        const combinedOpacity = digestive * (1 - quarter) * (1 - returnBase);
        const quarterOpacity = quarter * (1 - torso) * (1 - returnBase);
        const torsoOpacity = torso * (1 - returnBase);
        const baseReturnOpacity = returnBase;

        if (meshes.baseFront) meshes.baseFront.material.opacity = baseOpacity;
        if (meshes.cardioFront) meshes.cardioFront.material.opacity = cardioOpacity;
        if (meshes.combinedFront) meshes.combinedFront.material.opacity = combinedOpacity;
        if (meshes.combinedQuarter) meshes.combinedQuarter.material.opacity = quarterOpacity;
        if (meshes.torsoClose) meshes.torsoClose.material.opacity = torsoOpacity;
        if (meshes.baseReturn) meshes.baseReturn.material.opacity = baseReturnOpacity;
      }

      function animateThree(t) {
        if (!three) return;

        const turn = range(t, 3.55, 4.85);
        const torso = range(t, 4.95, 5.95);
        const returnHome = range(t, 8.05, 9.75);
        const idle = Math.sin(t * Math.PI * 2 / 3.6) * 0.035;

        const yTurn = lerp(-0.05, -0.44, turn);
        const yWithReturn = lerp(yTurn, -0.02, returnHome);
        const scale = lerp(1.0, 1.62, torso) * lerp(1, 0.64, returnHome);
        const posY = lerp(-0.16, -0.54, torso) * (1 - returnHome);
        const posX = lerp(0.07, -0.18, torso) * (1 - returnHome);

        three.group.rotation.y = yWithReturn + idle * (1 - torso * 0.6);
        three.group.rotation.x = lerp(0.02, -0.045, torso);
        three.group.position.set(posX, posY, 0);
        three.group.scale.setScalar(scale);
        three.camera.position.z = lerp(6.2, 5.42, torso) + returnHome * 0.48;

        setOpacities(t);
        three.renderer.render(three.scene, three.camera);

        const shadowScale = lerp(1, 0.72, torso) + turn * 0.08;
        shadow.style.setProperty("--shadow-scale", shadowScale.toFixed(3));
        shadow.style.setProperty("--shadow-opacity", (0.55 + torso * 0.18).toFixed(3));
      }

      function updateUi(t) {
        const cardio = stateProgress(t, 2.05, 2.48, 8.86, 9.22);
        const digestive = stateProgress(t, 3.08, 3.46, 8.18, 8.54);
        applySystemState(cardioRow, cardio);
        applySystemState(digestiveRow, digestive);
        applySystemState(articularRow, 0);

        const pt = cursorPoint(t);
        atlas.style.setProperty("--cursor-x", `${pt.x.toFixed(1)}px`);
        atlas.style.setProperty("--cursor-y", `${pt.y.toFixed(1)}px`);

        const pulse = Math.max(
          pulseAt(t, 2.18, 0.22),
          pulseAt(t, 3.18, 0.22),
          pulseAt(t, 8.39, 0.22),
          pulseAt(t, 9.17, 0.22)
        );
        ring.style.setProperty("--ring-opacity", (pulse * 0.75).toFixed(3));
        ring.style.setProperty("--ring-scale", (0.55 + pulse * 0.78).toFixed(3));
        cursor.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0) scale(${(1 - pulse * 0.08).toFixed(3)})`;

        const tooltipIn = range(t, 6.05, 6.45);
        const tooltipOut = 1 - range(t, 7.46, 7.90);
        const tooltipValue = tooltipIn * tooltipOut;
        tooltip.style.setProperty("--tooltip-opacity", tooltipValue.toFixed(3));
        tooltip.style.setProperty("--tooltip-scale", (0.96 + tooltipValue * 0.04).toFixed(3));

        const scan = range(t, 5.75, 6.30) * (1 - range(t, 7.65, 8.05));
        scanGlow.style.setProperty("--scan-opacity", (scan * 0.78).toFixed(3));
        scanGlow.style.setProperty("--scan-scale", (0.86 + scan * 0.22).toFixed(3));
      }

      let startTime = performance.now();
      function tick(now) {
        const t = ((now - startTime) % LOOP_MS) / 1000;
        updateUi(t);
        animateThree(t);
        requestAnimationFrame(tick);
      }

      window.addEventListener("resize", fitFrame);
      fitFrame();

      if (three) {
        three.ready.then(() => {
          startTime = performance.now();
          requestAnimationFrame(tick);
        });
      } else {
        requestAnimationFrame(tick);
      }
    })();
  
