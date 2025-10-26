/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../astro-viewer/lib-esm/AstroSphere.js":
/*!**********************************************!*\
  !*** ../astro-viewer/lib-esm/AstroSphere.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Config.js */ "../astro-viewer/lib-esm/Config.js");
/* harmony import */ var _Camera_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Camera.js */ "../astro-viewer/lib-esm/Camera.js");
/* harmony import */ var _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/RayPickingUtils.js */ "../astro-viewer/lib-esm/utils/RayPickingUtils.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _model_hips_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/hips/VisibleTilesManager.js */ "../astro-viewer/lib-esm/model/hips/VisibleTilesManager.js");
/* harmony import */ var _utils_MouseHelper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/MouseHelper.js */ "../astro-viewer/lib-esm/utils/MouseHelper.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/* harmony import */ var _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./model/grid/HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");
/* harmony import */ var _model_hips_HiPS_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./model/hips/HiPS.js */ "../astro-viewer/lib-esm/model/hips/HiPS.js");
/* harmony import */ var _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");
/* harmony import */ var _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/FoVUtils.js */ "../astro-viewer/lib-esm/utils/FoVUtils.js");
/* harmony import */ var _services_queryCatalogueByFoV_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./services/queryCatalogueByFoV.js */ "../astro-viewer/lib-esm/services/queryCatalogueByFoV.js");
/* harmony import */ var _services_queryFootprintSetByFov_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./services/queryFootprintSetByFov.js */ "../astro-viewer/lib-esm/services/queryFootprintSetByFov.js");
/* harmony import */ var _model_grid_EquatorialGrid_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./model/grid/EquatorialGrid.js */ "../astro-viewer/lib-esm/model/grid/EquatorialGrid.js");
// AstroSphere.ts














/**
 * AstroSphere — main WebGL scene controller (TS port)
 */
class AstroSphere {
    camera;
    centralPoinCoords;
    mousePointCoords;
    canvas;
    showHPXGrid = false;
    mouseHelper;
    mouseDown = false;
    lastMouseX = null;
    lastMouseY = null;
    inertiaX = 0.0;
    inertiaY = 0.0;
    zoomInertia = 0.0;
    activeHiPS = null;
    startup = true;
    // private insideSphere: boolean
    fov;
    activeCatalogues = [];
    activeFootprintSets = [];
    constructor(canvas, webgl) {
        // Keep global GL context (as in original JS)
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl = webgl;
        this.mouseHelper = new _utils_MouseHelper_js__WEBPACK_IMPORTED_MODULE_5__["default"]();
        this.canvas = canvas;
        // this.insideSphere = bootSetup.insideSphere
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere = _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.insideSphere;
        this.init(canvas);
        this.fov = _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].refreshFoV();
    }
    updateCentralPoint() {
        // const sphericalCoords = cartesianToSpherical(this.camera.getCameraPosition())
        const sphericalCoords = this.getPhiThetaDeg(this.canvas);
        const astroCoords = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.sphericalToAstroDeg)(sphericalCoords.phi, sphericalCoords.theta);
        const raHMS = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.raDegToHMS)(astroCoords.ra);
        const decDMS = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.decDegToDMS)(astroCoords.dec);
        this.centralPoinCoords = {
            astroDeg: astroCoords,
            sphericalDeg: sphericalCoords,
            raHMS: raHMS,
            decDMS: decDMS
        };
        return this.centralPoinCoords;
    }
    updateLastMousePoint() {
        const sphericalCoords = { phi: this.mouseHelper.phi, theta: this.mouseHelper.theta };
        const astroCoords = { ra: this.mouseHelper.ra, dec: this.mouseHelper.dec };
        const raHMS = this.mouseHelper.raHMS;
        const decDMS = this.mouseHelper.decDMS;
        this.mousePointCoords = {
            astroDeg: astroCoords,
            sphericalDeg: sphericalCoords,
            raHMS: raHMS,
            decDMS: decDMS
        };
        return this.mousePointCoords;
    }
    getCentralPointCoordinates() {
        return this.centralPoinCoords;
    }
    getLastMousePointCoordinates() {
        return this.mousePointCoords;
    }
    init(canvas) {
        this.initCamera();
        _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].init();
        _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_9__["default"].computePerspectiveMatrix(canvas, this.camera, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_fov_deg, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_near_plane, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.insideSphere);
        _model_hips_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_4__.visibleTilesManager.init(_Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.insideSphere);
        _model_grid_EquatorialGrid_js__WEBPACK_IMPORTED_MODULE_13__["default"].init(_model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].getMinFoV());
        this.updateCentralPoint();
        this.startup = true;
        this.addEventListeners(canvas);
    }
    initCamera() {
        if (_Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.insideSphere) {
            this.camera = new _Camera_js__WEBPACK_IMPORTED_MODULE_1__["default"]([0.0, 0.0, -0.005], true);
        }
        else {
            this.camera = new _Camera_js__WEBPACK_IMPORTED_MODULE_1__["default"]([0.0, 0.0, 4.0], false);
        }
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].camera = this.camera;
    }
    addEventListeners(canvas) {
        if (_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].debug) {
            console.log('[AstroSphere::addEventListeners]');
        }
        const handleMouseDown = (event) => {
            canvas.setPointerCapture(event.pointerId);
            this.mouseDown = true;
            // this.lastMouseX = event.pageX
            // this.lastMouseY = event.pageY
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
            // session.clearHoveredFootprints()
            event.preventDefault();
            return false;
        };
        const handleMouseUp = (event) => {
            canvas.releasePointerCapture(event.pointerId);
            this.mouseDown = false;
            document.body.style.cursor = 'auto';
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
        };
        const handleMouseMove = (event) => {
            const newX = event.clientX;
            const newY = event.clientY;
            if (!_model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"])
                return;
            if (this.mouseDown) {
                document.body.style.cursor = 'grab';
                const deltaX = ((newX - (this.lastMouseX ?? newX)) * Math.PI) / canvas.width;
                const deltaY = ((newY - (this.lastMouseY ?? newY)) * Math.PI) / canvas.height;
                this.inertiaX += 0.1 * deltaX;
                this.inertiaY += 0.1 * deltaY;
            }
            else {
                const mousePoint = _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_2__["default"].getIntersectionPointWithSingleModel(newX, newY);
                if (mousePoint && mousePoint.length > 0) {
                    this.mouseHelper.update(mousePoint);
                    this.updateLastMousePoint();
                }
            }
            this.updateCentralPoint();
            this.lastMouseX = newX;
            this.lastMouseY = newY;
            event.preventDefault();
        };
        const handleMouseWheel = (event) => {
            if (event.deltaY < 0) {
                this.zoomInertia -= 0.001;
            }
            else {
                this.zoomInertia += 0.001;
            }
            event.preventDefault();
        };
        canvas.onpointerdown = handleMouseDown;
        canvas.onpointerup = handleMouseUp;
        canvas.onpointermove = handleMouseMove;
        // canvas.onwheel = handleMouseWheel
        canvas.addEventListener('wheel', handleMouseWheel, { passive: false });
    }
    // REVIEW THIS METHOD AND MOVE IT
    getPhiThetaDeg(canvas) {
        const maxX = canvas.width;
        const maxY = canvas.height;
        const pickerPoint = _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_2__["default"].getIntersectionPointWithSingleModel(maxX / 2, maxY / 2);
        return (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.cartesianToSpherical)(pickerPoint);
    }
    activateHiPS(hipsDescriptor) {
        this.activeHiPS = new _model_hips_HiPS_js__WEBPACK_IMPORTED_MODULE_8__["default"](1, [0.0, 0.0, 0.0], 0, 0, hipsDescriptor);
    }
    // Catalogue section
    async showCatalogue(catalogue) {
        const fovPolyAstro = _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_10__["default"].getFoVPolygon(this.camera, this.canvas, _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"]);
        const polygonAdql = _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_10__["default"].getAstroFoVPolygon(fovPolyAstro); // -> "POLYGON('ICRS', ra1, dec1, ...)"
        const cat = await (0,_services_queryCatalogueByFoV_js__WEBPACK_IMPORTED_MODULE_11__["default"])(catalogue, polygonAdql);
        console.log(cat);
        if (cat)
            this.activeCatalogues.push(cat);
        return cat;
    }
    deleteCatalogue(catalogue) {
        this.activeCatalogues = this.activeCatalogues.filter(c => c !== catalogue);
    }
    // End Catalogue section
    // Footprint section
    async showFootprintSet(footprintSet) {
        const fovPolyAstro = _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_10__["default"].getFoVPolygon(this.camera, this.canvas, _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"]);
        const polygonAdql = _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_10__["default"].getAstroFoVPolygon(fovPolyAstro); // -> "POLYGON('ICRS', ra1, dec1, ...)"
        const centralPoint = _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_10__["default"].getCenterJ2000(this.canvas);
        const fset = await (0,_services_queryFootprintSetByFov_js__WEBPACK_IMPORTED_MODULE_12__["default"])(footprintSet, polygonAdql, centralPoint);
        console.log(fset);
        if (fset)
            this.activeFootprintSets.push(fset);
        return fset;
    }
    deleteFootprintSet(footprintSet) {
        this.activeFootprintSets = this.activeFootprintSets.filter(fst => fst !== footprintSet);
    }
    getHoveredFootprints() {
        let footprintsHovered = [];
        this.activeFootprintSets.forEach(fset => {
            footprintsHovered.push(fset.hoveredFootprints);
        });
        return footprintsHovered;
    }
    // End Footprint section
    goTo(raDeg, decDeg) {
        this.camera.goTo(raDeg, decDeg);
    }
    getFoV() {
        return this.fov;
    }
    getFoVPolygon() {
        return _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_10__["default"].getFoVPolygon(this.camera, this.canvas, _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"]);
    }
    changeFoV(deg) {
        // throw new Error("not Implemented")
        const distance = _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].getFoV().computeDistanceFromAngle(deg);
        // this.camera.moveAlongView(distance)
        this.camera.translate(distance);
        _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].refreshFoV();
    }
    changeFoV2(deg) {
        // throw new Error("not Implemented")
        const newCameraPos = _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].getFoV().computeCameraPositionForFoV(deg);
        this.camera.setCameraPosition(newCameraPos);
        // this.camera.moveAlongView(distance)
        // this.camera.translate(distance)
    }
    changeFoV3(deg) {
        const newPos = _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].getFoV().computeCameraPositionForAngularDiameter(deg);
        this.camera.setCameraPosition(newPos);
        // Recompute projection after moving the camera
        _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_9__["default"].computePerspectiveMatrix(this.canvas, this.camera, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_fov_deg, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_near_plane, false);
    }
    getInsideSphere() {
        return _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere;
    }
    toggleInsideSphere() {
        // this.insideSphere = !this.insideSphere
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere = !_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere;
        console.log(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere);
        this.camera.toggleInsideSphere();
        // visibleTilesManager.toggleInsideSphere()
    }
    draw(canvas) {
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl)
            return;
        if (!this.activeHiPS)
            return;
        if (!_model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"] || Object.keys(_model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"]).length === 0)
            return;
        if (_model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].fovObj === undefined)
            return;
        // In WebGL2, OES_element_index_uint is core, no need to fetch the extension each frame.
        // global.gl.getExtension('OES_element_index_uint')
        // global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT)
        _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_9__["default"].computePerspectiveMatrix(canvas, this.camera, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_fov_deg, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_near_plane, _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere);
        let cameraRotated = false;
        let THETA = 0;
        let PHI = 0;
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.viewport(0, 0, _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.drawingBufferWidth, _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.drawingBufferHeight);
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.clear(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.COLOR_BUFFER_BIT | _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.DEPTH_BUFFER_BIT);
        // Zoom inertia
        if (_model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].fovObj.minFoV > 0.1 || this.zoomInertia > 0) {
            if (Math.abs(this.zoomInertia) > 0.0001) {
                this.camera.zoom(this.zoomInertia);
                this.zoomInertia *= 0.95;
                this.fov = _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].refreshFoV();
            }
        }
        // Rotation inertia
        if (this.mouseDown || Math.abs(this.inertiaX) > 0.02 || Math.abs(this.inertiaY) > 0.02) {
            cameraRotated = true;
            THETA = this.inertiaY;
            PHI = this.inertiaX;
            this.inertiaX *= 0.95;
            this.inertiaY *= 0.95;
            this.camera.rotate(PHI, THETA);
            _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_9__["default"].computePerspectiveMatrix(canvas, this.camera, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_fov_deg, _Config_js__WEBPACK_IMPORTED_MODULE_0__.bootSetup.camera_near_plane, _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere);
        }
        else {
            this.inertiaY = 0;
            this.inertiaX = 0;
        }
        // GL state
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.disable(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.DEPTH_TEST);
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.enable(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.BLEND);
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.enable(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.CULL_FACE);
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.cullFace(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere ? _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.BACK : _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.FRONT);
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.blendFunc(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.SRC_ALPHA, _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.ONE_MINUS_SRC_ALPHA);
        // DRAW HiPS
        this.activeHiPS.draw();
        _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_7__["default"].draw();
        _model_grid_EquatorialGrid_js__WEBPACK_IMPORTED_MODULE_13__["default"].draw();
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.enable(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.DEPTH_TEST);
        _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.disable(_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].gl.CULL_FACE);
        if (this.startup) {
            this.startup = false;
            const phiTheta = this.getPhiThetaDeg(canvas);
            const raDecDeg = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.sphericalToAstroDeg)(phiTheta.phi, phiTheta.theta);
            const raHMS = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.raDegToHMS)(raDecDeg.ra);
            const decDMS = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.decDegToDMS)(raDecDeg.dec);
            console.log('(startup coords)', {
                raDeg: raDecDeg.ra,
                decDeg: raDecDeg.dec,
                raHMS,
                decDMS,
            });
        }
        this.activeCatalogues.forEach(cat => {
            if (this.activeHiPS) {
                cat.draw(this.activeHiPS.getModelMatrix(), this.mouseHelper);
            }
        });
        this.activeFootprintSets.forEach(fst => {
            if (this.activeHiPS) {
                fst.draw(this.activeHiPS.getModelMatrix(), this.mouseHelper);
            }
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AstroSphere);
//# sourceMappingURL=AstroSphere.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/AstroViewer.js":
/*!**********************************************!*\
  !*** ../astro-viewer/lib-esm/AstroViewer.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AstroViewer: () => (/* binding */ AstroViewer)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _AstroSphere_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AstroSphere.js */ "../astro-viewer/lib-esm/AstroSphere.js");
/* harmony import */ var _model_hips_HiPSDescriptor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/hips/HiPSDescriptor.js */ "../astro-viewer/lib-esm/model/hips/HiPSDescriptor.js");
/* harmony import */ var _Config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Config.js */ "../astro-viewer/lib-esm/Config.js");
/* harmony import */ var _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/grid/HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");
/* harmony import */ var _model_grid_EquatorialGrid_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./model/grid/EquatorialGrid.js */ "../astro-viewer/lib-esm/model/grid/EquatorialGrid.js");






class AstroViewer {
    astroSphere;
    canvas;
    webgl;
    rafId = null;
    // API
    run() {
        return this.tick();
    }
    // CATALOGUES
    showCatalogue(catalogue) {
        this.astroSphere.showCatalogue(catalogue);
    }
    hideCatalogue(catalogue, isVisible) {
        catalogue.setIsVisible(isVisible);
    }
    deleteCatalogue(catalogue) {
        this.astroSphere.deleteCatalogue(catalogue);
    }
    changeCatalogueColor(catalogue, hexColor) {
        catalogue.catalogueProps.changeColor(hexColor);
    }
    setCatalogueShapeHue(catalogue, metadataColumnName) {
        catalogue.changeCatalogueMetaShapeHue(metadataColumnName);
    }
    setCatalogueShapeSize(catalogue, metadataColumnName) {
        catalogue.changeCatalogueMetaShapeSize(metadataColumnName);
    }
    //FOOTPRINT
    showFootprintSet(footprintSet) {
        this.astroSphere.showFootprintSet(footprintSet);
    }
    hideFootprintSet(footprintSet, isVisible) {
        footprintSet.setIsVisible(isVisible);
    }
    deleteFootprintSet(footprintSet) {
        this.astroSphere.deleteFootprintSet(footprintSet);
    }
    changeFootprintSetColor(footprintSet, hexColor) {
        footprintSet.footprintsetProps.changeColor(hexColor);
    }
    getHoveredFootprints() {
        return this.astroSphere.getHoveredFootprints();
    }
    // HIPS
    getDefaultHiPSURL() {
        return _Config_js__WEBPACK_IMPORTED_MODULE_3__.bootSetup.defaultHipsUrl;
    }
    activateHiPS(hipsDescriptor) {
        this.astroSphere.activateHiPS(hipsDescriptor);
    }
    async loadHiPS(baseUrl) {
        const hipsUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
        const resp = await fetch(hipsUrl + 'properties');
        if (!resp.ok)
            throw new Error(`HTTP ${resp.status} fetching properties`);
        const propsText = await resp.text();
        const desc = new _model_hips_HiPSDescriptor_js__WEBPACK_IMPORTED_MODULE_2__.HiPSDescriptor(propsText, hipsUrl);
        this.activateHiPS(desc);
    }
    // GOTOs and COORDS
    goTo(raDeg, decDeg) {
        this.astroSphere.goTo(raDeg, decDeg);
    }
    getCenterCoordinates() {
        return this.astroSphere.getCentralPointCoordinates();
    }
    getCoordinatesFromMouse() {
        return this.astroSphere.getLastMousePointCoordinates();
    }
    // GRIDs
    toggleHealpixGrid() {
        _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__["default"].toggleShowGrid();
    }
    isHealpixGridVisible() {
        return _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__["default"].isVisible();
    }
    toggleEquatorialGrid() {
        _model_grid_EquatorialGrid_js__WEBPACK_IMPORTED_MODULE_5__["default"].toggleShowGrid();
    }
    isEquatorialGridVisible() {
        return _model_grid_EquatorialGrid_js__WEBPACK_IMPORTED_MODULE_5__["default"].isVisible();
    }
    // FOV
    getFoV() {
        return this.astroSphere.getFoV();
    }
    getFoVPolygon() {
        return this.astroSphere.getFoVPolygon();
    }
    changeFoV(deg) {
        this, this.astroSphere.changeFoV(deg);
    }
    changeFoV2(deg) {
        this, this.astroSphere.changeFoV2(deg);
    }
    changeFoV3(deg) {
        this, this.astroSphere.changeFoV3(deg);
    }
    getInsideSphere() {
        return this.astroSphere.getInsideSphere();
    }
    toggleInsideSphere() {
        this.astroSphere.toggleInsideSphere();
    }
    // Internal
    constructor() {
        this.init();
    }
    init() {
        console.log('init webgl');
        const c = document.getElementById('astrocanvas');
        if (!(c instanceof HTMLCanvasElement)) {
            throw new Error("Element with id 'canvas-ab' is not a canvas.");
        }
        this.canvas = c;
        const gl = this.canvas.getContext('webgl2', { alpha: false });
        if (!gl) {
            alert('Could not initialise WebGL, sorry :-(');
            throw new Error('WebGL2 not available');
        }
        // Extend with custom fields used elsewhere
        this.webgl = gl;
        this.webgl.viewportWidth = this.canvas.width;
        this.webgl.viewportHeight = this.canvas.height;
        try {
            // 1/255 = 0.00392156862
            this.webgl.clearColor(0 * 0.00392156862, 16 * 0.00392156862, 50 * 0.00392156862, 0.7);
        }
        catch (e) {
            console.log('Error instantiating WebGL context');
        }
        this.initListeners();
        _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl = this.webgl;
        this.astroSphere = new _AstroSphere_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.canvas, this.webgl);
    }
    initListeners() {
        console.log('inside initListeners');
        const resizeCanvas = () => {
            console.log('[resizeCanvas]');
            const newWidth = window.innerWidth - 3;
            const newHeight = window.innerHeight - 3;
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.webgl.viewportWidth = this.canvas.width;
            this.webgl.viewportHeight = this.canvas.height;
            this.webgl.viewport(0, 0, this.canvas.width, this.canvas.height);
        };
        const handleContextLost = (event) => {
            console.log('[handleContextLost]');
            event.preventDefault();
            if (this.rafId !== null) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        };
        const handleContextRestored = (_event) => {
            console.log('[handleContextRestored]');
            this.webgl.viewportWidth = this.canvas.width;
            this.webgl.viewportHeight = this.canvas.height;
            this.webgl.clearColor(0 * 0.00392156862, 16 * 0.00392156862, 50 * 0.00392156862, 0.7);
            this.webgl.enable(this.webgl.DEPTH_TEST);
            this.rafId = requestAnimationFrame(() => this.tick());
        };
        window.addEventListener('resize', resizeCanvas);
        this.canvas.addEventListener('webglcontextlost', handleContextLost, false);
        this.canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
        resizeCanvas();
    }
    tick() {
        this.drawScene();
        this.rafId = requestAnimationFrame(() => this.tick());
        return this.rafId;
    }
    drawScene() {
        this.astroSphere.draw(this.canvas);
    }
}
//# sourceMappingURL=AstroViewer.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/Camera.js":
/*!*****************************************!*\
  !*** ../astro-viewer/lib-esm/Camera.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Global.js */ "../astro-viewer/lib-esm/Global.js");
/**
 * @author Fabrizio Giordano (Fab)
 */



class Camera {
    insideSphere = false;
    cam_pos = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create(); // camera position
    cam_speed = 1.0;
    vMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(); // view matrix
    T = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(); // translation matrix
    R = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(); // rotation matrix
    // Optional state used in rotate helpers
    FoV = 180.0;
    previousFoV = 180.0;
    move = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
    phi = 0; // accumulated yaw (radians)
    theta = 0; // accumulated pitch (radians)
    constructor(in_position, in_sphere) {
        this.init(in_position, in_sphere);
    }
    init(in_position, in_sphere) {
        this.insideSphere = in_sphere;
        this.cam_pos = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.clone(in_position);
        this.vMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        this.T = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        this.R = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(this.T, this.T, [this.cam_pos[0], this.cam_pos[1], this.cam_pos[2]]);
        // reset helpers
        this.FoV = this.previousFoV = 180.0;
        this.move = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.clone([0, 0, 0]);
        const raDeg = 0;
        const decDeg = 0;
        this.goTo(raDeg, decDeg);
    }
    goTo(raDeg, decDeg) {
        // eslint-disable-next-line no-console
        console.log(`global.insideSphere: ${_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere}`);
        // mirror RA
        const mirroredRA = 360 - raDeg;
        this.goToPhiTheta((0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__.astroDegToSpherical)(mirroredRA, decDeg));
    }
    goToPhiTheta(ptDeg) {
        const xyz = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__.sphericalToCartesian)(ptDeg.phi, ptDeg.theta, this.cam_pos[2]);
        let cameraMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        cameraMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(cameraMatrix, cameraMatrix, gl_matrix__WEBPACK_IMPORTED_MODULE_1__.fromValues(xyz[0], xyz[1], xyz[2]));
        const focusPoint = [0.0, 0.0, 0.0];
        const cameraUp = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.clone([0.0, 1.0, 0.0]);
        const cameraPos = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
        cameraMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.targetTo(cameraMatrix, cameraPos, focusPoint, cameraUp);
        this.R = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.clone(cameraMatrix);
        this.R[12] = 0;
        this.R[13] = 0;
        this.R[14] = 0;
        const viewMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        if (this.cam_pos[2] !== 0) {
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(viewMatrix, cameraMatrix);
        }
        this.vMatrix = viewMatrix;
    }
    toggleInsideSphere() {
        // if (inside !== global.insideSphere) {
        //   global.insideSphere = inside;
        if (_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere) {
            if (this.cam_pos[2] <= 2) {
                this.cam_pos[2] = -2 + this.cam_pos[2];
            }
            else {
                this.cam_pos[2] = -0.005;
            }
        }
        else {
            this.cam_pos[2] = 2.0 + this.cam_pos[2];
        }
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(this.T, gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(), this.cam_pos);
        this.refreshViewMatrix();
        // }
    }
    zoom(inertia) {
        this.move = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.clone([0, 0, 0]);
        this.move[2] += this.cam_speed * inertia;
        if (_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].insideSphere) {
            if (this.cam_pos[2] + this.move[2] >= -0.005 && inertia > 0) {
                this.cam_pos[2] = -0.005;
                inertia = 0;
            }
            else if (this.cam_pos[2] + this.move[2] <= -0.9885 && inertia < 0) {
                this.cam_pos[2] = -0.9885;
                inertia = 0;
            }
            else {
                this.cam_pos[2] += this.move[2];
            }
        }
        else {
            if (this.cam_pos[2] < 1.005) {
                this.move[2] *= this.cam_pos[2] / 100;
            }
            else if (this.cam_pos[2] < 1.05) {
                this.move[2] *= this.cam_pos[2] / 20;
            }
            else if (this.cam_pos[2] < 1.3) {
                this.move[2] *= this.cam_pos[2] / 3;
            }
            if (this.cam_pos[2] + this.move[2] <= 1.000001 && inertia < 0) {
                this.cam_pos[2] = 1.000001;
            }
            else {
                this.cam_pos[2] += this.move[2];
            }
            // NOTE: your original code adds move[2] twice; if that's unintended, remove this next line.
            // this.cam_pos[2] += this.move[2];
        }
        const identity = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(this.T, identity, this.cam_pos);
        this.refreshViewMatrix();
    }
    /**
     * Move the camera forward/backward along its current viewing direction.
     * Positive distance moves *forward* (toward where the camera is looking),
     * negative distance moves *backward*.
     *
     * This does not enforce inside/outside-sphere bounds; if you want clamping,
     * handle it before calling or we can extend this to mimic `zoom()` bounds.
     */
    moveAlongView(distance) {
        // World-space forward vector: transform camera-space -Z by inverse rotation
        const R_inverse = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(R_inverse, this.R);
        const forwardCam = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.fromValues(0, 0, -1); // camera looks along -Z in its local space
        const fwdWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__.transformMat4(fwdWorld, forwardCam, R_inverse);
        // Normalise to get direction only
        const len = Math.hypot(fwdWorld[0], fwdWorld[1], fwdWorld[2]);
        if (len > 0) {
            fwdWorld[0] /= len;
            fwdWorld[1] /= len;
            fwdWorld[2] /= len;
        }
        // Update camera position
        this.cam_pos[0] += fwdWorld[0] * distance;
        this.cam_pos[1] += fwdWorld[1] * distance;
        this.cam_pos[2] += fwdWorld[2] * distance;
        // Rebuild translation matrix and view matrix
        const identity = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(this.T, identity, this.cam_pos);
        this.refreshViewMatrix();
    }
    translate(distance) {
        // const pos = this.getCameraPosition();
        this.cam_pos[2] = distance + 1;
        // vec3.scale(pos, pos, distance);
        const identity = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(this.T, identity, this.cam_pos);
        this.refreshViewMatrix();
    }
    rotateZ(sign) {
        const factorRad = sign * 0.01;
        this.phi += factorRad;
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, factorRad, [0, 0, 1]);
        this.refreshViewMatrix();
    }
    rotateY(sign) {
        const factorRad = sign * 0.01;
        this.phi += factorRad;
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, factorRad, [0, 1, 0]);
        this.refreshViewMatrix();
    }
    rotateXRadian(radian) {
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, radian, [1, 0, 0]);
        this.refreshViewMatrix();
    }
    rotateYRadian(radian) {
        this.phi += radian;
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, radian, [0, 1, 0]);
        this.refreshViewMatrix();
    }
    rotateZRadian(radian) {
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, radian, [0, 0, 1]);
        this.refreshViewMatrix();
    }
    rotateX(sign) {
        const factorRad = sign * 0.01;
        this.theta += factorRad;
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, factorRad, [1, 0, 0]);
        this.refreshViewMatrix();
    }
    rotate(phi, theta) {
        const totRot = Math.sqrt(phi * phi + theta * theta);
        if (totRot === 0)
            return;
        const pos = this.getCameraPosition();
        const dist2Center = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);
        const usedRot = (totRot * (dist2Center - 1)) / 3.0;
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, -usedRot, [theta / totRot, phi / totRot, 0]);
        this.refreshViewMatrix();
    }
    refreshViewMatrix() {
        const T_inverse = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        const R_inverse = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(T_inverse, this.T);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(R_inverse, this.R);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(this.vMatrix, T_inverse, R_inverse);
    }
    refreshFoV(currentFoV) {
        this.previousFoV = this.FoV;
        this.FoV = currentFoV;
    }
    getCameraMatrix() {
        return this.vMatrix;
    }
    getCameraPosition() {
        const inv = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        if (!gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(inv, this.vMatrix)) {
            // fallback — we already maintain cam_pos
            return [this.cam_pos[0], this.cam_pos[1], this.cam_pos[2]];
        }
        return [inv[12], inv[13], inv[14]];
    }
    // setCameraPosition(position: Vec3Tuple) {
    //   const inv = mat4.create();
    //   if (mat4.invert(inv, this.vMatrix)) {
    //     [inv[12], inv[13], inv[14]] = [position[0], position[1], position[2]]
    //     mat4.invert(this.vMatrix, inv)
    //   }
    // }
    setCameraPosition(position) {
        // Update authoritative position
        this.cam_pos = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.fromValues(position[0], position[1], position[2]);
        // Rebuild translation matrix from cam_pos
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(this.T, gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(), this.cam_pos);
        // Do NOT touch this.R here (keep orientation)
        // Recompute view: vMatrix = inv(T) * inv(R)
        this.refreshViewMatrix();
    }
    getCameraAngle() {
        const [x, y, z] = this.getCameraPosition();
        const posVec = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.fromValues(x, y, z);
        const ptDeg = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__.cartesianToSpherical)(posVec);
        // eslint-disable-next-line no-console
        console.log("[Camera::getCameraAngle]", ptDeg);
        return ptDeg;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Camera);
//# sourceMappingURL=Camera.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/Config.js":
/*!*****************************************!*\
  !*** ../astro-viewer/lib-esm/Config.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bootSetup: () => (/* binding */ bootSetup),
/* harmony export */   hipsNodes: () => (/* binding */ hipsNodes),
/* harmony export */   tapRepos: () => (/* binding */ tapRepos)
/* harmony export */ });
const hipsNodes = [
    "https://skies.esac.esa.int/",
    "https://alasky.cds.unistra.fr/",
];
// If you want to re-enable multiple TAP repos, just uncomment and extend the array
// export const tapRepos: string[] = [
//   "https://archive.eso.org/tap_cat/",
//   "https://archive.eso.org/tap_obs/",
//   "https://sky.esa.int/esasky-tap/tap/",
//   "https://ws.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/argus",
// ];
const tapRepos = [
    "https://sky.esa.int/esasky-tap/tap/",
];
const bootSetup = {
    insideSphere: false,
    defaultHips: "",
    camera_fov_deg: 34,
    camera_fov_rad: 34 * Math.PI / 180.0,
    camera_near_plane: 0.00001,
    camera_far_plane: 2.5,
    corsProxyUrl: "http://localhost:4000/",
    useCORSProxy: false,
    maxDecimals: 15,
    // defaultHipsUrl: "//alasky.u-strasbg.fr/DSS/DSSColor/",
    defaultHipsUrl: "https://cdn.skies.esac.esa.int/DSSColor/",
    version: "Astrobrowser v1.0.0",
    debug: false,
    insideView: false,
};
//# sourceMappingURL=Config.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/Global.js":
/*!*****************************************!*\
  !*** ../astro-viewer/lib-esm/Global.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var healpixjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! healpixjs */ "../astro-viewer/node_modules/healpixjs/lib-esm/index.js");
/* harmony import */ var _Config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Config.js */ "../astro-viewer/lib-esm/Config.js");



class Global {
    // --- cached / runtime state ---
    _camera;
    _gl;
    _healpix;
    // --- config/state flags ---
    _selectionnside;
    // private _healpix4footprints: boolean;
    _useCORSProxy;
    _corsProxyUrl;
    _maxDecimals;
    _debug;
    _insideSphere;
    _version;
    constructor() {
        this._useCORSProxy = _Config_js__WEBPACK_IMPORTED_MODULE_1__.bootSetup.useCORSProxy;
        this._corsProxyUrl = _Config_js__WEBPACK_IMPORTED_MODULE_1__.bootSetup.corsProxyUrl;
        this._maxDecimals = _Config_js__WEBPACK_IMPORTED_MODULE_1__.bootSetup.maxDecimals;
        this._debug = _Config_js__WEBPACK_IMPORTED_MODULE_1__.bootSetup.debug;
        this._insideSphere = _Config_js__WEBPACK_IMPORTED_MODULE_1__.bootSetup.insideView;
        this._version = _Config_js__WEBPACK_IMPORTED_MODULE_1__.bootSetup.version;
        this._camera = null;
        this._gl = null;
        this._healpix = {};
        this._selectionnside = 32;
        // this._healpix4footprints = false;
    }
    init() {
        console.log('Global.init()');
    }
    // --- getters/setters ---
    get version() { return this._version; }
    set corsProxyUrl(url) { this._corsProxyUrl = url; }
    get corsProxyUrl() { return this._corsProxyUrl; }
    get useCORSProxy() { return this._useCORSProxy; }
    set useCORSProxy(enabled) { this._useCORSProxy = enabled; }
    get debug() { return this._debug; }
    getHealpix(order) {
        if (this._healpix[order] === undefined) {
            // order is HEALPix "order" ⇒ nside = 2^order
            this._healpix[order] = new healpixjs__WEBPACK_IMPORTED_MODULE_0__.Healpix(Math.pow(2, order));
        }
        return this._healpix[order];
    }
    get MAX_DECIMALS() { return this._maxDecimals; }
    get camera() { return this._camera; }
    set camera(in_camera) { this._camera = in_camera; }
    get gl() { return this._gl; }
    set gl(in_gl) { this._gl = in_gl; }
    set insideSphere(v) { this._insideSphere = v; }
    get insideSphere() { return this._insideSphere; }
    get nsideForSelection() { return this._selectionnside; }
}
const global = new Global();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (global);
//# sourceMappingURL=Global.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/AbstractSkyEntity.js":
/*!**********************************************************!*\
  !*** ../astro-viewer/lib-esm/model/AbstractSkyEntity.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/**
 * @author Fabrizio Giordano (Fab)
 */


class AbstractSkyEntity {
    // Public-ish properties used elsewhere in the app
    refreshMe = false;
    fovX_deg = 180;
    fovY_deg = 180;
    xRad;
    yRad;
    prevFoV = this.fovX_deg;
    name;
    // public insideSphere: boolean = bootSetup.insideSphere
    // Picking/sphere
    center;
    radius;
    isGalacticHips;
    // GL resources
    vertexTextureCoordBuffer = null;
    vertexPositionBuffer = null;
    vertexIndexBuffer = null;
    shaderProgram = null;
    // Matrices
    T = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
    R = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
    modelMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
    inverseModelMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
    // Precomputed transform from galactic to equatorial (already inverted)
    galacticMatrixInverted = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
    constructor(in_radius, in_position, in_xRad, in_yRad, in_name, isGalacticHips) {
        this.xRad = in_xRad;
        this.yRad = in_yRad;
        this.name = in_name;
        this.center = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.clone(in_position);
        this.radius = in_radius;
        // this.insideSphere = global.insideSphere
        this.isGalacticHips = !!isGalacticHips;
        // Fill the matrix via Float32Array.set (safer than mat4.set with 16 scalars)
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.set(this.galacticMatrixInverted, -0.054875582456588745, -0.8734370470046997, -0.48383501172065735, 0, 0.49410945177078247, -0.4448296129703522, 0.7469822764396667, 0, -0.8676661849021912, -0.19807636737823486, 0.4559837877750397, 0, 0, 0, 0, 1);
    }
    /** GL setup and initial model transform */
    initGL(gl) {
        // GL resources
        this.vertexTextureCoordBuffer = gl.createBuffer();
        this.vertexPositionBuffer = gl.createBuffer();
        this.vertexIndexBuffer = gl.createBuffer();
        this.shaderProgram = gl.createProgram();
        // Reset object transforms
        this.T = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        this.R = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        this.modelMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        this.inverseModelMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        // Initial pose
        this.translate(this.center);
        this.rotate(this.xRad, this.yRad);
    }
    translate(translation) {
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.translate(this.T, this.T, translation);
        this.refreshModelMatrix();
    }
    rotate(rad1, rad2) {
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, rad2, [0, 0, 1]);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, rad1, [1, 0, 0]);
        this.refreshModelMatrix();
    }
    rotateFromZero(rad1, rad2) {
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.identity(this.R);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, rad1, [1, 0, 0]);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.rotate(this.R, this.R, rad2, [0, 0, 1]);
        this.refreshModelMatrix();
    }
    refreshModelMatrix() {
        const R_inverse = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(R_inverse, this.R);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(this.modelMatrix, this.T, R_inverse);
        // Flip Y if we're outside the sphere
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].insideSphere) {
            this.modelMatrix[1] = -this.modelMatrix[1];
            this.modelMatrix[5] = -this.modelMatrix[5];
            this.modelMatrix[9] = -this.modelMatrix[9];
            this.modelMatrix[13] = -this.modelMatrix[13];
        }
        // Apply galactic frame transform if needed
        if (this.isGalacticHips) {
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(this.modelMatrix, this.modelMatrix, this.galacticMatrixInverted);
        }
    }
    getModelMatrixInverse() {
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.identity(this.inverseModelMatrix);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(this.inverseModelMatrix, this.modelMatrix);
        return this.inverseModelMatrix;
    }
    getModelMatrix() {
        return this.modelMatrix;
    }
    /** Children with hierarchical geometry (e.g., HiPS) can override this. */
    setGeometryNeedsToBeRefreshed() {
        this.refreshGeometryOnFoVChanged = false;
    }
    // Helpers operating on raw mat4 buffers (kept from your JS)
    rotateX(m, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const mv1 = m[1], mv5 = m[5], mv9 = m[9];
        m[1] = m[1] * c - m[2] * s;
        m[5] = m[5] * c - m[6] * s;
        m[9] = m[9] * c - m[10] * s;
        m[2] = m[2] * c + mv1 * s;
        m[6] = m[6] * c + mv5 * s;
        m[10] = m[10] * c + mv9 * s;
        return m;
    }
    rotateY(m, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const mv0 = m[0], mv4 = m[4], mv8 = m[8];
        m[0] = c * m[0] + s * m[2];
        m[4] = c * m[4] + s * m[6];
        m[8] = c * m[8] + s * m[10];
        m[2] = c * m[2] - s * mv0;
        m[6] = c * m[6] - s * mv4;
        m[10] = c * m[10] - s * mv8;
        return m;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AbstractSkyEntity);
//# sourceMappingURL=AbstractSkyEntity.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/ColorMaps.js":
/*!**************************************************!*\
  !*** ../astro-viewer/lib-esm/model/ColorMaps.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorMaps: () => (/* binding */ ColorMaps),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const ColorMaps = {
    grayscale: {
        name: 'grayscale',
        r: [],
        g: [],
        b: [],
    },
    native: {
        name: 'native',
        r: [],
        g: [],
        b: [],
    },
    planck: {
        name: 'planck',
        r: [
            0.0, 0.769231, 1.53846, 2.30769, 3.07692, 3.84615, 4.61538, 5.38462, 6.15385, 6.92308, 7.69231,
            8.46154, 9.23077, 10.0, 11.5385, 13.0769, 14.6154, 16.1538, 17.6923, 19.2308, 20.7692, 22.3077,
            23.8462, 25.3846, 26.9231, 28.4615, 30.0, 33.8462, 37.6923, 41.5385, 45.3846, 49.2308, 53.0769,
            56.9231, 60.7692, 64.6154, 68.4615, 72.3077, 76.1538, 80.0, 88.5385, 97.0769, 105.615, 114.154,
            122.692, 131.231, 139.769, 148.308, 156.846, 165.385, 173.923, 182.462, 191.0, 193.846, 196.692,
            199.538, 202.385, 205.231, 208.077, 210.923, 213.769, 216.615, 219.462, 222.308, 225.154, 228.0,
            229.182, 230.364, 231.545, 232.727, 233.909, 235.091, 236.273, 237.455, 238.636, 239.818, 241.0,
            241.0, 241.364, 241.727, 242.091, 242.455, 242.818, 243.182, 243.545, 243.909, 244.273, 244.636,
            245.0, 245.231, 245.462, 245.692, 245.923, 246.154, 246.385, 246.615, 246.846, 247.077, 247.308,
            247.538, 247.769, 248.0, 248.146, 248.292, 248.438, 248.585, 248.731, 248.877, 249.023, 249.169,
            249.315, 249.462, 249.608, 249.754, 249.9, 249.312, 248.723, 248.135, 247.546, 246.958, 246.369,
            245.781, 245.192, 244.604, 244.015, 243.427, 242.838, 242.25, 239.308, 236.365, 233.423,
            230.481, 227.538, 224.596, 221.654, 218.712, 215.769, 212.827, 209.885, 206.942, 204.0, 201.0,
            198.0, 195.0, 192.0, 189.0, 186.0, 183.0, 180.0, 177.0, 174.0, 171.0, 168.0, 165.0, 161.077,
            157.154, 153.231, 149.308, 145.385, 141.462, 137.538, 133.615, 129.692, 125.769, 121.846,
            117.923, 114.0, 115.038, 116.077, 117.115, 118.154, 119.192, 120.231, 121.269, 122.308, 123.346,
            124.385, 125.423, 126.462, 127.5, 131.423, 135.346, 139.269, 143.192, 147.115, 151.038, 154.962,
            158.885, 162.808, 166.731, 170.654, 174.577, 178.5, 180.462, 182.423, 184.385, 186.346, 188.308,
            190.269, 192.231, 194.192, 196.154, 198.115, 200.077, 202.038, 204.0, 205.962, 207.923, 209.885,
            211.846, 213.808, 215.769, 217.731, 219.692, 221.654, 223.615, 225.577, 227.538, 229.5, 230.481,
            231.462, 232.442, 233.423, 234.404, 235.385, 236.365, 237.346, 238.327, 239.308, 240.288,
            241.269, 242.25, 242.642, 243.035, 243.427, 243.819, 244.212, 244.604, 244.996, 245.388,
            245.781, 246.173, 246.565, 246.958, 247.35, 247.814, 248.277, 248.741, 249.205, 249.668,
            250.132, 250.595, 251.059, 251.523, 251.986, 252.45
        ],
        g: [
            0.0, 1.53846, 3.07692, 4.61538, 6.15385, 7.69231, 9.23077, 10.7692, 12.3077, 13.8462, 15.3846,
            16.9231, 18.4615, 20.0, 32.6154, 45.2308, 57.8462, 70.4615, 83.0769, 95.6923, 108.308, 120.923,
            133.538, 146.154, 158.769, 171.385, 184.0, 187.923, 191.846, 195.769, 199.692, 203.615, 207.538,
            211.462, 215.385, 219.308, 223.231, 227.154, 231.077, 235.0, 235.308, 235.615, 235.923, 236.231,
            236.538, 236.846, 237.154, 237.462, 237.769, 238.077, 238.385, 238.692, 239.0, 239.077, 239.154,
            239.231, 239.308, 239.385, 239.462, 239.538, 239.615, 239.692, 239.769, 239.846, 239.923, 240.0,
            240.091, 240.182, 240.273, 240.364, 240.455, 240.545, 240.636, 240.727, 240.818, 240.909, 241.0,
            241.0, 240.909, 240.818, 240.727, 240.636, 240.545, 240.455, 240.364, 240.273, 240.182, 240.091,
            240.0, 239.615, 239.231, 238.846, 238.462, 238.077, 237.692, 237.308, 236.923, 236.538, 236.154,
            235.769, 235.385, 235.0, 232.615, 230.231, 227.846, 225.462, 223.077, 220.692, 218.308, 215.923,
            213.538, 211.154, 208.769, 206.385, 204.0, 200.077, 196.154, 192.231, 188.308, 184.385, 180.462,
            176.538, 172.615, 168.692, 164.769, 160.846, 156.923, 153.0, 147.115, 141.231, 135.346, 129.462,
            123.577, 117.692, 111.808, 105.923, 100.038, 94.1538, 88.2692, 82.3846, 76.5, 73.0769, 69.6538,
            66.2308, 62.8077, 59.3846, 55.9615, 52.5385, 49.1154, 45.6923, 42.2692, 38.8462, 35.4231, 32.0,
            29.5385, 27.0769, 24.6154, 22.1538, 19.6923, 17.2308, 14.7692, 12.3077, 9.84615, 7.38462,
            4.92308, 2.46154, 0.0, 9.80769, 19.6154, 29.4231, 39.2308, 49.0385, 58.8462, 68.6538, 78.4615,
            88.2692, 98.0769, 107.885, 117.692, 127.5, 131.423, 135.346, 139.269, 143.192, 147.115, 151.038,
            154.962, 158.885, 162.808, 166.731, 170.654, 174.577, 178.5, 180.462, 182.423, 184.385, 186.346,
            188.308, 190.269, 192.231, 194.192, 196.154, 198.115, 200.077, 202.038, 204.0, 205.962, 207.923,
            209.885, 211.846, 213.808, 215.769, 217.731, 219.692, 221.654, 223.615, 225.577, 227.538, 229.5,
            230.481, 231.462, 232.442, 233.423, 234.404, 235.385, 236.365, 237.346, 238.327, 239.308,
            240.288, 241.269, 242.25, 242.642, 243.035, 243.427, 243.819, 244.212, 244.604, 244.996,
            245.388, 245.781, 246.173, 246.565, 246.958, 247.35, 247.814, 248.277, 248.741, 249.205,
            249.668, 250.132, 250.595, 251.059, 251.523, 251.986, 252.45
        ],
        b: [
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 254.615, 254.231, 253.846, 253.462, 253.077, 252.692, 252.308, 251.923, 251.538, 251.154,
            250.769, 250.385, 250.0, 249.615, 249.231, 248.846, 248.462, 248.077, 247.692, 247.308, 246.923,
            246.538, 246.154, 245.769, 245.385, 245.0, 242.0, 239.0, 236.0, 233.0, 230.0, 227.0, 224.0,
            221.0, 218.0, 215.0, 212.0, 212.0, 208.636, 205.273, 201.909, 198.545, 195.182, 191.818,
            188.455, 185.091, 181.727, 178.364, 175.0, 171.538, 168.077, 164.615, 161.154, 157.692, 154.231,
            150.769, 147.308, 143.846, 140.385, 136.923, 133.462, 130.0, 122.942, 115.885, 108.827, 101.769,
            94.7115, 87.6539, 80.5962, 73.5385, 66.4808, 59.4231, 52.3654, 45.3077, 38.25, 36.2885, 34.3269,
            32.3654, 30.4038, 28.4423, 26.4808, 24.5192, 22.5577, 20.5962, 18.6346, 16.6731, 14.7115, 12.75,
            11.7692, 10.7885, 9.80769, 8.82692, 7.84615, 6.86539, 5.88461, 4.90385, 3.92308, 2.94231,
            1.96154, 0.980769, 0.0, 2.46154, 4.92308, 7.38462, 9.84616, 12.3077, 14.7692, 17.2308, 19.6923,
            22.1538, 24.6154, 27.0769, 29.5385, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0, 32.0,
            32.0, 32.0, 32.0, 32.0, 41.3077, 50.6154, 59.9231, 69.2308, 78.5385, 87.8462, 97.1539, 106.462,
            115.769, 125.077, 134.385, 143.692, 153.0, 156.923, 160.846, 164.769, 168.692, 172.615, 176.538,
            180.462, 184.385, 188.308, 192.231, 196.154, 200.077, 204.0, 205.962, 207.923, 209.885, 211.846,
            213.808, 215.769, 217.731, 219.692, 221.654, 223.615, 225.577, 227.538, 229.5, 230.481, 231.462,
            232.442, 233.423, 234.404, 235.385, 236.365, 237.346, 238.327, 239.308, 240.288, 241.269,
            242.25, 242.838, 243.427, 244.015, 244.604, 245.192, 245.781, 246.369, 246.958, 247.546,
            248.135, 248.723, 249.312, 249.9, 250.096, 250.292, 250.488, 250.685, 250.881, 251.077, 251.273,
            251.469, 251.665, 251.862, 252.058, 252.254, 252.45, 252.682, 252.914, 253.145, 253.377,
            253.609, 253.841, 254.073, 254.305, 254.536, 254.768, 255.0
        ],
    },
    cmb: {
        name: 'cmb',
        r: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 12, 18, 24, 30, 36, 42, 48,
            54, 60, 66, 72, 78, 85, 91, 97, 103, 109, 115, 121, 127, 133, 139, 145, 151, 157, 163, 170, 176,
            182, 188, 194, 200, 206, 212, 218, 224, 230, 236, 242, 248, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 251, 247, 244, 240, 236, 233, 229, 226, 222, 218, 215, 211, 208, 204, 200, 197,
            193, 190, 186, 182, 179, 175, 172, 168, 164, 161, 157, 154, 150, 146, 143, 139, 136, 132, 128,
            125, 121, 118, 114, 110, 107, 103, 100
        ],
        g: [
            0, 2, 5, 8, 10, 13, 16, 18, 21, 24, 26, 29, 32, 34, 37, 40, 42, 45, 48, 50, 53, 56, 58, 61, 64,
            66, 69, 72, 74, 77, 80, 82, 85, 88, 90, 93, 96, 98, 101, 104, 106, 109, 112, 114, 117, 119, 122,
            124, 127, 129, 132, 134, 137, 139, 142, 144, 147, 150, 152, 155, 157, 160, 162, 165, 167, 170,
            172, 175, 177, 180, 182, 185, 188, 190, 193, 195, 198, 200, 203, 205, 208, 210, 213, 215, 218,
            221, 221, 221, 222, 222, 222, 223, 223, 224, 224, 224, 225, 225, 225, 226, 226, 227, 227, 227,
            228, 228, 229, 229, 229, 230, 230, 230, 231, 231, 232, 232, 232, 233, 233, 233, 234, 234, 235,
            235, 235, 236, 236, 237, 235, 234, 233, 231, 230, 229, 227, 226, 225, 223, 222, 221, 219, 218,
            217, 215, 214, 213, 211, 210, 209, 207, 206, 205, 203, 202, 201, 199, 198, 197, 195, 194, 193,
            191, 190, 189, 187, 186, 185, 183, 182, 181, 180, 177, 175, 172, 170, 167, 165, 162, 160, 157,
            155, 152, 150, 147, 145, 142, 140, 137, 135, 132, 130, 127, 125, 122, 120, 117, 115, 112, 110,
            107, 105, 102, 100, 97, 95, 92, 90, 87, 85, 82, 80, 77, 75, 73, 71, 69, 68, 66, 64, 62, 61, 59,
            57, 55, 54, 52, 50, 48, 47, 45, 43, 41, 40, 38, 36, 34, 33, 31, 29, 27, 26, 24, 22, 20, 19, 17,
            15, 13, 12, 10, 8, 6, 5, 3, 1, 0
        ],
        b: [
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 254, 253, 252, 251, 250, 249, 248, 247, 246,
            245, 245, 244, 243, 242, 241, 240, 239, 238, 237, 236, 236, 235, 234, 233, 232, 231, 230, 229,
            228, 227, 226, 226, 225, 224, 223, 222, 221, 220, 219, 218, 217, 217, 211, 206, 201, 196, 191,
            186, 181, 176, 171, 166, 161, 156, 151, 146, 141, 136, 131, 126, 121, 116, 111, 105, 100, 95,
            90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
    },
    rainbow: {
        name: 'rainbow',
        r: [
            0, 4, 9, 13, 18, 22, 27, 31, 36, 40, 45, 50, 54, 58, 61, 64, 68, 69, 72, 74, 77, 79, 80, 82, 83,
            85, 84, 86, 87, 88, 86, 87, 87, 87, 85, 84, 84, 84, 83, 79, 78, 77, 76, 71, 70, 68, 66, 60, 58,
            55, 53, 46, 43, 40, 36, 33, 25, 21, 16, 12, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8, 12, 21, 25, 29, 33, 42, 46, 51, 55,
            63, 67, 72, 76, 80, 89, 93, 97, 101, 110, 114, 119, 123, 131, 135, 140, 144, 153, 157, 161, 165,
            169, 178, 182, 187, 191, 199, 203, 208, 212, 221, 225, 229, 233, 242, 246, 250, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255
        ],
        g: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
            16, 21, 25, 29, 38, 42, 46, 51, 55, 63, 67, 72, 76, 84, 89, 93, 97, 106, 110, 114, 119, 127,
            131, 135, 140, 144, 152, 157, 161, 165, 174, 178, 182, 187, 195, 199, 203, 208, 216, 220, 225,
            229, 233, 242, 246, 250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 250, 242, 238, 233, 229, 221, 216, 212, 208, 199, 195,
            191, 187, 178, 174, 170, 165, 161, 153, 148, 144, 140, 131, 127, 123, 119, 110, 106, 102, 97,
            89, 85, 80, 76, 72, 63, 59, 55, 51, 42, 38, 34, 29, 21, 17, 12, 8, 0
        ],
        b: [
            0, 3, 7, 10, 14, 19, 23, 28, 32, 38, 43, 48, 53, 59, 63, 68, 72, 77, 81, 86, 91, 95, 100, 104,
            109, 113, 118, 122, 127, 132, 136, 141, 145, 150, 154, 159, 163, 168, 173, 177, 182, 186, 191,
            195, 200, 204, 209, 214, 218, 223, 227, 232, 236, 241, 245, 250, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 246, 242, 238, 233, 225, 220, 216, 212,
            203, 199, 195, 191, 187, 178, 174, 170, 165, 157, 152, 148, 144, 135, 131, 127, 123, 114, 110,
            106, 102, 97, 89, 84, 80, 76, 67, 63, 59, 55, 46, 42, 38, 34, 25, 21, 16, 12, 8, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
    },
    eosb: {
        name: 'eosb',
        r: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 9, 18, 27, 36, 45, 49, 57, 72, 81, 91, 100, 109, 118, 127, 136, 131, 139, 163, 173, 182, 191,
            200, 209, 218, 227, 213, 221, 255, 255, 255, 255, 255, 255, 255, 255, 229, 229, 255, 255, 255,
            255, 255, 255, 255, 255, 229, 229, 255, 255, 255, 255, 255, 255, 255, 255, 229, 229, 255, 255,
            255, 255, 255, 255, 255, 255, 229, 229, 255, 255, 255, 255, 255, 255, 255, 255, 229, 229, 255,
            255, 255, 255, 255, 255, 255, 255, 229, 229, 255, 255, 255, 255, 255, 255, 255, 255, 229, 229,
            255, 255, 255, 255, 255, 255, 255, 255, 229, 229, 255, 255, 255, 255, 255, 255, 255, 255, 229,
            229, 255, 253, 251, 249, 247, 245, 243, 241, 215, 214, 235, 234, 232, 230, 228, 226, 224, 222,
            198, 196, 216, 215, 213, 211, 209, 207, 205, 203, 181, 179, 197, 196, 194, 192, 190, 188, 186,
            184, 164, 162, 178, 176, 175, 173, 171, 169, 167, 165, 147, 145, 159, 157, 156, 154, 152, 150,
            148, 146, 130, 128, 140, 138, 137, 135, 133, 131, 129, 127, 113, 111, 121, 119, 117, 117
        ],
        g: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 7, 15, 23, 31, 39, 47, 55, 57, 64, 79, 87, 95, 103, 111, 119, 127, 135, 129, 136, 159, 167,
            175, 183, 191, 199, 207, 215, 200, 207, 239, 247, 255, 255, 255, 255, 255, 255, 229, 229, 255,
            255, 255, 255, 255, 255, 255, 255, 229, 229, 255, 255, 255, 255, 255, 255, 255, 255, 229, 229,
            255, 250, 246, 242, 238, 233, 229, 225, 198, 195, 212, 208, 204, 199, 195, 191, 187, 182, 160,
            156, 169, 165, 161, 157, 153, 148, 144, 140, 122, 118, 127, 125, 123, 121, 119, 116, 114, 112,
            99, 97, 106, 104, 102, 99, 97, 95, 93, 91, 80, 78, 84, 82, 80, 78, 76, 74, 72, 70, 61, 59, 63,
            61, 59, 57, 55, 53, 50, 48, 42, 40, 42, 40, 38, 36, 33, 31, 29, 27, 22, 21, 21, 19, 16, 14, 12,
            13, 8, 6, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        b: [
            116, 121, 127, 131, 136, 140, 144, 148, 153, 157, 145, 149, 170, 174, 178, 182, 187, 191, 195,
            199, 183, 187, 212, 216, 221, 225, 229, 233, 238, 242, 221, 225, 255, 247, 239, 231, 223, 215,
            207, 199, 172, 164, 175, 167, 159, 151, 143, 135, 127, 119, 100, 93, 95, 87, 79, 71, 63, 55, 47,
            39, 28, 21, 15, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ],
    },
    cubehelix: {
        name: 'cubehelix',
        r: [
            0, 1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 20, 21, 22, 23, 23, 24, 24, 25, 25, 25,
            26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 25, 25, 25, 25, 24, 24, 24, 23, 23, 23, 23, 22, 22,
            22, 21, 21, 21, 21, 21, 21, 20, 20, 20, 21, 21, 21, 21, 21, 22, 22, 22, 23, 23, 24, 25, 26, 27,
            27, 28, 30, 31, 32, 33, 35, 36, 38, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 60, 62, 65, 67, 70,
            72, 75, 78, 81, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110, 113, 116, 120, 123, 126, 129, 132,
            135, 138, 141, 144, 147, 150, 153, 155, 158, 161, 164, 166, 169, 171, 174, 176, 178, 181, 183,
            185, 187, 189, 191, 193, 194, 196, 198, 199, 201, 202, 203, 204, 205, 206, 207, 208, 209, 209,
            210, 211, 211, 211, 212, 212, 212, 212, 212, 212, 212, 212, 211, 211, 211, 210, 210, 210, 209,
            208, 208, 207, 207, 206, 205, 205, 204, 203, 203, 202, 201, 201, 200, 199, 199, 198, 197, 197,
            196, 196, 195, 195, 194, 194, 194, 193, 193, 193, 193, 193, 193, 193, 193, 193, 193, 194, 194,
            195, 195, 196, 196, 197, 198, 199, 200, 200, 202, 203, 204, 205, 206, 208, 209, 210, 212, 213,
            215, 217, 218, 220, 222, 223, 225, 227, 229, 231, 232, 234, 236, 238, 240, 242, 244, 245, 247,
            249, 251, 253, 255
        ],
        g: [
            0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 9, 10, 11, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22,
            24, 25, 26, 28, 29, 31, 32, 34, 35, 37, 38, 40, 41, 43, 45, 46, 48, 50, 52, 53, 55, 57, 58, 60,
            62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81, 83, 84, 86, 88, 89, 91, 92, 94, 95, 97, 98, 99,
            101, 102, 103, 104, 106, 107, 108, 109, 110, 111, 112, 113, 114, 114, 115, 116, 116, 117, 118,
            118, 119, 119, 120, 120, 120, 121, 121, 121, 121, 122, 122, 122, 122, 122, 122, 122, 122, 122,
            122, 122, 122, 122, 122, 122, 121, 121, 121, 121, 121, 121, 121, 121, 121, 120, 120, 120, 120,
            120, 120, 120, 120, 120, 120, 121, 121, 121, 121, 121, 122, 122, 122, 123, 123, 124, 124, 125,
            125, 126, 127, 127, 128, 129, 130, 131, 131, 132, 133, 135, 136, 137, 138, 139, 140, 142, 143,
            144, 146, 147, 149, 150, 152, 154, 155, 157, 158, 160, 162, 164, 165, 167, 169, 171, 172, 174,
            176, 178, 180, 182, 183, 185, 187, 189, 191, 193, 194, 196, 198, 200, 202, 203, 205, 207, 208,
            210, 212, 213, 215, 216, 218, 219, 221, 222, 224, 225, 226, 228, 229, 230, 231, 232, 233, 235,
            236, 237, 238, 239, 240, 240, 241, 242, 243, 244, 244, 245, 246, 247, 247, 248, 248, 249, 250,
            250, 251, 251, 252, 252, 253, 253, 254, 255
        ],
        b: [
            0, 1, 3, 4, 6, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47,
            48, 50, 52, 54, 56, 57, 59, 60, 62, 63, 65, 66, 67, 69, 70, 71, 72, 73, 74, 74, 75, 76, 76, 77,
            77, 77, 78, 78, 78, 78, 78, 78, 78, 77, 77, 77, 76, 76, 75, 75, 74, 73, 73, 72, 71, 70, 69, 68,
            67, 66, 66, 65, 64, 63, 61, 60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 51, 50, 49, 49, 48, 48,
            47, 47, 47, 46, 46, 46, 46, 46, 47, 47, 47, 48, 48, 49, 50, 50, 51, 52, 53, 55, 56, 57, 59, 60,
            62, 64, 65, 67, 69, 71, 74, 76, 78, 81, 83, 86, 88, 91, 94, 96, 99, 102, 105, 108, 111, 114,
            117, 120, 124, 127, 130, 133, 136, 140, 143, 146, 149, 153, 156, 159, 162, 165, 169, 172, 175,
            178, 181, 184, 186, 189, 192, 195, 197, 200, 203, 205, 207, 210, 212, 214, 216, 218, 220, 222,
            224, 226, 227, 229, 230, 231, 233, 234, 235, 236, 237, 238, 239, 239, 240, 241, 241, 242, 242,
            242, 243, 243, 243, 243, 243, 243, 243, 243, 243, 243, 242, 242, 242, 242, 241, 241, 241, 241,
            240, 240, 240, 239, 239, 239, 239, 239, 238, 238, 238, 238, 238, 238, 238, 238, 239, 239, 239,
            240, 240, 240, 241, 242, 242, 243, 244, 245, 246, 247, 248, 249, 250, 252, 253, 255
        ]
    },
    hot: {
        name: 'hot',
        r: [
            0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0, 36.0, 40.0, 44.0, 48.0, 52.0, 56.0, 60.0,
            64.0, 68.0, 72.0, 76.0, 80.0, 84.0, 88.0, 92.0, 96.0, 100.0, 104.0, 108.0, 112.0, 116.0,
            120.0, 124.0, 128.0, 132.0, 136.0, 140.0, 144.0, 148.0, 152.0, 156.0, 160.0, 164.0, 168.0,
            172.0, 176.0, 180.0, 184.0, 188.0, 192.0, 196.0, 200.0, 204.0, 208.0, 212.0, 216.0, 220.0,
            224.0, 228.0, 232.0, 236.0, 240.0, 244.0, 248.0, 252.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0
        ],
        g: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.30769,
            4.61538, 6.92308, 9.23077, 11.5385, 13.8462, 16.1538, 18.4615, 20.7692, 23.0769, 25.3846, 27.6923,
            30.0, 32.3077, 34.6154, 36.9231, 39.2308, 41.5385, 43.8462, 46.1538, 48.4615, 50.7692, 53.0769,
            55.3846, 57.6923, 60.0, 62.3077, 64.6154, 66.9231, 69.2308, 71.5385, 73.8462, 76.1538, 78.4615,
            80.7692, 83.0769, 85.3846, 87.6923, 90.0, 92.3077, 94.6154, 96.9231, 99.2308, 101.538, 103.846, 106.154,
            108.462, 110.769, 113.077, 115.385, 117.692, 120.0, 122.308, 124.615, 126.923, 129.231, 131.538,
            133.846, 136.154, 138.462, 140.769, 143.077, 145.385, 147.692, 150.0, 152.308, 154.615, 156.923,
            159.231, 161.538, 163.846, 166.154, 168.462, 170.769, 173.077, 175.385, 177.692, 180.0, 182.308,
            184.615, 186.923, 189.231, 191.538, 193.846, 196.154, 198.462, 200.769, 203.077, 205.385,
            207.692, 210.0, 212.308, 214.615, 216.923, 219.231, 221.538, 223.846, 226.154, 228.462, 230.769,
            233.077, 235.385, 237.692, 240.0, 242.308, 244.615, 246.923, 249.231, 251.538, 253.846, 255.0,
            255.0, 255.0, 255.0, 255.0, 255.0, 255.0
        ],
        b: [
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.980769,
            1.96154, 2.94231, 3.92308, 4.90385, 5.88461, 6.86539, 7.84615, 8.82692, 9.80769, 10.7885, 11.7692, 12.75,
            13.7308, 14.7115, 15.6923, 16.6731, 17.6538, 18.6346, 19.6154, 20.5962, 21.5769, 22.5577, 23.5385,
            24.5192, 25.5, 26.4808, 27.4615, 28.4423, 29.4231, 30.4038, 31.3846, 32.3654, 33.3462, 34.3269,
            35.3077, 36.2885, 37.2692, 38.25, 39.2308, 40.2115, 41.1923, 42.1731, 43.1538, 44.1346, 45.1154, 46.0962,
            47.0769, 48.0577, 49.0385, 50.0192, 51.0, 51.9808, 52.9615, 53.9423, 54.9231, 55.9038, 56.8846,
            57.8654, 58.8462, 59.8269, 60.8077, 61.7885, 62.7692, 63.75, 64.7308, 65.7115, 66.6923, 67.6731,
            68.6538, 69.6346, 70.6154, 71.5962, 72.5769, 73.5577, 74.5385, 75.5192, 76.5, 77.4808, 78.4615, 79.4423,
            80.4231, 81.4038, 82.3846, 83.3654, 84.3462, 85.3269, 86.3077, 87.2885, 88.2692, 89.25, 90.2308,
            91.2115, 92.1923, 93.1731, 94.1538, 95.1346, 96.1154, 97.0962, 98.0769, 99.0577, 100.038,
            101.019, 102.0, 102.981, 103.962, 104.942, 105.923, 106.904, 107.885, 108.865, 109.846, 110.827,
            111.808, 112.788, 113.769, 114.75, 115.731, 116.711, 117.692, 118.673, 119.654, 120.634,
            121.615, 122.596, 123.577, 124.557, 125.538, 126.519, 127.5
        ]
    },
    gray: {
        name: 'gray',
        r: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
            47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
            67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
            89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
            108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
            139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152,
            153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164,
            165, 166, 167, 168, 169, 170, 171, 172,
            173, 174, 175, 176, 177,
            178, 179,
            180,
            181,
            182,
            183,
            184,
            185,
            186,
            187,
            188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200,
            201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212,
            213, 214, 215, 216, 217, 218, 219, 220,
            221, 222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230,
            231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242,
            243, 244, 245, 246, 247, 248, 249, 250,
            251,
            252,
            253,
            254,
            255
        ],
        g: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
            46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
            57,
            58,
            59,
            60,
            61,
            62,
            63,
            64,
            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
            83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
            95,
            96,
            97,
            98,
            99,
            100,
            101,
            102,
            103,
            104,
            105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
            115,
            116,
            117,
            118,
            119,
            120,
            121,
            122,
            123,
            124,
            125, 126, 127, 128, 129, 130, 131, 132, 133, 134,
            135,
            136,
            137,
            138,
            139,
            140,
            141,
            142,
            143,
            144,
            145, 146, 147, 148, 149, 150, 151, 152, 153, 154,
            155,
            156,
            157,
            158,
            159,
            160,
            161,
            162,
            163,
            164,
            165, 166, 167, 168, 169, 170, 171, 172, 173, 174,
            175,
            176,
            177,
            178,
            179,
            180,
            181,
            182,
            183,
            184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196,
            197, 198, 199, 200, 201, 202, 203, 204, 205, 206,
            207,
            208,
            209,
            210,
            211,
            212,
            213,
            214,
            215,
            216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227,
            228, 229, 230, 231, 232, 233, 234, 235, 236, 237,
            238,
            239,
            240,
            241,
            242,
            243,
            244,
            245,
            246,
            247, 248, 249, 250,
            251,
            252,
            253,
            254,
            255
        ],
        b: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
            59,
            60,
            61,
            62,
            63,
            64,
            65,
            66,
            67,
            68,
            69,
            70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
            89,
            90,
            91,
            92,
            93,
            94,
            95,
            96,
            97,
            98,
            99,
            100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
            117,
            118,
            119,
            120,
            121,
            122,
            123,
            124,
            125,
            126,
            127,
            128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144,
            145,
            146,
            147,
            148,
            149,
            150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            174,
            175,
            176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192,
            193,
            194,
            195,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
            221,
            222,
            223,
            224,
            225,
            226,
            227,
            228,
            229,
            230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
            241,
            242,
            243,
            244,
            245,
            246,
            247,
            248,
            249,
            250,
            251,
            252,
            253,
            254,
            255
        ]
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ColorMaps);
//# sourceMappingURL=ColorMaps.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/FoV.js":
/*!********************************************!*\
  !*** ../astro-viewer/lib-esm/model/FoV.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FoV: () => (/* binding */ FoV)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/RayPickingUtils.js */ "../astro-viewer/lib-esm/utils/RayPickingUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/* harmony import */ var _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");
/* harmony import */ var _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./grid/HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");

/**
 * FoV singleton (TypeScript)
 * - Uses computePerspectiveMatrixSingleton.pMatrix
 * - Guards acos domain (numeric safety)
 * - Uses vec3.transformMat4 instead of custom mat4*vec3
 * - Keeps original “insideSphere ? 360 - angle : angle” behavior
 */






class FoV {
    fovXDeg = 180;
    fovYDeg = 180;
    ratio = +0;
    _minFoV = 180;
    constructor() { }
    /** Recomputes FoV for current camera + projection */
    getFoV(insideSphere) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl;
        if (!gl || !gl.canvas) {
            // Handle the error or assign default values
            this.fovXDeg = 180;
            this.fovYDeg = 180;
            this._minFoV = this.minFoV;
            return this;
        }
        // horizontal FoV: ray through (centerY)
        // const x = this.computeAngle(0, gl.canvas.height / 2, insideSphere)
        const xFoVComputed = this.computeAngle(0, gl.canvas.height / 2, insideSphere);
        this.fovXDeg = xFoVComputed.angleDeg;
        // this.xDistance = xFoVComputed.distance
        // this.xAngleRatio = this.fovXDeg / this.xDistance
        // vertical FoV: ray through (centerX)
        // this.fovYDeg = this.computeAngle(gl.canvas.width / 2, 0, insideSphere)
        const yFoVComputed = this.computeAngle(gl.canvas.width / 2, 0, insideSphere);
        this.fovYDeg = yFoVComputed.angleDeg;
        // this.yDistance = yFoVComputed.distance
        // this.yAngleRatio = this.fovYDeg / this.yDistance
        this._minFoV = this.minFoV;
        this.ratio = this.computeRatio();
        return this;
    }
    computeRatio() {
        const camera = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera;
        if (!camera)
            throw Error("Camera not defined");
        const pos = camera.getCameraPosition();
        const distanceFromCenter = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);
        // const distanceFromSphere = distanceFromCenter - healpixGridSingleton.RADIUS
        const ratio = distanceFromCenter / this.fovYDeg;
        return ratio;
    }
    changeMinFov(deg) {
        console.log("inside changeMinFov");
        if (this.fovYDeg <= this.fovXDeg) {
            this.fovYDeg = deg;
        }
        else {
            this.fovXDeg = deg;
        }
        console.log("changeMinFov: ping");
        this.minFoV;
        // this.fovYDeg <= this.fovXDeg ? this.fovYDeg = deg : this.fovXDeg = deg
    }
    get minFoV() {
        this._minFoV = this.fovYDeg <= this.fovXDeg ? this.fovYDeg : this.fovXDeg;
        return this._minFoV;
    }
    computeDistanceFromAngle(angleDeg) {
        const desiredFoV = angleDeg;
        const distance = desiredFoV * this.ratio;
        // return Math.abs(distance)
        return distance;
    }
    /** FoV half-screen chord angle doubled (deg) along a given canvas axis */
    computeAngle(canvasX, canvasY, insideSphere) {
        const camera = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera;
        const pMatrix = _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_5__["default"].pMatrix;
        if (!pMatrix) {
            // Handle the error or assign a default value
            console.warn('FoV: projection matrix is null');
            return { angleDeg: 180, distance: 1 };
        }
        if (!camera) {
            // Handle the error or assign a default value
            console.warn('FoV: camera is null');
            return { angleDeg: 180, distance: 1 };
        }
        const rayWorld = _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].getRayFromMouse(canvasX, canvasY, pMatrix);
        const intersectionDistance = _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].raySphere(camera.getCameraPosition(), rayWorld);
        let angleDeg;
        if (intersectionDistance > 0) {
            // world-space intersection point on the sphere
            const hit = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__.scale(hit, rayWorld, intersectionDistance);
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__.add(hit, camera.getCameraPosition(), hit);
            const center = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].center;
            // vectors from sphere center
            const vHit = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__.subtract(vHit, hit, center);
            // reference vector: rotate world +Z into current camera orientation, then from center
            const refWorldZ = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.fromValues(center[0], center[1], center[2] + _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].radius);
            const vInv = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(vInv, camera.getCameraMatrix());
            const refCamZ = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__.transformMat4(refCamZ, refWorldZ, vInv);
            const vRef = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__.subtract(vRef, refCamZ, center);
            // angle between vHit and vRef, doubled
            const dot = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.dot(vHit, vRef);
            const n1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.length(vHit);
            const n2 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.length(vRef);
            // numeric safety for acos
            const c = Math.min(1, Math.max(-1, dot / (n1 * n2)));
            const angleRad = Math.acos(c);
            angleDeg = 2 * (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.radToDeg)(angleRad);
        }
        else {
            angleDeg = 180;
        }
        const finalAngle = insideSphere ? 360 - angleDeg : angleDeg;
        // return insideSphere ? 360 - angleDeg : angleDeg
        return { angleDeg: finalAngle, distance: intersectionDistance };
    }
    /**
   * Computes the camera position (x,y,z) along the current view direction that would
   * yield the requested minFoV (in degrees), assuming the camera is OUTSIDE the sphere.
   * This method does NOT mutate the camera; it only returns the suggested position.
   *
   * Geometry: for a sphere of radius R observed from distance d (from center),
   * the apparent angular diameter is 2*arcsin(R/d). Our minFoV is that angular diameter
   * along the tighter axis; we solve for d and place the camera on the current
   * center→camera direction with that distance.
   *
   * @param targetMinFoVDeg Desired min FoV in degrees, 0 < targetMinFoVDeg < 180
   * @returns Tuple [x, y, z] for the recommended camera position in world coordinates.
   */
    computeCameraPositionForMinFoV(targetMinFoVDeg) {
        const camera = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera;
        const center = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].center;
        const R = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].radius;
        if (!camera) {
            console.warn('FoV.computeCameraPositionForMinFoV: camera not available; returning a sensible default.');
            return [center[0], center[1], center[2] + 2 * R];
        }
        // Clamp and validate input
        const eps = 1e-6;
        const clamped = Math.max(eps, Math.min(180 - eps, targetMinFoVDeg));
        const halfRad = (clamped * Math.PI / 180) * 0.5;
        // Distance from center needed to achieve the angular diameter
        // minFoV = 2 * arcsin(R / d)  =>  d = R / sin(minFoV/2)
        const sinHalf = Math.sin(halfRad);
        if (sinHalf <= 0) {
            console.warn('FoV.computeCameraPositionForMinFoV: invalid targetMinFoVDeg, using fallback.');
            return [center[0], center[1], center[2] + 2 * R];
        }
        let d = R / sinHalf;
        // Ensure we remain strictly outside the sphere
        d = Math.max(d, R + 1e-4);
        // Use the current center→camera direction to keep orientation
        const camPos = camera.getCameraPosition();
        let dirX = camPos[0] - center[0];
        let dirY = camPos[1] - center[1];
        let dirZ = camPos[2] - center[2];
        const len = Math.hypot(dirX, dirY, dirZ);
        if (len < eps) {
            // If somehow at the center, use +Z as a default direction
            dirX = 0;
            dirY = 0;
            dirZ = 1;
        }
        else {
            dirX /= len;
            dirY /= len;
            dirZ /= len;
        }
        const newX = center[0] + dirX * d;
        const newY = center[1] + dirY * d;
        const newZ = center[2] + dirZ * d;
        return [newX, newY, newZ];
    }
    /**
       * Computes the camera world-space position required to achieve a target FoV (deg),
       * keeping the same viewing direction. Acts as the inverse of computeAngle().
       *
       * @param targetFoVDeg desired full FoV angle in degrees (0 < FoV < 180)
       * @param canvasWidth  canvas width in pixels
       * @param canvasHeight canvas height in pixels
       * @returns [x, y, z] coordinates for the new camera position
       */
    computeCameraPositionForFoV(targetFoVDeg) {
        const camera = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera;
        const center = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].center;
        const R = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].radius;
        if (!camera) {
            console.warn("FoV.computeCameraPositionForFoV: camera missing.");
            return [center[0], center[1], center[2] + 2 * R];
        }
        const eps = 1e-6;
        const clamped = Math.max(eps, Math.min(180 - eps, targetFoVDeg));
        const halfRad = (clamped * Math.PI) / 360.0; // half-angle in radians
        // Distance from center that yields this FoV
        const sinHalf = Math.sin(halfRad);
        if (sinHalf <= 0) {
            console.warn("FoV.computeCameraPositionForFoV: invalid FoV.");
            return [center[0], center[1], center[2] + 2 * R];
        }
        let d = R / sinHalf;
        // Slightly outside sphere to avoid clipping
        d = Math.max(d, R + 1e-4);
        // Get current viewing direction
        const camPos = camera.getCameraPosition();
        let dirX = camPos[0] - center[0];
        let dirY = camPos[1] - center[1];
        let dirZ = camPos[2] - center[2];
        const len = Math.hypot(dirX, dirY, dirZ);
        if (len < eps) {
            dirX = 0;
            dirY = 0;
            dirZ = 1;
        }
        else {
            dirX /= len;
            dirY /= len;
            dirZ /= len;
        }
        const newX = center[0] + dirX * d;
        const newY = center[1] + dirY * d;
        const newZ = center[2] + dirZ * d;
        return [newX, newY, newZ];
    }
    /**
   * Return a camera position such that the sphere's apparent angular diameter
   * (the silhouette, not the surface coverage) equals targetAngularDiameterDeg.
   * Keeps current view direction; does not mutate the camera.
   *
   * @param targetAngularDiameterDeg desired apparent diameter in degrees (0<α<180)
   * @returns [x,y,z] world position
   */
    computeCameraPositionForAngularDiameter(targetAngularDiameterDeg) {
        const camera = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera;
        const center = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].center;
        const R = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].radius;
        if (!camera) {
            console.warn('computeCameraPositionForAngularDiameter: camera missing.');
            return [center[0], center[1], center[2] + 2 * R];
        }
        const eps = 1e-6;
        const α = Math.max(eps, Math.min(180 - eps, targetAngularDiameterDeg));
        const half = (α * Math.PI) / 360.0;
        const sinHalf = Math.sin(half);
        // d = R / sin(α/2)
        let d = R / sinHalf;
        d = Math.max(d, R + 1e-4); // stay outside
        // project along current center→camera direction
        const [cx, cy, cz] = center;
        const [px, py, pz] = camera.getCameraPosition();
        let dx = px - cx, dy = py - cy, dz = pz - cz;
        const L = Math.hypot(dx, dy, dz);
        if (L < eps) {
            dx = 0;
            dy = 0;
            dz = 1;
        }
        else {
            dx /= L;
            dy /= L;
            dz /= L;
        }
        return [cx + dx * d, cy + dy * d, cz + dz * d];
    }
}
//# sourceMappingURL=FoV.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/Point.js":
/*!**********************************************!*\
  !*** ../astro-viewer/lib-esm/model/Point.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/* harmony import */ var _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/**
 * @author Fabrizio Giordano (Fab77)
 */





class Point {
    _x;
    _y;
    _z;
    _xyz;
    _raDeg;
    _decDeg;
    _raRad;
    _decRad;
    _raDecDeg;
    constructor(in_options, in_type) {
        this._xyz = [0, 0, 0];
        this._raDecDeg = [0, 0];
        // Prefer config value if present, fallback to 12
        const MAX_DECIMALS = _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_DECIMALS ?? _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].maxDecimals ?? 12;
        if (in_type === _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN) {
            const { x, y, z } = in_options;
            this._x = Number(x.toFixed(MAX_DECIMALS));
            this._y = Number(y.toFixed(MAX_DECIMALS));
            this._z = Number(z.toFixed(MAX_DECIMALS));
            this._xyz = [this._x, this._y, this._z];
            const [ra, dec] = this.computeAstroCoords();
            this._raDeg = Number(ra);
            this._decDeg = Number(dec);
            this._raRad = (this._raDeg * Math.PI) / 180;
            this._decRad = (this._decDeg * Math.PI) / 180;
            this._raDecDeg = [this._raDeg, this._decDeg];
        }
        else if (in_type === _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].ASTRO) {
            const { raDeg, decDeg } = in_options;
            this._raDeg = Number(raDeg);
            this._decDeg = Number(decDeg);
            this._raDecDeg = [this._raDeg, this._decDeg];
            this._raRad = (this._raDeg * Math.PI) / 180;
            this._decRad = (this._decDeg * Math.PI) / 180;
            const [x, y, z] = this.computeCartesianCoords();
            this._x = Number(x.toFixed(MAX_DECIMALS));
            this._y = Number(y.toFixed(MAX_DECIMALS));
            this._z = Number(z.toFixed(MAX_DECIMALS));
            this._xyz = [this._x, this._y, this._z];
        }
        else if (in_type === _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].SPHERICAL) {
            // Not implemented in original; keep behavior
            console.log(`${_utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].SPHERICAL} not implemented yet`);
            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._raDeg = 0;
            this._decDeg = 0;
            this._raRad = 0;
            this._decRad = 0;
        }
        else {
            console.error('CoordsType ' + String(in_type) + ' not recognised.');
            // Initialize to zeroed state to keep object consistent
            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._raDeg = 0;
            this._decDeg = 0;
            this._raRad = 0;
            this._decRad = 0;
        }
    }
    computeAstroCoords() {
        const phiThetaDeg = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__.cartesianToSpherical)(gl_matrix__WEBPACK_IMPORTED_MODULE_0__.fromValues(this._xyz[0], this._xyz[1], this._xyz[2]));
        const rad = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__.sphericalToAstroDeg)(phiThetaDeg.phi, phiThetaDeg.theta);
        return [rad.ra, rad.dec];
    }
    computeCartesianCoords() {
        const phiThetaDeg = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__.astroDegToSpherical)(this._raDeg, this._decDeg);
        const [x, y, z] = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__.sphericalToCartesian)(phiThetaDeg.phi, phiThetaDeg.theta, 1);
        return [x, y, z];
    }
    /**
     * @return {phi, theta} (degrees)
     */
    computeHealpixPhiTheta() {
        return (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__.astroDegToSpherical)(this._raDeg, this._decDeg);
    }
    /** Scale the vector by a given factor */
    scale(n) {
        return new Point({ x: this.x * n, y: this.y * n, z: this.z * n }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return new Point({
            x: this.y * v.z - v.y * this.z,
            y: this.z * v.x - v.z * this.x,
            z: this.x * v.y - v.x * this.y,
        }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN);
    }
    norm() {
        const d = 1 / this.length();
        return new Point({ x: this.x * d, y: this.y * d, z: this.z * d }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN);
    }
    length() {
        return Math.sqrt(this.lengthSquared());
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    subtract(v) {
        return new Point({ x: this.x - v.x, y: this.y - v.y, z: this.z - v.z }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN);
    }
    add(v) {
        return new Point({ x: this.x + v.x, y: this.y + v.y, z: this.z + v.z }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN);
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }
    get xyz() { return this._xyz; }
    get raDeg() { return this._raDeg; }
    get decDeg() { return this._decDeg; }
    get raDecDeg() { return this._raDecDeg; }
    toADQL() {
        return `${this._raDecDeg[0]},${this._raDecDeg[1]}`;
    }
    toString() {
        return `(raDeg, decDeg) => (${this._raDecDeg[0]},${this._raDecDeg[1]}) (x, y,z) => (${this._xyz[0]},${this._xyz[1]},${this._xyz[2]})`;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Point);
//# sourceMappingURL=Point.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/Point2D.js":
/*!************************************************!*\
  !*** ../astro-viewer/lib-esm/model/Point2D.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Point2D {
    _x;
    _y;
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Point2D);
//# sourceMappingURL=Point2D.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/Source.js":
/*!***********************************************!*\
  !*** ../astro-viewer/lib-esm/model/Source.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var healpixjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! healpixjs */ "../astro-viewer/node_modules/healpixjs/lib-esm/index.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");



class Source {
    _point;
    _name;
    _details;
    _h_pix;
    _shapesize;
    _brightnessFactor;
    /**
     * @param in_point Point.js (Cartesian/RA-Dec wrapper)
     * @param in_details Optional array of key/value metadata
     */
    constructor(in_point, in_details = []) {
        this._point = in_point;
        this._details = in_details;
        this._shapesize = 8.0;
        this._brightnessFactor = -99;
        this.computeHealpixPixel();
    }
    getDetailByindex(index) {
        if (index < 0 || index >= this._details.length) {
            return undefined;
        }
        return this._details[index];
    }
    get details() {
        return this._details;
    }
    computeHealpixPixel() {
        // Get Healpix instance from global
        const healpix = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(_Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].nsideForSelection);
        const vec3 = new healpixjs__WEBPACK_IMPORTED_MODULE_0__.Vec3(this._point.x, this._point.y, this._point.z);
        const ptg = new healpixjs__WEBPACK_IMPORTED_MODULE_0__.Pointing(vec3, false);
        this._h_pix = healpix.ang2pix(ptg, false);
    }
    get point() {
        return this._point;
    }
    get name() {
        return this._name;
    }
    get healpixPixel() {
        return this._h_pix;
    }
    get shapeSize() {
        return this._shapesize;
    }
    set shapeSize(size) {
        this._shapesize = size;
    }
    get brightnessFactor() {
        return this._brightnessFactor;
    }
    /**
     * @param factor Must be in [-1..1]
     */
    set brightnessFactor(factor) {
        this._brightnessFactor = factor;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Source);
//# sourceMappingURL=Source.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/catalogues/CatalogueGL.js":
/*!***************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/catalogues/CatalogueGL.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _CatalogueProps_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CatalogueProps.js */ "../astro-viewer/lib-esm/model/catalogues/CatalogueProps.js");
/* harmony import */ var _Source_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Source.js */ "../astro-viewer/lib-esm/model/Source.js");
/* harmony import */ var _Point_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Point.js */ "../astro-viewer/lib-esm/model/Point.js");
/* harmony import */ var _hips_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hips/VisibleTilesManager.js */ "../astro-viewer/lib-esm/model/hips/VisibleTilesManager.js");
/* harmony import */ var _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../..//utils/CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/* harmony import */ var _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");
/* harmony import */ var _shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../shader/CatalogueShaderProgram.js */ "../astro-viewer/lib-esm/shader/CatalogueShaderProgram.js");









// `Source` is assumed to expose at least these:
class CatalogueGL {
    static ELEM_SIZE;
    static BYTES_X_ELEM;
    static STANDARD_SHAPE_SIZE = 8.0;
    static STANDARD_SHAPE_HUE = 3.0;
    // Core state
    ready;
    catalogueProps;
    name;
    description;
    tapRepo;
    // Data
    sources;
    gl;
    // shaderProgram: WebGLProgram;
    // Buffers & arrays
    vertexCataloguePositionBuffer;
    vertexhoveredCataloguePositionBuffer;
    vertexCataloguePosition;
    // Index/selection bookkeeping
    hoveredIndexes;
    selectedIndexes;
    extHoveredIndexes;
    oldMouseCoords;
    _isVisible = true;
    // Healpix pixel => indices map
    healpixDensityMap;
    /**
     * @param tablename - String
     * @param tabledesc - String
     * @param tapRepo   - Object with `_tapBaseURL`
     * @param tapMetadataList - TapMetadataList (as used by CatalogueProps)
     */
    constructor(tablename, tabledesc, provider, tapMetadataList) {
        this.ready = false;
        this.TYPE = 'SOURCE_CATALOGUE';
        CatalogueGL.ELEM_SIZE = 6; // x,y,z, hoveredFlag, size, brightness
        CatalogueGL.BYTES_X_ELEM = new Float32Array().BYTES_PER_ELEMENT;
        this.name = tablename;
        this.description = tabledesc;
        this.tapRepo = provider;
        this.sources = [];
        // GL init
        this.gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this.vertexCataloguePositionBuffer = this.gl.createBuffer();
        this.vertexhoveredCataloguePositionBuffer = this.gl.createBuffer();
        this.vertexCataloguePosition = new Float32Array(0);
        this.hoveredIndexes = [];
        this.selectedIndexes = [];
        this.extHoveredIndexes = [];
        this.oldMouseCoords = null;
        this.healpixDensityMap = new Map();
        const defaultColor = '#8F00FF';
        this.catalogueProps = new _CatalogueProps_js__WEBPACK_IMPORTED_MODULE_1__["default"](tapMetadataList, defaultColor);
        // call catalogueShaderProgram to init shaders if they are not yet initialised 
        _shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.shaderProgram;
        this._isVisible = true;
    }
    setIsVisible(visibility) {
        this._isVisible = visibility;
    }
    get isVisible() {
        return this._isVisible;
    }
    minMax(columnindex) {
        if (!this.sources.length)
            return { min: 0, max: 0 };
        let min = this.sources[0].details[columnindex];
        if (isNaN(Number(min))) {
            // console.warn(`${this.catalogueProps.tapMetadataList.metadataList[columnindex].name} doesn't contain number only values`)
            console.warn(`${this.catalogueProps.tapMetadataList.metadataList[columnindex].name} doesn't contain only number values`);
            return { min: 0, max: 0 };
        }
        let max = min;
        for (const source of this.sources) {
            const v = source.details[columnindex];
            if (isNaN(Number(v))) {
                console.warn(`${this.catalogueProps.tapMetadataList.metadataList[columnindex].name} doesn't contain number only values`);
                return { min: 0, max: 0 };
            }
            if (v < min)
                min = v;
            if (v > max)
                max = v;
        }
        return {
            min: Number(min),
            max: Number(max)
        };
    }
    changeCatalogueMetaShapeSize(metacolumnName) {
        if (metacolumnName == _CatalogueProps_js__WEBPACK_IMPORTED_MODULE_1__["default"].STANDARD_SIZE) {
            this.catalogueProps.resetCatalogueMetaShapeSize();
            for (const source of this.sources) {
                const size = CatalogueGL.STANDARD_SHAPE_SIZE;
                source.shapeSize = size;
            }
            this.initBuffer();
            return;
        }
        const oldShapeSizeName = this.catalogueProps.shapeSizeColumn?.name;
        this.catalogueProps.changeCatalogueMetaShapeSize(metacolumnName);
        const idx = this.catalogueProps.shapeSizeColumn?.index ?? this.catalogueProps.shapeSizeColumn?.index;
        if (idx == null) {
            if (oldShapeSizeName)
                this.catalogueProps.changeCatalogueMetaShapeSize(oldShapeSizeName);
            return;
        }
        const minmax = this.minMax(idx);
        if (minmax.min == minmax.max) {
            console.warn(`${minmax} min and max are equals. No resizing will be applied.`);
            return;
        }
        for (const source of this.sources) {
            const raw = Number(source.getDetailByindex(idx));
            const min = Number(minmax.min);
            const max = Number(minmax.max);
            const norm = (raw - min) / Math.max(1e-12, (max - min));
            const size = norm * (20 - 8) + 8;
            source.shapeSize = size;
        }
        this.initBuffer();
    }
    changeCatalogueMetaShapeHue(metacolumnName) {
        if (metacolumnName == _CatalogueProps_js__WEBPACK_IMPORTED_MODULE_1__["default"].STANDARD_SIZE) {
            this.catalogueProps.resetCatalogueMetaShapeHue();
            for (const source of this.sources) {
                const hue = CatalogueGL.STANDARD_SHAPE_HUE;
                source.brightnessFactor = hue;
            }
            this.initBuffer();
            return;
        }
        const oldHueSizeName = this.catalogueProps.shapeHueColumn?.name;
        this.catalogueProps.changeCatalogueMetaShapeHue(metacolumnName);
        const idx = this.catalogueProps.shapeHueColumn?.index ?? this.catalogueProps.shapeHueColumn?.index;
        if (idx == null) {
            if (oldHueSizeName)
                this.catalogueProps.changeCatalogueMetaShapeHue(oldHueSizeName);
            return;
        }
        const minmax = this.minMax(idx);
        if (minmax.min == minmax.max) {
            console.warn(`${minmax} min and max are equals. No resizing will be applied.`);
            return;
        }
        for (const source of this.sources) {
            const raw = Number(source.getDetailByindex(idx));
            const min = Number(minmax.min);
            const max = Number(minmax.max);
            const norm = (raw - min) / Math.max(1e-12, (max - min));
            // map [0,1] -> [1,-1]
            source.brightnessFactor = -(norm * 2 - 1);
        }
        this.initBuffer();
    }
    addSource(source) {
        this.sources.push(source);
    }
    /**
     * @param in_data Rows of TAP results
     * @param columnsmeta TapMetadataList (unused here because `CatalogueProps` already holds indices)
     */
    addSources(in_data, columnsmeta) {
        this.ready = false;
        this.sources = [];
        const raDataIndex = this.catalogueProps.raColumn.index ?? this.catalogueProps.raColumn._index;
        const decDataIndex = this.catalogueProps.decColumn.index ?? this.catalogueProps.decColumn._index;
        for (let j = 0; j < in_data.length; j++) {
            const point = new _Point_js__WEBPACK_IMPORTED_MODULE_3__["default"]({
                raDeg: in_data[j][raDataIndex],
                decDeg: in_data[j][decDataIndex]
            }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_5__["default"].ASTRO);
            const source = new _Source_js__WEBPACK_IMPORTED_MODULE_2__["default"](point, in_data[j]);
            // Ensure optional fields exist
            source.shapeSize = source.shapeSize ?? CatalogueGL.STANDARD_SHAPE_SIZE;
            source.brightnessFactor = 3;
            this.addSource(source);
        }
        this.initBuffer();
        this.ready = true;
    }
    clearSources() {
        this.sources = [];
        this.hoveredIndexes = [];
        this.healpixDensityMap.clear();
        this.vertexCataloguePosition = new Float32Array(0);
    }
    extHighlightSource(source, highlighted) {
        const sIdx = this.sources.indexOf(source);
        if (sIdx < 0)
            return;
        if (highlighted) {
            if (!this.extHoveredIndexes.includes(sIdx)) {
                this.extHoveredIndexes.push(sIdx);
            }
        }
        else {
            const i = this.extHoveredIndexes.indexOf(sIdx);
            if (i >= 0)
                this.extHoveredIndexes.splice(i, 1);
        }
    }
    extAddSources2Selected(sources) {
        for (const s of sources) {
            const sIdx = this.sources.indexOf(s);
            if (sIdx >= 0 && !this.selectedIndexes.includes(sIdx)) {
                this.selectedIndexes.push(sIdx);
            }
        }
    }
    extRemoveSourceFromSelection(source) {
        const indexOfObject = this.sources.indexOf(source);
        if (indexOfObject < 0)
            return;
        const sidx = this.selectedIndexes.indexOf(indexOfObject);
        if (sidx >= 0)
            this.selectedIndexes.splice(sidx, 1);
        const eidx = this.extHoveredIndexes.indexOf(indexOfObject);
        if (eidx >= 0)
            this.extHoveredIndexes.splice(eidx, 1);
        // Clear hovered flag in buffer view (if present)
        if (this.vertexCataloguePosition.length >= (indexOfObject + 1) * CatalogueGL.ELEM_SIZE) {
            this.vertexCataloguePosition[indexOfObject * CatalogueGL.ELEM_SIZE + 3] = 0.0;
        }
    }
    initBuffer() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexCataloguePositionBuffer);
        const nSources = this.sources.length;
        this.vertexCataloguePosition = new Float32Array(nSources * CatalogueGL.ELEM_SIZE);
        let positionIndex = 0;
        for (let j = 0; j < nSources; j++) {
            const currSource = this.sources[j];
            const currPix = currSource.healpixPixel;
            // density map
            const bucket = this.healpixDensityMap.get(currPix);
            if (bucket) {
                if (!bucket.includes(j))
                    bucket.push(j);
            }
            else {
                this.healpixDensityMap.set(currPix, [j]);
            }
            // position
            this.vertexCataloguePosition[positionIndex + 0] = currSource.point.x;
            this.vertexCataloguePosition[positionIndex + 1] = currSource.point.y;
            this.vertexCataloguePosition[positionIndex + 2] = currSource.point.z;
            // hovered flag
            this.vertexCataloguePosition[positionIndex + 3] = 0.0;
            // size
            this.vertexCataloguePosition[positionIndex + 4] = currSource.shapeSize ?? CatalogueGL.STANDARD_SHAPE_SIZE;
            // brightness
            this.vertexCataloguePosition[positionIndex + 5] = currSource.brightnessFactor ?? 0.0;
            positionIndex += CatalogueGL.ELEM_SIZE;
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexCataloguePosition, this.gl.STATIC_DRAW);
    }
    getSelectionRadius() {
        const order = _hips_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_4__.visibleTilesManager.getVisibleOrder();
        switch (order) {
            case 0:
            case 1:
            case 2:
                return 0.005;
            case 3:
                return 0.001;
            case 4:
                return 0.0009;
            case 5:
                return 0.0005;
            case 6:
                return 0.0001;
            case 7:
                return 0.00009;
            case 8:
                return 0.00005;
            case 9:
                return 0.00001;
            default:
                return 0.000005;
        }
    }
    checkSelection(in_mouseHelper) {
        if (in_mouseHelper.x == null || in_mouseHelper.y == null || in_mouseHelper.z == null) {
            console.log('CatalogueGL.checkSelection: missing mouse coords');
            return [];
        }
        const hoveredIndexes = [];
        const sourcesHovered = [];
        const mousePix = in_mouseHelper.computeNpix();
        if (mousePix != null && this.healpixDensityMap.has(mousePix)) {
            const candidates = this.healpixDensityMap.get(mousePix);
            const selR = this.getSelectionRadius();
            for (let i = 0; i < candidates.length; i++) {
                const sourceIdx = candidates[i];
                const source = this.sources[sourceIdx];
                if (!source)
                    continue;
                const dx = source.point.x - in_mouseHelper.x;
                const dy = source.point.y - in_mouseHelper.y;
                const dz = source.point.z - in_mouseHelper.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist <= selR) {
                    hoveredIndexes.push(sourceIdx);
                    sourcesHovered.push(source);
                }
            }
        }
        // session.updateHoveredSources(this, sourcesHovered);
        return hoveredIndexes;
    }
    /**
     * @param in_mMatrix Model matrix the current catalogue is associated to (e.g. HiPS matrix)
     */
    draw(in_mMatrix, in_mouseHelper) {
        if (!this.isVisible)
            return;
        if (!this.ready)
            return;
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].camera)
            return;
        _shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.enableShaders(_utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_7__["default"].pMatrix, in_mMatrix, _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].camera.getCameraMatrix());
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexCataloguePositionBuffer);
        // positions
        this.gl.vertexAttribPointer(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.position, 3, this.gl.FLOAT, false, CatalogueGL.BYTES_X_ELEM * CatalogueGL.ELEM_SIZE, 0);
        this.gl.enableVertexAttribArray(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.position);
        // hovered flag
        this.gl.vertexAttribPointer(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.hovered, 1, this.gl.FLOAT, false, CatalogueGL.BYTES_X_ELEM * CatalogueGL.ELEM_SIZE, CatalogueGL.BYTES_X_ELEM * 3);
        this.gl.enableVertexAttribArray(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.hovered);
        // point size
        this.gl.vertexAttribPointer(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.pointSize, 1, this.gl.FLOAT, false, CatalogueGL.BYTES_X_ELEM * CatalogueGL.ELEM_SIZE, CatalogueGL.BYTES_X_ELEM * 4);
        this.gl.enableVertexAttribArray(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.pointSize);
        // brightness
        this.gl.vertexAttribPointer(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.brightness, 1, this.gl.FLOAT, false, CatalogueGL.BYTES_X_ELEM * CatalogueGL.ELEM_SIZE, CatalogueGL.BYTES_X_ELEM * 5);
        this.gl.enableVertexAttribArray(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.brightness);
        // color
        const rgb = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_6__.colorHex2RGB)(this.catalogueProps.shapeColor);
        if (_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.color) {
            this.gl.uniform4f(_shader_CatalogueShaderProgram_js__WEBPACK_IMPORTED_MODULE_8__.catalogueShaderProgram.locations.color, rgb[0], rgb[1], rgb[2], 1.0);
        }
        // Hover logic on mouse move
        if (in_mouseHelper != null && in_mouseHelper.xyz !== this.oldMouseCoords) {
            // clear old hovered
            for (let k = 0; k < this.hoveredIndexes.length; k++) {
                const base = this.hoveredIndexes[k] * CatalogueGL.ELEM_SIZE;
                this.vertexCataloguePosition[base + 3] = 0.0; // not hovered
                this.vertexCataloguePosition[base + 4] = this.sources[this.hoveredIndexes[k]].shapeSize; // size
            }
            this.hoveredIndexes = this.checkSelection(in_mouseHelper);
            // new hovered
            for (let i = 0; i < this.hoveredIndexes.length; i++) {
                const idx = this.hoveredIndexes[i];
                const base = idx * CatalogueGL.ELEM_SIZE;
                this.vertexCataloguePosition[base + 3] = 1.0; // hovered
                this.vertexCataloguePosition[base + 4] = this.sources[idx].shapeSize; // size
            }
        }
        // selected flags
        for (let s = 0; s < this.selectedIndexes.length; s++) {
            const idx = this.selectedIndexes[s];
            const base = idx * CatalogueGL.ELEM_SIZE;
            this.vertexCataloguePosition[base + 3] = 2.0; // selected
            this.vertexCataloguePosition[base + 4] = this.sources[idx].shapeSize; // size
        }
        // external hovered
        for (let e = 0; e < this.extHoveredIndexes.length; e++) {
            const idx = this.extHoveredIndexes[e];
            const base = idx * CatalogueGL.ELEM_SIZE;
            this.vertexCataloguePosition[base + 3] = 1.0; // hovered
            this.vertexCataloguePosition[base + 4] = this.sources[idx].shapeSize; // size
        }
        // upload buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexCataloguePosition, this.gl.STATIC_DRAW);
        // draw
        const numItems = this.vertexCataloguePosition.length / CatalogueGL.ELEM_SIZE;
        this.gl.drawArrays(this.gl.POINTS, 0, numItems);
        this.oldMouseCoords = in_mouseHelper.xyz;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CatalogueGL);
//# sourceMappingURL=CatalogueGL.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/catalogues/CatalogueProps.js":
/*!******************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/catalogues/CatalogueProps.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CatalogueProps)
/* harmony export */ });
function colName(col) {
    return col?.name ?? col?.name;
}
function sameName(a, name) {
    if (!a || !name)
        return false;
    return colName(a) === name;
}
class CatalogueProps {
    static STANDARD_SIZE = "STANDARD_SIZE";
    raColumn;
    decColumn;
    nameColumn;
    /** Optional: numeric/size-mapped column */
    shapeSizeColumn;
    /** Optional: hue/category-mapped column */
    shapeHueColumn;
    /** Base color (hex string like #RRGGBB) */
    shapeColor;
    /** Full metadata list reference (kept in sync by updateColumnsIndex) */
    tapMetadataList;
    constructor(tapMetadataList, color) {
        this.raColumn = this.setRAColumns(tapMetadataList);
        this.decColumn = this.setDecColumns(tapMetadataList);
        this.nameColumn = this.setNameColumn(tapMetadataList);
        this.shapeSizeColumn = undefined;
        this.shapeHueColumn = undefined;
        this.shapeColor = color;
        this.tapMetadataList = tapMetadataList;
    }
    /** Rebinds saved column references to the new metadata objects (preserves indices, etc.). */
    updateColumnsIndex(metadataList) {
        for (const col of metadataList) {
            if (sameName(this.raColumn, colName(col)))
                this.raColumn = col;
            else if (sameName(this.decColumn, colName(col)))
                this.decColumn = col;
            else if (this.shapeHueColumn && sameName(this.shapeHueColumn, colName(col)))
                this.shapeHueColumn = col;
            else if (this.shapeSizeColumn && sameName(this.shapeSizeColumn, colName(col)))
                this.shapeSizeColumn = col;
            else if (this.nameColumn && sameName(this.nameColumn, colName(col)))
                this.nameColumn = col;
        }
        // Keep the container reference up to date if needed elsewhere.
        this.tapMetadataList.metadataList = metadataList;
    }
    setRAColumns(tapMetadataList) {
        let column;
        for (const tapMetadata of tapMetadataList.posEqRAMetaColumns) {
            const u = tapMetadata.ucd;
            if (u && u.includes('pos.eq.ra')) {
                if (u.includes('meta.main')) {
                    column = tapMetadata; // prefer the main one
                    break;
                }
                if (!column)
                    column = tapMetadata; // fallback to first valid one
            }
        }
        if (!column) {
            throw new Error('No RA column found (UCD pos.eq.ra) in _posEqRAMetaColumns');
        }
        return column;
    }
    setDecColumns(tapMetadataList) {
        let column;
        for (const tapMetadata of tapMetadataList.posEqDecMetaColumns) {
            const u = tapMetadata.ucd;
            if (u && u.includes('pos.eq.dec')) {
                if (u.includes('meta.main')) {
                    column = tapMetadata; // prefer the main one
                    break;
                }
                if (!column)
                    column = tapMetadata; // fallback to first valid one
            }
        }
        if (!column) {
            throw new Error('No Dec column found (UCD pos.eq.dec) in _posEqDecMetaColumns');
        }
        return column;
    }
    setNameColumn(tapMetadataList) {
        let column;
        for (const tapMetadata of tapMetadataList.metadataList) {
            const u = tapMetadata.ucd;
            if (u && u.includes('meta.id') && u.includes('meta.main')) {
                column = tapMetadata; // prefer id+main
            }
        }
        // It’s okay if there’s no strong "name" column; methods below handle undefined.
        return column;
    }
    changeColor(color) {
        this.shapeColor = color;
    }
    changeMetaName(metacolumnName) {
        if (this.nameColumn && colName(this.nameColumn) === metacolumnName)
            return;
        for (const column of this.tapMetadataList.metadataList) {
            if (colName(column) === metacolumnName) {
                this.nameColumn = column;
                break;
            }
        }
    }
    /** Returns true to indicate a refresh-by-FoV is needed (preserves original behavior). */
    changeCatalogueMetaRA(metacolumnName) {
        if (colName(this.raColumn) !== metacolumnName) {
            for (const column of this.tapMetadataList.metadataList) {
                if (colName(column) === metacolumnName) {
                    this.raColumn = column;
                    break;
                }
            }
        }
        return true;
    }
    /** Returns true to indicate a refresh-by-FoV is needed (preserves original behavior). */
    changeCatalogueMetaDec(metacolumnName) {
        if (colName(this.decColumn) !== metacolumnName) {
            for (const column of this.tapMetadataList.metadataList) {
                if (colName(column) === metacolumnName) {
                    this.decColumn = column;
                    break;
                }
            }
        }
        return true;
    }
    resetCatalogueMetaShapeSize() {
        this.shapeSizeColumn = undefined;
    }
    changeCatalogueMetaShapeSize(metacolumnName) {
        if (!this.shapeSizeColumn || colName(this.shapeSizeColumn) !== metacolumnName) {
            for (const column of this.tapMetadataList.metadataList) {
                if (colName(column) === metacolumnName) {
                    this.shapeSizeColumn = column;
                    break;
                }
            }
        }
    }
    resetCatalogueMetaShapeHue() {
        this.shapeHueColumn = undefined;
    }
    changeCatalogueMetaShapeHue(metacolumnName) {
        if (!this.shapeHueColumn || colName(this.shapeHueColumn) !== metacolumnName) {
            for (const column of this.tapMetadataList.metadataList) {
                if (colName(column) === metacolumnName) {
                    this.shapeHueColumn = column;
                    break;
                }
            }
        }
    }
}
//# sourceMappingURL=CatalogueProps.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/footprints/Footprint.js":
/*!*************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/footprints/Footprint.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_GeomUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/GeomUtils.js */ "../astro-viewer/lib-esm/utils/GeomUtils.js");
/* harmony import */ var _utils_STCSParser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/STCSParser.js */ "../astro-viewer/lib-esm/utils/STCSParser.js");

/**
 * @author Fabrizio Giordano (Fab)
 */
// import { Pointing, Healpix } from 'healpixjs';
// import { degToRad } from '../../utils/Utils.js';

// import global from '../../Global.js';

// export interface ParsedSTCS {
//   polygons: Point[][]; // array of polygons (each polygon is array of Point objects)
//   totpoints: number;
// }
class Footprint {
    _polygons = []; // array of polygons (-> array of points)
    _convexPolygons = []; // convex polygons
    _stcs; // STC-S string
    _valid = false;
    _details;
    _totPoints = 0;
    _totConvexPoints = 0;
    _npix256;
    _footprintsPointsOrder;
    _selectionObj;
    _identifier;
    _center; // could be typed if you have a Point type
    /**
     * @param in_stcs STC-S representation of the footprint
     * @param in_details optional metadata
     * @param footprintsPointsOrder 1-> clockwise, -1 counter clockwise
     */
    constructor(in_stcs, in_details = [], footprintsPointsOrder) {
        if (in_stcs) {
            this._stcs = in_stcs.toUpperCase();
            this._details = in_details;
            this._totPoints = 0;
            this._totConvexPoints = 0;
            this._footprintsPointsOrder = footprintsPointsOrder;
            this.computePoints();
            this._selectionObj = this.computeSelectionObject();
            this._valid = true;
        }
        else {
            this._details = [];
        }
    }
    computeSelectionObject() {
        return _utils_GeomUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].computeSelectionObject(this._polygons);
    }
    // /**
    //  * Return array of HEALPix pixels covering the footprint
    //  * NOTE: despite the name, nside is not fixed at 256. It comes from Global.js
    //  */
    // private computeNpix256(): number[] {
    //   const healpix256 = new Healpix(global.nsideForSelection);
    //   const points: Pointing[] = [];
    //   for (const poly of this._convexPolygons) {
    //     for (const currPoint of poly) {
    //       const phiTheta = currPoint.computeHealpixPhiTheta();
    //       const phiRad = degToRad(phiTheta.phi);
    //       const thetaRad = degToRad(phiTheta.theta);
    //       points.push(new Pointing(null, false, thetaRad, phiRad));
    //     }
    //   }
    //   const rangeSet = healpix256.queryPolygonInclusive(points, 32);
    //   return Array.from(rangeSet.r);
    // }
    computePoints() {
        const res = _utils_STCSParser_js__WEBPACK_IMPORTED_MODULE_1__["default"].parseSTCS(this._stcs);
        this._polygons = res.polygons;
        this._totPoints = res.totpoints;
    }
    get valid() {
        return this._valid;
    }
    get totPoints() {
        return this._totPoints;
    }
    get totConvexPoints() {
        return this._totConvexPoints;
    }
    get polygons() {
        return this._polygons;
    }
    get convexPolygons() {
        return this._convexPolygons;
    }
    get identifier() {
        return this._identifier;
    }
    get center() {
        return this._center;
    }
    get pixels() {
        return this._npix256;
    }
    get details() {
        return this._details;
    }
    get selectionObj() {
        return this._selectionObj;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footprint);
//# sourceMappingURL=Footprint.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/footprints/FootprintProps.js":
/*!******************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/footprints/FootprintProps.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FootprintProps)
/* harmony export */ });
class FootprintProps {
    // resolved columns
    pgSphereColumn;
    geomColumn;
    raColumn;
    decColumn;
    nameColumn;
    shapeColor;
    tapMetadataList;
    constructor(tapMetadataList, color) {
        this.tapMetadataList = tapMetadataList;
        this.shapeColor = color;
        this.setPositionColumns(tapMetadataList);
        this.nameColumn = this.setNameColumn(tapMetadataList);
    }
    setPositionColumns(tapMetadataList) {
        // pgSphere
        for (const meta of tapMetadataList.pgSphereMetaColumns) {
            this.pgSphereColumn = meta;
        }
        // s_region (choose the 'pos.outline;obs.field' if available; otherwise first)
        for (const meta of tapMetadataList.sRegionMetaColumns) {
            if (meta.ucd && meta.ucd.includes('pos.outline;obs.field')) {
                this.geomColumn = meta;
                break;
            }
            if (!this.geomColumn) {
                this.geomColumn = meta;
            }
        }
        // RA (prefer meta.main)
        for (const meta of tapMetadataList.posEqRAMetaColumns) {
            if (meta.ucd && meta.ucd.includes('meta.main')) {
                this.raColumn = meta;
                break;
            }
            if (!this.raColumn) {
                this.raColumn = meta;
            }
        }
        // DEC (prefer meta.main) – supports both posEqDecMetaColumns and _posEqDecMetaColumns
        const decList = tapMetadataList.posEqDecMetaColumns?.length
            ? tapMetadataList.posEqDecMetaColumns
            : tapMetadataList.posEqDecMetaColumns ?? [];
        for (const meta of decList) {
            if (meta.ucd && meta.ucd.includes('meta.main')) {
                this.decColumn = meta;
                break;
            }
            if (!this.decColumn) {
                this.decColumn = meta;
            }
        }
    }
    setNameColumn(tapMetadataList) {
        let nameColumn;
        for (const meta of tapMetadataList.metadataList) {
            if (meta.ucd?.includes('meta.id') && meta.ucd?.includes('meta.main')) {
                nameColumn = meta;
            }
        }
        return nameColumn;
    }
    changeColor(color) {
        this.shapeColor = color;
    }
    changeMetaName(metacolumnName) {
        const currentName = this.getMetaName(this.nameColumn);
        if (currentName !== metacolumnName) {
            for (const column of this.tapMetadataList.metadataList) {
                if (this.getMetaName(column) === metacolumnName) {
                    this.nameColumn = column;
                    break;
                }
            }
        }
    }
    // helper to normalize `name` / `_name`
    getMetaName(meta) {
        return meta?.name ?? meta?.name;
    }
}
//# sourceMappingURL=FootprintProps.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/footprints/FootprintSetGL.js":
/*!******************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/footprints/FootprintSetGL.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Footprint_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Footprint.js */ "../astro-viewer/lib-esm/model/footprints/Footprint.js");
/* harmony import */ var _FootprintProps_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FootprintProps.js */ "../astro-viewer/lib-esm/model/footprints/FootprintProps.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/* harmony import */ var _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");
/* harmony import */ var _shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shader/FootprintShaderProgram.js */ "../astro-viewer/lib-esm/shader/FootprintShaderProgram.js");
/* harmony import */ var _Point_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Point.js */ "../astro-viewer/lib-esm/model/Point.js");
/* harmony import */ var _utils_GeomUtils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/GeomUtils.js */ "../astro-viewer/lib-esm/utils/GeomUtils.js");
/* harmony import */ var _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");









class FootprintSetGL {
    static ELEM_SIZE = 3;
    static BYTES_X_ELEM = new Float32Array().BYTES_PER_ELEMENT;
    static CONVEXPOLY_ELEM_SIZE = 3;
    ready;
    footprintsetProps;
    name;
    description;
    tapRepo;
    extHoveredIndexes;
    oldMouseCoords;
    healpixDensityMap;
    totConvexPoints;
    // footprintsInPix256: Map<number, Footprint[]>
    gl;
    // shaderProgram: WebGLProgram
    vertexCataloguePositionBuffer;
    indexBuffer;
    hoveredVertexPositionBuffer;
    hoveredIndexBuffer;
    selectedVertexPositionBuffer;
    selectedIndexBuffer;
    indexes;
    footprintPolygons = [];
    vertexCataloguePosition;
    totPoints;
    nPrimitiveFlags = 0;
    hoveredIndexes;
    _hoveredFootprints = [];
    hoveredVertexPosition;
    totHoveredPoints;
    nHoveredPrimitiveFlags = 0;
    selectedIndexes;
    _selectedFootprints = [];
    selectedVertexPosition;
    totSelectedPoints;
    nSlectedPrimitiveFlags = 0;
    _isVisible = true;
    constructor(tablename, tabledesc, tapRepo, tapMetadataList) {
        this.ready = false;
        this.TYPE = 'FOOTPRINT_SET';
        this.name = tablename;
        this.description = tabledesc;
        this.tapRepo = tapRepo;
        // this.footprintsInPix256 = new Map()
        this.initFootprintArrays();
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl) {
            throw new Error('WebGL2RenderingContext is not initialized (global.gl is null)');
        }
        this.gl = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl;
        this.initGLBuffers();
        this.oldMouseCoords = null;
        const defaultColor = '#00fff2ff';
        this.footprintsetProps = new _FootprintProps_js__WEBPACK_IMPORTED_MODULE_1__["default"](tapMetadataList, defaultColor);
        _shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.shaderProgram;
    }
    initFootprintArrays() {
        this.footprintPolygons = [];
        this.indexes = new Uint32Array();
        this.vertexCataloguePosition = new Float32Array();
        this.totPoints = 0;
        this.totConvexPoints = 0;
        this.extHoveredIndexes = new Uint32Array;
        this._hoveredFootprints = [];
        this.hoveredVertexPosition = new Float32Array();
        this.totHoveredPoints = 0;
        this.hoveredIndexes = new Uint32Array;
        this._selectedFootprints = [];
        this.selectedVertexPosition = new Float32Array();
        this.totSelectedPoints = 0;
        this.selectedIndexes = new Uint32Array;
    }
    initGLBuffers() {
        this.vertexCataloguePositionBuffer = this.gl.createBuffer();
        this.indexBuffer = this.gl.createBuffer();
        this.hoveredVertexPositionBuffer = this.gl.createBuffer();
        this.hoveredIndexBuffer = this.gl.createBuffer();
        this.selectedVertexPositionBuffer = this.gl.createBuffer();
        this.selectedIndexBuffer = this.gl.createBuffer();
    }
    setIsVisible(visibility) {
        this._isVisible = visibility;
    }
    get isVisible() {
        return this._isVisible;
    }
    addFootprint(in_footprint) {
        this.footprintPolygons.push(in_footprint);
    }
    addFootprints(in_data, columnsmeta) {
        this.ready = false;
        const geomDataIndex = this.footprintsetProps.geomColumn?.index;
        if (geomDataIndex === undefined) {
            throw new Error('geomColumn or its index is undefined in footprintsetProps');
        }
        for (let j = 0; j < in_data.length; j++) {
            if (in_data[j][0] !== null) {
                const footprint = new _Footprint_js__WEBPACK_IMPORTED_MODULE_0__["default"](in_data[j][geomDataIndex], in_data[j]);
                if (footprint._valid) {
                    this.addFootprint(footprint);
                    this.totPoints += footprint.totPoints;
                    this.totConvexPoints += footprint.totConvexPoints;
                }
            }
        }
        this.initBuffer();
        this.ready = true;
    }
    clearFootprints() {
        this.initFootprintArrays();
    }
    initBuffer() {
        const nFootprints = this.footprintPolygons.length;
        let npolygons = nFootprints - 1;
        for (let j = 0; j < nFootprints; j++) {
            npolygons += this.footprintPolygons[j].polygons.length - 1;
        }
        this.indexes = new Uint32Array(this.totPoints + npolygons + 1);
        const MAX_UNSIGNED_INT = 0xffffffff;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexCataloguePositionBuffer);
        this.vertexCataloguePosition = new Float32Array(3 * this.totPoints);
        let positionIndex = 0;
        let vIdx = 0;
        const R = 1.0;
        this.nPrimitiveFlags = 0;
        for (let j = 0; j < nFootprints; j++) {
            const footprint = this.footprintPolygons[j];
            const footprintPoly = footprint.polygons;
            if (j > 0) {
                this.indexes[vIdx++] = MAX_UNSIGNED_INT;
                this.nPrimitiveFlags++;
            }
            for (const poly of footprintPoly) {
                if (poly !== footprintPoly[0]) {
                    this.indexes[vIdx++] = MAX_UNSIGNED_INT;
                    this.nPrimitiveFlags++;
                }
                for (const point of poly) {
                    this.vertexCataloguePosition[positionIndex++] = R * point.x;
                    this.vertexCataloguePosition[positionIndex++] = R * point.y;
                    this.vertexCataloguePosition[positionIndex++] = R * point.z;
                    this.indexes[vIdx++] = Math.floor((positionIndex - 1) / 3);
                }
            }
        }
        this.indexes[this.indexes.length - 1] = MAX_UNSIGNED_INT;
        console.log('Buffer initialized');
    }
    checkSelection(mouseHelper) {
        if (!mouseHelper.x || !mouseHelper.y || !mouseHelper.z)
            return;
        let mousePix = mouseHelper.computeNpix();
        if (!mousePix)
            return;
        this._hoveredFootprints = [];
        this.totHoveredPoints = 0;
        const mousePoint = new _Point_js__WEBPACK_IMPORTED_MODULE_6__["default"]({ x: mouseHelper.x, y: mouseHelper.y, z: mouseHelper.z }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_8__["default"].CARTESIAN);
        for (let i = 0; i < this.footprintPolygons.length; i++) {
            const footprint = this.footprintPolygons[i];
            if (!footprint.selectionObj)
                continue;
            if (_utils_GeomUtils_js__WEBPACK_IMPORTED_MODULE_7__["default"].checkPointInsidePolygon5(footprint.selectionObj, mousePoint)) {
                const details = [...footprint.details];
                const geomDataIndex = this.footprintsetProps.geomColumn?.index;
                if (geomDataIndex === undefined)
                    continue;
                details.splice(geomDataIndex, 1);
                this._hoveredFootprints.push(footprint);
                this.totHoveredPoints += footprint.totPoints;
            }
        }
        this.initHoveringBuffer();
    }
    get hoveredFootprints() {
        return {
            metadata: this.footprintsetProps.tapMetadataList,
            footprints: this._hoveredFootprints,
            tableName: this.name,
            description: this.description,
            provider: this.tapRepo.tapBaseUrl
        };
    }
    get selectedFootprints() {
        return this._selectedFootprints;
    }
    highlightFootprint(footprint, highlighted) {
        if (highlighted) {
            this._hoveredFootprints.push(footprint);
            this.totHoveredPoints += footprint.totPoints;
        }
        else {
            const indexOfFootprint = this._hoveredFootprints.indexOf(footprint);
            this._hoveredFootprints.splice(indexOfFootprint, 1);
            this.totHoveredPoints -= footprint.totPoints;
        }
        this.initHoveringBuffer();
    }
    /**
     *
     * @param {Footprint[]} footprints
     */
    addFootprint2Selected(footprints) {
        let refreshBuffer = false;
        for (let f of footprints) {
            if (!this._selectedFootprints.includes(f)) {
                this._selectedFootprints.push(f);
                this.totSelectedPoints += f.totPoints;
                refreshBuffer = true;
            }
        }
        if (refreshBuffer) {
            this.initSelectionBuffer();
        }
    }
    /**
     *
     * @param {Footprint} footprint
     */
    removeFootprintFromSelection(footprint) {
        const indexOfObject = this._selectedFootprints.indexOf(footprint);
        if (indexOfObject >= 0) {
            this._selectedFootprints.splice(indexOfObject, 1);
            this.totSelectedPoints -= footprint.totPoints;
            if (this._selectedFootprints.length > 0) {
                this.initSelectionBuffer();
            }
        }
    }
    initHoveringBuffer() {
        /*
                TODO better approach. when creating the indexbuffer of footprints,
                add 1 extra position for the selection (set to 0 == not selected),
                and save the position "positionIndex" in an array (selectionIndexes).
                When checking the selection, I get the index of the footprint, which
                matches with the index in the selectionIndexes to retrieve the position
                of the flag to be set to 1 in the vertexposition
                This will ease checking the selection in the vertex/fragment shader and
                set the pointsize and shape color.
                */
        if (this._hoveredFootprints.length == 0) {
            return;
        }
        let nFootprints = this._hoveredFootprints.length;
        let npolygons = nFootprints - 1;
        for (let j = 0; j < nFootprints; j++) {
            npolygons += this._hoveredFootprints[j].polygons.length - 1;
        }
        // this._selectedIndex = new Uint16Array(this._totSelectedPoints + npolygons);
        // let MAX_UNSIGNED_SHORT = 65535; // this is used to enable and disable GL_PRIMITIVE_RESTART_FIXED_INDEX
        this.hoveredIndexes = new Uint32Array(this.totHoveredPoints + npolygons);
        const MAX_UNSIGNED_INT = 0xffffffff; // this is used to enable and disable GL_PRIMITIVE_RESTART_FIXED_INDEX
        // let MAX_UNSIGNED_SHORT = Number.MAX_SAFE_INTEGER;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.hoveredVertexPositionBuffer);
        this.hoveredVertexPosition = new Float32Array(3 * this.totHoveredPoints);
        let positionIndex = 0;
        let vIdx = 0;
        let R = 1.0;
        this.nHoveredPrimitiveFlags = 0;
        for (let j = 0; j < nFootprints; j++) {
            let hoveredFootprintPoly = this._hoveredFootprints[j].polygons;
            if (j > 0) {
                this.hoveredIndexes[vIdx] = MAX_UNSIGNED_INT;
                this.nHoveredPrimitiveFlags += 1;
                vIdx += 1;
            }
            for (let polyIdx = 0; polyIdx < hoveredFootprintPoly.length; polyIdx++) {
                if (polyIdx > 0) {
                    this.hoveredIndexes[vIdx] = MAX_UNSIGNED_INT;
                    this.nHoveredPrimitiveFlags += 1;
                    vIdx += 1;
                }
                const poly = hoveredFootprintPoly[polyIdx];
                for (let pointIdx = 0; pointIdx < poly.length; pointIdx++) {
                    const p = poly[pointIdx];
                    this.hoveredVertexPosition[positionIndex] = R * p.x;
                    this.hoveredVertexPosition[positionIndex + 1] = R * p.y;
                    this.hoveredVertexPosition[positionIndex + 2] = R * p.z;
                    this.hoveredIndexes[vIdx] = Math.floor(positionIndex / 3);
                    vIdx += 1;
                    positionIndex += 3;
                }
            }
        }
    }
    initSelectionBuffer() {
        /*
                TODO better approach. when creating the indexbuffer of footprints,
                add 1 extra position for the selection (set to 0 == not selected),
                and save the position "positionIndex" in an array (selectionIndexes).
                When checking the selection, I get the index of the footprint, which
                matches with the index in the selectionIndexes to retrieve the position
                of the flag to be set to 1 in the vertexposition
                This will ease checking the selection in the vertex/fragment shader and
                set the pointsize and shape color.
                */
        let nFootprints = this._selectedFootprints.length;
        let npolygons = nFootprints - 1;
        for (let j = 0; j < nFootprints; j++) {
            npolygons += this._selectedFootprints[j].polygons.length - 1;
        }
        // this._selectedIndex = new Uint16Array(this._totSelectedPoints + npolygons);
        // let MAX_UNSIGNED_SHORT = 65535; // this is used to enable and disable GL_PRIMITIVE_RESTART_FIXED_INDEX
        this.selectedIndexes = new Uint32Array(this.totSelectedPoints + npolygons);
        const MAX_UNSIGNED_INT = 0xffffffff; // this is used to enable and disable GL_PRIMITIVE_RESTART_FIXED_INDEX
        // let MAX_UNSIGNED_SHORT = Number.MAX_SAFE_INTEGER;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.selectedVertexPositionBuffer);
        this.selectedVertexPosition = new Float32Array(3 * this.totSelectedPoints);
        let positionIndex = 0;
        let vIdx = 0;
        let R = 1.0;
        this.nSlectedPrimitiveFlags = 0;
        for (let j = 0; j < nFootprints; j++) {
            let footprintPoly = this._selectedFootprints[j].polygons;
            if (j > 0) {
                this.selectedIndexes[vIdx] = MAX_UNSIGNED_INT;
                this.nSlectedPrimitiveFlags += 1;
                vIdx += 1;
            }
            for (let polyIdx = 0; polyIdx < footprintPoly.length; polyIdx++) {
                if (polyIdx > 0) {
                    this.selectedIndexes[vIdx] = MAX_UNSIGNED_INT;
                    this.nSlectedPrimitiveFlags += 1;
                    vIdx += 1;
                }
                const poly = footprintPoly[polyIdx];
                for (let pointIdx = 0; pointIdx < poly.length; pointIdx++) {
                    const p = poly[pointIdx];
                    this.selectedVertexPosition[positionIndex] = R * p.x;
                    this.selectedVertexPosition[positionIndex + 1] = R * p.y;
                    this.selectedVertexPosition[positionIndex + 2] = R * p.z;
                    this.selectedIndexes[vIdx] = Math.floor(positionIndex / 3);
                    vIdx += 1;
                    positionIndex += 3;
                }
            }
        }
    }
    draw(in_mMatrix, in_mouseHelper) {
        if (!this.isVisible)
            return;
        if (!this.ready)
            return;
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera)
            return;
        _shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.enableShaders(_utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_4__["default"].pMatrix, in_mMatrix, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera.getCameraMatrix());
        if (in_mouseHelper != null && in_mouseHelper.xyz != this.oldMouseCoords) {
            this.checkSelection(in_mouseHelper);
        }
        if (this._hoveredFootprints.length > 0) {
            // TODO POINT_SIZE doesn't have any effect on line thickness!! it only applies to points
            const rgb = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__.colorHex2RGB)('#00FF00');
            const alpha = 1.0;
            this.gl.uniform4f(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.color, rgb[0], rgb[1], rgb[2], alpha);
            this.gl.uniform1f(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.pointSize, 14.0); // <--- POINT_SIZE in LINE_LOOP is not applicable
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.hoveredVertexPositionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.hoveredVertexPosition, this.gl.STATIC_DRAW);
            // setting footprint position
            this.gl.vertexAttribPointer(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.position, FootprintSetGL.ELEM_SIZE, this.gl.FLOAT, false, FootprintSetGL.BYTES_X_ELEM * FootprintSetGL.ELEM_SIZE, 0);
            this.gl.enableVertexAttribArray(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.position);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.hoveredIndexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.hoveredIndexes, this.gl.STATIC_DRAW);
            // this._gl.drawElements (this._gl.LINE_LOOP, this._selectedVertexPosition.length / 3 + this._nSlectedPrimitiveFlags,this._gl.UNSIGNED_SHORT, 0);
            this.gl.drawElements(this.gl.LINE_LOOP, this.hoveredVertexPosition.length / 3 + this.nHoveredPrimitiveFlags, this.gl.UNSIGNED_INT, 0);
        }
        if (this._selectedFootprints.length > 0) {
            const rgb = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__.colorHex2RGB)('#ECB462');
            const alpha = 1.0;
            this.gl.uniform4f(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.color, rgb[0], rgb[1], rgb[2], alpha);
            this.gl.uniform1f(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.pointSize, 14.0); // <--- POINT_SIZE in LINE_LOOP is not applicable
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.selectedVertexPositionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.selectedVertexPosition, this.gl.STATIC_DRAW);
            // setting footprint position
            this.gl.vertexAttribPointer(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.position, FootprintSetGL.ELEM_SIZE, this.gl.FLOAT, false, FootprintSetGL.BYTES_X_ELEM * FootprintSetGL.ELEM_SIZE, 0);
            this.gl.enableVertexAttribArray(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.position);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.selectedIndexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.selectedIndexes, this.gl.STATIC_DRAW);
            // this._gl.drawElements (this._gl.LINE_LOOP, this._selectedVertexPosition.length / 3 + this._nSlectedPrimitiveFlags,this._gl.UNSIGNED_SHORT, 0);
            this.gl.drawElements(this.gl.LINE_LOOP, this.selectedVertexPosition.length / 3 + this.nSlectedPrimitiveFlags, this.gl.UNSIGNED_INT, 0);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexCataloguePositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexCataloguePosition, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.position, FootprintSetGL.ELEM_SIZE, this.gl.FLOAT, false, FootprintSetGL.BYTES_X_ELEM * FootprintSetGL.ELEM_SIZE, 0);
        this.gl.enableVertexAttribArray(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.position);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indexes, this.gl.STATIC_DRAW);
        const shapeColor = [...(0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__.colorHex2RGB)(this.footprintsetProps.shapeColor), 1.0];
        this.gl.uniform4f(_shader_FootprintShaderProgram_js__WEBPACK_IMPORTED_MODULE_5__.footprintShaderProgram.locations.color, ...shapeColor);
        this.gl.drawElements(this.gl.LINE_LOOP, this.indexes.length, this.gl.UNSIGNED_INT, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.oldMouseCoords = in_mouseHelper.xyz;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FootprintSetGL);
//# sourceMappingURL=FootprintSetGL.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/grid/EquatorialGrid.js":
/*!************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/grid/EquatorialGrid.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec4.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _hips_FoVHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hips/FoVHelper.js */ "../astro-viewer/lib-esm/model/hips/FoVHelper.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/* harmony import */ var _shader_GridShaderManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shader/GridShaderManager.js */ "../astro-viewer/lib-esm/shader/GridShaderManager.js");
/* harmony import */ var _Point_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Point.js */ "../astro-viewer/lib-esm/model/Point.js");
/* harmony import */ var _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");
/* harmony import */ var _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/FoVUtils.js */ "../astro-viewer/lib-esm/utils/FoVUtils.js");
/* harmony import */ var _GridTextHelper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./GridTextHelper.js */ "../astro-viewer/lib-esm/model/grid/GridTextHelper.js");
/* harmony import */ var _HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");
/* harmony import */ var _AbstractSkyEntity_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../AbstractSkyEntity.js */ "../astro-viewer/lib-esm/model/AbstractSkyEntity.js");
/* harmony import */ var _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../utils/ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");
/* eslint-disable @typescript-eslint/no-non-null-assertion */













/** Equatorial grid rendered as RA/Dec great-circle line loops */
class EquatorialGrid extends _AbstractSkyEntity_js__WEBPACK_IMPORTED_MODULE_11__["default"] {
    static ELEM_SIZE = 3;
    static BYTES_X_ELEM = new Float32Array().BYTES_PER_ELEMENT;
    showGrid = true;
    // private _gl: GL;
    _shaderProgram;
    _vertexShader;
    _fragmentShader;
    defaultColor = '#41d421';
    gridText = new _GridTextHelper_js__WEBPACK_IMPORTED_MODULE_9__["default"]();
    _attribLocations = {
        position: 0,
        selected: 1,
        pointSize: 2,
        color: 3,
    };
    _phiVertexPositionBuffer;
    _thetaVertexPositionBuffer;
    _fov;
    // Step sizes (degrees + radians) and label caches
    _phiStep = 0;
    _phiStepRad = 0;
    _thetaStep = 0;
    _thetaStepRad = 0;
    _phiArray = [];
    _thetaArray = [];
    // For placing text labels near current view center:
    //  - _dec4Labels: key = RA(deg), value = points along that RA ring (for Dec labels)
    //  - _ra4Labels : key = Dec(deg), value = points along that Dec ring (for RA labels)
    _dec4Labels = new Map();
    _ra4Labels = new Map();
    /**
     * @param radius Not used by current implementation (sphere is unit-radius)
     * @param fov    Field of view in degrees
     */
    constructor() {
        super(_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_10__["default"].RADIUS, _HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_10__["default"].INITIAL_POSITION, _HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_10__["default"].INITIAL_PhiRad, _HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_10__["default"].INITIAL_ThetaRad, 'equatorial-grid');
    }
    init(fov) {
        this._fov = fov;
        this.initGL(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl);
        // Program & buffers
        this._shaderProgram = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.createProgram();
        this.initShaders();
        this._phiVertexPositionBuffer = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.createBuffer();
        this._thetaVertexPositionBuffer = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.createBuffer();
        // Build initial RA/Dec line buffers
        this.initBuffers(this._fov);
    }
    /** Compile/link shaders and fetch uniform/attribute locations */
    initShaders() {
        // Fragment
        const fsSource = _shader_GridShaderManager_js__WEBPACK_IMPORTED_MODULE_5__["default"].healpixGridFS();
        this._fragmentShader = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.createShader(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.FRAGMENT_SHADER);
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.shaderSource(this._fragmentShader, fsSource);
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.compileShader(this._fragmentShader);
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.getShaderParameter(this._fragmentShader, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.COMPILE_STATUS)) {
            // Keep identical behavior (alert) but surface errors in console too
            const log = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.getShaderInfoLog(this._fragmentShader) || 'Unknown fragment shader error';
            console.error(log);
            alert(log);
            return;
        }
        // Vertex
        const vsSource = _shader_GridShaderManager_js__WEBPACK_IMPORTED_MODULE_5__["default"].healpixGridVS();
        this._vertexShader = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.createShader(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.VERTEX_SHADER);
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.shaderSource(this._vertexShader, vsSource);
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.compileShader(this._vertexShader);
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.getShaderParameter(this._vertexShader, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.COMPILE_STATUS)) {
            const log = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.getShaderInfoLog(this._vertexShader) || 'Unknown vertex shader error';
            console.error(log);
            alert(log);
            return;
        }
        // Link
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.attachShader(this._shaderProgram, this._vertexShader);
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.attachShader(this._shaderProgram, this._fragmentShader);
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.linkProgram(this._shaderProgram);
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.getProgramParameter(this._shaderProgram, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.useProgram(this._shaderProgram);
    }
    /** Build RA/Dec line vertex arrays based on FoV step helper */
    initBuffers(fovDeg) {
        const R = 1.0;
        const steps = _hips_FoVHelper_js__WEBPACK_IMPORTED_MODULE_3__.fovHelper.getRADegSteps(fovDeg);
        const phiStep = steps.raStep; // RA step (deg)
        const thetaStep = steps.decStep; // Dec step (deg)
        this._phiStep = phiStep;
        this._phiStepRad = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.degToRad)(phiStep);
        this._thetaStep = thetaStep;
        this._thetaStepRad = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.degToRad)(thetaStep);
        this._ra4Labels = new Map();
        this._dec4Labels = new Map();
        this._phiArray = [];
        this._thetaArray = [];
        // Lines of constant Dec (varying RA): for each Dec, a ring with vertices every phiStep°
        for (let theta = thetaStep; theta < 180; theta += thetaStep) {
            const phiVertexPosition = new Float32Array((360 / phiStep) * 3);
            const thetaRad = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.degToRad)(theta);
            for (let phi = 0; phi < 360; phi += phiStep) {
                const phiRad = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.degToRad)(phi);
                const x = R * Math.sin(thetaRad) * Math.cos(phiRad);
                const y = R * Math.sin(thetaRad) * Math.sin(phiRad);
                const z = R * Math.cos(thetaRad);
                const idx = Math.floor(phi / phiStep);
                phiVertexPosition[3 * idx + 0] = x;
                phiVertexPosition[3 * idx + 1] = y;
                phiVertexPosition[3 * idx + 2] = z;
                if (!this._dec4Labels.has(phi))
                    this._dec4Labels.set(phi, []);
                this._dec4Labels.get(phi).push([x, y, z]);
            }
            this._phiArray.push(phiVertexPosition);
        }
        // Lines of constant RA (varying Dec): for each RA, a ring with vertices every thetaStep°
        for (let phi = 0; phi < 360; phi += phiStep) {
            const thetaVertexPosition = new Float32Array((360 / thetaStep) * 3);
            const phiRad = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.degToRad)(phi);
            for (let theta = 0; theta < 360; theta += thetaStep) {
                const thetaRad = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.degToRad)(theta);
                const x = R * Math.sin(thetaRad) * Math.cos(phiRad);
                const y = R * Math.sin(thetaRad) * Math.sin(phiRad);
                const z = R * Math.cos(thetaRad);
                const idx = Math.floor(theta / thetaStep);
                thetaVertexPosition[3 * idx + 0] = x;
                thetaVertexPosition[3 * idx + 1] = y;
                thetaVertexPosition[3 * idx + 2] = z;
                const decKey = 90 - theta; // original code’s keying for RA labels
                if (!this._ra4Labels.has(decKey))
                    this._ra4Labels.set(decKey, []);
                this._ra4Labels.get(decKey).push([x, y, z]);
            }
            this._thetaArray.push(thetaVertexPosition);
        }
    }
    /** Update buffers when FoV (in degrees) changes */
    refresh() {
        const fovDeg = _HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_10__["default"].getMinFoV();
        if (this._fov !== fovDeg) {
            this._fov = fovDeg;
            this.initBuffers(this._fov);
        }
    }
    vectorDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    enableShader(mMatrix, pMatrix) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl;
        gl.useProgram(this._shaderProgram);
        // uMVMatrix = camera * model
        const mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(mvMatrix, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera.getCameraMatrix(), mMatrix);
        // TODO move locations retrieval elsewhere
        // Uniform locations
        const uMVMatrixLoc = gl.getUniformLocation(this._shaderProgram, 'uMVMatrix');
        const uPMatrixLoc = gl.getUniformLocation(this._shaderProgram, 'uPMatrix');
        const uColor = gl.getUniformLocation(this._shaderProgram, 'u_fragcolor');
        // Attribute locations
        this._attribLocations.position = gl.getAttribLocation(this._shaderProgram, 'aCatPosition');
        if (uMVMatrixLoc)
            gl.uniformMatrix4fv(uMVMatrixLoc, false, mvMatrix);
        if (uPMatrixLoc)
            gl.uniformMatrix4fv(uPMatrixLoc, false, pMatrix);
        if (uColor) {
            const rgb = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.colorHex2RGB)(this.defaultColor);
            gl.uniform4f(uColor, rgb[0], rgb[1], rgb[2], 1.0);
        }
    }
    isVisible() {
        return this.showGrid;
    }
    toggleShowGrid() {
        this.showGrid = !this.showGrid;
    }
    /**
     * @param mMatrix model matrix associated with current HiPS (or scene) transform
     * @param fovObj  current field-of-view (degrees). If your FoV type differs,
     *                pass the numeric value here; this signature matches original usage.
     */
    draw() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl;
        const mMatrix = this.getModelMatrix();
        if (this._thetaArray.length === 0)
            return;
        this.refresh();
        if (!this.showGrid) {
            // gridTextHelper.resetDivSets();
            this.gridText.resetDivSets();
            return;
        }
        const pMatrix = _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_12__["default"].pMatrix;
        this.enableShader(mMatrix, pMatrix);
        // Draw Dec rings
        for (let i = 0; i < this._phiArray.length; i++) {
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.bindBuffer(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.ARRAY_BUFFER, this._phiVertexPositionBuffer);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.bufferData(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.ARRAY_BUFFER, this._phiArray[i], _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.STATIC_DRAW);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.vertexAttribPointer(this._attribLocations.position, 3, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.FLOAT, false, 0, 0);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.enableVertexAttribArray(this._attribLocations.position);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.drawArrays(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.LINE_LOOP, 0, 360 / this._phiStep);
        }
        // Draw RA rings
        for (let j = 0; j < this._thetaArray.length; j++) {
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.bindBuffer(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.ARRAY_BUFFER, this._thetaVertexPositionBuffer);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.bufferData(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.ARRAY_BUFFER, this._thetaArray[j], _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.STATIC_DRAW);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.vertexAttribPointer(this._attribLocations.position, 3, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.FLOAT, false, 0, 0);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.enableVertexAttribArray(this._attribLocations.position);
            _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.drawArrays(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.LINE_LOOP, 0, 360 / this._thetaStep);
        }
        // Label layout (HTML overlay)
        const center = _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_8__["default"].getCenterJ2000(gl.canvas);
        // MVP = P * V * M
        const mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(mvMatrix, _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera.getCameraMatrix(), mMatrix);
        const mvpMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(mvpMatrix, pMatrix, mvMatrix);
        // Dec labels (loop over RA keys)
        for (const [raDegKey, points] of this._dec4Labels.entries()) {
            if (Math.abs(raDegKey - center.raDeg) <= this._phiStep) {
                for (let p = 0; p < points.length; p++) {
                    const [x, y, z] = points[p];
                    const phiPoint = [x, y, z, 1];
                    const point = new _Point_js__WEBPACK_IMPORTED_MODULE_6__["default"]({ x, y, z }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_7__["default"].CARTESIAN);
                    const decDeg = point.decDeg;
                    if (Math.abs(decDeg - center.decDeg) < 60) {
                        const clipspace = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
                        gl_matrix__WEBPACK_IMPORTED_MODULE_1__.transformMat4(clipspace, phiPoint, mvpMatrix);
                        // perspective divide
                        clipspace[0] /= clipspace[3];
                        clipspace[1] /= clipspace[3];
                        // clip->pixel
                        const pixelX = (clipspace[0] * 0.5 + 0.5) * _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.canvas.width;
                        const pixelY = (clipspace[1] * -0.5 + 0.5) * _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.canvas.height;
                        this.gridText.addEqDivSet(decDeg.toFixed(2), pixelX, pixelY, 'dec');
                        // gridTextHelper.addEqDivSet(decDeg.toFixed(2), pixelX, pixelY, 'dec');
                    }
                }
            }
        }
        // RA labels (loop over Dec keys)
        for (const [decDegKey, points] of this._ra4Labels.entries()) {
            if (Math.abs(decDegKey - center.decDeg) <= this._thetaStep) {
                for (let p = 0; p < points.length; p++) {
                    const [x, y, z] = points[p];
                    const phiPoint = [x, y, z, 1];
                    const point = new _Point_js__WEBPACK_IMPORTED_MODULE_6__["default"]({ x, y, z }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_7__["default"].CARTESIAN);
                    const d = this.vectorDistance(point, center);
                    const raDeg = point.raDeg;
                    if (d < (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_4__.degToRad)(50)) {
                        const clipspace = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
                        gl_matrix__WEBPACK_IMPORTED_MODULE_1__.transformMat4(clipspace, phiPoint, mvpMatrix);
                        clipspace[0] /= clipspace[3];
                        clipspace[1] /= clipspace[3];
                        const pixelX = (clipspace[0] * 0.5 + 0.5) * _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.canvas.width;
                        const pixelY = (clipspace[1] * -0.5 + 0.5) * _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl.canvas.height;
                        // gridTextHelper.addEqDivSet(raDeg.toFixed(2), pixelX, pixelY, 'ra');
                        this.gridText.addEqDivSet(raDeg.toFixed(2), pixelX, pixelY, 'ra');
                    }
                }
            }
        }
        this.gridText.resetDivSets();
        // gridTextHelper.resetDivSets();
        // Cleanup
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
const equatorialGridSingleton = new EquatorialGrid();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (equatorialGridSingleton);
//# sourceMappingURL=EquatorialGrid.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/grid/GridTextHelper.js":
/*!************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/grid/GridTextHelper.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @author Fabrizio Giordano (Fab)
 * @param in_radius - number
 * @param in_gl - GL context
 * @param in_position - array of double e.g. [0.0, 0.0, 0.0]
 */
class GridTextHelper {
    _divEqContainerElement;
    _divHPXContainerElement;
    _divSets;
    _divSetNdx;
    constructor() {
        this._divEqContainerElement = document.querySelector('#gridcoords');
        this._divHPXContainerElement = document.querySelector('#gridhpx');
        this._divSetNdx = 0;
        this._divSets = [];
    }
    initHtml() {
        // Kept for API parity; nothing required here with current logic.
    }
    resetDivSets() {
        // Hide remaining divs and reset index
        for (; this._divSetNdx < this._divSets.length; ++this._divSetNdx) {
            this._divSets[this._divSetNdx].style.display = 'none';
        }
        this._divSetNdx = 0;
    }
    /**
     * Add / reuse a floating label for HPX coordinates
     */
    addHPXDivSet(msg, x, y) {
        let divSet = this._divSets[this._divSetNdx++];
        // Create on demand
        if (!divSet) {
            const div = document.createElement('div');
            const textNode = document.createTextNode('');
            div.className = 'floating-div-ra'; // style like RA tags
            div.appendChild(textNode);
            if (!this._divHPXContainerElement) {
                this._divHPXContainerElement = document.querySelector('#gridhpx');
            }
            if (!this._divHPXContainerElement) {
                // If container is still missing, abort gracefully
                return;
            }
            this._divHPXContainerElement.appendChild(div);
            divSet = { div, textNode, style: div.style };
            this._divSets.push(divSet);
        }
        // Show & position
        divSet.style.display = 'block';
        divSet.style.left = `${Math.floor(x + 25)}px`;
        divSet.style.top = `${Math.floor(y)}px`;
        divSet.textNode.nodeValue = msg;
    }
    /**
     * Add / reuse a floating label for Equatorial coords
     * @param type 'ra' or 'dec'
     */
    addEqDivSet(msg, x, y, type) {
        let divSet = this._divSets[this._divSetNdx++];
        if (!divSet) {
            const div = document.createElement('div');
            const textNode = document.createTextNode('');
            div.className = type === 'ra' ? 'floating-div-ra' : 'floating-div-dec';
            div.appendChild(textNode);
            if (!this._divEqContainerElement) {
                this._divEqContainerElement = document.querySelector('#gridcoords');
            }
            if (!this._divEqContainerElement) {
                // If container is still missing, abort gracefully
                return;
            }
            this._divEqContainerElement.appendChild(div);
            divSet = { div, textNode, style: div.style };
            this._divSets.push(divSet);
        }
        divSet.style.display = 'block';
        if (type === 'ra') {
            divSet.style.left = `${Math.floor(x + 25)}px`;
            divSet.style.top = `${Math.floor(y)}px`;
        }
        else {
            divSet.style.left = `${Math.floor(x)}px`;
            divSet.style.top = `${Math.floor(y + 25)}px`;
        }
        divSet.textNode.nodeValue = msg;
    }
}
// export const gridTextHelper = new GridTextHelper();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GridTextHelper);
//# sourceMappingURL=GridTextHelper.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js":
/*!******************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractSkyEntity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../AbstractSkyEntity.js */ "../astro-viewer/lib-esm/model/AbstractSkyEntity.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec4.js");
/* harmony import */ var _hips_FoVHelper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hips/FoVHelper.js */ "../astro-viewer/lib-esm/model/hips/FoVHelper.js");
/* harmony import */ var _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/FoVUtils.js */ "../astro-viewer/lib-esm/utils/FoVUtils.js");
/* harmony import */ var _FoV_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../FoV.js */ "../astro-viewer/lib-esm/model/FoV.js");
/* harmony import */ var _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");
/* harmony import */ var _Point_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Point.js */ "../astro-viewer/lib-esm/model/Point.js");
/* harmony import */ var _shader_GridShaderManager_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shader/GridShaderManager.js */ "../astro-viewer/lib-esm/shader/GridShaderManager.js");
/* harmony import */ var _utils_GeomUtils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils/GeomUtils.js */ "../astro-viewer/lib-esm/utils/GeomUtils.js");
/* harmony import */ var _GridTextHelper_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./GridTextHelper.js */ "../astro-viewer/lib-esm/model/grid/GridTextHelper.js");
/* harmony import */ var _hips_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../hips/VisibleTilesManager.js */ "../astro-viewer/lib-esm/model/hips/VisibleTilesManager.js");
/* harmony import */ var _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../utils/ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../utils/Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");















class HealpixGridSingleton extends _AbstractSkyEntity_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    static ELEM_SIZE = 3;
    static BYTES_X_ELEM = new Float32Array().BYTES_PER_ELEMENT;
    _visibleorder = 0;
    showGrid = false;
    _shaderProgram;
    fragmentShader;
    vertexShader;
    defaultColor = '#ec0acaff';
    gridText = new _GridTextHelper_js__WEBPACK_IMPORTED_MODULE_11__["default"]();
    _attribLocations = {
        position: 0,
        selected: 1,
        pointSize: 2,
        color: 3,
    };
    _nPrimitiveFlags = 0;
    _vertexCataloguePositionBuffer;
    _indexBuffer;
    _vertexCataloguePosition = new Float32Array(0);
    _indexes = new Uint32Array(0);
    fovObj;
    static INITIAL_FOV = 180;
    static RADIUS = 1;
    static INITIAL_POSITION = [0.0, 0.0, 0.0];
    static INITIAL_PhiRad = 0;
    static INITIAL_ThetaRad = 0;
    constructor() {
        super(HealpixGridSingleton.RADIUS, HealpixGridSingleton.INITIAL_POSITION, HealpixGridSingleton.INITIAL_PhiRad, HealpixGridSingleton.INITIAL_ThetaRad, 'healpix-grid');
    }
    init() {
        console.log('HealpixGridSingleton.init()');
        this.initGL(_Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl);
        this._shaderProgram = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl.createProgram();
        this.initShaders();
        const order = _hips_FoVHelper_js__WEBPACK_IMPORTED_MODULE_4__.fovHelper.getHiPSNorder(HealpixGridSingleton.INITIAL_FOV);
        this._visibleorder = order;
        this._nPrimitiveFlags = 0;
        this._vertexCataloguePositionBuffer = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl.createBuffer();
        this._indexBuffer = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl.createBuffer();
        this._vertexCataloguePosition = new Float32Array(0);
        this.fovObj = new _FoV_js__WEBPACK_IMPORTED_MODULE_6__.FoV();
    }
    get RADIUS() {
        return HealpixGridSingleton.RADIUS;
    }
    get INITIAL_POSITION() {
        return HealpixGridSingleton.INITIAL_POSITION;
    }
    get INITIAL_PhiRad() {
        return HealpixGridSingleton.INITIAL_PhiRad;
    }
    get INITIAL_ThetaRad() {
        return HealpixGridSingleton.INITIAL_ThetaRad;
    }
    refreshFoV() {
        return this.fovObj.getFoV(_Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].insideSphere);
    }
    getFoV() {
        return this.fovObj;
    }
    getMinFoV() {
        return this.fovObj.minFoV;
    }
    initShaders() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        const fragmentShaderStr = _shader_GridShaderManager_js__WEBPACK_IMPORTED_MODULE_9__["default"].healpixGridFS();
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragmentShader, fragmentShaderStr);
        gl.compileShader(this.fragmentShader);
        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this.fragmentShader) || 'Fragment shader compile error');
            return;
        }
        const vertexShaderStr = _shader_GridShaderManager_js__WEBPACK_IMPORTED_MODULE_9__["default"].healpixGridVS();
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertexShader, vertexShaderStr);
        gl.compileShader(this.vertexShader);
        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this.vertexShader) || 'Vertex shader compile error');
            return;
        }
        gl.attachShader(this._shaderProgram, this.vertexShader);
        gl.attachShader(this._shaderProgram, this.fragmentShader);
        gl.linkProgram(this._shaderProgram);
        if (!gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        gl.useProgram(this._shaderProgram);
    }
    initBuffers(pixels, order) {
        this._nPrimitiveFlags = 0;
        const healpix = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(order);
        const subhpx = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(order + 1);
        const subsubhpx = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(order + 2);
        let positionIndex = 0;
        let vIdx = 0;
        const R = 1.0;
        const MAX_UINT = 0xffffffff;
        this._indexes = new Uint32Array(17 * pixels.length);
        this._vertexCataloguePosition = new Float32Array(3 * 16 * pixels.length);
        for (let p = 0; p < pixels.length; p++) {
            const vecs = healpix.getBoundaries(pixels[p]);
            const cpix0 = pixels[p] << 2;
            const cpix1 = cpix0 + 1;
            const cpix2 = cpix0 + 2;
            const cpix3 = cpix0 + 3;
            const cp0vecs = subhpx.getBoundaries(cpix0);
            const cp3vecs = subhpx.getBoundaries(cpix3);
            // helper to push a vertex
            const pushV = (v) => {
                this._vertexCataloguePosition[positionIndex] = R * v.x;
                this._vertexCataloguePosition[positionIndex + 1] = R * v.y;
                this._vertexCataloguePosition[positionIndex + 2] = R * v.z;
                this._indexes[vIdx] = Math.floor(positionIndex / 3);
                vIdx += 1;
                positionIndex += 3;
            };
            // v0(3/0)
            pushV(vecs[0]);
            // v1(15/2)
            let subcpix3 = cpix3 << 2;
            let subcpix3_3 = subcpix3 + 3;
            let tmp = subsubhpx.getBoundaries(subcpix3_3);
            pushV(tmp[1]);
            // v1(3/1)
            pushV(cp3vecs[1]);
            // v0(2/2)
            let subcpix2 = cpix2 << 2;
            let subcpix2_2 = subcpix2 + 2;
            tmp = subsubhpx.getBoundaries(subcpix2_2);
            pushV(tmp[0]);
            // v1(0/0)
            pushV(vecs[1]);
            // v2(2/2)
            pushV(tmp[2]);
            // v1(0/1)
            pushV(cp0vecs[1]);
            // v1(0/2)
            let subcpix0 = cpix0 << 2;
            let subcpix0_2 = subcpix0;
            tmp = subsubhpx.getBoundaries(subcpix0_2);
            pushV(tmp[1]);
            // v2(0/0)
            pushV(vecs[2]);
            // v3(0/2)
            pushV(tmp[3]);
            // v3(0/1)
            pushV(cp0vecs[3]);
            // v2(5/2)
            let subcpix1 = cpix1 << 2;
            let subcpix1_1 = subcpix1 + 1;
            tmp = subsubhpx.getBoundaries(subcpix1_1);
            pushV(tmp[2]);
            // v3(0/0)
            pushV(vecs[3]);
            // v0(5/2)
            pushV(tmp[0]);
            // v3(3/1)
            pushV(cp3vecs[3]);
            tmp = subsubhpx.getBoundaries(subcpix3_3);
            pushV(tmp[3]);
            // primitive restart
            this._indexes[vIdx] = MAX_UINT;
            this._nPrimitiveFlags += 1;
            vIdx += 1;
        }
    }
    // updateTiles(pixels: number[], order: number) {
    //   return (this as any)._tileBuffer.updateTiles(pixels, order);
    // }
    refresh() {
        this.refreshFoV();
        const fov = this.getMinFoV();
        // expose to global (legacy)
        // (global as any).hipsFoV = fov;
        // global.order = fovHelper.getHiPSNorder(fov);
        // this._visibleorder = global.order;
        this._visibleorder = _hips_FoVHelper_js__WEBPACK_IMPORTED_MODULE_4__.fovHelper.getHiPSNorder(fov);
    }
    enableShader(in_mMatrix, pMatrix) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        gl.useProgram(this._shaderProgram);
        // TODO move locations retrieval elsewhere
        // Uniform locations
        const uMV = gl.getUniformLocation(this._shaderProgram, 'uMVMatrix');
        const uP = gl.getUniformLocation(this._shaderProgram, 'uPMatrix');
        const uColor = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl.getUniformLocation(this._shaderProgram, 'u_fragcolor');
        // Attribute locations
        this._attribLocations.position = gl.getAttribLocation(this._shaderProgram, 'aCatPosition');
        let mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.create();
        mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.multiply(mvMatrix, _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].camera.getCameraMatrix(), in_mMatrix);
        if (uMV)
            gl.uniformMatrix4fv(uMV, false, mvMatrix);
        if (uP)
            gl.uniformMatrix4fv(uP, false, pMatrix);
        if (uColor) {
            const rgb = (0,_utils_Utils_js__WEBPACK_IMPORTED_MODULE_14__.colorHex2RGB)(this.defaultColor);
            gl.uniform4f(uColor, rgb[0], rgb[1], rgb[2], 1.0);
        }
    }
    isVisible() {
        return this.showGrid;
    }
    toggleShowGrid() {
        this.showGrid = !this.showGrid;
    }
    draw() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        const mMatrix = this.getModelMatrix();
        this.refresh();
        if (!this.showGrid) {
            // gridTextHelper.resetDivSets();
            this.gridText.resetDivSets();
            return;
        }
        const visibleTiles = _hips_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_12__.visibleTilesManager.visibleTilesByOrder;
        const pixels = visibleTiles.pixels;
        const order = visibleTiles.order;
        this.initBuffers(pixels, order);
        const pMatrix = _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_13__["default"].pMatrix;
        this.enableShader(mMatrix, pMatrix);
        // Upload positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexCataloguePositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._vertexCataloguePosition, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this._attribLocations.position, HealpixGridSingleton.ELEM_SIZE, gl.FLOAT, false, HealpixGridSingleton.BYTES_X_ELEM * HealpixGridSingleton.ELEM_SIZE, 0);
        gl.enableVertexAttribArray(this._attribLocations.position);
        // Index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indexes, gl.STATIC_DRAW);
        gl.drawElements(gl.LINE_LOOP, this._vertexCataloguePosition.length / 3 + this._nPrimitiveFlags, gl.UNSIGNED_INT, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        // Project and label pixel centers that are inside current FoV
        let mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.create();
        mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.multiply(mvMatrix, _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].camera.getCameraMatrix(), mMatrix);
        let mvpMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.create();
        mvpMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.multiply(mvpMatrix, pMatrix, mvMatrix);
        // FIX: pass model & pMatrix to match FoVUtils TS signature
        const center = _utils_FoVUtils_js__WEBPACK_IMPORTED_MODULE_5__["default"].getCenterJ2000(gl.canvas);
        const fovMin = (this.getMinFoV() * Math.PI) / 180 / 2;
        for (let p = 0; p < pixels.length; p++) {
            const pixCenter = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(this._visibleorder).pix2vec(pixels[p]);
            // const pixCenter = (global.getHealpix(global.order).pix2vec(pixels[p]) as BoundVec);
            const point = new _Point_js__WEBPACK_IMPORTED_MODULE_8__["default"]({ x: pixCenter.x, y: pixCenter.y, z: pixCenter.z }, _utils_CoordsType_js__WEBPACK_IMPORTED_MODULE_7__["default"].CARTESIAN);
            const distance = _utils_GeomUtils_js__WEBPACK_IMPORTED_MODULE_10__["default"].orthodromicDistance(center, point);
            if (distance < fovMin) {
                const vertex = [pixCenter.x, pixCenter.y, pixCenter.z, 1];
                const clipspace = gl_matrix__WEBPACK_IMPORTED_MODULE_3__.create();
                gl_matrix__WEBPACK_IMPORTED_MODULE_3__.transformMat4(clipspace, vertex, mvpMatrix);
                // NDC divide
                clipspace[0] /= clipspace[3];
                clipspace[1] /= clipspace[3];
                // clip → pixels
                const pixelX = (clipspace[0] * 0.5 + 0.5) * gl.canvas.width;
                const pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;
                this.gridText.addHPXDivSet(this._visibleorder + '/' + pixels[p], pixelX, pixelY);
                // gridTextHelper.addHPXDivSet(this._visibleorder + '/' + pixels[p], pixelX, pixelY);
            }
        }
        // gridTextHelper.resetDivSets();
        this.gridText.resetDivSets();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    get visibleorder() {
        return this._visibleorder;
    }
}
const healpixGridSingleton = new HealpixGridSingleton();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (healpixGridSingleton);
//# sourceMappingURL=HealpixGridSingleton.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/AllSky.js":
/*!****************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/AllSky.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AllSky)
/* harmony export */ });
/* harmony import */ var _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shader/HiPSShaderProgram.js */ "../astro-viewer/lib-esm/shader/HiPSShaderProgram.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TileBuffer.js */ "../astro-viewer/lib-esm/model/hips/TileBuffer.js");




class AllSky {
    _ready = false;
    _hips;
    _format;
    _baseurl;
    _isGalacticHips;
    _order = 3;
    opacity = 1.0;
    _hipsShaderIndex = 0;
    _texture = null;
    _image;
    _texurl;
    _textureLoaded = false;
    _maxTiles = 0;
    _numFacesXTile = 0;
    _numFaces = 0;
    vertexPosition;
    vertexPositionBuffer;
    vertexIndexBuffer;
    vidx = 0;
    constructor(hips) {
        this._hips = hips;
        this._format = hips.format;
        this._baseurl = hips.baseURL;
        this._isGalacticHips = hips.isGalacticHips;
        this.initImage();
    }
    initImage() {
        this._image = new Image();
        this._texurl = `${this._baseurl}/Norder3/Allsky.${this._format}`;
        this._image.onload = () => this.imageLoaded();
        this._image.onerror = () => {
            console.error('File not found? %s', this._texurl);
        };
        this._image.setAttribute('crossorigin', 'anonymous');
        this._image.src = this._texurl;
    }
    imageLoaded() {
        this.textureLoaded();
        this.initModelBuffer();
        this._textureLoaded = true;
        this._ready = true;
    }
    textureLoaded() {
        _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.enableProgram();
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        this._texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        // gl.uniform1i(hipsShaderProgram.shaderProgram.samplerUniform, this._hipsShaderIndex)
        if (!gl.isTexture(this._texture)) {
            console.log('error in texture');
        }
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const useMipmaps = true;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, useMipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
        // MAG filter: ONLY NEAREST or LINEAR are valid
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        // gl.generateMipmap(gl.TEXTURE_2D)
        if (useMipmaps)
            gl.generateMipmap(gl.TEXTURE_2D);
    }
    initModelBuffer() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        const hpx = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(this._order);
        this._maxTiles = hpx.getNPix();
        const orderjump = 1;
        const tgtHpxOrder = this._order + orderjump;
        const healpix = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(this._order);
        const tgtHealpix = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].getHealpix(tgtHpxOrder);
        this._numFacesXTile = 4 ** orderjump; // used in gl.draw
        this._numFaces = this._numFacesXTile * this._maxTiles;
        this.vertexPosition = new Float32Array(20 * this._numFaces);
        let sindex = 0;
        let tindex = 0;
        this.vidx = 0;
        for (let t = 0; t < this._maxTiles; t++) {
            const xyf = healpix.nest2xyf(t);
            const dxmin = xyf.ix << orderjump;
            const dxmax = (xyf.ix << orderjump) + (1 << orderjump);
            const dymin = xyf.iy << orderjump;
            const dymax = (xyf.iy << orderjump) + (1 << orderjump);
            this.setupPositionAndTexture4Quadrant(sindex, tindex, dxmin, dxmin + (dxmax - dxmin) / 2, dymin, dymin + (dymax - dymin) / 2, tgtHealpix, xyf, 0, 0);
            this.setupPositionAndTexture4Quadrant(sindex, tindex, dxmin + (dxmax - dxmin) / 2, dxmax, dymin, dymin + (dymax - dymin) / 2, tgtHealpix, xyf, 0, 1);
            this.setupPositionAndTexture4Quadrant(sindex, tindex, dxmin, dxmin + (dxmax - dxmin) / 2, dymin + (dymax - dymin) / 2, dymax, tgtHealpix, xyf, 1, 0);
            this.setupPositionAndTexture4Quadrant(sindex, tindex, dxmin + (dxmax - dxmin) / 2, dxmax, dymin + (dymax - dymin) / 2, dymax, tgtHealpix, xyf, 1, 1);
            sindex++;
            if (sindex === 27) {
                tindex++;
                sindex = 0;
            }
        }
        const vertexIndices = new Uint16Array(6 * this._numFaces);
        let baseFaceIndex = 0;
        for (let i = 0; i < this._numFaces; i++) {
            vertexIndices[6 * i] = baseFaceIndex;
            vertexIndices[6 * i + 1] = baseFaceIndex + 1;
            vertexIndices[6 * i + 2] = baseFaceIndex + 3;
            vertexIndices[6 * i + 3] = baseFaceIndex + 1;
            vertexIndices[6 * i + 4] = baseFaceIndex + 2;
            vertexIndices[6 * i + 5] = baseFaceIndex + 3;
            baseFaceIndex += 4;
        }
        this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexPosition, gl.STATIC_DRAW);
        this.vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);
    }
    setupPositionAndTexture4Quadrant(sindex, tindex, dxmin, dxmax, dymin, dymax, tgthealpix, xyf, qx, qy) {
        let facesVec3Array = [];
        const factor = 2 ** (tgthealpix.order - 3);
        const s_step = 1 / (27 * factor); // 0.037037037...
        const t_step = 1 / (29 * factor); // 0.034482759...
        const s_pixel_size = s_step / 64;
        const t_pixel_size = t_step / 64;
        const base_s = factor * s_step * sindex + s_step * qx;
        const base_t = factor * t_step * tindex + t_step * qy;
        for (let dx = dxmin; dx < dxmax; dx++) {
            for (let dy = dymin; dy < dymax; dy++) {
                facesVec3Array = tgthealpix.getPointsForXyfNoStep(dx, dy, xyf.face);
                // bottom right
                this.vertexPosition[20 * this.vidx] = facesVec3Array[0].x;
                this.vertexPosition[20 * this.vidx + 1] = facesVec3Array[0].y;
                this.vertexPosition[20 * this.vidx + 2] = facesVec3Array[0].z;
                this.vertexPosition[20 * this.vidx + 3] = s_step + base_s - s_pixel_size;
                this.vertexPosition[20 * this.vidx + 4] = 1 - (t_step + base_t) + t_pixel_size;
                // top right
                this.vertexPosition[20 * this.vidx + 5] = facesVec3Array[1].x;
                this.vertexPosition[20 * this.vidx + 6] = facesVec3Array[1].y;
                this.vertexPosition[20 * this.vidx + 7] = facesVec3Array[1].z;
                this.vertexPosition[20 * this.vidx + 8] = s_step + base_s - s_pixel_size;
                this.vertexPosition[20 * this.vidx + 9] = 1 - base_t - t_pixel_size;
                // top left
                this.vertexPosition[20 * this.vidx + 10] = facesVec3Array[2].x;
                this.vertexPosition[20 * this.vidx + 11] = facesVec3Array[2].y;
                this.vertexPosition[20 * this.vidx + 12] = facesVec3Array[2].z;
                this.vertexPosition[20 * this.vidx + 13] = base_s + s_pixel_size;
                this.vertexPosition[20 * this.vidx + 14] = 1 - base_t - t_pixel_size;
                // bottom left
                this.vertexPosition[20 * this.vidx + 15] = facesVec3Array[3].x;
                this.vertexPosition[20 * this.vidx + 16] = facesVec3Array[3].y;
                this.vertexPosition[20 * this.vidx + 17] = facesVec3Array[3].z;
                this.vertexPosition[20 * this.vidx + 18] = base_s + s_pixel_size;
                this.vertexPosition[20 * this.vidx + 19] = 1 - (t_step + base_t) + t_pixel_size;
                this.vidx++;
            }
        }
    }
    /**
     * Renders the all-sky layer and, when available, delegates to higher-resolution child tiles.
     * Returns `true` if it attempted to draw (ready), `false` if still not ready.
     */
    draw(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx) {
        if (!this._ready)
            return false;
        let allSkyTiles2Skip = [];
        if (visibleOrder >= this._order) {
            const skipped = this.drawChildren(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx);
            if (skipped)
                allSkyTiles2Skip = skipped;
        }
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.enableShaders(pMatrix, vMatrix, mMatrix, colorMapIdx);
        gl.enableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.locations.vertexPositionAttribute);
        gl.enableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.locations.textureCoordAttribute);
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.uniform1f(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.locations.textureAlpha, this.opacity);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.vertexAttribPointer(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.locations.vertexPositionAttribute, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.vertexAttribPointer(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.locations.textureCoordAttribute, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
        for (let t = 0; t < this._maxTiles; t++) {
            if (!allSkyTiles2Skip.includes(t)) {
                gl.drawElements(gl.TRIANGLES, 6 * this._numFacesXTile, gl.UNSIGNED_SHORT, 12 * t * this._numFacesXTile);
            }
        }
        gl.disableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.locations.vertexPositionAttribute);
        gl.disableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_0__.hipsShaderProgram.locations.textureCoordAttribute);
        return true;
    }
    drawChildren(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx) {
        const childrenOrder = this._order;
        if (!visibleTilesMap.has(childrenOrder))
            return;
        const visibleTiles = visibleTilesMap.get(childrenOrder);
        const allSkyTiles2Skip = [];
        for (let i = 0; i < visibleTiles.length; i++) {
            const tileno = visibleTiles[i];
            const childTile = this._isGalacticHips
                ? _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.getGalTile(tileno, childrenOrder, this._hips)
                : _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.getTile(tileno, childrenOrder, this._hips);
            childTile.draw(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx);
            if (childTile.getReadyState()) {
                allSkyTiles2Skip.push(tileno);
            }
        }
        return allSkyTiles2Skip;
    }
}
//# sourceMappingURL=AllSky.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/AncestorTile.js":
/*!**********************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/AncestorTile.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shader/HiPSShaderProgram.js */ "../astro-viewer/lib-esm/shader/HiPSShaderProgram.js");
/* harmony import */ var _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TileBuffer.js */ "../astro-viewer/lib-esm/model/hips/TileBuffer.js");
/* harmony import */ var _FoVHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FoVHelper.js */ "../astro-viewer/lib-esm/model/hips/FoVHelper.js");





class AncestorTile {
    _hips;
    _tileno;
    _baseurl;
    _order;
    _ready = false;
    _format;
    _isGalacticHips;
    opacity = 1.0;
    _hipsShaderIndex = 0;
    _pixels = [];
    _texture = null;
    _image;
    _texurl = '';
    vertexPosition;
    vertexPositionBuffer;
    vertexIndices;
    vertexIndexBuffer;
    constructor(tileno, order, hips) {
        this._hips = hips;
        this._tileno = tileno;
        this._format = hips.format;
        this._baseurl = hips.baseURL;
        this._isGalacticHips = hips.isGalacticHips;
        this._order = order;
        this.initImage();
    }
    // Kept for API parity; there is no interval created in this class.
    destroyIntervals() {
        // no-op
    }
    initImage() {
        const dirnumber = Math.floor(this._tileno / 10000) * 10000;
        this._texurl = `${this._baseurl}/Norder${this._order}/Dir${dirnumber}/Npix${this._tileno}.${this._format}`;
        this._image = new Image();
        this._image.onload = () => this.imageLoaded();
        this._image.onerror = () => {
            console.error('File not found? %s', this._texurl);
        };
        this._image.crossOrigin = 'anonymous';
        // If you ever need FITS handling, call this.loadImage() instead.
        this._image.src = this._texurl;
    }
    imageLoaded() {
        this.textureLoaded();
        this.initModelBuffer();
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
        this._ready = true;
    }
    textureLoaded() {
        _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.enableProgram();
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this._texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.uniform1i(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.shaderProgram.samplerUniform, this._hipsShaderIndex);
        if (!gl.isTexture(this._texture)) {
            console.log('error in texture');
        }
    }
    initModelBuffer() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this.vertexPosition = [];
        this.vertexPositionBuffer = [];
        this.vertexIndices = new Uint16Array();
        // this.vertexIndexBuffer created later
        const reforder = _FoVHelper_js__WEBPACK_IMPORTED_MODULE_3__.fovHelper.getRefOrder(this._order);
        const orighealpix = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].getHealpix(this._order);
        const origxyf = orighealpix.nest2xyf(this._tileno);
        const orderjump = reforder - this._order;
        const dxmin = origxyf.ix << orderjump;
        const dxmax = (origxyf.ix << orderjump) + (1 << orderjump);
        const dymin = origxyf.iy << orderjump;
        const dymax = (origxyf.iy << orderjump) + (1 << orderjump);
        const healpix = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].getHealpix(reforder);
        this._pixels = [];
        // Using getBoundaries (like the JS source)
        this.setupPositionAndTexture4Quadrant(dxmin, dxmax / 2, dymin, dymax / 2, 0, healpix, orderjump, origxyf);
        this.setupPositionAndTexture4Quadrant(dxmax / 2, dxmax, dymin, dymax / 2, 1, healpix, orderjump, origxyf);
        this.setupPositionAndTexture4Quadrant(dxmin, dxmax / 2, dymax / 2, dymax, 2, healpix, orderjump, origxyf);
        this.setupPositionAndTexture4Quadrant(dxmax / 2, dxmax, dymax / 2, dymax, 3, healpix, orderjump, origxyf);
        const pixelsXQuadrant = this.vertexPosition[0].length / 20;
        this.vertexIndices = this.computeVertexIndices(pixelsXQuadrant);
        this.vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, gl.STATIC_DRAW);
    }
    computeVertexIndices(pixelsXQuadrant) {
        const vertexIndices = new Uint16Array(6 * pixelsXQuadrant);
        let baseFaceIndex = 0;
        for (let j = 0; j < pixelsXQuadrant; j++) {
            vertexIndices[6 * j] = baseFaceIndex;
            vertexIndices[6 * j + 1] = baseFaceIndex + 1;
            vertexIndices[6 * j + 2] = baseFaceIndex + 2;
            vertexIndices[6 * j + 3] = baseFaceIndex + 2;
            vertexIndices[6 * j + 4] = baseFaceIndex + 3;
            vertexIndices[6 * j + 5] = baseFaceIndex;
            baseFaceIndex += 4;
        }
        return vertexIndices;
    }
    // Version that uses getPointsForXyfNoStep (kept for reference; not used in this class)
    setupPositionAndTexture4Quadrant2(dxmin, dxmax, dymin, dymax, qidx, healpix, orderjump, origxyf) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this.vertexPosition[qidx] = new Float32Array(20 * (dxmax - dxmin) * (dymax - dymin));
        const step = 1 / (1 << orderjump);
        let p = 0;
        for (let dx = dxmin; dx < dxmax; dx++) {
            for (let dy = dymin; dy < dymax; dy++) {
                const facesVec3Array = healpix.getPointsForXyfNoStep(dx, dy, origxyf.face);
                const uindex = dy - (origxyf.iy << orderjump);
                const vindex = dx - (origxyf.ix << orderjump);
                this.vertexPosition[qidx][20 * p] = facesVec3Array[0].x;
                this.vertexPosition[qidx][20 * p + 1] = facesVec3Array[0].y;
                this.vertexPosition[qidx][20 * p + 2] = facesVec3Array[0].z;
                this.vertexPosition[qidx][20 * p + 3] = step + step * uindex;
                this.vertexPosition[qidx][20 * p + 4] = 1 - (step + step * vindex);
                this.vertexPosition[qidx][20 * p + 5] = facesVec3Array[1].x;
                this.vertexPosition[qidx][20 * p + 6] = facesVec3Array[1].y;
                this.vertexPosition[qidx][20 * p + 7] = facesVec3Array[1].z;
                this.vertexPosition[qidx][20 * p + 8] = step + step * uindex;
                this.vertexPosition[qidx][20 * p + 9] = 1 - step * vindex;
                this.vertexPosition[qidx][20 * p + 10] = facesVec3Array[2].x;
                this.vertexPosition[qidx][20 * p + 11] = facesVec3Array[2].y;
                this.vertexPosition[qidx][20 * p + 12] = facesVec3Array[2].z;
                this.vertexPosition[qidx][20 * p + 13] = step * uindex;
                this.vertexPosition[qidx][20 * p + 14] = 1 - step * vindex;
                this.vertexPosition[qidx][20 * p + 15] = facesVec3Array[3].x;
                this.vertexPosition[qidx][20 * p + 16] = facesVec3Array[3].y;
                this.vertexPosition[qidx][20 * p + 17] = facesVec3Array[3].z;
                this.vertexPosition[qidx][20 * p + 18] = step * uindex;
                this.vertexPosition[qidx][20 * p + 19] = 1 - (step + step * vindex);
                p++;
            }
        }
        this.vertexPositionBuffer[qidx] = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.createBuffer();
        _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.bindBuffer(_Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.ARRAY_BUFFER, this.vertexPositionBuffer[qidx]);
        _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.bufferData(_Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.ARRAY_BUFFER, this.vertexPosition[qidx], _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.STATIC_DRAW);
    }
    // Version used by the original JS, collecting _pixels via xyf2nest + getBoundaries
    setupPositionAndTexture4Quadrant(dxmin, dxmax, dymin, dymax, qidx, healpix, orderjump, origxyf) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this.vertexPosition[qidx] = new Float32Array(20 * (dxmax - dxmin) * (dymax - dymin));
        const step = 1 / (1 << orderjump);
        let p = 0;
        for (let dx = dxmin; dx < dxmax; dx++) {
            for (let dy = dymin; dy < dymax; dy++) {
                const ipix3 = healpix.xyf2nest(dx, dy, origxyf.face);
                this._pixels.push(ipix3);
                const facesVec3Array = healpix.getBoundaries(ipix3);
                const uindex = dy - (origxyf.iy << orderjump);
                const vindex = dx - (origxyf.ix << orderjump);
                this.vertexPosition[qidx][20 * p] = facesVec3Array[0].x;
                this.vertexPosition[qidx][20 * p + 1] = facesVec3Array[0].y;
                this.vertexPosition[qidx][20 * p + 2] = facesVec3Array[0].z;
                this.vertexPosition[qidx][20 * p + 3] = step + step * uindex;
                this.vertexPosition[qidx][20 * p + 4] = 1 - (step + step * vindex);
                this.vertexPosition[qidx][20 * p + 5] = facesVec3Array[1].x;
                this.vertexPosition[qidx][20 * p + 6] = facesVec3Array[1].y;
                this.vertexPosition[qidx][20 * p + 7] = facesVec3Array[1].z;
                this.vertexPosition[qidx][20 * p + 8] = step + step * uindex;
                this.vertexPosition[qidx][20 * p + 9] = 1 - step * vindex;
                this.vertexPosition[qidx][20 * p + 10] = facesVec3Array[2].x;
                this.vertexPosition[qidx][20 * p + 11] = facesVec3Array[2].y;
                this.vertexPosition[qidx][20 * p + 12] = facesVec3Array[2].z;
                this.vertexPosition[qidx][20 * p + 13] = step * uindex;
                this.vertexPosition[qidx][20 * p + 14] = 1 - step * vindex;
                this.vertexPosition[qidx][20 * p + 15] = facesVec3Array[3].x;
                this.vertexPosition[qidx][20 * p + 16] = facesVec3Array[3].y;
                this.vertexPosition[qidx][20 * p + 17] = facesVec3Array[3].z;
                this.vertexPosition[qidx][20 * p + 18] = step * uindex;
                this.vertexPosition[qidx][20 * p + 19] = 1 - (step + step * vindex);
                p++;
            }
        }
        this.vertexPositionBuffer[qidx] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer[qidx]);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexPosition[qidx], gl.STATIC_DRAW);
    }
    draw(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx) {
        if (!this._ready)
            return false;
        let quadrantsToDraw = new Set([0, 1, 2, 3]);
        if (visibleOrder > this._order) {
            const q = this.drawChildren(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx);
            if (q)
                quadrantsToDraw = q;
        }
        _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.enableShaders(pMatrix, vMatrix, mMatrix, colorMapIdx);
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        gl.enableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.vertexPositionAttribute);
        gl.enableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureCoordAttribute);
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.uniform1f(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureAlpha, this.opacity);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        const elemno = this.vertexIndices.length;
        quadrantsToDraw.forEach((qidx) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer[qidx]);
            gl.vertexAttribPointer(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.vertexPositionAttribute, 3, gl.FLOAT, false, 5 * 4, 0);
            gl.vertexAttribPointer(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureCoordAttribute, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
            gl.drawElements(gl.TRIANGLES, elemno, gl.UNSIGNED_SHORT, 0);
        });
        gl.disableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.vertexPositionAttribute);
        gl.disableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureCoordAttribute);
        return true;
    }
    drawChildren(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx) {
        const quadrantsToDraw = new Set([0, 1, 2, 3]);
        const childrenOrder = this._order + 1;
        if (!visibleTilesMap.has(childrenOrder))
            return;
        for (let c = 0; c < 4; c++) {
            const childTileNo = (this._tileno << 2) + c;
            const visibleChildren = visibleTilesMap.get(childrenOrder);
            if (visibleChildren.includes(childTileNo)) {
                const childTile = this._isGalacticHips
                    ? _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.getGalTile(childTileNo, childrenOrder, this._hips)
                    : _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.getTile(childTileNo, childrenOrder, this._hips);
                childTile.draw(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx);
                if (childTile._ready) {
                    quadrantsToDraw.delete(childTile._tileno - (this._tileno << 2));
                }
            }
        }
        return quadrantsToDraw;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AncestorTile);
//# sourceMappingURL=AncestorTile.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/ColorMap.js":
/*!******************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/ColorMap.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   colorMap: () => (/* binding */ colorMap)
/* harmony export */ });
/**
 * @author Fabrizio Giordano (Fab77)
 * Enum for coordinate types.
 * @readonly
 * @enum {{name: string, hex: string}}
 */
class ColorMap {
    PLANCK = {
        // "r": new Float32Array([0.00000,0.769231,1.53846,2.30769,3.07692,3.84615,4.61538,5.38462,6.15385,6.92308,7.69231,8.46154,9.23077,10.0000,11.5385,13.0769,14.6154,16.1538,17.6923,19.2308,20.7692,22.3077,23.8462,25.3846,26.9231,28.4615,30.0000,33.8462,37.6923,41.5385,45.3846,49.2308,53.0769,56.9231,60.7692,64.6154,68.4615,72.3077,76.1538,80.0000,88.5385,97.0769,105.615,114.154,122.692,131.231,139.769,148.308,156.846,165.385,173.923,182.462,191.000,193.846,196.692,199.538,202.385,205.231,208.077,210.923,213.769,216.615,219.462,222.308,225.154,228.000,229.182,230.364,231.545,232.727,233.909,235.091,236.273,237.455,238.636,239.818,241.000,241.000,241.364,241.727,242.091,242.455,242.818,243.182,243.545,243.909,244.273,244.636,245.000,245.231,245.462,245.692,245.923,246.154,246.385,246.615,246.846,247.077,247.308,247.538,247.769,248.000,248.146,248.292,248.438,248.585,248.731,248.877,249.023,249.169,249.315,249.462,249.608,249.754,249.900,249.312,248.723,248.135,247.546,246.958,246.369,245.781,245.192,244.604,244.015,243.427,242.838,242.250,239.308,236.365,233.423,230.481,227.538,224.596,221.654,218.712,215.769,212.827,209.885,206.942,204.000,201.000,198.000,195.000,192.000,189.000,186.000,183.000,180.000,177.000,174.000,171.000,168.000,165.000,161.077,157.154,153.231,149.308,145.385,141.462,137.538,133.615,129.692,125.769,121.846,117.923,114.000,115.038,116.077,117.115,118.154,119.192,120.231,121.269,122.308,123.346,124.385,125.423,126.462,127.500,131.423,135.346,139.269,143.192,147.115,151.038,154.962,158.885,162.808,166.731,170.654,174.577,178.500,180.462,182.423,184.385,186.346,188.308,190.269,192.231,194.192,196.154,198.115,200.077,202.038,204.000,205.962,207.923,209.885,211.846,213.808,215.769,217.731,219.692,221.654,223.615,225.577,227.538,229.500,230.481,231.462,232.442,233.423,234.404,235.385,236.365,237.346,238.327,239.308,240.288,241.269,242.250,242.642,243.035,243.427,243.819,244.212,244.604,244.996,245.388,245.781,246.173,246.565,246.958,247.350,247.814,248.277,248.741,249.205,249.668,250.132,250.595,251.059,251.523,251.986,252.450]),
        // "g": new Float32Array([0.00000,1.53846,3.07692,4.61538,6.15385,7.69231,9.23077,10.7692,12.3077,13.8462,15.3846,16.9231,18.4615,20.0000,32.6154,45.2308,57.8462,70.4615,83.0769,95.6923,108.308,120.923,133.538,146.154,158.769,171.385,184.000,187.923,191.846,195.769,199.692,203.615,207.538,211.462,215.385,219.308,223.231,227.154,231.077,235.000,235.308,235.615,235.923,236.231,236.538,236.846,237.154,237.462,237.769,238.077,238.385,238.692,239.000,239.077,239.154,239.231,239.308,239.385,239.462,239.538,239.615,239.692,239.769,239.846,239.923,240.000,240.091,240.182,240.273,240.364,240.455,240.545,240.636,240.727,240.818,240.909,241.000,241.000,240.909,240.818,240.727,240.636,240.545,240.455,240.364,240.273,240.182,240.091,240.000,239.615,239.231,238.846,238.462,238.077,237.692,237.308,236.923,236.538,236.154,235.769,235.385,235.000,232.615,230.231,227.846,225.462,223.077,220.692,218.308,215.923,213.538,211.154,208.769,206.385,204.000,200.077,196.154,192.231,188.308,184.385,180.462,176.538,172.615,168.692,164.769,160.846,156.923,153.000,147.115,141.231,135.346,129.462,123.577,117.692,111.808,105.923,100.038,94.1538,88.2692,82.3846,76.5000,73.0769,69.6538,66.2308,62.8077,59.3846,55.9615,52.5385,49.1154,45.6923,42.2692,38.8462,35.4231,32.0000,29.5385,27.0769,24.6154,22.1538,19.6923,17.2308,14.7692,12.3077,9.84615,7.38462,4.92308,2.46154,0.00000,9.80769,19.6154,29.4231,39.2308,49.0385,58.8462,68.6538,78.4615,88.2692,98.0769,107.885,117.692,127.500,131.423,135.346,139.269,143.192,147.115,151.038,154.962,158.885,162.808,166.731,170.654,174.577,178.500,180.462,182.423,184.385,186.346,188.308,190.269,192.231,194.192,196.154,198.115,200.077,202.038,204.000,205.962,207.923,209.885,211.846,213.808,215.769,217.731,219.692,221.654,223.615,225.577,227.538,229.500,230.481,231.462,232.442,233.423,234.404,235.385,236.365,237.346,238.327,239.308,240.288,241.269,242.250,242.642,243.035,243.427,243.819,244.212,244.604,244.996,245.388,245.781,246.173,246.565,246.958,247.350,247.814,248.277,248.741,249.205,249.668,250.132,250.595,251.059,251.523,251.986,252.450]),
        // "b": new Float32Array([255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,255.000,254.615,254.231,253.846,253.462,253.077,252.692,252.308,251.923,251.538,251.154,250.769,250.385,250.000,249.615,249.231,248.846,248.462,248.077,247.692,247.308,246.923,246.538,246.154,245.769,245.385,245.000,242.000,239.000,236.000,233.000,230.000,227.000,224.000,221.000,218.000,215.000,212.000,212.000,208.636,205.273,201.909,198.545,195.182,191.818,188.455,185.091,181.727,178.364,175.000,171.538,168.077,164.615,161.154,157.692,154.231,150.769,147.308,143.846,140.385,136.923,133.462,130.000,122.942,115.885,108.827,101.769,94.7115,87.6539,80.5962,73.5385,66.4808,59.4231,52.3654,45.3077,38.2500,36.2885,34.3269,32.3654,30.4038,28.4423,26.4808,24.5192,22.5577,20.5962,18.6346,16.6731,14.7115,12.7500,11.7692,10.7885,9.80769,8.82692,7.84615,6.86539,5.88461,4.90385,3.92308,2.94231,1.96154,0.980769,0.00000,2.46154,4.92308,7.38462,9.84616,12.3077,14.7692,17.2308,19.6923,22.1538,24.6154,27.0769,29.5385,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,32.0000,41.3077,50.6154,59.9231,69.2308,78.5385,87.8462,97.1539,106.462,115.769,125.077,134.385,143.692,153.000,156.923,160.846,164.769,168.692,172.615,176.538,180.462,184.385,188.308,192.231,196.154,200.077,204.000,205.962,207.923,209.885,211.846,213.808,215.769,217.731,219.692,221.654,223.615,225.577,227.538,229.500,230.481,231.462,232.442,233.423,234.404,235.385,236.365,237.346,238.327,239.308,240.288,241.269,242.250,242.838,243.427,244.015,244.604,245.192,245.781,246.369,246.958,247.546,248.135,248.723,249.312,249.900,250.096,250.292,250.488,250.685,250.881,251.077,251.273,251.469,251.665,251.862,252.058,252.254,252.450,252.682,252.914,253.145,253.377,253.609,253.841,254.073,254.305,254.536,254.768,255.000])
        r: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.769231, 0.0, 0.0, 0.0, 1.53846, 0.0, 0.0, 0.0, 2.30769, 0.0, 0.0, 0.0,
            3.07692, 0.0, 0.0, 0.0, 3.84615, 0.0, 0.0, 0.0, 4.61538, 0.0, 0.0, 0.0, 5.38462, 0.0, 0.0,
            0.0, 6.15385, 0.0, 0.0, 0.0, 6.92308, 0.0, 0.0, 0.0, 7.69231, 0.0, 0.0, 0.0, 8.46154, 0.0,
            0.0, 0.0, 9.23077, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 11.5385, 0.0, 0.0, 0.0, 13.0769, 0.0,
            0.0, 0.0, 14.6154, 0.0, 0.0, 0.0, 16.1538, 0.0, 0.0, 0.0, 17.6923, 0.0, 0.0, 0.0, 19.2308,
            0.0, 0.0, 0.0, 20.7692, 0.0, 0.0, 0.0, 22.3077, 0.0, 0.0, 0.0, 23.8462, 0.0, 0.0, 0.0,
            25.3846, 0.0, 0.0, 0.0, 26.9231, 0.0, 0.0, 0.0, 28.4615, 0.0, 0.0, 0.0, 30.0, 0.0, 0.0, 0.0,
            33.8462, 0.0, 0.0, 0.0, 37.6923, 0.0, 0.0, 0.0, 41.5385, 0.0, 0.0, 0.0, 45.3846, 0.0, 0.0,
            0.0, 49.2308, 0.0, 0.0, 0.0, 53.0769, 0.0, 0.0, 0.0, 56.9231, 0.0, 0.0, 0.0, 60.7692, 0.0,
            0.0, 0.0, 64.6154, 0.0, 0.0, 0.0, 68.4615, 0.0, 0.0, 0.0, 72.3077, 0.0, 0.0, 0.0, 76.1538,
            0.0, 0.0, 0.0, 80.0, 0.0, 0.0, 0.0, 88.5385, 0.0, 0.0, 0.0, 97.0769, 0.0, 0.0, 0.0, 105.615,
            0.0, 0.0, 0.0, 114.154, 0.0, 0.0, 0.0, 122.692, 0.0, 0.0, 0.0, 131.231, 0.0, 0.0, 0.0,
            139.769, 0.0, 0.0, 0.0, 148.308, 0.0, 0.0, 0.0, 156.846, 0.0, 0.0, 0.0, 165.385, 0.0, 0.0,
            0.0, 173.923, 0.0, 0.0, 0.0, 182.462, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 193.846, 0.0, 0.0,
            0.0, 196.692, 0.0, 0.0, 0.0, 199.538, 0.0, 0.0, 0.0, 202.385, 0.0, 0.0, 0.0, 205.231, 0.0,
            0.0, 0.0, 208.077, 0.0, 0.0, 0.0, 210.923, 0.0, 0.0, 0.0, 213.769, 0.0, 0.0, 0.0, 216.615,
            0.0, 0.0, 0.0, 219.462, 0.0, 0.0, 0.0, 222.308, 0.0, 0.0, 0.0, 225.154, 0.0, 0.0, 0.0, 228.0,
            0.0, 0.0, 0.0, 229.182, 0.0, 0.0, 0.0, 230.364, 0.0, 0.0, 0.0, 231.545, 0.0, 0.0, 0.0,
            232.727, 0.0, 0.0, 0.0, 233.909, 0.0, 0.0, 0.0, 235.091, 0.0, 0.0, 0.0, 236.273, 0.0, 0.0,
            0.0, 237.455, 0.0, 0.0, 0.0, 238.636, 0.0, 0.0, 0.0, 239.818, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0,
            0.0, 241.0, 0.0, 0.0, 0.0, 241.364, 0.0, 0.0, 0.0, 241.727, 0.0, 0.0, 0.0, 242.091, 0.0, 0.0,
            0.0, 242.455, 0.0, 0.0, 0.0, 242.818, 0.0, 0.0, 0.0, 243.182, 0.0, 0.0, 0.0, 243.545, 0.0,
            0.0, 0.0, 243.909, 0.0, 0.0, 0.0, 244.273, 0.0, 0.0, 0.0, 244.636, 0.0, 0.0, 0.0, 245.0, 0.0,
            0.0, 0.0, 245.231, 0.0, 0.0, 0.0, 245.462, 0.0, 0.0, 0.0, 245.692, 0.0, 0.0, 0.0, 245.923,
            0.0, 0.0, 0.0, 246.154, 0.0, 0.0, 0.0, 246.385, 0.0, 0.0, 0.0, 246.615, 0.0, 0.0, 0.0,
            246.846, 0.0, 0.0, 0.0, 247.077, 0.0, 0.0, 0.0, 247.308, 0.0, 0.0, 0.0, 247.538, 0.0, 0.0,
            0.0, 247.769, 0.0, 0.0, 0.0, 248.0, 0.0, 0.0, 0.0, 248.146, 0.0, 0.0, 0.0, 248.292, 0.0, 0.0,
            0.0, 248.438, 0.0, 0.0, 0.0, 248.585, 0.0, 0.0, 0.0, 248.731, 0.0, 0.0, 0.0, 248.877, 0.0,
            0.0, 0.0, 249.023, 0.0, 0.0, 0.0, 249.169, 0.0, 0.0, 0.0, 249.315, 0.0, 0.0, 0.0, 249.462,
            0.0, 0.0, 0.0, 249.608, 0.0, 0.0, 0.0, 249.754, 0.0, 0.0, 0.0, 249.9, 0.0, 0.0, 0.0, 249.312,
            0.0, 0.0, 0.0, 248.723, 0.0, 0.0, 0.0, 248.135, 0.0, 0.0, 0.0, 247.546, 0.0, 0.0, 0.0,
            246.958, 0.0, 0.0, 0.0, 246.369, 0.0, 0.0, 0.0, 245.781, 0.0, 0.0, 0.0, 245.192, 0.0, 0.0,
            0.0, 244.604, 0.0, 0.0, 0.0, 244.015, 0.0, 0.0, 0.0, 243.427, 0.0, 0.0, 0.0, 242.838, 0.0,
            0.0, 0.0, 242.25, 0.0, 0.0, 0.0, 239.308, 0.0, 0.0, 0.0, 236.365, 0.0, 0.0, 0.0, 233.423, 0.0,
            0.0, 0.0, 230.481, 0.0, 0.0, 0.0, 227.538, 0.0, 0.0, 0.0, 224.596, 0.0, 0.0, 0.0, 221.654,
            0.0, 0.0, 0.0, 218.712, 0.0, 0.0, 0.0, 215.769, 0.0, 0.0, 0.0, 212.827, 0.0, 0.0, 0.0,
            209.885, 0.0, 0.0, 0.0, 206.942, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 201.0, 0.0, 0.0, 0.0,
            198.0, 0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 192.0, 0.0, 0.0, 0.0, 189.0, 0.0, 0.0, 0.0, 186.0,
            0.0, 0.0, 0.0, 183.0, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0, 0.0, 177.0, 0.0, 0.0, 0.0, 174.0, 0.0,
            0.0, 0.0, 171.0, 0.0, 0.0, 0.0, 168.0, 0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 161.077, 0.0, 0.0,
            0.0, 157.154, 0.0, 0.0, 0.0, 153.231, 0.0, 0.0, 0.0, 149.308, 0.0, 0.0, 0.0, 145.385, 0.0,
            0.0, 0.0, 141.462, 0.0, 0.0, 0.0, 137.538, 0.0, 0.0, 0.0, 133.615, 0.0, 0.0, 0.0, 129.692,
            0.0, 0.0, 0.0, 125.769, 0.0, 0.0, 0.0, 121.846, 0.0, 0.0, 0.0, 117.923, 0.0, 0.0, 0.0, 114.0,
            0.0, 0.0, 0.0, 115.038, 0.0, 0.0, 0.0, 116.077, 0.0, 0.0, 0.0, 117.115, 0.0, 0.0, 0.0,
            118.154, 0.0, 0.0, 0.0, 119.192, 0.0, 0.0, 0.0, 120.231, 0.0, 0.0, 0.0, 121.269, 0.0, 0.0,
            0.0, 122.308, 0.0, 0.0, 0.0, 123.346, 0.0, 0.0, 0.0, 124.385, 0.0, 0.0, 0.0, 125.423, 0.0,
            0.0, 0.0, 126.462, 0.0, 0.0, 0.0, 127.5, 0.0, 0.0, 0.0, 131.423, 0.0, 0.0, 0.0, 135.346, 0.0,
            0.0, 0.0, 139.269, 0.0, 0.0, 0.0, 143.192, 0.0, 0.0, 0.0, 147.115, 0.0, 0.0, 0.0, 151.038,
            0.0, 0.0, 0.0, 154.962, 0.0, 0.0, 0.0, 158.885, 0.0, 0.0, 0.0, 162.808, 0.0, 0.0, 0.0,
            166.731, 0.0, 0.0, 0.0, 170.654, 0.0, 0.0, 0.0, 174.577, 0.0, 0.0, 0.0, 178.5, 0.0, 0.0, 0.0,
            180.462, 0.0, 0.0, 0.0, 182.423, 0.0, 0.0, 0.0, 184.385, 0.0, 0.0, 0.0, 186.346, 0.0, 0.0,
            0.0, 188.308, 0.0, 0.0, 0.0, 190.269, 0.0, 0.0, 0.0, 192.231, 0.0, 0.0, 0.0, 194.192, 0.0,
            0.0, 0.0, 196.154, 0.0, 0.0, 0.0, 198.115, 0.0, 0.0, 0.0, 200.077, 0.0, 0.0, 0.0, 202.038,
            0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 205.962, 0.0, 0.0, 0.0, 207.923, 0.0, 0.0, 0.0, 209.885,
            0.0, 0.0, 0.0, 211.846, 0.0, 0.0, 0.0, 213.808, 0.0, 0.0, 0.0, 215.769, 0.0, 0.0, 0.0,
            217.731, 0.0, 0.0, 0.0, 219.692, 0.0, 0.0, 0.0, 221.654, 0.0, 0.0, 0.0, 223.615, 0.0, 0.0,
            0.0, 225.577, 0.0, 0.0, 0.0, 227.538, 0.0, 0.0, 0.0, 229.5, 0.0, 0.0, 0.0, 230.481, 0.0, 0.0,
            0.0, 231.462, 0.0, 0.0, 0.0, 232.442, 0.0, 0.0, 0.0, 233.423, 0.0, 0.0, 0.0, 234.404, 0.0,
            0.0, 0.0, 235.385, 0.0, 0.0, 0.0, 236.365, 0.0, 0.0, 0.0, 237.346, 0.0, 0.0, 0.0, 238.327,
            0.0, 0.0, 0.0, 239.308, 0.0, 0.0, 0.0, 240.288, 0.0, 0.0, 0.0, 241.269, 0.0, 0.0, 0.0, 242.25,
            0.0, 0.0, 0.0, 242.642, 0.0, 0.0, 0.0, 243.035, 0.0, 0.0, 0.0, 243.427, 0.0, 0.0, 0.0,
            243.819, 0.0, 0.0, 0.0, 244.212, 0.0, 0.0, 0.0, 244.604, 0.0, 0.0, 0.0, 244.996, 0.0, 0.0,
            0.0, 245.388, 0.0, 0.0, 0.0, 245.781, 0.0, 0.0, 0.0, 246.173, 0.0, 0.0, 0.0, 246.565, 0.0,
            0.0, 0.0, 246.958, 0.0, 0.0, 0.0, 247.35, 0.0, 0.0, 0.0, 247.814, 0.0, 0.0, 0.0, 248.277, 0.0,
            0.0, 0.0, 248.741, 0.0, 0.0, 0.0, 249.205, 0.0, 0.0, 0.0, 249.668, 0.0, 0.0, 0.0, 250.132,
            0.0, 0.0, 0.0, 250.595, 0.0, 0.0, 0.0, 251.059, 0.0, 0.0, 0.0, 251.523, 0.0, 0.0, 0.0,
            251.986, 0.0, 0.0, 0.0, 252.45, 0.0, 0.0, 0.0
        ]),
        g: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 1.53846, 0.0, 0.0, 0.0, 3.07692, 0.0, 0.0, 0.0, 4.61538, 0.0, 0.0, 0.0,
            6.15385, 0.0, 0.0, 0.0, 7.69231, 0.0, 0.0, 0.0, 9.23077, 0.0, 0.0, 0.0, 10.7692, 0.0, 0.0,
            0.0, 12.3077, 0.0, 0.0, 0.0, 13.8462, 0.0, 0.0, 0.0, 15.3846, 0.0, 0.0, 0.0, 16.9231, 0.0,
            0.0, 0.0, 18.4615, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 32.6154, 0.0, 0.0, 0.0, 45.2308, 0.0,
            0.0, 0.0, 57.8462, 0.0, 0.0, 0.0, 70.4615, 0.0, 0.0, 0.0, 83.0769, 0.0, 0.0, 0.0, 95.6923,
            0.0, 0.0, 0.0, 108.308, 0.0, 0.0, 0.0, 120.923, 0.0, 0.0, 0.0, 133.538, 0.0, 0.0, 0.0,
            146.154, 0.0, 0.0, 0.0, 158.769, 0.0, 0.0, 0.0, 171.385, 0.0, 0.0, 0.0, 184.0, 0.0, 0.0, 0.0,
            187.923, 0.0, 0.0, 0.0, 191.846, 0.0, 0.0, 0.0, 195.769, 0.0, 0.0, 0.0, 199.692, 0.0, 0.0,
            0.0, 203.615, 0.0, 0.0, 0.0, 207.538, 0.0, 0.0, 0.0, 211.462, 0.0, 0.0, 0.0, 215.385, 0.0,
            0.0, 0.0, 219.308, 0.0, 0.0, 0.0, 223.231, 0.0, 0.0, 0.0, 227.154, 0.0, 0.0, 0.0, 231.077,
            0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 235.308, 0.0, 0.0, 0.0, 235.615, 0.0, 0.0, 0.0, 235.923,
            0.0, 0.0, 0.0, 236.231, 0.0, 0.0, 0.0, 236.538, 0.0, 0.0, 0.0, 236.846, 0.0, 0.0, 0.0,
            237.154, 0.0, 0.0, 0.0, 237.462, 0.0, 0.0, 0.0, 237.769, 0.0, 0.0, 0.0, 238.077, 0.0, 0.0,
            0.0, 238.385, 0.0, 0.0, 0.0, 238.692, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 239.077, 0.0, 0.0,
            0.0, 239.154, 0.0, 0.0, 0.0, 239.231, 0.0, 0.0, 0.0, 239.308, 0.0, 0.0, 0.0, 239.385, 0.0,
            0.0, 0.0, 239.462, 0.0, 0.0, 0.0, 239.538, 0.0, 0.0, 0.0, 239.615, 0.0, 0.0, 0.0, 239.692,
            0.0, 0.0, 0.0, 239.769, 0.0, 0.0, 0.0, 239.846, 0.0, 0.0, 0.0, 239.923, 0.0, 0.0, 0.0, 240.0,
            0.0, 0.0, 0.0, 240.091, 0.0, 0.0, 0.0, 240.182, 0.0, 0.0, 0.0, 240.273, 0.0, 0.0, 0.0,
            240.364, 0.0, 0.0, 0.0, 240.455, 0.0, 0.0, 0.0, 240.545, 0.0, 0.0, 0.0, 240.636, 0.0, 0.0,
            0.0, 240.727, 0.0, 0.0, 0.0, 240.818, 0.0, 0.0, 0.0, 240.909, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0,
            0.0, 241.0, 0.0, 0.0, 0.0, 240.909, 0.0, 0.0, 0.0, 240.818, 0.0, 0.0, 0.0, 240.727, 0.0, 0.0,
            0.0, 240.636, 0.0, 0.0, 0.0, 240.545, 0.0, 0.0, 0.0, 240.455, 0.0, 0.0, 0.0, 240.364, 0.0,
            0.0, 0.0, 240.273, 0.0, 0.0, 0.0, 240.182, 0.0, 0.0, 0.0, 240.091, 0.0, 0.0, 0.0, 240.0, 0.0,
            0.0, 0.0, 239.615, 0.0, 0.0, 0.0, 239.231, 0.0, 0.0, 0.0, 238.846, 0.0, 0.0, 0.0, 238.462,
            0.0, 0.0, 0.0, 238.077, 0.0, 0.0, 0.0, 237.692, 0.0, 0.0, 0.0, 237.308, 0.0, 0.0, 0.0,
            236.923, 0.0, 0.0, 0.0, 236.538, 0.0, 0.0, 0.0, 236.154, 0.0, 0.0, 0.0, 235.769, 0.0, 0.0,
            0.0, 235.385, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 232.615, 0.0, 0.0, 0.0, 230.231, 0.0, 0.0,
            0.0, 227.846, 0.0, 0.0, 0.0, 225.462, 0.0, 0.0, 0.0, 223.077, 0.0, 0.0, 0.0, 220.692, 0.0,
            0.0, 0.0, 218.308, 0.0, 0.0, 0.0, 215.923, 0.0, 0.0, 0.0, 213.538, 0.0, 0.0, 0.0, 211.154,
            0.0, 0.0, 0.0, 208.769, 0.0, 0.0, 0.0, 206.385, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 200.077,
            0.0, 0.0, 0.0, 196.154, 0.0, 0.0, 0.0, 192.231, 0.0, 0.0, 0.0, 188.308, 0.0, 0.0, 0.0,
            184.385, 0.0, 0.0, 0.0, 180.462, 0.0, 0.0, 0.0, 176.538, 0.0, 0.0, 0.0, 172.615, 0.0, 0.0,
            0.0, 168.692, 0.0, 0.0, 0.0, 164.769, 0.0, 0.0, 0.0, 160.846, 0.0, 0.0, 0.0, 156.923, 0.0,
            0.0, 0.0, 153.0, 0.0, 0.0, 0.0, 147.115, 0.0, 0.0, 0.0, 141.231, 0.0, 0.0, 0.0, 135.346, 0.0,
            0.0, 0.0, 129.462, 0.0, 0.0, 0.0, 123.577, 0.0, 0.0, 0.0, 117.692, 0.0, 0.0, 0.0, 111.808,
            0.0, 0.0, 0.0, 105.923, 0.0, 0.0, 0.0, 100.038, 0.0, 0.0, 0.0, 94.1538, 0.0, 0.0, 0.0,
            88.2692, 0.0, 0.0, 0.0, 82.3846, 0.0, 0.0, 0.0, 76.5, 0.0, 0.0, 0.0, 73.0769, 0.0, 0.0, 0.0,
            69.6538, 0.0, 0.0, 0.0, 66.2308, 0.0, 0.0, 0.0, 62.8077, 0.0, 0.0, 0.0, 59.3846, 0.0, 0.0,
            0.0, 55.9615, 0.0, 0.0, 0.0, 52.5385, 0.0, 0.0, 0.0, 49.1154, 0.0, 0.0, 0.0, 45.6923, 0.0,
            0.0, 0.0, 42.2692, 0.0, 0.0, 0.0, 38.8462, 0.0, 0.0, 0.0, 35.4231, 0.0, 0.0, 0.0, 32.0, 0.0,
            0.0, 0.0, 29.5385, 0.0, 0.0, 0.0, 27.0769, 0.0, 0.0, 0.0, 24.6154, 0.0, 0.0, 0.0, 22.1538,
            0.0, 0.0, 0.0, 19.6923, 0.0, 0.0, 0.0, 17.2308, 0.0, 0.0, 0.0, 14.7692, 0.0, 0.0, 0.0,
            12.3077, 0.0, 0.0, 0.0, 9.84615, 0.0, 0.0, 0.0, 7.38462, 0.0, 0.0, 0.0, 4.92308, 0.0, 0.0,
            0.0, 2.46154, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 9.80769, 0.0, 0.0, 0.0, 19.6154, 0.0, 0.0,
            0.0, 29.4231, 0.0, 0.0, 0.0, 39.2308, 0.0, 0.0, 0.0, 49.0385, 0.0, 0.0, 0.0, 58.8462, 0.0,
            0.0, 0.0, 68.6538, 0.0, 0.0, 0.0, 78.4615, 0.0, 0.0, 0.0, 88.2692, 0.0, 0.0, 0.0, 98.0769,
            0.0, 0.0, 0.0, 107.885, 0.0, 0.0, 0.0, 117.692, 0.0, 0.0, 0.0, 127.5, 0.0, 0.0, 0.0, 131.423,
            0.0, 0.0, 0.0, 135.346, 0.0, 0.0, 0.0, 139.269, 0.0, 0.0, 0.0, 143.192, 0.0, 0.0, 0.0,
            147.115, 0.0, 0.0, 0.0, 151.038, 0.0, 0.0, 0.0, 154.962, 0.0, 0.0, 0.0, 158.885, 0.0, 0.0,
            0.0, 162.808, 0.0, 0.0, 0.0, 166.731, 0.0, 0.0, 0.0, 170.654, 0.0, 0.0, 0.0, 174.577, 0.0,
            0.0, 0.0, 178.5, 0.0, 0.0, 0.0, 180.462, 0.0, 0.0, 0.0, 182.423, 0.0, 0.0, 0.0, 184.385, 0.0,
            0.0, 0.0, 186.346, 0.0, 0.0, 0.0, 188.308, 0.0, 0.0, 0.0, 190.269, 0.0, 0.0, 0.0, 192.231,
            0.0, 0.0, 0.0, 194.192, 0.0, 0.0, 0.0, 196.154, 0.0, 0.0, 0.0, 198.115, 0.0, 0.0, 0.0,
            200.077, 0.0, 0.0, 0.0, 202.038, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 205.962, 0.0, 0.0, 0.0,
            207.923, 0.0, 0.0, 0.0, 209.885, 0.0, 0.0, 0.0, 211.846, 0.0, 0.0, 0.0, 213.808, 0.0, 0.0,
            0.0, 215.769, 0.0, 0.0, 0.0, 217.731, 0.0, 0.0, 0.0, 219.692, 0.0, 0.0, 0.0, 221.654, 0.0,
            0.0, 0.0, 223.615, 0.0, 0.0, 0.0, 225.577, 0.0, 0.0, 0.0, 227.538, 0.0, 0.0, 0.0, 229.5, 0.0,
            0.0, 0.0, 230.481, 0.0, 0.0, 0.0, 231.462, 0.0, 0.0, 0.0, 232.442, 0.0, 0.0, 0.0, 233.423,
            0.0, 0.0, 0.0, 234.404, 0.0, 0.0, 0.0, 235.385, 0.0, 0.0, 0.0, 236.365, 0.0, 0.0, 0.0,
            237.346, 0.0, 0.0, 0.0, 238.327, 0.0, 0.0, 0.0, 239.308, 0.0, 0.0, 0.0, 240.288, 0.0, 0.0,
            0.0, 241.269, 0.0, 0.0, 0.0, 242.25, 0.0, 0.0, 0.0, 242.642, 0.0, 0.0, 0.0, 243.035, 0.0, 0.0,
            0.0, 243.427, 0.0, 0.0, 0.0, 243.819, 0.0, 0.0, 0.0, 244.212, 0.0, 0.0, 0.0, 244.604, 0.0,
            0.0, 0.0, 244.996, 0.0, 0.0, 0.0, 245.388, 0.0, 0.0, 0.0, 245.781, 0.0, 0.0, 0.0, 246.173,
            0.0, 0.0, 0.0, 246.565, 0.0, 0.0, 0.0, 246.958, 0.0, 0.0, 0.0, 247.35, 0.0, 0.0, 0.0, 247.814,
            0.0, 0.0, 0.0, 248.277, 0.0, 0.0, 0.0, 248.741, 0.0, 0.0, 0.0, 249.205, 0.0, 0.0, 0.0,
            249.668, 0.0, 0.0, 0.0, 250.132, 0.0, 0.0, 0.0, 250.595, 0.0, 0.0, 0.0, 251.059, 0.0, 0.0,
            0.0, 251.523, 0.0, 0.0, 0.0, 251.986, 0.0, 0.0, 0.0, 252.45, 0.0, 0.0, 0.0
        ]),
        b: new Float32Array([
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 254.615, 0.0, 0.0, 0.0, 254.231, 0.0, 0.0, 0.0, 253.846,
            0.0, 0.0, 0.0, 253.462, 0.0, 0.0, 0.0, 253.077, 0.0, 0.0, 0.0, 252.692, 0.0, 0.0, 0.0,
            252.308, 0.0, 0.0, 0.0, 251.923, 0.0, 0.0, 0.0, 251.538, 0.0, 0.0, 0.0, 251.154, 0.0, 0.0,
            0.0, 250.769, 0.0, 0.0, 0.0, 250.385, 0.0, 0.0, 0.0, 250.0, 0.0, 0.0, 0.0, 249.615, 0.0, 0.0,
            0.0, 249.231, 0.0, 0.0, 0.0, 248.846, 0.0, 0.0, 0.0, 248.462, 0.0, 0.0, 0.0, 248.077, 0.0,
            0.0, 0.0, 247.692, 0.0, 0.0, 0.0, 247.308, 0.0, 0.0, 0.0, 246.923, 0.0, 0.0, 0.0, 246.538,
            0.0, 0.0, 0.0, 246.154, 0.0, 0.0, 0.0, 245.769, 0.0, 0.0, 0.0, 245.385, 0.0, 0.0, 0.0, 245.0,
            0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 236.0, 0.0, 0.0, 0.0, 233.0, 0.0,
            0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 227.0, 0.0, 0.0, 0.0, 224.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0,
            0.0, 218.0, 0.0, 0.0, 0.0, 215.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0,
            208.636, 0.0, 0.0, 0.0, 205.273, 0.0, 0.0, 0.0, 201.909, 0.0, 0.0, 0.0, 198.545, 0.0, 0.0,
            0.0, 195.182, 0.0, 0.0, 0.0, 191.818, 0.0, 0.0, 0.0, 188.455, 0.0, 0.0, 0.0, 185.091, 0.0,
            0.0, 0.0, 181.727, 0.0, 0.0, 0.0, 178.364, 0.0, 0.0, 0.0, 175.0, 0.0, 0.0, 0.0, 171.538, 0.0,
            0.0, 0.0, 168.077, 0.0, 0.0, 0.0, 164.615, 0.0, 0.0, 0.0, 161.154, 0.0, 0.0, 0.0, 157.692,
            0.0, 0.0, 0.0, 154.231, 0.0, 0.0, 0.0, 150.769, 0.0, 0.0, 0.0, 147.308, 0.0, 0.0, 0.0,
            143.846, 0.0, 0.0, 0.0, 140.385, 0.0, 0.0, 0.0, 136.923, 0.0, 0.0, 0.0, 133.462, 0.0, 0.0,
            0.0, 130.0, 0.0, 0.0, 0.0, 122.942, 0.0, 0.0, 0.0, 115.885, 0.0, 0.0, 0.0, 108.827, 0.0, 0.0,
            0.0, 101.769, 0.0, 0.0, 0.0, 94.7115, 0.0, 0.0, 0.0, 87.6539, 0.0, 0.0, 0.0, 80.5962, 0.0,
            0.0, 0.0, 73.5385, 0.0, 0.0, 0.0, 66.4808, 0.0, 0.0, 0.0, 59.4231, 0.0, 0.0, 0.0, 52.3654,
            0.0, 0.0, 0.0, 45.3077, 0.0, 0.0, 0.0, 38.25, 0.0, 0.0, 0.0, 36.2885, 0.0, 0.0, 0.0, 34.3269,
            0.0, 0.0, 0.0, 32.3654, 0.0, 0.0, 0.0, 30.4038, 0.0, 0.0, 0.0, 28.4423, 0.0, 0.0, 0.0,
            26.4808, 0.0, 0.0, 0.0, 24.5192, 0.0, 0.0, 0.0, 22.5577, 0.0, 0.0, 0.0, 20.5962, 0.0, 0.0,
            0.0, 18.6346, 0.0, 0.0, 0.0, 16.6731, 0.0, 0.0, 0.0, 14.7115, 0.0, 0.0, 0.0, 12.75, 0.0, 0.0,
            0.0, 11.7692, 0.0, 0.0, 0.0, 10.7885, 0.0, 0.0, 0.0, 9.80769, 0.0, 0.0, 0.0, 8.82692, 0.0,
            0.0, 0.0, 7.84615, 0.0, 0.0, 0.0, 6.86539, 0.0, 0.0, 0.0, 5.88461, 0.0, 0.0, 0.0, 4.90385,
            0.0, 0.0, 0.0, 3.92308, 0.0, 0.0, 0.0, 2.94231, 0.0, 0.0, 0.0, 1.96154, 0.0, 0.0, 0.0,
            0.980769, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.46154, 0.0, 0.0, 0.0, 4.92308, 0.0, 0.0, 0.0,
            7.38462, 0.0, 0.0, 0.0, 9.84616, 0.0, 0.0, 0.0, 12.3077, 0.0, 0.0, 0.0, 14.7692, 0.0, 0.0,
            0.0, 17.2308, 0.0, 0.0, 0.0, 19.6923, 0.0, 0.0, 0.0, 22.1538, 0.0, 0.0, 0.0, 24.6154, 0.0,
            0.0, 0.0, 27.0769, 0.0, 0.0, 0.0, 29.5385, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0,
            0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0,
            0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0,
            0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 41.3077, 0.0, 0.0, 0.0,
            50.6154, 0.0, 0.0, 0.0, 59.9231, 0.0, 0.0, 0.0, 69.2308, 0.0, 0.0, 0.0, 78.5385, 0.0, 0.0,
            0.0, 87.8462, 0.0, 0.0, 0.0, 97.1539, 0.0, 0.0, 0.0, 106.462, 0.0, 0.0, 0.0, 115.769, 0.0,
            0.0, 0.0, 125.077, 0.0, 0.0, 0.0, 134.385, 0.0, 0.0, 0.0, 143.692, 0.0, 0.0, 0.0, 153.0, 0.0,
            0.0, 0.0, 156.923, 0.0, 0.0, 0.0, 160.846, 0.0, 0.0, 0.0, 164.769, 0.0, 0.0, 0.0, 168.692,
            0.0, 0.0, 0.0, 172.615, 0.0, 0.0, 0.0, 176.538, 0.0, 0.0, 0.0, 180.462, 0.0, 0.0, 0.0,
            184.385, 0.0, 0.0, 0.0, 188.308, 0.0, 0.0, 0.0, 192.231, 0.0, 0.0, 0.0, 196.154, 0.0, 0.0,
            0.0, 200.077, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 205.962, 0.0, 0.0, 0.0, 207.923, 0.0, 0.0,
            0.0, 209.885, 0.0, 0.0, 0.0, 211.846, 0.0, 0.0, 0.0, 213.808, 0.0, 0.0, 0.0, 215.769, 0.0,
            0.0, 0.0, 217.731, 0.0, 0.0, 0.0, 219.692, 0.0, 0.0, 0.0, 221.654, 0.0, 0.0, 0.0, 223.615,
            0.0, 0.0, 0.0, 225.577, 0.0, 0.0, 0.0, 227.538, 0.0, 0.0, 0.0, 229.5, 0.0, 0.0, 0.0, 230.481,
            0.0, 0.0, 0.0, 231.462, 0.0, 0.0, 0.0, 232.442, 0.0, 0.0, 0.0, 233.423, 0.0, 0.0, 0.0,
            234.404, 0.0, 0.0, 0.0, 235.385, 0.0, 0.0, 0.0, 236.365, 0.0, 0.0, 0.0, 237.346, 0.0, 0.0,
            0.0, 238.327, 0.0, 0.0, 0.0, 239.308, 0.0, 0.0, 0.0, 240.288, 0.0, 0.0, 0.0, 241.269, 0.0,
            0.0, 0.0, 242.25, 0.0, 0.0, 0.0, 242.838, 0.0, 0.0, 0.0, 243.427, 0.0, 0.0, 0.0, 244.015, 0.0,
            0.0, 0.0, 244.604, 0.0, 0.0, 0.0, 245.192, 0.0, 0.0, 0.0, 245.781, 0.0, 0.0, 0.0, 246.369,
            0.0, 0.0, 0.0, 246.958, 0.0, 0.0, 0.0, 247.546, 0.0, 0.0, 0.0, 248.135, 0.0, 0.0, 0.0,
            248.723, 0.0, 0.0, 0.0, 249.312, 0.0, 0.0, 0.0, 249.9, 0.0, 0.0, 0.0, 250.096, 0.0, 0.0, 0.0,
            250.292, 0.0, 0.0, 0.0, 250.488, 0.0, 0.0, 0.0, 250.685, 0.0, 0.0, 0.0, 250.881, 0.0, 0.0,
            0.0, 251.077, 0.0, 0.0, 0.0, 251.273, 0.0, 0.0, 0.0, 251.469, 0.0, 0.0, 0.0, 251.665, 0.0,
            0.0, 0.0, 251.862, 0.0, 0.0, 0.0, 252.058, 0.0, 0.0, 0.0, 252.254, 0.0, 0.0, 0.0, 252.45, 0.0,
            0.0, 0.0, 252.682, 0.0, 0.0, 0.0, 252.914, 0.0, 0.0, 0.0, 253.145, 0.0, 0.0, 0.0, 253.377,
            0.0, 0.0, 0.0, 253.609, 0.0, 0.0, 0.0, 253.841, 0.0, 0.0, 0.0, 254.073, 0.0, 0.0, 0.0,
            254.305, 0.0, 0.0, 0.0, 254.536, 0.0, 0.0, 0.0, 254.768, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0
        ])
    };
    RAINBOW = {
        r: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 9.0, 0.0, 0.0, 0.0, 13.0, 0.0, 0.0, 0.0, 18.0, 0.0,
            0.0, 0.0, 22.0, 0.0, 0.0, 0.0, 27.0, 0.0, 0.0, 0.0, 31.0, 0.0, 0.0, 0.0, 36.0, 0.0, 0.0, 0.0,
            40.0, 0.0, 0.0, 0.0, 45.0, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0, 0.0, 54.0, 0.0, 0.0, 0.0, 58.0, 0.0,
            0.0, 0.0, 61.0, 0.0, 0.0, 0.0, 64.0, 0.0, 0.0, 0.0, 68.0, 0.0, 0.0, 0.0, 69.0, 0.0, 0.0, 0.0,
            72.0, 0.0, 0.0, 0.0, 74.0, 0.0, 0.0, 0.0, 77.0, 0.0, 0.0, 0.0, 79.0, 0.0, 0.0, 0.0, 80.0, 0.0,
            0.0, 0.0, 82.0, 0.0, 0.0, 0.0, 83.0, 0.0, 0.0, 0.0, 85.0, 0.0, 0.0, 0.0, 84.0, 0.0, 0.0, 0.0,
            86.0, 0.0, 0.0, 0.0, 87.0, 0.0, 0.0, 0.0, 88.0, 0.0, 0.0, 0.0, 86.0, 0.0, 0.0, 0.0, 87.0, 0.0,
            0.0, 0.0, 87.0, 0.0, 0.0, 0.0, 87.0, 0.0, 0.0, 0.0, 85.0, 0.0, 0.0, 0.0, 84.0, 0.0, 0.0, 0.0,
            84.0, 0.0, 0.0, 0.0, 84.0, 0.0, 0.0, 0.0, 83.0, 0.0, 0.0, 0.0, 79.0, 0.0, 0.0, 0.0, 78.0, 0.0,
            0.0, 0.0, 77.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 71.0, 0.0, 0.0, 0.0, 70.0, 0.0, 0.0, 0.0,
            68.0, 0.0, 0.0, 0.0, 66.0, 0.0, 0.0, 0.0, 60.0, 0.0, 0.0, 0.0, 58.0, 0.0, 0.0, 0.0, 55.0, 0.0,
            0.0, 0.0, 53.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0, 0.0, 43.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0,
            36.0, 0.0, 0.0, 0.0, 33.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 16.0, 0.0,
            0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 21.0, 0.0,
            0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 29.0, 0.0, 0.0, 0.0, 33.0, 0.0, 0.0, 0.0, 42.0, 0.0, 0.0, 0.0,
            46.0, 0.0, 0.0, 0.0, 51.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 67.0, 0.0,
            0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 80.0, 0.0, 0.0, 0.0, 89.0, 0.0, 0.0, 0.0,
            93.0, 0.0, 0.0, 0.0, 97.0, 0.0, 0.0, 0.0, 101.0, 0.0, 0.0, 0.0, 110.0, 0.0, 0.0, 0.0, 114.0,
            0.0, 0.0, 0.0, 119.0, 0.0, 0.0, 0.0, 123.0, 0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 135.0, 0.0,
            0.0, 0.0, 140.0, 0.0, 0.0, 0.0, 144.0, 0.0, 0.0, 0.0, 153.0, 0.0, 0.0, 0.0, 157.0, 0.0, 0.0,
            0.0, 161.0, 0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 169.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0, 0.0,
            182.0, 0.0, 0.0, 0.0, 187.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 203.0,
            0.0, 0.0, 0.0, 208.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 225.0, 0.0,
            0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 246.0, 0.0, 0.0,
            0.0, 250.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0
        ]),
        g: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 4.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 16.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 25.0,
            0.0, 0.0, 0.0, 29.0, 0.0, 0.0, 0.0, 38.0, 0.0, 0.0, 0.0, 42.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0,
            0.0, 51.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 67.0, 0.0, 0.0, 0.0, 72.0,
            0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 84.0, 0.0, 0.0, 0.0, 89.0, 0.0, 0.0, 0.0, 93.0, 0.0, 0.0,
            0.0, 97.0, 0.0, 0.0, 0.0, 106.0, 0.0, 0.0, 0.0, 110.0, 0.0, 0.0, 0.0, 114.0, 0.0, 0.0, 0.0,
            119.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 135.0, 0.0, 0.0, 0.0, 140.0,
            0.0, 0.0, 0.0, 144.0, 0.0, 0.0, 0.0, 152.0, 0.0, 0.0, 0.0, 157.0, 0.0, 0.0, 0.0, 161.0, 0.0,
            0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 174.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0, 0.0, 182.0, 0.0, 0.0,
            0.0, 187.0, 0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 203.0, 0.0, 0.0, 0.0,
            208.0, 0.0, 0.0, 0.0, 216.0, 0.0, 0.0, 0.0, 220.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 229.0,
            0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 246.0, 0.0, 0.0, 0.0, 250.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 250.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 233.0, 0.0,
            0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 216.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0,
            0.0, 208.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0,
            187.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0, 0.0, 174.0, 0.0, 0.0, 0.0, 170.0, 0.0, 0.0, 0.0, 165.0,
            0.0, 0.0, 0.0, 161.0, 0.0, 0.0, 0.0, 153.0, 0.0, 0.0, 0.0, 148.0, 0.0, 0.0, 0.0, 144.0, 0.0,
            0.0, 0.0, 140.0, 0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 123.0, 0.0, 0.0,
            0.0, 119.0, 0.0, 0.0, 0.0, 110.0, 0.0, 0.0, 0.0, 106.0, 0.0, 0.0, 0.0, 102.0, 0.0, 0.0, 0.0,
            97.0, 0.0, 0.0, 0.0, 89.0, 0.0, 0.0, 0.0, 85.0, 0.0, 0.0, 0.0, 80.0, 0.0, 0.0, 0.0, 76.0, 0.0,
            0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 59.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0,
            51.0, 0.0, 0.0, 0.0, 42.0, 0.0, 0.0, 0.0, 38.0, 0.0, 0.0, 0.0, 34.0, 0.0, 0.0, 0.0, 29.0, 0.0,
            0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 17.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0
        ]),
        b: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 14.0, 0.0,
            0.0, 0.0, 19.0, 0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 28.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0,
            38.0, 0.0, 0.0, 0.0, 43.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 53.0, 0.0, 0.0, 0.0, 59.0, 0.0,
            0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 68.0, 0.0, 0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 77.0, 0.0, 0.0, 0.0,
            81.0, 0.0, 0.0, 0.0, 86.0, 0.0, 0.0, 0.0, 91.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0, 0.0, 100.0,
            0.0, 0.0, 0.0, 104.0, 0.0, 0.0, 0.0, 109.0, 0.0, 0.0, 0.0, 113.0, 0.0, 0.0, 0.0, 118.0, 0.0,
            0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 132.0, 0.0, 0.0, 0.0, 136.0, 0.0, 0.0,
            0.0, 141.0, 0.0, 0.0, 0.0, 145.0, 0.0, 0.0, 0.0, 150.0, 0.0, 0.0, 0.0, 154.0, 0.0, 0.0, 0.0,
            159.0, 0.0, 0.0, 0.0, 163.0, 0.0, 0.0, 0.0, 168.0, 0.0, 0.0, 0.0, 173.0, 0.0, 0.0, 0.0, 177.0,
            0.0, 0.0, 0.0, 182.0, 0.0, 0.0, 0.0, 186.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 195.0, 0.0,
            0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 209.0, 0.0, 0.0, 0.0, 214.0, 0.0, 0.0,
            0.0, 218.0, 0.0, 0.0, 0.0, 223.0, 0.0, 0.0, 0.0, 227.0, 0.0, 0.0, 0.0, 232.0, 0.0, 0.0, 0.0,
            236.0, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0, 0.0, 245.0, 0.0, 0.0, 0.0, 250.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 246.0, 0.0,
            0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0,
            0.0, 220.0, 0.0, 0.0, 0.0, 216.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 203.0, 0.0, 0.0, 0.0,
            199.0, 0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 187.0, 0.0, 0.0, 0.0, 178.0,
            0.0, 0.0, 0.0, 174.0, 0.0, 0.0, 0.0, 170.0, 0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 157.0, 0.0,
            0.0, 0.0, 152.0, 0.0, 0.0, 0.0, 148.0, 0.0, 0.0, 0.0, 144.0, 0.0, 0.0, 0.0, 135.0, 0.0, 0.0,
            0.0, 131.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 123.0, 0.0, 0.0, 0.0, 114.0, 0.0, 0.0, 0.0,
            110.0, 0.0, 0.0, 0.0, 106.0, 0.0, 0.0, 0.0, 102.0, 0.0, 0.0, 0.0, 97.0, 0.0, 0.0, 0.0, 89.0,
            0.0, 0.0, 0.0, 84.0, 0.0, 0.0, 0.0, 80.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 67.0, 0.0, 0.0,
            0.0, 63.0, 0.0, 0.0, 0.0, 59.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0, 0.0, 42.0,
            0.0, 0.0, 0.0, 38.0, 0.0, 0.0, 0.0, 34.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0,
            0.0, 16.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0
        ])
    };
    CMB = {
        // "r": new Float32Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 6.0, 12.0, 18.0, 24.0, 30.0, 36.0, 42.0, 48.0, 54.0, 60.0, 66.0, 72.0, 78.0, 85.0, 91.0, 97.0, 103.0, 109.0, 115.0, 121.0, 127.0, 133.0, 139.0, 145.0, 151.0, 157.0, 163.0, 170.0, 176.0, 182.0, 188.0, 194.0, 200.0, 206.0, 212.0, 218.0, 224.0, 230.0, 236.0, 242.0, 248.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 251.0, 247.0, 244.0, 240.0, 236.0, 233.0, 229.0, 226.0, 222.0, 218.0, 215.0, 211.0, 208.0, 204.0, 200.0, 197.0, 193.0, 190.0, 186.0, 182.0, 179.0, 175.0, 172.0, 168.0, 164.0, 161.0, 157.0, 154.0, 150.0, 146.0, 143.0, 139.0, 136.0, 132.0, 128.0, 125.0, 121.0, 118.0, 114.0, 110.0, 107.0, 103.0, 100.0]),
        // "g": new Float32Array([0.0, 2.0, 5.0, 8.0, 10.0, 13.0, 16.0, 18.0, 21.0, 24.0, 26.0, 29.0, 32.0, 34.0, 37.0, 40.0, 42.0, 45.0, 48.0, 50.0, 53.0, 56.0, 58.0, 61.0, 64.0, 66.0, 69.0, 72.0, 74.0, 77.0, 80.0, 82.0, 85.0, 88.0, 90.0, 93.0, 96.0, 98.0, 101.0, 104.0, 106.0, 109.0, 112.0, 114.0, 117.0, 119.0, 122.0, 124.0, 127.0, 129.0, 132.0, 134.0, 137.0, 139.0, 142.0, 144.0, 147.0, 150.0, 152.0, 155.0, 157.0, 160.0, 162.0, 165.0, 167.0, 170.0, 172.0, 175.0, 177.0, 180.0, 182.0, 185.0, 188.0, 190.0, 193.0, 195.0, 198.0, 200.0, 203.0, 205.0, 208.0, 210.0, 213.0, 215.0, 218.0, 221.0, 221.0, 221.0, 222.0, 222.0, 222.0, 223.0, 223.0, 224.0, 224.0, 224.0, 225.0, 225.0, 225.0, 226.0, 226.0, 227.0, 227.0, 227.0, 228.0, 228.0, 229.0, 229.0, 229.0, 230.0, 230.0, 230.0, 231.0, 231.0, 232.0, 232.0, 232.0, 233.0, 233.0, 233.0, 234.0, 234.0, 235.0, 235.0, 235.0, 236.0, 236.0, 237.0, 235.0, 234.0, 233.0, 231.0, 230.0, 229.0, 227.0, 226.0, 225.0, 223.0, 222.0, 221.0, 219.0, 218.0, 217.0, 215.0, 214.0, 213.0, 211.0, 210.0, 209.0, 207.0, 206.0, 205.0, 203.0, 202.0, 201.0, 199.0, 198.0, 197.0, 195.0, 194.0, 193.0, 191.0, 190.0, 189.0, 187.0, 186.0, 185.0, 183.0, 182.0, 181.0, 180.0, 177.0, 175.0, 172.0, 170.0, 167.0, 165.0, 162.0, 160.0, 157.0, 155.0, 152.0, 150.0, 147.0, 145.0, 142.0, 140.0, 137.0, 135.0, 132.0, 130.0, 127.0, 125.0, 122.0, 120.0, 117.0, 115.0, 112.0, 110.0, 107.0, 105.0, 102.0, 100.0, 97.0, 95.0, 92.0, 90.0, 87.0, 85.0, 82.0, 80.0, 77.0, 75.0, 73.0, 71.0, 69.0, 68.0, 66.0, 64.0, 62.0, 61.0, 59.0, 57.0, 55.0, 54.0, 52.0, 50.0, 48.0, 47.0, 45.0, 43.0, 41.0, 40.0, 38.0, 36.0, 34.0, 33.0, 31.0, 29.0, 27.0, 26.0, 24.0, 22.0, 20.0, 19.0, 17.0, 15.0, 13.0, 12.0, 10.0, 8.0, 6.0, 5.0, 3.0, 1.0, 0.0]),
        // "b": new Float32Array([255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 255.0, 254.0, 253.0, 252.0, 251.0, 250.0, 249.0, 248.0, 247.0, 246.0, 245.0, 245.0, 244.0, 243.0, 242.0, 241.0, 240.0, 239.0, 238.0, 237.0, 236.0, 236.0, 235.0, 234.0, 233.0, 232.0, 231.0, 230.0, 229.0, 228.0, 227.0, 226.0, 226.0, 225.0, 224.0, 223.0, 222.0, 221.0, 220.0, 219.0, 218.0, 217.0, 217.0, 211.0, 206.0, 201.0, 196.0, 191.0, 186.0, 181.0, 176.0, 171.0, 166.0, 161.0, 156.0, 151.0, 146.0, 141.0, 136.0, 131.0, 126.0, 121.0, 116.0, 111.0, 105.0, 100.0, 95.0, 90.0, 85.0, 80.0, 75.0, 70.0, 65.0, 60.0, 55.0, 50.0, 45.0, 40.0, 35.0, 30.0, 25.0, 20.0, 15.0, 10.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
        r: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 6.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 18.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0,
            30.0, 0.0, 0.0, 0.0, 36.0, 0.0, 0.0, 0.0, 42.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 54.0, 0.0,
            0.0, 0.0, 60.0, 0.0, 0.0, 0.0, 66.0, 0.0, 0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0,
            85.0, 0.0, 0.0, 0.0, 91.0, 0.0, 0.0, 0.0, 97.0, 0.0, 0.0, 0.0, 103.0, 0.0, 0.0, 0.0, 109.0,
            0.0, 0.0, 0.0, 115.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 133.0, 0.0,
            0.0, 0.0, 139.0, 0.0, 0.0, 0.0, 145.0, 0.0, 0.0, 0.0, 151.0, 0.0, 0.0, 0.0, 157.0, 0.0, 0.0,
            0.0, 163.0, 0.0, 0.0, 0.0, 170.0, 0.0, 0.0, 0.0, 176.0, 0.0, 0.0, 0.0, 182.0, 0.0, 0.0, 0.0,
            188.0, 0.0, 0.0, 0.0, 194.0, 0.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 206.0, 0.0, 0.0, 0.0, 212.0,
            0.0, 0.0, 0.0, 218.0, 0.0, 0.0, 0.0, 224.0, 0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 236.0, 0.0,
            0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 248.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 251.0, 0.0, 0.0,
            0.0, 247.0, 0.0, 0.0, 0.0, 244.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 236.0, 0.0, 0.0, 0.0,
            233.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 226.0, 0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 218.0,
            0.0, 0.0, 0.0, 215.0, 0.0, 0.0, 0.0, 211.0, 0.0, 0.0, 0.0, 208.0, 0.0, 0.0, 0.0, 204.0, 0.0,
            0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 197.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 190.0, 0.0, 0.0,
            0.0, 186.0, 0.0, 0.0, 0.0, 182.0, 0.0, 0.0, 0.0, 179.0, 0.0, 0.0, 0.0, 175.0, 0.0, 0.0, 0.0,
            172.0, 0.0, 0.0, 0.0, 168.0, 0.0, 0.0, 0.0, 164.0, 0.0, 0.0, 0.0, 161.0, 0.0, 0.0, 0.0, 157.0,
            0.0, 0.0, 0.0, 154.0, 0.0, 0.0, 0.0, 150.0, 0.0, 0.0, 0.0, 146.0, 0.0, 0.0, 0.0, 143.0, 0.0,
            0.0, 0.0, 139.0, 0.0, 0.0, 0.0, 136.0, 0.0, 0.0, 0.0, 132.0, 0.0, 0.0, 0.0, 128.0, 0.0, 0.0,
            0.0, 125.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 118.0, 0.0, 0.0, 0.0, 114.0, 0.0, 0.0, 0.0,
            110.0, 0.0, 0.0, 0.0, 107.0, 0.0, 0.0, 0.0, 103.0, 0.0, 0.0, 0.0, 100.0, 0.0, 0.0, 0.0
        ]),
        g: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 10.0, 0.0,
            0.0, 0.0, 13.0, 0.0, 0.0, 0.0, 16.0, 0.0, 0.0, 0.0, 18.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0,
            24.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 29.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 34.0, 0.0,
            0.0, 0.0, 37.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 42.0, 0.0, 0.0, 0.0, 45.0, 0.0, 0.0, 0.0,
            48.0, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0, 0.0, 53.0, 0.0, 0.0, 0.0, 56.0, 0.0, 0.0, 0.0, 58.0, 0.0,
            0.0, 0.0, 61.0, 0.0, 0.0, 0.0, 64.0, 0.0, 0.0, 0.0, 66.0, 0.0, 0.0, 0.0, 69.0, 0.0, 0.0, 0.0,
            72.0, 0.0, 0.0, 0.0, 74.0, 0.0, 0.0, 0.0, 77.0, 0.0, 0.0, 0.0, 80.0, 0.0, 0.0, 0.0, 82.0, 0.0,
            0.0, 0.0, 85.0, 0.0, 0.0, 0.0, 88.0, 0.0, 0.0, 0.0, 90.0, 0.0, 0.0, 0.0, 93.0, 0.0, 0.0, 0.0,
            96.0, 0.0, 0.0, 0.0, 98.0, 0.0, 0.0, 0.0, 101.0, 0.0, 0.0, 0.0, 104.0, 0.0, 0.0, 0.0, 106.0,
            0.0, 0.0, 0.0, 109.0, 0.0, 0.0, 0.0, 112.0, 0.0, 0.0, 0.0, 114.0, 0.0, 0.0, 0.0, 117.0, 0.0,
            0.0, 0.0, 119.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 124.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0,
            0.0, 129.0, 0.0, 0.0, 0.0, 132.0, 0.0, 0.0, 0.0, 134.0, 0.0, 0.0, 0.0, 137.0, 0.0, 0.0, 0.0,
            139.0, 0.0, 0.0, 0.0, 142.0, 0.0, 0.0, 0.0, 144.0, 0.0, 0.0, 0.0, 147.0, 0.0, 0.0, 0.0, 150.0,
            0.0, 0.0, 0.0, 152.0, 0.0, 0.0, 0.0, 155.0, 0.0, 0.0, 0.0, 157.0, 0.0, 0.0, 0.0, 160.0, 0.0,
            0.0, 0.0, 162.0, 0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 167.0, 0.0, 0.0, 0.0, 170.0, 0.0, 0.0,
            0.0, 172.0, 0.0, 0.0, 0.0, 175.0, 0.0, 0.0, 0.0, 177.0, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0, 0.0,
            182.0, 0.0, 0.0, 0.0, 185.0, 0.0, 0.0, 0.0, 188.0, 0.0, 0.0, 0.0, 190.0, 0.0, 0.0, 0.0, 193.0,
            0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 198.0, 0.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 203.0, 0.0,
            0.0, 0.0, 205.0, 0.0, 0.0, 0.0, 208.0, 0.0, 0.0, 0.0, 210.0, 0.0, 0.0, 0.0, 213.0, 0.0, 0.0,
            0.0, 215.0, 0.0, 0.0, 0.0, 218.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0,
            221.0, 0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 223.0,
            0.0, 0.0, 0.0, 223.0, 0.0, 0.0, 0.0, 224.0, 0.0, 0.0, 0.0, 224.0, 0.0, 0.0, 0.0, 224.0, 0.0,
            0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 226.0, 0.0, 0.0,
            0.0, 226.0, 0.0, 0.0, 0.0, 227.0, 0.0, 0.0, 0.0, 227.0, 0.0, 0.0, 0.0, 227.0, 0.0, 0.0, 0.0,
            228.0, 0.0, 0.0, 0.0, 228.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0,
            0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 231.0, 0.0,
            0.0, 0.0, 231.0, 0.0, 0.0, 0.0, 232.0, 0.0, 0.0, 0.0, 232.0, 0.0, 0.0, 0.0, 232.0, 0.0, 0.0,
            0.0, 233.0, 0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 234.0, 0.0, 0.0, 0.0,
            234.0, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 236.0,
            0.0, 0.0, 0.0, 236.0, 0.0, 0.0, 0.0, 237.0, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 234.0, 0.0,
            0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 231.0, 0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0,
            0.0, 227.0, 0.0, 0.0, 0.0, 226.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 223.0, 0.0, 0.0, 0.0,
            222.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 219.0, 0.0, 0.0, 0.0, 218.0, 0.0, 0.0, 0.0, 217.0,
            0.0, 0.0, 0.0, 215.0, 0.0, 0.0, 0.0, 214.0, 0.0, 0.0, 0.0, 213.0, 0.0, 0.0, 0.0, 211.0, 0.0,
            0.0, 0.0, 210.0, 0.0, 0.0, 0.0, 209.0, 0.0, 0.0, 0.0, 207.0, 0.0, 0.0, 0.0, 206.0, 0.0, 0.0,
            0.0, 205.0, 0.0, 0.0, 0.0, 203.0, 0.0, 0.0, 0.0, 202.0, 0.0, 0.0, 0.0, 201.0, 0.0, 0.0, 0.0,
            199.0, 0.0, 0.0, 0.0, 198.0, 0.0, 0.0, 0.0, 197.0, 0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 194.0,
            0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 190.0, 0.0, 0.0, 0.0, 189.0, 0.0,
            0.0, 0.0, 187.0, 0.0, 0.0, 0.0, 186.0, 0.0, 0.0, 0.0, 185.0, 0.0, 0.0, 0.0, 183.0, 0.0, 0.0,
            0.0, 182.0, 0.0, 0.0, 0.0, 181.0, 0.0, 0.0, 0.0, 180.0, 0.0, 0.0, 0.0, 177.0, 0.0, 0.0, 0.0,
            175.0, 0.0, 0.0, 0.0, 172.0, 0.0, 0.0, 0.0, 170.0, 0.0, 0.0, 0.0, 167.0, 0.0, 0.0, 0.0, 165.0,
            0.0, 0.0, 0.0, 162.0, 0.0, 0.0, 0.0, 160.0, 0.0, 0.0, 0.0, 157.0, 0.0, 0.0, 0.0, 155.0, 0.0,
            0.0, 0.0, 152.0, 0.0, 0.0, 0.0, 150.0, 0.0, 0.0, 0.0, 147.0, 0.0, 0.0, 0.0, 145.0, 0.0, 0.0,
            0.0, 142.0, 0.0, 0.0, 0.0, 140.0, 0.0, 0.0, 0.0, 137.0, 0.0, 0.0, 0.0, 135.0, 0.0, 0.0, 0.0,
            132.0, 0.0, 0.0, 0.0, 130.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 125.0, 0.0, 0.0, 0.0, 122.0,
            0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 117.0, 0.0, 0.0, 0.0, 115.0, 0.0, 0.0, 0.0, 112.0, 0.0,
            0.0, 0.0, 110.0, 0.0, 0.0, 0.0, 107.0, 0.0, 0.0, 0.0, 105.0, 0.0, 0.0, 0.0, 102.0, 0.0, 0.0,
            0.0, 100.0, 0.0, 0.0, 0.0, 97.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0, 0.0, 92.0, 0.0, 0.0, 0.0,
            90.0, 0.0, 0.0, 0.0, 87.0, 0.0, 0.0, 0.0, 85.0, 0.0, 0.0, 0.0, 82.0, 0.0, 0.0, 0.0, 80.0, 0.0,
            0.0, 0.0, 77.0, 0.0, 0.0, 0.0, 75.0, 0.0, 0.0, 0.0, 73.0, 0.0, 0.0, 0.0, 71.0, 0.0, 0.0, 0.0,
            69.0, 0.0, 0.0, 0.0, 68.0, 0.0, 0.0, 0.0, 66.0, 0.0, 0.0, 0.0, 64.0, 0.0, 0.0, 0.0, 62.0, 0.0,
            0.0, 0.0, 61.0, 0.0, 0.0, 0.0, 59.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0,
            54.0, 0.0, 0.0, 0.0, 52.0, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 47.0, 0.0,
            0.0, 0.0, 45.0, 0.0, 0.0, 0.0, 43.0, 0.0, 0.0, 0.0, 41.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0,
            38.0, 0.0, 0.0, 0.0, 36.0, 0.0, 0.0, 0.0, 34.0, 0.0, 0.0, 0.0, 33.0, 0.0, 0.0, 0.0, 31.0, 0.0,
            0.0, 0.0, 29.0, 0.0, 0.0, 0.0, 27.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0,
            22.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 19.0, 0.0, 0.0, 0.0, 17.0, 0.0, 0.0, 0.0, 15.0, 0.0,
            0.0, 0.0, 13.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0,
            6.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0
        ]),
        b: new Float32Array([
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 254.0, 0.0, 0.0, 0.0, 253.0, 0.0, 0.0, 0.0, 252.0, 0.0, 0.0, 0.0, 251.0,
            0.0, 0.0, 0.0, 250.0, 0.0, 0.0, 0.0, 249.0, 0.0, 0.0, 0.0, 248.0, 0.0, 0.0, 0.0, 247.0, 0.0,
            0.0, 0.0, 246.0, 0.0, 0.0, 0.0, 245.0, 0.0, 0.0, 0.0, 245.0, 0.0, 0.0, 0.0, 244.0, 0.0, 0.0,
            0.0, 243.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0,
            239.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 237.0, 0.0, 0.0, 0.0, 236.0, 0.0, 0.0, 0.0, 236.0,
            0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 234.0, 0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 232.0, 0.0,
            0.0, 0.0, 231.0, 0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 228.0, 0.0, 0.0,
            0.0, 227.0, 0.0, 0.0, 0.0, 226.0, 0.0, 0.0, 0.0, 226.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0,
            224.0, 0.0, 0.0, 0.0, 223.0, 0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 220.0,
            0.0, 0.0, 0.0, 219.0, 0.0, 0.0, 0.0, 218.0, 0.0, 0.0, 0.0, 217.0, 0.0, 0.0, 0.0, 217.0, 0.0,
            0.0, 0.0, 211.0, 0.0, 0.0, 0.0, 206.0, 0.0, 0.0, 0.0, 201.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0,
            0.0, 191.0, 0.0, 0.0, 0.0, 186.0, 0.0, 0.0, 0.0, 181.0, 0.0, 0.0, 0.0, 176.0, 0.0, 0.0, 0.0,
            171.0, 0.0, 0.0, 0.0, 166.0, 0.0, 0.0, 0.0, 161.0, 0.0, 0.0, 0.0, 156.0, 0.0, 0.0, 0.0, 151.0,
            0.0, 0.0, 0.0, 146.0, 0.0, 0.0, 0.0, 141.0, 0.0, 0.0, 0.0, 136.0, 0.0, 0.0, 0.0, 131.0, 0.0,
            0.0, 0.0, 126.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 116.0, 0.0, 0.0, 0.0, 111.0, 0.0, 0.0,
            0.0, 105.0, 0.0, 0.0, 0.0, 100.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0, 0.0, 90.0, 0.0, 0.0, 0.0,
            85.0, 0.0, 0.0, 0.0, 80.0, 0.0, 0.0, 0.0, 75.0, 0.0, 0.0, 0.0, 70.0, 0.0, 0.0, 0.0, 65.0, 0.0,
            0.0, 0.0, 60.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0, 0.0, 45.0, 0.0, 0.0, 0.0,
            40.0, 0.0, 0.0, 0.0, 35.0, 0.0, 0.0, 0.0, 30.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 20.0, 0.0,
            0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        ])
    };
    CUBEHELIX = {
        r: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 6.0, 0.0, 0.0,
            0.0, 8.0, 0.0, 0.0, 0.0, 9.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 13.0,
            0.0, 0.0, 0.0, 14.0, 0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 17.0, 0.0, 0.0, 0.0, 18.0, 0.0, 0.0,
            0.0, 19.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 22.0,
            0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0,
            0.0, 25.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 26.0,
            0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0,
            0.0, 26.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 26.0,
            0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0,
            0.0, 24.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 23.0,
            0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0,
            0.0, 22.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 21.0,
            0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0,
            0.0, 20.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 21.0,
            0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0,
            0.0, 23.0, 0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 26.0,
            0.0, 0.0, 0.0, 27.0, 0.0, 0.0, 0.0, 27.0, 0.0, 0.0, 0.0, 28.0, 0.0, 0.0, 0.0, 30.0, 0.0, 0.0,
            0.0, 31.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 33.0, 0.0, 0.0, 0.0, 35.0, 0.0, 0.0, 0.0, 36.0,
            0.0, 0.0, 0.0, 38.0, 0.0, 0.0, 0.0, 39.0, 0.0, 0.0, 0.0, 41.0, 0.0, 0.0, 0.0, 43.0, 0.0, 0.0,
            0.0, 45.0, 0.0, 0.0, 0.0, 47.0, 0.0, 0.0, 0.0, 49.0, 0.0, 0.0, 0.0, 51.0, 0.0, 0.0, 0.0, 53.0,
            0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0, 0.0, 60.0, 0.0, 0.0, 0.0, 62.0, 0.0, 0.0,
            0.0, 65.0, 0.0, 0.0, 0.0, 67.0, 0.0, 0.0, 0.0, 70.0, 0.0, 0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 75.0,
            0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 81.0, 0.0, 0.0, 0.0, 83.0, 0.0, 0.0, 0.0, 86.0, 0.0, 0.0,
            0.0, 89.0, 0.0, 0.0, 0.0, 92.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0, 0.0, 98.0, 0.0, 0.0, 0.0,
            101.0, 0.0, 0.0, 0.0, 104.0, 0.0, 0.0, 0.0, 107.0, 0.0, 0.0, 0.0, 110.0, 0.0, 0.0, 0.0, 113.0,
            0.0, 0.0, 0.0, 116.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 123.0, 0.0, 0.0, 0.0, 126.0, 0.0,
            0.0, 0.0, 129.0, 0.0, 0.0, 0.0, 132.0, 0.0, 0.0, 0.0, 135.0, 0.0, 0.0, 0.0, 138.0, 0.0, 0.0,
            0.0, 141.0, 0.0, 0.0, 0.0, 144.0, 0.0, 0.0, 0.0, 147.0, 0.0, 0.0, 0.0, 150.0, 0.0, 0.0, 0.0,
            153.0, 0.0, 0.0, 0.0, 155.0, 0.0, 0.0, 0.0, 158.0, 0.0, 0.0, 0.0, 161.0, 0.0, 0.0, 0.0, 164.0,
            0.0, 0.0, 0.0, 166.0, 0.0, 0.0, 0.0, 169.0, 0.0, 0.0, 0.0, 171.0, 0.0, 0.0, 0.0, 174.0, 0.0,
            0.0, 0.0, 176.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0, 0.0, 181.0, 0.0, 0.0, 0.0, 183.0, 0.0, 0.0,
            0.0, 185.0, 0.0, 0.0, 0.0, 187.0, 0.0, 0.0, 0.0, 189.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0,
            193.0, 0.0, 0.0, 0.0, 194.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 198.0, 0.0, 0.0, 0.0, 199.0,
            0.0, 0.0, 0.0, 201.0, 0.0, 0.0, 0.0, 202.0, 0.0, 0.0, 0.0, 203.0, 0.0, 0.0, 0.0, 204.0, 0.0,
            0.0, 0.0, 205.0, 0.0, 0.0, 0.0, 206.0, 0.0, 0.0, 0.0, 207.0, 0.0, 0.0, 0.0, 208.0, 0.0, 0.0,
            0.0, 209.0, 0.0, 0.0, 0.0, 209.0, 0.0, 0.0, 0.0, 210.0, 0.0, 0.0, 0.0, 211.0, 0.0, 0.0, 0.0,
            211.0, 0.0, 0.0, 0.0, 211.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 212.0,
            0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 212.0, 0.0,
            0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 211.0, 0.0, 0.0, 0.0, 211.0, 0.0, 0.0, 0.0, 211.0, 0.0, 0.0,
            0.0, 210.0, 0.0, 0.0, 0.0, 210.0, 0.0, 0.0, 0.0, 210.0, 0.0, 0.0, 0.0, 209.0, 0.0, 0.0, 0.0,
            208.0, 0.0, 0.0, 0.0, 208.0, 0.0, 0.0, 0.0, 207.0, 0.0, 0.0, 0.0, 207.0, 0.0, 0.0, 0.0, 206.0,
            0.0, 0.0, 0.0, 205.0, 0.0, 0.0, 0.0, 205.0, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 203.0, 0.0,
            0.0, 0.0, 203.0, 0.0, 0.0, 0.0, 202.0, 0.0, 0.0, 0.0, 201.0, 0.0, 0.0, 0.0, 201.0, 0.0, 0.0,
            0.0, 200.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 198.0, 0.0, 0.0, 0.0,
            197.0, 0.0, 0.0, 0.0, 197.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 195.0,
            0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 194.0, 0.0, 0.0, 0.0, 194.0, 0.0, 0.0, 0.0, 194.0, 0.0,
            0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0,
            0.0, 193.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0,
            193.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 194.0, 0.0, 0.0, 0.0, 194.0, 0.0, 0.0, 0.0, 195.0,
            0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 197.0, 0.0,
            0.0, 0.0, 198.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 200.0, 0.0, 0.0,
            0.0, 202.0, 0.0, 0.0, 0.0, 203.0, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 205.0, 0.0, 0.0, 0.0,
            206.0, 0.0, 0.0, 0.0, 208.0, 0.0, 0.0, 0.0, 209.0, 0.0, 0.0, 0.0, 210.0, 0.0, 0.0, 0.0, 212.0,
            0.0, 0.0, 0.0, 213.0, 0.0, 0.0, 0.0, 215.0, 0.0, 0.0, 0.0, 217.0, 0.0, 0.0, 0.0, 218.0, 0.0,
            0.0, 0.0, 220.0, 0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 223.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0,
            0.0, 227.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 231.0, 0.0, 0.0, 0.0, 232.0, 0.0, 0.0, 0.0,
            234.0, 0.0, 0.0, 0.0, 236.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 242.0,
            0.0, 0.0, 0.0, 244.0, 0.0, 0.0, 0.0, 245.0, 0.0, 0.0, 0.0, 247.0, 0.0, 0.0, 0.0, 249.0, 0.0,
            0.0, 0.0, 251.0, 0.0, 0.0, 0.0, 253.0, 0.0, 0.0, 0.0, 255.0
        ]),
        g: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0,
            0.0, 2.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 5.0, 0.0,
            0.0, 0.0, 6.0, 0.0, 0.0, 0.0, 6.0, 0.0, 0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 9.0,
            0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 11.0, 0.0, 0.0, 0.0, 11.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0,
            0.0, 13.0, 0.0, 0.0, 0.0, 14.0, 0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 17.0, 0.0, 0.0, 0.0, 18.0,
            0.0, 0.0, 0.0, 19.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0,
            0.0, 24.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 26.0, 0.0, 0.0, 0.0, 28.0, 0.0, 0.0, 0.0, 29.0,
            0.0, 0.0, 0.0, 31.0, 0.0, 0.0, 0.0, 32.0, 0.0, 0.0, 0.0, 34.0, 0.0, 0.0, 0.0, 35.0, 0.0, 0.0,
            0.0, 37.0, 0.0, 0.0, 0.0, 38.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 41.0, 0.0, 0.0, 0.0, 43.0,
            0.0, 0.0, 0.0, 45.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0,
            0.0, 52.0, 0.0, 0.0, 0.0, 53.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0, 0.0, 58.0,
            0.0, 0.0, 0.0, 60.0, 0.0, 0.0, 0.0, 62.0, 0.0, 0.0, 0.0, 64.0, 0.0, 0.0, 0.0, 66.0, 0.0, 0.0,
            0.0, 67.0, 0.0, 0.0, 0.0, 69.0, 0.0, 0.0, 0.0, 71.0, 0.0, 0.0, 0.0, 73.0, 0.0, 0.0, 0.0, 74.0,
            0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 79.0, 0.0, 0.0, 0.0, 81.0, 0.0, 0.0,
            0.0, 83.0, 0.0, 0.0, 0.0, 84.0, 0.0, 0.0, 0.0, 86.0, 0.0, 0.0, 0.0, 88.0, 0.0, 0.0, 0.0, 89.0,
            0.0, 0.0, 0.0, 91.0, 0.0, 0.0, 0.0, 92.0, 0.0, 0.0, 0.0, 94.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0,
            0.0, 97.0, 0.0, 0.0, 0.0, 98.0, 0.0, 0.0, 0.0, 99.0, 0.0, 0.0, 0.0, 101.0, 0.0, 0.0, 0.0,
            102.0, 0.0, 0.0, 0.0, 103.0, 0.0, 0.0, 0.0, 104.0, 0.0, 0.0, 0.0, 106.0, 0.0, 0.0, 0.0, 107.0,
            0.0, 0.0, 0.0, 108.0, 0.0, 0.0, 0.0, 109.0, 0.0, 0.0, 0.0, 110.0, 0.0, 0.0, 0.0, 111.0, 0.0,
            0.0, 0.0, 112.0, 0.0, 0.0, 0.0, 113.0, 0.0, 0.0, 0.0, 114.0, 0.0, 0.0, 0.0, 114.0, 0.0, 0.0,
            0.0, 115.0, 0.0, 0.0, 0.0, 116.0, 0.0, 0.0, 0.0, 116.0, 0.0, 0.0, 0.0, 117.0, 0.0, 0.0, 0.0,
            118.0, 0.0, 0.0, 0.0, 118.0, 0.0, 0.0, 0.0, 119.0, 0.0, 0.0, 0.0, 119.0, 0.0, 0.0, 0.0, 120.0,
            0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0,
            0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0,
            0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0,
            122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0,
            0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 122.0, 0.0,
            0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0,
            0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0,
            121.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0,
            0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0, 0.0,
            0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0,
            0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0,
            122.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 123.0, 0.0, 0.0, 0.0, 123.0, 0.0, 0.0, 0.0, 124.0,
            0.0, 0.0, 0.0, 124.0, 0.0, 0.0, 0.0, 125.0, 0.0, 0.0, 0.0, 125.0, 0.0, 0.0, 0.0, 126.0, 0.0,
            0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 128.0, 0.0, 0.0, 0.0, 129.0, 0.0, 0.0,
            0.0, 130.0, 0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 132.0, 0.0, 0.0, 0.0,
            133.0, 0.0, 0.0, 0.0, 135.0, 0.0, 0.0, 0.0, 136.0, 0.0, 0.0, 0.0, 137.0, 0.0, 0.0, 0.0, 138.0,
            0.0, 0.0, 0.0, 139.0, 0.0, 0.0, 0.0, 140.0, 0.0, 0.0, 0.0, 142.0, 0.0, 0.0, 0.0, 143.0, 0.0,
            0.0, 0.0, 144.0, 0.0, 0.0, 0.0, 146.0, 0.0, 0.0, 0.0, 147.0, 0.0, 0.0, 0.0, 149.0, 0.0, 0.0,
            0.0, 150.0, 0.0, 0.0, 0.0, 152.0, 0.0, 0.0, 0.0, 154.0, 0.0, 0.0, 0.0, 155.0, 0.0, 0.0, 0.0,
            157.0, 0.0, 0.0, 0.0, 158.0, 0.0, 0.0, 0.0, 160.0, 0.0, 0.0, 0.0, 162.0, 0.0, 0.0, 0.0, 164.0,
            0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 167.0, 0.0, 0.0, 0.0, 169.0, 0.0, 0.0, 0.0, 171.0, 0.0,
            0.0, 0.0, 172.0, 0.0, 0.0, 0.0, 174.0, 0.0, 0.0, 0.0, 176.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0,
            0.0, 180.0, 0.0, 0.0, 0.0, 182.0, 0.0, 0.0, 0.0, 183.0, 0.0, 0.0, 0.0, 185.0, 0.0, 0.0, 0.0,
            187.0, 0.0, 0.0, 0.0, 189.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 193.0, 0.0, 0.0, 0.0, 194.0,
            0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 198.0, 0.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 202.0, 0.0,
            0.0, 0.0, 203.0, 0.0, 0.0, 0.0, 205.0, 0.0, 0.0, 0.0, 207.0, 0.0, 0.0, 0.0, 208.0, 0.0, 0.0,
            0.0, 210.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 213.0, 0.0, 0.0, 0.0, 215.0, 0.0, 0.0, 0.0,
            216.0, 0.0, 0.0, 0.0, 218.0, 0.0, 0.0, 0.0, 219.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 222.0,
            0.0, 0.0, 0.0, 224.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 226.0, 0.0, 0.0, 0.0, 228.0, 0.0,
            0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 231.0, 0.0, 0.0, 0.0, 232.0, 0.0, 0.0,
            0.0, 233.0, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 236.0, 0.0, 0.0, 0.0, 237.0, 0.0, 0.0, 0.0,
            238.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 241.0,
            0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 244.0, 0.0, 0.0, 0.0, 244.0, 0.0,
            0.0, 0.0, 245.0, 0.0, 0.0, 0.0, 246.0, 0.0, 0.0, 0.0, 247.0, 0.0, 0.0, 0.0, 247.0, 0.0, 0.0,
            0.0, 248.0, 0.0, 0.0, 0.0, 248.0, 0.0, 0.0, 0.0, 249.0, 0.0, 0.0, 0.0, 250.0, 0.0, 0.0, 0.0,
            250.0, 0.0, 0.0, 0.0, 251.0, 0.0, 0.0, 0.0, 251.0, 0.0, 0.0, 0.0, 252.0, 0.0, 0.0, 0.0, 252.0,
            0.0, 0.0, 0.0, 253.0, 0.0, 0.0, 0.0, 253.0, 0.0, 0.0, 0.0, 254.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0
        ]),
        b: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 6.0, 0.0, 0.0,
            0.0, 8.0, 0.0, 0.0, 0.0, 9.0, 0.0, 0.0, 0.0, 11.0, 0.0, 0.0, 0.0, 13.0, 0.0, 0.0, 0.0, 15.0,
            0.0, 0.0, 0.0, 17.0, 0.0, 0.0, 0.0, 19.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 23.0, 0.0, 0.0,
            0.0, 25.0, 0.0, 0.0, 0.0, 27.0, 0.0, 0.0, 0.0, 29.0, 0.0, 0.0, 0.0, 31.0, 0.0, 0.0, 0.0, 33.0,
            0.0, 0.0, 0.0, 35.0, 0.0, 0.0, 0.0, 37.0, 0.0, 0.0, 0.0, 39.0, 0.0, 0.0, 0.0, 41.0, 0.0, 0.0,
            0.0, 43.0, 0.0, 0.0, 0.0, 45.0, 0.0, 0.0, 0.0, 47.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 50.0,
            0.0, 0.0, 0.0, 52.0, 0.0, 0.0, 0.0, 54.0, 0.0, 0.0, 0.0, 56.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0,
            0.0, 59.0, 0.0, 0.0, 0.0, 60.0, 0.0, 0.0, 0.0, 62.0, 0.0, 0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 65.0,
            0.0, 0.0, 0.0, 66.0, 0.0, 0.0, 0.0, 67.0, 0.0, 0.0, 0.0, 69.0, 0.0, 0.0, 0.0, 70.0, 0.0, 0.0,
            0.0, 71.0, 0.0, 0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 73.0, 0.0, 0.0, 0.0, 74.0, 0.0, 0.0, 0.0, 74.0,
            0.0, 0.0, 0.0, 75.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 77.0, 0.0, 0.0,
            0.0, 77.0, 0.0, 0.0, 0.0, 77.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 78.0,
            0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0,
            0.0, 77.0, 0.0, 0.0, 0.0, 77.0, 0.0, 0.0, 0.0, 77.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 76.0,
            0.0, 0.0, 0.0, 75.0, 0.0, 0.0, 0.0, 75.0, 0.0, 0.0, 0.0, 74.0, 0.0, 0.0, 0.0, 73.0, 0.0, 0.0,
            0.0, 73.0, 0.0, 0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 71.0, 0.0, 0.0, 0.0, 70.0, 0.0, 0.0, 0.0, 69.0,
            0.0, 0.0, 0.0, 68.0, 0.0, 0.0, 0.0, 67.0, 0.0, 0.0, 0.0, 66.0, 0.0, 0.0, 0.0, 66.0, 0.0, 0.0,
            0.0, 65.0, 0.0, 0.0, 0.0, 64.0, 0.0, 0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 61.0, 0.0, 0.0, 0.0, 60.0,
            0.0, 0.0, 0.0, 59.0, 0.0, 0.0, 0.0, 58.0, 0.0, 0.0, 0.0, 58.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0,
            0.0, 56.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 54.0, 0.0, 0.0, 0.0, 53.0, 0.0, 0.0, 0.0, 52.0,
            0.0, 0.0, 0.0, 51.0, 0.0, 0.0, 0.0, 51.0, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0, 0.0, 49.0, 0.0, 0.0,
            0.0, 49.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 47.0, 0.0, 0.0, 0.0, 47.0,
            0.0, 0.0, 0.0, 47.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0,
            0.0, 46.0, 0.0, 0.0, 0.0, 46.0, 0.0, 0.0, 0.0, 47.0, 0.0, 0.0, 0.0, 47.0, 0.0, 0.0, 0.0, 47.0,
            0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 49.0, 0.0, 0.0, 0.0, 50.0, 0.0, 0.0,
            0.0, 50.0, 0.0, 0.0, 0.0, 51.0, 0.0, 0.0, 0.0, 52.0, 0.0, 0.0, 0.0, 53.0, 0.0, 0.0, 0.0, 55.0,
            0.0, 0.0, 0.0, 56.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0, 0.0, 59.0, 0.0, 0.0, 0.0, 60.0, 0.0, 0.0,
            0.0, 62.0, 0.0, 0.0, 0.0, 64.0, 0.0, 0.0, 0.0, 65.0, 0.0, 0.0, 0.0, 67.0, 0.0, 0.0, 0.0, 69.0,
            0.0, 0.0, 0.0, 71.0, 0.0, 0.0, 0.0, 74.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 78.0, 0.0, 0.0,
            0.0, 81.0, 0.0, 0.0, 0.0, 83.0, 0.0, 0.0, 0.0, 86.0, 0.0, 0.0, 0.0, 88.0, 0.0, 0.0, 0.0, 91.0,
            0.0, 0.0, 0.0, 94.0, 0.0, 0.0, 0.0, 96.0, 0.0, 0.0, 0.0, 99.0, 0.0, 0.0, 0.0, 102.0, 0.0, 0.0,
            0.0, 105.0, 0.0, 0.0, 0.0, 108.0, 0.0, 0.0, 0.0, 111.0, 0.0, 0.0, 0.0, 114.0, 0.0, 0.0, 0.0,
            117.0, 0.0, 0.0, 0.0, 120.0, 0.0, 0.0, 0.0, 124.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 130.0,
            0.0, 0.0, 0.0, 133.0, 0.0, 0.0, 0.0, 136.0, 0.0, 0.0, 0.0, 140.0, 0.0, 0.0, 0.0, 143.0, 0.0,
            0.0, 0.0, 146.0, 0.0, 0.0, 0.0, 149.0, 0.0, 0.0, 0.0, 153.0, 0.0, 0.0, 0.0, 156.0, 0.0, 0.0,
            0.0, 159.0, 0.0, 0.0, 0.0, 162.0, 0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 169.0, 0.0, 0.0, 0.0,
            172.0, 0.0, 0.0, 0.0, 175.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0, 0.0, 181.0, 0.0, 0.0, 0.0, 184.0,
            0.0, 0.0, 0.0, 186.0, 0.0, 0.0, 0.0, 189.0, 0.0, 0.0, 0.0, 192.0, 0.0, 0.0, 0.0, 195.0, 0.0,
            0.0, 0.0, 197.0, 0.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 203.0, 0.0, 0.0, 0.0, 205.0, 0.0, 0.0,
            0.0, 207.0, 0.0, 0.0, 0.0, 210.0, 0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 214.0, 0.0, 0.0, 0.0,
            216.0, 0.0, 0.0, 0.0, 218.0, 0.0, 0.0, 0.0, 220.0, 0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 224.0,
            0.0, 0.0, 0.0, 226.0, 0.0, 0.0, 0.0, 227.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 230.0, 0.0,
            0.0, 0.0, 231.0, 0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 234.0, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0,
            0.0, 236.0, 0.0, 0.0, 0.0, 237.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0,
            239.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0, 0.0, 242.0,
            0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 243.0, 0.0,
            0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0,
            0.0, 243.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0,
            242.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 241.0,
            0.0, 0.0, 0.0, 241.0, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0, 0.0, 240.0, 0.0,
            0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0,
            0.0, 239.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0,
            238.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 238.0,
            0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 239.0, 0.0,
            0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0, 0.0, 240.0, 0.0, 0.0,
            0.0, 241.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0,
            244.0, 0.0, 0.0, 0.0, 245.0, 0.0, 0.0, 0.0, 246.0, 0.0, 0.0, 0.0, 247.0, 0.0, 0.0, 0.0, 248.0,
            0.0, 0.0, 0.0, 249.0, 0.0, 0.0, 0.0, 250.0, 0.0, 0.0, 0.0, 252.0, 0.0, 0.0, 0.0, 253.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0
        ])
    };
    EOSB = {
        r: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 9.0, 0.0, 0.0, 0.0, 18.0,
            0.0, 0.0, 0.0, 27.0, 0.0, 0.0, 0.0, 36.0, 0.0, 0.0, 0.0, 45.0, 0.0, 0.0, 0.0, 49.0, 0.0, 0.0,
            0.0, 57.0, 0.0, 0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 81.0, 0.0, 0.0, 0.0, 91.0, 0.0, 0.0, 0.0,
            100.0, 0.0, 0.0, 0.0, 109.0, 0.0, 0.0, 0.0, 118.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 136.0,
            0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 139.0, 0.0, 0.0, 0.0, 163.0, 0.0, 0.0, 0.0, 173.0, 0.0,
            0.0, 0.0, 182.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 209.0, 0.0, 0.0,
            0.0, 218.0, 0.0, 0.0, 0.0, 227.0, 0.0, 0.0, 0.0, 213.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0,
            0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0,
            0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 253.0, 0.0, 0.0, 0.0, 251.0, 0.0, 0.0, 0.0, 249.0, 0.0,
            0.0, 0.0, 247.0, 0.0, 0.0, 0.0, 245.0, 0.0, 0.0, 0.0, 243.0, 0.0, 0.0, 0.0, 241.0, 0.0, 0.0,
            0.0, 215.0, 0.0, 0.0, 0.0, 214.0, 0.0, 0.0, 0.0, 235.0, 0.0, 0.0, 0.0, 234.0, 0.0, 0.0, 0.0,
            232.0, 0.0, 0.0, 0.0, 230.0, 0.0, 0.0, 0.0, 228.0, 0.0, 0.0, 0.0, 226.0, 0.0, 0.0, 0.0, 224.0,
            0.0, 0.0, 0.0, 222.0, 0.0, 0.0, 0.0, 198.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 216.0, 0.0,
            0.0, 0.0, 215.0, 0.0, 0.0, 0.0, 213.0, 0.0, 0.0, 0.0, 211.0, 0.0, 0.0, 0.0, 209.0, 0.0, 0.0,
            0.0, 207.0, 0.0, 0.0, 0.0, 205.0, 0.0, 0.0, 0.0, 203.0, 0.0, 0.0, 0.0, 181.0, 0.0, 0.0, 0.0,
            179.0, 0.0, 0.0, 0.0, 197.0, 0.0, 0.0, 0.0, 196.0, 0.0, 0.0, 0.0, 194.0, 0.0, 0.0, 0.0, 192.0,
            0.0, 0.0, 0.0, 190.0, 0.0, 0.0, 0.0, 188.0, 0.0, 0.0, 0.0, 186.0, 0.0, 0.0, 0.0, 184.0, 0.0,
            0.0, 0.0, 164.0, 0.0, 0.0, 0.0, 162.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0, 0.0, 176.0, 0.0, 0.0,
            0.0, 175.0, 0.0, 0.0, 0.0, 173.0, 0.0, 0.0, 0.0, 171.0, 0.0, 0.0, 0.0, 169.0, 0.0, 0.0, 0.0,
            167.0, 0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 147.0, 0.0, 0.0, 0.0, 145.0, 0.0, 0.0, 0.0, 159.0,
            0.0, 0.0, 0.0, 157.0, 0.0, 0.0, 0.0, 156.0, 0.0, 0.0, 0.0, 154.0, 0.0, 0.0, 0.0, 152.0, 0.0,
            0.0, 0.0, 150.0, 0.0, 0.0, 0.0, 148.0, 0.0, 0.0, 0.0, 146.0, 0.0, 0.0, 0.0, 130.0, 0.0, 0.0,
            0.0, 128.0, 0.0, 0.0, 0.0, 140.0, 0.0, 0.0, 0.0, 138.0, 0.0, 0.0, 0.0, 137.0, 0.0, 0.0, 0.0,
            135.0, 0.0, 0.0, 0.0, 133.0, 0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 129.0, 0.0, 0.0, 0.0, 127.0,
            0.0, 0.0, 0.0, 113.0, 0.0, 0.0, 0.0, 111.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 119.0, 0.0,
            0.0, 0.0, 117.0, 0.0, 0.0, 0.0, 117.0, 0.0, 0.0, 0.0
        ]),
        g: new Float32Array([
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 7.0,
            0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 23.0, 0.0, 0.0, 0.0, 31.0, 0.0, 0.0, 0.0, 39.0, 0.0, 0.0,
            0.0, 47.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0, 0.0, 64.0, 0.0, 0.0, 0.0, 79.0,
            0.0, 0.0, 0.0, 87.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0, 0.0, 103.0, 0.0, 0.0, 0.0, 111.0, 0.0,
            0.0, 0.0, 119.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 135.0, 0.0, 0.0, 0.0, 129.0, 0.0, 0.0,
            0.0, 136.0, 0.0, 0.0, 0.0, 159.0, 0.0, 0.0, 0.0, 167.0, 0.0, 0.0, 0.0, 175.0, 0.0, 0.0, 0.0,
            183.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 207.0, 0.0, 0.0, 0.0, 215.0,
            0.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 207.0, 0.0, 0.0, 0.0, 239.0, 0.0, 0.0, 0.0, 247.0, 0.0,
            0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0,
            0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 229.0, 0.0,
            0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0,
            0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0,
            255.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 250.0,
            0.0, 0.0, 0.0, 246.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 233.0, 0.0,
            0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 198.0, 0.0, 0.0, 0.0, 195.0, 0.0, 0.0,
            0.0, 212.0, 0.0, 0.0, 0.0, 208.0, 0.0, 0.0, 0.0, 204.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0,
            195.0, 0.0, 0.0, 0.0, 191.0, 0.0, 0.0, 0.0, 187.0, 0.0, 0.0, 0.0, 182.0, 0.0, 0.0, 0.0, 160.0,
            0.0, 0.0, 0.0, 156.0, 0.0, 0.0, 0.0, 169.0, 0.0, 0.0, 0.0, 165.0, 0.0, 0.0, 0.0, 161.0, 0.0,
            0.0, 0.0, 157.0, 0.0, 0.0, 0.0, 153.0, 0.0, 0.0, 0.0, 148.0, 0.0, 0.0, 0.0, 144.0, 0.0, 0.0,
            0.0, 140.0, 0.0, 0.0, 0.0, 122.0, 0.0, 0.0, 0.0, 118.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0,
            125.0, 0.0, 0.0, 0.0, 123.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 119.0, 0.0, 0.0, 0.0, 116.0,
            0.0, 0.0, 0.0, 114.0, 0.0, 0.0, 0.0, 112.0, 0.0, 0.0, 0.0, 99.0, 0.0, 0.0, 0.0, 97.0, 0.0,
            0.0, 0.0, 106.0, 0.0, 0.0, 0.0, 104.0, 0.0, 0.0, 0.0, 102.0, 0.0, 0.0, 0.0, 99.0, 0.0, 0.0,
            0.0, 97.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0, 0.0, 93.0, 0.0, 0.0, 0.0, 91.0, 0.0, 0.0, 0.0, 80.0,
            0.0, 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 84.0, 0.0, 0.0, 0.0, 82.0, 0.0, 0.0, 0.0, 80.0, 0.0, 0.0,
            0.0, 78.0, 0.0, 0.0, 0.0, 76.0, 0.0, 0.0, 0.0, 74.0, 0.0, 0.0, 0.0, 72.0, 0.0, 0.0, 0.0, 70.0,
            0.0, 0.0, 0.0, 61.0, 0.0, 0.0, 0.0, 59.0, 0.0, 0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 61.0, 0.0, 0.0,
            0.0, 59.0, 0.0, 0.0, 0.0, 57.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 53.0, 0.0, 0.0, 0.0, 50.0,
            0.0, 0.0, 0.0, 48.0, 0.0, 0.0, 0.0, 42.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 42.0, 0.0, 0.0,
            0.0, 40.0, 0.0, 0.0, 0.0, 38.0, 0.0, 0.0, 0.0, 36.0, 0.0, 0.0, 0.0, 33.0, 0.0, 0.0, 0.0, 31.0,
            0.0, 0.0, 0.0, 29.0, 0.0, 0.0, 0.0, 27.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0,
            0.0, 21.0, 0.0, 0.0, 0.0, 19.0, 0.0, 0.0, 0.0, 16.0, 0.0, 0.0, 0.0, 14.0, 0.0, 0.0, 0.0, 12.0,
            0.0, 0.0, 0.0, 13.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 6.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        ]),
        b: new Float32Array([
            116.0, 0.0, 0.0, 0.0, 121.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 131.0, 0.0, 0.0, 0.0, 136.0,
            0.0, 0.0, 0.0, 140.0, 0.0, 0.0, 0.0, 144.0, 0.0, 0.0, 0.0, 148.0, 0.0, 0.0, 0.0, 153.0, 0.0,
            0.0, 0.0, 157.0, 0.0, 0.0, 0.0, 145.0, 0.0, 0.0, 0.0, 149.0, 0.0, 0.0, 0.0, 170.0, 0.0, 0.0,
            0.0, 174.0, 0.0, 0.0, 0.0, 178.0, 0.0, 0.0, 0.0, 182.0, 0.0, 0.0, 0.0, 187.0, 0.0, 0.0, 0.0,
            191.0, 0.0, 0.0, 0.0, 195.0, 0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 183.0, 0.0, 0.0, 0.0, 187.0,
            0.0, 0.0, 0.0, 212.0, 0.0, 0.0, 0.0, 216.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 225.0, 0.0,
            0.0, 0.0, 229.0, 0.0, 0.0, 0.0, 233.0, 0.0, 0.0, 0.0, 238.0, 0.0, 0.0, 0.0, 242.0, 0.0, 0.0,
            0.0, 221.0, 0.0, 0.0, 0.0, 225.0, 0.0, 0.0, 0.0, 255.0, 0.0, 0.0, 0.0, 247.0, 0.0, 0.0, 0.0,
            239.0, 0.0, 0.0, 0.0, 231.0, 0.0, 0.0, 0.0, 223.0, 0.0, 0.0, 0.0, 215.0, 0.0, 0.0, 0.0, 207.0,
            0.0, 0.0, 0.0, 199.0, 0.0, 0.0, 0.0, 172.0, 0.0, 0.0, 0.0, 164.0, 0.0, 0.0, 0.0, 175.0, 0.0,
            0.0, 0.0, 167.0, 0.0, 0.0, 0.0, 159.0, 0.0, 0.0, 0.0, 151.0, 0.0, 0.0, 0.0, 143.0, 0.0, 0.0,
            0.0, 135.0, 0.0, 0.0, 0.0, 127.0, 0.0, 0.0, 0.0, 119.0, 0.0, 0.0, 0.0, 100.0, 0.0, 0.0, 0.0,
            93.0, 0.0, 0.0, 0.0, 95.0, 0.0, 0.0, 0.0, 87.0, 0.0, 0.0, 0.0, 79.0, 0.0, 0.0, 0.0, 71.0, 0.0,
            0.0, 0.0, 63.0, 0.0, 0.0, 0.0, 55.0, 0.0, 0.0, 0.0, 47.0, 0.0, 0.0, 0.0, 39.0, 0.0, 0.0, 0.0,
            28.0, 0.0, 0.0, 0.0, 21.0, 0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.0, 0.0
        ])
    };
}
const colorMap = new ColorMap();
//# sourceMappingURL=ColorMap.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/FoVHelper.js":
/*!*******************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/FoVHelper.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   fovHelper: () => (/* binding */ fovHelper)
/* harmony export */ });
// FoVHelper.ts

class FoVHelper {
    getHiPSNorder(fov) {
        if (fov >= 179)
            return 0;
        if (fov >= 90)
            return 1;
        if (fov >= 30)
            return 2;
        if (fov >= 20)
            return 3;
        if (fov >= 6)
            return 4;
        if (fov >= 3.2)
            return 5;
        if (fov >= 1.6)
            return 6;
        if (fov >= 0.85)
            return 7;
        if (fov >= 0.42)
            return 8;
        if (fov >= 0.21)
            return 9;
        if (fov >= 0.12)
            return 10;
        if (fov >= 0.06)
            return 11;
        if (fov < 0.015)
            return 12;
        return 13;
    }
    getRADegSteps(fov) {
        let raStep;
        let decStep;
        if (fov >= 179) {
            raStep = 10;
            decStep = 10;
        }
        else if (fov >= 25) {
            raStep = 9;
            decStep = 9;
        }
        else if (fov >= 12.5) {
            raStep = 8;
            decStep = 8;
        }
        else if (fov >= 6) {
            raStep = 6;
            decStep = 6;
        }
        else if (fov >= 3.2) {
            raStep = 5;
            decStep = 5;
        }
        else if (fov >= 1.6) {
            raStep = 4;
            decStep = 4;
        }
        else if (fov >= 0.85) {
            raStep = 3;
            decStep = 3;
        }
        else if (fov >= 0.42) {
            raStep = 2;
            decStep = 2;
        }
        else if (fov >= 0.21) {
            raStep = 1;
            decStep = 1;
        }
        else if (fov >= 0.12) {
            raStep = 0.5;
            decStep = 0.5;
        }
        else if (fov >= 0.06) {
            raStep = 0.25;
            decStep = 0.25;
        }
        else {
            raStep = 10;
            decStep = 10;
        }
        return { raStep, decStep };
    }
    getRefOrder(order) {
        switch (order) {
            case 0:
            case 1:
            case 2:
            case 3:
                return order + 6;
            case 4:
            case 5:
            case 6:
            case 7:
                return order + 5;
            case 8:
                return order + 4;
            default:
                return order + 3;
        }
    }
}
const fovHelper = new FoVHelper();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FoVHelper);
//# sourceMappingURL=FoVHelper.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/HiPS.js":
/*!**************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/HiPS.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractSkyEntity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../AbstractSkyEntity.js */ "../astro-viewer/lib-esm/model/AbstractSkyEntity.js");
/* harmony import */ var _FoVHelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FoVHelper.js */ "../astro-viewer/lib-esm/model/hips/FoVHelper.js");
/* harmony import */ var _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TileBuffer.js */ "../astro-viewer/lib-esm/model/hips/TileBuffer.js");
/* harmony import */ var _ColorMaps_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ColorMaps.js */ "../astro-viewer/lib-esm/model/ColorMaps.js");
/* harmony import */ var _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shader/HiPSShaderProgram.js */ "../astro-viewer/lib-esm/shader/HiPSShaderProgram.js");
/* harmony import */ var _AncestorTile_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AncestorTile.js */ "../astro-viewer/lib-esm/model/hips/AncestorTile.js");
/* harmony import */ var _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./VisibleTilesManager.js */ "../astro-viewer/lib-esm/model/hips/VisibleTilesManager.js");
/* harmony import */ var _AllSky_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AllSky.js */ "../astro-viewer/lib-esm/model/hips/AllSky.js");
/* harmony import */ var _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../grid/HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils/ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");

/**
 * @author Fabrizio Giordano (Fab77)
 */











class HiPS extends _AbstractSkyEntity_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    _ancestorTiles;
    _allSkyTile;
    _format;
    _baseurl;
    _maxorder;
    _minorder;
    _visibleorder = 3;
    _allSky = true;
    samplerIdx = 0;
    colorMapIdx = 0;
    colorMap = _ColorMaps_js__WEBPACK_IMPORTED_MODULE_3__["default"]['native'];
    // exposed read-only helpers
    get maxOrder() { return this._maxorder; }
    get minOrder() { return this._minorder; }
    get baseURL() { return this._baseurl; }
    get format() { return this._format; }
    constructor(radius, position, xrad, yrad, descriptor) {
        super(radius, position, xrad, yrad, descriptor.surveyName, descriptor.isGalactic);
        this.initGL(_Global_js__WEBPACK_IMPORTED_MODULE_9__["default"].gl);
        _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.addHiPS(this);
        // DEBUG logs kept from JS (optional)
        // eslint-disable-next-line no-console
        console.log('HiPS frame ' + descriptor.hipsFrame);
        // eslint-disable-next-line no-console
        console.log('HiPS minOrder ' + descriptor.minOrder);
        this._format = descriptor.imgFormats[0];
        this._baseurl = descriptor.url;
        this._maxorder = descriptor.maxOrder;
        this._minorder = descriptor.minOrder;
        this.initShaders();
        // pick initial order from a starting FoV
        const fov = 180;
        let order = _FoVHelper_js__WEBPACK_IMPORTED_MODULE_1__.fovHelper.getHiPSNorder(fov);
        this._visibleorder = Math.min(order, this._maxorder);
        this._ancestorTiles = [];
        this._allSkyTile = null;
        // auto-detect all-sky: original code forces true
        this._allSky = true;
        if (this._allSky) {
            this._allSkyTile = new _AllSky_js__WEBPACK_IMPORTED_MODULE_7__["default"](this);
        }
        else {
            for (let t = 0; t < 12; t++) {
                this._ancestorTiles.push(new _AncestorTile_js__WEBPACK_IMPORTED_MODULE_5__["default"](t, 0, this));
            }
        }
    }
    changeFormat(format) {
        this._format = format;
        // original code referenced _tileBuffer; if you have one, wire it back.
        // Keeping calls no-op to avoid breaking at runtime if _tileBuffer is undefined.
        // (newVisibleTilesManager + TileBuffer drive the actual tile lifecycle)
        // @ts-ignore
        if (this._tileBuffer?.clearAll)
            this._tileBuffer.clearAll();
        // @ts-ignore
        if (this._tileBuffer)
            this._tileBuffer._format = this._format;
        const pixelByOrder = this.isGalacticHips
            ? _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.galVisibleTilesByOrder
            : _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.visibleTilesByOrder;
        // @ts-ignore
        if (this._tileBuffer?.updateTiles)
            this._tileBuffer.updateTiles(pixelByOrder.pixels, pixelByOrder.order);
    }
    /**
     * Shader colormap switcher
     * 0 -> native
     * 1 -> grayscale
     * 2 -> planck
     * 3 -> cmb
     * 4 -> rainbow
     * 5 -> eosb
     * 6 -> cubehelix
     */
    changeColorMap(colorMap) {
        this.colorMap = colorMap;
        switch (colorMap.name) {
            case 'grayscale':
                this.colorMapIdx = 1;
                _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.setGrayscaleShader();
                break;
            case 'planck':
                this.colorMapIdx = 2;
                _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.setColorMapShader();
                break;
            case 'cmb':
                this.colorMapIdx = 3;
                _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.setColorMapShader();
                break;
            case 'rainbow':
                this.colorMapIdx = 4;
                _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.setColorMapShader();
                break;
            case 'eosb':
                this.colorMapIdx = 5;
                _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.setColorMapShader();
                break;
            case 'cubehelix':
                this.colorMapIdx = 6;
                _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.setColorMapShader();
                break;
            default:
                this.colorMapIdx = 0;
                _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.setNativeShader();
        }
    }
    initShaders() {
        _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.enableProgram();
        this.shaderProgram = _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_4__.hipsShaderProgram.shaderProgram;
    }
    getCurrentHealpixOrder() {
        return this._visibleorder;
    }
    refresh() {
        const fov = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_8__["default"].getMinFoV();
        this._visibleorder = Math.min(_FoVHelper_js__WEBPACK_IMPORTED_MODULE_1__.fovHelper.getHiPSNorder(fov), this._maxorder);
    }
    draw() {
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_9__["default"].camera || _Global_js__WEBPACK_IMPORTED_MODULE_9__["default"].camera.getCameraMatrix() === undefined)
            return;
        this.refresh();
        const vMatrix = _Global_js__WEBPACK_IMPORTED_MODULE_9__["default"].camera.getCameraMatrix();
        const pMatrix = _utils_ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_10__["default"].pMatrix;
        const mMatrix = this.getModelMatrix();
        if (this._allSky && this._allSkyTile) {
            if (this.isGalacticHips) {
                this._allSkyTile.draw(_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.galVisibleTilesByOrder.order, _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.galAncestorsMap, pMatrix, vMatrix, mMatrix, this.colorMapIdx);
            }
            else {
                this._allSkyTile.draw(_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.visibleTilesByOrder.order, _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.ancestorsMap, pMatrix, vMatrix, mMatrix, this.colorMapIdx);
            }
            return;
        }
        // Non all-sky path
        const order = this.isGalacticHips
            ? _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.galVisibleTilesByOrder.order
            : _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.visibleTilesByOrder.order;
        const map = this.isGalacticHips
            ? _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.galAncestorsMap
            : _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_6__.visibleTilesManager.ancestorsMap;
        this._ancestorTiles.forEach((ancestor) => {
            ancestor.draw(order, map, pMatrix, vMatrix, mMatrix, this.colorMapIdx);
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HiPS);
//# sourceMappingURL=HiPS.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/HiPSDescriptor.js":
/*!************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/HiPSDescriptor.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HiPSDescriptor: () => (/* binding */ HiPSDescriptor)
/* harmony export */ });
// HiPSDescriptor.ts

class HiPSDescriptor {
    _minOrder = 3;
    _imgformats = [];
    _datarange = { min: undefined, max: undefined };
    _maxOrder;
    _tilewidth;
    _hipsFrame;
    _hipsName = 'NONAME';
    _hipsurl;
    _emMin;
    _emMax;
    _isGalctic = false;
    constructor(hipsproperties, hipsurl) {
        this._hipsurl = hipsurl;
        const lines = hipsproperties.split(/\r\n|\n/);
        for (const raw of lines) {
            const line = raw.trim();
            if (!line || line.startsWith('#'))
                continue;
            if (line.startsWith('hips_tile_format') || line.startsWith('format')) {
                // normalize jpeg→jpg
                const list = this.getValue(line)?.replace(/jpeg/gi, 'jpg') ?? '';
                this._imgformats = list.split(/\s+/).filter(Boolean);
            }
            else if (line.startsWith('hips_data_range')) {
                const v = this.getValue(line);
                if (v) {
                    const [minStr, maxStr] = v.split(/\s+/);
                    this._datarange.min = parseFloat(minStr);
                    this._datarange.max = parseFloat(maxStr);
                }
            }
            else if (line.startsWith('hips_tile_width')) {
                const n = Number(this.getValue(line));
                this._tilewidth = Number.isFinite(n) ? n : undefined;
            }
            else if (line.startsWith('hips_order_min')) {
                const n = Number(this.getValue(line));
                this._minOrder = Number.isFinite(n) ? n : this._minOrder;
            }
            else if (line.startsWith('hips_order') || line.startsWith('maxOrder')) {
                const n = Number(this.getValue(line));
                this._maxOrder = Number.isFinite(n) ? n : this._maxOrder;
            }
            else if (line.startsWith('hips_frame') || line.startsWith('frame')) {
                this._hipsFrame = this.getValue(line);
            }
            else if (line.startsWith('obs_collection') || line.startsWith('label')) {
                this._hipsName = this.getValue(line) ?? this._hipsName;
            }
            else if (line.startsWith('em_min')) {
                const n = Number(this.getValue(line));
                this._emMin = Number.isFinite(n) ? n : undefined;
            }
            else if (line.startsWith('em_max')) {
                const n = Number(this.getValue(line));
                this._emMax = Number.isFinite(n) ? n : undefined;
            }
        }
        if (!this._hipsName) {
            console.warn(`[HiPSDescriptor] hipsName not defined in properties of ${this._hipsurl}. Defaulting to 'NONAME'.`);
        }
        if (!this._hipsFrame) {
            console.warn(`[HiPSDescriptor] hips_frame not defined in properties of ${this._hipsurl}. Defaulting to 'equatorial'.`);
            this._hipsFrame = 'equatorial';
        }
        this._isGalctic = this._hipsFrame.toLowerCase().includes('gal');
        if (this._maxOrder === undefined || this._imgformats.length === 0) {
            throw new Error(`[HiPSDescriptor] Invalid properties for ${this._hipsurl}. maxOrder=${this._maxOrder}, imgFormats.length=${this._imgformats.length}`);
        }
    }
    getValue(line) {
        const idx = line.indexOf('=');
        if (idx < 0)
            return undefined;
        return line.slice(idx + 1).trim();
    }
    // --- Getters ---
    get surveyName() {
        return this._hipsName;
    }
    get url() {
        return this._hipsurl;
    }
    get maxOrder() {
        return this._maxOrder;
    }
    get minOrder() {
        return this._minOrder;
    }
    get imgFormats() {
        return this._imgformats;
    }
    get hipsFrame() {
        return this._hipsFrame;
    }
    get isGalactic() {
        return this._isGalctic;
    }
    get emMin() {
        return this._emMin;
    }
    get emMax() {
        return this._emMax;
    }
    get tileWidth() {
        return this._tilewidth;
    }
    get dataRange() {
        return this._datarange;
    }
}
//# sourceMappingURL=HiPSDescriptor.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/Tile.js":
/*!**************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/Tile.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Tile)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shader/HiPSShaderProgram.js */ "../astro-viewer/lib-esm/shader/HiPSShaderProgram.js");
/* harmony import */ var _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TileBuffer.js */ "../astro-viewer/lib-esm/model/hips/TileBuffer.js");
/* harmony import */ var _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./VisibleTilesManager.js */ "../astro-viewer/lib-esm/model/hips/VisibleTilesManager.js");
/* harmony import */ var _FoVHelper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FoVHelper.js */ "../astro-viewer/lib-esm/model/hips/FoVHelper.js");
// Tile.ts





// ------------------------------------------------------------------------
class Tile {
    _hips;
    _tileno;
    _baseurl;
    _order;
    _format;
    _maxorder;
    _isGalacticHips;
    _ready = false;
    _abort = false;
    _image;
    _textureLoaded = false;
    _texture;
    _texurl = '';
    _hipsShaderIndex = 0;
    _cacheTime0;
    _inView = true;
    _amIStillInFoV_requsetID;
    // geometry buffers
    vertexPosition = [];
    vertexPositionBuffer = [];
    vertexIndices = new Uint16Array();
    vertexIndexBuffer;
    opacity = 1.0;
    constructor(tileno, order, hips) {
        this._hips = hips;
        this._tileno = tileno;
        this._format = hips.format;
        this._baseurl = hips.baseURL;
        this._maxorder = hips.maxOrder;
        this._isGalacticHips = hips.isGalacticHips;
        this._order = order;
        this._amIStillInFoV_requsetID = window.setInterval(() => {
            this.amIStillInFoV();
        }, 5000);
        this.initImage();
    }
    destroyIntervals() {
        window.clearInterval(this._amIStillInFoV_requsetID);
    }
    getReadyState() {
        return this._ready;
    }
    get cacheTime0() {
        return this._cacheTime0;
    }
    resetCacheTime0() {
        this._cacheTime0 = undefined;
    }
    setCacheTime0() {
        this._cacheTime0 = new Date().getTime();
    }
    initImage() {
        this._image = new Image();
        const dirnumber = Math.floor(this._tileno / 10000) * 10000;
        this._texurl = `${this._baseurl}/Norder${this._order}/Dir${dirnumber}/Npix${this._tileno}.${this._format}`;
        this._image.onload = () => this.imageLoaded();
        this._image.onerror = () => {
            console.error('File not found?', this._texurl);
            this._ready = false;
            this._abort = true;
            this.destroyIntervals();
        };
        this._image.crossOrigin = 'anonymous';
        this._image.src = this._texurl;
    }
    imageLoaded() {
        this.textureLoaded();
        this.initModelBuffer();
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
        this._textureLoaded = true;
        if (this._textureLoaded)
            this._ready = true;
    }
    textureLoaded() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.enableProgram();
        this._texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // FIX: use the sampler location we fetched in enableShaders()
        gl.uniform1i(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.sampler, this._hipsShaderIndex);
        if (!gl.isTexture(this._texture)) {
            console.warn('Texture creation failed');
        }
    }
    initModelBuffer() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this.vertexPosition = [];
        this.vertexPositionBuffer = [];
        this.vertexIndices = new Uint16Array();
        const reforder = _FoVHelper_js__WEBPACK_IMPORTED_MODULE_4__.fovHelper.getRefOrder(this._order);
        const orighealpix = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].getHealpix(this._order);
        const origxyf = orighealpix.nest2xyf(this._tileno);
        const orderjump = reforder - this._order;
        const dxmin = origxyf.ix << orderjump;
        const dxmax = (origxyf.ix << orderjump) + (1 << orderjump);
        const dymin = origxyf.iy << orderjump;
        const dymax = (origxyf.iy << orderjump) + (1 << orderjump);
        const healpix = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].getHealpix(reforder);
        this.setupPositionAndTexture4Quadrant2(dxmin, dxmin + (dxmax - dxmin) / 2, dymin, dymin + (dymax - dymin) / 2, 0, healpix, orderjump, origxyf);
        this.setupPositionAndTexture4Quadrant2(dxmin + (dxmax - dxmin) / 2, dxmax, dymin, dymin + (dymax - dymin) / 2, 1, healpix, orderjump, origxyf);
        this.setupPositionAndTexture4Quadrant2(dxmin, dxmin + (dxmax - dxmin) / 2, dymin + (dymax - dymin) / 2, dymax, 2, healpix, orderjump, origxyf);
        this.setupPositionAndTexture4Quadrant2(dxmin + (dxmax - dxmin) / 2, dxmax, dymin + (dymax - dymin) / 2, dymax, 3, healpix, orderjump, origxyf);
        const pixelsXQuadrant = this.vertexPosition[0].length / 20;
        const idx = this.computeVertexIndices(pixelsXQuadrant);
        // If large, upgrade to Uint32 indices
        if (idx.length > 65535) {
            // Optional: require OES_element_index_uint if you’re still on WebGL1
            this.vertexIndices = new Uint32Array(idx);
        }
        else {
            this.vertexIndices = new Uint16Array(idx);
        }
        this.vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndices, gl.STATIC_DRAW);
    }
    computeVertexIndices(pixelsXQuadrant) {
        const vertexIndices = new Uint32Array(6 * pixelsXQuadrant);
        let baseFaceIndex = 0;
        for (let j = 0; j < pixelsXQuadrant; j++) {
            const b = baseFaceIndex;
            vertexIndices[6 * j] = b;
            vertexIndices[6 * j + 1] = b + 1;
            vertexIndices[6 * j + 2] = b + 2;
            vertexIndices[6 * j + 3] = b + 2;
            vertexIndices[6 * j + 4] = b + 3;
            vertexIndices[6 * j + 5] = b;
            baseFaceIndex += 4;
        }
        return vertexIndices;
    }
    setupPositionAndTexture4Quadrant2(dxmin, dxmax, dymin, dymax, qidx, healpix, orderjump, origxyf) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this.vertexPosition[qidx] = new Float32Array(20 * (dxmax - dxmin) * (dymax - dymin));
        const step = 1 / (1 << orderjump);
        let p = 0;
        const s_pixel_size = 0;
        const t_pixel_size = 0;
        for (let dx = dxmin; dx < dxmax; dx++) {
            for (let dy = dymin; dy < dymax; dy++) {
                const facesVec3Array = healpix.getPointsForXyfNoStep(dx, dy, origxyf.face);
                const uindex = dy - (origxyf.iy << orderjump);
                const vindex = dx - (origxyf.ix << orderjump);
                // v0
                this.vertexPosition[qidx][20 * p] = facesVec3Array[0].x;
                this.vertexPosition[qidx][20 * p + 1] = facesVec3Array[0].y;
                this.vertexPosition[qidx][20 * p + 2] = facesVec3Array[0].z;
                this.vertexPosition[qidx][20 * p + 3] = step + step * uindex + s_pixel_size;
                this.vertexPosition[qidx][20 * p + 4] = 1 - (step + step * vindex) - t_pixel_size;
                // v1
                this.vertexPosition[qidx][20 * p + 5] = facesVec3Array[1].x;
                this.vertexPosition[qidx][20 * p + 6] = facesVec3Array[1].y;
                this.vertexPosition[qidx][20 * p + 7] = facesVec3Array[1].z;
                this.vertexPosition[qidx][20 * p + 8] = step + step * uindex + s_pixel_size;
                this.vertexPosition[qidx][20 * p + 9] = 1 - step * vindex + t_pixel_size;
                // v2
                this.vertexPosition[qidx][20 * p + 10] = facesVec3Array[2].x;
                this.vertexPosition[qidx][20 * p + 11] = facesVec3Array[2].y;
                this.vertexPosition[qidx][20 * p + 12] = facesVec3Array[2].z;
                this.vertexPosition[qidx][20 * p + 13] = step * uindex - s_pixel_size;
                this.vertexPosition[qidx][20 * p + 14] = 1 - step * vindex + t_pixel_size;
                // v3
                this.vertexPosition[qidx][20 * p + 15] = facesVec3Array[3].x;
                this.vertexPosition[qidx][20 * p + 16] = facesVec3Array[3].y;
                this.vertexPosition[qidx][20 * p + 17] = facesVec3Array[3].z;
                this.vertexPosition[qidx][20 * p + 18] = step * uindex - s_pixel_size;
                this.vertexPosition[qidx][20 * p + 19] = 1 - (step + step * vindex) - t_pixel_size;
                p++;
            }
        }
        this.vertexPositionBuffer[qidx] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer[qidx]);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexPosition[qidx], gl.STATIC_DRAW);
    }
    get inView() {
        return this._inView;
    }
    moveToCache() {
        _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.moveTileToCache(this._tileno, this._order, this._hips);
        this._inView = false;
        this.destroyIntervals();
    }
    amIStillInFoV() {
        if (this._textureLoaded)
            this._ready = true;
        if (this._isGalacticHips) {
            if (_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.galAncestorsMap.has(this._order)) {
                if (!_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.galAncestorsMap.get(this._order).includes(this._tileno)) {
                    this.moveToCache();
                }
                else {
                    this._inView = true;
                }
            }
            if (this._order == _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.visibleOrder) {
                if (!_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.galVisibleTilesByOrder.pixels.includes(this._tileno)) {
                    this.moveToCache();
                }
                else {
                    this._inView = true;
                }
            }
        }
        else {
            if (_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.ancestorsMap.has(this._order)) {
                if (!_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.ancestorsMap.get(this._order).includes(this._tileno)) {
                    this.moveToCache();
                }
                else {
                    this._inView = true;
                }
            }
            if (this._order == _VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.visibleOrder) {
                if (!_VisibleTilesManager_js__WEBPACK_IMPORTED_MODULE_3__.visibleTilesManager.visibleTilesByOrder.pixels.includes(this._tileno)) {
                    this.moveToCache();
                }
                else {
                    this._inView = true;
                }
            }
        }
    }
    draw(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx) {
        if (!this._ready || this._abort)
            return;
        let quadrantsToDraw = new Set([0, 1, 2, 3]);
        if (visibleOrder > this._order && this._order < this._maxorder) {
            const kids = this.drawChildren(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx);
            if (kids)
                quadrantsToDraw = kids;
        }
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        _shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.enableShaders(pMatrix, vMatrix, mMatrix, colorMapIdx);
        // Enable attributes (these locations are retrieved in enableShaders)
        gl.enableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.vertexPositionAttribute);
        gl.enableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureCoordAttribute);
        gl.activeTexture(gl.TEXTURE0 + this._hipsShaderIndex);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.uniform1f(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureAlpha, this.opacity);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        const elemno = this.vertexIndices.length;
        const indexType = this.vertexIndices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        quadrantsToDraw.forEach((qidx) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer[qidx]);
            gl.vertexAttribPointer(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.vertexPositionAttribute, 3, gl.FLOAT, false, 5 * 4, 0);
            gl.vertexAttribPointer(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureCoordAttribute, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
            gl.drawElements(gl.TRIANGLES, elemno, indexType, 0);
        });
        gl.disableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.vertexPositionAttribute);
        gl.disableVertexAttribArray(_shader_HiPSShaderProgram_js__WEBPACK_IMPORTED_MODULE_1__.hipsShaderProgram.locations.textureCoordAttribute);
    }
    drawChildren(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx) {
        const quadrantsToDraw = new Set([0, 1, 2, 3]);
        const childrenOrder = this._order + 1;
        if (!visibleTilesMap.has(childrenOrder))
            return;
        for (let c = 0; c < 4; c++) {
            const childTileNo = (this._tileno << 2) + c;
            const list = visibleTilesMap.get(childrenOrder);
            if (list.includes(childTileNo)) {
                const childTile = this._isGalacticHips
                    ? _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.getGalTile(childTileNo, childrenOrder, this._hips)
                    : _TileBuffer_js__WEBPACK_IMPORTED_MODULE_2__.newTileBuffer.getTile(childTileNo, childrenOrder, this._hips);
                childTile.draw(visibleOrder, visibleTilesMap, pMatrix, vMatrix, mMatrix, colorMapIdx);
                if (childTile._ready) {
                    quadrantsToDraw.delete(childTileNo - (this._tileno << 2));
                }
            }
        }
        return quadrantsToDraw;
    }
}
//# sourceMappingURL=Tile.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/TileBuffer.js":
/*!********************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/TileBuffer.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TileBuffer),
/* harmony export */   newTileBuffer: () => (/* binding */ newTileBuffer)
/* harmony export */ });
/* harmony import */ var _Tile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tile.js */ "../astro-viewer/lib-esm/model/hips/Tile.js");
// TileBuffer.ts
 // adjust if your file is named differently
class TileBuffer {
    // Equatorial
    _tiles;
    _cachedTiles;
    _activeHiPS;
    // Galactic
    _galTiles;
    _galCachedTiles;
    _galActiveHiPS;
    _cacheAliveMilliSeconds;
    _cleanerId;
    constructor(minutesToLiveInCache = 1) {
        this._tiles = new Map();
        this._cachedTiles = new Map();
        this._activeHiPS = new Map();
        this._galTiles = new Map();
        this._galCachedTiles = new Map();
        this._galActiveHiPS = new Map();
        this._cacheAliveMilliSeconds = minutesToLiveInCache * 60 * 1000;
        this._cleanerId = window.setInterval(() => {
            this.cacheCleaner();
        }, 10_000);
    }
    /** Register an equatorial HiPS into the buffer. */
    addHiPS(hips) {
        if (this._activeHiPS.has(hips)) {
            console.error('HiPS already present in TileBuffer');
            return;
        }
        this._activeHiPS.set(hips, new Map());
    }
    /** Register a galactic HiPS into the buffer. */
    addGalHiPS(hips) {
        if (this._galActiveHiPS.has(hips)) {
            console.error('HiPS already present in TileBuffer');
            return;
        }
        this._galActiveHiPS.set(hips, new Map());
    }
    /** Preload/add tile for every registered equatorial HiPS. */
    addTile(order, tileno) {
        for (const hips of this._activeHiPS.keys()) {
            this.getTile(tileno, order, hips);
        }
    }
    /** Preload/add tile for every registered galactic HiPS. */
    addGalTile(order, tileno) {
        for (const hips of this._galActiveHiPS.keys()) {
            this.getGalTile(tileno, order, hips);
        }
    }
    /** Fetch (or create) an equatorial tile, reviving from cache if present. */
    getTile(tileno, order, hips) {
        const tileKey = this.key(order, tileno, hips.baseURL);
        if (!this._tiles.has(tileKey)) {
            if (this._cachedTiles.has(tileKey)) {
                const tile = this._cachedTiles.get(tileKey);
                this._tiles.set(tileKey, tile);
                this._cachedTiles.delete(tileKey);
                tile.resetCacheTime0();
            }
            else {
                const tile = new _Tile_js__WEBPACK_IMPORTED_MODULE_0__["default"](tileno, order, hips);
                this._tiles.set(tileKey, tile);
            }
        }
        return this._tiles.get(tileKey);
    }
    /** Fetch (or create) a galactic tile, reviving from cache if present. */
    getGalTile(tileno, order, hips) {
        const tileKey = this.key(order, tileno, hips.baseURL);
        if (!this._galTiles.has(tileKey)) {
            if (this._galCachedTiles.has(tileKey)) {
                const tile = this._galCachedTiles.get(tileKey);
                this._galTiles.set(tileKey, tile);
                this._galCachedTiles.delete(tileKey);
                tile.resetCacheTime0();
            }
            else {
                const tile = new _Tile_js__WEBPACK_IMPORTED_MODULE_0__["default"](tileno, order, hips);
                this._galTiles.set(tileKey, tile);
            }
        }
        return this._galTiles.get(tileKey);
    }
    /** Move a tile (equatorial or galactic) into cache. */
    moveTileToCache(tileno, order, hips) {
        const tileKey = this.key(order, tileno, hips.baseURL);
        if (this._tiles.has(tileKey)) {
            const tile = this._tiles.get(tileKey);
            tile.setCacheTime0();
            this._cachedTiles.set(tileKey, tile);
            this._tiles.delete(tileKey);
        }
        if (this._galTiles.has(tileKey)) {
            const tile = this._galTiles.get(tileKey);
            tile.setCacheTime0();
            this._galCachedTiles.set(tileKey, tile);
            this._galTiles.delete(tileKey);
        }
    }
    /** Periodically purge stale cached tiles. */
    cacheCleaner() {
        const now = Date.now();
        for (const [tileKey, tile] of this._cachedTiles) {
            const t0 = tile.cacheTime0;
            if (!tile.inView && t0 !== undefined && now - t0 > this._cacheAliveMilliSeconds) {
                tile.destroyIntervals();
                this._cachedTiles.delete(tileKey);
            }
        }
        for (const [tileKey, tile] of this._galCachedTiles) {
            const t0 = tile.cacheTime0;
            if (!tile.inView && t0 !== undefined && now - t0 > this._cacheAliveMilliSeconds) {
                tile.destroyIntervals();
                this._galCachedTiles.delete(tileKey);
            }
        }
    }
    /** Compose a stable key for maps. */
    key(order, tileno, baseURL) {
        return `${order}#${tileno}#${baseURL}`;
    }
    /** Optional: call to stop internal timers if you dispose this buffer. */
    dispose() {
        window.clearInterval(this._cleanerId);
    }
}
// Singleton (kept for compatibility with your original export)
const newTileBuffer = new TileBuffer();
//# sourceMappingURL=TileBuffer.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/hips/VisibleTilesManager.js":
/*!*****************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/hips/VisibleTilesManager.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   visibleTilesManager: () => (/* binding */ visibleTilesManager)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var healpixjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! healpixjs */ "../astro-viewer/node_modules/healpixjs/lib-esm/index.js");
/* harmony import */ var _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/RayPickingUtils.js */ "../astro-viewer/lib-esm/utils/RayPickingUtils.js");
/* harmony import */ var _TileBuffer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TileBuffer.js */ "../astro-viewer/lib-esm/model/hips/TileBuffer.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec4.js");
/* harmony import */ var _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../grid/HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");
/* harmony import */ var _Config_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../Config.js */ "../astro-viewer/lib-esm/Config.js");







class VisibleTilesManager {
    _visibleTilesByOrder;
    _ancestorsMap;
    initialised;
    _galVisibleTilesByOrder;
    _galAncestorsMap;
    _galacticMatrixInverted;
    _galacticMatrix;
    insideSphere = _Config_js__WEBPACK_IMPORTED_MODULE_7__.bootSetup.insideSphere;
    constructor() {
        this._visibleTilesByOrder = { pixels: [], order: 0 };
        this._ancestorsMap = new Map();
        this.initialised = false;
        this._galVisibleTilesByOrder = { pixels: [], order: 0 };
        this._galAncestorsMap = new Map();
        // Matrices for galactic <-> equatorial
        this._galacticMatrixInverted = gl_matrix__WEBPACK_IMPORTED_MODULE_4__.create();
        this._galacticMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_4__.create();
        // From https://observablehq.com/@fil/galactic-rotations (single-precision friendly)
        // This matrix is (galactic -> equatorial); we store its inverse too.
        gl_matrix__WEBPACK_IMPORTED_MODULE_4__.set(this._galacticMatrixInverted, -0.054876, -0.873437, -0.483835, 0, 0.494109, -0.44483, 0.746982, -0, -0.867666, -0.198076, 0.455984, 0, 0, 0, 0, 1);
        gl_matrix__WEBPACK_IMPORTED_MODULE_4__.invert(this._galacticMatrix, this._galacticMatrixInverted);
    }
    init(insideSphere) {
        this.initialised = true;
        this.insideSphere = insideSphere;
        this.computeVisiblePixels();
        // Consider debouncing/throttling in real-time UIs
        setInterval(() => this.computeVisiblePixels(), 500);
    }
    getVisibleOrder() {
        return _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].visibleorder;
    }
    // toggleInsideSphere(){
    //   this.insideSphere = !this.insideSphere
    //   this.computeVisiblePixels();
    // }
    computeVisiblePixels() {
        if (!this.initialised)
            return;
        let order = _grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_6__["default"].visibleorder;
        if (_Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].insideSphere && order < 3) {
            order = 3;
        }
        this._ancestorsMap.set(order, []);
        this._galAncestorsMap.set(order, []);
        let pixels = [];
        let galTiles = [];
        if (order === 0) {
            const geomhealpix = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].getHealpix(0);
            const npix = geomhealpix.getNPix();
            for (let i = 0; i < npix; i++) {
                pixels.push(i);
                this._ancestorsMap.get(order).push(i);
                galTiles.push(i);
                this._galAncestorsMap.get(order).push(i);
            }
        }
        else {
            const geomhealpix = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].getHealpix(order);
            const maxX = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.canvas.width;
            const maxY = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.canvas.height;
            // Sample a grid of screen points, project to the sphere, then to galactic
            for (let i = 0; i <= maxX; i += maxX / 30) {
                for (let j = 0; j <= maxY; j += maxY / 30) {
                    const hit = _utils_RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_2__["default"].getIntersectionPointWithSingleModel(i, j);
                    if (hit.length > 0) {
                        // Equatorial -> Galactic (use _galacticMatrix)
                        const galVec = gl_matrix__WEBPACK_IMPORTED_MODULE_5__.create();
                        gl_matrix__WEBPACK_IMPORTED_MODULE_5__.transformMat4(galVec, [hit[0], hit[1], hit[2], 1], this._galacticMatrix);
                        // Index in galactic HEALPix
                        const galPoint = new healpixjs__WEBPACK_IMPORTED_MODULE_1__.Pointing(new healpixjs__WEBPACK_IMPORTED_MODULE_1__.Vec3(galVec[0], galVec[1], galVec[2]));
                        const galTileNo = geomhealpix.ang2pix(galPoint);
                        // Index in equatorial HEALPix
                        const curPoint = new healpixjs__WEBPACK_IMPORTED_MODULE_1__.Pointing(new healpixjs__WEBPACK_IMPORTED_MODULE_1__.Vec3(hit[0], hit[1], hit[2]));
                        const currPixNo = geomhealpix.ang2pix(curPoint);
                        if (!pixels.includes(currPixNo)) {
                            pixels.push(currPixNo);
                            this._ancestorsMap.get(order).push(currPixNo);
                            _TileBuffer_js__WEBPACK_IMPORTED_MODULE_3__.newTileBuffer.addTile(order, currPixNo);
                        }
                        if (!galTiles.includes(galTileNo)) {
                            galTiles.push(galTileNo);
                            this._galAncestorsMap.get(order).push(galTileNo);
                            _TileBuffer_js__WEBPACK_IMPORTED_MODULE_3__.newTileBuffer.addGalTile(order, galTileNo);
                        }
                    }
                }
            }
        }
        this._visibleTilesByOrder = { pixels: pixels, order: order };
        this._galVisibleTilesByOrder = { pixels: galTiles, order: order };
        // Build ancestor pyramids down to order 0
        for (let o = 1; o < order; o++) {
            const tgtOrder = order - o;
            const list = this._ancestorsMap.get(tgtOrder) ?? [];
            this._ancestorsMap.set(tgtOrder, list);
            for (let p = 0; p < pixels.length; p++) {
                const parent = pixels[p] >> (2 * o);
                if (!list.includes(parent)) {
                    list.push(parent);
                    _TileBuffer_js__WEBPACK_IMPORTED_MODULE_3__.newTileBuffer.addTile(tgtOrder, parent);
                }
            }
        }
        for (let o = 1; o < order; o++) {
            const tgtOrder = order - o;
            const list = this._galAncestorsMap.get(tgtOrder) ?? [];
            this._galAncestorsMap.set(tgtOrder, list);
            for (let p = 0; p < galTiles.length; p++) {
                const parent = galTiles[p] >> (2 * o);
                if (!list.includes(parent)) {
                    list.push(parent);
                    _TileBuffer_js__WEBPACK_IMPORTED_MODULE_3__.newTileBuffer.addGalTile(tgtOrder, parent);
                }
            }
        }
    }
    get visibleTilesByOrder() {
        return this._visibleTilesByOrder;
    }
    get ancestorsMap() {
        return this._ancestorsMap;
    }
    get galVisibleTilesByOrder() {
        return this._galVisibleTilesByOrder;
    }
    get galAncestorsMap() {
        return this._galAncestorsMap;
    }
    get visibleOrder() {
        return this._visibleTilesByOrder.order;
    }
}
const visibleTilesManager = new VisibleTilesManager();
//# sourceMappingURL=VisibleTilesManager.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/tap/TapMetadata.js":
/*!********************************************************!*\
  !*** ../astro-viewer/lib-esm/model/tap/TapMetadata.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

/**
 * @author Fabrizio Giordano (Fab77)
 */
class TapMetadata {
    _name;
    _description;
    _unit;
    _dataType;
    _ucd;
    _uType;
    _index;
    /**
     *
     * @param name - column name
     * @param description - column description
     * @param unit - physical unit
     * @param datatype - ADQL datatype
     * @param ucd - Unified Content Descriptor
     * @param utype - ObsCore / STC-S type
     */
    constructor(name, description, unit, datatype, ucd, utype) {
        this._name = name;
        this._description = description;
        this._unit = unit;
        this._dataType = datatype;
        this._ucd = ucd;
        this._uType = utype;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get unit() {
        return this._unit;
    }
    get datatype() {
        return this._dataType;
    }
    get ucd() {
        return this._ucd;
    }
    get uType() {
        return this._uType;
    }
    get index() {
        return this._index;
    }
    set index(idx) {
        this._index = idx;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TapMetadata);
//# sourceMappingURL=TapMetadata.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/tap/TapMetadataList.js":
/*!************************************************************!*\
  !*** ../astro-viewer/lib-esm/model/tap/TapMetadataList.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

class TapMetadataList {
    _posEqRAMetaColumns; // ucd.includes('pos.eq.ra')
    _posEqDecMetaColumns; // ucd.includes('pos.eq.dec')
    _sRegionMetaColumns; // STC-S / s_region candidates
    _pgSphereMetaColumns; // ucd.includes('pos.outline.meta.pgsphere')
    _metadataList;
    constructor() {
        this._metadataList = [];
        this._posEqRAMetaColumns = [];
        this._posEqDecMetaColumns = [];
        this._sRegionMetaColumns = [];
        this._pgSphereMetaColumns = [];
    }
    /**
     * Add a TapMetadata entry and classify it into relevant groups
     */
    addMetadata(tapMetadata) {
        const length = this._metadataList.push(tapMetadata);
        const idx = length - 1;
        tapMetadata.index = idx;
        if (tapMetadata.ucd?.includes('pos.eq.ra')) {
            this._posEqRAMetaColumns.push(tapMetadata);
        }
        else if (tapMetadata.ucd?.includes('pos.eq.dec')) {
            this._posEqDecMetaColumns.push(tapMetadata);
        }
        if (tapMetadata.ucd?.includes('pos.outline;meta.pgsphere')) {
            this._pgSphereMetaColumns.push(tapMetadata);
        }
        if (tapMetadata.uType?.includes('Char.SpatialAxis.Coverage.Support.Area') ||
            tapMetadata.datatype?.includes('adql:REGION') ||
            tapMetadata.ucd?.includes('pos.outline;obs.field') ||
            tapMetadata.name === 'stc_s' // for ESASky
        ) {
            this._sRegionMetaColumns.push(tapMetadata);
        }
    }
    get metadataList() {
        return this._metadataList;
    }
    set metadataList(metadataList) {
        this._metadataList = metadataList;
    }
    get pgSphereMetaColumns() {
        return this._pgSphereMetaColumns;
    }
    get sRegionMetaColumns() {
        return this._sRegionMetaColumns;
    }
    get posEqRAMetaColumns() {
        return this._posEqRAMetaColumns;
    }
    get posEqDecMetaColumns() {
        return this._posEqDecMetaColumns;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TapMetadataList);
//# sourceMappingURL=TapMetadataList.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/model/tap/TapRepo.js":
/*!****************************************************!*\
  !*** ../astro-viewer/lib-esm/model/tap/TapRepo.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TapRepo: () => (/* binding */ TapRepo)
/* harmony export */ });
class TapRepo {
    _adqlFunctionList;
    _cataloguesList;
    _observationsList;
    _notClassified;
    _activeObservations;
    _activeCatalogues;
    _tapBaseURL;
    constructor(tapUrl) {
        this._tapBaseURL = tapUrl;
        this._cataloguesList = [];
        this._observationsList = [];
        this._notClassified = [];
        this._activeObservations = [];
        this._activeCatalogues = [];
        this._adqlFunctionList = [];
    }
    get tapBaseUrl() {
        return this._tapBaseURL;
    }
    setCataloguesList(cataloguesList) {
        this._cataloguesList = cataloguesList;
    }
    setObservationsList(observationList) {
        this._observationsList = observationList;
    }
    setNotClassifiedList(notClassifiedList) {
        this._notClassified = notClassifiedList;
    }
    setCatalogueActive(catalogue) {
        this._activeCatalogues.push(catalogue);
    }
    setObservationActive(observation) {
        this._activeObservations.push(observation);
    }
    get cataloguesList() {
        return this._cataloguesList;
    }
    get observationsList() {
        return this._observationsList;
    }
    set adqlFunctionList(adqlFunctionList) {
        if (adqlFunctionList !== undefined) {
            this._adqlFunctionList = adqlFunctionList;
        }
    }
    get adqlFunctionList() {
        return this._adqlFunctionList;
    }
}
//# sourceMappingURL=TapRepo.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/services/queryCatalogueByFoV.js":
/*!***************************************************************!*\
  !*** ../astro-viewer/lib-esm/services/queryCatalogueByFoV.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ queryCatalogueByFoV)
/* harmony export */ });
/* harmony import */ var _model_tap_TapMetadata_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/tap/TapMetadata.js */ "../astro-viewer/lib-esm/model/tap/TapMetadata.js");
/* harmony import */ var _model_tap_TapMetadataList_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/tap/TapMetadataList.js */ "../astro-viewer/lib-esm/model/tap/TapMetadataList.js");
/* harmony import */ var _tapRepoService_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tapRepoService.js */ "../astro-viewer/lib-esm/services/tapRepoService.js");



// Optional timeout; adjust or remove if you don’t use timeouts.
const TAP_QUERY_TIMEOUT_MS = 60_000;
// Small helpers to be robust with slightly different metadata shapes
function getColName(col) {
    if (!col)
        return '';
    return (col.name ?? col.name ?? '').toString();
}
async function queryCatalogueByFoV(catalogue, polygonAdql) {
    try {
        // Resolve RA/Dec column names (CatalogueProps already picked them from metadata)
        const raCol = getColName(catalogue.catalogueProps.raColumn);
        const decCol = getColName(catalogue.catalogueProps.decColumn);
        const tapTable = catalogue.name;
        if (!raCol || !decCol) {
            console.warn('[queryCatalogueByFoV] RA/Dec columns were not resolved from metadata.');
            return;
        }
        const adql = `SELECT * FROM ${tapTable} WHERE 1 = CONTAINS(POINT('ICRS', ${raCol}, ${decCol}), POLYGON('ICRS',${polygonAdql}))`;
        // Fire the TAP query
        const rows = await (0,_tapRepoService_js__WEBPACK_IMPORTED_MODULE_2__.queryAsync)(catalogue.tapRepo, adql, TAP_QUERY_TIMEOUT_MS);
        console.log(rows);
        if (rows && rows.data.length > 0) {
            const metadata = rows.metadata;
            const data = rows.data;
            console.log(data.length);
            let tapMetadataList = new _model_tap_TapMetadataList_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
            for (const element of metadata) {
                const name = element.name;
                const description = element.description !== undefined ? element.description : undefined;
                const unit = element.unit !== undefined ? element.unit : undefined;
                const datatype = element.datatype !== undefined ? element.datatype : undefined;
                const ucd = element.ucd !== undefined ? element.ucd : undefined;
                const utype = element.utype !== undefined ? element.utype : undefined;
                const tapMeta = new _model_tap_TapMetadata_js__WEBPACK_IMPORTED_MODULE_0__["default"](name, description, unit, datatype, ucd, utype);
                tapMetadataList.addMetadata(tapMeta);
            }
            catalogue.addSources(data, tapMetadataList.metadataList);
            return catalogue;
        }
        else {
            console.log('[queryCatalogueByFoV] No results found.');
            return;
        }
    }
    catch (err) {
        console.error('[queryCatalogueByFoV] Error:', err?.message ?? err);
        return;
    }
}
//# sourceMappingURL=queryCatalogueByFoV.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/services/queryFootprintSetByFov.js":
/*!******************************************************************!*\
  !*** ../astro-viewer/lib-esm/services/queryFootprintSetByFov.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ queryFootprintSetByFov)
/* harmony export */ });
/* harmony import */ var _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/grid/HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");
/* harmony import */ var _model_tap_TapMetadata_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/tap/TapMetadata.js */ "../astro-viewer/lib-esm/model/tap/TapMetadata.js");
/* harmony import */ var _model_tap_TapMetadataList_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/tap/TapMetadataList.js */ "../astro-viewer/lib-esm/model/tap/TapMetadataList.js");
/* harmony import */ var _tapRepoService_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tapRepoService.js */ "../astro-viewer/lib-esm/services/tapRepoService.js");




// Optional timeout; adjust or remove if you don’t use timeouts.
const TAP_QUERY_TIMEOUT_MS = 60_000;
// --- Function ---
// Small helpers to be robust with slightly different metadata shapes
function getColName(col) {
    if (!col)
        return '';
    return (col.name ?? col.name ?? '').toString();
}
function prepareADQL(tapTable, tapRa, tapDec, polygonAdql, tapRepo, centralPoint) {
    let adql = "";
    if (tapRepo.adqlFunctionList.includes('POLYGON')) {
        adql =
            'select * from ' +
                tapTable +
                ' where 1=CONTAINS(POINT(\'ICRS\',' +
                tapRa +
                ',' +
                tapDec +
                '), POLYGON(\'ICRS\', ' +
                polygonAdql +
                '))';
    }
    else {
        const radius = _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_0__["default"].getMinFoV() / 2;
        adql =
            'select * from ' +
                tapTable +
                ' where 1=CONTAINS(POINT(\'ICRS\',' +
                tapRa +
                ',' +
                tapDec +
                '), CIRCLE(\'ICRS\', ' +
                centralPoint.raDeg +
                ', ' +
                centralPoint.decDeg +
                ', ' +
                radius +
                '))';
    }
    return adql;
}
/**
 * Builds an ADQL query from current FoV and fetches footprints.
 * Returns the enriched FootprintSet (if any rows were found), otherwise undefined.
 */
async function queryFootprintSetByFov(footprintSet, polygonAdql, centralPoint) {
    try {
        // Resolve RA/Dec column names (CatalogueProps already picked them from metadata)
        const raCol = getColName(footprintSet.footprintsetProps.raColumn);
        const decCol = getColName(footprintSet.footprintsetProps.decColumn);
        const tapTable = footprintSet.name;
        if (!raCol || !decCol) {
            console.warn('[queryCatalogueByFoV] RA/Dec columns were not resolved from metadata.');
            return;
        }
        const adql = prepareADQL(tapTable, raCol, decCol, polygonAdql, footprintSet.tapRepo, centralPoint);
        const rows = await (0,_tapRepoService_js__WEBPACK_IMPORTED_MODULE_3__.queryAsync)(footprintSet.tapRepo, adql, TAP_QUERY_TIMEOUT_MS);
        console.log(rows);
        // if (rows && rows.data.length > 0) {
        // const metadata = rows.metadata
        // const data = rows.data
        if (typeof rows === 'object' &&
            rows !== null &&
            Array.isArray(rows.metadata) &&
            Array.isArray(rows.data)) {
            const { metadata, data } = rows;
            const tapMetadataList = new _model_tap_TapMetadataList_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
            for (const m of metadata) {
                const tapMeta = new _model_tap_TapMetadata_js__WEBPACK_IMPORTED_MODULE_1__["default"](m.name, m.description ?? undefined, m.unit ?? undefined, m.datatype ?? undefined, m.ucd ?? undefined, m.utype ?? undefined);
                tapMetadataList.addMetadata(tapMeta);
            }
            if (data.length > 0) {
                footprintSet.addFootprints(data, tapMetadataList.metadataList);
                return footprintSet;
            }
            else {
                console.log('No results found');
            }
            // }
        }
        else {
            console.log('[queryFootprintSetByFov] No results found.');
            return;
        }
    }
    catch (err) {
        console.error('[queryFootprintSetByFov] Error:', err?.message ?? err);
        return;
    }
}
//# sourceMappingURL=queryFootprintSetByFov.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/services/tapRepoService.js":
/*!**********************************************************!*\
  !*** ../astro-viewer/lib-esm/services/tapRepoService.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addTAPRepo: () => (/* binding */ addTAPRepo),
/* harmony export */   queryAsync: () => (/* binding */ queryAsync)
/* harmony export */ });
/* harmony import */ var _model_tap_TapRepo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/tap/TapRepo.js */ "../astro-viewer/lib-esm/model/tap/TapRepo.js");
/* harmony import */ var _model_tap_TapMetadata_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/tap/TapMetadata.js */ "../astro-viewer/lib-esm/model/tap/TapMetadata.js");
/* harmony import */ var _model_tap_TapMetadataList_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/tap/TapMetadataList.js */ "../astro-viewer/lib-esm/model/tap/TapMetadataList.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _model_catalogues_CatalogueGL_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../model/catalogues/CatalogueGL.js */ "../astro-viewer/lib-esm/model/catalogues/CatalogueGL.js");
/* harmony import */ var _model_footprints_FootprintSetGL_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../model/footprints/FootprintSetGL.js */ "../astro-viewer/lib-esm/model/footprints/FootprintSetGL.js");
// addTAPRepo.ts






let catId = 1;
let obsId = 1;
/**
 * Initialize a TapRepo and populate capabilities + datasets.
 */
async function addTAPRepo(repoUrl) {
    const tapRepo = new _model_tap_TapRepo_js__WEBPACK_IMPORTED_MODULE_0__.TapRepo(repoUrl);
    tapRepo.adqlFunctionList = await loadCapabilities(repoUrl);
    const datasets = await loadTables(repoUrl, tapRepo);
    tapRepo.setCataloguesList(datasets.catalogueList);
    tapRepo.setObservationsList(datasets.obsList);
    tapRepo.setNotClassifiedList(datasets.notClassifiedList);
    return tapRepo;
}
async function queryAsync(tapRepo, adql, TAP_QUERY_TIMEOUT_MS) {
    const base = _Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].corsProxyUrl.replace(/\/?$/, '/'); // ensure trailing /
    const url = new URL('adql', base);
    url.searchParams.set('tapurl', tapRepo.tapBaseUrl);
    url.searchParams.set('query', adql);
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), TAP_QUERY_TIMEOUT_MS || 30000);
    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            mode: 'cors',
            signal: ac.signal,
            headers: { Accept: 'application/json' }
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`HTTP ${response.status} ${response.statusText} – ${text}`);
        }
        return await response.json(); // return type is 'any'
    }
    catch (err) {
        console.error('queryAsync error:', err?.message || err);
        return null;
    }
    finally {
        clearTimeout(t);
    }
}
/**
 * Fetch and parse tables from a TAP service.
 */
const loadTables = async (tapUrl, tapRepo) => {
    const tablesUrl = `${tapUrl}/tables`;
    const requestUrl = `${_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].corsProxyUrl}exturl?url=${encodeURIComponent(tablesUrl)}`;
    const result = { obsList: [], catalogueList: [], notClassifiedList: [] };
    try {
        const response = await fetch(requestUrl, { method: 'GET', mode: 'cors' });
        const raw = await response.text();
        const data = raw.replace(/\n\t|\t|\n/g, '');
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'application/xml');
        const root = doc.firstElementChild;
        if (!root)
            throw new Error('Error parsing TAP XML. Missing root element.');
        if (!/tableset$/i.test(root.nodeName)) {
            throw new Error(`Error parsing TAP XML. ${root.nodeName} not recognised`);
        }
        const catalogueList = [];
        const obsList = [];
        const notClassifiedList = [];
        // schemas
        for (const schema of Array.from(root.children)) {
            if (schema.nodeName !== 'schema')
                continue;
            for (const table of Array.from(schema.children)) {
                if (table.nodeName !== 'table')
                    continue;
                const dataset = parseTable(table, tablesUrl, tapRepo);
                if (!dataset)
                    continue;
                if (dataset.catalogue) {
                    ;
                    dataset.catalogue.id = catId++; // keep parity with existing code
                    catalogueList.push(dataset.catalogue);
                }
                if (dataset.footprint) {
                    ;
                    dataset.footprint.id = obsId++;
                    obsList.push(dataset.footprint);
                }
                if (dataset.notClassified) {
                    notClassifiedList.push(dataset.notClassified);
                }
            }
        }
        return { catalogueList, obsList, notClassifiedList };
    }
    catch (err) {
        console.error(err?.message ?? err);
        return result;
    }
};
/**
 * Fetch and parse TAP capabilities to extract ADQL functions.
 */
const loadCapabilities = async (repoUrl) => {
    const capabilitiesUrl = `${repoUrl}/capabilities`;
    const requestUrl = `${_Global_js__WEBPACK_IMPORTED_MODULE_3__["default"].corsProxyUrl}exturl?url=${encodeURIComponent(capabilitiesUrl)}`;
    let capabilities = [];
    try {
        const response = await fetch(requestUrl, { method: 'GET', mode: 'cors' });
        const raw = await response.text();
        const data = raw.replace(/\n\t|\t|\n/g, '');
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'application/xml');
        const root = doc.firstElementChild;
        if (!root)
            throw new Error('Error parsing TAP XML. Missing root element.');
        if (!/capabilities$/i.test(root.nodeName)) {
            throw new Error(`Error parsing TAP XML. ${root.nodeName} not recognised`);
        }
        for (const capability of Array.from(root.children)) {
            if (capability.nodeName !== 'capability')
                continue;
            for (const child of Array.from(capability.children)) {
                if (child.nodeName === 'language') {
                    capabilities = parseCapabilities(child);
                }
            }
        }
        return capabilities;
    }
    catch (err) {
        console.error(err?.message ?? err);
        return capabilities;
    }
};
/**
 * Parse the <language> node to extract ADQL functions.
 */
const parseCapabilities = (languageNode) => {
    const out = [];
    const featuresContainers = languageNode.getElementsByTagName('languageFeatures');
    if (!featuresContainers.length)
        return out;
    const featureNodeList = featuresContainers[0].getElementsByTagName('feature');
    for (const feature of Array.from(featureNodeList)) {
        const formNode = feature.getElementsByTagName('form')[0];
        if (formNode?.textContent)
            out.push(formNode.textContent);
    }
    return out;
};
/**
 * Parse a <table> node and build dataset wrappers.
 */
const parseTable = (tableNode, tablesUrl, tapRepo) => {
    const nameNode = tableNode.getElementsByTagName('name')[0];
    if (!nameNode?.textContent) {
        return { catalogue: null, footprint: null, notClassified: 'Missing table name' };
    }
    const tableName = nameNode.textContent;
    const tableDesc = tableNode.getElementsByTagName('description')[0]?.textContent ?? null;
    const metaColumns = tableNode.getElementsByTagName('column');
    const tapMetas = new _model_tap_TapMetadataList_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    for (const col of Array.from(metaColumns)) {
        const name = col.getElementsByTagName('name')[0]?.textContent ?? '';
        const description = col.getElementsByTagName('description')[0]?.textContent ?? undefined;
        const unit = col.getElementsByTagName('unit')[0]?.textContent ?? undefined;
        const dataType = col.getElementsByTagName('dataType')[0]?.textContent ?? undefined;
        const ucd = col.getElementsByTagName('ucd')[0]?.textContent ?? undefined;
        const utype = col.getElementsByTagName('utype')[0]?.textContent ?? undefined;
        const tapMeta = new _model_tap_TapMetadata_js__WEBPACK_IMPORTED_MODULE_1__["default"](name, description, unit, dataType, ucd, utype);
        tapMetas.addMetadata(tapMeta);
    }
    let catalogue = null;
    let footprint = null;
    let notClassified = null;
    if (tapMetas.pgSphereMetaColumns.length > 0 || tapMetas.sRegionMetaColumns.length > 0) {
        footprint = new _model_footprints_FootprintSetGL_js__WEBPACK_IMPORTED_MODULE_5__["default"](tableName, tableDesc, tapRepo, tapMetas);
    }
    else if (tapMetas.posEqRAMetaColumns.length > 0 && tapMetas.posEqDecMetaColumns.length > 0) {
        catalogue = new _model_catalogues_CatalogueGL_js__WEBPACK_IMPORTED_MODULE_4__["default"](tableName, tableDesc, tapRepo, tapMetas);
    }
    else {
        notClassified = `TODO: create NC entity for ${tablesUrl}#${tableName}`;
    }
    return { catalogue, footprint, notClassified };
};
//# sourceMappingURL=tapRepoService.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/shader/CatalogueShaderProgram.js":
/*!****************************************************************!*\
  !*** ../astro-viewer/lib-esm/shader/CatalogueShaderProgram.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   catalogueShaderProgram: () => (/* binding */ catalogueShaderProgram),
/* harmony export */   "default": () => (/* binding */ CatalogueShaderProgram)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _ShaderManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShaderManager.js */ "../astro-viewer/lib-esm/shader/ShaderManager.js");
// HiPSShaderProgram.ts



class CatalogueShaderProgram {
    _shaderProgram;
    _vertexShader;
    _fragmentShader;
    gl_uniforms;
    gl_attributes;
    locations;
    constructor() {
        this.gl_uniforms = {
            vertex_color: 'u_fragcolor',
            m_perspective: 'uPMatrix',
            m_model_view: 'uMVMatrix'
        };
        this.gl_attributes = {
            vertex_pos: 'aCatPosition',
            vertex_selected: 'a_selected',
            point_size: 'a_pointsize',
            point_hue: 'a_brightness'
        };
        this.locations = {
            pMatrix: null,
            mvMatrix: null,
            color: null,
            position: -1,
            hovered: -1,
            pointSize: -1,
            brightness: -1
        };
    }
    get shaderProgram() {
        if (!this._shaderProgram) {
            const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
            this._shaderProgram = gl.createProgram();
            this.initShaders();
        }
        return this._shaderProgram;
    }
    initShaders() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        const fragmentShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_2__["default"].catalogueFS();
        this._fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this._fragmentShader, fragmentShaderStr);
        gl.compileShader(this._fragmentShader);
        console.log('FS log:', gl.getShaderInfoLog(this._fragmentShader) || 'ok');
        if (!gl.getShaderParameter(this._fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this._fragmentShader) || 'Fragment shader compile error');
            return;
        }
        const vertexShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_2__["default"].catalogueVS();
        this._vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this._vertexShader, vertexShaderStr);
        gl.compileShader(this._vertexShader);
        console.log('VS log:', gl.getShaderInfoLog(this._vertexShader) || 'ok');
        if (!gl.getShaderParameter(this._vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this._vertexShader) || 'Vertex shader compile error');
            return;
        }
        gl.attachShader(this.shaderProgram, this._vertexShader);
        gl.attachShader(this.shaderProgram, this._fragmentShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        // shaderUtility.useProgram(this.shaderProgram)
        gl.useProgram(this.shaderProgram);
        this.locations.position = gl.getAttribLocation(this.shaderProgram, this.gl_attributes.vertex_pos);
        this.locations.hovered = gl.getAttribLocation(this.shaderProgram, this.gl_attributes.vertex_selected);
        this.locations.pointSize = gl.getAttribLocation(this.shaderProgram, this.gl_attributes.point_size);
        this.locations.brightness = gl.getAttribLocation(this.shaderProgram, this.gl_attributes.point_hue);
        this.locations.color = gl.getUniformLocation(this.shaderProgram, this.gl_uniforms.vertex_color);
    }
    enableShaders(pMatrix, modelMatrix, viewMatrix) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        // shaderUtility.useProgram(this.shaderProgram)
        gl.useProgram(this.shaderProgram);
        this.locations.pMatrix = gl.getUniformLocation(this.shaderProgram, this.gl_uniforms.m_perspective);
        this.locations.mvMatrix = gl.getUniformLocation(this.shaderProgram, this.gl_uniforms.m_model_view);
        let mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(mvMatrix, viewMatrix, modelMatrix);
        gl.uniformMatrix4fv(this.locations.pMatrix, false, pMatrix);
        gl.uniformMatrix4fv(this.locations.mvMatrix, false, mvMatrix);
    }
}
const catalogueShaderProgram = new CatalogueShaderProgram();
//# sourceMappingURL=CatalogueShaderProgram.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/shader/FootprintShaderProgram.js":
/*!****************************************************************!*\
  !*** ../astro-viewer/lib-esm/shader/FootprintShaderProgram.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FootprintShaderProgram),
/* harmony export */   footprintShaderProgram: () => (/* binding */ footprintShaderProgram)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _ShaderManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShaderManager.js */ "../astro-viewer/lib-esm/shader/ShaderManager.js");
// HiPSShaderProgram.ts



class FootprintShaderProgram {
    _shaderProgram;
    _vertexShader;
    _fragmentShader;
    gl_uniforms;
    gl_attributes;
    locations;
    constructor() {
        this.gl_uniforms = {
            vertex_color: 'u_fragcolor',
            m_perspective: 'uPMatrix',
            m_model_view: 'uMVMatrix',
            point_size: 'u_pointsize'
        };
        this.gl_attributes = {
            vertex_pos: 'aCatPosition'
        };
        this.locations = {
            pMatrix: null,
            mvMatrix: null,
            color: null,
            position: -1,
            pointSize: -1
        };
    }
    get shaderProgram() {
        if (!this._shaderProgram) {
            const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
            this._shaderProgram = gl.createProgram();
            this.initShaders();
        }
        return this._shaderProgram;
    }
    initShaders() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        const fragmentShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_2__["default"].footprintFS();
        this._fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this._fragmentShader, fragmentShaderStr);
        gl.compileShader(this._fragmentShader);
        console.log('FS log:', gl.getShaderInfoLog(this._fragmentShader) || 'ok');
        if (!gl.getShaderParameter(this._fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this._fragmentShader) || 'Fragment shader compile error');
            return;
        }
        const vertexShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_2__["default"].footprintVS();
        this._vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this._vertexShader, vertexShaderStr);
        gl.compileShader(this._vertexShader);
        console.log('VS log:', gl.getShaderInfoLog(this._vertexShader) || 'ok');
        if (!gl.getShaderParameter(this._vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this._vertexShader) || 'Vertex shader compile error');
            return;
        }
        gl.attachShader(this.shaderProgram, this._vertexShader);
        gl.attachShader(this.shaderProgram, this._fragmentShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        gl.useProgram(this.shaderProgram);
        this.locations.position = gl.getAttribLocation(this.shaderProgram, this.gl_attributes.vertex_pos);
        this.locations.pointSize = gl.getUniformLocation(this.shaderProgram, this.gl_uniforms.point_size);
        this.locations.color = gl.getUniformLocation(this.shaderProgram, this.gl_uniforms.vertex_color);
    }
    enableShaders(pMatrix, modelMatrix, viewMatrix) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_1__["default"].gl;
        gl.useProgram(this.shaderProgram);
        this.locations.pMatrix = gl.getUniformLocation(this.shaderProgram, this.gl_uniforms.m_perspective);
        this.locations.mvMatrix = gl.getUniformLocation(this.shaderProgram, this.gl_uniforms.m_model_view);
        let mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        mvMatrix = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.multiply(mvMatrix, viewMatrix, modelMatrix);
        gl.uniformMatrix4fv(this.locations.pMatrix, false, pMatrix);
        gl.uniformMatrix4fv(this.locations.mvMatrix, false, mvMatrix);
    }
}
const footprintShaderProgram = new FootprintShaderProgram();
//# sourceMappingURL=FootprintShaderProgram.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/shader/GridShaderManager.js":
/*!***********************************************************!*\
  !*** ../astro-viewer/lib-esm/shader/GridShaderManager.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// GridShaderManager.ts

class GridShaderManager {
    static healpixGridVS() {
        return `#version 300 es
        in vec4 aCatPosition;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;

        void main() {
            gl_Position = uPMatrix * uMVMatrix * aCatPosition;
            gl_PointSize = 7.0;
        }`;
    }
    static healpixGridFS() {
        return `#version 300 es
        precision mediump float;

        uniform vec4 u_fragcolor;
        out vec4 fragColor;

        void main() {
            // fragColor = vec4(1.0, 0.0, 0.0, 1.0);
            fragColor = u_fragcolor;
        }`;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GridShaderManager);
//# sourceMappingURL=GridShaderManager.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/shader/HiPSShaderProgram.js":
/*!***********************************************************!*\
  !*** ../astro-viewer/lib-esm/shader/HiPSShaderProgram.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HiPSShaderProgram),
/* harmony export */   hipsShaderProgram: () => (/* binding */ hipsShaderProgram)
/* harmony export */ });
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _ShaderManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShaderManager.js */ "../astro-viewer/lib-esm/shader/ShaderManager.js");
/* harmony import */ var _model_hips_ColorMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/hips/ColorMap.js */ "../astro-viewer/lib-esm/model/hips/ColorMap.js");
// HiPSShaderProgram.ts



class HiPSShaderProgram {
    _shaderProgram;
    _vertexShader;
    _fragmentShader;
    _UBO_colorMapBuffer = null;
    _UBO_colorMapVariableInfo = {
        r_palette: { index: 0, offset: 0 },
        g_palette: { index: 0, offset: 0 },
        b_palette: { index: 0, offset: 0 }
    };
    gl_uniforms;
    gl_attributes;
    locations;
    constructor() {
        this.gl_uniforms = {
            sampler: 'uSampler0',
            factor: 'uFactor0',
            m_perspective: 'uPMatrix',
            m_model: 'uMMatrix',
            m_view: 'uVMatrix',
            colormapIdx: 'cmapIdx',
            colormap_red: 'r',
            colormap_green: 'g',
            colormap_blue: 'b'
        };
        this.gl_attributes = {
            vertex_pos: 'aVertexPosition',
            text_coords: 'aTextureCoord'
        };
        this.locations = {
            pMatrix: null,
            mMatrix: null,
            vMatrix: null,
            sampler: null,
            textureAlpha: null,
            clorMapIdx: null,
            vertexPositionAttribute: -1,
            textureCoordAttribute: -1
        };
    }
    get shaderProgram() {
        if (!this._shaderProgram) {
            const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
            this._shaderProgram = gl.createProgram();
            this.initShaders();
        }
        ;
        _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.useProgram(this._shaderProgram);
        return this._shaderProgram;
    }
    initShaders() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        const fragmentShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].hipsNativeFS();
        this._fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this._fragmentShader, fragmentShaderStr);
        gl.compileShader(this._fragmentShader);
        if (!gl.getShaderParameter(this._fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this._fragmentShader) || 'Fragment shader compile error');
            return;
        }
        const vertexShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].hipsVS();
        this._vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this._vertexShader, vertexShaderStr);
        gl.compileShader(this._vertexShader);
        if (!gl.getShaderParameter(this._vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this._vertexShader) || 'Vertex shader compile error');
            return;
        }
        gl.attachShader(this._shaderProgram, this._vertexShader);
        gl.attachShader(this._shaderProgram, this._fragmentShader);
        gl.linkProgram(this._shaderProgram);
        if (!gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
    }
    enableProgram() {
        ;
        _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl.useProgram(this._shaderProgram);
    }
    setGrayscaleShader() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        gl.detachShader(this._shaderProgram, this._fragmentShader);
        const fragmentShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].hipsGrayscaleFS();
        this.changeFSShader(fragmentShaderStr);
    }
    setNativeShader() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        gl.detachShader(this._shaderProgram, this._fragmentShader);
        const fragmentShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].hipsNativeFS();
        this.changeFSShader(fragmentShaderStr);
    }
    setColorMapShader() {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        gl.detachShader(this._shaderProgram, this._fragmentShader);
        const fragmentShaderStr = _ShaderManager_js__WEBPACK_IMPORTED_MODULE_1__["default"].hipsColorMapFS();
        this.changeFSShader(fragmentShaderStr);
        // UBO discovery
        const blockIndex = gl.getUniformBlockIndex(this._shaderProgram, 'colormap');
        const blockSize = gl.getActiveUniformBlockParameter(this._shaderProgram, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
        const uboVariableNames = ['r_palette', 'g_palette', 'b_palette'];
        const uboVariableIndices = gl.getUniformIndices(this._shaderProgram, uboVariableNames);
        const uboVariableOffsets = gl.getActiveUniforms(this._shaderProgram, uboVariableIndices, gl.UNIFORM_OFFSET);
        this._UBO_colorMapBuffer = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, this._UBO_colorMapBuffer);
        // std140 layout: 256 floats each padded to 16 bytes => 4096 bytes per palette, total 12288
        const BYTES = 12288;
        gl.bufferData(gl.UNIFORM_BUFFER, BYTES, gl.STATIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this._UBO_colorMapBuffer);
        uboVariableNames.forEach((name, index) => {
            this._UBO_colorMapVariableInfo[name] = {
                index: uboVariableIndices[index],
                offset: uboVariableOffsets[index]
            };
        });
    }
    changeFSShader(fragmentShaderStr) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        this._fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this._fragmentShader, fragmentShaderStr);
        gl.compileShader(this._fragmentShader);
        if (!gl.getShaderParameter(this._fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(this._fragmentShader) || 'Fragment shader compile error');
            return;
        }
        gl.attachShader(this._shaderProgram, this._fragmentShader);
        gl.linkProgram(this._shaderProgram);
        if (!gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS)) {
            alert('Could not initialise shaders');
        }
        gl.useProgram(this._shaderProgram);
    }
    enableShaders(pMatrix, vMatrix, mMatrix, colorMapIdx) {
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_0__["default"].gl;
        gl.useProgram(this._shaderProgram);
        this.locations.pMatrix = gl.getUniformLocation(this._shaderProgram, this.gl_uniforms.m_perspective);
        this.locations.mMatrix = gl.getUniformLocation(this._shaderProgram, this.gl_uniforms.m_model);
        this.locations.vMatrix = gl.getUniformLocation(this._shaderProgram, this.gl_uniforms.m_view);
        this.locations.sampler = gl.getUniformLocation(this._shaderProgram, this.gl_uniforms.sampler);
        this.locations.textureAlpha = gl.getUniformLocation(this._shaderProgram, this.gl_uniforms.factor);
        this.locations.clorMapIdx = gl.getUniformLocation(this._shaderProgram, this.gl_uniforms.colormapIdx);
        this.locations.vertexPositionAttribute = gl.getAttribLocation(this._shaderProgram, this.gl_attributes.vertex_pos);
        this.locations.textureCoordAttribute = gl.getAttribLocation(this._shaderProgram, this.gl_attributes.text_coords);
        if (colorMapIdx >= 2) {
            const index = gl.getUniformBlockIndex(this._shaderProgram, 'colormap');
            gl.uniformBlockBinding(this._shaderProgram, index, 0);
            gl.bindBuffer(gl.UNIFORM_BUFFER, this._UBO_colorMapBuffer);
            let currentColorMap;
            if (colorMapIdx === 2)
                currentColorMap = _model_hips_ColorMap_js__WEBPACK_IMPORTED_MODULE_2__.colorMap.PLANCK;
            else if (colorMapIdx === 3)
                currentColorMap = _model_hips_ColorMap_js__WEBPACK_IMPORTED_MODULE_2__.colorMap.CMB;
            else if (colorMapIdx === 4)
                currentColorMap = _model_hips_ColorMap_js__WEBPACK_IMPORTED_MODULE_2__.colorMap.RAINBOW;
            else if (colorMapIdx === 5)
                currentColorMap = _model_hips_ColorMap_js__WEBPACK_IMPORTED_MODULE_2__.colorMap.EOSB;
            else if (colorMapIdx === 6)
                currentColorMap = _model_hips_ColorMap_js__WEBPACK_IMPORTED_MODULE_2__.colorMap.CUBEHELIX;
            if (currentColorMap) {
                // Offsets match std140 padded arrays (0, 4096, 8192)
                gl.bufferSubData(gl.UNIFORM_BUFFER, 0, currentColorMap.r, 0);
                gl.bufferSubData(gl.UNIFORM_BUFFER, 4096, currentColorMap.g, 0);
                gl.bufferSubData(gl.UNIFORM_BUFFER, 8192, currentColorMap.b, 0);
            }
            gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        }
        gl.uniformMatrix4fv(this.locations.mMatrix, false, mMatrix);
        gl.uniformMatrix4fv(this.locations.pMatrix, false, pMatrix);
        gl.uniformMatrix4fv(this.locations.vMatrix, false, vMatrix);
    }
}
const hipsShaderProgram = new HiPSShaderProgram();
//# sourceMappingURL=HiPSShaderProgram.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/shader/ShaderManager.js":
/*!*******************************************************!*\
  !*** ../astro-viewer/lib-esm/shader/ShaderManager.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShaderManager)
/* harmony export */ });
// ShaderManager.ts
class ShaderManager {
    static catalogueVS() {
        return `#version 300 es
    in vec4 aCatPosition;
    in float a_selected;
    in float a_pointsize;
    in float a_brightness;

    out float v_selected;
    out float v_brightness;
    out lowp vec4 vColor;  // not used

    uniform mat4 uPMatrix;
    uniform mat4 uMVMatrix;

    void main() {

      gl_Position = (uPMatrix * uMVMatrix * aCatPosition);
      gl_PointSize = a_pointsize;
      v_selected = a_selected;
      v_brightness = a_brightness;
    }`;
    }
    static catalogueFS() {
        return `#version 300 es
    precision mediump float;
    
    #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif

    // https://www.desultoryquest.com/blog/drawing-anti-aliased-circular-points-using-opengl-slash-webgl/

    // precision mediump float;

    in float v_selected;
    in float v_brightness;

    uniform vec4 u_fragcolor;

    out vec4 fragColor;

    // varying float v_selected;
    // varying float v_brightness;

    const float EPSILON = 1e-10;
    
    vec3 RGBtoHCV(in vec3 rgb) {
      // RGB [0..1] to Hue-Chroma-Value [0..1]
      // Based on work by Sam Hocevar and Emil Persson
      vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1., 2. / 3.) : vec4(rgb.gb, 0., -1. / 3.);
      vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);
      float c = q.x - min(q.w, q.y);
      float h = abs((q.w - q.y) / (6. * c + EPSILON) + q.z);
      return vec3(h, c, q.x);
    }

    vec3 RGBtoHSL(in vec3 rgb) {
      // RGB [0..1] to Hue-Saturation-Lightness [0..1]
      vec3 hcv = RGBtoHCV(rgb);
      //vec3 hcv = vec3(1., 1., 1.);
      float z = hcv.z - hcv.y * 0.5;
      float s = hcv.y / (1. - abs(z * 2. - 1.) + EPSILON);
      return vec3(hcv.x, s, z);
    }

    vec3 HUEtoRGB(in float hue){
      // Hue [0..1] to RGB [0..1]
      // See http://www.chilliant.com/rgb2hsv.html
      vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
      return clamp(rgb, 0., 1.);
    }

    vec3 HSLtoRGB(in vec3 hsl) {
      // Hue-Saturation-Lightness [0..1] to RGB [0..1]
      vec3 rgb = HUEtoRGB(hsl.x);
      float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
      return (rgb - 0.5) * c + hsl.z;
    }
  
    void main() {

      float r = 0.0, delta = 0.0, alpha = 1.0;
      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      r = dot(cxy, cxy);
      if (r > 1.0) {
        discard;
      }

      #ifdef GL_OES_standard_derivatives
        delta = fwidth(r);
        alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
      #endif

      if (v_selected == 1.0){
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * (alpha);
        fragColor = vec4(1.0, 0.0, 0.0, 1.0) * (alpha);
      } else if (v_selected == 2.0){
        // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * (alpha);
        fragColor = vec4(1.0, 1.0, 0.0, 1.0) * (alpha);
      }else{
        if (r < 0.4) {
          discard;
        }
        if ( v_brightness >= -1.0 && v_brightness <= 1.0) {
          // Round-trip RGB->HSL->RGB with time-dependent lightness
          vec3 hsl = RGBtoHSL(vec3(u_fragcolor));
          //hsl.z = pow(hsl.z, sin(iTime) + 1.5);
          // hsl.z = pow(hsl.z, v_brightness + 1.5);
          hsl.z = pow(hsl.z, v_brightness + 1.5);
          vec3 hslcolor = HSLtoRGB(hsl);
          // gl_FragColor = vec4(hslcolor, u_fragcolor[3]) * (alpha);
          fragColor = vec4(hslcolor, u_fragcolor[3]) * (alpha);
        } else {
          // gl_FragColor = u_fragcolor * (alpha);
          fragColor = u_fragcolor * (alpha);
        }
      }
    }`;
    }
    static footprintVS() {
        return `#version 300 es
    precision highp float;

    layout(location = 0) in vec4 aCatPosition;

    uniform float u_pointsize;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    void main() {
      gl_Position = uPMatrix * uMVMatrix * aCatPosition;
      gl_PointSize = u_pointsize;   // Works in WebGL2
    }`;
    }
    static footprintFS() {
        return `#version 300 es
    precision mediump float;

    uniform vec4 u_fragcolor;
    out vec4 fragColor;

    void main() {
      fragColor = u_fragcolor;
    }`;
    }
    static hipsVS() {
        return `#version 300 es
    in vec3 aVertexPosition;
    in vec2 aTextureCoord;

    uniform mat4 uMMatrix;
    uniform mat4 uVMatrix;
    uniform mat4 uPMatrix;

    out vec2 vTextureCoord;

    void main() {
      gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
      vTextureCoord = aTextureCoord;
    }`;
    }
    static hipsNativeFS() {
        return `#version 300 es
    precision mediump float;

    in vec2 vTextureCoord;

    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;
    uniform sampler2D uSampler2;
    uniform sampler2D uSampler3;
    uniform sampler2D uSampler4;
    uniform sampler2D uSampler5;
    uniform sampler2D uSampler6;
    uniform sampler2D uSampler7;

    uniform float uFactor0;
    uniform float uFactor1;
    uniform float uFactor2;
    uniform float uFactor3;
    uniform float uFactor4;
    uniform float uFactor5;
    uniform float uFactor6;
    uniform float uFactor7;

    out vec4 fragColor;

    void main() {
      vec3 finalColor = vec3(0.0);

      if (uFactor0 >= 0.0){
        vec4 mycolor;
        #if __VERSION__ > 120
          vec4 color0 = texture(uSampler0, vTextureCoord);
        #else
          vec4 color0 = texture2D(uSampler0, vTextureCoord);
        #endif
        mycolor = color0;
        finalColor += mycolor.rgb * uFactor0;
      } else if (uFactor7 >= 0.0){
        finalColor = vec3(1.0, 0.0, 0.0);
      }
      fragColor = vec4(finalColor, 1.0);
    }`;
    }
    static hipsGrayscaleFS() {
        return `#version 300 es
    precision mediump float;

    in vec2 vTextureCoord;

    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;
    uniform sampler2D uSampler2;
    uniform sampler2D uSampler3;
    uniform sampler2D uSampler4;
    uniform sampler2D uSampler5;
    uniform sampler2D uSampler6;
    uniform sampler2D uSampler7;

    uniform float uFactor0;
    uniform float uFactor1;
    uniform float uFactor2;
    uniform float uFactor3;
    uniform float uFactor4;
    uniform float uFactor5;
    uniform float uFactor6;
    uniform float uFactor7;

    out vec4 fragColor;

    void main() {
      vec3 finalColor = vec3(0.0);

      if (uFactor0 >= 0.0){
        #if __VERSION__ > 120
          vec4 color0 = texture(uSampler0, vTextureCoord);
        #else
          vec4 color0 = texture2D(uSampler0, vTextureCoord);
        #endif
        float gray = 0.21 * color0.r + 0.71 * color0.g + 0.07 * color0.b;
        finalColor = color0.rgb * (1.0 - uFactor0) + vec3(gray) * uFactor0;
      }
      if (uFactor1 >= 0.0){
        #if __VERSION__ > 120
          vec4 color1 = texture(uSampler1, vTextureCoord);
        #else
          vec4 color1 = texture2D(uSampler1, vTextureCoord);
        #endif
        finalColor += color1.rgb * uFactor1;
      }
      if (uFactor2 >= 0.0){
        #if __VERSION__ > 120
          vec4 color2 = texture(uSampler2, vTextureCoord);
        #else
          vec4 color2 = texture2D(uSampler2, vTextureCoord);
        #endif
        finalColor += color2.rgb * uFactor2;
      }
      if (uFactor3 >= 0.0){
        #if __VERSION__ > 120
          vec4 color3 = texture(uSampler3, vTextureCoord);
        #else
          vec4 color3 = texture2D(uSampler3, vTextureCoord);
        #endif
        finalColor += color3.rgb * uFactor3;
      }
      if (uFactor4 >= 0.0){
        #if __VERSION__ > 120
          vec4 color4 = texture(uSampler4, vTextureCoord);
        #else
          vec4 color4 = texture2D(uSampler4, vTextureCoord);
        #endif
        finalColor += color4.rgb * uFactor4;
      }
      if (uFactor5 >= 0.0){
        #if __VERSION__ > 120
          vec4 color5 = texture(uSampler5, vTextureCoord);
        #else
          vec4 color5 = texture2D(uSampler5, vTextureCoord);
        #endif
        finalColor += color5.rgb * uFactor5;
      }
      if (uFactor6 >= 0.0){
        #if __VERSION__ > 120
          vec4 color6 = texture(uSampler6, vTextureCoord);
        #else
          vec4 color6 = texture2D(uSampler6, vTextureCoord);
        #endif
        finalColor += color6.rgb * uFactor6;
      }
      if (uFactor7 >= 0.0){
        #if __VERSION__ > 120
          vec4 color7 = texture(uSampler7, vTextureCoord);
        #else
          vec4 color7 = texture2D(uSampler7, vTextureCoord);
        #endif
        finalColor += color7.rgb * uFactor7;
      }
      fragColor = vec4(finalColor, 1.0);
    }`;
    }
    static hipsColorMapFS() {
        return `#version 300 es
    precision mediump float;

    in vec2 vTextureCoord;

    // UBO
    layout (std140) uniform colormap {
      float r_palette[256];
      float g_palette[256];
      float b_palette[256];
    };

    uniform sampler2D uSampler0;
    uniform float uFactor0;

    out vec4 fragColor;

    void main() {
      #if __VERSION__ > 120
        vec4 color0 = texture(uSampler0, vTextureCoord);
      #else
        vec4 color0 = texture2D(uSampler0, vTextureCoord);
      #endif

      int x = int(color0.r * 255.0);
      float px = r_palette[x] / 256.0;

      int y = int(color0.g * 255.0);
      float py = g_palette[y] / 256.0;

      int z = int(color0.b * 255.0);
      float pz = b_palette[z] / 256.0;

      // uFactor0 reserved for future blending if needed
      fragColor = vec4(px, py, pz, 1.0);
    }`;
    }
}
//# sourceMappingURL=ShaderManager.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js":
/*!*****************************************************************!*\
  !*** ../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");

class ComputePerspectiveMatrixSingleton {
    _pMatrix = null;
    _aspectRatio = 1;
    get pMatrix() {
        return this._pMatrix;
    }
    computePerspectiveMatrix(canvas, camera, fovDeg, nearPlane = 0.1, insideSphere) {
        this._aspectRatio = canvas.width / canvas.height;
        const p = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        let farPlane;
        if (insideSphere) {
            // Inside the sphere: cap slightly beyond radius
            farPlane = 1.1;
        }
        else {
            const camMat = camera.getCameraMatrix();
            const distCamera = -Number(camMat[14]); // camera z translation
            const r = 1; // HiPS sphere radius (inject real value if available)
            // Guard against negative due to rounding/logic
            const c2 = Math.sqrt(Math.max(distCamera ** 2 - r ** 2, 0));
            const beta = Math.atan2(c2, r);
            const cf = c2 * Math.sin(beta);
            farPlane = cf > 0 ? cf : r;
        }
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.perspective(p, (fovDeg * Math.PI) / 180, this._aspectRatio, nearPlane, farPlane);
        this._pMatrix = p;
        return p;
    }
}
const computePerspectiveMatrixSingleton = new ComputePerspectiveMatrixSingleton();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (computePerspectiveMatrixSingleton);
//# sourceMappingURL=ComputePerspectiveMatrix.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/CoordsType.js":
/*!***************************************************!*\
  !*** ../astro-viewer/lib-esm/utils/CoordsType.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Enum for coordinate types.
 * @author Fabrizio Giordano (Fab77)
 */
var CoordsType;
(function (CoordsType) {
    CoordsType["CARTESIAN"] = "cartesian";
    CoordsType["SPHERICAL"] = "spherical";
    CoordsType["ASTRO"] = "astro";
})(CoordsType || (CoordsType = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CoordsType);
//# sourceMappingURL=CoordsType.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/FoVUtils.js":
/*!*************************************************!*\
  !*** ../astro-viewer/lib-esm/utils/FoVUtils.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _model_Point_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/Point.js */ "../astro-viewer/lib-esm/model/Point.js");
/* harmony import */ var _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RayPickingUtils.js */ "../astro-viewer/lib-esm/utils/RayPickingUtils.js");
/* harmony import */ var _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var _ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");

/**
 * @author Fabrizio Giordano (Fab)
 */





class FoVUtils {
    /**
     * Return the minimum FoV value between `_fovY_deg` and `_fovX_deg`.
     * (Kept here for parity; this class doesn’t maintain those fields.)
     */
    getMinFoV() {
        return this._fovY_deg <= this._fovX_deg ? this._fovY_deg : this._fovX_deg;
    }
    /**
     * Compute the FoV polygon as a list of Points (clockwise).
     * Uses ray picking + frustum planes against a unit sphere.
     */
    static getFoVPolygon(
    // _pMatrix: ReadonlyMat4 | null,
    camera, canvas, model) {
        // const pMatrix = (computePerspectiveMatrixSingleton.pMatrix ??
        //   _pMatrix) as ReadonlyMat4;
        const pMatrix = _ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_4__["default"].pMatrix;
        const vMatrix = camera.getCameraMatrix();
        const mMatrix = model.getModelMatrix();
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        let points = [];
        // First check: does the sphere cover the whole screen?
        const intersectionWithModel = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(0, 0);
        if (intersectionWithModel.length > 0) {
            // Fully covered → grab corners + midpoints (CASE C)
            const cornersPoints = FoVUtils.getScreenCornersIntersection(pMatrix, camera, canvas);
            points = cornersPoints;
        }
        else {
            // Partial coverage: build frustum planes
            let M = gl_matrix__WEBPACK_IMPORTED_MODULE_3__.create();
            M = gl_matrix__WEBPACK_IMPORTED_MODULE_3__.multiply(M, vMatrix, mMatrix);
            M = gl_matrix__WEBPACK_IMPORTED_MODULE_3__.multiply(M, pMatrix, M);
            const topPlane = [M[3] - M[1], M[7] - M[5], M[11] - M[9], M[15] - M[13]]; // m41-m21, ...
            const bottomPlane = [M[3] + M[1], M[7] + M[5], M[11] + M[9], M[15] + M[13]];
            const rightPlane = [M[3] - M[0], M[7] - M[4], M[11] - M[8], M[15] - M[12]];
            const leftPlane = [M[3] + M[0], M[7] + M[4], M[11] + M[8], M[15] + M[12]];
            const intersectionTopMiddle = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(canvasWidth / 2, 0);
            const intersectionRightMiddle = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(canvasWidth, canvasHeight / 2);
            // CASE A: zoomed out, hemisphere fully visible
            if (intersectionTopMiddle.length === 0 &&
                intersectionRightMiddle.length === 0) {
                const topPoints = FoVUtils.getNearestSpherePoint(topPlane);
                const bottomPoints = FoVUtils.getNearestSpherePoint(bottomPlane);
                const leftPoints = FoVUtils.getNearestSpherePoint(leftPlane);
                const rightPoints = FoVUtils.getNearestSpherePoint(rightPlane);
                const middleLeftTop = FoVUtils.computeMiddlePoint(leftPoints[0], topPoints[0])[0];
                const middleTopRight = FoVUtils.computeMiddlePoint(topPoints[0], rightPoints[0])[0];
                const middleRightBottom = FoVUtils.computeMiddlePoint(rightPoints[0], bottomPoints[0])[0];
                const middleBottomLeft = FoVUtils.computeMiddlePoint(bottomPoints[0], leftPoints[0])[0];
                points.push(topPoints[0], middleTopRight, rightPoints[0], middleRightBottom, bottomPoints[0], middleBottomLeft, leftPoints[0], middleLeftTop);
            }
            // CASE E: no intersection on top/bottom planes
            else if (intersectionTopMiddle.length === 0) {
                const topPoints = FoVUtils.getNearestSpherePoint(topPlane);
                const bottomPoints = FoVUtils.getNearestSpherePoint(bottomPlane);
                const leftPoints = FoVUtils.getFrustumIntersectionWithSphere(M, leftPlane, bottomPlane, topPlane);
                const rightPoints = FoVUtils.getFrustumIntersectionWithSphere(M, rightPlane, topPlane, bottomPlane);
                const middleLeftTop = FoVUtils.computeMiddlePoint(leftPoints[1], topPoints[0])[0];
                const middleTopRight = FoVUtils.computeMiddlePoint(topPoints[0], rightPoints[0])[0];
                const middleRightBottom = FoVUtils.computeMiddlePoint(rightPoints[1], bottomPoints[0])[0];
                const middleBottomLeft = FoVUtils.computeMiddlePoint(bottomPoints[0], leftPoints[0])[0];
                points.push(topPoints[0], middleTopRight, rightPoints[0], rightPoints[1], middleRightBottom, bottomPoints[0], middleBottomLeft, leftPoints[0], leftPoints[1], middleLeftTop);
            }
            // CASE D: no intersection on right/left planes
            else if (intersectionRightMiddle.length === 0) {
                const topPoints = FoVUtils.getFrustumIntersectionWithSphere(M, topPlane, leftPlane, rightPlane);
                const bottomPoints = FoVUtils.getFrustumIntersectionWithSphere(M, bottomPlane, rightPlane, leftPlane);
                const leftPoints = FoVUtils.getNearestSpherePoint(leftPlane);
                const rightPoints = FoVUtils.getNearestSpherePoint(rightPlane);
                const middleLeftTop = FoVUtils.computeMiddlePoint(leftPoints[0], topPoints[0])[0];
                const middleTopRight = FoVUtils.computeMiddlePoint(topPoints[1], rightPoints[0])[0];
                const middleRightBottom = FoVUtils.computeMiddlePoint(rightPoints[0], bottomPoints[0])[0];
                const middleBottomLeft = FoVUtils.computeMiddlePoint(bottomPoints[1], leftPoints[0])[0];
                points.push(topPoints[0], topPoints[1], middleTopRight, rightPoints[0], middleRightBottom, bottomPoints[0], bottomPoints[1], middleBottomLeft, leftPoints[0], middleLeftTop);
            }
            // CASE B: all frustum planes intersect
            else {
                const topPoints = FoVUtils.getFrustumIntersectionWithSphere(M, topPlane, leftPlane, rightPlane);
                const bottomPoints = FoVUtils.getFrustumIntersectionWithSphere(M, bottomPlane, rightPlane, leftPlane);
                const leftPoints = FoVUtils.getFrustumIntersectionWithSphere(M, leftPlane, bottomPlane, topPlane);
                const rightPoints = FoVUtils.getFrustumIntersectionWithSphere(M, rightPlane, topPlane, bottomPlane);
                points.push(topPoints[0], topPoints[1], rightPoints[0], rightPoints[1], bottomPoints[0], bottomPoints[1], leftPoints[0], leftPoints[1]);
            }
        }
        return points;
    }
    /**
     * Ray pick against 8 key screen positions (corners + midpoints).
     * Returns Points in clockwise order starting from top-left.
     */
    static getScreenCornersIntersection(pMatrix, camera, canvas) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const topLeft = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(0, 0);
        const middleTop = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(w / 2, 0);
        const topRight = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(w, 0);
        const middleRight = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(w, h / 2);
        const bottomRight = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(w, h);
        const middleBottom = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(w / 2, h);
        const bottomLeft = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(0, h);
        const middleLeft = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(0, h / 2);
        const out = [];
        const pushIf = (ip) => {
            if (ip.length > 0) {
                out.push(new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x: ip[0], y: ip[1], z: ip[2] }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN));
            }
        };
        pushIf(topLeft);
        pushIf(middleTop);
        pushIf(topRight);
        pushIf(middleRight);
        pushIf(bottomRight);
        pushIf(middleBottom);
        pushIf(bottomLeft);
        pushIf(middleLeft);
        return out;
    }
    /** Returns the center point (in J2000) of the current view as a `Point`. */
    static getCenterJ2000(canvas) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const center = _RayPickingUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getIntersectionPointWithSingleModel(w / 2, h / 2);
        return new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x: center[0], y: center[1], z: center[2] }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN);
    }
    /** Middle point on the unit sphere along the arc between two 3D points. */
    static computeMiddlePoint(p1, p2) {
        // midpoint of segment
        const xm = (p1.x + p2.x) / 2;
        const ym = (p1.y + p2.y) / 2;
        const zm = (p1.z + p2.z) / 2;
        // project the midpoint back to unit sphere
        const len = Math.hypot(xm, ym, zm) || 1;
        const x = xm / len;
        const y = ym / len;
        const z = zm / len;
        return [new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x, y, z }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN)];
    }
    /**
     * Nearest intersection point between a frustum plane and the unit sphere,
     * using the plane normal.
     */
    static getNearestSpherePoint(plane) {
        const [A, B, C, D] = plane;
        const R = 1;
        const invLen = 1 / Math.sqrt(A * A + B * B + C * C);
        const t1 = R * invLen;
        const t2 = -R * invLen;
        const P1 = [A * t1, B * t1, C * t1];
        const P2 = [A * t2, B * t2, C * t2];
        const den = Math.sqrt(A * A + B * B + C * C) || 1;
        const dist1 = Math.abs(A * P1[0] + B * P1[1] + C * P1[2] + D) / den;
        const dist2 = Math.abs(A * P2[0] + B * P2[1] + C * P2[2] + D) / den;
        const P = dist1 <= dist2 ? P1 : P2;
        return [new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x: P[0], y: P[1], z: P[2] }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN)];
    }
    /**
     * Intersections between a frustum plane and the unit sphere,
     * computed via two perpendicular planes.
     * Returns two points (first from `plane4Circle_1`, second from `plane4Circle_2`).
     */
    static getFrustumIntersectionWithSphere(_M, plane4Sphere, plane4Circle_1, plane4Circle_2) {
        const [A0, B0, C0, D0] = plane4Sphere;
        // center of the circle (projection of sphere center onto plane)
        const denom0 = (A0 * A0 + B0 * B0 + C0 * C0) || 1;
        const x_c = -(A0 * D0) / denom0;
        const y_c = -(B0 * D0) / denom0;
        const z_c = -(C0 * D0) / denom0;
        const d = Math.abs(D0) / Math.sqrt(denom0); // distance from sphere center (0,0,0)
        const R = 1;
        const out = [];
        if (R > d) {
            const r = Math.sqrt(R * R - d * d);
            const pick = (plane) => {
                const [A, B, C, D] = plane;
                const invLen = 1 / Math.sqrt(A * A + B * B + C * C);
                const t1 = r * invLen;
                const t2 = -r * invLen;
                const P1 = [x_c + A * t1, y_c + B * t1, z_c + C * t1];
                const P2 = [x_c + A * t2, y_c + B * t2, z_c + C * t2];
                const den = Math.sqrt(A * A + B * B + C * C) || 1;
                const dist1 = Math.abs(A * P1[0] + B * P1[1] + C * P1[2] + D) / den;
                const dist2 = Math.abs(A * P2[0] + B * P2[1] + C * P2[2] + D) / den;
                return dist1 <= dist2 ? P1 : P2;
            };
            const P_intersection_1 = pick(plane4Circle_1);
            const P_intersection_2 = pick(plane4Circle_2);
            out.push(new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x: P_intersection_1[0], y: P_intersection_1[1], z: P_intersection_1[2] }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN), new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x: P_intersection_2[0], y: P_intersection_2[1], z: P_intersection_2[2] }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN));
        }
        else if (R === d) {
            // Tangent: both intersections collapse to the circle center on the plane
            out.push(new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x: x_c, y: y_c, z: z_c }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN), new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ x: x_c, y: y_c, z: z_c }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].CARTESIAN));
        }
        else {
            // No intersection; return empty to avoid pushing undefined values
            // console.log('Frustum plane not intersecting the sphere');
        }
        return out;
    }
    /** Build ADQL string from an array of Points (ra,dec pairs). */
    static getAstroFoVPolygon(points) {
        return points.map(p => p.toADQL()).join(',');
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FoVUtils);
//# sourceMappingURL=FoVUtils.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/GeomUtils.js":
/*!**************************************************!*\
  !*** ../astro-viewer/lib-esm/utils/GeomUtils.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _model_Point_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/Point.js */ "../astro-viewer/lib-esm/model/Point.js");
/* harmony import */ var _model_Point2D_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/Point2D.js */ "../astro-viewer/lib-esm/model/Point2D.js");
/* harmony import */ var _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");



class GeomUtils {
    // Orthodromic (great-circle) distance in radians
    static orthodromicDistance(p1, p2) {
        return Math.acos(Math.sin(p1.decDeg * Math.PI / 180) * Math.sin(p2.decDeg * Math.PI / 180) +
            Math.cos(p1.decDeg * Math.PI / 180) * Math.cos(p2.decDeg * Math.PI / 180) *
                Math.cos((p2.raDeg - p1.raDeg) * Math.PI / 180));
    }
    /**
     * Decide the 2D projection strategy and pre-project polygons for point-in-polygon tests.
     * Returns the projected polygons + bbox + a flag describing the projection used:
     * 0 → all points in same hemisphere with |Dec| > 10 → stereographic-like projection using x,y from 3D
     * 1 → all points in equatorial belt (|Dec| < 10) → use RA/Dec directly
     * 2 → equatorial belt and polygon crosses RA=0 → shift RA>180 by -360
     */
    static computeSelectionObject(polygons) {
        let poly4selection = [];
        let flag = 0;
        let maxx;
        let maxy;
        let minx;
        let miny;
        const DEC_THRESHOLD = 10;
        //  1 → northern hemisphere (Dec > +10), -1 → southern (Dec < -10), 0 → equatorial belt
        let hemisphere = 0;
        if (polygons[0][0].decDeg >= DEC_THRESHOLD) {
            hemisphere = 1;
        }
        else if (polygons[0][0].decDeg <= -DEC_THRESHOLD) {
            hemisphere = -1;
        }
        else {
            flag = 1;
        }
        // Case flag = 0 → stereographic-like projection using x,y,z from 3D point
        if (flag === 0) {
            const first = GeomUtils.projectIn2D(polygons[0][0]);
            maxx = minx = first.x;
            maxy = miny = first.y;
            for (const currpoly of polygons) {
                const selpoly = [];
                for (const point of currpoly) {
                    // If a point violates the hemisphere constraint, fall back to belt logic
                    if ((point.decDeg > hemisphere * DEC_THRESHOLD && hemisphere === -1) ||
                        (point.decDeg < hemisphere * DEC_THRESHOLD && hemisphere === 1)) {
                        flag = 1;
                        poly4selection = [];
                        break;
                    }
                    const p = GeomUtils.projectIn2D(point);
                    selpoly.push(p);
                    if (p.x > maxx)
                        maxx = p.x;
                    if (p.y > maxy)
                        maxy = p.y;
                    if (p.x < minx)
                        minx = p.x;
                    if (p.y < miny)
                        miny = p.y;
                }
                poly4selection.push(selpoly);
            }
        }
        if (flag === 0) {
            return {
                poly4selection,
                flag,
                maxx: maxx,
                maxy: maxy,
                minx: minx,
                miny: miny,
            };
        }
        // Case flag = 1 or 2 → work directly in (RA,Dec)
        const RA_THRESHOLD = 180;
        let belowThreshold = polygons[0][0].raDeg < RA_THRESHOLD;
        maxx = minx = polygons[0][0].raDeg;
        maxy = miny = polygons[0][0].decDeg;
        for (const currpoly of polygons) {
            const selpoly = [];
            for (const point of currpoly) {
                const p = new _model_Point2D_js__WEBPACK_IMPORTED_MODULE_1__["default"](point.raDeg, point.decDeg);
                selpoly.push(p);
                if (point.raDeg > maxx)
                    maxx = point.raDeg;
                if (point.decDeg > maxy)
                    maxy = point.decDeg;
                if (point.raDeg < minx)
                    minx = point.raDeg;
                if (point.decDeg < miny)
                    miny = point.decDeg;
                // Detect crossing of RA=0 meridian
                if ((point.raDeg >= RA_THRESHOLD && belowThreshold) ||
                    (point.raDeg <= RA_THRESHOLD && !belowThreshold)) {
                    flag = 2;
                    poly4selection = [];
                    break;
                }
            }
            poly4selection.push(selpoly);
        }
        if (flag === 1) {
            return {
                poly4selection,
                flag,
                maxx,
                maxy,
                minx,
                miny,
            };
        }
        // Case flag = 2 → shift RA>180 by -360 to unwrap around RA=0
        let startRA = polygons[0][0].raDeg;
        maxx = startRA >= RA_THRESHOLD ? startRA - 360 : startRA;
        maxy = polygons[0][0].decDeg;
        minx = maxx;
        miny = maxy;
        for (const currpoly of polygons) {
            const selpoly = [];
            for (const point of currpoly) {
                const curra = point.raDeg >= RA_THRESHOLD ? point.raDeg - 360 : point.raDeg;
                if (curra > maxx)
                    maxx = curra;
                if (point.decDeg > maxy)
                    maxy = point.decDeg;
                if (curra < minx)
                    minx = curra;
                if (point.decDeg < miny)
                    miny = point.decDeg;
                selpoly.push(new _model_Point2D_js__WEBPACK_IMPORTED_MODULE_1__["default"](curra, point.decDeg));
            }
            poly4selection.push(selpoly);
        }
        return {
            poly4selection,
            flag,
            maxx,
            maxy,
            minx,
            miny,
        };
    }
    /** Stereographic projection from 3D point on unit sphere onto plane */
    static stereographic(point) {
        const x = Number(point.xyz[0]);
        const y = Number(point.xyz[1]);
        const z = Number(point.xyz[2]);
        return {
            x: (2 * x) / (1 - z),
            y: (2 * y) / (1 - z),
        };
    }
    static projectIn2D(point) {
        const p = GeomUtils.stereographic(point);
        return new _model_Point2D_js__WEBPACK_IMPORTED_MODULE_1__["default"](p.x, p.y);
    }
    /**
     * Robust point-in-polygon (ray casting) using the precomputed selection object.
     * Works with any of the three flags (0,1,2).
     */
    static checkPointInsidePolygon5(selectionObj, point) {
        let p0;
        if (selectionObj.flag === 0) {
            p0 = GeomUtils.projectIn2D(point);
        }
        else if (selectionObj.flag === 1) {
            p0 = new _model_Point2D_js__WEBPACK_IMPORTED_MODULE_1__["default"](point.raDeg, point.decDeg);
        }
        else {
            const RA_THRESHOLD = 180;
            const raShifted = point.raDeg >= RA_THRESHOLD ? point.raDeg - 360 : point.raDeg;
            p0 = new _model_Point2D_js__WEBPACK_IMPORTED_MODULE_1__["default"](raShifted, point.decDeg);
        }
        const p1 = new _model_Point2D_js__WEBPACK_IMPORTED_MODULE_1__["default"](p0.x, p0.y + 2 * Math.abs(selectionObj.maxy - selectionObj.miny));
        // quick reject by bbox
        if (p0.x > selectionObj.maxx ||
            p0.x < selectionObj.minx ||
            p0.y > selectionObj.maxy ||
            p0.y < selectionObj.miny) {
            return false;
        }
        // Ray casting against each sub-polygon
        for (const currpoly of selectionObj.poly4selection) {
            let intersections = 0;
            for (let i = 0; i < currpoly.length - 1; i++) {
                const p2 = currpoly[i];
                const p3 = currpoly[i + 1];
                const denominator = (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y);
                const numerator01 = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x);
                const numerator23 = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x);
                if (denominator !== 0) {
                    const lamda01 = numerator01 / denominator;
                    const lambda23 = numerator23 / denominator;
                    if (lamda01 >= 0 && lamda01 <= 1 && lambda23 >= 0 && lambda23 <= 1) {
                        intersections++;
                    }
                }
            }
            // close the polygon: last with first
            {
                const p2 = currpoly[currpoly.length - 1];
                const p3 = currpoly[0];
                const denominator = (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y);
                const numerator01 = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x);
                const numerator23 = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x);
                if (denominator !== 0) {
                    const lamda01 = numerator01 / denominator;
                    const lambda23 = numerator23 / denominator;
                    if (lamda01 >= 0 && lamda01 <= 1 && lambda23 >= 0 && lambda23 <= 1) {
                        intersections++;
                    }
                }
            }
            if (intersections % 2 === 1) {
                return true; // inside this subpolygon
            }
        }
        return false;
    }
    // Legacy version kept for reference; now typed and using getters
    static checkPointInsidePolygon4(polygons, point) {
        const p0 = GeomUtils.projectIn2D(point);
        let maxdist = point.raDeg + 15;
        if (maxdist > 360)
            maxdist = point.raDeg - 15;
        const p1point = new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ raDeg: maxdist, decDeg: point.decDeg }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_2__["default"].ASTRO);
        const p1 = GeomUtils.projectIn2D(p1point);
        for (const currpoly of polygons) {
            let intersections = 0;
            for (let i = 0; i < currpoly.length - 1; i++) {
                const p2 = GeomUtils.projectIn2D(currpoly[i]);
                const p3 = GeomUtils.projectIn2D(currpoly[i + 1]);
                const denominator = (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y);
                const numerator01 = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x);
                const numerator23 = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x);
                if (denominator !== 0) {
                    const lamda01 = numerator01 / denominator;
                    const lambda23 = numerator23 / denominator;
                    if (lamda01 >= 0 && lamda01 <= 1 && lambda23 >= 0 && lambda23 <= 1) {
                        intersections++;
                    }
                }
            }
            {
                const p2 = GeomUtils.projectIn2D(currpoly[currpoly.length - 1]);
                const p3 = GeomUtils.projectIn2D(currpoly[0]);
                const denominator = (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y);
                const numerator01 = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x);
                const numerator23 = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x);
                if (denominator !== 0) {
                    const lamda01 = numerator01 / denominator;
                    const lambda23 = numerator23 / denominator;
                    if (lamda01 >= 0 && lamda01 <= 1 && lambda23 >= 0 && lambda23 <= 1) {
                        intersections++;
                    }
                }
            }
            if (intersections % 2 === 1)
                return true;
        }
        return false;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GeomUtils);
//# sourceMappingURL=GeomUtils.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/MouseHelper.js":
/*!****************************************************!*\
  !*** ../astro-viewer/lib-esm/utils/MouseHelper.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var healpixjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! healpixjs */ "../astro-viewer/node_modules/healpixjs/lib-esm/index.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Utils.js */ "../astro-viewer/lib-esm/utils/Utils.js");
/**
 * @author Fabrizio Giordano (Fab)
 */




function toVec3(p) {
    return Array.isArray(p) ? gl_matrix__WEBPACK_IMPORTED_MODULE_0__.fromValues(p[0], p[1], p[2]) : p;
}
class MouseHelper {
    _xyz = null;
    _raDecDeg = null;
    _phiThetaDeg = null;
    raHMS;
    decDMS;
    /**
     * @param in_xyz [x, y, z]
     * @param in_raDecDeg { ra, dec } in degrees (ICRS/J2000)
     * @param in_phiThetaDeg { phi, theta } in degrees (spherical)
     */
    constructor(in_xyz, in_raDecDeg, in_phiThetaDeg) {
        if (in_xyz != null)
            this._xyz = in_xyz;
        if (in_raDecDeg != null)
            this._raDecDeg = in_raDecDeg;
        if (in_phiThetaDeg != null)
            this._phiThetaDeg = in_phiThetaDeg;
        if (this._raDecDeg) {
            this.raHMS = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_3__.raDegToHMS)(this._raDecDeg.ra);
            this.decDMS = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_3__.decDegToDMS)(this._raDecDeg.dec);
        }
    }
    /** (Formerly `computeNpix256`) Uses global.nsideForSelection. */
    computeNpix() {
        if (!this._xyz)
            return null;
        const hp = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].getHealpix(_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].nsideForSelection);
        const v = new healpixjs__WEBPACK_IMPORTED_MODULE_1__.Vec3(this._xyz[0], this._xyz[1], this._xyz[2]);
        const ptg = new healpixjs__WEBPACK_IMPORTED_MODULE_1__.Pointing(v, false);
        return hp.ang2pix(ptg, false);
    }
    /** Update helper state from a world-space 3D point on the unit sphere. */
    update(mousePoint) {
        const mp = toVec3(mousePoint);
        const sph = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_3__.cartesianToSpherical)(mp);
        const radec = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_3__.sphericalToAstroDeg)(sph.phi, sph.theta);
        this._xyz = [mp[0], mp[1], mp[2]];
        this._phiThetaDeg = sph;
        this._raDecDeg = radec;
        this.raHMS = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_3__.raDegToHMS)(radec.ra);
        this.decDMS = (0,_Utils_js__WEBPACK_IMPORTED_MODULE_3__.decDegToDMS)(radec.dec);
    }
    clear() {
        this._xyz = null;
        this._raDecDeg = null;
        this._phiThetaDeg = null;
        this.raHMS = undefined;
        this.decDMS = undefined;
    }
    // --- getters ---
    get xyz() {
        return this._xyz;
    }
    get x() {
        return this._xyz ? this._xyz[0] : null;
    }
    get y() {
        return this._xyz ? this._xyz[1] : null;
    }
    get z() {
        return this._xyz ? this._xyz[2] : null;
    }
    get ra() {
        return this._raDecDeg ? this._raDecDeg.ra : null;
    }
    get dec() {
        return this._raDecDeg ? this._raDecDeg.dec : null;
    }
    get phi() {
        return this._phiThetaDeg ? this._phiThetaDeg.phi : null;
    }
    get theta() {
        return this._phiThetaDeg ? this._phiThetaDeg.theta : null;
    }
    get raDecDeg() {
        return this._raDecDeg;
    }
    get phiThetaDeg() {
        return this._phiThetaDeg;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MouseHelper);
//# sourceMappingURL=MouseHelper.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/RayPickingUtils.js":
/*!********************************************************!*\
  !*** ../astro-viewer/lib-esm/utils/RayPickingUtils.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/* harmony import */ var _ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ComputePerspectiveMatrix.js */ "../astro-viewer/lib-esm/utils/ComputePerspectiveMatrix.js");
/* harmony import */ var _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../model/grid/HealpixGridSingleton.js */ "../astro-viewer/lib-esm/model/grid/HealpixGridSingleton.js");
/**
 * @author Fabrizio Giordano (Fab)
 */





class RayPickingUtils {
    static lastNearestVisibleObjectIdx = -1;
    /** Get index of the last object found under the mouse (if any). */
    static getNearestVisibleObjectIdx() {
        return this.lastNearestVisibleObjectIdx;
    }
    /**
     * Builds a world-space ray from mouse coords.
     * @param mouseX ClientX (page pixels)
     * @param mouseY ClientY (page pixels)
     * @param pMatrix Projection matrix
     * @returns World-space direction (normalized) as a vec3
     */
    static getRayFromMouse(mouseX, mouseY, pMatrix) {
        if (!_Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera) {
            throw new Error("Camera is not initialized.");
        }
        const vMatrix = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera.getCameraMatrix();
        const gl = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].gl;
        const rect = gl.canvas.getBoundingClientRect();
        const canvasMX = mouseX - rect.left;
        const canvasMY = mouseY - rect.top;
        // viewport → NDC
        const x = (2.0 * canvasMX) / gl.canvas.clientWidth - 1.0;
        const y = 1.0 - (2.0 * canvasMY) / gl.canvas.clientHeight;
        const z = -1.0;
        // NDC → clip
        const rayClip = [x, y, z, 1.0];
        // clip → eye
        const pInv = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(pInv, pMatrix);
        const rayEye4 = [0, 0, 0, 0];
        RayPickingUtils.mat4MultiplyVec4(pInv, rayClip, rayEye4);
        // direction in eye space (z = -1, w = 0)
        const rayEye = [rayEye4[0], rayEye4[1], -1.0, 0.0];
        // eye → world
        const vInv = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.invert(vInv, vMatrix);
        const rayWorld4 = [0, 0, 0, 0];
        RayPickingUtils.mat4MultiplyVec4(vInv, rayEye, rayWorld4);
        const rayWorld = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.fromValues(rayWorld4[0], rayWorld4[1], rayWorld4[2]);
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__.normalize(rayWorld, rayWorld);
        return rayWorld;
    }
    /** a*b (4x4 * vec4) → vec4 (in `out`) */
    static mat4MultiplyVec4(a, b, out) {
        const d = b[0], e = b[1], g = b[2], w = b[3];
        out[0] = a[0] * d + a[4] * e + a[8] * g + a[12] * w;
        out[1] = a[1] * d + a[5] * e + a[9] * g + a[13] * w;
        out[2] = a[2] * d + a[6] * e + a[10] * g + a[14] * w;
        out[3] = a[3] * d + a[7] * e + a[11] * g + a[15] * w;
        return out;
    }
    /**
     * Ray–sphere intersection (world space).
     * @returns distance `t` along the ray to the first hit, or `-1` if no hit.
     */
    static raySphere(rayOrigWorld, rayDirectionWorld) {
        let intersectionDistance = -1;
        const L = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__.subtract(L, rayOrigWorld, _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__["default"].center);
        const b = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.dot(rayDirectionWorld, L);
        const c = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.dot(L, L) - _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__["default"].radius * _model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__["default"].radius;
        const disc = b * b - c;
        if (disc > 0.0) {
            const s = Math.sqrt(disc);
            const ta = -b + s;
            const tb = -b - s;
            if (ta < 0.0 && tb < 0.0) {
                // behind camera
            }
            else if (tb < 0.0) {
                intersectionDistance = ta;
            }
            else {
                intersectionDistance = Math.min(ta, tb);
            }
        }
        else if (disc === 0.0) {
            const t = -b; // tangent
            if (t >= 0.0) {
                intersectionDistance = t;
            }
        }
        return intersectionDistance;
    }
    /**
     * Compute intersection with a single model (defaults to the Healpix grid).
     * @returns model-space intersection point (vec3) if hit, otherwise empty array; and the picked model.
     */
    static getIntersectionPointWithSingleModel(mouseX, mouseY) {
        const pMatrix = _ComputePerspectiveMatrix_js__WEBPACK_IMPORTED_MODULE_3__["default"].pMatrix;
        const camera = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].camera;
        if (!camera) {
            throw new Error("Camera is not initialized.");
        }
        const rayWorld = RayPickingUtils.getRayFromMouse(mouseX, mouseY, pMatrix);
        const t = RayPickingUtils.raySphere(camera.getCameraPosition(), rayWorld);
        let intersectionModelPoint = [];
        if (t >= 0) {
            // world intersection
            const worldHit = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__.scale(worldHit, rayWorld, t);
            gl_matrix__WEBPACK_IMPORTED_MODULE_1__.add(worldHit, camera.getCameraPosition(), worldHit);
            // world → model
            const worldHit4 = [worldHit[0], worldHit[1], worldHit[2], 1.0];
            const modelHit4 = [0, 0, 0, 0];
            RayPickingUtils.mat4MultiplyVec4(_model_grid_HealpixGridSingleton_js__WEBPACK_IMPORTED_MODULE_4__["default"].getModelMatrixInverse(), worldHit4, modelHit4);
            intersectionModelPoint = [modelHit4[0], modelHit4[1], modelHit4[2]];
        }
        return intersectionModelPoint;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RayPickingUtils);
//# sourceMappingURL=RayPickingUtils.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/STCSParser.js":
/*!***************************************************!*\
  !*** ../astro-viewer/lib-esm/utils/STCSParser.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _model_Point_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/Point.js */ "../astro-viewer/lib-esm/model/Point.js");
/* harmony import */ var _CoordsType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CoordsType.js */ "../astro-viewer/lib-esm/utils/CoordsType.js");
/* harmony import */ var _Global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Global.js */ "../astro-viewer/lib-esm/Global.js");
/**
 * @author Fabrizio Giordano (Fab77)
 */



class STCSParser {
    static parseSTCS(stcs) {
        const stcsParsed = STCSParser.cleanStcs(stcs);
        let totPoints = 0;
        const polygons = [];
        if (stcsParsed.includes("POLYGON")) {
            return STCSParser.parsePolygon(stcsParsed);
        }
        else if (stcsParsed.includes("CIRCLE")) {
            return STCSParser.parseCircle(stcsParsed);
        }
        else {
            console.warn("STCS not recognised");
        }
        return { totpoints: totPoints, polygons };
    }
    static cleanStcs(stcs) {
        // Uppercase once
        let s = stcs.toUpperCase();
        // Remove tokens
        s = s
            .replace(/'ICRS'/g, '')
            .replace(/\bICRS\b/g, '')
            .replace(/\bJ2000\b/g, '')
            .replace(/\bUNION\b/g, '')
            .replace(/\bTOPOCENTER\b/g, '');
        // Remove parentheses
        s = s.replace(/[()]/g, '');
        // Collapse extra spaces and trim
        s = s.replace(/ {2,}/g, ' ').trim();
        return s;
    }
    static parsePolygon(stcs) {
        let totPoints = 0;
        const polygons = [];
        const MAX_DECIMALS = _Global_js__WEBPACK_IMPORTED_MODULE_2__["default"].MAX_DECIMALS ?? 12;
        const polys = stcs.split("POLYGON ");
        for (let i = 1; i < polys.length; i++) {
            const currPoly = [];
            const points = polys[i].trim().split(" ");
            // If first point is repeated as last, remove the duplicate
            const p0 = Number(parseFloat(points[0]).toFixed(MAX_DECIMALS));
            const p1 = Number(parseFloat(points[1]).toFixed(MAX_DECIMALS));
            const plast0 = Number(parseFloat(points[points.length - 2]).toFixed(MAX_DECIMALS));
            const plast1 = Number(parseFloat(points[points.length - 1]).toFixed(MAX_DECIMALS));
            if (p0 === plast0 && p1 === plast1) {
                points.splice(points.length - 2, 2);
            }
            if (points.length > 2) {
                for (let p = 0; p < points.length - 1; p += 2) {
                    const raDeg = Number(parseFloat(points[p]).toFixed(MAX_DECIMALS));
                    const decDeg = Number(parseFloat(points[p + 1]).toFixed(MAX_DECIMALS));
                    const point = new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ raDeg, decDeg }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_1__["default"].ASTRO);
                    currPoly.push(point);
                    totPoints += 1;
                }
                polygons.push(currPoly);
            }
        }
        return { totpoints: totPoints, polygons };
    }
    // Example format: "CIRCLE ICRS 8.739685 4.38147 0.027833"
    static parseCircle(stcs) {
        let totPoints = 0;
        const polygons = [];
        const polys = stcs.split("CIRCLE ");
        for (let i = 1; i < polys.length; i++) {
            const currPoly = [];
            const tokens = polys[i].trim().split(" ");
            const ra = Number(tokens[0]);
            const dec = Number(tokens[1]);
            const radius = Number(tokens[2]);
            const POINTS_PER_QUADRANT = 6;
            const npoints = POINTS_PER_QUADRANT * 4;
            const alpha = (2 * Math.PI) / npoints;
            // Generate points around the circle
            for (let p = npoints; p > 0; p--) {
                const curra = radius * Math.cos(p * alpha) + ra;
                const curdec = radius * Math.sin(p * alpha) + dec;
                const point = new _model_Point_js__WEBPACK_IMPORTED_MODULE_0__["default"]({ raDeg: curra, decDeg: curdec }, _CoordsType_js__WEBPACK_IMPORTED_MODULE_1__["default"].ASTRO);
                currPoly.push(point);
                totPoints += 1;
            }
            polygons.push(currPoly);
        }
        return { totpoints: totPoints, polygons };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (STCSParser);
//# sourceMappingURL=STCSParser.js.map

/***/ }),

/***/ "../astro-viewer/lib-esm/utils/Utils.js":
/*!**********************************************!*\
  !*** ../astro-viewer/lib-esm/utils/Utils.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   astroDegToSpherical: () => (/* binding */ astroDegToSpherical),
/* harmony export */   cartesianToSpherical: () => (/* binding */ cartesianToSpherical),
/* harmony export */   colorHex2RGB: () => (/* binding */ colorHex2RGB),
/* harmony export */   decDegToDMS: () => (/* binding */ decDegToDMS),
/* harmony export */   degToRad: () => (/* binding */ degToRad),
/* harmony export */   raDegToHMS: () => (/* binding */ raDegToHMS),
/* harmony export */   radToDeg: () => (/* binding */ radToDeg),
/* harmony export */   sphericalToAstroDeg: () => (/* binding */ sphericalToAstroDeg),
/* harmony export */   sphericalToCartesian: () => (/* binding */ sphericalToCartesian)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js");
/**
 * @author Fabrizio Giordano (Fab)
 */

// results in degrees
function cartesianToSpherical(xyz) {
    const dotXYZ = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.dot(xyz, xyz);
    const r = Math.sqrt(dotXYZ);
    let theta = Math.acos(xyz[2] / r);
    theta = radToDeg(theta);
    // NB: in atan(y/x) is written with params switched atan2(x, y)
    let phi = Math.atan2(xyz[1], xyz[0]);
    phi = radToDeg(phi);
    if (phi < 0) {
        phi += 360;
    }
    return { phi, theta };
}
function colorHex2RGB(hexColor) {
    const hex1 = hexColor.substring(1, 3);
    const hex2 = hexColor.substring(3, 5);
    const hex3 = hexColor.substring(5, 7);
    const dec1 = parseInt(hex1, 16);
    const dec2 = parseInt(hex2, 16);
    const dec3 = parseInt(hex3, 16);
    const rgb1 = (dec1 / 255).toFixed(2);
    const rgb2 = (dec2 / 255).toFixed(2);
    const rgb3 = (dec3 / 255).toFixed(2);
    return [parseFloat(rgb1), parseFloat(rgb2), parseFloat(rgb3)];
}
function degToRad(degrees) {
    return (degrees / 180) * Math.PI;
}
function radToDeg(radians) {
    return (radians * 180) / Math.PI;
}
function sphericalToAstroDeg(phiDeg, thetaDeg) {
    let raDeg = phiDeg;
    if (raDeg < 0) {
        raDeg += 360;
    }
    const decDeg = 90 - thetaDeg;
    return { ra: raDeg, dec: decDeg };
}
function sphericalToCartesian(phiDeg, thetaDeg, r = 1) {
    const x = r * Math.sin(degToRad(thetaDeg)) * Math.cos(degToRad(phiDeg));
    const y = r * Math.sin(degToRad(thetaDeg)) * Math.sin(degToRad(phiDeg));
    const z = r * Math.cos(degToRad(thetaDeg));
    return [x, y, z];
}
function astroDegToSpherical(raDeg, decDeg) {
    let phiDeg = raDeg;
    if (phiDeg < 0) {
        phiDeg += 360;
    }
    const thetaDeg = 90 - decDeg;
    return { phi: phiDeg, theta: thetaDeg };
}
function raDegToHMS(raDeg) {
    const h = Math.floor(raDeg / 15);
    const m = Math.floor((raDeg / 15 - h) * 60);
    const s = (raDeg / 15 - h - m / 60) * 3600;
    return { h, m, s };
}
function decDegToDMS(decDeg) {
    let sign = 1;
    if (decDeg < 0) {
        sign = -1;
    }
    const decDegAbs = Math.abs(decDeg);
    let d = Math.trunc(decDegAbs);
    const m = Math.trunc((decDegAbs - d) * 60);
    const s = (decDegAbs - d - m / 60) * 3600;
    d = d * sign;
    return { d, m, s };
}
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/gl-matrix/esm/common.js":
/*!************************************************************!*\
  !*** ../astro-viewer/node_modules/gl-matrix/esm/common.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANGLE_ORDER: () => (/* binding */ ANGLE_ORDER),
/* harmony export */   ARRAY_TYPE: () => (/* binding */ ARRAY_TYPE),
/* harmony export */   EPSILON: () => (/* binding */ EPSILON),
/* harmony export */   RANDOM: () => (/* binding */ RANDOM),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   setMatrixArrayType: () => (/* binding */ setMatrixArrayType),
/* harmony export */   toDegree: () => (/* binding */ toDegree),
/* harmony export */   toRadian: () => (/* binding */ toRadian)
/* harmony export */ });
/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var ANGLE_ORDER = "zyx";

/**
 * Symmetric round
 * see https://www.npmjs.com/package/round-half-up-symmetric#user-content-detailed-background
 *
 * @param {Number} a value to round
 */
function round(a) {
  if (a >= 0) return Math.round(a);
  return a % 0.5 === 0 ? Math.floor(a) : Math.round(a);
}

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */
function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
var radian = 180 / Math.PI;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
function toRadian(a) {
  return a * degree;
}

/**
 * Convert Radian To Degree
 *
 * @param {Number} a Angle in Radians
 */
function toDegree(a) {
  return a * radian;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a          The first number to test.
 * @param {Number} b          The second number to test.
 * @param {Number} tolerance  Absolute or relative tolerance (default glMatrix.EPSILON)
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function equals(a, b) {
  var tolerance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

/***/ }),

/***/ "../astro-viewer/node_modules/gl-matrix/esm/mat4.js":
/*!**********************************************************!*\
  !*** ../astro-viewer/node_modules/gl-matrix/esm/mat4.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   adjoint: () => (/* binding */ adjoint),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   decompose: () => (/* binding */ decompose),
/* harmony export */   determinant: () => (/* binding */ determinant),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   frob: () => (/* binding */ frob),
/* harmony export */   fromQuat: () => (/* binding */ fromQuat),
/* harmony export */   fromQuat2: () => (/* binding */ fromQuat2),
/* harmony export */   fromRotation: () => (/* binding */ fromRotation),
/* harmony export */   fromRotationTranslation: () => (/* binding */ fromRotationTranslation),
/* harmony export */   fromRotationTranslationScale: () => (/* binding */ fromRotationTranslationScale),
/* harmony export */   fromRotationTranslationScaleOrigin: () => (/* binding */ fromRotationTranslationScaleOrigin),
/* harmony export */   fromScaling: () => (/* binding */ fromScaling),
/* harmony export */   fromTranslation: () => (/* binding */ fromTranslation),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   fromXRotation: () => (/* binding */ fromXRotation),
/* harmony export */   fromYRotation: () => (/* binding */ fromYRotation),
/* harmony export */   fromZRotation: () => (/* binding */ fromZRotation),
/* harmony export */   frustum: () => (/* binding */ frustum),
/* harmony export */   getRotation: () => (/* binding */ getRotation),
/* harmony export */   getScaling: () => (/* binding */ getScaling),
/* harmony export */   getTranslation: () => (/* binding */ getTranslation),
/* harmony export */   identity: () => (/* binding */ identity),
/* harmony export */   invert: () => (/* binding */ invert),
/* harmony export */   lookAt: () => (/* binding */ lookAt),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   multiplyScalar: () => (/* binding */ multiplyScalar),
/* harmony export */   multiplyScalarAndAdd: () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   ortho: () => (/* binding */ ortho),
/* harmony export */   orthoNO: () => (/* binding */ orthoNO),
/* harmony export */   orthoZO: () => (/* binding */ orthoZO),
/* harmony export */   perspective: () => (/* binding */ perspective),
/* harmony export */   perspectiveFromFieldOfView: () => (/* binding */ perspectiveFromFieldOfView),
/* harmony export */   perspectiveNO: () => (/* binding */ perspectiveNO),
/* harmony export */   perspectiveZO: () => (/* binding */ perspectiveZO),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   rotateX: () => (/* binding */ rotateX),
/* harmony export */   rotateY: () => (/* binding */ rotateY),
/* harmony export */   rotateZ: () => (/* binding */ rotateZ),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   targetTo: () => (/* binding */ targetTo),
/* harmony export */   translate: () => (/* binding */ translate),
/* harmony export */   transpose: () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "../astro-viewer/node_modules/gl-matrix/esm/common.js");


/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    var a12 = a[6],
      a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4 | null} out, or null if source matrix is not invertible
 */
function invert(out, a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  out[0] = a11 * b11 - a12 * b10 + a13 * b09;
  out[1] = a02 * b10 - a01 * b11 - a03 * b09;
  out[2] = a31 * b05 - a32 * b04 + a33 * b03;
  out[3] = a22 * b04 - a21 * b05 - a23 * b03;
  out[4] = a12 * b08 - a10 * b11 - a13 * b07;
  out[5] = a00 * b11 - a02 * b08 + a03 * b07;
  out[6] = a32 * b02 - a30 * b05 - a33 * b01;
  out[7] = a20 * b05 - a22 * b02 + a23 * b01;
  out[8] = a10 * b10 - a11 * b08 + a13 * b06;
  out[9] = a01 * b08 - a00 * b10 - a03 * b06;
  out[10] = a30 * b04 - a31 * b02 + a33 * b00;
  out[11] = a21 * b02 - a20 * b04 - a23 * b00;
  out[12] = a11 * b07 - a10 * b09 - a12 * b06;
  out[13] = a00 * b09 - a01 * b07 + a02 * b06;
  out[14] = a31 * b01 - a30 * b03 - a32 * b00;
  out[15] = a20 * b03 - a21 * b01 + a22 * b00;
  return out;
}

/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];
  var b0 = a00 * a11 - a01 * a10;
  var b1 = a00 * a12 - a02 * a10;
  var b2 = a01 * a12 - a02 * a11;
  var b3 = a20 * a31 - a21 * a30;
  var b4 = a20 * a32 - a22 * a30;
  var b5 = a21 * a32 - a22 * a31;
  var b6 = a00 * b5 - a01 * b4 + a02 * b3;
  var b7 = a10 * b5 - a11 * b4 + a12 * b3;
  var b8 = a20 * b2 - a21 * b1 + a22 * b0;
  var b9 = a30 * b2 - a31 * b1 + a32 * b0;

  // Calculate the determinant
  return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
}

/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];

  // Cache only the current line of the second matrix
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
  var x = v[0],
    y = v[1],
    z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
  var x = v[0],
    y = v[1],
    z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
  var x = axis[0],
    y = axis[1],
    z = axis[2];
  var len = Math.sqrt(x * x + y * y + z * z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;
  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
  var x = axis[0],
    y = axis[1],
    z = axis[2];
  var len = Math.sqrt(x * x + y * y + z * z);
  var s, c, t;
  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *     let quatMat = mat4.create();
 *     mat4.fromQuat(quatMat, quat);
 *     mat4.multiply(dest, dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */
function fromQuat2(out, a) {
  var translation = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  var bx = -a[0],
    by = -a[1],
    bz = -a[2],
    bw = a[3],
    ax = a[4],
    ay = a[5],
    az = a[6],
    aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw;
  //Only scale if it makes sense
  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  fromRotationTranslation(out, a, translation);
  return out;
}

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion parameter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
  return out;
}

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
function getRotation(out, mat) {
  var scaling = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}

/**
 * Decomposes a transformation matrix into its rotation, translation
 * and scale components. Returns only the rotation component
 * @param  {quat} out_r Quaternion to receive the rotation component
 * @param  {vec3} out_t Vector to receive the translation vector
 * @param  {vec3} out_s Vector to receive the scaling factor
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @returns {quat} out_r
 */
function decompose(out_r, out_t, out_s, mat) {
  out_t[0] = mat[12];
  out_t[1] = mat[13];
  out_t[2] = mat[14];
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
  var is1 = 1 / out_s[0];
  var is2 = 1 / out_s[1];
  var is3 = 1 / out_s[2];
  var sm11 = m11 * is1;
  var sm12 = m12 * is2;
  var sm13 = m13 * is3;
  var sm21 = m21 * is1;
  var sm22 = m22 * is2;
  var sm23 = m23 * is3;
  var sm31 = m31 * is1;
  var sm32 = m32 * is2;
  var sm33 = m33 * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out_r[3] = 0.25 * S;
    out_r[0] = (sm23 - sm32) / S;
    out_r[1] = (sm31 - sm13) / S;
    out_r[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out_r[3] = (sm23 - sm32) / S;
    out_r[0] = 0.25 * S;
    out_r[1] = (sm12 + sm21) / S;
    out_r[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out_r[3] = (sm31 - sm13) / S;
    out_r[0] = (sm12 + sm21) / S;
    out_r[1] = 0.25 * S;
    out_r[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out_r[3] = (sm12 - sm21) / S;
    out_r[0] = (sm31 + sm13) / S;
    out_r[1] = (sm23 + sm32) / S;
    out_r[2] = 0.25 * S;
  }
  return out_r;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *     let quatMat = mat4.create();
 *     mat4.fromQuat(quatMat, quat);
 *     mat4.multiply(dest, dest, quatMat);
 *     mat4.scale(dest, dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *     mat4.translate(dest, dest, origin);
 *     let quatMat = mat4.create();
 *     mat4.fromQuat(quatMat, quat);
 *     mat4.multiply(dest, dest, quatMat);
 *     mat4.scale(dest, dest, scale)
 *     mat4.translate(dest, dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
function fromQuat(out, q) {
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */
function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    var nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}

/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */
var perspective = perspectiveNO;

/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */
function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    var nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */
var ortho = orthoNO;

/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];
  if (Math.abs(eyex - centerx) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyey - centery) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyez - centerz) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return identity(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} target Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */
function targetTo(out, eye, target, up) {
  var eyex = eye[0],
    eyey = eye[1],
    eyez = eye[2],
    upx = up[0],
    upy = up[1],
    upz = up[2];
  var z0 = eyex - target[0],
    z1 = eyey - target[1],
    z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }
  var x0 = upy * z2 - upz * z1,
    x1 = upz * z0 - upx * z2,
    x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}

/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8] + a[9] * a[9] + a[10] * a[10] + a[11] * a[11] + a[12] * a[12] + a[13] * a[13] + a[14] * a[14] + a[15] * a[15]);
}

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var a4 = a[4],
    a5 = a[5],
    a6 = a[6],
    a7 = a[7];
  var a8 = a[8],
    a9 = a[9],
    a10 = a[10],
    a11 = a[11];
  var a12 = a[12],
    a13 = a[13],
    a14 = a[14],
    a15 = a[15];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  var b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7];
  var b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11];
  var b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
var mul = multiply;

/**
 * Alias for {@link mat4.subtract}
 * @function
 */
var sub = subtract;

/***/ }),

/***/ "../astro-viewer/node_modules/gl-matrix/esm/vec3.js":
/*!**********************************************************!*\
  !*** ../astro-viewer/node_modules/gl-matrix/esm/vec3.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   angle: () => (/* binding */ angle),
/* harmony export */   bezier: () => (/* binding */ bezier),
/* harmony export */   ceil: () => (/* binding */ ceil),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   cross: () => (/* binding */ cross),
/* harmony export */   dist: () => (/* binding */ dist),
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   div: () => (/* binding */ div),
/* harmony export */   divide: () => (/* binding */ divide),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   hermite: () => (/* binding */ hermite),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   negate: () => (/* binding */ negate),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   rotateX: () => (/* binding */ rotateX),
/* harmony export */   rotateY: () => (/* binding */ rotateY),
/* harmony export */   rotateZ: () => (/* binding */ rotateZ),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   scaleAndAdd: () => (/* binding */ scaleAndAdd),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   slerp: () => (/* binding */ slerp),
/* harmony export */   sqrDist: () => (/* binding */ sqrDist),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredDistance: () => (/* binding */ squaredDistance),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   transformMat3: () => (/* binding */ transformMat3),
/* harmony export */   transformMat4: () => (/* binding */ transformMat4),
/* harmony export */   transformQuat: () => (/* binding */ transformQuat),
/* harmony export */   zero: () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "../astro-viewer/node_modules/gl-matrix/esm/common.js");


/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}

/**
 * symmetric round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */
function round(out, a) {
  out[0] = _common_js__WEBPACK_IMPORTED_MODULE_0__.round(a[0]);
  out[1] = _common_js__WEBPACK_IMPORTED_MODULE_0__.round(a[1]);
  out[2] = _common_js__WEBPACK_IMPORTED_MODULE_0__.round(a[2]);
  return out;
}

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}

/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  var ax = a[0],
    ay = a[1],
    az = a[2];
  var bx = b[0],
    by = b[1],
    bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

/**
 * Performs a spherical linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function slerp(out, a, b, t) {
  var angle = Math.acos(Math.min(Math.max(dot(a, b), -1), 1));
  var sinTotal = Math.sin(angle);
  var ratioA = Math.sin((1 - t) * angle) / sinTotal;
  var ratioB = Math.sin(t * angle) / sinTotal;
  out[0] = ratioA * a[0] + ratioB * b[0];
  out[1] = ratioA * a[1] + ratioB * b[1];
  out[2] = ratioA * a[2] + ratioB * b[2];
  return out;
}

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
  scale = scale === undefined ? 1.0 : scale;
  var r = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 * Math.PI;
  var z = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
  var x = a[0],
    y = a[1],
    z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
  var x = a[0],
    y = a[1],
    z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q normalized quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
  // Fast Vector Rotation using Quaternions by Robert Eisele
  // https://raw.org/proof/vector-rotation-using-quaternions/

  var qx = q[0],
    qy = q[1],
    qz = q[2],
    qw = q[3];
  var vx = a[0],
    vy = a[1],
    vz = a[2];

  // t = q x v
  var tx = qy * vz - qz * vy;
  var ty = qz * vx - qx * vz;
  var tz = qx * vy - qy * vx;

  // t = 2t
  tx = tx + tx;
  ty = ty + ty;
  tz = tz + tz;

  // v + w t + q x t
  out[0] = vx + qw * tx + qy * tz - qz * ty;
  out[1] = vy + qw * ty + qz * tx - qx * tz;
  out[2] = vz + qw * tz + qx * ty - qy * tx;
  return out;
}

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */
function rotateX(out, a, b, rad) {
  var p = [],
    r = [];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */
function rotateY(out, a, b, rad) {
  var p = [],
    r = [];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */
function rotateZ(out, a, b, rad) {
  var p = [],
    r = [];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}

/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
  var ax = a[0],
    ay = a[1],
    az = a[2],
    bx = b[0],
    by = b[1],
    bz = b[2],
    mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz)),
    cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}

/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */
function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
var sub = subtract;

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
var mul = multiply;

/**
 * Alias for {@link vec3.divide}
 * @function
 */
var div = divide;

/**
 * Alias for {@link vec3.distance}
 * @function
 */
var dist = distance;

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
var sqrDist = squaredDistance;

/**
 * Alias for {@link vec3.length}
 * @function
 */
var len = length;

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
var sqrLen = squaredLength;

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

/***/ }),

/***/ "../astro-viewer/node_modules/gl-matrix/esm/vec4.js":
/*!**********************************************************!*\
  !*** ../astro-viewer/node_modules/gl-matrix/esm/vec4.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   ceil: () => (/* binding */ ceil),
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   cross: () => (/* binding */ cross),
/* harmony export */   dist: () => (/* binding */ dist),
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   div: () => (/* binding */ div),
/* harmony export */   divide: () => (/* binding */ divide),
/* harmony export */   dot: () => (/* binding */ dot),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   exactEquals: () => (/* binding */ exactEquals),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   fromValues: () => (/* binding */ fromValues),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   len: () => (/* binding */ len),
/* harmony export */   length: () => (/* binding */ length),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   mul: () => (/* binding */ mul),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   negate: () => (/* binding */ negate),
/* harmony export */   normalize: () => (/* binding */ normalize),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   scaleAndAdd: () => (/* binding */ scaleAndAdd),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   sqrDist: () => (/* binding */ sqrDist),
/* harmony export */   sqrLen: () => (/* binding */ sqrLen),
/* harmony export */   squaredDistance: () => (/* binding */ squaredDistance),
/* harmony export */   squaredLength: () => (/* binding */ squaredLength),
/* harmony export */   str: () => (/* binding */ str),
/* harmony export */   sub: () => (/* binding */ sub),
/* harmony export */   subtract: () => (/* binding */ subtract),
/* harmony export */   transformMat4: () => (/* binding */ transformMat4),
/* harmony export */   transformQuat: () => (/* binding */ transformQuat),
/* harmony export */   zero: () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "../astro-viewer/node_modules/gl-matrix/esm/common.js");


/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {ReadonlyVec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues(x, y, z, w) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to ceil
 * @returns {vec4} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to floor
 * @returns {vec4} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}

/**
 * symmetric round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to round
 * @returns {vec4} out
 */
function round(out, a) {
  out[0] = _common_js__WEBPACK_IMPORTED_MODULE_0__.round(a[0]);
  out[1] = _common_js__WEBPACK_IMPORTED_MODULE_0__.round(a[1]);
  out[2] = _common_js__WEBPACK_IMPORTED_MODULE_0__.round(a[2]);
  out[3] = _common_js__WEBPACK_IMPORTED_MODULE_0__.round(a[3]);
  return out;
}

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}

/**
 * Calculates the length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}

/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to negate
 * @returns {vec4} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to invert
 * @returns {vec4} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/**
 * Returns the cross-product of three vectors in a 4-dimensional space
 *
 * @param {ReadonlyVec4} out the receiving vector
 * @param {ReadonlyVec4} u the first vector
 * @param {ReadonlyVec4} v the second vector
 * @param {ReadonlyVec4} w the third vector
 * @returns {vec4} result
 */
function cross(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0],
    B = v[0] * w[2] - v[2] * w[0],
    C = v[0] * w[3] - v[3] * w[0],
    D = v[1] * w[2] - v[2] * w[1],
    E = v[1] * w[3] - v[3] * w[1],
    F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
 * @returns {vec4} out
 */
function random(out, scale) {
  scale = scale === undefined ? 1.0 : scale;

  // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;
  var v1, v2, v3, v4;
  var s1, s2;
  var rand;
  rand = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  v1 = rand * 2 - 1;
  v2 = (4 * _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
  s1 = v1 * v1 + v2 * v2;
  rand = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  v3 = rand * 2 - 1;
  v4 = (4 * _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
  s2 = v3 * v3 + v4 * v4;
  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4(out, a, m) {
  var x = a[0],
    y = a[1],
    z = a[2],
    w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyQuat} q normalized quaternion to transform with
 * @returns {vec4} out
 */
function transformQuat(out, a, q) {
  // Fast Vector Rotation using Quaternions by Robert Eisele
  // https://raw.org/proof/vector-rotation-using-quaternions/

  var qx = q[0],
    qy = q[1],
    qz = q[2],
    qw = q[3];
  var vx = a[0],
    vy = a[1],
    vz = a[2];

  // t = q x v
  var tx = qy * vz - qz * vy;
  var ty = qz * vx - qx * vz;
  var tz = qx * vy - qy * vx;

  // t = 2t
  tx = tx + tx;
  ty = ty + ty;
  tz = tz + tz;

  // v + w t + q x t
  out[0] = vx + qw * tx + qy * tz - qz * ty;
  out[1] = vy + qw * ty + qz * tx - qx * tz;
  out[2] = vz + qw * tz + qx * ty - qy * tx;
  out[3] = a[3];
  return out;
}

/**
 * Set the components of a vec4 to zero
 *
 * @param {vec4} out the receiving vector
 * @returns {vec4} out
 */
function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
var sub = subtract;

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
var mul = multiply;

/**
 * Alias for {@link vec4.divide}
 * @function
 */
var div = divide;

/**
 * Alias for {@link vec4.distance}
 * @function
 */
var dist = distance;

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
var sqrDist = squaredDistance;

/**
 * Alias for {@link vec4.length}
 * @function
 */
var len = length;

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
var sqrLen = squaredLength;

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
}();

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/CircleFinder.js":
/*!**********************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/CircleFinder.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CircleFinder: () => (/* binding */ CircleFinder)
/* harmony export */ });
/* harmony import */ var _Vec3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vec3.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Vec3.js");

class CircleFinder {
    /**
     * @param point: Vec3
     */
    constructor(point) {
        let np = point.length;
        //HealpixUtils.check(np>=2,"too few points");
        if (!(np >= 2)) {
            console.log("too few points");
            return;
        }
        this.center = point[0].add(point[1]);
        this.center.normalize();
        this.cosrad = point[0].dot(this.center);
        for (let i = 2; i < np; ++i) {
            if (point[i].dot(this.center) < this.cosrad) { // point outside the current circle
                this.getCircle(point, i);
            }
        }
    }
    ;
    /**
     * @parm point: Vec3
     * @param q: int
     */
    getCircle(point, q) {
        this.center = point[0].add(point[q]);
        this.center.normalize();
        this.cosrad = point[0].dot(this.center);
        for (let i = 1; i < q; ++i) {
            if (point[i].dot(this.center) < this.cosrad) { // point outside the current circle
                this.getCircle2(point, i, q);
            }
        }
    }
    ;
    /**
     * @parm point: Vec3
     * @param q1: int
     * @param q2: int
     */
    getCircle2(point, q1, q2) {
        this.center = point[q1].add(point[q2]);
        this.center.normalize();
        this.cosrad = point[q1].dot(this.center);
        for (let i = 0; i < q1; ++i) {
            if (point[i].dot(this.center) < this.cosrad) { // point outside the current circle
                this.center = (point[q1].sub(point[i])).cross(point[q2].sub(point[i]));
                this.center.normalize();
                this.cosrad = point[i].dot(this.center);
                if (this.cosrad < 0) {
                    this.center.flip();
                    this.cosrad = -this.cosrad;
                }
            }
        }
    }
    ;
    getCenter() {
        return new _Vec3_js__WEBPACK_IMPORTED_MODULE_0__.Vec3(this.center.x, this.center.y, this.center.z);
    }
    getCosrad() {
        return this.cosrad;
    }
    ;
}
//# sourceMappingURL=CircleFinder.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Constants.js":
/*!*******************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Constants.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Constants: () => (/* binding */ Constants)
/* harmony export */ });
class Constants {
}
//	static halfpi = Math.PI/2.;
Constants.halfpi = 1.5707963267948966;
Constants.inv_halfpi = 2. / Math.PI;
/** The Constant twopi. */
Constants.twopi = 2 * Math.PI;
Constants.inv_twopi = 1. / (2 * Math.PI);
//# sourceMappingURL=Constants.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Fxyf.js":
/*!**************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Fxyf.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fxyf: () => (/* binding */ Fxyf)
/* harmony export */ });
/* harmony import */ var _Hploc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Hploc.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Hploc.js");
/**
 * Partial porting to Javascript of Fxyf.java from Healpix3.30
 */

class Fxyf {
    constructor(x, y, f) {
        this.fx = x;
        this.fy = y;
        this.face = f;
        // coordinate of the lowest corner of each face
        this.jrll = new Uint8Array([2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]);
        this.jpll = new Uint8Array([1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7]);
        this.halfpi = Math.PI / 2.;
    }
    toHploc() {
        let loc = new _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc();
        let jr = this.jrll[this.face] - this.fx - this.fy;
        let nr;
        if (jr < 1) {
            nr = jr;
            let tmp = nr * nr / 3.;
            loc.z = 1 - tmp;
            if (loc.z > 0.99) {
                loc.sth = Math.sqrt(tmp * (2.0 - tmp));
                loc.have_sth = true;
            }
        }
        else if (jr > 3) {
            nr = 4 - jr;
            let tmp = nr * nr / 3.;
            loc.z = tmp - 1;
            if (loc.z < -0.99) {
                loc.sth = Math.sqrt(tmp * (2.0 - tmp));
                loc.have_sth = true;
            }
        }
        else {
            nr = 1;
            loc.z = (2 - jr) * 2.0 / 3.;
        }
        let tmp = this.jpll[this.face] * nr + this.fx - this.fy;
        if (tmp < 0) {
            tmp += 8;
        }
        if (tmp >= 8) {
            tmp -= 8;
        }
        loc.phi = (nr < 1e-15) ? 0 : (0.5 * this.halfpi * tmp) / nr;
        return loc;
    }
    ;
    toVec3() {
        return this.toHploc().toVec3();
    }
    ;
}
//# sourceMappingURL=Fxyf.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Healpix.js":
/*!*****************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Healpix.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Healpix: () => (/* binding */ Healpix)
/* harmony export */ });
/* harmony import */ var _CircleFinder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CircleFinder.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/CircleFinder.js");
/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Constants.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Constants.js");
/* harmony import */ var _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Fxyf.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Fxyf.js");
/* harmony import */ var _Hploc_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Hploc.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Hploc.js");
/* harmony import */ var _Pointing_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Pointing.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Pointing.js");
/* harmony import */ var _pstack_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pstack.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/pstack.js");
/* harmony import */ var _RangeSet_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RangeSet.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/RangeSet.js");
/* harmony import */ var _Vec3_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Vec3.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Vec3.js");
/* harmony import */ var _Xyf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Xyf.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Xyf.js");
/* harmony import */ var _Zphi_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Zphi.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Zphi.js");











/**
 * Partial porting to Javascript of HealpixBase.java from Healpix3.30
 */
// import Fxyf from './Fxyf.js';
// import Hploc from './Hploc.js';
// import Xyf from './Xyf.js';
// import Vec3 from './Vec3.js';
// import Pointing from './Pointing.js';
// import CircleFinder from './CircleFinder.js';
// import Zphi from './Zphi.js';
// import pstack from './pstack.js';
// import Constants from './Constants.js';
// import RangeSet from './RangeSet.js';
class Healpix {
    constructor(nside_in) {
        this.order_max = 29;
        this.inv_halfpi = 2.0 / Math.PI;
        this.twothird = 2.0 / 3.;
        // console.log("twothird "+this.twothird);
        // this.ns_max=1L<<order_max;
        this.ns_max = Math.pow(2, this.order_max);
        this.ctab = new Uint16Array([
            0, 1, 256, 257, 2, 3, 258, 259, 512, 513, 768, 769, 514, 515, 770, 771, 4, 5, 260, 261, 6, 7, 262,
            263, 516, 517, 772, 773, 518, 519, 774, 775, 1024, 1025, 1280, 1281, 1026, 1027, 1282, 1283,
            1536, 1537, 1792, 1793, 1538, 1539, 1794, 1795, 1028, 1029, 1284, 1285, 1030, 1031, 1286,
            1287, 1540, 1541, 1796, 1797, 1542, 1543, 1798, 1799, 8, 9, 264, 265, 10, 11, 266, 267, 520,
            521, 776, 777, 522, 523, 778, 779, 12, 13, 268, 269, 14, 15, 270, 271, 524, 525, 780, 781, 526,
            527, 782, 783, 1032, 1033, 1288, 1289, 1034, 1035, 1290, 1291, 1544, 1545, 1800, 1801, 1546,
            1547, 1802, 1803, 1036, 1037, 1292, 1293, 1038, 1039, 1294, 1295, 1548, 1549, 1804, 1805,
            1550, 1551, 1806, 1807, 2048, 2049, 2304, 2305, 2050, 2051, 2306, 2307, 2560, 2561, 2816,
            2817, 2562, 2563, 2818, 2819, 2052, 2053, 2308, 2309, 2054, 2055, 2310, 2311, 2564, 2565,
            2820, 2821, 2566, 2567, 2822, 2823, 3072, 3073, 3328, 3329, 3074, 3075, 3330, 3331, 3584,
            3585, 3840, 3841, 3586, 3587, 3842, 3843, 3076, 3077, 3332, 3333, 3078, 3079, 3334, 3335,
            3588, 3589, 3844, 3845, 3590, 3591, 3846, 3847, 2056, 2057, 2312, 2313, 2058, 2059, 2314,
            2315, 2568, 2569, 2824, 2825, 2570, 2571, 2826, 2827, 2060, 2061, 2316, 2317, 2062, 2063,
            2318, 2319, 2572, 2573, 2828, 2829, 2574, 2575, 2830, 2831, 3080, 3081, 3336, 3337, 3082,
            3083, 3338, 3339, 3592, 3593, 3848, 3849, 3594, 3595, 3850, 3851, 3084, 3085, 3340, 3341,
            3086, 3087, 3342, 3343, 3596, 3597, 3852, 3853, 3598, 3599, 3854, 3855
        ]);
        this.utab = new Uint16Array([0, 1, 4, 5, 16, 17, 20, 21, 64, 65, 68, 69, 80, 81, 84, 85, 256, 257, 260, 261, 272, 273, 276, 277,
            320, 321, 324, 325, 336, 337, 340, 341, 1024, 1025, 1028, 1029, 1040, 1041, 1044, 1045, 1088,
            1089, 1092, 1093, 1104, 1105, 1108, 1109, 1280, 1281, 1284, 1285, 1296, 1297, 1300, 1301,
            1344, 1345, 1348, 1349, 1360, 1361, 1364, 1365, 4096, 4097, 4100, 4101, 4112, 4113, 4116,
            4117, 4160, 4161, 4164, 4165, 4176, 4177, 4180, 4181, 4352, 4353, 4356, 4357, 4368, 4369,
            4372, 4373, 4416, 4417, 4420, 4421, 4432, 4433, 4436, 4437, 5120, 5121, 5124, 5125, 5136,
            5137, 5140, 5141, 5184, 5185, 5188, 5189, 5200, 5201, 5204, 5205, 5376, 5377, 5380, 5381,
            5392, 5393, 5396, 5397, 5440, 5441, 5444, 5445, 5456, 5457, 5460, 5461, 16384, 16385, 16388,
            16389, 16400, 16401, 16404, 16405, 16448, 16449, 16452, 16453, 16464, 16465, 16468, 16469,
            16640, 16641, 16644, 16645, 16656, 16657, 16660, 16661, 16704, 16705, 16708, 16709, 16720,
            16721, 16724, 16725, 17408, 17409, 17412, 17413, 17424, 17425, 17428, 17429, 17472, 17473,
            17476, 17477, 17488, 17489, 17492, 17493, 17664, 17665, 17668, 17669, 17680, 17681, 17684,
            17685, 17728, 17729, 17732, 17733, 17744, 17745, 17748, 17749, 20480, 20481, 20484, 20485,
            20496, 20497, 20500, 20501, 20544, 20545, 20548, 20549, 20560, 20561, 20564, 20565, 20736,
            20737, 20740, 20741, 20752, 20753, 20756, 20757, 20800, 20801, 20804, 20805, 20816, 20817,
            20820, 20821, 21504, 21505, 21508, 21509, 21520, 21521, 21524, 21525, 21568, 21569, 21572,
            21573, 21584, 21585, 21588, 21589, 21760, 21761, 21764, 21765, 21776, 21777, 21780, 21781,
            21824, 21825, 21828, 21829, 21840, 21841, 21844, 21845]);
        this.jrll = new Int16Array([2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]);
        this.jpll = new Int16Array([1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7]);
        this.xoffset = new Int16Array([-1, -1, 0, 1, 1, 1, 0, -1]);
        this.yoffset = new Int16Array([0, 1, 1, 1, 0, -1, -1, -1]);
        this.facearray = [
            new Int16Array([8, 9, 10, 11, -1, -1, -1, -1, 10, 11, 8, 9]),
            new Int16Array([5, 6, 7, 4, 8, 9, 10, 11, 9, 10, 11, 8]),
            new Int16Array([-1, -1, -1, -1, 5, 6, 7, 4, -1, -1, -1, -1]),
            new Int16Array([4, 5, 6, 7, 11, 8, 9, 10, 11, 8, 9, 10]),
            new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
            new Int16Array([1, 2, 3, 0, 0, 1, 2, 3, 5, 6, 7, 4]),
            new Int16Array([-1, -1, -1, -1, 7, 4, 5, 6, -1, -1, -1, -1]),
            new Int16Array([3, 0, 1, 2, 3, 0, 1, 2, 4, 5, 6, 7]),
            new Int16Array([2, 3, 0, 1, -1, -1, -1, -1, 0, 1, 2, 3]) // N
        ];
        // questo forse deve essere un UInt8Array. Viene usato da neighbours
        this.swaparray = [
            new Int16Array([0, 0, 3]),
            new Int16Array([0, 0, 6]),
            new Int16Array([0, 0, 0]),
            new Int16Array([0, 0, 5]),
            new Int16Array([0, 0, 0]),
            new Int16Array([5, 0, 0]),
            new Int16Array([0, 0, 0]),
            new Int16Array([6, 0, 0]),
            new Int16Array([3, 0, 0]) // N
        ];
        if (nside_in <= this.ns_max && nside_in > 0) {
            this.nside = nside_in;
            this.npface = this.nside * this.nside;
            this.npix = 12 * this.npface;
            this.order = this.nside2order(this.nside);
            this.nl2 = 2 * this.nside;
            this.nl3 = 3 * this.nside;
            this.nl4 = 4 * this.nside;
            this.fact2 = 4.0 / this.npix;
            this.fact1 = (this.nside << 1) * this.fact2;
            this.ncap = 2 * this.nside * (this.nside - 1); // pixels in each polar cap
            // console.log("order: "+this.order);
            // console.log("nside: "+this.nside);
        }
        this.bn = [];
        this.mpr = [];
        this.cmpr = [];
        this.smpr = [];
        // TODO INFINITE LOOP!!!!!! FIX ITTTTTTTTTT
        // TODO INFINITE LOOP!!!!!! FIX ITTTTTTTTTT
        // TODO INFINITE LOOP!!!!!! FIX ITTTTTTTTTT
        // TODO INFINITE LOOP!!!!!! FIX ITTTTTTTTTT
        // TODO INFINITE LOOP!!!!!! FIX ITTTTTTTTTT
        // TODO INFINITE LOOP!!!!!! FIX ITTTTTTTTTT
        // TODO INFINITE LOOP!!!!!! FIX ITTTTTTTTTT
        // Uncaught RangeError: Maximum call stack size exceeded
        // MOVED TO computeBn()
        //        for (let i=0; i <= this.order_max; ++i) {
        //        	this.bn[i]=new Healpix(1<<i);
        //        	this.mpr[i]=bn[i].maxPixrad();
        //        	this.cmpr[i]=Math.cos(mpr[i]);
        //        	this.smpr[i]=Math.sin(mpr[i]);
        //        }
    }
    computeBn() {
        for (let i = 0; i <= this.order_max; ++i) {
            this.bn[i] = new Healpix(1 << i);
            this.mpr[i] = this.bn[i].maxPixrad();
            this.cmpr[i] = _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.cos(this.mpr[i]);
            this.smpr[i] = _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.sin(this.mpr[i]);
        }
    }
    getNPix() {
        return this.npix;
    }
    ;
    getBoundaries(pix) {
        let points = new Array();
        let xyf = this.nest2xyf(pix);
        let dc = 0.5 / this.nside;
        let xc = (xyf.ix + 0.5) / this.nside;
        let yc = (xyf.iy + 0.5) / this.nside;
        points[0] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc, yc + dc, xyf.face).toVec3();
        points[1] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc, yc + dc, xyf.face).toVec3();
        points[2] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc, yc - dc, xyf.face).toVec3();
        points[3] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc, yc - dc, xyf.face).toVec3();
        return points;
    }
    ;
    /** Returns a set of points along the boundary of the given pixel.
     * Step 1 gives 4 points on the corners. The first point corresponds
     * to the northernmost corner, the subsequent points follow the pixel
     * boundary through west, south and east corners.
     *
     * @param pix pixel index number
     * @param step the number of returned points is 4*step
     * @return {@link Vec3} for each point
     */
    getBoundariesWithStep(pix, step) {
        // var points = new Array(); 
        let points = new Array();
        let xyf = this.nest2xyf(pix);
        let dc = 0.5 / this.nside;
        let xc = (xyf.ix + 0.5) / this.nside;
        let yc = (xyf.iy + 0.5) / this.nside;
        let d = 1.0 / (this.nside * step);
        for (let i = 0; i < step; i++) {
            points[i] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc - i * d, yc + dc, xyf.face).toVec3();
            points[i + step] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc, yc + dc - i * d, xyf.face).toVec3();
            points[i + 2 * step] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc + i * d, yc - dc, xyf.face).toVec3();
            points[i + 3 * step] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc, yc - dc + i * d, xyf.face).toVec3();
        }
        return points;
    }
    ;
    getPointsForXyfNoStep(x, y, face) {
        // let nside = Math.pow(2, this.order);
        let points = new Array();
        let xyf = new _Xyf_js__WEBPACK_IMPORTED_MODULE_8__.Xyf(x, y, face);
        let dc = 0.5 / this.nside;
        let xc = (xyf.ix + 0.5) / this.nside;
        let yc = (xyf.iy + 0.5) / this.nside;
        points[0] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc, yc + dc, xyf.face).toVec3();
        points[1] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc, yc + dc, xyf.face).toVec3();
        points[2] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc, yc - dc, xyf.face).toVec3();
        points[3] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc, yc - dc, xyf.face).toVec3();
        return points;
    }
    getPointsForXyf(x, y, step, face) {
        let nside = step * Math.pow(2, this.order);
        let points = new Array();
        let xyf = new _Xyf_js__WEBPACK_IMPORTED_MODULE_8__.Xyf(x, y, face);
        let dc = 0.5 / nside;
        let xc = (xyf.ix + 0.5) / nside;
        let yc = (xyf.iy + 0.5) / nside;
        points[0] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc, yc + dc, xyf.face).toVec3();
        points[1] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc, yc + dc, xyf.face).toVec3();
        points[2] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc - dc, yc - dc, xyf.face).toVec3();
        points[3] = new _Fxyf_js__WEBPACK_IMPORTED_MODULE_2__.Fxyf(xc + dc, yc - dc, xyf.face).toVec3();
        return points;
    }
    /** Returns the neighboring pixels of ipix.
    This method works in both RING and NEST schemes, but is
    considerably faster in the NEST scheme.
    @param ipix the requested pixel number.
    @return array with indices of the neighboring pixels.
      The returned array contains (in this order)
      the pixel numbers of the SW, W, NW, N, NE, E, SE and S neighbor
      of ipix. If a neighbor does not exist (this can only happen
      for the W, N, E and S neighbors), its entry is set to -1. */
    neighbours(ipix) {
        let result = new Int32Array(8);
        let xyf = this.nest2xyf(ipix);
        let ix = xyf.ix;
        let iy = xyf.iy;
        let face_num = xyf.face;
        var nsm1 = this.nside - 1;
        if ((ix > 0) && (ix < nsm1) && (iy > 0) && (iy < nsm1)) {
            let fpix = Math.floor(face_num << (2 * this.order));
            let px0 = this.spread_bits(ix);
            let py0 = this.spread_bits(iy) << 1;
            let pxp = this.spread_bits(ix + 1);
            let pyp = this.spread_bits(iy + 1) << 1;
            let pxm = this.spread_bits(ix - 1);
            let pym = this.spread_bits(iy - 1) << 1;
            result[0] = fpix + pxm + py0;
            result[1] = fpix + pxm + pyp;
            result[2] = fpix + px0 + pyp;
            result[3] = fpix + pxp + pyp;
            result[4] = fpix + pxp + py0;
            result[5] = fpix + pxp + pym;
            result[6] = fpix + px0 + pym;
            result[7] = fpix + pxm + pym;
        }
        else {
            for (let i = 0; i < 8; ++i) {
                let x = ix + this.xoffset[i];
                let y = iy + this.yoffset[i];
                let nbnum = 4;
                if (x < 0) {
                    x += this.nside;
                    nbnum -= 1;
                }
                else if (x >= this.nside) {
                    x -= this.nside;
                    nbnum += 1;
                }
                if (y < 0) {
                    y += this.nside;
                    nbnum -= 3;
                }
                else if (y >= this.nside) {
                    y -= this.nside;
                    nbnum += 3;
                }
                let f = this.facearray[nbnum][face_num];
                if (f >= 0) {
                    let bits = this.swaparray[nbnum][face_num >>> 2];
                    if ((bits & 1) > 0) {
                        x = Math.floor(this.nside - x - 1);
                    }
                    if ((bits & 2) > 0) {
                        y = Math.floor(this.nside - y - 1);
                    }
                    if ((bits & 4) > 0) {
                        let tint = x;
                        x = y;
                        y = tint;
                    }
                    result[i] = this.xyf2nest(x, y, f);
                }
                else {
                    result[i] = -1;
                }
            }
        }
        return result;
    }
    ;
    nside2order(nside) {
        return ((nside & (nside - 1)) != 0) ? -1 : Math.log2(nside);
    }
    ;
    nest2xyf(ipix) {
        let pix = Math.floor(ipix & (this.npface - 1));
        let xyf = new _Xyf_js__WEBPACK_IMPORTED_MODULE_8__.Xyf(this.compress_bits(pix), this.compress_bits(pix >> 1), Math.floor((ipix >> (2 * this.order))));
        return xyf;
    }
    ;
    xyf2nest(ix, iy, face_num) {
        return Math.floor(face_num << (2 * this.order))
            + this.spread_bits(ix) + (this.spread_bits(iy) << 1);
    }
    ;
    loc2pix(hploc) {
        let z = hploc.z;
        let phi = hploc.phi;
        let za = Math.abs(z);
        let tt = this.fmodulo((phi * this.inv_halfpi), 4.0); // in [0,4)
        let pixNo;
        if (za <= this.twothird) { // Equatorial region
            let temp1 = this.nside * (0.5 + tt);
            let temp2 = this.nside * (z * 0.75);
            let jp = Math.floor(temp1 - temp2); // index of ascending edge line
            let jm = Math.floor(temp1 + temp2); // index of descending edge line
            let ifp = Math.floor(jp >>> this.order); // in {0,4}
            let ifm = Math.floor(jm >>> this.order);
            let face_num = Math.floor((ifp == ifm) ? (ifp | 4) : ((ifp < ifm) ? ifp : (ifm + 8)));
            let ix = Math.floor(jm & (this.nside - 1));
            let iy = Math.floor(this.nside - (jp & (this.nside - 1)) - 1);
            pixNo = this.xyf2nest(ix, iy, face_num);
        }
        else { // polar region, za > 2/3
            let ntt = Math.min(3, Math.floor(tt));
            let tp = tt - ntt;
            let tmp = ((za < 0.99) || (!hploc.have_sth)) ?
                this.nside * Math.sqrt(3 * (1 - za)) :
                this.nside * hploc.sth / Math.sqrt((1.0 + za) / 3.);
            let jp = Math.floor(tp * tmp); // increasing edge line index
            let jm = Math.floor((1.0 - tp) * tmp); // decreasing edge line index
            if (jp >= this.nside) {
                jp = this.nside - 1; // for points too close to the boundary
            }
            if (jm >= this.nside) {
                jm = this.nside - 1;
            }
            if (z >= 0) {
                pixNo = this.xyf2nest(Math.floor(this.nside - jm - 1), Math.floor(this.nside - jp - 1), ntt);
            }
            else {
                pixNo = this.xyf2nest(Math.floor(jp), Math.floor(jm), ntt + 8);
            }
        }
        return pixNo;
    }
    ;
    /** Returns the normalized 3-vector corresponding to the center of the
    supplied pixel.
    @param pix long the requested pixel number.
    @return the pixel's center coordinates. */
    pix2vec(pix) {
        return this.pix2loc(pix).toVec3();
    }
    ;
    /** Returns the Zphi corresponding to the center of the supplied pixel.
     @param pix the requested pixel number.
     @return the pixel's center coordinates. */
    pix2zphi(pix) {
        return this.pix2loc(pix).toZphi();
    }
    pix2ang(pix, mirror) {
        return this.pix2loc(pix).toPointing(mirror);
    }
    /**
     * @param pix long
     * @return Hploc
     */
    pix2loc(pix) {
        let loc = new _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc(undefined);
        let xyf = this.nest2xyf(pix);
        let jr = ((this.jrll[xyf.face]) << this.order) - xyf.ix - xyf.iy - 1;
        let nr;
        if (jr < this.nside) {
            nr = jr;
            let tmp = (nr * nr) * this.fact2;
            loc.z = 1 - tmp;
            if (loc.z > 0.99) {
                loc.sth = Math.sqrt(tmp * (2. - tmp));
                loc.have_sth = true;
            }
        }
        else if (jr > this.nl3) {
            nr = this.nl4 - jr;
            let tmp = (nr * nr) * this.fact2;
            loc.z = tmp - 1;
            if (loc.z < -0.99) {
                loc.sth = Math.sqrt(tmp * (2. - tmp));
                loc.have_sth = true;
            }
        }
        else {
            nr = this.nside;
            loc.z = (this.nl2 - jr) * this.fact1;
        }
        let tmp = (this.jpll[xyf.face]) * nr + xyf.ix - xyf.iy;
        //      	assert(tmp<8*nr); // must not happen
        if (tmp < 0) {
            tmp += 8 * nr;
        }
        loc.phi = (nr == this.nside) ? 0.75 * _Constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.halfpi * tmp * this.fact1 : (0.5 * _Constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.halfpi * tmp) / nr;
        // loc.setPhi((nr == this.nside) ? 0.75 * Constants.halfpi * tmp * this.fact1 : (0.5 * Constants.halfpi * tmp)/nr);
        return loc;
    }
    ;
    za2vec(z, a) {
        const sin_theta = Math.sqrt(1 - z * z);
        const X = sin_theta * Math.cos(a);
        const Y = sin_theta * Math.sin(a);
        return new _Vec3_js__WEBPACK_IMPORTED_MODULE_7__.Vec3(X, Y, z);
    }
    ang2vec(theta, phi) {
        const z = Math.cos(theta);
        return this.za2vec(z, phi);
    }
    vec2ang(v) {
        const { z, a } = this.vec2za(v.getX(), v.getY(), v.getZ());
        return { theta: Math.acos(z), phi: a };
    }
    vec2za(X, Y, z) {
        const r2 = X * X + Y * Y;
        if (r2 == 0)
            return { z: z < 0 ? -1 : 1, a: 0 };
        else {
            const PI2 = Math.PI / 2;
            const a = (Math.atan2(Y, X) + PI2) % PI2;
            z /= Math.sqrt(z * z + r2);
            return { z, a };
        }
    }
    ang2pix(ptg, mirror) {
        return this.loc2pix(new _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc(ptg));
    }
    ;
    fmodulo(v1, v2) {
        if (v1 >= 0) {
            return (v1 < v2) ? v1 : v1 % v2;
        }
        var tmp = v1 % v2 + v2;
        return (tmp === v2) ? 0.0 : tmp;
    }
    ;
    compress_bits(v) {
        var raw = Math.floor((v & 0x5555)) | Math.floor(((v & 0x55550000) >>> 15));
        var compressed = this.ctab[raw & 0xff] | (this.ctab[raw >>> 8] << 4);
        return compressed;
    }
    ;
    spread_bits(v) {
        return Math.floor(this.utab[v & 0xff]) | Math.floor((this.utab[(v >>> 8) & 0xff] << 16))
            | Math.floor((this.utab[(v >>> 16) & 0xff] << 32)) | Math.floor((this.utab[(v >>> 24) & 0xff] << 48));
    }
    ;
    /**
     * Returns a range set of pixels that overlap with the convex polygon
     * defined by the {@code vertex} array.
     * <p>
     * This method is more efficient in the RING scheme.
     * <p>
     * This method may return some pixels which don't overlap with the polygon
     * at all. The higher {@code fact} is chosen, the fewer false positives are
     * returned, at the cost of increased run time.
     *
     * @param vertex
     *            an array containing the vertices of the requested convex
     *            polygon.
     * @param fact
     *            The overlapping test will be done at the resolution
     *            {@code fact*nside}. For NESTED ordering, {@code fact} must be
     *            a power of 2, else it can be any positive integer. A typical
     *            choice would be 4.
     * @return the requested set of pixel number ranges
     */
    queryPolygonInclusive(vertex, fact) {
        let inclusive = (fact != 0);
        let nv = vertex.length;
        //        let ncirc = inclusive ? nv+1 : nv;
        if (!(nv >= 3)) {
            console.log("not enough vertices in polygon");
            return;
        }
        let vv = new Array();
        for (let i = 0; i < nv; ++i) {
            vv[i] = _Vec3_js__WEBPACK_IMPORTED_MODULE_7__.Vec3.pointing2Vec3(vertex[i]);
        }
        let normal = new Array();
        let flip = 0;
        let index = 0;
        let back = false;
        while (index < vv.length) {
            let first = vv[index];
            let medium = null;
            let last = null;
            if (index == vv.length - 1) {
                last = vv[1];
                medium = vv[0];
            }
            else if (index == vv.length - 2) {
                last = vv[0];
                medium = vv[index + 1];
            }
            else {
                medium = vv[index + 1];
                last = vv[index + 2];
            }
            normal[index] = first.cross(medium).norm();
            let hnd = normal[index].dot(last);
            if (index == 0) {
                flip = (hnd < 0.) ? -1 : 1;
                let tmp = new _Pointing_js__WEBPACK_IMPORTED_MODULE_4__.Pointing(first); // TODO not used
                back = false;
            }
            else {
                let flipThnd = flip * hnd;
                if (flipThnd < 0) {
                    let tmp = new _Pointing_js__WEBPACK_IMPORTED_MODULE_4__.Pointing(medium);
                    vv.splice(index + 1, 1);
                    normal.splice(index, 1);
                    back = true;
                    index -= 1;
                    continue;
                }
                else {
                    let tmp = new _Pointing_js__WEBPACK_IMPORTED_MODULE_4__.Pointing(first);
                    back = false;
                }
            }
            normal[index].scale(flip);
            index += 1;
        }
        nv = vv.length;
        let ncirc = inclusive ? nv + 1 : nv;
        let rad = new Array(ncirc);
        rad = rad.fill(_Constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.halfpi);
        //        rad = rad.fill(1.5707963267948966);
        //        let p = "1.5707963267948966";
        //        rad = rad.fill(parseFloat(p));
        if (inclusive) {
            let cf = new _CircleFinder_js__WEBPACK_IMPORTED_MODULE_0__.CircleFinder(vv);
            normal[nv] = cf.getCenter();
            rad[nv] = _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.acos(cf.getCosrad());
        }
        return this.queryMultiDisc(normal, rad, fact);
    }
    ;
    /**
     * For NEST schema only
     *
     * @param normal:
     *            Vec3[]
     * @param rad:
     *            Float32Array
     * @param fact:
     *            The overlapping test will be done at the resolution
     *            {@code fact*nside}. For NESTED ordering, {@code fact} must be
     *            a power of 2, else it can be any positive integer. A typical
     *            choice would be 4.
     * @return RangeSet the requested set of pixel number ranges
     */
    queryMultiDisc(norm, rad, fact) {
        this.computeBn();
        let inclusive = (fact != 0);
        let nv = norm.length;
        // HealpixUtils.check(nv==rad.lengt0,"inconsistent input arrays");
        if (!(nv == rad.length)) {
            console.error("inconsistent input arrays");
            return;
        }
        let res = new _RangeSet_js__WEBPACK_IMPORTED_MODULE_6__.RangeSet(4 << 1);
        // Removed code for Scheme.RING
        let oplus = 0;
        if (inclusive) {
            if (!(Math.pow(2, this.order_max - this.order) >= fact)) {
                console.error("invalid oversampling factor");
            }
            if (!((fact & (fact - 1)) == 0)) {
                console.error("oversampling factor must be a power of 2");
            }
            oplus = this.ilog2(fact);
        }
        let omax = this.order + oplus; // the order up to which we test
        // TODO: ignore all disks with radius>=pi
        //        let crlimit = new Float32Array[omax+1][nv][3];
        let crlimit = new Array(omax + 1);
        let o;
        let i;
        for (o = 0; o <= omax; ++o) { // prepare data at the required orders
            crlimit[o] = new Array(nv);
            let dr = this.bn[o].maxPixrad(); // safety distance
            for (i = 0; i < nv; ++i) {
                crlimit[o][i] = new Float64Array(3);
                crlimit[o][i][0] = (rad[i] + dr > Math.PI) ? -1 : _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.cos(rad[i] + dr);
                crlimit[o][i][1] = (o == 0) ? _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.cos(rad[i]) : crlimit[0][i][1];
                crlimit[o][i][2] = (rad[i] - dr < 0.) ? 1. : _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.cos(rad[i] - dr);
            }
        }
        let stk = new _pstack_js__WEBPACK_IMPORTED_MODULE_5__.pstack(12 + 3 * omax);
        for (let i = 0; i < 12; i++) { // insert the 12 base pixels in reverse
            // order
            stk.push(11 - i, 0);
        }
        while (stk.size() > 0) { // as long as there are pixels on the stack
            // pop current pixel number and order from the stack
            let pix = stk.ptop();
            let o = stk.otop();
            stk.pop();
            let pv = this.bn[o].pix2vec(pix);
            let zone = 3;
            for (let i = 0; (i < nv) && (zone > 0); ++i) {
                let crad = pv.dot(norm[i]);
                for (let iz = 0; iz < zone; ++iz) {
                    if (crad < crlimit[o][i][iz]) {
                        zone = iz;
                    }
                }
            }
            if (zone > 0) {
                this.check_pixel(o, omax, zone, res, pix, stk, inclusive);
            }
        }
        return res;
    }
    ;
    /** Integer base 2 logarithm.
    @param arg
    @return the largest integer {@code n} that fulfills {@code 2^n<=arg}.
    For negative arguments and zero, 0 is returned. */
    ilog2(arg) {
        let max = Math.max(arg, 1);
        return 31 - Math.clz32(max);
    }
    ;
    /** Computes the cosine of the angular distance between two z, phi positions
      on the unit sphere. */
    cosdist_zphi(z1, phi1, z2, phi2) {
        return z1 * z2 + _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.cos(phi1 - phi2) * Math.sqrt((1.0 - z1 * z1) * (1.0 - z2 * z2));
    }
    /**
     * @param int o
     * @param int omax
     * @param int zone
     * @param RangeSet pixset
     * @param long pix
     * @param pstack stk
     * @param boolean inclusive
     */
    check_pixel(o, omax, zone, pixset, pix, stk, inclusive) {
        if (zone == 0)
            return;
        if (o < this.order) {
            if (zone >= 3) { // output all subpixels
                let sdist = 2 * (this.order - o); // the "bit-shift distance" between map orders
                pixset.append1(pix << sdist, ((pix + 1) << sdist));
            }
            else { // (zone>=1)
                for (let i = 0; i < 4; ++i) {
                    stk.push(4 * pix + 3 - i, o + 1); // add children
                }
            }
        }
        else if (o > this.order) { // this implies that inclusive==true
            if (zone >= 2) { // pixel center in shape
                pixset.append(pix >>> (2 * (o - this.order))); // output the parent pixel at order
                stk.popToMark(); // unwind the stack
            }
            else { // (zone>=1): pixel center in safety range
                if (o < omax) { // check sublevels
                    for (let i = 0; i < 4; ++i) { // add children in reverse order
                        stk.push(4 * pix + 3 - i, o + 1); // add children
                    }
                }
                else { // at resolution limit
                    pixset.append(pix >>> (2 * (o - this.order))); // output the parent pixel at order
                    stk.popToMark(); // unwind the stack
                }
            }
        }
        else { // o==order
            if (zone >= 2) {
                pixset.append(pix);
            }
            else if (inclusive) { // and (zone>=1)
                if (this.order < omax) { // check sublevels
                    stk.mark(); // remember current stack position
                    for (let i = 0; i < 4; ++i) { // add children in reverse order
                        stk.push(4 * pix + 3 - i, o + 1); // add children
                    }
                }
                else { // at resolution limit
                    pixset.append(pix); // output the pixel
                }
            }
        }
    }
    /** Returns the maximum angular distance between a pixel center and its
    corners.
    @return maximum angular distance between a pixel center and its
      corners. */
    maxPixrad() {
        let zphia = new _Zphi_js__WEBPACK_IMPORTED_MODULE_9__.Zphi(2. / 3., Math.PI / this.nl4);
        let xyz1 = this.convertZphi2xyz(zphia);
        let va = new _Vec3_js__WEBPACK_IMPORTED_MODULE_7__.Vec3(xyz1[0], xyz1[1], xyz1[2]);
        let t1 = 1. - 1. / this.nside;
        t1 *= t1;
        let zphib = new _Zphi_js__WEBPACK_IMPORTED_MODULE_9__.Zphi(1 - t1 / 3, 0);
        let xyz2 = this.convertZphi2xyz(zphib);
        let vb = new _Vec3_js__WEBPACK_IMPORTED_MODULE_7__.Vec3(xyz2[0], xyz2[1], xyz2[2]);
        return va.angle(vb);
    }
    ;
    /**
     * this is a workaround replacing the Vec3(Zphi) constructor.
     */
    convertZphi2xyz(zphi) {
        let sth = Math.sqrt((1.0 - zphi.z) * (1.0 + zphi.z));
        let x = sth * _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.cos(zphi.phi);
        let y = sth * _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.sin(zphi.phi);
        let z = zphi.z;
        return [x, y, z];
    }
    ;
    /** Returns a range set of pixels which overlap with a given disk. <p>
      This method is more efficient in the RING scheme. <p>
      This method may return some pixels which don't overlap with
      the polygon at all. The higher {@code fact} is chosen, the fewer false
      positives are returned, at the cost of increased run time.
      @param ptg the angular coordinates of the disk center
      @param radius the radius (in radians) of the disk
      @param fact The overlapping test will be done at the resolution
        {@code fact*nside}. For NESTED ordering, {@code fact} must be a power
        of 2, else it can be any positive integer. A typical choice would be 4.
      @return the requested set of pixel number ranges  */
    queryDiscInclusive(ptg, radius, fact) {
        this.computeBn();
        let inclusive = (fact != 0);
        let pixset = new _RangeSet_js__WEBPACK_IMPORTED_MODULE_6__.RangeSet();
        if (radius >= Math.PI) { // disk covers the whole sphere
            pixset.append1(0, this.npix);
            return pixset;
        }
        let oplus = 0;
        if (inclusive) {
            // HealpixUtils.check ((1L<<order_max)>=fact,"invalid oversampling factor");
            if (!((fact & (fact - 1)) == 0)) {
                console.error("oversampling factor must be a power of 2");
            }
            oplus = this.ilog2(fact);
        }
        let omax = Math.min(this.order_max, this.order + oplus); // the order up to which we test
        let vptg = _Vec3_js__WEBPACK_IMPORTED_MODULE_7__.Vec3.pointing2Vec3(ptg);
        let crpdr = new Array(omax + 1);
        let crmdr = new Array(omax + 1);
        let cosrad = _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.cos(radius);
        let sinrad = _Hploc_js__WEBPACK_IMPORTED_MODULE_3__.Hploc.sin(radius);
        for (let o = 0; o <= omax; o++) { // prepare data at the required orders
            let dr = this.mpr[o]; // safety distance
            let cdr = this.cmpr[o];
            let sdr = this.smpr[o];
            crpdr[o] = (radius + dr > Math.PI) ? -1. : cosrad * cdr - sinrad * sdr;
            crmdr[o] = (radius - dr < 0.) ? 1. : cosrad * cdr + sinrad * sdr;
        }
        let stk = new _pstack_js__WEBPACK_IMPORTED_MODULE_5__.pstack(12 + 3 * omax);
        for (let i = 0; i < 12; i++) { // insert the 12 base pixels in reverse order
            stk.push(11 - i, 0);
        }
        while (stk.size() > 0) { // as long as there are pixels on the stack
            // pop current pixel number and order from the stack
            let pix = stk.ptop();
            let curro = stk.otop();
            stk.pop();
            let pos = this.bn[curro].pix2zphi(pix);
            // cosine of angular distance between pixel center and disk center
            let cangdist = this.cosdist_zphi(vptg.z, ptg.phi, pos.z, pos.phi);
            if (cangdist > crpdr[curro]) {
                let zone = (cangdist < cosrad) ? 1 : ((cangdist <= crmdr[curro]) ? 2 : 3);
                this.check_pixel(curro, omax, zone, pixset, pix, stk, inclusive);
            }
        }
        return pixset;
    }
}
//# sourceMappingURL=Healpix.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Hploc.js":
/*!***************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Hploc.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Hploc: () => (/* binding */ Hploc)
/* harmony export */ });
/* harmony import */ var _Pointing_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pointing.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Pointing.js");
/* harmony import */ var _Vec3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vec3.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Vec3.js");
/* harmony import */ var _Zphi_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Zphi.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Zphi.js");



class Hploc {
    constructor(ptg) {
        Hploc.PI4_A = 0.7853981554508209228515625;
        Hploc.PI4_B = 0.794662735614792836713604629039764404296875e-8;
        Hploc.PI4_C = 0.306161699786838294306516483068750264552437361480769e-16;
        Hploc.M_1_PI = 0.3183098861837906715377675267450287;
        if (ptg) {
            this.sth = 0.0;
            this.have_sth = false;
            this.z = Hploc.cos(ptg.theta);
            this._phi = ptg.phi;
            if (Math.abs(this.z) > 0.99) {
                this.sth = Hploc.sin(ptg.theta);
                this.have_sth = true;
            }
        }
    }
    setZ(z) {
        this.z = z;
    }
    ;
    get phi() {
        return this._phi;
    }
    ;
    set phi(phi) {
        this._phi = phi;
    }
    ;
    setSth(sth) {
        this.sth = sth;
    }
    ;
    toPointing(mirror) {
        const st = this.have_sth ? this.sth : Math.sqrt((1.0 - this.z) * (1.0 + this.z));
        return new _Pointing_js__WEBPACK_IMPORTED_MODULE_0__.Pointing(null, false, Hploc.atan2(st, this.z), this._phi);
    }
    toVec3() {
        var st = this.have_sth ? this.sth : Math.sqrt((1.0 - this.z) * (1.0 + this.z));
        var vector = new _Vec3_js__WEBPACK_IMPORTED_MODULE_1__.Vec3(st * Hploc.cos(this.phi), st * Hploc.sin(this.phi), this.z);
        // var vector = new Vec3(st*Math.cos(this.phi),st*Math.sin(this.phi),this.z);
        return vector;
    }
    ;
    toZphi() {
        return new _Zphi_js__WEBPACK_IMPORTED_MODULE_2__.Zphi(this.z, this.phi);
    }
    static sin(d) {
        let u = d * Hploc.M_1_PI;
        let q = Math.floor(u < 0 ? u - 0.5 : u + 0.5);
        let x = 4.0 * q;
        d -= x * Hploc.PI4_A;
        d -= x * Hploc.PI4_B;
        d -= x * Hploc.PI4_C;
        if ((q & 1) != 0) {
            d = -d;
        }
        return this.sincoshelper(d);
    }
    ;
    static cos(d) {
        //		let u = d * Hploc.M_1_PI - 0.5;
        let u = d * Hploc.M_1_PI - 0.5;
        //		u -= 0.5;
        let q = 1 + 2 * Math.floor(u < 0 ? u - 0.5 : u + 0.5);
        let x = 2.0 * q;
        let t = x * Hploc.PI4_A;
        d = d - t;
        d -= x * Hploc.PI4_B;
        d -= x * Hploc.PI4_C;
        if ((q & 2) == 0) {
            d = -d;
        }
        return Hploc.sincoshelper(d);
    }
    ;
    static sincoshelper(d) {
        let s = d * d;
        let u = -7.97255955009037868891952e-18;
        u = u * s + 2.81009972710863200091251e-15;
        u = u * s - 7.64712219118158833288484e-13;
        u = u * s + 1.60590430605664501629054e-10;
        u = u * s - 2.50521083763502045810755e-08;
        u = u * s + 2.75573192239198747630416e-06;
        u = u * s - 0.000198412698412696162806809;
        u = u * s + 0.00833333333333332974823815;
        u = u * s - 0.166666666666666657414808;
        return s * u * d + d;
    }
    ;
    /** This method calculates the arc sine of x in radians. The return
    value is in the range [-pi/2, pi/2]. The results may have
    maximum error of 3 ulps. */
    static asin(d) {
        return Hploc.mulsign(Hploc.atan2k(Math.abs(d), Math.sqrt((1 + d) * (1 - d))), d);
    }
    ;
    /** This method calculates the arc cosine of x in radians. The
        return value is in the range [0, pi]. The results may have
        maximum error of 3 ulps. */
    static acos(d) {
        return Hploc.mulsign(Hploc.atan2k(Math.sqrt((1 + d) * (1 - d)), Math.abs(d)), d) + (d < 0 ? Math.PI : 0);
    }
    ;
    static mulsign(x, y) {
        let sign = Hploc.copySign(1, y);
        return sign * x;
    }
    ;
    static copySign(magnitude, sign) {
        return sign < 0 ? -Math.abs(magnitude) : Math.abs(magnitude);
        // let finalsign = 1;
        // if (Object.is(finalsign , -0)){
        // 	sign = -1;
        // }else if (Object.is(finalsign , 0)){
        // 	sign = 1;
        // }else {
        // 	sign = Math.sign(finalsign);
        // }
        // return finalsign * magnitude;
    }
    static atanhelper(s) {
        let t = s * s;
        let u = -1.88796008463073496563746e-05;
        u = u * t + (0.000209850076645816976906797);
        u = u * t + (-0.00110611831486672482563471);
        u = u * t + (0.00370026744188713119232403);
        u = u * t + (-0.00889896195887655491740809);
        u = u * t + (0.016599329773529201970117);
        u = u * t + (-0.0254517624932312641616861);
        u = u * t + (0.0337852580001353069993897);
        u = u * t + (-0.0407629191276836500001934);
        u = u * t + (0.0466667150077840625632675);
        u = u * t + (-0.0523674852303482457616113);
        u = u * t + (0.0587666392926673580854313);
        u = u * t + (-0.0666573579361080525984562);
        u = u * t + (0.0769219538311769618355029);
        u = u * t + (-0.090908995008245008229153);
        u = u * t + (0.111111105648261418443745);
        u = u * t + (-0.14285714266771329383765);
        u = u * t + (0.199999999996591265594148);
        u = u * t + (-0.333333333333311110369124);
        return u * t * s + s;
    }
    ;
    static atan2k(y, x) {
        let q = 0.;
        if (x < 0) {
            x = -x;
            q = -2.;
        }
        if (y > x) {
            let t = x;
            x = y;
            y = -t;
            q += 1.;
        }
        return Hploc.atanhelper(y / x) + q * (Math.PI / 2);
    }
    ;
    /** This method calculates the arc tangent of y/x in radians, using
    the signs of the two arguments to determine the quadrant of the
    result. The results may have maximum error of 2 ulps. */
    static atan2(y, x) {
        let r = Hploc.atan2k(Math.abs(y), x);
        r = Hploc.mulsign(r, x);
        if (Hploc.isinf(x) || x == 0) {
            r = Math.PI / 2 - (Hploc.isinf(x) ? (Hploc.copySign(1, x) * (Math.PI / 2)) : 0);
        }
        if (Hploc.isinf(y)) {
            r = Math.PI / 2 - (Hploc.isinf(x) ? (Hploc.copySign(1, x) * (Math.PI * 1 / 4)) : 0);
        }
        if (y == 0) {
            r = (Hploc.copySign(1, x) == -1 ? Math.PI : 0);
        }
        return Hploc.isnan(x) || Hploc.isnan(y) ? NaN : Hploc.mulsign(r, y);
    }
    ;
    /** Checks if the argument is a NaN or not. */
    static isnan(d) {
        return d != d;
    }
    ;
    /** Checks if the argument is either positive or negative infinity. */
    static isinf(d) {
        return Math.abs(d) === +Infinity;
    }
    ;
}
Hploc.PI4_A = 0.7853981554508209228515625;
Hploc.PI4_B = 0.794662735614792836713604629039764404296875e-8;
Hploc.PI4_C = 0.306161699786838294306516483068750264552437361480769e-16;
Hploc.M_1_PI = 0.3183098861837906715377675267450287;
//# sourceMappingURL=Hploc.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Pointing.js":
/*!******************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Pointing.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Pointing: () => (/* binding */ Pointing)
/* harmony export */ });
/* harmony import */ var _Hploc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Hploc.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Hploc.js");

class Pointing {
    /**
     *
     * @param {*} vec3 Vec3.js
     * @param {*} mirror
     * @param {*} in_theta radians
     * @param {*} in_phi radians
     */
    constructor(vec3, mirror, in_theta, in_phi) {
        if (vec3 != null) {
            this.theta = _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.atan2(Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y), vec3.z);
            if (mirror) {
                this.phi = -_Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.atan2(vec3.y, vec3.x);
            }
            else {
                this.phi = _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.atan2(vec3.y, vec3.x);
            }
            if (this.phi < 0.0) {
                this.phi = this.phi + 2 * Math.PI;
            }
            if (this.phi >= 2 * Math.PI) {
                this.phi = this.phi - 2 * Math.PI;
            }
        }
        else {
            this.theta = in_theta;
            this.phi = in_phi;
        }
    }
}
//# sourceMappingURL=Pointing.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/RangeSet.js":
/*!******************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/RangeSet.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RangeSet: () => (/* binding */ RangeSet)
/* harmony export */ });
class RangeSet {
    /**
     * @param int cap: initial capacity
     */
    constructor(cap) {
        if (cap < 0)
            console.error("capacity must be positive");
        this.r = new Int32Array(cap << 1);
        this.sz = 0;
    }
    ;
    /** Append a single-value range to the object.
    @param val value to append */
    append(val) {
        this.append1(val, val + 1);
    }
    ;
    /** Append a range to the object.
   @param a first long in range
   @param b one-after-last long in range */
    append1(a, b) {
        if (a >= b)
            return;
        if ((this.sz > 0) && (a <= this.r[this.sz - 1])) {
            if (a < this.r[this.sz - 2])
                console.error("bad append operation");
            if (b > this.r[this.sz - 1])
                this.r[this.sz - 1] = b;
            return;
        }
        // this.ensureCapacity(this.sz+2);
        let cap = this.sz + 2;
        if (this.r.length < cap) {
            let newsize = Math.max(2 * this.r.length, cap);
            let rnew = new Int32Array(newsize);
            rnew.set(this.r);
            this.r = rnew;
        }
        this.r[this.sz] = a;
        this.r[this.sz + 1] = b;
        this.sz += 2;
    }
    ;
    /** Make sure the object can hold at least the given number of entries.
     * @param cap int
     * */
    ensureCapacity(cap) {
        if (this.r.length < cap)
            this.resize(Math.max(2 * this.r.length, cap));
    }
    ;
    /**
     * @param newsize int
     */
    resize(newsize) {
        if (newsize < this.sz)
            console.error("requested array size too small");
        if (newsize == this.r.length)
            return;
        let rnew = new Int32Array(newsize);
        let sliced = this.r.slice(0, this.sz + 1);
        //		this.arrayCopy(this.r, 0, rnew, 0, this.sz);
        this.r = sliced;
    }
    ;
}
//# sourceMappingURL=RangeSet.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Vec3.js":
/*!**************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Vec3.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Vec3: () => (/* binding */ Vec3)
/* harmony export */ });
/* harmony import */ var _Hploc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Hploc.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Hploc.js");
/* harmony import */ var _Pointing_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pointing.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Pointing.js");
/**
 * Partial porting to Javascript of Vec3.java from Healpix3.30
 */


class Vec3 {
    constructor(in_x, in_y, in_z) {
        if (in_x instanceof _Pointing_js__WEBPACK_IMPORTED_MODULE_1__.Pointing) {
            let ptg = in_x;
            let sth = _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.sin(ptg.theta);
            this.x = sth * _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.cos(ptg.phi);
            this.y = sth * _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.sin(ptg.phi);
            this.z = _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.cos(ptg.theta);
        }
        else {
            this.x = in_x;
            this.y = in_y;
            this.z = in_z;
        }
    }
    getX() {
        return this.x;
    }
    ;
    getY() {
        return this.y;
    }
    ;
    getZ() {
        return this.z;
    }
    ;
    /** Scale the vector by a given factor
    @param n the scale factor */
    scale(n) {
        this.x *= n;
        this.y *= n;
        this.z *= n;
    }
    ;
    /** Vector cross product.
    @param v another vector
    @return the vector cross product between this vector and {@code v} */
    cross(v) {
        return new Vec3(this.y * v.z - v.y * this.z, this.z * v.x - v.z * this.x, this.x * v.y - v.x * this.y);
    }
    ;
    /** Vector addition
        * @param v the vector to be added
        * @return addition result */
    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    ;
    /** Normalize the vector */
    normalize() {
        let d = 1. / this.length();
        this.x *= d;
        this.y *= d;
        this.z *= d;
    }
    ;
    /** Return normalized vector */
    norm() {
        let d = 1. / this.length();
        return new Vec3(this.x * d, this.y * d, this.z * d);
    }
    ;
    /** Vector length
    @return the length of the vector. */
    length() {
        return Math.sqrt(this.lengthSquared());
    }
    ;
    /** Squared vector length
        @return the squared length of the vector. */
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    ;
    /** Computes the dot product of the this vector and {@code v1}.
     * @param v1 another vector
     * @return dot product */
    dot(v1) {
        return this.x * v1.x + this.y * v1.y + this.z * v1.z;
    }
    ;
    /** Vector subtraction
     * @param v the vector to be subtracted
     * @return subtraction result */
    sub(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    ;
    /** Angle between two vectors.
    @param v1 another vector
    @return the angle in radians between this vector and {@code v1};
      constrained to the range [0,PI]. */
    angle(v1) {
        return _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.atan2(this.cross(v1).length(), this.dot(v1));
    }
    /** Invert the signs of all components */
    flip() {
        this.x *= -1.0;
        this.y *= -1.0;
        this.z *= -1.0;
    }
    static pointing2Vec3(pointing) {
        let sth = _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.sin(pointing.theta);
        let x = sth * _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.cos(pointing.phi);
        let y = sth * _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.sin(pointing.phi);
        let z = _Hploc_js__WEBPACK_IMPORTED_MODULE_0__.Hploc.cos(pointing.theta);
        return new Vec3(x, y, z);
    }
    ;
}
//# sourceMappingURL=Vec3.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Xyf.js":
/*!*************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Xyf.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Xyf: () => (/* binding */ Xyf)
/* harmony export */ });
/**
 * Partial porting to Javascript of Xyf.java from Healpix3.30
 */
class Xyf {
    constructor(x, y, f) {
        this.ix = x;
        this.iy = y;
        this.face = f;
    }
}
//# sourceMappingURL=Xyf.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/Zphi.js":
/*!**************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/Zphi.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Zphi: () => (/* binding */ Zphi)
/* harmony export */ });
class Zphi {
    /** Creation from individual components */
    constructor(z_, phi_) {
        this.z = z_;
        this.phi = phi_;
    }
    ;
}
//# sourceMappingURL=Zphi.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/index.js":
/*!***************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CircleFinder: () => (/* reexport safe */ _CircleFinder_js__WEBPACK_IMPORTED_MODULE_2__.CircleFinder),
/* harmony export */   Constants: () => (/* reexport safe */ _Constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants),
/* harmony export */   Fxyf: () => (/* reexport safe */ _Fxyf_js__WEBPACK_IMPORTED_MODULE_3__.Fxyf),
/* harmony export */   Healpix: () => (/* reexport safe */ _Healpix_js__WEBPACK_IMPORTED_MODULE_4__.Healpix),
/* harmony export */   Hploc: () => (/* reexport safe */ _Hploc_js__WEBPACK_IMPORTED_MODULE_10__.Hploc),
/* harmony export */   Pointing: () => (/* reexport safe */ _Pointing_js__WEBPACK_IMPORTED_MODULE_5__.Pointing),
/* harmony export */   RangeSet: () => (/* reexport safe */ _RangeSet_js__WEBPACK_IMPORTED_MODULE_6__.RangeSet),
/* harmony export */   Vec3: () => (/* reexport safe */ _Vec3_js__WEBPACK_IMPORTED_MODULE_7__.Vec3),
/* harmony export */   Xyf: () => (/* reexport safe */ _Xyf_js__WEBPACK_IMPORTED_MODULE_8__.Xyf),
/* harmony export */   Zphi: () => (/* reexport safe */ _Zphi_js__WEBPACK_IMPORTED_MODULE_9__.Zphi),
/* harmony export */   pstack: () => (/* reexport safe */ _pstack_js__WEBPACK_IMPORTED_MODULE_1__.pstack)
/* harmony export */ });
/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Constants.js");
/* harmony import */ var _pstack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pstack.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/pstack.js");
/* harmony import */ var _CircleFinder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CircleFinder.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/CircleFinder.js");
/* harmony import */ var _Fxyf_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Fxyf.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Fxyf.js");
/* harmony import */ var _Healpix_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Healpix.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Healpix.js");
/* harmony import */ var _Pointing_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Pointing.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Pointing.js");
/* harmony import */ var _RangeSet_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RangeSet.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/RangeSet.js");
/* harmony import */ var _Vec3_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Vec3.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Vec3.js");
/* harmony import */ var _Xyf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Xyf.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Xyf.js");
/* harmony import */ var _Zphi_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Zphi.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Zphi.js");
/* harmony import */ var _Hploc_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Hploc.js */ "../astro-viewer/node_modules/healpixjs/lib-esm/Hploc.js");











//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../astro-viewer/node_modules/healpixjs/lib-esm/pstack.js":
/*!****************************************************************!*\
  !*** ../astro-viewer/node_modules/healpixjs/lib-esm/pstack.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pstack: () => (/* binding */ pstack)
/* harmony export */ });
class pstack {
    /** Creation from individual components */
    constructor(sz) {
        this.p = new Array(sz);
        this.o = new Int32Array(sz);
        this.s = 0;
        this.m = 0;
    }
    ;
    /**
     * @param p long
     * @param o int
     */
    push(p_, o_) {
        this.p[this.s] = p_;
        this.o[this.s] = o_;
        ++this.s;
    }
    ;
    pop() {
        --this.s;
    }
    ;
    popToMark() {
        this.s = this.m;
    }
    ;
    size() {
        return this.s;
    }
    ;
    mark() {
        this.m = this.s;
    }
    ;
    otop() {
        return this.o[this.s - 1];
    }
    ;
    ptop() {
        return this.p[this.s - 1];
    }
    ;
}
//# sourceMappingURL=pstack.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/css-tag.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/css-tag.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* binding */ CSSResult),
/* harmony export */   adoptStyles: () => (/* binding */ adoptStyles),
/* harmony export */   css: () => (/* binding */ css),
/* harmony export */   getCompatibleStyle: () => (/* binding */ getCompatibleStyle),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* binding */ supportsAdoptingStyleSheets),
/* harmony export */   unsafeCSS: () => (/* binding */ unsafeCSS)
/* harmony export */ });
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const NODE_MODE = false;
// Allows minifiers to rename references to globalThis
const global = globalThis;
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = global.ShadowRoot &&
    (global.ShadyCSS === undefined || global.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
const cssTagCache = new WeakMap();
/**
 * A container for a string of CSS text, that may be used to create a CSSStyleSheet.
 *
 * CSSResult is the return value of `css`-tagged template literals and
 * `unsafeCSS()`. In order to ensure that CSSResults are only created via the
 * `css` tag and `unsafeCSS()`, CSSResult cannot be constructed directly.
 */
class CSSResult {
    constructor(cssText, strings, safeToken) {
        // This property needs to remain unminified.
        this['_$cssResult$'] = true;
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
        this._strings = strings;
    }
    // This is a getter so that it's lazy. In practice, this means stylesheets
    // are not created until the first element instance is made.
    get styleSheet() {
        // If `supportsAdoptingStyleSheets` is true then we assume CSSStyleSheet is
        // constructable.
        let styleSheet = this._styleSheet;
        const strings = this._strings;
        if (supportsAdoptingStyleSheets && styleSheet === undefined) {
            const cacheable = strings !== undefined && strings.length === 1;
            if (cacheable) {
                styleSheet = cssTagCache.get(strings);
            }
            if (styleSheet === undefined) {
                (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
                if (cacheable) {
                    cssTagCache.set(strings, styleSheet);
                }
            }
        }
        return styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    // This property needs to remain unminified.
    if (value['_$cssResult$'] === true) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ` +
            `${value}. Use 'unsafeCSS' to pass non-literal values, but take care ` +
            `to ensure page security.`);
    }
};
/**
 * Wrap a value for interpolation in a {@linkcode css} tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => new CSSResult(typeof value === 'string' ? value : String(value), undefined, constructionToken);
/**
 * A template literal tag which can be used with LitElement's
 * {@linkcode LitElement.styles} property to set element styles.
 *
 * For security reasons, only literal string values and number may be used in
 * embedded expressions. To incorporate non-literal values {@linkcode unsafeCSS}
 * may be used inside an expression.
 */
const css = (strings, ...values) => {
    const cssText = strings.length === 1
        ? strings[0]
        : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, strings, constructionToken);
};
/**
 * Applies the given styles to a `shadowRoot`. When Shadow DOM is
 * available but `adoptedStyleSheets` is not, styles are appended to the
 * `shadowRoot` to [mimic the native feature](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets).
 * Note, when shimming is used, any styles that are subsequently placed into
 * the shadowRoot should be placed *before* any shimmed adopted styles. This
 * will match spec behavior that gives adopted sheets precedence over styles in
 * shadowRoot.
 */
const adoptStyles = (renderRoot, styles) => {
    if (supportsAdoptingStyleSheets) {
        renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    }
    else {
        for (const s of styles) {
            const style = document.createElement('style');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nonce = global['litNonce'];
            if (nonce !== undefined) {
                style.setAttribute('nonce', nonce);
            }
            style.textContent = s.cssText;
            renderRoot.appendChild(style);
        }
    }
};
const cssResultFromStyleSheet = (sheet) => {
    let cssText = '';
    for (const rule of sheet.cssRules) {
        cssText += rule.cssText;
    }
    return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets ||
    (NODE_MODE && global.CSSStyleSheet === undefined)
    ? (s) => s
    : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
//# sourceMappingURL=css-tag.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/base.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/base.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   desc: () => (/* binding */ desc)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Wraps up a few best practices when returning a property descriptor from a
 * decorator.
 *
 * Marks the defined property as configurable, and enumerable, and handles
 * the case where we have a busted Reflect.decorate zombiefill (e.g. in Angular
 * apps).
 *
 * @internal
 */
const desc = (obj, name, descriptor) => {
    // For backwards compatibility, we keep them configurable and enumerable.
    descriptor.configurable = true;
    descriptor.enumerable = true;
    if (
    // We check for Reflect.decorate each time, in case the zombiefill
    // is applied via lazy loading some Angular code.
    Reflect.decorate &&
        typeof name !== 'object') {
        // If we're called as a legacy decorator, and Reflect.decorate is present
        // then we have no guarantees that the returned descriptor will be
        // defined on the class, so we must apply it directly ourselves.
        Object.defineProperty(obj, name, descriptor);
    }
    return descriptor;
};
//# sourceMappingURL=base.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/custom-element.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/custom-element.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customElement: () => (/* binding */ customElement)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```js
 * @customElement('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The tag name of the custom element to define.
 */
const customElement = (tagName) => (classOrTarget, context) => {
    if (context !== undefined) {
        context.addInitializer(() => {
            customElements.define(tagName, classOrTarget);
        });
    }
    else {
        customElements.define(tagName, classOrTarget);
    }
};
//# sourceMappingURL=custom-element.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/event-options.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/event-options.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   eventOptions: () => (/* binding */ eventOptions)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
function eventOptions(options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((protoOrValue, nameOrContext) => {
        const method = typeof protoOrValue === 'function'
            ? protoOrValue
            : protoOrValue[nameOrContext];
        Object.assign(method, options);
    });
}
//# sourceMappingURL=event-options.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/property.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/property.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   property: () => (/* binding */ property),
/* harmony export */   standardProperty: () => (/* binding */ standardProperty)
/* harmony export */ });
/* harmony import */ var _reactive_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactive-element.js */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

const DEV_MODE = true;
let issueWarning;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    globalThis.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!globalThis.litIssuedWarnings.has(warning) &&
            !globalThis.litIssuedWarnings.has(code)) {
            console.warn(warning);
            globalThis.litIssuedWarnings.add(warning);
        }
    };
}
const legacyProperty = (options, proto, name) => {
    const hasOwnProperty = proto.hasOwnProperty(name);
    proto.constructor.createProperty(name, options);
    // For accessors (which have a descriptor on the prototype) we need to
    // return a descriptor, otherwise TypeScript overwrites the descriptor we
    // define in createProperty() with the original descriptor. We don't do this
    // for fields, which don't have a descriptor, because this could overwrite
    // descriptor defined by other decorators.
    return hasOwnProperty
        ? Object.getOwnPropertyDescriptor(proto, name)
        : undefined;
};
// This is duplicated from a similar variable in reactive-element.ts, but
// actually makes sense to have this default defined with the decorator, so
// that different decorators could have different defaults.
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: _reactive_element_js__WEBPACK_IMPORTED_MODULE_0__.defaultConverter,
    reflect: false,
    hasChanged: _reactive_element_js__WEBPACK_IMPORTED_MODULE_0__.notEqual,
};
/**
 * Wraps a class accessor or setter so that `requestUpdate()` is called with the
 * property name and old value when the accessor is set.
 */
const standardProperty = (options = defaultPropertyDeclaration, target, context) => {
    const { kind, metadata } = context;
    if (DEV_MODE && metadata == null) {
        issueWarning('missing-class-metadata', `The class ${target} is missing decorator metadata. This ` +
            `could mean that you're using a compiler that supports decorators ` +
            `but doesn't support decorator metadata, such as TypeScript 5.1. ` +
            `Please update your compiler.`);
    }
    // Store the property options
    let properties = globalThis.litPropertyMetadata.get(metadata);
    if (properties === undefined) {
        globalThis.litPropertyMetadata.set(metadata, (properties = new Map()));
    }
    if (kind === 'setter') {
        options = Object.create(options);
        options.wrapped = true;
    }
    properties.set(context.name, options);
    if (kind === 'accessor') {
        // Standard decorators cannot dynamically modify the class, so we can't
        // replace a field with accessors. The user must use the new `accessor`
        // keyword instead.
        const { name } = context;
        return {
            set(v) {
                const oldValue = target.get.call(this);
                target.set.call(this, v);
                this.requestUpdate(name, oldValue, options);
            },
            init(v) {
                if (v !== undefined) {
                    this._$changeProperty(name, undefined, options, v);
                }
                return v;
            },
        };
    }
    else if (kind === 'setter') {
        const { name } = context;
        return function (value) {
            const oldValue = this[name];
            target.call(this, value);
            this.requestUpdate(name, oldValue, options);
        };
    }
    throw new Error(`Unsupported decorator location: ${kind}`);
};
/**
 * A class field or accessor decorator which creates a reactive property that
 * reflects a corresponding attribute value. When a decorated property is set
 * the element will update and render. A {@linkcode PropertyDeclaration} may
 * optionally be supplied to configure property features.
 *
 * This decorator should only be used for public fields. As public fields,
 * properties should be considered as primarily settable by element users,
 * either via attribute or the property itself.
 *
 * Generally, properties that are changed by the element should be private or
 * protected fields and should use the {@linkcode state} decorator.
 *
 * However, sometimes element code does need to set a public property. This
 * should typically only be done in response to user interaction, and an event
 * should be fired informing the user; for example, a checkbox sets its
 * `checked` property when clicked and fires a `changed` event. Mutating public
 * properties should typically not be done for non-primitive (object or array)
 * properties. In other cases when an element needs to manage state, a private
 * property decorated via the {@linkcode state} decorator should be used. When
 * needed, state properties can be initialized via public properties to
 * facilitate complex interactions.
 *
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function property(options) {
    return (protoOrTarget, nameOrContext
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => {
        return (typeof nameOrContext === 'object'
            ? standardProperty(options, protoOrTarget, nameOrContext)
            : legacyProperty(options, protoOrTarget, nameOrContext));
    };
}
//# sourceMappingURL=property.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-all.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-all.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   queryAll: () => (/* binding */ queryAll)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Shared fragment used to generate empty NodeLists when a render root is
// undefined
let fragment;
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * ```ts
 * class MyElement {
 *   @queryAll('div')
 *   divs: NodeListOf<HTMLDivElement>;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAll(selector) {
    return ((obj, name) => {
        return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.desc)(obj, name, {
            get() {
                const container = this.renderRoot ?? (fragment ??= document.createDocumentFragment());
                return container.querySelectorAll(selector);
            },
        });
    });
}
//# sourceMappingURL=query-all.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   queryAssignedElements: () => (/* binding */ queryAssignedElements)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedElements` of the given `slot`. Provides a declarative
 * way to use
 * [`HTMLSlotElement.assignedElements`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedElements).
 *
 * Can be passed an optional {@linkcode QueryAssignedElementsOptions} object.
 *
 * Example usage:
 * ```ts
 * class MyElement {
 *   @queryAssignedElements({ slot: 'list' })
 *   listItems!: Array<HTMLElement>;
 *   @queryAssignedElements()
 *   unnamedSlotEls!: Array<HTMLElement>;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *       <slot></slot>
 *     `;
 *   }
 * }
 * ```
 *
 * Note, the type of this property should be annotated as `Array<HTMLElement>`.
 *
 * @category Decorator
 */
function queryAssignedElements(options) {
    return ((obj, name) => {
        const { slot, selector } = options ?? {};
        const slotSelector = `slot${slot ? `[name=${slot}]` : ':not([name])'}`;
        return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.desc)(obj, name, {
            get() {
                const slotEl = this.renderRoot?.querySelector(slotSelector);
                const elements = slotEl?.assignedElements(options) ?? [];
                return (selector === undefined
                    ? elements
                    : elements.filter((node) => node.matches(selector)));
            },
        });
    });
}
//# sourceMappingURL=query-assigned-elements.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   queryAssignedNodes: () => (/* binding */ queryAssignedNodes)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given `slot`.
 *
 * Can be passed an optional {@linkcode QueryAssignedNodesOptions} object.
 *
 * Example usage:
 * ```ts
 * class MyElement {
 *   @queryAssignedNodes({slot: 'list', flatten: true})
 *   listItems!: Array<Node>;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *     `;
 *   }
 * }
 * ```
 *
 * Note the type of this property should be annotated as `Array<Node>`. Use the
 * queryAssignedElements decorator to list only elements, and optionally filter
 * the element list using a CSS selector.
 *
 * @category Decorator
 */
function queryAssignedNodes(options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((obj, name) => {
        const { slot } = options ?? {};
        const slotSelector = `slot${slot ? `[name=${slot}]` : ':not([name])'}`;
        return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.desc)(obj, name, {
            get() {
                const slotEl = this.renderRoot?.querySelector(slotSelector);
                return (slotEl?.assignedNodes(options) ?? []);
            },
        });
    });
}
//# sourceMappingURL=query-assigned-nodes.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-async.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-async.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   queryAsync: () => (/* binding */ queryAsync)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first: Promise<HTMLDivElement>;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
function queryAsync(selector) {
    return ((obj, name) => {
        return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.desc)(obj, name, {
            async get() {
                await this.updateComplete;
                return this.renderRoot?.querySelector(selector) ?? null;
            },
        });
    });
}
//# sourceMappingURL=query-async.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   query: () => (/* binding */ query)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const DEV_MODE = true;
let issueWarning;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    globalThis.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning = (code, warning) => {
        warning += code
            ? ` See https://lit.dev/msg/${code} for more information.`
            : '';
        if (!globalThis.litIssuedWarnings.has(warning) &&
            !globalThis.litIssuedWarnings.has(code)) {
            console.warn(warning);
            globalThis.litIssuedWarnings.add(warning);
        }
    };
}
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 *     once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first: HTMLDivElement;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function query(selector, cache) {
    return ((protoOrTarget, nameOrContext, descriptor) => {
        const doQuery = (el) => {
            const result = (el.renderRoot?.querySelector(selector) ?? null);
            if (DEV_MODE && result === null && cache && !el.hasUpdated) {
                const name = typeof nameOrContext === 'object'
                    ? nameOrContext.name
                    : nameOrContext;
                issueWarning('', `@query'd field ${JSON.stringify(String(name))} with the 'cache' ` +
                    `flag set for selector '${selector}' has been accessed before ` +
                    `the first update and returned null. This is expected if the ` +
                    `renderRoot tree has not been provided beforehand (e.g. via ` +
                    `Declarative Shadow DOM). Therefore the value hasn't been cached.`);
            }
            // TODO: if we want to allow users to assert that the query will never
            // return null, we need a new option and to throw here if the result
            // is null.
            return result;
        };
        if (cache) {
            // Accessors to wrap from either:
            //   1. The decorator target, in the case of standard decorators
            //   2. The property descriptor, in the case of experimental decorators
            //      on auto-accessors.
            //   3. Functions that access our own cache-key property on the instance,
            //      in the case of experimental decorators on fields.
            const { get, set } = typeof nameOrContext === 'object'
                ? protoOrTarget
                : descriptor ??
                    (() => {
                        const key = DEV_MODE
                            ? Symbol(`${String(nameOrContext)} (@query() cache)`)
                            : Symbol();
                        return {
                            get() {
                                return this[key];
                            },
                            set(v) {
                                this[key] = v;
                            },
                        };
                    })();
            return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.desc)(protoOrTarget, nameOrContext, {
                get() {
                    let result = get.call(this);
                    if (result === undefined) {
                        result = doQuery(this);
                        if (result !== null || this.hasUpdated) {
                            set.call(this, result);
                        }
                    }
                    return result;
                },
            });
        }
        else {
            // This object works as the return type for both standard and
            // experimental decorators.
            return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.desc)(protoOrTarget, nameOrContext, {
                get() {
                    return doQuery(this);
                },
            });
        }
    });
}
//# sourceMappingURL=query.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/state.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/state.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   state: () => (/* binding */ state)
/* harmony export */ });
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./property.js */ "./node_modules/@lit/reactive-element/development/decorators/property.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

/**
 * Declares a private or protected reactive property that still triggers
 * updates to the element when it changes. It does not reflect from the
 * corresponding attribute.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 * @category Decorator
 */
function state(options) {
    return (0,_property_js__WEBPACK_IMPORTED_MODULE_0__.property)({
        ...options,
        // Add both `state` and `attribute` because we found a third party
        // controller that is keying off of PropertyOptions.state to determine
        // whether a field is a private internal property or not.
        state: true,
        attribute: false,
    });
}
//# sourceMappingURL=state.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/reactive-element.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/reactive-element.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   ReactiveElement: () => (/* binding */ ReactiveElement),
/* harmony export */   adoptStyles: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   defaultConverter: () => (/* binding */ defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   notEqual: () => (/* binding */ notEqual),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _css_tag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css-tag.js */ "./node_modules/@lit/reactive-element/development/css-tag.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Use this module if you want to create your own base class extending
 * {@link ReactiveElement}.
 * @packageDocumentation
 */

// In the Node build, this import will be injected by Rollup:
// import {HTMLElement, customElements} from '@lit-labs/ssr-dom-shim';

// TODO (justinfagnani): Add `hasOwn` here when we ship ES2022
const { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf, } = Object;
const NODE_MODE = false;
// Lets a minifier replace globalThis references with a minified name
const global = globalThis;
if (NODE_MODE) {
    global.customElements ??= customElements;
}
const DEV_MODE = true;
let issueWarning;
const trustedTypes = global
    .trustedTypes;
// Temporary workaround for https://crbug.com/993268
// Currently, any attribute starting with "on" is considered to be a
// TrustedScript source. Such boolean attributes must be set to the equivalent
// trusted emptyScript value.
const emptyStringForBooleanAttribute = trustedTypes
    ? trustedTypes.emptyScript
    : '';
const polyfillSupport = DEV_MODE
    ? global.reactiveElementPolyfillSupportDevMode
    : global.reactiveElementPolyfillSupport;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    global.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!global.litIssuedWarnings.has(warning) &&
            !global.litIssuedWarnings.has(code)) {
            console.warn(warning);
            global.litIssuedWarnings.add(warning);
        }
    };
    queueMicrotask(() => {
        issueWarning('dev-mode', `Lit is in dev mode. Not recommended for production!`);
        // Issue polyfill support warning.
        if (global.ShadyDOM?.inUse && polyfillSupport === undefined) {
            issueWarning('polyfill-support-missing', `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
                `the \`polyfill-support\` module has not been loaded.`);
        }
    });
}
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent = DEV_MODE
    ? (event) => {
        const shouldEmit = global
            .emitLitDebugLogEvents;
        if (!shouldEmit) {
            return;
        }
        global.dispatchEvent(new CustomEvent('lit-debug', {
            detail: event,
        }));
    }
    : undefined;
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                value = value ? emptyStringForBooleanAttribute : null;
                break;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                value = value == null ? value : JSON.stringify(value);
                break;
        }
        return value;
    },
    fromAttribute(value, type) {
        let fromValue = value;
        switch (type) {
            case Boolean:
                fromValue = value !== null;
                break;
            case Number:
                fromValue = value === null ? null : Number(value);
                break;
            case Object:
            case Array:
                // Do *not* generate exception when invalid JSON is set as elements
                // don't normally complain on being mis-configured.
                // TODO(sorvell): Do generate exception in *dev mode*.
                try {
                    // Assert to adhere to Bazel's "must type assert JSON parse" rule.
                    fromValue = JSON.parse(value);
                }
                catch (e) {
                    fromValue = null;
                }
                break;
        }
        return fromValue;
    },
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => !is(value, old);
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    useDefault: false,
    hasChanged: notEqual,
};
// Ensure metadata is enabled. TypeScript does not polyfill
// Symbol.metadata, so we must ensure that it exists.
Symbol.metadata ??= Symbol('metadata');
// Map from a class's metadata object to property options
// Note that we must use nullish-coalescing assignment so that we only use one
// map even if we load multiple version of this module.
global.litPropertyMetadata ??= new WeakMap();
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclasses to render updates as desired.
 * @noInheritDoc
 */
class ReactiveElement
// In the Node build, this `extends` clause will be substituted with
// `(globalThis.HTMLElement ?? HTMLElement)`.
//
// This way, we will first prefer any global `HTMLElement` polyfill that the
// user has assigned, and then fall back to the `HTMLElement` shim which has
// been imported (see note at the top of this file about how this import is
// generated by Rollup). Note that the `HTMLElement` variable has been
// shadowed by this import, so it no longer refers to the global.
 extends HTMLElement {
    /**
     * Adds an initializer function to the class that is called during instance
     * construction.
     *
     * This is useful for code that runs against a `ReactiveElement`
     * subclass, such as a decorator, that needs to do work for each
     * instance, such as setting up a `ReactiveController`.
     *
     * ```ts
     * const myDecorator = (target: typeof ReactiveElement, key: string) => {
     *   target.addInitializer((instance: ReactiveElement) => {
     *     // This is run during construction of the element
     *     new MyController(instance);
     *   });
     * }
     * ```
     *
     * Decorating a field will then cause each instance to run an initializer
     * that adds a controller:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   @myDecorator foo;
     * }
     * ```
     *
     * Initializers are stored per-constructor. Adding an initializer to a
     * subclass does not add it to a superclass. Since initializers are run in
     * constructors, initializers will run in order of the class hierarchy,
     * starting with superclasses and progressing to the instance's class.
     *
     * @nocollapse
     */
    static addInitializer(initializer) {
        this.__prepare();
        (this._initializers ??= []).push(initializer);
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     * @category attributes
     */
    static get observedAttributes() {
        // Ensure we've created all properties
        this.finalize();
        // this.__attributeToPropertyMap is only undefined after finalize() in
        // ReactiveElement itself. ReactiveElement.observedAttributes is only
        // accessed with ReactiveElement as the receiver when a subclass or mixin
        // calls super.observedAttributes
        return (this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()]);
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a {@linkcode PropertyDeclaration} for the property with the
     * given options. The property setter calls the property's `hasChanged`
     * property option or uses a strict identity check to determine whether or not
     * to request an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * ```ts
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // If this is a state property, force the attribute to false.
        if (options.state) {
            options.attribute = false;
        }
        this.__prepare();
        // Whether this property is wrapping accessors.
        // Helps control the initial value change and reflection logic.
        if (this.prototype.hasOwnProperty(name)) {
            options = Object.create(options);
            options.wrapped = true;
        }
        this.elementProperties.set(name, options);
        if (!options.noAccessor) {
            const key = DEV_MODE
                ? // Use Symbol.for in dev mode to make it easier to maintain state
                    // when doing HMR.
                    Symbol.for(`${String(name)} (@property() cache)`)
                : Symbol();
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                defineProperty(this.prototype, name, descriptor);
            }
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     * ```ts
     * class MyElement extends LitElement {
     *   static getPropertyDescriptor(name, key, options) {
     *     const defaultDescriptor =
     *         super.getPropertyDescriptor(name, key, options);
     *     const setter = defaultDescriptor.set;
     *     return {
     *       get: defaultDescriptor.get,
     *       set(value) {
     *         setter.call(this, value);
     *         // custom action.
     *       },
     *       configurable: true,
     *       enumerable: true
     *     }
     *   }
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static getPropertyDescriptor(name, key, options) {
        const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
            get() {
                return this[key];
            },
            set(v) {
                this[key] = v;
            },
        };
        if (DEV_MODE && get == null) {
            if ('value' in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
                throw new Error(`Field ${JSON.stringify(String(name))} on ` +
                    `${this.name} was declared as a reactive property ` +
                    `but it's actually declared as a value on the prototype. ` +
                    `Usually this is due to using @property or @state on a method.`);
            }
            issueWarning('reactive-property-without-getter', `Field ${JSON.stringify(String(name))} on ` +
                `${this.name} was declared as a reactive property ` +
                `but it does not have a getter. This will be an error in a ` +
                `future version of Lit.`);
        }
        return {
            get,
            set(value) {
                const oldValue = get?.call(this);
                set?.call(this, value);
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a `PropertyDeclaration` via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override
     * {@linkcode createProperty}.
     *
     * @nocollapse
     * @final
     * @category properties
     */
    static getPropertyOptions(name) {
        return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
    }
    /**
     * Initializes static own properties of the class used in bookkeeping
     * for element properties, initializers, etc.
     *
     * Can be called multiple times by code that needs to ensure these
     * properties exist before using them.
     *
     * This method ensures the superclass is finalized so that inherited
     * property metadata can be copied down.
     * @nocollapse
     */
    static __prepare() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('elementProperties', this))) {
            // Already prepared
            return;
        }
        // Finalize any superclasses
        const superCtor = getPrototypeOf(this);
        superCtor.finalize();
        // Create own set of initializers for this class if any exist on the
        // superclass and copy them down. Note, for a small perf boost, avoid
        // creating initializers unless needed.
        if (superCtor._initializers !== undefined) {
            this._initializers = [...superCtor._initializers];
        }
        // Initialize elementProperties from the superclass
        this.elementProperties = new Map(superCtor.elementProperties);
    }
    /**
     * Finishes setting up the class so that it's ready to be registered
     * as a custom element and instantiated.
     *
     * This method is called by the ReactiveElement.observedAttributes getter.
     * If you override the observedAttributes getter, you must either call
     * super.observedAttributes to trigger finalization, or call finalize()
     * yourself.
     *
     * @nocollapse
     */
    static finalize() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this))) {
            return;
        }
        this.finalized = true;
        this.__prepare();
        // Create properties from the static properties block:
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            const propKeys = [
                ...getOwnPropertyNames(props),
                ...getOwnPropertySymbols(props),
            ];
            for (const p of propKeys) {
                this.createProperty(p, props[p]);
            }
        }
        // Create properties from standard decorator metadata:
        const metadata = this[Symbol.metadata];
        if (metadata !== null) {
            const properties = litPropertyMetadata.get(metadata);
            if (properties !== undefined) {
                for (const [p, options] of properties) {
                    this.elementProperties.set(p, options);
                }
            }
        }
        // Create the attribute-to-property map
        this.__attributeToPropertyMap = new Map();
        for (const [p, options] of this.elementProperties) {
            const attr = this.__attributeNameForProperty(p, options);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
            }
        }
        this.elementStyles = this.finalizeStyles(this.styles);
        if (DEV_MODE) {
            if (this.hasOwnProperty('createProperty')) {
                issueWarning('no-override-create-property', 'Overriding ReactiveElement.createProperty() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
            if (this.hasOwnProperty('getPropertyDescriptor')) {
                issueWarning('no-override-get-property-descriptor', 'Overriding ReactiveElement.getPropertyDescriptor() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
        }
    }
    /**
     * Takes the styles the user supplied via the `static styles` property and
     * returns the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * Styles are deduplicated preserving the _last_ instance in the list. This
     * is a performance optimization to avoid duplicated styles that can occur
     * especially when composing via subclassing. The last item is kept to try
     * to preserve the cascade order with the assumption that it's most important
     * that last added styles override previous styles.
     *
     * @nocollapse
     * @category styles
     */
    static finalizeStyles(styles) {
        const elementStyles = [];
        if (Array.isArray(styles)) {
            // Dedupe the flattened array in reverse order to preserve the last items.
            // Casting to Array<unknown> works around TS error that
            // appears to come from trying to flatten a type CSSResultArray.
            const set = new Set(styles.flat(Infinity).reverse());
            // Then preserve original order by adding the set items in reverse order.
            for (const s of set) {
                elementStyles.unshift((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(s));
            }
        }
        else if (styles !== undefined) {
            elementStyles.push((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(styles));
        }
        return elementStyles;
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
                ? attribute
                : typeof name === 'string'
                    ? name.toLowerCase()
                    : undefined;
    }
    constructor() {
        super();
        this.__instanceProperties = undefined;
        /**
         * True if there is a pending update as a result of calling `requestUpdate()`.
         * Should only be read.
         * @category updates
         */
        this.isUpdatePending = false;
        /**
         * Is set to `true` after the first update. The element code cannot assume
         * that `renderRoot` exists before the element `hasUpdated`.
         * @category updates
         */
        this.hasUpdated = false;
        /**
         * Name of currently reflecting property
         */
        this.__reflectingProperty = null;
        this.__initialize();
    }
    /**
     * Internal only override point for customizing work done when elements
     * are constructed.
     */
    __initialize() {
        this.__updatePromise = new Promise((res) => (this.enableUpdating = res));
        this._$changedProperties = new Map();
        // This enqueues a microtask that must run before the first update, so it
        // must be called before requestUpdate()
        this.__saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdate();
        this.constructor._initializers?.forEach((i) => i(this));
    }
    /**
     * Registers a `ReactiveController` to participate in the element's reactive
     * update cycle. The element automatically calls into any registered
     * controllers during its lifecycle callbacks.
     *
     * If the element is connected when `addController()` is called, the
     * controller's `hostConnected()` callback will be immediately called.
     * @category controllers
     */
    addController(controller) {
        (this.__controllers ??= new Set()).add(controller);
        // If a controller is added after the element has been connected,
        // call hostConnected. Note, re-using existence of `renderRoot` here
        // (which is set in connectedCallback) to avoid the need to track a
        // first connected state.
        if (this.renderRoot !== undefined && this.isConnected) {
            controller.hostConnected?.();
        }
    }
    /**
     * Removes a `ReactiveController` from the element.
     * @category controllers
     */
    removeController(controller) {
        this.__controllers?.delete(controller);
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs.
     */
    __saveInstanceProperties() {
        const instanceProperties = new Map();
        const elementProperties = this.constructor
            .elementProperties;
        for (const p of elementProperties.keys()) {
            if (this.hasOwnProperty(p)) {
                instanceProperties.set(p, this[p]);
                delete this[p];
            }
        }
        if (instanceProperties.size > 0) {
            this.__instanceProperties = instanceProperties;
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     *
     * @return Returns a node into which to render.
     * @category rendering
     */
    createRenderRoot() {
        const renderRoot = this.shadowRoot ??
            this.attachShadow(this.constructor.shadowRootOptions);
        (0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles)(renderRoot, this.constructor.elementStyles);
        return renderRoot;
    }
    /**
     * On first connection, creates the element's renderRoot, sets up
     * element styling, and enables updating.
     * @category lifecycle
     */
    connectedCallback() {
        // Create renderRoot before controllers `hostConnected`
        this.renderRoot ??=
            this.createRenderRoot();
        this.enableUpdating(true);
        this.__controllers?.forEach((c) => c.hostConnected?.());
    }
    /**
     * Note, this method should be considered final and not overridden. It is
     * overridden on the element instance with a function that triggers the first
     * update.
     * @category updates
     */
    enableUpdating(_requestedUpdate) { }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     * @category lifecycle
     */
    disconnectedCallback() {
        this.__controllers?.forEach((c) => c.hostDisconnected?.());
    }
    /**
     * Synchronizes property values when attributes change.
     *
     * Specifically, when an attribute is set, the corresponding property is set.
     * You should rarely need to implement this callback. If this method is
     * overridden, `super.attributeChangedCallback(name, _old, value)` must be
     * called.
     *
     * See [responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes)
     * on MDN for more information about the `attributeChangedCallback`.
     * @category attributes
     */
    attributeChangedCallback(name, _old, value) {
        this._$attributeToProperty(name, value);
    }
    __propertyToAttribute(name, value) {
        const elemProperties = this.constructor.elementProperties;
        const options = elemProperties.get(name);
        const attr = this.constructor.__attributeNameForProperty(name, options);
        if (attr !== undefined && options.reflect === true) {
            const converter = options.converter?.toAttribute !==
                undefined
                ? options.converter
                : defaultConverter;
            const attrValue = converter.toAttribute(value, options.type);
            if (DEV_MODE &&
                this.constructor.enabledWarnings.includes('migration') &&
                attrValue === undefined) {
                issueWarning('undefined-attribute-value', `The attribute value for the ${name} property is ` +
                    `undefined on element ${this.localName}. The attribute will be ` +
                    `removed, but in the previous version of \`ReactiveElement\`, ` +
                    `the attribute would not have changed.`);
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this.__reflectingProperty = name;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /** @internal */
    _$attributeToProperty(name, value) {
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        const propName = ctor.__attributeToPropertyMap.get(name);
        // Use tracking info to avoid reflecting a property value to an attribute
        // if it was just set because the attribute changed.
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = ctor.getPropertyOptions(propName);
            const converter = typeof options.converter === 'function'
                ? { fromAttribute: options.converter }
                : options.converter?.fromAttribute !== undefined
                    ? options.converter
                    : defaultConverter;
            // mark state reflecting
            this.__reflectingProperty = propName;
            const convertedValue = converter.fromAttribute(value, options.type);
            this[propName] =
                convertedValue ??
                    this.__defaultValues?.get(propName) ??
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    convertedValue;
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should be called
     * when an element should update based on some state not triggered by setting
     * a reactive property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored.
     *
     * @param name name of requesting property
     * @param oldValue old value of requesting property
     * @param options property options to use instead of the previously
     *     configured options
     * @category updates
     */
    requestUpdate(name, oldValue, options) {
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            if (DEV_MODE && name instanceof Event) {
                issueWarning(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
            }
            const ctor = this.constructor;
            const newValue = this[name];
            options ??= ctor.getPropertyOptions(name);
            const changed = (options.hasChanged ?? notEqual)(newValue, oldValue) ||
                // When there is no change, check a corner case that can occur when
                // 1. there's a initial value which was not reflected
                // 2. the property is subsequently set to this value.
                // For example, `prop: {useDefault: true, reflect: true}`
                // and el.prop = 'foo'. This should be considered a change if the
                // attribute is not set because we will now reflect the property to the attribute.
                (options.useDefault &&
                    options.reflect &&
                    newValue === this.__defaultValues?.get(name) &&
                    !this.hasAttribute(ctor.__attributeNameForProperty(name, options)));
            if (changed) {
                this._$changeProperty(name, oldValue, options);
            }
            else {
                // Abort the request if the property should not be considered changed.
                return;
            }
        }
        if (this.isUpdatePending === false) {
            this.__updatePromise = this.__enqueueUpdate();
        }
    }
    /**
     * @internal
     */
    _$changeProperty(name, oldValue, { useDefault, reflect, wrapped }, initializeValue) {
        // Record default value when useDefault is used. This allows us to
        // restore this value when the attribute is removed.
        if (useDefault && !(this.__defaultValues ??= new Map()).has(name)) {
            this.__defaultValues.set(name, initializeValue ?? oldValue ?? this[name]);
            // if this is not wrapping an accessor, it must be an initial setting
            // and in this case we do not want to record the change or reflect.
            if (wrapped !== true || initializeValue !== undefined) {
                return;
            }
        }
        // TODO (justinfagnani): Create a benchmark of Map.has() + Map.set(
        // vs just Map.set()
        if (!this._$changedProperties.has(name)) {
            // On the initial change, the old value should be `undefined`, except
            // with `useDefault`
            if (!this.hasUpdated && !useDefault) {
                oldValue = undefined;
            }
            this._$changedProperties.set(name, oldValue);
        }
        // Add to reflecting properties set.
        // Note, it's important that every change has a chance to add the
        // property to `__reflectingProperties`. This ensures setting
        // attribute + property reflects correctly.
        if (reflect === true && this.__reflectingProperty !== name) {
            (this.__reflectingProperties ??= new Set()).add(name);
        }
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async __enqueueUpdate() {
        this.isUpdatePending = true;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this.__updatePromise;
        }
        catch (e) {
            // Refire any previous errors async so they do not disrupt the update
            // cycle. Errors are refired so developers have a chance to observe
            // them, and this can be done by implementing
            // `window.onunhandledrejection`.
            Promise.reject(e);
        }
        const result = this.scheduleUpdate();
        // If `scheduleUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this.isUpdatePending;
    }
    /**
     * Schedules an element update. You can override this method to change the
     * timing of updates by returning a Promise. The update will await the
     * returned Promise, and you should resolve the Promise to allow the update
     * to proceed. If this method is overridden, `super.scheduleUpdate()`
     * must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```ts
     * override protected async scheduleUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.scheduleUpdate();
     * }
     * ```
     * @category updates
     */
    scheduleUpdate() {
        const result = this.performUpdate();
        if (DEV_MODE &&
            this.constructor.enabledWarnings.includes('async-perform-update') &&
            typeof result?.then ===
                'function') {
            issueWarning('async-perform-update', `Element ${this.localName} returned a Promise from performUpdate(). ` +
                `This behavior is deprecated and will be removed in a future ` +
                `version of ReactiveElement.`);
        }
        return result;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * Call `performUpdate()` to immediately process a pending update. This should
     * generally not be needed, but it can be done in rare cases when you need to
     * update synchronously.
     *
     * @category updates
     */
    performUpdate() {
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this.isUpdatePending) {
            return;
        }
        debugLogEvent?.({ kind: 'update' });
        if (!this.hasUpdated) {
            // Create renderRoot before first update. This occurs in `connectedCallback`
            // but is done here to support out of tree calls to `enableUpdating`/`performUpdate`.
            this.renderRoot ??=
                this.createRenderRoot();
            if (DEV_MODE) {
                // Produce warning if any reactive properties on the prototype are
                // shadowed by class fields. Instance fields set before upgrade are
                // deleted by this point, so any own property is caused by class field
                // initialization in the constructor.
                const ctor = this.constructor;
                const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
                if (shadowedProperties.length) {
                    throw new Error(`The following properties on element ${this.localName} will not ` +
                        `trigger updates as expected because they are set using class ` +
                        `fields: ${shadowedProperties.join(', ')}. ` +
                        `Native class fields and some compiled output will overwrite ` +
                        `accessors used for detecting changes. See ` +
                        `https://lit.dev/msg/class-field-shadowing ` +
                        `for more information.`);
                }
            }
            // Mixin instance properties once, if they exist.
            if (this.__instanceProperties) {
                // TODO (justinfagnani): should we use the stored value? Could a new value
                // have been set since we stored the own property value?
                for (const [p, value] of this.__instanceProperties) {
                    this[p] = value;
                }
                this.__instanceProperties = undefined;
            }
            // Trigger initial value reflection and populate the initial
            // `changedProperties` map, but only for the case of properties created
            // via `createProperty` on accessors, which will not have already
            // populated the `changedProperties` map since they are not set.
            // We can't know if these accessors had initializers, so we just set
            // them anyway - a difference from experimental decorators on fields and
            // standard decorators on auto-accessors.
            // For context see:
            // https://github.com/lit/lit/pull/4183#issuecomment-1711959635
            const elementProperties = this.constructor
                .elementProperties;
            if (elementProperties.size > 0) {
                for (const [p, options] of elementProperties) {
                    const { wrapped } = options;
                    const value = this[p];
                    if (wrapped === true &&
                        !this._$changedProperties.has(p) &&
                        value !== undefined) {
                        this._$changeProperty(p, undefined, options, value);
                    }
                }
            }
        }
        let shouldUpdate = false;
        const changedProperties = this._$changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.willUpdate(changedProperties);
                this.__controllers?.forEach((c) => c.hostUpdate?.());
                this.update(changedProperties);
            }
            else {
                this.__markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this.__markUpdated();
            throw e;
        }
        // The update is no longer considered pending and further updates are now allowed.
        if (shouldUpdate) {
            this._$didUpdate(changedProperties);
        }
    }
    /**
     * Invoked before `update()` to compute values needed during the update.
     *
     * Implement `willUpdate` to compute property values that depend on other
     * properties and are used in the rest of the update process.
     *
     * ```ts
     * willUpdate(changedProperties) {
     *   // only need to check changed properties for an expensive computation.
     *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
     *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
     *   }
     * }
     *
     * render() {
     *   return html`SHA: ${this.sha}`;
     * }
     * ```
     *
     * @category updates
     */
    willUpdate(_changedProperties) { }
    // Note, this is an override point for polyfill-support.
    // @internal
    _$didUpdate(changedProperties) {
        this.__controllers?.forEach((c) => c.hostUpdated?.());
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
        if (DEV_MODE &&
            this.isUpdatePending &&
            this.constructor.enabledWarnings.includes('change-in-update')) {
            issueWarning('change-in-update', `Element ${this.localName} scheduled an update ` +
                `(generally because a property was set) ` +
                `after an update completed, causing a new update to be scheduled. ` +
                `This is inefficient and should be avoided unless the next update ` +
                `can only be scheduled as a side effect of the previous update.`);
        }
    }
    __markUpdated() {
        this._$changedProperties = new Map();
        this.isUpdatePending = false;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super.getUpdateComplete()`, then any subsequent state.
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    get updateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   override async getUpdateComplete() {
     *     const result = await super.getUpdateComplete();
     *     await this._myChild.updateComplete;
     *     return result;
     *   }
     * }
     * ```
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    getUpdateComplete() {
        return this.__updatePromise;
    }
    /**
     * Controls whether or not `update()` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    update(_changedProperties) {
        // The forEach() expression will only run when __reflectingProperties is
        // defined, and it returns undefined, setting __reflectingProperties to
        // undefined
        this.__reflectingProperties &&= this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p]));
        this.__markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    updated(_changedProperties) { }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * ```ts
     * firstUpdated() {
     *   this.renderRoot.getElementById('my-text-area').focus();
     * }
     * ```
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    firstUpdated(_changedProperties) { }
}
/**
 * Memoized list of all element styles.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category styles
 */
ReactiveElement.elementStyles = [];
/**
 * Options used when calling `attachShadow`. Set this property to customize
 * the options for the shadowRoot; for example, to create a closed
 * shadowRoot: `{mode: 'closed'}`.
 *
 * Note, these options are used in `createRenderRoot`. If this method
 * is customized, options should be respected if possible.
 * @nocollapse
 * @category rendering
 */
ReactiveElement.shadowRootOptions = { mode: 'open' };
// Assigned here to work around a jscompiler bug with static fields
// when compiling to ES5.
// https://github.com/google/closure-compiler/issues/3177
ReactiveElement[JSCompiler_renameProperty('elementProperties', ReactiveElement)] = new Map();
ReactiveElement[JSCompiler_renameProperty('finalized', ReactiveElement)] = new Map();
// Apply polyfills if available
polyfillSupport?.({ ReactiveElement });
// Dev mode warnings...
if (DEV_MODE) {
    // Default warning set.
    ReactiveElement.enabledWarnings = [
        'change-in-update',
        'async-perform-update',
    ];
    const ensureOwnWarnings = function (ctor) {
        if (!ctor.hasOwnProperty(JSCompiler_renameProperty('enabledWarnings', ctor))) {
            ctor.enabledWarnings = ctor.enabledWarnings.slice();
        }
    };
    ReactiveElement.enableWarning = function (warning) {
        ensureOwnWarnings(this);
        if (!this.enabledWarnings.includes(warning)) {
            this.enabledWarnings.push(warning);
        }
    };
    ReactiveElement.disableWarning = function (warning) {
        ensureOwnWarnings(this);
        const i = this.enabledWarnings.indexOf(warning);
        if (i >= 0) {
            this.enabledWarnings.splice(i, 1);
        }
    };
}
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for ReactiveElement usage.
(global.reactiveElementVersions ??= []).push('2.1.1');
if (DEV_MODE && global.reactiveElementVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
            `is not recommended.`);
    });
}
//# sourceMappingURL=reactive-element.js.map

/***/ }),

/***/ "./node_modules/lit-element/development/lit-element.js":
/*!*************************************************************!*\
  !*** ./node_modules/lit-element/development/lit-element.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   LitElement: () => (/* binding */ LitElement),
/* harmony export */   ReactiveElement: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement),
/* harmony export */   _$LE: () => (/* binding */ _$LE),
/* harmony export */   _$LH: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH),
/* harmony export */   adoptStyles: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   defaultConverter: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   html: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   mathml: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.mathml),
/* harmony export */   noChange: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   notEqual: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.notEqual),
/* harmony export */   nothing: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   render: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   svg: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * The main LitElement module, which defines the {@linkcode LitElement} base
 * class and related APIs.
 *
 * LitElement components can define a template and a set of observed
 * properties. Changing an observed property triggers a re-render of the
 * element.
 *
 * Import {@linkcode LitElement} and {@linkcode html} from this module to
 * create a component:
 *
 *  ```js
 * import {LitElement, html} from 'lit-element';
 *
 * class MyElement extends LitElement {
 *
 *   // Declare observed properties
 *   static get properties() {
 *     return {
 *       adjective: {}
 *     }
 *   }
 *
 *   constructor() {
 *     this.adjective = 'awesome';
 *   }
 *
 *   // Define the element's template
 *   render() {
 *     return html`<p>your ${adjective} template here</p>`;
 *   }
 * }
 *
 * customElements.define('my-element', MyElement);
 * ```
 *
 * `LitElement` extends {@linkcode ReactiveElement} and adds lit-html
 * templating. The `ReactiveElement` class is provided for users that want to
 * build their own custom element base classes that don't use lit-html.
 *
 * @packageDocumentation
 */




/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = (prop, _obj) => prop;
const DEV_MODE = true;
// Allows minifiers to rename references to globalThis
const global = globalThis;
let issueWarning;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    global.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!global.litIssuedWarnings.has(warning) &&
            !global.litIssuedWarnings.has(code)) {
            console.warn(warning);
            global.litIssuedWarnings.add(warning);
        }
    };
}
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the {@linkcode LitElement.properties properties} property or the
 * {@linkcode property} decorator.
 */
class LitElement extends _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement {
    constructor() {
        super(...arguments);
        /**
         * @category rendering
         */
        this.renderOptions = { host: this };
        this.__childPart = undefined;
    }
    /**
     * @category rendering
     */
    createRenderRoot() {
        const renderRoot = super.createRenderRoot();
        // When adoptedStyleSheets are shimmed, they are inserted into the
        // shadowRoot by createRenderRoot. Adjust the renderBefore node so that
        // any styles in Lit content render before adoptedStyleSheets. This is
        // important so that adoptedStyleSheets have precedence over styles in
        // the shadowRoot.
        this.renderOptions.renderBefore ??= renderRoot.firstChild;
        return renderRoot;
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param changedProperties Map of changed properties with old values
     * @category updates
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const value = this.render();
        if (!this.hasUpdated) {
            this.renderOptions.isConnected = this.isConnected;
        }
        super.update(changedProperties);
        this.__childPart = (0,lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(value, this.renderRoot, this.renderOptions);
    }
    /**
     * Invoked when the component is added to the document's DOM.
     *
     * In `connectedCallback()` you should setup tasks that should only occur when
     * the element is connected to the document. The most common of these is
     * adding event listeners to nodes external to the element, like a keydown
     * event handler added to the window.
     *
     * ```ts
     * connectedCallback() {
     *   super.connectedCallback();
     *   addEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * Typically, anything done in `connectedCallback()` should be undone when the
     * element is disconnected, in `disconnectedCallback()`.
     *
     * @category lifecycle
     */
    connectedCallback() {
        super.connectedCallback();
        this.__childPart?.setConnected(true);
    }
    /**
     * Invoked when the component is removed from the document's DOM.
     *
     * This callback is the main signal to the element that it may no longer be
     * used. `disconnectedCallback()` should ensure that nothing is holding a
     * reference to the element (such as event listeners added to nodes external
     * to the element), so that it is free to be garbage collected.
     *
     * ```ts
     * disconnectedCallback() {
     *   super.disconnectedCallback();
     *   window.removeEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * An element may be re-connected after being disconnected.
     *
     * @category lifecycle
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.__childPart?.setConnected(false);
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `ChildPart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     * @category rendering
     */
    render() {
        return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange;
    }
}
// This property needs to remain unminified.
LitElement['_$litElement$'] = true;
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See @lit/reactive-element for more information.
 */
LitElement[JSCompiler_renameProperty('finalized', LitElement)] = true;
// Install hydration if available
global.litElementHydrateSupport?.({ LitElement });
// Apply polyfills if available
const polyfillSupport = DEV_MODE
    ? global.litElementPolyfillSupportDevMode
    : global.litElementPolyfillSupport;
polyfillSupport?.({ LitElement });
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _$LE object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-html, since this module re-exports all of lit-html.
 *
 * @private
 */
const _$LE = {
    _$attributeToProperty: (el, name, value) => {
        // eslint-disable-next-line
        el._$attributeToProperty(name, value);
    },
    // eslint-disable-next-line
    _$changedProperties: (el) => el._$changedProperties,
};
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
(global.litElementVersions ??= []).push('4.2.1');
if (DEV_MODE && global.litElementVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
            `is not recommended.`);
    });
}
//# sourceMappingURL=lit-element.js.map

/***/ }),

/***/ "./node_modules/lit-html/development/is-server.js":
/*!********************************************************!*\
  !*** ./node_modules/lit-html/development/is-server.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isServer: () => (/* binding */ isServer)
/* harmony export */ });
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @fileoverview
 *
 * This file exports a boolean const whose value will depend on what environment
 * the module is being imported from.
 */
const NODE_MODE = false;
/**
 * A boolean that will be `true` in server environments like Node, and `false`
 * in browser environments. Note that your server environment or toolchain must
 * support the `"node"` export condition for this to be `true`.
 *
 * This can be used when authoring components to change behavior based on
 * whether or not the component is executing in an SSR context.
 */
const isServer = NODE_MODE;
//# sourceMappingURL=is-server.js.map

/***/ }),

/***/ "./node_modules/lit-html/development/lit-html.js":
/*!*******************************************************!*\
  !*** ./node_modules/lit-html/development/lit-html.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ _$LH),
/* harmony export */   html: () => (/* binding */ html),
/* harmony export */   mathml: () => (/* binding */ mathml),
/* harmony export */   noChange: () => (/* binding */ noChange),
/* harmony export */   nothing: () => (/* binding */ nothing),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   svg: () => (/* binding */ svg)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const DEV_MODE = true;
const ENABLE_EXTRA_SECURITY_HOOKS = true;
const ENABLE_SHADYDOM_NOPATCH = true;
const NODE_MODE = false;
// Allows minifiers to rename references to globalThis
const global = globalThis;
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent = DEV_MODE
    ? (event) => {
        const shouldEmit = global
            .emitLitDebugLogEvents;
        if (!shouldEmit) {
            return;
        }
        global.dispatchEvent(new CustomEvent('lit-debug', {
            detail: event,
        }));
    }
    : undefined;
// Used for connecting beginRender and endRender events when there are nested
// renders when errors are thrown preventing an endRender event from being
// called.
let debugLogRenderId = 0;
let issueWarning;
if (DEV_MODE) {
    global.litIssuedWarnings ??= new Set();
    /**
     * Issue a warning if we haven't already, based either on `code` or `warning`.
     * Warnings are disabled automatically only by `warning`; disabling via `code`
     * can be done by users.
     */
    issueWarning = (code, warning) => {
        warning += code
            ? ` See https://lit.dev/msg/${code} for more information.`
            : '';
        if (!global.litIssuedWarnings.has(warning) &&
            !global.litIssuedWarnings.has(code)) {
            console.warn(warning);
            global.litIssuedWarnings.add(warning);
        }
    };
    queueMicrotask(() => {
        issueWarning('dev-mode', `Lit is in dev mode. Not recommended for production!`);
    });
}
const wrap = ENABLE_SHADYDOM_NOPATCH &&
    global.ShadyDOM?.inUse &&
    global.ShadyDOM?.noPatch === true
    ? global.ShadyDOM.wrap
    : (node) => node;
const trustedTypes = global.trustedTypes;
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = trustedTypes
    ? trustedTypes.createPolicy('lit-html', {
        createHTML: (s) => s,
    })
    : undefined;
const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;
/** Sets the global sanitizer factory. */
const setSanitizer = (newSanitizer) => {
    if (!ENABLE_EXTRA_SECURITY_HOOKS) {
        return;
    }
    if (sanitizerFactoryInternal !== noopSanitizer) {
        throw new Error(`Attempted to overwrite existing lit-html security policy.` +
            ` setSanitizeDOMValueFactory should be called at most once.`);
    }
    sanitizerFactoryInternal = newSanitizer;
};
/**
 * Only used in internal tests, not a part of the public API.
 */
const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
    sanitizerFactoryInternal = noopSanitizer;
};
const createSanitizer = (node, name, type) => {
    return sanitizerFactoryInternal(node, name, type);
};
// Added to an attribute name to mark the attribute as bound so we can find
// it easily.
const boundAttributeSuffix = '$lit$';
// This marker is used in many syntactic positions in HTML, so it must be
// a valid element name and attribute name. We don't support dynamic names (yet)
// but this at least ensures that the parse tree is closer to the template
// intention.
const marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
// String used to tell if a comment is a marker comment
const markerMatch = '?' + marker;
// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
const nodeMarker = `<${markerMatch}>`;
const d = NODE_MODE && global.document === undefined
    ? {
        createTreeWalker() {
            return {};
        },
    }
    : document;
// Creates a dynamic marker. We never have to search for these in the DOM.
const createMarker = () => d.createComment('');
const isPrimitive = (value) => value === null || (typeof value != 'object' && typeof value != 'function');
const isArray = Array.isArray;
const isIterable = (value) => isArray(value) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof value?.[Symbol.iterator] === 'function';
const SPACE_CHAR = `[ \t\n\f\r]`;
const ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
const NAME_CHAR = `[^\\s"'>=/]`;
// These regexes represent the five parsing states that we care about in the
// Template's HTML scanner. They match the *end* of the state they're named
// after.
// Depending on the match, we transition to a new state. If there's no match,
// we stay in the same state.
// Note that the regexes are stateful. We utilize lastIndex and sync it
// across the multiple regexes used. In addition to the five regexes below
// we also dynamically create a regex to find the matching end tags for raw
// text elements.
/**
 * End of text is: `<` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
const textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single `>`
 */
const comment2EndRegex = />/g;
/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a `>`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, 'g');
const ENTIRE_MATCH = 0;
const ATTRIBUTE_NAME = 1;
const SPACES_AND_EQUALS = 2;
const QUOTE_CHAR = 3;
const singleQuoteAttrEndRegex = /'/g;
const doubleQuoteAttrEndRegex = /"/g;
/**
 * Matches the raw text elements.
 *
 * Comments are not parsed within raw text elements, so we need to search their
 * text content for marker strings.
 */
const rawTextElement = /^(?:script|style|textarea|title)$/i;
/** TemplateResult types */
const HTML_RESULT = 1;
const SVG_RESULT = 2;
const MATHML_RESULT = 3;
// TemplatePart types
// IMPORTANT: these must match the values in PartType
const ATTRIBUTE_PART = 1;
const CHILD_PART = 2;
const PROPERTY_PART = 3;
const BOOLEAN_ATTRIBUTE_PART = 4;
const EVENT_PART = 5;
const ELEMENT_PART = 6;
const COMMENT_PART = 7;
/**
 * Generates a template literal tag function that returns a TemplateResult with
 * the given result type.
 */
const tag = (type) => (strings, ...values) => {
    // Warn against templates octal escape sequences
    // We do this here rather than in render so that the warning is closer to the
    // template definition.
    if (DEV_MODE && strings.some((s) => s === undefined)) {
        console.warn('Some template strings are undefined.\n' +
            'This is probably caused by illegal octal escape sequences.');
    }
    if (DEV_MODE) {
        // Import static-html.js results in a circular dependency which g3 doesn't
        // handle. Instead we know that static values must have the field
        // `_$litStatic$`.
        if (values.some((val) => val?.['_$litStatic$'])) {
            issueWarning('', `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.\n` +
                `Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);
        }
    }
    return {
        // This property needs to remain unminified.
        ['_$litType$']: type,
        strings,
        values,
    };
};
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 *
 * ```ts
 * const header = (title: string) => html`<h1>${title}</h1>`;
 * ```
 *
 * The `html` tag returns a description of the DOM to render as a value. It is
 * lazy, meaning no work is done until the template is rendered. When rendering,
 * if a template comes from the same expression as a previously rendered result,
 * it's efficiently updated instead of replaced.
 */
const html = tag(HTML_RESULT);
/**
 * Interprets a template literal as an SVG fragment that can efficiently render
 * to and update a container.
 *
 * ```ts
 * const rect = svg`<rect width="10" height="10"></rect>`;
 *
 * const myImage = html`
 *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
 *     ${rect}
 *   </svg>`;
 * ```
 *
 * The `svg` *tag function* should only be used for SVG fragments, or elements
 * that would be contained **inside** an `<svg>` HTML element. A common error is
 * placing an `<svg>` *element* in a template tagged with the `svg` tag
 * function. The `<svg>` element is an HTML element and should be used within a
 * template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an SVG fragment from the
 * `render()` method, as the SVG fragment will be contained within the element's
 * shadow root and thus not be properly contained within an `<svg>` HTML
 * element.
 */
const svg = tag(SVG_RESULT);
/**
 * Interprets a template literal as MathML fragment that can efficiently render
 * to and update a container.
 *
 * ```ts
 * const num = mathml`<mn>1</mn>`;
 *
 * const eq = html`
 *   <math>
 *     ${num}
 *   </math>`;
 * ```
 *
 * The `mathml` *tag function* should only be used for MathML fragments, or
 * elements that would be contained **inside** a `<math>` HTML element. A common
 * error is placing a `<math>` *element* in a template tagged with the `mathml`
 * tag function. The `<math>` element is an HTML element and should be used
 * within a template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an MathML fragment from the
 * `render()` method, as the MathML fragment will be contained within the
 * element's shadow root and thus not be properly contained within a `<math>`
 * HTML element.
 */
const mathml = tag(MATHML_RESULT);
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = Symbol.for('lit-noChange');
/**
 * A sentinel value that signals a ChildPart to fully clear its content.
 *
 * ```ts
 * const button = html`${
 *  user.isAdmin
 *    ? html`<button>DELETE</button>`
 *    : nothing
 * }`;
 * ```
 *
 * Prefer using `nothing` over other falsy values as it provides a consistent
 * behavior between various expression binding contexts.
 *
 * In child expressions, `undefined`, `null`, `''`, and `nothing` all behave the
 * same and render no nodes. In attribute expressions, `nothing` _removes_ the
 * attribute, while `undefined` and `null` will render an empty string. In
 * property expressions `nothing` becomes `undefined`.
 */
const nothing = Symbol.for('lit-nothing');
/**
 * The cache of prepared templates, keyed by the tagged TemplateStringsArray
 * and _not_ accounting for the specific template tag used. This means that
 * template tags cannot be dynamic - they must statically be one of html, svg,
 * or attr. This restriction simplifies the cache lookup, which is on the hot
 * path for rendering.
 */
const templateCache = new WeakMap();
const walker = d.createTreeWalker(d, 129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */);
let sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
    // A security check to prevent spoofing of Lit template results.
    // In the future, we may be able to replace this with Array.isTemplateObject,
    // though we might need to make that check inside of the html and svg
    // functions, because precompiled templates don't come in as
    // TemplateStringArray objects.
    if (!isArray(tsa) || !tsa.hasOwnProperty('raw')) {
        let message = 'invalid template strings array';
        if (DEV_MODE) {
            message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `
                .trim()
                .replace(/\n */g, '\n');
        }
        throw new Error(message);
    }
    return policy !== undefined
        ? policy.createHTML(stringFromTSA)
        : stringFromTSA;
}
/**
 * Returns an HTML string for the given TemplateStringsArray and result type
 * (HTML or SVG), along with the case-sensitive bound attribute names in
 * template order. The HTML contains comment markers denoting the `ChildPart`s
 * and suffixes on bound attributes denoting the `AttributeParts`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing `[html, attrNames]` (array returned for terseness,
 *     to avoid object fields since this code is shared with non-minified SSR
 *     code)
 */
const getTemplateHtml = (strings, type) => {
    // Insert makers into the template HTML to represent the position of
    // bindings. The following code scans the template strings to determine the
    // syntactic position of the bindings. They can be in text position, where
    // we insert an HTML comment, attribute value position, where we insert a
    // sentinel string and re-write the attribute name, or inside a tag where
    // we insert the sentinel string.
    const l = strings.length - 1;
    // Stores the case-sensitive bound attribute names in the order of their
    // parts. ElementParts are also reflected in this array as undefined
    // rather than a string, to disambiguate from attribute bindings.
    const attrNames = [];
    let html = type === SVG_RESULT ? '<svg>' : type === MATHML_RESULT ? '<math>' : '';
    // When we're inside a raw text tag (not it's text content), the regex
    // will still be tagRegex so we can find attributes, but will switch to
    // this regex when the tag ends.
    let rawTextEndRegex;
    // The current parsing state, represented as a reference to one of the
    // regexes
    let regex = textEndRegex;
    for (let i = 0; i < l; i++) {
        const s = strings[i];
        // The index of the end of the last attribute name. When this is
        // positive at end of a string, it means we're in an attribute value
        // position and need to rewrite the attribute name.
        // We also use a special value of -2 to indicate that we encountered
        // the end of a string in attribute name position.
        let attrNameEndIndex = -1;
        let attrName;
        let lastIndex = 0;
        let match;
        // The conditions in this loop handle the current parse state, and the
        // assignments to the `regex` variable are the state transitions.
        while (lastIndex < s.length) {
            // Make sure we start searching from where we previously left off
            regex.lastIndex = lastIndex;
            match = regex.exec(s);
            if (match === null) {
                break;
            }
            lastIndex = regex.lastIndex;
            if (regex === textEndRegex) {
                if (match[COMMENT_START] === '!--') {
                    regex = commentEndRegex;
                }
                else if (match[COMMENT_START] !== undefined) {
                    // We started a weird comment, like </{
                    regex = comment2EndRegex;
                }
                else if (match[TAG_NAME] !== undefined) {
                    if (rawTextElement.test(match[TAG_NAME])) {
                        // Record if we encounter a raw-text element. We'll switch to
                        // this regex at the end of the tag.
                        rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, 'g');
                    }
                    regex = tagEndRegex;
                }
                else if (match[DYNAMIC_TAG_NAME] !== undefined) {
                    if (DEV_MODE) {
                        throw new Error('Bindings in tag names are not supported. Please use static templates instead. ' +
                            'See https://lit.dev/docs/templates/expressions/#static-expressions');
                    }
                    regex = tagEndRegex;
                }
            }
            else if (regex === tagEndRegex) {
                if (match[ENTIRE_MATCH] === '>') {
                    // End of a tag. If we had started a raw-text element, use that
                    // regex
                    regex = rawTextEndRegex ?? textEndRegex;
                    // We may be ending an unquoted attribute value, so make sure we
                    // clear any pending attrNameEndIndex
                    attrNameEndIndex = -1;
                }
                else if (match[ATTRIBUTE_NAME] === undefined) {
                    // Attribute name position
                    attrNameEndIndex = -2;
                }
                else {
                    attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
                    attrName = match[ATTRIBUTE_NAME];
                    regex =
                        match[QUOTE_CHAR] === undefined
                            ? tagEndRegex
                            : match[QUOTE_CHAR] === '"'
                                ? doubleQuoteAttrEndRegex
                                : singleQuoteAttrEndRegex;
                }
            }
            else if (regex === doubleQuoteAttrEndRegex ||
                regex === singleQuoteAttrEndRegex) {
                regex = tagEndRegex;
            }
            else if (regex === commentEndRegex || regex === comment2EndRegex) {
                regex = textEndRegex;
            }
            else {
                // Not one of the five state regexes, so it must be the dynamically
                // created raw text regex and we're at the close of that element.
                regex = tagEndRegex;
                rawTextEndRegex = undefined;
            }
        }
        if (DEV_MODE) {
            // If we have a attrNameEndIndex, which indicates that we should
            // rewrite the attribute name, assert that we're in a valid attribute
            // position - either in a tag, or a quoted attribute value.
            console.assert(attrNameEndIndex === -1 ||
                regex === tagEndRegex ||
                regex === singleQuoteAttrEndRegex ||
                regex === doubleQuoteAttrEndRegex, 'unexpected parse state B');
        }
        // We have four cases:
        //  1. We're in text position, and not in a raw text element
        //     (regex === textEndRegex): insert a comment marker.
        //  2. We have a non-negative attrNameEndIndex which means we need to
        //     rewrite the attribute name to add a bound attribute suffix.
        //  3. We're at the non-first binding in a multi-binding attribute, use a
        //     plain marker.
        //  4. We're somewhere else inside the tag. If we're in attribute name
        //     position (attrNameEndIndex === -2), add a sequential suffix to
        //     generate a unique attribute name.
        // Detect a binding next to self-closing tag end and insert a space to
        // separate the marker from the tag end:
        const end = regex === tagEndRegex && strings[i + 1].startsWith('/>') ? ' ' : '';
        html +=
            regex === textEndRegex
                ? s + nodeMarker
                : attrNameEndIndex >= 0
                    ? (attrNames.push(attrName),
                        s.slice(0, attrNameEndIndex) +
                            boundAttributeSuffix +
                            s.slice(attrNameEndIndex)) +
                        marker +
                        end
                    : s + marker + (attrNameEndIndex === -2 ? i : end);
    }
    const htmlResult = html +
        (strings[l] || '<?>') +
        (type === SVG_RESULT ? '</svg>' : type === MATHML_RESULT ? '</math>' : '');
    // Returned as an array for terseness
    return [trustFromTemplateString(strings, htmlResult), attrNames];
};
class Template {
    constructor(
    // This property needs to remain unminified.
    { strings, ['_$litType$']: type }, options) {
        this.parts = [];
        let node;
        let nodeIndex = 0;
        let attrNameIndex = 0;
        const partCount = strings.length - 1;
        const parts = this.parts;
        // Create template element
        const [html, attrNames] = getTemplateHtml(strings, type);
        this.el = Template.createElement(html, options);
        walker.currentNode = this.el.content;
        // Re-parent SVG or MathML nodes into template root
        if (type === SVG_RESULT || type === MATHML_RESULT) {
            const wrapper = this.el.content.firstChild;
            wrapper.replaceWith(...wrapper.childNodes);
        }
        // Walk the template to find binding markers and create TemplateParts
        while ((node = walker.nextNode()) !== null && parts.length < partCount) {
            if (node.nodeType === 1) {
                if (DEV_MODE) {
                    const tag = node.localName;
                    // Warn if `textarea` includes an expression and throw if `template`
                    // does since these are not supported. We do this by checking
                    // innerHTML for anything that looks like a marker. This catches
                    // cases like bindings in textarea there markers turn into text nodes.
                    if (/^(?:textarea|template)$/i.test(tag) &&
                        node.innerHTML.includes(marker)) {
                        const m = `Expressions are not supported inside \`${tag}\` ` +
                            `elements. See https://lit.dev/msg/expression-in-${tag} for more ` +
                            `information.`;
                        if (tag === 'template') {
                            throw new Error(m);
                        }
                        else
                            issueWarning('', m);
                    }
                }
                // TODO (justinfagnani): for attempted dynamic tag names, we don't
                // increment the bindingIndex, and it'll be off by 1 in the element
                // and off by two after it.
                if (node.hasAttributes()) {
                    for (const name of node.getAttributeNames()) {
                        if (name.endsWith(boundAttributeSuffix)) {
                            const realName = attrNames[attrNameIndex++];
                            const value = node.getAttribute(name);
                            const statics = value.split(marker);
                            const m = /([.?@])?(.*)/.exec(realName);
                            parts.push({
                                type: ATTRIBUTE_PART,
                                index: nodeIndex,
                                name: m[2],
                                strings: statics,
                                ctor: m[1] === '.'
                                    ? PropertyPart
                                    : m[1] === '?'
                                        ? BooleanAttributePart
                                        : m[1] === '@'
                                            ? EventPart
                                            : AttributePart,
                            });
                            node.removeAttribute(name);
                        }
                        else if (name.startsWith(marker)) {
                            parts.push({
                                type: ELEMENT_PART,
                                index: nodeIndex,
                            });
                            node.removeAttribute(name);
                        }
                    }
                }
                // TODO (justinfagnani): benchmark the regex against testing for each
                // of the 3 raw text element names.
                if (rawTextElement.test(node.tagName)) {
                    // For raw text elements we need to split the text content on
                    // markers, create a Text node for each segment, and create
                    // a TemplatePart for each marker.
                    const strings = node.textContent.split(marker);
                    const lastIndex = strings.length - 1;
                    if (lastIndex > 0) {
                        node.textContent = trustedTypes
                            ? trustedTypes.emptyScript
                            : '';
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for child parts
                        for (let i = 0; i < lastIndex; i++) {
                            node.append(strings[i], createMarker());
                            // Walk past the marker node we just added
                            walker.nextNode();
                            parts.push({ type: CHILD_PART, index: ++nodeIndex });
                        }
                        // Note because this marker is added after the walker's current
                        // node, it will be walked to in the outer loop (and ignored), so
                        // we don't need to adjust nodeIndex here
                        node.append(strings[lastIndex], createMarker());
                    }
                }
            }
            else if (node.nodeType === 8) {
                const data = node.data;
                if (data === markerMatch) {
                    parts.push({ type: CHILD_PART, index: nodeIndex });
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        parts.push({ type: COMMENT_PART, index: nodeIndex });
                        // Move to the end of the match
                        i += marker.length - 1;
                    }
                }
            }
            nodeIndex++;
        }
        if (DEV_MODE) {
            // If there was a duplicate attribute on a tag, then when the tag is
            // parsed into an element the attribute gets de-duplicated. We can detect
            // this mismatch if we haven't precisely consumed every attribute name
            // when preparing the template. This works because `attrNames` is built
            // from the template string and `attrNameIndex` comes from processing the
            // resulting DOM.
            if (attrNames.length !== attrNameIndex) {
                throw new Error(`Detected duplicate attribute bindings. This occurs if your template ` +
                    `has duplicate attributes on an element tag. For example ` +
                    `"<input ?disabled=\${true} ?disabled=\${false}>" contains a ` +
                    `duplicate "disabled" attribute. The error was detected in ` +
                    `the following template: \n` +
                    '`' +
                    strings.join('${...}') +
                    '`');
            }
        }
        // We could set walker.currentNode to another node here to prevent a memory
        // leak, but every time we prepare a template, we immediately render it
        // and re-use the walker in new TemplateInstance._clone().
        debugLogEvent &&
            debugLogEvent({
                kind: 'template prep',
                template: this,
                clonableTemplate: this.el,
                parts: this.parts,
                strings,
            });
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @nocollapse */
    static createElement(html, _options) {
        const el = d.createElement('template');
        el.innerHTML = html;
        return el;
    }
}
function resolveDirective(part, value, parent = part, attributeIndex) {
    // Bail early if the value is explicitly noChange. Note, this means any
    // nested directive is still attached and is not run.
    if (value === noChange) {
        return value;
    }
    let currentDirective = attributeIndex !== undefined
        ? parent.__directives?.[attributeIndex]
        : parent.__directive;
    const nextDirectiveConstructor = isPrimitive(value)
        ? undefined
        : // This property needs to remain unminified.
            value['_$litDirective$'];
    if (currentDirective?.constructor !== nextDirectiveConstructor) {
        // This property needs to remain unminified.
        currentDirective?.['_$notifyDirectiveConnectionChanged']?.(false);
        if (nextDirectiveConstructor === undefined) {
            currentDirective = undefined;
        }
        else {
            currentDirective = new nextDirectiveConstructor(part);
            currentDirective._$initialize(part, parent, attributeIndex);
        }
        if (attributeIndex !== undefined) {
            (parent.__directives ??= [])[attributeIndex] =
                currentDirective;
        }
        else {
            parent.__directive = currentDirective;
        }
    }
    if (currentDirective !== undefined) {
        value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
    }
    return value;
}
/**
 * An updateable instance of a Template. Holds references to the Parts used to
 * update the template instance.
 */
class TemplateInstance {
    constructor(template, parent) {
        this._$parts = [];
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$template = template;
        this._$parent = parent;
    }
    // Called by ChildPart parentNode getter
    get parentNode() {
        return this._$parent.parentNode;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    // This method is separate from the constructor because we need to return a
    // DocumentFragment and we don't want to hold onto it with an instance field.
    _clone(options) {
        const { el: { content }, parts: parts, } = this._$template;
        const fragment = (options?.creationScope ?? d).importNode(content, true);
        walker.currentNode = fragment;
        let node = walker.nextNode();
        let nodeIndex = 0;
        let partIndex = 0;
        let templatePart = parts[0];
        while (templatePart !== undefined) {
            if (nodeIndex === templatePart.index) {
                let part;
                if (templatePart.type === CHILD_PART) {
                    part = new ChildPart(node, node.nextSibling, this, options);
                }
                else if (templatePart.type === ATTRIBUTE_PART) {
                    part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
                }
                else if (templatePart.type === ELEMENT_PART) {
                    part = new ElementPart(node, this, options);
                }
                this._$parts.push(part);
                templatePart = parts[++partIndex];
            }
            if (nodeIndex !== templatePart?.index) {
                node = walker.nextNode();
                nodeIndex++;
            }
        }
        // We need to set the currentNode away from the cloned tree so that we
        // don't hold onto the tree even if the tree is detached and should be
        // freed.
        walker.currentNode = d;
        return fragment;
    }
    _update(values) {
        let i = 0;
        for (const part of this._$parts) {
            if (part !== undefined) {
                debugLogEvent &&
                    debugLogEvent({
                        kind: 'set part',
                        part,
                        value: values[i],
                        valueIndex: i,
                        values,
                        templateInstance: this,
                    });
                if (part.strings !== undefined) {
                    part._$setValue(values, part, i);
                    // The number of values the part consumes is part.strings.length - 1
                    // since values are in between template spans. We increment i by 1
                    // later in the loop, so increment it by part.strings.length - 2 here
                    i += part.strings.length - 2;
                }
                else {
                    part._$setValue(values[i]);
                }
            }
            i++;
        }
    }
}
class ChildPart {
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        // ChildParts that are not at the root should always be created with a
        // parent; only RootChildNode's won't, so they return the local isConnected
        // state
        return this._$parent?._$isConnected ?? this.__isConnected;
    }
    constructor(startNode, endNode, parent, options) {
        this.type = CHILD_PART;
        this._$committedValue = nothing;
        // The following fields will be patched onto ChildParts when required by
        // AsyncDirective
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$startNode = startNode;
        this._$endNode = endNode;
        this._$parent = parent;
        this.options = options;
        // Note __isConnected is only ever accessed on RootParts (i.e. when there is
        // no _$parent); the value on a non-root-part is "don't care", but checking
        // for parent would be more code
        this.__isConnected = options?.isConnected ?? true;
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            // Explicitly initialize for consistent class shape.
            this._textSanitizer = undefined;
        }
    }
    /**
     * The parent node into which the part renders its content.
     *
     * A ChildPart's content consists of a range of adjacent child nodes of
     * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
     * `.endNode`).
     *
     * - If both `.startNode` and `.endNode` are non-null, then the part's content
     * consists of all siblings between `.startNode` and `.endNode`, exclusively.
     *
     * - If `.startNode` is non-null but `.endNode` is null, then the part's
     * content consists of all siblings following `.startNode`, up to and
     * including the last child of `.parentNode`. If `.endNode` is non-null, then
     * `.startNode` will always be non-null.
     *
     * - If both `.endNode` and `.startNode` are null, then the part's content
     * consists of all child nodes of `.parentNode`.
     */
    get parentNode() {
        let parentNode = wrap(this._$startNode).parentNode;
        const parent = this._$parent;
        if (parent !== undefined &&
            parentNode?.nodeType === 11 /* Node.DOCUMENT_FRAGMENT */) {
            // If the parentNode is a DocumentFragment, it may be because the DOM is
            // still in the cloned fragment during initial render; if so, get the real
            // parentNode the part will be committed into by asking the parent.
            parentNode = parent.parentNode;
        }
        return parentNode;
    }
    /**
     * The part's leading marker node, if any. See `.parentNode` for more
     * information.
     */
    get startNode() {
        return this._$startNode;
    }
    /**
     * The part's trailing marker node, if any. See `.parentNode` for more
     * information.
     */
    get endNode() {
        return this._$endNode;
    }
    _$setValue(value, directiveParent = this) {
        if (DEV_MODE && this.parentNode === null) {
            throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
        }
        value = resolveDirective(this, value, directiveParent);
        if (isPrimitive(value)) {
            // Non-rendering child values. It's important that these do not render
            // empty text nodes to avoid issues with preventing default <slot>
            // fallback content.
            if (value === nothing || value == null || value === '') {
                if (this._$committedValue !== nothing) {
                    debugLogEvent &&
                        debugLogEvent({
                            kind: 'commit nothing to child',
                            start: this._$startNode,
                            end: this._$endNode,
                            parent: this._$parent,
                            options: this.options,
                        });
                    this._$clear();
                }
                this._$committedValue = nothing;
            }
            else if (value !== this._$committedValue && value !== noChange) {
                this._commitText(value);
            }
            // This property needs to remain unminified.
        }
        else if (value['_$litType$'] !== undefined) {
            this._commitTemplateResult(value);
        }
        else if (value.nodeType !== undefined) {
            if (DEV_MODE && this.options?.host === value) {
                this._commitText(`[probable mistake: rendered a template's host in itself ` +
                    `(commonly caused by writing \${this} in a template]`);
                console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
                return;
            }
            this._commitNode(value);
        }
        else if (isIterable(value)) {
            this._commitIterable(value);
        }
        else {
            // Fallback, will render the string representation
            this._commitText(value);
        }
    }
    _insert(node) {
        return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
    }
    _commitNode(value) {
        if (this._$committedValue !== value) {
            this._$clear();
            if (ENABLE_EXTRA_SECURITY_HOOKS &&
                sanitizerFactoryInternal !== noopSanitizer) {
                const parentNodeName = this._$startNode.parentNode?.nodeName;
                if (parentNodeName === 'STYLE' || parentNodeName === 'SCRIPT') {
                    let message = 'Forbidden';
                    if (DEV_MODE) {
                        if (parentNodeName === 'STYLE') {
                            message =
                                `Lit does not support binding inside style nodes. ` +
                                    `This is a security risk, as style injection attacks can ` +
                                    `exfiltrate data and spoof UIs. ` +
                                    `Consider instead using css\`...\` literals ` +
                                    `to compose styles, and do dynamic styling with ` +
                                    `css custom properties, ::parts, <slot>s, ` +
                                    `and by mutating the DOM rather than stylesheets.`;
                        }
                        else {
                            message =
                                `Lit does not support binding inside script nodes. ` +
                                    `This is a security risk, as it could allow arbitrary ` +
                                    `code execution.`;
                        }
                    }
                    throw new Error(message);
                }
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: 'commit node',
                    start: this._$startNode,
                    parent: this._$parent,
                    value: value,
                    options: this.options,
                });
            this._$committedValue = this._insert(value);
        }
    }
    _commitText(value) {
        // If the committed value is a primitive it means we called _commitText on
        // the previous render, and we know that this._$startNode.nextSibling is a
        // Text node. We can now just replace the text content (.data) of the node.
        if (this._$committedValue !== nothing &&
            isPrimitive(this._$committedValue)) {
            const node = wrap(this._$startNode).nextSibling;
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(node, 'data', 'property');
                }
                value = this._textSanitizer(value);
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: 'commit text',
                    node,
                    value,
                    options: this.options,
                });
            node.data = value;
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                const textNode = d.createTextNode('');
                this._commitNode(textNode);
                // When setting text content, for security purposes it matters a lot
                // what the parent is. For example, <style> and <script> need to be
                // handled with care, while <span> does not. So first we need to put a
                // text node into the document, then we can sanitize its content.
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(textNode, 'data', 'property');
                }
                value = this._textSanitizer(value);
                debugLogEvent &&
                    debugLogEvent({
                        kind: 'commit text',
                        node: textNode,
                        value,
                        options: this.options,
                    });
                textNode.data = value;
            }
            else {
                this._commitNode(d.createTextNode(value));
                debugLogEvent &&
                    debugLogEvent({
                        kind: 'commit text',
                        node: wrap(this._$startNode).nextSibling,
                        value,
                        options: this.options,
                    });
            }
        }
        this._$committedValue = value;
    }
    _commitTemplateResult(result) {
        // This property needs to remain unminified.
        const { values, ['_$litType$']: type } = result;
        // If $litType$ is a number, result is a plain TemplateResult and we get
        // the template from the template cache. If not, result is a
        // CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
        // to create the <template> element the first time we see it.
        const template = typeof type === 'number'
            ? this._$getTemplate(result)
            : (type.el === undefined &&
                (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)),
                type);
        if (this._$committedValue?._$template === template) {
            debugLogEvent &&
                debugLogEvent({
                    kind: 'template updating',
                    template,
                    instance: this._$committedValue,
                    parts: this._$committedValue._$parts,
                    options: this.options,
                    values,
                });
            this._$committedValue._update(values);
        }
        else {
            const instance = new TemplateInstance(template, this);
            const fragment = instance._clone(this.options);
            debugLogEvent &&
                debugLogEvent({
                    kind: 'template instantiated',
                    template,
                    instance,
                    parts: instance._$parts,
                    options: this.options,
                    fragment,
                    values,
                });
            instance._update(values);
            debugLogEvent &&
                debugLogEvent({
                    kind: 'template instantiated and updated',
                    template,
                    instance,
                    parts: instance._$parts,
                    options: this.options,
                    fragment,
                    values,
                });
            this._commitNode(fragment);
            this._$committedValue = instance;
        }
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @internal */
    _$getTemplate(result) {
        let template = templateCache.get(result.strings);
        if (template === undefined) {
            templateCache.set(result.strings, (template = new Template(result)));
        }
        return template;
    }
    _commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If value is an array, then the previous render was of an
        // iterable and value will contain the ChildParts from the previous
        // render. If value is not an array, clear this part and make a new
        // array for ChildParts.
        if (!isArray(this._$committedValue)) {
            this._$committedValue = [];
            this._$clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._$committedValue;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            if (partIndex === itemParts.length) {
                // If no existing part, create a new one
                // TODO (justinfagnani): test perf impact of always creating two parts
                // instead of sharing parts between nodes
                // https://github.com/lit/lit/issues/1266
                itemParts.push((itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options)));
            }
            else {
                // Reuse an existing part
                itemPart = itemParts[partIndex];
            }
            itemPart._$setValue(item);
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // itemParts always have end nodes
            this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
        }
    }
    /**
     * Removes the nodes contained within this Part from the DOM.
     *
     * @param start Start node to clear from, for clearing a subset of the part's
     *     DOM (used when truncating iterables)
     * @param from  When `start` is specified, the index within the iterable from
     *     which ChildParts are being removed, used for disconnecting directives
     *     in those Parts.
     *
     * @internal
     */
    _$clear(start = wrap(this._$startNode).nextSibling, from) {
        this._$notifyConnectionChanged?.(false, true, from);
        while (start !== this._$endNode) {
            // The non-null assertion is safe because if _$startNode.nextSibling is
            // null, then _$endNode is also null, and we would not have entered this
            // loop.
            const n = wrap(start).nextSibling;
            wrap(start).remove();
            start = n;
        }
    }
    /**
     * Implementation of RootPart's `isConnected`. Note that this method
     * should only be called on `RootPart`s (the `ChildPart` returned from a
     * top-level `render()` call). It has no effect on non-root ChildParts.
     * @param isConnected Whether to set
     * @internal
     */
    setConnected(isConnected) {
        if (this._$parent === undefined) {
            this.__isConnected = isConnected;
            this._$notifyConnectionChanged?.(isConnected);
        }
        else if (DEV_MODE) {
            throw new Error('part.setConnected() may only be called on a ' +
                'RootPart returned from render().');
        }
    }
}
class AttributePart {
    get tagName() {
        return this.element.tagName;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    constructor(element, name, strings, parent, options) {
        this.type = ATTRIBUTE_PART;
        /** @internal */
        this._$committedValue = nothing;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this.element = element;
        this.name = name;
        this._$parent = parent;
        this.options = options;
        if (strings.length > 2 || strings[0] !== '' || strings[1] !== '') {
            this._$committedValue = new Array(strings.length - 1).fill(new String());
            this.strings = strings;
        }
        else {
            this._$committedValue = nothing;
        }
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            this._sanitizer = undefined;
        }
    }
    /**
     * Sets the value of this part by resolving the value from possibly multiple
     * values and static strings and committing it to the DOM.
     * If this part is single-valued, `this._strings` will be undefined, and the
     * method will be called with a single value argument. If this part is
     * multi-value, `this._strings` will be defined, and the method is called
     * with the value array of the part's owning TemplateInstance, and an offset
     * into the value array from which the values should be read.
     * This method is overloaded this way to eliminate short-lived array slices
     * of the template instance values, and allow a fast-path for single-valued
     * parts.
     *
     * @param value The part value, or an array of values for multi-valued parts
     * @param valueIndex the index to start reading values from. `undefined` for
     *   single-valued parts
     * @param noCommit causes the part to not commit its value to the DOM. Used
     *   in hydration to prime attribute parts with their first-rendered value,
     *   but not set the attribute, and in SSR to no-op the DOM operation and
     *   capture the value for serialization.
     *
     * @internal
     */
    _$setValue(value, directiveParent = this, valueIndex, noCommit) {
        const strings = this.strings;
        // Whether any of the values has changed, for dirty-checking
        let change = false;
        if (strings === undefined) {
            // Single-value binding case
            value = resolveDirective(this, value, directiveParent, 0);
            change =
                !isPrimitive(value) ||
                    (value !== this._$committedValue && value !== noChange);
            if (change) {
                this._$committedValue = value;
            }
        }
        else {
            // Interpolation case
            const values = value;
            value = strings[0];
            let i, v;
            for (i = 0; i < strings.length - 1; i++) {
                v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
                if (v === noChange) {
                    // If the user-provided value is `noChange`, use the previous value
                    v = this._$committedValue[i];
                }
                change ||=
                    !isPrimitive(v) || v !== this._$committedValue[i];
                if (v === nothing) {
                    value = nothing;
                }
                else if (value !== nothing) {
                    value += (v ?? '') + strings[i + 1];
                }
                // We always record each value, even if one is `nothing`, for future
                // change detection.
                this._$committedValue[i] = v;
            }
        }
        if (change && !noCommit) {
            this._commitValue(value);
        }
    }
    /** @internal */
    _commitValue(value) {
        if (value === nothing) {
            wrap(this.element).removeAttribute(this.name);
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._sanitizer === undefined) {
                    this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'attribute');
                }
                value = this._sanitizer(value ?? '');
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: 'commit attribute',
                    element: this.element,
                    name: this.name,
                    value,
                    options: this.options,
                });
            wrap(this.element).setAttribute(this.name, (value ?? ''));
        }
    }
}
class PropertyPart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = PROPERTY_PART;
    }
    /** @internal */
    _commitValue(value) {
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            if (this._sanitizer === undefined) {
                this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'property');
            }
            value = this._sanitizer(value);
        }
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit property',
                element: this.element,
                name: this.name,
                value,
                options: this.options,
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.element[this.name] = value === nothing ? undefined : value;
    }
}
class BooleanAttributePart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = BOOLEAN_ATTRIBUTE_PART;
    }
    /** @internal */
    _commitValue(value) {
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit boolean attribute',
                element: this.element,
                name: this.name,
                value: !!(value && value !== nothing),
                options: this.options,
            });
        wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
    }
}
class EventPart extends AttributePart {
    constructor(element, name, strings, parent, options) {
        super(element, name, strings, parent, options);
        this.type = EVENT_PART;
        if (DEV_MODE && this.strings !== undefined) {
            throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with ` +
                'invalid content. Event listeners in templates must have exactly ' +
                'one expression and no surrounding text.');
        }
    }
    // EventPart does not use the base _$setValue/_resolveValue implementation
    // since the dirty checking is more complex
    /** @internal */
    _$setValue(newListener, directiveParent = this) {
        newListener =
            resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
        if (newListener === noChange) {
            return;
        }
        const oldListener = this._$committedValue;
        // If the new value is nothing or any options change we have to remove the
        // part as a listener.
        const shouldRemoveListener = (newListener === nothing && oldListener !== nothing) ||
            newListener.capture !==
                oldListener.capture ||
            newListener.once !==
                oldListener.once ||
            newListener.passive !==
                oldListener.passive;
        // If the new value is not nothing and we removed the listener, we have
        // to add the part as a listener.
        const shouldAddListener = newListener !== nothing &&
            (oldListener === nothing || shouldRemoveListener);
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit event listener',
                element: this.element,
                name: this.name,
                value: newListener,
                options: this.options,
                removeListener: shouldRemoveListener,
                addListener: shouldAddListener,
                oldListener,
            });
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.name, this, oldListener);
        }
        if (shouldAddListener) {
            this.element.addEventListener(this.name, this, newListener);
        }
        this._$committedValue = newListener;
    }
    handleEvent(event) {
        if (typeof this._$committedValue === 'function') {
            this._$committedValue.call(this.options?.host ?? this.element, event);
        }
        else {
            this._$committedValue.handleEvent(event);
        }
    }
}
class ElementPart {
    constructor(element, parent, options) {
        this.element = element;
        this.type = ELEMENT_PART;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$parent = parent;
        this.options = options;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    _$setValue(value) {
        debugLogEvent &&
            debugLogEvent({
                kind: 'commit to element binding',
                element: this.element,
                value,
                options: this.options,
            });
        resolveDirective(this, value);
    }
}
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports mangled in the
 * client side code, we export a _$LH object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-element, which re-exports all of lit-html.
 *
 * @private
 */
const _$LH = {
    // Used in lit-ssr
    _boundAttributeSuffix: boundAttributeSuffix,
    _marker: marker,
    _markerMatch: markerMatch,
    _HTML_RESULT: HTML_RESULT,
    _getTemplateHtml: getTemplateHtml,
    // Used in tests and private-ssr-support
    _TemplateInstance: TemplateInstance,
    _isIterable: isIterable,
    _resolveDirective: resolveDirective,
    _ChildPart: ChildPart,
    _AttributePart: AttributePart,
    _BooleanAttributePart: BooleanAttributePart,
    _EventPart: EventPart,
    _PropertyPart: PropertyPart,
    _ElementPart: ElementPart,
};
// Apply polyfills if available
const polyfillSupport = DEV_MODE
    ? global.litHtmlPolyfillSupportDevMode
    : global.litHtmlPolyfillSupport;
polyfillSupport?.(Template, ChildPart);
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
(global.litHtmlVersions ??= []).push('3.3.1');
if (DEV_MODE && global.litHtmlVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning('multiple-versions', `Multiple versions of Lit loaded. ` +
            `Loading multiple versions is not recommended.`);
    });
}
/**
 * Renders a value, usually a lit-html TemplateResult, to the container.
 *
 * This example renders the text "Hello, Zoe!" inside a paragraph tag, appending
 * it to the container `document.body`.
 *
 * ```js
 * import {html, render} from 'lit';
 *
 * const name = "Zoe";
 * render(html`<p>Hello, ${name}!</p>`, document.body);
 * ```
 *
 * @param value Any [renderable
 *   value](https://lit.dev/docs/templates/expressions/#child-expressions),
 *   typically a {@linkcode TemplateResult} created by evaluating a template tag
 *   like {@linkcode html} or {@linkcode svg}.
 * @param container A DOM container to render to. The first render will append
 *   the rendered value to the container, and subsequent renders will
 *   efficiently update the rendered value if the same result type was
 *   previously rendered there.
 * @param options See {@linkcode RenderOptions} for options documentation.
 * @see
 * {@link https://lit.dev/docs/libraries/standalone-templates/#rendering-lit-html-templates| Rendering Lit HTML Templates}
 */
const render = (value, container, options) => {
    if (DEV_MODE && container == null) {
        // Give a clearer error message than
        //     Uncaught TypeError: Cannot read properties of null (reading
        //     '_$litPart$')
        // which reads like an internal Lit error.
        throw new TypeError(`The container to render into may not be ${container}`);
    }
    const renderId = DEV_MODE ? debugLogRenderId++ : 0;
    const partOwnerNode = options?.renderBefore ?? container;
    // This property needs to remain unminified.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let part = partOwnerNode['_$litPart$'];
    debugLogEvent &&
        debugLogEvent({
            kind: 'begin render',
            id: renderId,
            value,
            container,
            options,
            part,
        });
    if (part === undefined) {
        const endNode = options?.renderBefore ?? null;
        // This property needs to remain unminified.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        partOwnerNode['_$litPart$'] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, undefined, options ?? {});
    }
    part._$setValue(value);
    debugLogEvent &&
        debugLogEvent({
            kind: 'end render',
            id: renderId,
            value,
            container,
            options,
            part,
        });
    return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
    render.setSanitizer = setSanitizer;
    render.createSanitizer = createSanitizer;
    if (DEV_MODE) {
        render._testOnlyClearSanitizerFactoryDoNotCallOrElse =
            _testOnlyClearSanitizerFactoryDoNotCallOrElse;
    }
}
//# sourceMappingURL=lit-html.js.map

/***/ }),

/***/ "./node_modules/lit/decorators.js":
/*!****************************************!*\
  !*** ./node_modules/lit/decorators.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customElement: () => (/* reexport safe */ _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__.customElement),
/* harmony export */   eventOptions: () => (/* reexport safe */ _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__.eventOptions),
/* harmony export */   property: () => (/* reexport safe */ _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__.property),
/* harmony export */   query: () => (/* reexport safe */ _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__.query),
/* harmony export */   queryAll: () => (/* reexport safe */ _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__.queryAll),
/* harmony export */   queryAssignedElements: () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_7__.queryAssignedElements),
/* harmony export */   queryAssignedNodes: () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_8__.queryAssignedNodes),
/* harmony export */   queryAsync: () => (/* reexport safe */ _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__.queryAsync),
/* harmony export */   standardProperty: () => (/* reexport safe */ _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__.standardProperty),
/* harmony export */   state: () => (/* reexport safe */ _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__.state)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element/decorators/custom-element.js */ "./node_modules/@lit/reactive-element/development/decorators/custom-element.js");
/* harmony import */ var _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lit/reactive-element/decorators/property.js */ "./node_modules/@lit/reactive-element/development/decorators/property.js");
/* harmony import */ var _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lit/reactive-element/decorators/state.js */ "./node_modules/@lit/reactive-element/development/decorators/state.js");
/* harmony import */ var _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lit/reactive-element/decorators/event-options.js */ "./node_modules/@lit/reactive-element/development/decorators/event-options.js");
/* harmony import */ var _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lit/reactive-element/decorators/query.js */ "./node_modules/@lit/reactive-element/development/decorators/query.js");
/* harmony import */ var _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-all.js */ "./node_modules/@lit/reactive-element/development/decorators/query-all.js");
/* harmony import */ var _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-async.js */ "./node_modules/@lit/reactive-element/development/decorators/query-async.js");
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-assigned-elements.js */ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js");
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-assigned-nodes.js */ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js");

//# sourceMappingURL=decorators.js.map


/***/ }),

/***/ "./node_modules/lit/index.js":
/*!***********************************!*\
  !*** ./node_modules/lit/index.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.CSSResult),
/* harmony export */   LitElement: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.LitElement),
/* harmony export */   ReactiveElement: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.ReactiveElement),
/* harmony export */   _$LE: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LE),
/* harmony export */   _$LH: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LH),
/* harmony export */   adoptStyles: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.css),
/* harmony export */   defaultConverter: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.getCompatibleStyle),
/* harmony export */   html: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.html),
/* harmony export */   isServer: () => (/* reexport safe */ lit_html_is_server_js__WEBPACK_IMPORTED_MODULE_3__.isServer),
/* harmony export */   mathml: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.mathml),
/* harmony export */   noChange: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.noChange),
/* harmony export */   notEqual: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.notEqual),
/* harmony export */   nothing: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.nothing),
/* harmony export */   render: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.render),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.supportsAdoptingStyleSheets),
/* harmony export */   svg: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.svg),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
/* harmony import */ var lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lit-element/lit-element.js */ "./node_modules/lit-element/development/lit-element.js");
/* harmony import */ var lit_html_is_server_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lit-html/is-server.js */ "./node_modules/lit-html/development/is-server.js");

//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./src/astro-controller.ts":
/*!*********************************!*\
  !*** ./src/astro-controller.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AstroController: () => (/* binding */ AstroController)
/* harmony export */ });
/* harmony import */ var _bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bus */ "./src/bus.ts");
// src/astro-controller.ts

class AstroController {
    constructor(api) {
        this.api = api;
    }
    mount() {
        // Commands
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.on('astro.goto', ({ ra, dec, fov }) => this.api.goto(ra, dec, fov));
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.on('astro.toggle.healpix', ({ on }) => this.api.toggleHealpixGrid(on));
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.on('astro.toggle.equatorial', ({ on }) => this.api.toggleEquatorialGrid(on));
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.on('astro.set.fov', ({ fov }) => this.api.setFoV(fov));
        // Queries
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.on('astro.get.state:req', ({ cid }) => {
            const state = this.api.getState();
            _bus__WEBPACK_IMPORTED_MODULE_0__.bus.emit('astro.get.state:res', { cid, state });
        });
        // Broadcast
        this.api.onStateChanged?.((state) => _bus__WEBPACK_IMPORTED_MODULE_0__.bus.emit('astro.state.changed', { state }));
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.emit('astro.ready', { version: this.api.version ?? '0.0.0' });
    }
}


/***/ }),

/***/ "./src/astroviewer-adapter.ts":
/*!************************************!*\
  !*** ./src/astroviewer-adapter.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AstroViewerAdapter: () => (/* binding */ AstroViewerAdapter)
/* harmony export */ });
/* harmony import */ var astroviewer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! astroviewer */ "../astro-viewer/lib-esm/AstroViewer.js");

class AstroViewerAdapter {
    constructor() {
        this._initialised = false;
    }
    init() {
        if (this._initialised)
            return;
        (async () => {
            try {
                // TODO add canvas id to the constructor of AstroViewer();
                this.viewer = new astroviewer__WEBPACK_IMPORTED_MODULE_0__.AstroViewer();
                const baseUrl = this.viewer.getDefaultHiPSURL();
                const hipsUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
                this.viewer.loadHiPS(hipsUrl);
                this.viewer.run();
                this._initialised = true;
            }
            catch (e) {
                console.error('AstroViewer boot failed:', e);
            }
        })();
    }
    goto(ra, dec, fov) {
        this.viewer?.goTo(ra, dec);
    }
    toggleHealpixGrid(on) {
        this.viewer?.toggleHealpixGrid();
    }
    toggleEquatorialGrid(on) {
        this.viewer?.toggleEquatorialGrid();
    }
    setFoV(fov) {
        throw new Error('Method not implemented.');
    }
    getState() {
        throw new Error('Method not implemented.');
    }
}


/***/ }),

/***/ "./src/bus.ts":
/*!********************!*\
  !*** ./src/bus.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bus: () => (/* binding */ bus),
/* harmony export */   cid: () => (/* binding */ cid)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/events.ts");
class TypedBus {
    constructor() {
        this.handlers = new Map();
    }
    on(type, fn) {
        if (!this.handlers.has(type))
            this.handlers.set(type, new Set());
        this.handlers.get(type).add(fn);
        return () => this.off(type, fn);
    }
    off(type, fn) {
        this.handlers.get(type)?.delete(fn);
    }
    emit(type, payload) {
        this.handlers.get(type)?.forEach(fn => fn(payload));
    }
}
const bus = new TypedBus();
const cid = () => Math.random().toString(36).slice(2);
// Ri-esporta i tipi così altrove puoi importare da 'bus'



/***/ }),

/***/ "./src/components/panels/astro-panel-draggable.ts":
/*!********************************************************!*\
  !*** ./src/components/panels/astro-panel-draggable.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DraggablePanel: () => (/* binding */ DraggablePanel)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "./node_modules/lit/decorators.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DraggablePanel_1;


/**
 * <astro-draggable-panel>
 * A draggable, resizable panel built with Lit.
 *
 * Features
 * - Drag by header (default) or any selector set via `dragHandle` prop
 * - Resize from the bottom-right handle (CSS class `.resize-handle`)
 * - Keep inside parent container with `contain` (default true)
 * - Works with any slotted content (including other web components)
 * - Emits `move`, `resize`, and `interactionend` CustomEvents
 * - Reflects x/y/width/height as attributes for persistence
 * - Keyboard support: Arrow keys move; Shift+Arrows resize
 *
 * Usage
 * <astro-draggable-panel x="120" y="80" width="360" height="240">
 *   <h3 slot="title">My Widget</h3>
 *   <my-web-component></my-web-component>
 * </astro-draggable-panel>
 */
let DraggablePanel = class DraggablePanel extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super(...arguments);
        /** Left position in pixels */
        this.x = 80;
        /** Top position in pixels */
        this.y = 80;
        /** Width in pixels */
        this.width = 360;
        /** Height in pixels */
        this.height = 240;
        /** Minimum size constraints */
        this.minWidth = 200;
        this.minHeight = 120;
        /** If true, dragging is enabled */
        this.draggable = true;
        /** If true, resizing is enabled */
        this.resizable = true;
        /** Keep the panel inside its offsetParent */
        this.contain = true;
        /** Optional CSS selector for a custom drag handle inside the shadow root */
        this.dragHandle = null;
        /** Snap movement/resize to N pixels (0 = no snap) */
        this.snap = 0;
        this._dragging = false;
        this._resizing = false;
        this._start = { x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0 };
        this._onHeaderPointerDown = (ev) => {
            if (!this.draggable)
                return;
            // If a custom handle is provided, only start when event originated from it
            if (this.dragHandle) {
                const handle = this.renderRoot.querySelector(this.dragHandle);
                if (handle && !handle.contains(ev.composedPath()[0]))
                    return;
            }
            this._beginInteraction(ev, /*isResize*/ false);
        };
        this._onResizePointerDown = (ev) => {
            if (!this.resizable)
                return;
            this._beginInteraction(ev, /*isResize*/ true);
        };
        this._onPointerMove = (ev) => {
            if (!this._dragging && !this._resizing)
                return;
            ev.preventDefault();
            const dx = ev.clientX - this._start.cx;
            const dy = ev.clientY - this._start.cy;
            if (this._dragging) {
                let nx = this._start.x + dx;
                let ny = this._start.y + dy;
                ({ x: nx, y: ny } = this._applySnap(nx, ny));
                if (this.contain)
                    ({ x: nx, y: ny } = this._containPosition(nx, ny));
                this.x = nx;
                this.y = ny;
                this._emit('move', { x: this.x, y: this.y });
            }
            if (this._resizing) {
                let nw = this._start.w + dx;
                let nh = this._start.h + dy;
                ({ w: nw, h: nh } = this._applySnapSize(nw, nh));
                ({ w: nw, h: nh } = this._applyMin(nw, nh));
                if (this.contain)
                    ({ w: nw, h: nh } = this._containSize(nw, nh));
                this.width = nw;
                this.height = nh;
                this._emit('resize', { width: this.width, height: this.height });
            }
        };
        this._onPointerUp = (_ev) => {
            if (!this._dragging && !this._resizing)
                return;
            this._dragging = false;
            this._resizing = false;
            delete this.dataset.active;
            this._emit('interactionend', { x: this.x, y: this.y, width: this.width, height: this.height });
        };
        this._onKeyDown = (ev) => {
            const step = ev.shiftKey ? 10 : 1;
            const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(ev.key);
            if (!isArrow)
                return;
            ev.preventDefault();
            if (!ev.shiftKey) {
                // Move
                let nx = this.x + (ev.key === 'ArrowRight' ? step : ev.key === 'ArrowLeft' ? -step : 0);
                let ny = this.y + (ev.key === 'ArrowDown' ? step : ev.key === 'ArrowUp' ? -step : 0);
                if (this.snap)
                    ({ x: nx, y: ny } = this._applySnap(nx, ny));
                if (this.contain)
                    ({ x: nx, y: ny } = this._containPosition(nx, ny));
                this.x = nx;
                this.y = ny;
                this._emit('move', { x: this.x, y: this.y });
            }
            else {
                // Resize
                let nw = this.width + (ev.key === 'ArrowRight' ? step : ev.key === 'ArrowLeft' ? -step : 0);
                let nh = this.height + (ev.key === 'ArrowDown' ? step : ev.key === 'ArrowUp' ? -step : 0);
                if (this.snap)
                    ({ w: nw, h: nh } = this._applySnapSize(nw, nh));
                ({ w: nw, h: nh } = this._applyMin(nw, nh));
                if (this.contain)
                    ({ w: nw, h: nh } = this._containSize(nw, nh));
                this.width = nw;
                this.height = nh;
                this._emit('resize', { width: this.width, height: this.height });
            }
        };
    }
    static { DraggablePanel_1 = this; }
    static { this._z = 10; } // simple z-index stacker
    static { this.styles = (0,lit__WEBPACK_IMPORTED_MODULE_0__.css) `
    :host {
      position: absolute;
      box-sizing: border-box;
      /* Position via inline style (left/top) set in updated() */
      width: var(--panel-w, 360px);
      height: var(--panel-h, 240px);
      border: 1px solid rgba(0,0,0,.1);
      border-radius: 12px;
      background: var(--panel-bg, #fff);
      box-shadow: 0 10px 25px rgba(0,0,0,.1);
      overflow: hidden;
      user-select: none;
      touch-action: none;
    }
    .wrap { display: grid; grid-template-rows: auto 1fr; height: 100%; }

    header {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .5rem .75rem;
      background: var(--panel-header-bg, #f7f7f7);
      border-bottom: 1px solid rgba(0,0,0,.06);
      cursor: move;
      -webkit-app-region: drag; /* harmless outside Electron */
      font: 600 13px/1.2 system-ui, sans-serif;
    }
    header ::slotted(*) { font: inherit; }

    main {
      display: block;
      height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding: .75rem;
      user-select: text; /* allow text selection in content */
    }

    .resize-handle {
      position: absolute;
      right: 2px;
      bottom: 2px;
      width: 16px;
      height: 16px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 0 40%, rgba(0,0,0,.15) 40% 60%, transparent 60% 100%);
      border-radius: 4px;
      opacity: .6;
      pointer-events: auto;
    }

    :host([data-active]) { box-shadow: 0 12px 30px rgba(0,0,0,.16); }
  `; }
    connectedCallback() {
        super.connectedCallback();
        // Global listeners to preserve drag on pointer leaving the element
        window.addEventListener('pointermove', this._onPointerMove, { passive: false });
        window.addEventListener('pointerup', this._onPointerUp, { passive: true });
        this.tabIndex = 0; // enable keyboard focus
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('pointerup', this._onPointerUp);
    }
    firstUpdated() {
        this.style.left = `${this.x}px`;
        this.style.top = `${this.y}px`;
        this.style.setProperty('--panel-w', `${this.width}px`);
        this.style.setProperty('--panel-h', `${this.height}px`);
        this.style.zIndex = String(DraggablePanel_1._z++);
    }
    updated(changed) {
        if (changed.has('x'))
            this.style.left = `${this.x}px`;
        if (changed.has('y'))
            this.style.top = `${this.y}px`;
        if (changed.has('width'))
            this.style.setProperty('--panel-w', `${this.width}px`);
        if (changed.has('height'))
            this.style.setProperty('--panel-h', `${this.height}px`);
    }
    render() {
        const headerTemplate = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `
      <header
        @pointerdown=${this._onHeaderPointerDown}
        part="header"
        data-role="drag"
        style=${this.draggable ? '' : 'cursor:default; -webkit-app-region:no-drag;'}
      >
        <slot name="title">Panel</slot>
      </header>`;
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `
      <div class="wrap" part="container" @keydown=${this._onKeyDown}>
        ${headerTemplate}
        <main part="content">
          <slot></slot>
        </main>
        ${this.resizable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `<div class="resize-handle" part="resize" @pointerdown=${this._onResizePointerDown}></div>` : null}
      </div>
    `;
    }
    _beginInteraction(ev, isResize) {
        ev.preventDefault();
        ev.currentTarget.setPointerCapture?.(ev.pointerId);
        this._dragging = !isResize;
        this._resizing = isResize;
        const rect = this.getBoundingClientRect();
        this._start = {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height,
            cx: ev.clientX,
            cy: ev.clientY,
        };
        this.dataset.active = '';
        this.style.zIndex = String(DraggablePanel_1._z++);
    }
    _applyMin(w, h) {
        return { w: Math.max(w, this.minWidth), h: Math.max(h, this.minHeight) };
    }
    _applySnap(x, y) {
        if (!this.snap)
            return { x, y };
        return {
            x: Math.round(x / this.snap) * this.snap,
            y: Math.round(y / this.snap) * this.snap,
        };
    }
    _applySnapSize(w, h) {
        if (!this.snap)
            return { w, h };
        return {
            w: Math.round(w / this.snap) * this.snap,
            h: Math.round(h / this.snap) * this.snap,
        };
    }
    /** Clamp position to keep the panel inside its offsetParent */
    _containPosition(x, y) {
        const parent = this.offsetParent;
        if (!parent)
            return { x, y };
        const parentRect = parent.getBoundingClientRect();
        const selfRect = this.getBoundingClientRect();
        const maxX = Math.max(0, parentRect.width - selfRect.width);
        const maxY = Math.max(0, parentRect.height - selfRect.height);
        return { x: clamp(x, 0, maxX), y: clamp(y, 0, maxY) };
    }
    /** Clamp size so right/bottom edges stay within parent */
    _containSize(w, h) {
        const parent = this.offsetParent;
        if (!parent)
            return { w, h };
        const parentRect = parent.getBoundingClientRect();
        const maxW = Math.max(this.minWidth, parentRect.width - this.x);
        const maxH = Math.max(this.minHeight, parentRect.height - this.y);
        return { w: clamp(w, this.minWidth, maxW), h: clamp(h, this.minHeight, maxH) };
    }
    _emit(type, detail) {
        this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
    }
};
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number, reflect: true })
], DraggablePanel.prototype, "x", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number, reflect: true })
], DraggablePanel.prototype, "y", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number, reflect: true })
], DraggablePanel.prototype, "width", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number, reflect: true })
], DraggablePanel.prototype, "height", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], DraggablePanel.prototype, "minWidth", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], DraggablePanel.prototype, "minHeight", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], DraggablePanel.prototype, "draggable", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], DraggablePanel.prototype, "resizable", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], DraggablePanel.prototype, "contain", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], DraggablePanel.prototype, "dragHandle", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], DraggablePanel.prototype, "snap", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], DraggablePanel.prototype, "_dragging", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], DraggablePanel.prototype, "_resizing", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], DraggablePanel.prototype, "_start", void 0);
DraggablePanel = DraggablePanel_1 = __decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.customElement)('astro-draggable-panel')
], DraggablePanel);

function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }


/***/ }),

/***/ "./src/components/panels/astro-panel-goto.ts":
/*!***************************************************!*\
  !*** ./src/components/panels/astro-panel-goto.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AstroPanelGoto: () => (/* binding */ AstroPanelGoto)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "./node_modules/lit/decorators.js");
/* harmony import */ var _bus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../bus */ "./src/bus.ts");
// =========================
// FILE: src/components/panels/astro-panel-goto.ts
// Example panel issuing a request/response query via correlation id
// =========================
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let AstroPanelGoto = class AstroPanelGoto extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super(...arguments);
        this.ra = 0;
        this.dec = 0;
        this.fov = 5;
        this.info = '';
    }
    static { this.styles = (0,lit__WEBPACK_IMPORTED_MODULE_0__.css) `:host{
  // display:block;
  position: absolute;
  left: 10px;
  top: 40px;
  background: aqua;
  padding:8px}`; }
    queryState() {
        const correlation = (0,_bus__WEBPACK_IMPORTED_MODULE_2__.cid)();
        const off = _bus__WEBPACK_IMPORTED_MODULE_2__.bus.on('astro.get.state:res', ({ cid, state }) => {
            if (cid !== correlation)
                return; // ignore other responses
            this.info = `Current RA=${state.ra.toFixed(2)} DEC=${state.dec.toFixed(2)} FOV=${state.fov.toFixed(2)}`;
            off(); // unsubscribe once we've handled OUR response
        });
        _bus__WEBPACK_IMPORTED_MODULE_2__.bus.emit('astro.get.state:req', { cid: correlation });
        // off() would be called automatically because of once()
    }
    render() {
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `
      <div style="display:flex;gap:6px;align-items:center">
        <input type="number" step="0.01" .value=${String(this.ra)} @input=${(e) => this.ra = parseFloat(e.target.value)} placeholder="RA°">
        <input type="number" step="0.01" .value=${String(this.dec)} @input=${(e) => this.dec = parseFloat(e.target.value)} placeholder="DEC°">
        <input type="number" step="0.1" .value=${String(this.fov)} @input=${(e) => this.fov = parseFloat(e.target.value)} placeholder="FOV°">
        <button @click=${() => _bus__WEBPACK_IMPORTED_MODULE_2__.bus.emit('astro.goto', { ra: this.ra, dec: this.dec, fov: this.fov })}>GoTo</button>
        <button @click=${() => this.queryState()}>Read State</button>
      </div>
      <div>${this.info}</div>
    `;
    }
};
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], AstroPanelGoto.prototype, "ra", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], AstroPanelGoto.prototype, "dec", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], AstroPanelGoto.prototype, "fov", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], AstroPanelGoto.prototype, "info", void 0);
AstroPanelGoto = __decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.customElement)('astro-panel-goto')
], AstroPanelGoto);



/***/ }),

/***/ "./src/components/panels/astro-panel-grid.ts":
/*!***************************************************!*\
  !*** ./src/components/panels/astro-panel-grid.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AstroPanelGrid: () => (/* binding */ AstroPanelGrid)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "./node_modules/lit/decorators.js");
/* harmony import */ var _bus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../bus */ "./src/bus.ts");
// =========================
// FILE: src/components/panels/astro-panel-grid.ts
// Example third-party-ready panel using the bus only
// =========================
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let AstroPanelGrid = class AstroPanelGrid extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super(...arguments);
        this.healpix = false;
        this.equatorial = false;
    }
    static { this.styles = (0,lit__WEBPACK_IMPORTED_MODULE_0__.css) `:host{
  // display:block;
  padding:8px;
  position: absolute;
  top: 10px;
  background: aqua;
  }`; }
    connectedCallback() {
        super.connectedCallback();
        // Optionally listen to state changes to reflect UI
        this._off = _bus__WEBPACK_IMPORTED_MODULE_2__.bus.on('astro.state.changed', ({ state }) => {
            // sync UI if needed based on state
        });
    }
    disconnectedCallback() { this._off?.(); super.disconnectedCallback(); }
    render() {
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html) `
      <label><input type="checkbox" .checked=${this.healpix} @change=${(e) => { this.healpix = e.target.checked; _bus__WEBPACK_IMPORTED_MODULE_2__.bus.emit('astro.toggle.healpix', { on: this.healpix }); }}> Healpix grid</label>
      <label><input type="checkbox" .checked=${this.equatorial} @change=${(e) => { this.equatorial = e.target.checked; _bus__WEBPACK_IMPORTED_MODULE_2__.bus.emit('astro.toggle.equatorial', { on: this.equatorial }); }}> Equatorial grid</label>
    `;
    }
};
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], AstroPanelGrid.prototype, "healpix", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.state)()
], AstroPanelGrid.prototype, "equatorial", void 0);
AstroPanelGrid = __decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.customElement)('astro-panel-grid')
], AstroPanelGrid);



/***/ }),

/***/ "./src/events.ts":
/*!***********************!*\
  !*** ./src/events.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// =========================
// FILE: src/events.ts
// Central type-safe event map for PubSub between panels and AstroViewer
// =========================



/***/ }),

/***/ "./src/ui/UIPanelManager.ts":
/*!**********************************!*\
  !*** ./src/ui/UIPanelManager.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UIPanelManager: () => (/* binding */ UIPanelManager)
/* harmony export */ });
/* harmony import */ var _bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../bus */ "./src/bus.ts");
/* harmony import */ var _components_panels_astro_panel_draggable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/panels/astro-panel-draggable */ "./src/components/panels/astro-panel-draggable.ts");
/* harmony import */ var _components_panels_astro_panel_grid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/panels/astro-panel-grid */ "./src/components/panels/astro-panel-grid.ts");
/* harmony import */ var _components_panels_astro_panel_goto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/panels/astro-panel-goto */ "./src/components/panels/astro-panel-goto.ts");
// src/ui/UIPanelManager.ts

// Assicurati che questi component siano importati/registrati da qualche parte



// ...eventuali altri pannelli
class UIPanelManager {
    constructor(container) {
        this.container = container;
        this.panels = new Map();
        this.zid = 10;
    }
    mount() {
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.on('ui:openPanel', ({ tab }) => this.open(tab));
        _bus__WEBPACK_IMPORTED_MODULE_0__.bus.on('ui:closePanel', ({ id }) => this.close(id));
    }
    nextZ() { return ++this.zid; }
    idFor(tab) { return `panel-${tab}-${Date.now()}`; }
    open(tab) {
        const id = this.idFor(tab);
        const panel = document.createElement('astro-panel-draggable');
        // z-index base
        panel.style.zIndex = String(this.nextZ());
        // Titolo + contenuto per tab
        const title = {
            explore: 'Explore',
            analysis: 'Analysis',
            metadata: 'Metadata',
            settings: 'Settings'
        }[tab];
        // Se il tuo astro-panel-draggable espone slot 'title' e contenuto default:
        panel.innerHTML = `
      <h3 slot="title" style="margin:0;font:600 13px system-ui">${title}</h3>
      ${this.contentForTab(tab)}
    `;
        // opzionale: ascolta interactionend per persistenza futura
        panel.addEventListener('interactionend', (e) => {
            // const { x, y, width, height } = e.detail;
            // TODO: salva su localStorage se vuoi
        });
        panel.addEventListener('mousedown', () => {
            // porta avanti quando cliccato
            panel.style.zIndex = String(this.nextZ());
        });
        this.container.appendChild(panel);
        this.panels.set(id, panel);
    }
    close(id) {
        const p = this.panels.get(id);
        if (p?.parentElement)
            p.parentElement.removeChild(p);
        this.panels.delete(id);
    }
    contentForTab(tab) {
        switch (tab) {
            case 'explore':
                // esempio: pannello con la tua griglia e, volendo, pannello goto
                return `
          <astro-panel-grid></astro-panel-grid>
          <astro-panel-goto></astro-panel-goto>
        `;
            case 'analysis':
                return `<div>Analysis tools here…</div>`;
            case 'metadata':
                return `<div>Metadata panel…</div>`;
            case 'settings':
                return `<div>Settings panel…</div>`;
        }
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _astro_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./astro-controller */ "./src/astro-controller.ts");
/* harmony import */ var _astroviewer_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./astroviewer-adapter */ "./src/astroviewer-adapter.ts");
/* harmony import */ var _ui_UIPanelManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/UIPanelManager */ "./src/ui/UIPanelManager.ts");
/* harmony import */ var _bus__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./bus */ "./src/bus.ts");
// src/app.ts

 // suppongo esporti un adapter IAstroViewerAPI


function main() {
    // 1) Inizializza AstroViewer + Controller
    const api = new _astroviewer_adapter__WEBPACK_IMPORTED_MODULE_1__.AstroViewerAdapter(); // adatta a come lo istanzi
    api.init();
    const controller = new _astro_controller__WEBPACK_IMPORTED_MODULE_0__.AstroController(api);
    controller.mount();
    // 2) UI: area di lavoro + manager pannelli
    const workarea = document.getElementById('workarea')
        ?? document.body; // fallback se non hai un div dedicato
    const ui = new _ui_UIPanelManager__WEBPACK_IMPORTED_MODULE_2__.UIPanelManager(workarea);
    ui.mount();
    // 3) (opzionale) pannello iniziale
    _bus__WEBPACK_IMPORTED_MODULE_3__.bus.emit('ui:openPanel', { tab: 'explore' });
}
main();

})();

/******/ })()
;
//# sourceMappingURL=main.df7b477522504519bbd6.js.map