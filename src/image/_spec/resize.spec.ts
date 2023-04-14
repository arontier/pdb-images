import fs from 'fs';
import { RawImageData } from 'molstar/lib/commonjs/mol-plugin/util/headless-screenshot';

import { loadPngToRaw, resizeRawImage, saveRawToPng } from '../resize';


// These sample images can be found in test_data/sample_images/ as PNGs

const IMG_10x8: RawImageData = {
    width: 10,
    height: 8,
    data: new Uint8ClampedArray([ // each line is one row of the image, pixels are separated by /**/
        10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255,
        10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255,
        0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200,
        0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200,
        20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150,
        20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150,
    ]),
};

const IMG_10x4: RawImageData = {
    width: 10,
    height: 4,
    data: new Uint8ClampedArray([ // each line is one row of the image, pixels are separated by /**/
        10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255,
        0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200,
        20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150,
    ]),
};

const IMG_5x8: RawImageData = {
    width: 5,
    height: 8,
    data: new Uint8ClampedArray([ // each line is one row of the image, pixels are separated by /**/
        10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255,
        10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255,
        0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200,
        0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200,
        20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150,
        20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150,
    ]),
};

const IMG_5x4: RawImageData = {
    width: 5,
    height: 4,
    data: new Uint8ClampedArray([ // each line is one row of the image, pixels are separated by /**/ (each pixel is 4 numbers: R, G, B, alpha)
        10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255,
        0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200,
        20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150,
    ]),
};

const IMG_4x3: RawImageData = {
    width: 4,
    height: 3,
    data: new Uint8ClampedArray([ // each line is one row of the image, pixels are separated by /**/
        6, 0, 68, 255, /**/ 26, 86, 26, 255, /**/ 44, 148, 14, 255, /**/ 24, 20, 4, 255,
        0, 8, 0, 228, /**/ 71, 20, 14, 228, /**/ 122, 35, 17, 228, /**/ 17, 21, 1, 228,
        12, 10, 171, 162, /**/ 10, 0, 57, 162, /**/ 18, 0, 3, 162, /**/ 26, 26, 0, 162,
    ]),
};

const IMG_20x16: RawImageData = {
    width: 20,
    height: 16,
    data: new Uint8ClampedArray([ // each line is one row of the image, pixels are separated by /**/
        10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255,
        10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255,
        10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255,
        10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 10, 0, 100, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 0, 50, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 255, 0, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 0, 120, 20, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255, /**/ 30, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255,
        0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 255, 100, 40, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 120, 50, 10, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255, /**/ 0, 0, 0, 255,
        0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200,
        0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200,
        0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200,
        0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 20, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 0, 0, 0, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 100, 0, 30, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 50, 0, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200, /**/ 0, 40, 0, 200,
        20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150,
        20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150,
        20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150,
        20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 20, 10, 255, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 120, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 0, 0, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150, /**/ 40, 30, 0, 150,
    ]),
};


describe('resize', () => {
    it('loadPngToRaw', async () => {
        const loadedImage = await loadPngToRaw('./test_data/sample_images/sample_image_10x8.png');
        expect(loadedImage).toEqual(IMG_10x8);
    });

    it('saveRawToPng', async () => {
        const FILENAME = './test_data/image_10x8.png';
        fs.rmSync(FILENAME, { force: true });
        expect(fs.existsSync(FILENAME)).toBeFalsy();

        await saveRawToPng(IMG_10x8, FILENAME);
        expect(fs.existsSync(FILENAME)).toBeTruthy();

        const loadedImage = await loadPngToRaw('./test_data/image_10x8.png');
        expect(loadedImage).toEqual(IMG_10x8);
    });

    it('resizeRawImage - keep size', () => {
        expect(resizeRawImage(IMG_10x8, { width: 10, height: 8 })).toEqual(IMG_10x8);
    });

    it('resizeRawImage - upsample 2x', () => {
        expect(resizeRawImage(IMG_10x8, { width: 20, height: 16 })).toEqual(IMG_20x16);
    });

    it('resizeRawImage - downsample 2x, without averaging', () => {
        // pixels in the original image are grouped in 2x2 squares which will be merged into one pixel with the same color
        expect(resizeRawImage(IMG_10x8, { width: 5, height: 4 })).toEqual(IMG_5x4);
    });

    it('resizeRawImage - downsample 2x only vertically, without averaging', () => {
        // pixels in the original image are grouped in 2x2 squares which will be merged into two pixels with the same color
        expect(resizeRawImage(IMG_10x8, { width: 10, height: 4 })).toEqual(IMG_10x4);
    });

    it('resizeRawImage - downsample 2x only horizontally, without averaging', () => {
        // pixels in the original image are grouped in 2x2 squares which will be merged into two pixels with the same color
        expect(resizeRawImage(IMG_10x8, { width: 5, height: 8 })).toEqual(IMG_5x8);
    });

    it('resizeRawImage - downsample, with averaging', () => {
        expect(resizeRawImage(IMG_10x8, { width: 4, height: 3 })).toEqual(IMG_4x3);
    });
});
