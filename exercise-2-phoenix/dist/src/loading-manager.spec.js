"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loading_manager_1 = require("./loading-manager");
describe('LoadingManager', () => {
    let loadingManager;
    beforeEach(() => {
        loadingManager = new loading_manager_1.LoadingManager();
    });
    it('should be created', () => {
        expect(loadingManager).toBeTruthy();
    });
    describe("LoadingManager: Tests for Progress of loadable items", () => {
        let progress1 = 10;
        let id1 = 'item';
        let progress2 = 20;
        let id2 = 'item2';
        it('should have onProgress method', () => {
            expect(loadingManager.onProgress).toBeDefined();
        });
        it('should have addProgressListener method', () => {
            expect(loadingManager.addProgressListener).toBeDefined();
        });
        it('should be called when the loading of an item progresses', () => {
            let callback = jasmine.createSpy('callback');
            loadingManager.addProgressListener(callback);
            loadingManager.onProgress(id1, progress1);
            expect(callback).toHaveBeenCalledWith(progress1);
        });
        describe('for average progress', () => {
            it('check for total progress', () => {
                loadingManager.progressItems[id1] = progress1;
                loadingManager.progressItems[id2] = progress2;
                const totalItems = Object.keys(loadingManager.progressItems).length;
                const totalProgress = progress1 + progress2;
                const averageProgress = totalProgress / totalItems;
                expect(averageProgress).toBe(15);
            });
        });
        it('should add a callback to listen when the progress of an item increases', () => {
            loadingManager.onProgressCallbacks = [];
            const callback = () => { };
            loadingManager.addProgressListener(callback);
            expect(loadingManager.onProgressCallbacks.length).toBe(1);
            const callback2 = () => { };
            loadingManager.addProgressListener(callback2);
            expect(loadingManager.onProgressCallbacks.length).toBe(2);
        });
    });
    describe("LoadingManager: Tests for Loading of loadable items", () => {
        it('it should have a toload array for items to load', () => {
            expect(loadingManager.toLoad).toBeDefined();
        });
        it('it should have a loaded array for items that are loaded', () => {
            expect(loadingManager.loaded).toBeDefined();
        });
        it('should have addLoadListener method', () => {
            expect(loadingManager.addLoadListener).toBeDefined();
        });
    });
    it('it should reset the loading manager and its items', () => {
        loadingManager.reset();
        expect(loadingManager.toLoad.length).toBe(0);
        expect(loadingManager.loaded.length).toBe(0);
    });
});
//# sourceMappingURL=loading-manager.spec.js.map