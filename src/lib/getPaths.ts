import * as path from "https://deno.land/std@0.57.0/path/mod.ts";

export default function getPaths(url: string) {
    const __filename = path.fromFileUrl(url);
    const __dirname = path.dirname(path.fromFileUrl(url));

    return {
        __filename,
        __dirname
    }
}