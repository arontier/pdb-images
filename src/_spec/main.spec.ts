/**
 * Copyright (c) 2023 EMBL - European Bioinformatics Institute, licensed under Apache 2.0, see LICENSE file for more info.
 *
 * @author Adam Midlik <midlik@gmail.com>
 */

import { ArgumentParser } from 'argparse';
import fs from 'fs';
import path from 'path';

import { loadPngToRaw } from '../image/resize';
import { Args, main, makeSaveFunction, parseArguments } from '../main';
import { getTestingHeadlessPlugin, isBorderBlank, isImageBlank } from './_utils';


const TEST_TIMEOUT = 600_000; // ms

const EXPECTED_FILENAMES_1AD5 = [
    '1ad5_deposited_chain',
    '1ad5_deposited_chemically_distinct_molecules',
    '1ad5_assembly_1_chain',
    '1ad5_assembly_1_chemically_distinct_molecules',
    '1ad5_assembly_2_chain',
    '1ad5_assembly_2_chemically_distinct_molecules',
    '1ad5_entity_1',
    '1ad5_entity_2',
    '1ad5_entity_3',
    '1ad5_1_A_CATH_1.10.510.10',
    '1ad5_1_A_CATH_2.30.30.40',
    '1ad5_1_A_CATH_3.30.200.20',
    '1ad5_1_A_CATH_3.30.505.10',
    '1ad5_1_A_Pfam_PF00017',
    '1ad5_1_A_Pfam_PF00018',
    '1ad5_1_A_Pfam_PF07714',
    '1ad5_1_A_SCOP_50045',
    '1ad5_1_A_SCOP_55551',
    '1ad5_1_A_SCOP_88854',
    '1ad5_ligand_ANP',
    '1ad5_ligand_CA',
    '1ad5_modres_PTR',
    '1ad5_bfactor',
    '1ad5_validation_geometry_deposited',
].sort();

const EXPECTED_FILENAMES_AF_Q8Q3K0 = [
    'AF-Q8W3K0-F1-model_v4_plddt_front',
    'AF-Q8W3K0-F1-model_v4_plddt_side',
    'AF-Q8W3K0-F1-model_v4_plddt_top',
].sort();


describe('isImageBlank', () => {
    it('check isImageBlank works', async () => {
        expect(isImageBlank(await loadPngToRaw('./test_data/sample_images/white.png'))).toBeTruthy();
        expect(isImageBlank(await loadPngToRaw('./test_data/sample_images/axes_front.png'))).toBeFalsy();
        expect(isBorderBlank(await loadPngToRaw('./test_data/sample_images/white.png'))).toBeTruthy();
        expect(isBorderBlank(await loadPngToRaw('./test_data/sample_images/axes_front.png'))).toBeTruthy();
    }, TEST_TIMEOUT);
});


describe('makeSaveFunction', () => {
    it('makeSaveFunction', async () => {
        const OUTPUT_DIR = './test_data/outputs/empty';
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        expect(fs.existsSync(OUTPUT_DIR)).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(0);

        const plugin = await getTestingHeadlessPlugin();
        try {
            const saveFunction = makeSaveFunction(plugin, OUTPUT_DIR, { size: [{ width: 200, height: 200 }, { width: 100, height: 100 }], render_each_size: false, no_axes: false }, 'https://nope.nope');
            await saveFunction({ filename: 'example_empty', description: 'Description', clean_description: 'Clean description', alt: 'Alt', _entry_id: 'empty', _view: 'front', _section: [] });
        } finally {
            plugin.dispose();
        }
        expect(fs.readdirSync(OUTPUT_DIR).sort()).toEqual([
            'example_empty.caption.json',
            'example_empty.molj',
            'example_empty_image-100x100.png',
            'example_empty_image-200x200.png',
        ]);

        // Check no generated images are blank, or overflowing through border
        const imageFull = await loadPngToRaw(path.join(OUTPUT_DIR, 'example_empty_image-200x200.png'));
        expect(isImageBlank(imageFull)).toBeFalsy();
        expect(isBorderBlank(imageFull)).toBeTruthy();

        const imageDownscaled = await loadPngToRaw(path.join(OUTPUT_DIR, 'example_empty_image-100x100.png'));
        expect(isImageBlank(imageDownscaled)).toBeFalsy();
        expect(isBorderBlank(imageDownscaled)).toBeTruthy();
    });
});


describe('args', () => {
    it('fail without args', () => {
        const oldExit = ArgumentParser.prototype.exit;
        const oldArgv = process.argv;
        try {
            ArgumentParser.prototype.exit = () => { console.error('ArgumentParser exiting'); throw Error('Exit'); };
            process.argv = 'node index.js'.split(' ');
            expect(() => parseArguments()).toThrow();
        } finally {
            ArgumentParser.prototype.exit = oldExit;
            process.argv = oldArgv;
        }
    });

    it('parse args, use defaults', () => {
        const oldExit = ArgumentParser.prototype.exit;
        const oldArgv = process.argv;
        try {
            ArgumentParser.prototype.exit = () => { console.error('ArgumentParser exiting'); throw Error('Exit'); };
            process.argv = 'node index.js 1ad5 /data/1ad5'.split(' ');
            const expectedArgs: Args = {
                entry_id: '1ad5',
                output_dir: '/data/1ad5',
                input: undefined,
                mode: 'pdb',
                api_url: 'https://www.ebi.ac.uk/pdbe/api',
                no_api: false,
                size: [{ width: 800, height: 800 }],
                view: 'auto',
                render_each_size: false,
                type: ['all'],
                opaque_background: false,
                no_axes: false,
                date: undefined,
                clear: false,
                log: 'info',
            };
            expect(parseArguments()).toEqual(expectedArgs);
        } finally {
            ArgumentParser.prototype.exit = oldExit;
            process.argv = oldArgv;
        }
    });

    it('parse args, all given', () => {
        const oldExit = ArgumentParser.prototype.exit;
        const oldArgv = process.argv;
        try {
            ArgumentParser.prototype.exit = () => { console.error('ArgumentParser exiting'); throw Error('Exit'); };
            let cmd = 'node index.js 1ad5 /data/1ad5 --input http://smelly_cat.cif --mode alphafold';
            cmd += ' --api_url https://smelly_api.com --no_api --size 500x500 300x200 --view front --render_each_size';
            cmd += ' --type entry assembly plddt --opaque_background --no_axes --date 2023/04/20 --clear --log debug';
            process.argv = cmd.split(/\s+/);
            const expectedArgs: Args = {
                entry_id: '1ad5',
                output_dir: '/data/1ad5',
                input: 'http://smelly_cat.cif',
                mode: 'alphafold',
                api_url: 'https://smelly_api.com',
                no_api: true,
                size: [{ width: 500, height: 500 }, { width: 300, height: 200 }],
                view: 'front',
                render_each_size: true,
                type: ['entry', 'assembly', 'plddt'],
                opaque_background: true,
                no_axes: true,
                date: '2023/04/20',
                clear: true,
                log: 'debug',
            };
            expect(parseArguments()).toEqual(expectedArgs);
        } finally {
            ArgumentParser.prototype.exit = oldExit;
            process.argv = oldArgv;
        }
    });
});


describe('main', () => {
    it('1ad5', async () => {
        const OUTPUT_DIR = './test_data/outputs/1ad5';
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();

        const args: Args = {
            entry_id: '1ad5',
            output_dir: OUTPUT_DIR,
            input: 'file://./test_data/structures/1ad5.bcif',
            mode: 'pdb',
            api_url: 'file://./test_data/api',
            no_api: false,
            size: [{ width: 200, height: 200 }, { width: 100, height: 100 }],
            view: 'front',
            render_each_size: false,
            type: ['all'],
            opaque_background: true,
            no_axes: false,
            date: undefined,
            clear: true,
            log: 'debug',
        };
        await main(args);

        let expectedFiles = ['1ad5.json', '1ad5_filelist'];
        for (const filename of EXPECTED_FILENAMES_1AD5) {
            expectedFiles.push(filename + '.caption.json', filename + '.molj', filename + '_image-100x100.png', filename + '_image-200x200.png');
        }
        expectedFiles = Array.from(new Set(expectedFiles)).sort();

        // Check all files were created
        expect(fs.existsSync(OUTPUT_DIR)).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR).sort()).toEqual(expectedFiles);

        // Check *_filelist and *.json are OK
        const filelistContent = fs.readFileSync(path.join(OUTPUT_DIR, '1ad5_filelist'), { encoding: 'utf8' }).trim();
        expect(filelistContent).toEqual(EXPECTED_FILENAMES_1AD5.slice().sort().join('\n'));

        const jsonContent = fs.readFileSync(path.join(OUTPUT_DIR, '1ad5.json'), { encoding: 'utf8' });
        for (const filename of EXPECTED_FILENAMES_1AD5) {
            expect(jsonContent).toContain(`"${filename}"`);
        }

        // Check generated images are not blank, or overflowing through border
        for (const file of expectedFiles) {
            if (file.endsWith('.png')) {
                const image = await loadPngToRaw(path.join(OUTPUT_DIR, file));
                expect(isImageBlank(image)).toBeFalsy();
                expect(isBorderBlank(image)).toBeTruthy();
            }
        }
    }, TEST_TIMEOUT);

    it('AF-Q8W3K0-F1-model_v4', async () => {
        const OUTPUT_DIR = './test_data/outputs/AF-Q8W3K0-F1-model_v4';
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();

        const args: Args = {
            entry_id: 'AF-Q8W3K0-F1-model_v4',
            output_dir: OUTPUT_DIR,
            input: 'file://./test_data/structures/AF-Q8W3K0-F1-model_v4.cif',
            mode: 'alphafold',
            api_url: 'file://./test_data/api',
            no_api: false,
            size: [{ width: 200, height: 200 }, { width: 100, height: 100 }],
            view: 'all',
            render_each_size: false,
            type: ['all'],
            opaque_background: true,
            no_axes: false,
            date: undefined,
            clear: true,
            log: 'debug',
        };
        await main(args);

        let expectedFiles = ['AF-Q8W3K0-F1-model_v4.json', 'AF-Q8W3K0-F1-model_v4_filelist'];
        for (const filename of EXPECTED_FILENAMES_AF_Q8Q3K0) {
            expectedFiles.push(filename + '.caption.json', filename + '.molj', filename + '_image-100x100.png', filename + '_image-200x200.png');
        }
        expectedFiles = Array.from(new Set(expectedFiles)).sort();

        // Check all files were created
        expect(fs.existsSync(OUTPUT_DIR)).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR).sort()).toEqual(expectedFiles);

        // Check *_filelist and *.json are OK
        const filelistContent = fs.readFileSync(path.join(OUTPUT_DIR, 'AF-Q8W3K0-F1-model_v4_filelist'), { encoding: 'utf8' }).trim();
        expect(filelistContent).toEqual(EXPECTED_FILENAMES_AF_Q8Q3K0.slice().sort().join('\n'));

        const jsonContent = fs.readFileSync(path.join(OUTPUT_DIR, 'AF-Q8W3K0-F1-model_v4.json'), { encoding: 'utf8' });
        for (const filename of EXPECTED_FILENAMES_AF_Q8Q3K0) {
            expect(jsonContent).toContain(`"${filename}"`);
        }

        // Check generated images are not blank, or overflowing through border
        for (const file of expectedFiles) {
            if (file.endsWith('.png')) {
                const image = await loadPngToRaw(path.join(OUTPUT_DIR, file));
                expect(isImageBlank(image)).toBeFalsy();
                expect(isBorderBlank(image)).toBeTruthy();
            }
        }
    }, TEST_TIMEOUT);
});
