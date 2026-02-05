#!/usr/bin/env node
/**
 * Batch Image Optimizer
 * Compresses all oversized PNG images to optimal quality
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../src/assets/images');
const MAX_SIZE_KB = 150; // Target max file size in KB
const QUALITY = 80;
const MAX_WIDTH = 1920; // Max width for any image

async function findLargeImages(dir, minSizeKB = 200) {
  const images = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (/\.(png|jpg|jpeg)$/i.test(item)) {
        const sizeKB = stat.size / 1024;
        if (sizeKB > minSizeKB) {
          images.push({ path: fullPath, sizeKB: Math.round(sizeKB) });
        }
      }
    }
  }
  
  scan(dir);
  return images.sort((a, b) => b.sizeKB - a.sizeKB);
}

async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const basename = path.basename(imagePath);
  
  try {
    const originalStat = fs.statSync(imagePath);
    const originalSizeKB = Math.round(originalStat.size / 1024);
    
    // Read image metadata
    const metadata = await sharp(imagePath).metadata();
    
    // Calculate new width (cap at MAX_WIDTH)
    const newWidth = Math.min(metadata.width, MAX_WIDTH);
    
    let pipeline = sharp(imagePath)
      .resize(newWidth, null, { withoutEnlargement: true });
    
    // Convert to optimal format
    if (ext === '.png') {
      // Check if image has alpha channel
      if (metadata.hasAlpha) {
        pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
      } else {
        // Convert to WebP for non-transparent PNGs
        const webpPath = imagePath.replace(/\.png$/i, '.webp');
        await pipeline.webp({ quality: QUALITY }).toFile(webpPath);
        
        const newStat = fs.statSync(webpPath);
        const newSizeKB = Math.round(newStat.size / 1024);
        const savings = originalSizeKB - newSizeKB;
        
        console.log(`✅ ${basename} → .webp: ${originalSizeKB}KB → ${newSizeKB}KB (saved ${savings}KB)`);
        
        // Remove original PNG
        fs.unlinkSync(imagePath);
        return { original: originalSizeKB, new: newSizeKB, converted: true };
      }
    }
    
    // For JPG or transparent PNG, optimize in place
    const tempPath = imagePath + '.tmp';
    if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tempPath);
    } else {
      await pipeline.png({ quality: QUALITY, compressionLevel: 9 }).toFile(tempPath);
    }
    
    // Replace original
    fs.unlinkSync(imagePath);
    fs.renameSync(tempPath, imagePath);
    
    const newStat = fs.statSync(imagePath);
    const newSizeKB = Math.round(newStat.size / 1024);
    const savings = originalSizeKB - newSizeKB;
    
    console.log(`✅ ${basename}: ${originalSizeKB}KB → ${newSizeKB}KB (saved ${savings}KB)`);
    return { original: originalSizeKB, new: newSizeKB, converted: false };
    
  } catch (error) {
    console.error(`❌ Failed to optimize ${basename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Scanning for large images...\n');
  
  const images = await findLargeImages(ASSETS_DIR, 200);
  
  if (images.length === 0) {
    console.log('✨ No large images found!');
    return;
  }
  
  console.log(`Found ${images.length} images over 200KB:\n`);
  
  let totalOriginal = 0;
  let totalNew = 0;
  let processed = 0;
  
  for (const img of images) {
    const result = await optimizeImage(img.path);
    if (result) {
      totalOriginal += result.original;
      totalNew += result.new;
      processed++;
    }
  }
  
  console.log('\n========================================');
  console.log(`📊 Processed: ${processed} images`);
  console.log(`📉 Total savings: ${Math.round((totalOriginal - totalNew) / 1024)}MB`);
  console.log(`   Before: ${Math.round(totalOriginal / 1024)}MB`);
  console.log(`   After: ${Math.round(totalNew / 1024)}MB`);
  console.log('========================================');
}

main().catch(console.error);
