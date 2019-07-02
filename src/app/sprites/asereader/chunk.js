import {AseBuffer} from "./aseBuffer";
import pako from "pako";

/**
 * Reads a chunk
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
export function readChunk(aseBuffer) {
    let chunk = {};

    chunk.size = aseBuffer.readDword();
    chunk.type = aseBuffer.readWord();

    switch(chunk.type) {
        case 0x0004:
            aseBuffer.skipBytes(chunk.size - 6);
            break;
        case 0x0011:
            aseBuffer.skipBytes(chunk.size - 6);
            break;
        case 0x2004:
            chunk = {...chunk, ...read0x2004(aseBuffer)};
            break;
        case 0x2005:
            chunk = {...chunk, ...read0x2005(aseBuffer, chunk.size)};
            break;
        case 0x2006:
            chunk = {...chunk, ...read0x2006(aseBuffer)};
            break;
        case 0x2007:
            chunk = {...chunk, ...read0x2007(aseBuffer)};
            break;
        case 0x2016:
            aseBuffer.skipBytes(chunk.size - 6);
            break;
        case 0x2017:
            aseBuffer.skipBytes(chunk.size - 6);
            break;
        case 0x2018:
            chunk = {...chunk, ...read0x2018(aseBuffer)};
            break;
        case 0x2019:
            chunk = {...chunk, ...read0x2019(aseBuffer)};
            break;
        case 0x2020:
            chunk = {...chunk, ...read0x2020(aseBuffer)};
            break;
        case 0x2022:
            chunk = {...chunk, ...read0x2022(aseBuffer)};
            break;
        default:
            throw new Error("Encountered unimplemented chunk type: " + chunk.type);
    }

    return chunk;
}

/**
 * Reads a layer chunk
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
const read0x2004 = aseBuffer => {
    let chunk = {};

    chunk.flags = aseBuffer.readWord();

    // Determine flags
    let flags = [];
    if ((chunk.flags & 1) === 1) flags.push('Visible');
    if ((chunk.flags & 2) === 2) flags.push('Editable');
    if ((chunk.flags & 4) === 4) flags.push('Lock Movement');
    if ((chunk.flags & 8) === 8) flags.push('Background');
    if ((chunk.flags & 16) === 16) flags.push('Prefer linked cells');
    if ((chunk.flags & 32) === 32) flags.push('The layer group should be displayed collapsed');
    if ((chunk.flags & 64) === 64) flags.push('The layer is a reference layer');

    chunk.flags = flags;

    chunk.layerType = aseBuffer.readWord() === 1 ? 'Group' : 'Normal';
    chunk.childLevel = aseBuffer.readWord();
    chunk.defaultLayerWidth = aseBuffer.readWord();
    chunk.defaultLayerHeight = aseBuffer.readWord();
    chunk.blendMode = aseBuffer.readWord();

    // Determine layer blend mode
    switch (chunk.blendMode) {
        case 0: chunk.blendMode =  'Normal';      break;
        case 1: chunk.blendMode =  'Multiply';    break;
        case 2: chunk.blendMode =  'Screen';      break;
        case 3: chunk.blendMode =  'Overlay';     break;
        case 4: chunk.blendMode =  'Darken';      break;
        case 5: chunk.blendMode =  'Lighten';     break;
        case 6: chunk.blendMode =  'Color Dodge'; break;
        case 7: chunk.blendMode =  'Color Burn';  break;
        case 8: chunk.blendMode =  'Hard Light';  break;
        case 9: chunk.blendMode =  'Soft Light';  break;
        case 10: chunk.blendMode = 'Difference';  break;
        case 11: chunk.blendMode = 'Exclusion';   break;
        case 12: chunk.blendMode = 'Hue';         break;
        case 13: chunk.blendMode = 'Saturation';  break;
        case 14: chunk.blendMode = 'Color';       break;
        case 15: chunk.blendMode = 'Luminosity';  break;
        case 16: chunk.blendMode = 'Addition';    break;
        case 17: chunk.blendMode = 'Subtract';    break;
        case 18: chunk.blendMode = 'Divide';      break;
    }

    chunk.opacity = aseBuffer.readByte();

    aseBuffer.skipBytes(3);

    chunk.name = aseBuffer.readString();

    return chunk;
};

/**
 * Reads a cel chunk
 * @param {AseBuffer} aseBuffer
 * @param {number} size total chunk size
 * @returns {Object}
 */
const read0x2005 = (aseBuffer, size) => {
    let chunk = {};

    let remaining = 0, compressedData, colorDepthBytes, pixels = [], row = [];

    chunk.layerIndex = aseBuffer.readWord();
    chunk.xpos = aseBuffer.readShort();
    chunk.ypos = aseBuffer.readShort();
    chunk.opacity = aseBuffer.readByte();
    chunk.celType = aseBuffer.readWord();

    aseBuffer.skipBytes(7);

    switch (chunk.celType) {
        case 0:
            chunk.celType = 'Raw Cell';
            chunk.width = aseBuffer.readWord();
            chunk.height = aseBuffer.readWord();

            // Calculate remaining bytes in chunk
            remaining = size - 26;

            // Make sure the buffer has the proper number of pixel data
            colorDepthBytes = 0;
            switch (aseBuffer.getColorDepth()) {
                case 'RGBA':
                    colorDepthBytes = 4;
                    break;
                case 'Grayscale':
                    colorDepthBytes = 2;
                    break;
                case 'Indexed':
                    colorDepthBytes = 1;
                    break;
            }

            if (remaining % colorDepthBytes !== 0) {
                throw new Error('Raw cell chunk has incorrect number of bytes for color depth!');
            }

            // Read pixels
            pixels = [];
            row = [];
            while (remaining > 0) {
                let pixel = aseBuffer.readPixel();

                if (row.length < chunk.width) {
                    row.push(pixel);
                } else {
                    pixels.push(row);
                    row = [];
                    row.push(pixel);
                }

                remaining -= colorDepthBytes;
            }

            pixels.push(row);

            chunk.pixels = Array.from(pixels);
            break;
        case 1:
            chunk.celType = 'Linked Cell';
            chunk.frameLinkPos = aseBuffer.readWord();
            break;
        case 2:
            chunk.celType = 'Compressed Image';
            chunk.width = aseBuffer.readWord();
            chunk.height = aseBuffer.readWord();

            // Calculate remaining bytes in chunk
            remaining = size - 26;

            // Read all remaining bytes
            compressedData = [];
            while (remaining > 0) {
                compressedData.push(aseBuffer.readByte());
                remaining--;
            }

            // Inflate pako image
            // let pixelBuffer = pako.inflate(new ByteBuffer(compressedData).getBytes());
            let pixelBuffer = pako.inflate(compressedData);

            // Make sure the buffer has the proper number of pixel data
            colorDepthBytes = 0;
            switch (aseBuffer.getColorDepth()) {
                case 'RGBA':
                    colorDepthBytes = 4;
                    break;
                case 'Grayscale':
                    colorDepthBytes = 2;
                    break;
                case 'Indexed':
                    colorDepthBytes = 1;
                    break;
            }

            if (pixelBuffer.length % colorDepthBytes !== 0 || pixelBuffer.length / ((chunk.width * chunk.height) * colorDepthBytes) !== 1) {
                throw new Error('ZLIB buffer has incorrect number of bytes for color depth!');
            }

            let asePixelBuffer = new AseBuffer(pixelBuffer);
            asePixelBuffer.setColorDepth(aseBuffer.getColorDepth());

            // Read pixel data
            pixels = [];
            row = [];
            remaining = pixelBuffer.length;
            while (remaining > 0) {
                let pixel = asePixelBuffer.readPixel();

                if (row.length < chunk.width) {
                    row.push(pixel);
                } else {
                    pixels.push(row);
                    row = [];
                    row.push(pixel);
                }

                remaining -= colorDepthBytes;
            }

            pixels.push(row);

            chunk.pixels = Array.from(pixels);
            break;
    }

    return chunk;
};

/**
 * Reads a cel extra chunk
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
const read0x2006 = aseBuffer => {
    let chunk = {};

    chunk.flags = aseBuffer.readDword();
    chunk.preciseX = aseBuffer.readFixed();
    chunk.preciseY = aseBuffer.readFixed();
    chunk.width = aseBuffer.readFixed();
    chunk.height = aseBuffer.readFixed();

    aseBuffer.skipBytes(16);

    return chunk;
};

/**
 * Reads a color profile chunk.
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
const read0x2007 = aseBuffer => {
    let chunk = {};

    chunk.colorType = aseBuffer.readWord();
    chunk.flags = aseBuffer.readWord();
    chunk.fixedGamma = aseBuffer.readFixed();

    aseBuffer.skipBytes(8);

    if (chunk.colorType === 2) {
        chunk.IccProfileDataLength = aseBuffer.readDword();
        const data = [];

        for (let i = chunk.IccProfileDataLength; i > 0; --i) {
            data.push(aseBuffer.readByte());
        }

        chunk.IccProfileData = Array.from(data);
    }

    return chunk;
};

/**
 * Reads a frame tags chunk
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
const read0x2018 = aseBuffer => {
    let chunk = {};

    chunk.numberOfTags = aseBuffer.readWord();

    aseBuffer.skipBytes(8);

    chunk.tags = [];

    // Read each tag
    for (let i = 0; i <chunk.numberOfTags; i++) {
        let tag = {};

        tag.fromFrame = aseBuffer.readWord();
        tag.toFrame = aseBuffer.readWord();
        tag.loopAnimationDirection = aseBuffer.readByte();

        // Determine animation direction
        switch (tag.loopAnimationDirection) {
            case 0: tag.loopAnimationDirection = 'Forward'; break;
            case 1: tag.loopAnimationDirection = 'Reverse'; break;
            case 2: tag.loopAnimationDirection = 'Ping-pong'; break;
        }

        aseBuffer.skipBytes(8);

        chunk.r = aseBuffer.readByte();
        chunk.g = aseBuffer.readByte();
        chunk.b = aseBuffer.readByte();

        aseBuffer.skipBytes(1);

        chunk.tagName = aseBuffer.readString();

        chunk.tags.push(tag);
    }

    return chunk;
};

/**
 * Reads a palette chunk
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
const read0x2019 = aseBuffer => {
    let chunk = {};

    chunk.newPaletteSize = aseBuffer.readDword();
    chunk.firstColorIndexToChange = aseBuffer.readDword();
    chunk.lastColorIndexToChange = aseBuffer.readDword();
    chunk.paletteEntries = [];

    // Skip blank values
    aseBuffer.skipBytes(8);

    // Read each palette entry
    for (let i = 0; i < chunk.newPaletteSize; i++) {
        let paletteEntry = {};

        paletteEntry.hasName = aseBuffer.readWord() & 1 === 1;
        paletteEntry.r = aseBuffer.readByte();
        paletteEntry.g = aseBuffer.readByte();
        paletteEntry.b = aseBuffer.readByte();
        paletteEntry.a = aseBuffer.readByte();

        // Read name if available
        if (paletteEntry.hasName) {
            paletteEntry.name = aseBuffer.readString();
        }

        chunk.paletteEntries.push(paletteEntry);
    }

    return chunk;
};

/**
 * Reads a user data chunk
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
const read0x2020 = aseBuffer => {
    let chunk = {};

    chunk.flags = aseBuffer.readDword();

    // Determine flags
    let flags = [];
    if ((chunk.flags & 1) === 1) flags.push('Has text');
    if ((chunk.flags & 2) === 2) flags.push('Has color');
    chunk.flags = flags;

    // Read text
    if (~chunk.flags.indexOf('Has text')) {
        chunk.text = aseBuffer.readString();
    }

    // Read color
    if (~chunk.flags.indexOf('Has color')) {
        chunk.r = aseBuffer.readByte();
        chunk.g = aseBuffer.readByte();
        chunk.b = aseBuffer.readByte();
        chunk.a = aseBuffer.readByte();
    }

    return chunk;
};

/**
 * Reads a slice chunk
 * @param {AseBuffer} aseBuffer
 * @returns {Object}
 */
const read0x2022 = aseBuffer => {
    let chunk = {};

    chunk.sliceKeysCount = aseBuffer.readDword();
    chunk.flags = aseBuffer.readDword();

    // Determine flags
    let flags = [];
    if ((chunk.flags & 1) === 1) flags.push('9-Patches');
    if ((chunk.flags & 2) === 2) flags.push('Pivot');
    chunk.flags = flags;

    chunk.reserved = aseBuffer.readDword();
    chunk.name = aseBuffer.readString();

    chunk.sliceKeys = [];

    // Read slice keys
    for (let i = 0; i < chunk.sliceKeysCount; i++) {
        let sliceKey = {};

        sliceKey.frameNumber = aseBuffer.readDword();
        sliceKey.xOrigin = aseBuffer.readLong();
        sliceKey.yOrigin = aseBuffer.readLong();
        sliceKey.width = aseBuffer.readDword();
        sliceKey.height = aseBuffer.readDword();

        if (~chunk.flags.indexOf('9-Patches')) {
            sliceKey.centerX = aseBuffer.readLong();
            sliceKey.centerY = aseBuffer.readLong();
            sliceKey.width = aseBuffer.readDword();
            sliceKey.height = aseBuffer.readDword();
        }

        if (~chunk.flags.indexOf('Pivot')) {
            sliceKey.pivotX = aseBuffer.readLong();
            sliceKey.pivotY = aseBuffer.readLong();
        }

        chunk.sliceKeys.push(sliceKey);
    }

    return chunk;
};
