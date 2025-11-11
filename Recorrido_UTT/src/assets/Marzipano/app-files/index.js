/*
 * Adapted Marzipano integration for Ionic/Angular
 * Updated paths for /Marzipano/app-files
 */
'use strict';

(function () {

  // ✅ Definimos la función pero NO la ejecutamos todavía
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

    // 🟢 Ajuste de rutas base
    var assetPrefix =
      (window.MARZIPANO_ASSET_PATH && typeof window.MARZIPANO_ASSET_PATH === 'string')
        ? window.MARZIPANO_ASSET_PATH
        : '/Marzipano/app-files';

    var urlPrefix =
      (window.MARZIPANO_TILE_PATH && typeof window.MARZIPANO_TILE_PATH === 'string')
        ? window.MARZIPANO_TILE_PATH
        : '/Marzipano/app-files/tiles';

    // Elementos principales del DOM
    var panoElement = document.querySelector('#pano');
    var sceneNameElement = document.querySelector('#titleBar .sceneName');
    var sceneListElement = document.querySelector('#sceneList');
    var sceneListToggleElement = document.querySelector('#sceneListToggle');
    var autorotateToggleElement = document.querySelector('#autorotateToggle');

    if (!panoElement || !sceneListElement) {
      console.warn('⚠️ Elementos de Marzipano no encontrados — revisa el HTML.');
      return;
    }

    // Detección de modo móvil/escritorio
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

    // Detección de touch
    document.body.classList.add('no-touch');
    window.addEventListener('touchstart', function () {
      document.body.classList.remove('no-touch');
      document.body.classList.add('touch');
    });

    // Tooltip fallback para IE < 11
    if (bowser?.msie && parseFloat(bowser.version) < 11) {
      document.body.classList.add('tooltip-fallback');
    }

    // Viewer options
    var viewerOpts = {
      controls: {
        mouseViewMode: data.settings.mouseViewMode,
      },
    };

    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // 🟣 Crear lista de escenas dinámicamente
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

    // Crear escenas
    var scenes = data.scenes.map(function (sceneData) {
      var source = Marzipano.ImageUrlSource.fromString(
        urlPrefix + '/' + sceneData.id + '/{z}/{f}/{y}/{x}.jpg',
        { cubeMapPreviewUrl: urlPrefix + '/' + sceneData.id + '/preview.jpg' }
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

    // Autorotate setup
    var autorotate = Marzipano.autorotate({
      yawSpeed: 0.03,
      targetPitch: 0,
      targetFov: Math.PI / 2,
    });
    if (data.settings.autorotateEnabled) {
      autorotateToggleElement?.classList.add('enabled');
    }
    autorotateToggleElement?.addEventListener('click', toggleAutorotate);

    // Scene list toggle
    sceneListToggleElement?.addEventListener('click', toggleSceneList);
    if (!document.body.classList.contains('mobile')) {
      showSceneList();
    }

    // Cambiar escenas
    scenes.forEach(function (scene) {
      var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
      if (el) {
        el.addEventListener('click', function () {
          switchScene(scene);
          if (document.body.classList.contains('mobile')) hideSceneList();
        });
      }
    });

    // --- Funciones auxiliares ---
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
        autorotateToggleElement?.classList.add('enabled');
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
      
      // Crear el tooltip - se llenará después de que todas las escenas estén creadas
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

    // Actualizar todos los tooltips con los nombres correctos de las escenas
    var tooltips = document.querySelectorAll('.link-hotspot-tooltip[data-target]');
    tooltips.forEach(function(tooltip) {
      var targetId = tooltip.getAttribute('data-target');
      var targetScene = findSceneById(targetId);
      if (targetScene) {
        tooltip.innerText = targetScene.data.name;
      }
    });

    // Mostrar la primera escena
    switchScene(scenes[0]);
  }

  // ✅ Exportamos correctamente la función global para Ionic
  window.initializeMarzipano = initMarzipano;

})();
