const sharp = require('./fallen-one/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const BENTO_TILES = [
    // --- Top Section ---
    { id: 'mr_racer_1', left: 254, top: 539, width: 310, height: 310 },
    { id: 'stickman_gates_1', left: 574, top: 539, width: 200, height: 200 },
    { id: 'dart_master', left: 784, top: 539, width: 200, height: 200 },
    
    // Top right 4x2 mini cluster
    { id: 'watermelon', left: 994, top: 539, width: 95, height: 95 },
    { id: 'hill_climb_mini', left: 1099, top: 539, width: 95, height: 95 },
    { id: 'battle_blast_1', left: 1204, top: 539, width: 95, height: 95 },
    { id: 'doorway_8bit', left: 1309, top: 539, width: 95, height: 95 },
    { id: 'tactical_fps', left: 994, top: 644, width: 95, height: 95 },
    { id: 'subway_surfers_mini', left: 1099, top: 644, width: 95, height: 95 },
    { id: 'jelly_splash', left: 1204, top: 644, width: 95, height: 95 },
    { id: 'brain_special', left: 1309, top: 644, width: 95, height: 95 },

    // --- Middle-Upper Section ---
    // Under MR RACER 1 (3x2 mini)
    { id: 'scary_neighbor', left: 254, top: 859, width: 95, height: 95 },
    { id: 'horror_granny', left: 359, top: 859, width: 95, height: 95 },
    { id: 'tic_tac_toe', left: 464, top: 859, width: 95, height: 95 },
    { id: 'green_alien', left: 254, top: 964, width: 95, height: 95 },
    { id: 'vvvv_wave', left: 359, top: 964, width: 95, height: 95 },
    { id: 'cartoon_monkey', left: 464, top: 964, width: 95, height: 95 },

    // Center Hill Climb 2x2
    { id: 'hill_climb_big', left: 574, top: 749, width: 310, height: 310 },

    // Column next to Hill Climb
    { id: 'pink_car', left: 894, top: 749, width: 95, height: 95 },
    { id: 'world_cup', left: 894, top: 854, width: 95, height: 95 },
    { id: 'anime_girl', left: 894, top: 959, width: 95, height: 95 },

    // Airplane 2x2
    { id: 'airplane_big', left: 1005, top: 749, width: 310, height: 310 },

    // Far right column
    { id: 'miner_dig', left: 1325, top: 749, width: 95, height: 95 },
    { id: 'police_cop', left: 1325, top: 854, width: 95, height: 95 },
    { id: 'sharp_monster', left: 1325, top: 959, width: 95, height: 95 },
    { id: 'slime_green', left: 1325, top: 1064, width: 95, height: 95 },
    { id: 'sushi_snake', left: 1325, top: 1169, width: 95, height: 95 },

    // --- Middle Row ---
    { id: 'monster_truck', left: 254, top: 1069, width: 200, height: 200 },
    { id: 'stickman_gates_2', left: 464, top: 1069, width: 200, height: 200 },
    { id: 'battle_blast_2', left: 674, top: 1069, width: 95, height: 95 },
    { id: 'monster_frame', left: 779, top: 1069, width: 95, height: 95 },
    { id: 'pizza_box', left: 674, top: 1174, width: 95, height: 95 },
    { id: 'pixel_heart', left: 779, top: 1174, width: 95, height: 95 },
    { id: 'sword_boy', left: 884, top: 1069, width: 200, height: 200 },
    { id: 'subway_surfers_big', left: 1094, top: 1069, width: 200, height: 200 },

    // --- Lower-Middle Row ---
    { id: 'mr_racer_2', left: 254, top: 1279, width: 310, height: 310 },
    { id: 'real_cars_city', left: 574, top: 1279, width: 200, height: 145 },
    { id: 'penalty_shooters_2', left: 574, top: 1434, width: 200, height: 155 },
    { id: 'cryzen_fps', left: 784, top: 1279, width: 310, height: 310 },
    { id: 'bmw_drift', left: 1104, top: 1279, width: 310, height: 310 },

    // --- Lower Row ---
    // Under MR RACER 2 mini grid
    { id: 'battle_blast_3', left: 254, top: 1599, width: 95, height: 95 },
    { id: 'monster_frame_2', left: 359, top: 1599, width: 95, height: 95 },
    { id: 'dune_buggy', left: 464, top: 1599, width: 95, height: 95 },
    { id: 'pizza_box_2', left: 254, top: 1704, width: 95, height: 95 },
    { id: 'pixel_heart_2', left: 359, top: 1704, width: 95, height: 95 },
    { id: 'anime_bedroom', left: 464, top: 1704, width: 95, height: 95 },

    // Cars cluster
    { id: 'jeep_4x4', left: 574, top: 1599, width: 100, height: 95 },
    { id: 'red_highway', left: 684, top: 1599, width: 100, height: 95 },
    { id: 'monstertruck_mini', left: 794, top: 1599, width: 100, height: 95 },
    { id: 'white_drift_car', left: 684, top: 1704, width: 100, height: 95 },

    { id: 'gun_gate_runner', left: 904, top: 1599, width: 200, height: 200 },
    { id: 'military_tank', left: 1114, top: 1599, width: 310, height: 310 },

    // Under tank 3 mini
    { id: 'talking_cat', left: 1114, top: 1919, width: 95, height: 95 },
    { id: 'anime_girls_fashion', left: 1219, top: 1919, width: 95, height: 95 },
    { id: 'gas_pump', left: 1324, top: 1919, width: 95, height: 95 },

    // --- Bottom Row ---
    { id: 'jigsaw_surprise', left: 359, top: 1819, width: 200, height: 200 },
    { id: 'space_jet', left: 359, top: 2029, width: 200, height: 200 },
    { id: 'blocky_zombie_shooter', left: 574, top: 1819, width: 310, height: 310 },
    { id: 'red_spaceship', left: 894, top: 1819, width: 200, height: 200 },
    { id: 'marbles_flag_race', left: 894, top: 2029, width: 310, height: 310 }
];

async function extractAll() {
    const srcImg = path.join(__dirname, 'public', 'Landing Page (1).webp');
    const outDir = path.join(__dirname, 'public', 'thumbnails', 'bento');
    const rootOutDir = path.join(__dirname, 'thumbnails', 'bento');

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    if (!fs.existsSync(rootOutDir)) fs.mkdirSync(rootOutDir, { recursive: true });

    console.log(`Extracting ${BENTO_TILES.length} game cards...`);

    for (const tile of BENTO_TILES) {
        const destPath = path.join(outDir, `${tile.id}.webp`);
        const rootDestPath = path.join(rootOutDir, `${tile.id}.webp`);
        
        await sharp(srcImg)
            .extract({
                left: tile.left,
                top: tile.top,
                width: tile.width,
                height: tile.height
            })
            .toFile(destPath);

        // Also copy to thumbnails/bento/
        fs.copyFileSync(destPath, rootDestPath);
        console.log(`✓ ${tile.id} (${tile.width}x${tile.height})`);
    }

    console.log('All bento thumbnails extracted successfully!');
}

extractAll().catch(console.error);
