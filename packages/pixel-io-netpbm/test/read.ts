import * as assert from "assert";
import { parseHeader, read } from "../src";

describe("pixel-io-netpbm", () => {
    it("parse header", () => {
        assert.deepStrictEqual(parseHeader(Buffer.from("P4\n2\n3\n")), {
            comments: [],
            height: 3,
            max: undefined,
            start: 7,
            type: "P4",
            width: 2,
        });
        assert.deepStrictEqual(
            parseHeader(Buffer.from("P4\n#foo\n# bar\n2\n3\n")),
            {
                comments: ["foo", "bar"],
                height: 3,
                max: undefined,
                start: 18,
                type: "P4",
                width: 2,
            }
        );
    });

    it("read 1bit", () => {
        // prettier-ignore
        assert.deepStrictEqual(
            read(new Uint8Array([0x50, 0x34, 0x0a, 0x31, 0x32, 0x20, 0x32, 0x0a, 0xff, 0xff, 0xaa, 0x55])).pixels,
            new Uint8Array([
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0xff, 0x00, 0xff, 0x00
            ])
        );
    });

    it("read 4bit", () => {
        // prettier-ignore
        assert.deepStrictEqual(
            read(new Uint8Array([
                0x50, 0x35, 0x0a, 0x34, 0x20, 0x34, 0x0a, 0x31, 0x35, 0x0a,
                0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
                0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
            ])).pixels,
            new Uint8Array([
                0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff
            ])
        );
    });

    it("read 8bit", () => {
        // prettier-ignore
        assert.deepStrictEqual(
            read(new Uint8Array([
                0x50, 0x35, 0x0a, 0x32, 0x20, 0x32, 0x0a, 0x32, 0x35, 0x35, 0x0a,
                0x00, 0x44, 0x88, 0xff
            ])).pixels,
            new Uint8Array([0x00, 0x44, 0x88, 0xff])
        );
    });

    it("read 16bit", () => {
        // prettier-ignore
        assert.deepStrictEqual(
            read(new Uint8Array([
                0x50, 0x35, 0x0a, 0x32, 0x20, 0x32, 0x0a, 0x31, 0x30, 0x32, 0x33, 0x0a,
                0x03, 0xff, 0x01, 0x00, 0x02, 0xff, 0x00, 0xff
            ])).pixels,
            new Uint16Array([0xffff, 0x400f, 0xbfef, 0x3fcf])
        );
    });

    it("read 24bit", () => {
        // prettier-ignore
        assert.deepStrictEqual(
            read(new Uint8Array([
                0x50, 0x36, 0x0a, 0x32, 0x0a, 0x32, 0x0a, 0x32, 0x35, 0x35, 0x0a,
                0x11, 0x22, 0x33, 0x44, 0x55, 0x66,
                0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc
            ])).pixels,
            new Uint32Array([0x112233, 0x445566, 0x778899, 0xaabbcc])
        );
    });
});