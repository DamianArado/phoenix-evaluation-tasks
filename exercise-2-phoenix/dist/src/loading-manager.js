"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingManager = void 0;
class LoadingManager {
    constructor() {
        this.toLoad = [];
        this.loaded = [];
        this.onLoadCallbacks = [];
        this.onProgressCallbacks = [];
        this.progressItems = {};
        if (LoadingManager.instance === undefined) {
            LoadingManager.instance = this;
        }
        return LoadingManager.instance;
    }
    addLoadableItem(id = '') {
        this.toLoad.push(id);
        this.progressItems[id] = 0;
    }
    itemLoaded(id = '') {
        this.loaded.push(id);
        this.onProgress(id, 100);
        if (this.toLoad.length === this.loaded.length &&
            this.toLoad.sort().join(',') === this.loaded.sort().join(',')) {
            this.onLoadCallbacks.forEach((callback) => callback());
            this.reset();
        }
    }
    onProgress(id, progress) {
        this.progressItems[id] = progress;
        const totalProgress = Object.values(this.progressItems).reduce((acc, val) => acc + val, 0);
        const totalItems = Object.keys(this.progressItems).length;
        const averageProgress = totalProgress / totalItems;
        for (const callback of this.onProgressCallbacks) {
            callback(averageProgress);
        }
    }
    addLoadListener(callback) {
        this.onLoadCallbacks.push(callback);
    }
    addLoadListenerWithCheck(callback) {
        if (this.toLoad.length > 0 && this.toLoad.length !== this.loaded.length) {
            this.onLoadCallbacks.push(callback);
        }
        else {
            callback();
        }
    }
    addProgressListener(callback) {
        this.onProgressCallbacks.push(callback);
    }
    reset() {
        this.toLoad = [];
        this.loaded = [];
        this.onLoadCallbacks = [];
        this.onProgressCallbacks = [];
        this.progressItems = {};
    }
}
exports.LoadingManager = LoadingManager;
//# sourceMappingURL=loading-manager.js.map