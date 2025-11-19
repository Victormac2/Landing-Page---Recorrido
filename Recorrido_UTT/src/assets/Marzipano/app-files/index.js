/*
 * Adapted Marzipano integration for Ionic/Angular
 * Updated paths for /Marzipano/app-files
 */
'use strict';

(function () {

  /* ============================================================
     🔵 SISTEMA COMPLETO VR / WEBXR – Meta Quest, Pico, etc.
  ============================================================ */

  // --- Detección WebXR real ---
  async function isWebXRSupported() {
    if (!navigator.xr) return false;

    try {
      return await navigator.xr.isSessionSupported("immersive-vr");
    } catch (err) {
      console.warn("WebXR no soportado:", err);
      return false;
    }
  }

  // --- Detección para navegadores VR nativos ---
  function isStandaloneVRBrowser() {
    const ua = navigator.userAgent;

    return (
      /\bOculusBrowser\b/i.test(ua) ||   // Meta Quest
      /\bPicoBrowser\b/i.test(ua)   ||   // Pico OS
      /\bViveport\b/i.test(ua)      ||   // HTC
      /\bVR\b/i.test(ua)
    );
  }

  // --- Detección final de dispositivo VR ---
  async function isVRDevice() {
    const xr = await isWebXRSupported();
    return xr || isStandaloneVRBrowser();
  }

  window.isVRDevice = isVRDevice;

  // --- Activación de VR ---
  async function activateVRMode(viewer) {
    console.log("Intentando entrar a VR...");

    const pano = document.querySelector("#pano");

    // 1️⃣ Intentar WebXR real primero
    if (await isWebXRSupported()) {
      try {
        const session = await navigator.xr.requestSession("immersive-vr", {
          optionalFeatures: ["local-floor", "bounded-floor"]
        });

        console.log("🟣 Entrando a VR mediante WebXR…");

        const gl = viewer.stage().renderer().gl();
        await gl.makeXRCompatible();

        const xrLayer = new XRWebGLLayer(session, gl);
        session.updateRenderState({ baseLayer: xrLayer });

        // Render loop XR (simple, estable)
        const onXRFrame = (time, frame) => {
          session.requestAnimationFrame(onXRFrame);
          viewer.render(); // Marzipano sigue renderizando la vista
        };

        session.requestAnimationFrame(onXRFrame);
        return;
      } catch (err) {
        console.warn("Error al iniciar WebXR:", err);
      }
    }

    // 2️⃣ Fallback si estamos en un navegador VR pero sin WebXR
    if (isStandaloneVRBrowser()) {
      console.log("🟡 Fallback: Modo fullscreen VR");

      try {
        if (pano.requestFullscreen) await pano.requestFullscreen();
      } catch (_) {}

      if (screen.orientation?.lock) {
        try { await screen.orientation.lock("landscape"); } catch (_) {}
      }

      return;
    }

    console.warn("⚠️ Este dispositivo no soporta VR.");
  }

  // inicialmente expone un stub; será reemplazado cuando el viewer esté creado
  window.activateVRMode = function () {
    console.warn('activateVRMode aún no está listo (espera a inicializar Marzipano)');
  };

  // Mostrar botón VR si es compatible
  async function showVRButtonIfAvailable() {
    const vrBtn = document.querySelector("#enterVR");
    if (!vrBtn) return;

    if (await isVRDevice()) {
      vrBtn.style.display = "inline-block";
    } else {
      vrBtn.style.display = "none";
    }
  }

  showVRButtonIfAvailable();



  /* ============================================================
     🔵 INICIO DE MARZIPANO
  ============================================================ */

  function initMarzipano() {
    console.log('🚀 Iniciando Marzipano...');

    var Marzipano = window.Marzipano;
    var bowser = window.bowser;
    var screenfull = window.screenfull;
    var data = window.APP_DATA;

    if (!Marzipano || !data) {
      console.error('❌ Marzipano o APP_DATA no están disponibles.');
      return;
    }

    // Ajuste de rutas
    var assetPrefix =
      (window.MARZIPANO_ASSET_PATH && typeof window.MARZIPANO_ASSET_PATH === 'string')
        ? window.MARZIPANO_ASSET_PATH
        : '/Marzipano/app-files';

    var urlPrefix =
      (window.MARZIPANO_TILE_PATH && typeof window.MARZIPANO_TILE_PATH === 'string')
        ? window.MARZIPANO_TILE_PATH
        : '/Marzipano/app-files/tiles';

    if (assetPrefix.charAt(0) !== '/') assetPrefix = '/' + assetPrefix;
    if (urlPrefix.charAt(0) !== '/') urlPrefix = '/' + urlPrefix;

    // DOM
    var panoElement = document.querySelector('#pano');
    var sceneNameElement = document.querySelector('#titleBar .sceneName');
    var sceneListElement = document.querySelector('#sceneList');
    var sceneListToggleElement = document.querySelector('#sceneListToggle');
    var autorotateToggleElement = document.querySelector('#autorotateToggle');

    if (!panoElement || !sceneListElement) {
      console.warn('⚠️ Elementos de Marzipano no encontrados.');
      return;
    }

    // Detección móvil
    if (window.matchMedia) {
      var mql = matchMedia('(max-width: 500px), (max-height: 500px)');
      var setMode = function () {
        if (mql.matches) {
          document.body.classList.remove('desktop');
          document.body.classList.add('mobile');
        } else {
          document.body.classList.remove('mobile');
          document.body.classList.add('desktop');
        }
      };
      setMode();
      mql.addListener(setMode);
    } else {
      document.body.classList.add('desktop');
    }

    // Touch
    document.body.classList.add('no-touch');
    window.addEventListener('touchstart', function () {
      document.body.classList.remove('no-touch');
      document.body.classList.add('touch');
    });

    // Viewer
    var viewerOpts = {
      controls: {
        mouseViewMode: data.settings.mouseViewMode,
      },
    };

    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // Guardar referencia del viewer para llamadas externas (p.ej. desde Angular)
    try {
      window.__MARZIPANO_VIEWER = viewer;
      // Reemplazar la función global para que use el viewer interno si no se pasa uno
      window.activateVRMode = function (v) {
        try {
          var actualViewer = v || window.__MARZIPANO_VIEWER;
          return activateVRMode(actualViewer);
        } catch (e) {
          console.warn('activateVRMode wrapper error:', e);
        }
      };
    } catch (e) {
      console.warn('No se pudo exponer viewer globalmente:', e);
    }

    // Conectar botón VR
    const vrBtn = document.querySelector("#enterVR");
    if (vrBtn) {
      vrBtn.addEventListener("click", () => activateVRMode(viewer));
    }

    // Crear lista de escenas
    var sceneListUl = document.querySelector('#sceneList .scenes');
    if (sceneListUl) {
      sceneListUl.innerHTML = '';
      data.scenes.forEach(function (s) {
        var a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.classList.add('scene');
        a.setAttribute('data-id', s.id);
        var li = document.createElement('li');
        li.classList.add('text');
        li.textContent = s.name;
        a.appendChild(li);
        sceneListUl.appendChild(a);
      });
    }

    var ext = 'jpg';

    var scenes = data.scenes.map(function (sceneData) {
      var source = Marzipano.ImageUrlSource.fromString(
        urlPrefix + '/' + sceneData.id + '/{z}/{f}/{y}/{x}.' + ext,
        { cubeMapPreviewUrl: urlPrefix + '/' + sceneData.id + '/preview.' + ext }
      );

      var geometry = new Marzipano.CubeGeometry(sceneData.levels);
      var limiter = Marzipano.RectilinearView.limit.traditional(
        sceneData.faceSize,
        (100 * Math.PI) / 180,
        (120 * Math.PI) / 180
      );
      var view = new Marzipano.RectilinearView(sceneData.initialViewParameters, limiter);

      var scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true,
      });

      sceneData.linkHotspots.forEach(function (hotspot) {
        var element = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      sceneData.infoHotspots.forEach(function (hotspot) {
        var element = createInfoHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      return { data: sceneData, scene: scene, view: view };
    });

    // Autorotate
    var autorotate = Marzipano.autorotate({
      yawSpeed: 0.03,
      targetPitch: 0,
      targetFov: Math.PI / 2,
    });

    if (data.settings.autorotateEnabled) {
      autorotateToggleElement?.classList.add('enabled');
    }

    autorotateToggleElement?.addEventListener('click', toggleAutorotate);
    sceneListToggleElement?.addEventListener('click', toggleSceneList);

    if (!document.body.classList.contains('mobile')) showSceneList();

    // Escenas
    scenes.forEach(function (scene) {
      var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
      if (el) {
        el.addEventListener('click', function () {
          switchScene(scene);
          if (document.body.classList.contains('mobile')) hideSceneList();
        });
      }
    });

    function switchScene(scene) {
      stopAutorotate();
      scene.view.setParameters(scene.data.initialViewParameters);
      scene.scene.switchTo();
      startAutorotate();
      updateSceneName(scene);
      updateSceneList(scene);
    }

    function updateSceneName(scene) {
      if (sceneNameElement) sceneNameElement.innerHTML = scene.data.name;
    }

    function updateSceneList(scene) {
      document.querySelectorAll('#sceneList .scene').forEach(function (el) {
        el.classList.toggle('current', el.getAttribute('data-id') === scene.data.id);
      });
    }

    function showSceneList() {
      sceneListElement?.classList.add('enabled');
      sceneListToggleElement?.classList.add('enabled');
    }

    function hideSceneList() {
      sceneListElement?.classList.remove('enabled');
      sceneListToggleElement?.classList.remove('enabled');
    }

    function toggleSceneList() {
      sceneListElement?.classList.toggle('enabled');
      sceneListToggleElement?.classList.toggle('enabled');
    }

    function startAutorotate() {
      if (!autorotateToggleElement?.classList.contains('enabled')) return;
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
    }

    function stopAutorotate() {
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
    }

    function toggleAutorotate() {
      if (autorotateToggleElement?.classList.contains('enabled')) {
        autorotateToggleElement.classList.remove('enabled');
        stopAutorotate();
      } else {
        autorotateToggleElement.classList.add('enabled');
        startAutorotate();
      }
    }

    function createLinkHotspotElement(hotspot) {
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot', 'link-hotspot');
      var icon = document.createElement('img');
      icon.src = assetPrefix + '/img/link.png';
      icon.classList.add('link-hotspot-icon');
      wrapper.appendChild(icon);

      var tooltip = document.createElement('div');
      tooltip.classList.add('link-hotspot-tooltip');
      tooltip.innerText = hotspot.target || 'Ir a...';
      tooltip.setAttribute('data-target', hotspot.target);
      wrapper.appendChild(tooltip);

      wrapper.addEventListener('click', function () {
        switchScene(findSceneById(hotspot.target));
      });
      return wrapper;
    }

    function createInfoHotspotElement(hotspot) {
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot', 'info-hotspot');
      var header = document.createElement('div');
      header.classList.add('info-hotspot-header');
      var icon = document.createElement('img');
      icon.src = assetPrefix + '/img/info.png';
      icon.classList.add('info-hotspot-icon');
      header.appendChild(icon);
      wrapper.appendChild(header);
      return wrapper;
    }

    function findSceneById(id) {
      return scenes.find(s => s.data.id === id) || null;
    }

    var tooltips = document.querySelectorAll('.link-hotspot-tooltip[data-target]');
    tooltips.forEach(function (tooltip) {
      var targetId = tooltip.getAttribute('data-target');
      var targetScene = findSceneById(targetId);
      if (targetScene) tooltip.innerText = targetScene.data.name;
    });

    switchScene(scenes[0]);
  }

  window.initializeMarzipano = initMarzipano;

})();
