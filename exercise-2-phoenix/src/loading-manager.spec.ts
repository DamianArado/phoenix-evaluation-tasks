import { LoadingManager } from "./loading-manager";

// Tests: Progress and Loading of loadable items
describe('LoadingManager', () => {
    let loadingManager: LoadingManager;    

    beforeEach(() => {
        loadingManager = new LoadingManager();
    });

    it('should be created', () => {
        expect(loadingManager).toBeTruthy();
    });

    describe("LoadingManager: Tests for Progress of loadable items", () => {
        let progress1: number = 10;
        let id1: string = 'item';
        let progress2: number = 20;
        let id2: string = 'item2';
    
        it('should have onProgress method', () => {
            expect(loadingManager.onProgress).toBeDefined();
        });
    
        it('should have addProgressListener method', () => {
            expect(loadingManager.addProgressListener).toBeDefined();
        });
    
        it('should be called when the loading of an item progresses', () => {
            let callback: (progress: number) => void = jasmine.createSpy('callback');
    
            loadingManager.addProgressListener(callback);
            loadingManager.onProgress(id1, progress1);
    
            expect(callback).toHaveBeenCalledWith(progress1);
        });
    
        describe('for average progress', () => {
    
            it('check for total progress', () => {
                (loadingManager as any).progressItems[id1] = progress1;
                (loadingManager as any).progressItems[id2] = progress2;
    
                const totalItems = Object.keys((loadingManager as any).progressItems).length;
                const totalProgress = progress1 + progress2;
                const averageProgress = totalProgress / totalItems;
    
                expect(averageProgress).toBe(15);
            });
        });
    
        it('should add a callback to listen when the progress of an item increases', () => {
            (loadingManager as any).onProgressCallbacks = [];
            const callback = () => {};
            loadingManager.addProgressListener(callback);
            expect((loadingManager as any).onProgressCallbacks.length).toBe(1);
    
            const callback2 = () => {};
            loadingManager.addProgressListener(callback2);
            expect((loadingManager as any).onProgressCallbacks.length).toBe(2);
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

        /*
        TODO: Fix this test

        it('should be called when all items have loaded', () => {
            let callback: () => void = jasmine.createSpy('callback');
            loadingManager.addLoadListener(callback);
            loadingManager.itemLoaded('test');
            expect(callback).toHaveBeenCalled();
        });*/
    });

    it('it should reset the loading manager and its items', () => {
        loadingManager.reset();
        expect(loadingManager.toLoad.length).toBe(0);
        expect(loadingManager.loaded.length).toBe(0);
    });
});