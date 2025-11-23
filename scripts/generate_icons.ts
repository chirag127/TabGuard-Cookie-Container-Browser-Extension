import sharp from "sharp";
import fs from "fs";
import path from "path";

const SIZES = [16, 48, 128];
// Use process.cwd() to resolve paths relative to the project root
const INPUT_FILE = path.join(process.cwd(), "icons/icon.svg");
const OUTPUT_DIR = path.join(process.cwd(), "icons");

async function generateIcons() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Input file not found: ${INPUT_FILE}`);
        process.exit(1);
    }

    console.log(`Generating icons from ${INPUT_FILE}...`);

    for (const size of SIZES) {
        const outputFile = path.join(OUTPUT_DIR, `icon${size}.png`);
        try {
            await sharp(INPUT_FILE).resize(size, size).png().toFile(outputFile);
            console.log(`Created ${outputFile}`);
        } catch (error) {
            console.error(`Error creating icon${size}.png:`, error);
            process.exit(1);
        }
    }
}

generateIcons();
