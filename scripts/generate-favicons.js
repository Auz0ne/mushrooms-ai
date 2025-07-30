const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Favicon sizes and formats
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 70, name: 'mstile-70x70.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 310, name: 'mstile-310x150.png' },
  { size: 310, name: 'mstile-310x310.png' }
];

// ICO format (16x16, 32x32, 48x48)
const icoSizes = [16, 32, 48];

async function generateFavicons() {
  try {
    const inputPath = path.join(__dirname, '../public/Janus-Logo.png');
    const outputDir = path.join(__dirname, '../public');
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Error: Janus-Logo.png not found in public directory');
      process.exit(1);
    }

    console.log('🔄 Generating favicon variations...');

    // Generate PNG favicons
    for (const { size, name } of faviconSizes) {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(outputDir, name));
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // Generate ICO file (multi-size)
    const icoBuffers = [];
    for (const size of icoSizes) {
      const buffer = await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
      icoBuffers.push({ size, buffer });
    }

    // Create ICO file (simplified - in real implementation you'd need a proper ICO library)
    // For now, we'll just copy the 32x32 PNG as favicon.ico
    await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'favicon.ico'));

    console.log('✅ Generated favicon.ico');

    // Generate web manifest
    const manifest = {
      name: 'Mushrooms AI',
      short_name: 'Mushrooms AI',
      description: 'Premium Mushroom Supplements with AI-powered recommendations',
      start_url: '/',
      display: 'standalone',
      background_color: '#1a1a1a',
      theme_color: '#ff6b35',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    };

    fs.writeFileSync(
      path.join(outputDir, 'site.webmanifest'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('✅ Generated site.webmanifest');

    // Generate browserconfig.xml for Microsoft tiles
    const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#ff6b35</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

    fs.writeFileSync(
      path.join(outputDir, 'browserconfig.xml'),
      browserconfig
    );

    console.log('✅ Generated browserconfig.xml');

    console.log('\n🎉 All favicon variations generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Add the following to your HTML head:');
    console.log('   <link rel="icon" type="image/x-icon" href="/favicon.ico">');
    console.log('   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">');
    console.log('   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">');
    console.log('   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">');
    console.log('   <link rel="manifest" href="/site.webmanifest">');
    console.log('   <meta name="msapplication-config" content="/browserconfig.xml">');
    console.log('   <meta name="theme-color" content="#ff6b35">');

  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons(); 