/**
 * SEO Validation Script
 * 
 * This script validates the sitemap and robots.txt configuration
 * Run with: npx tsx scripts/validate-seo.ts
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ag2choba.org';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
}

async function validateSitemap() {
  console.log('🔍 Validating Sitemap Configuration...\n');

  try {
    const response = await fetch(`${SITE_URL}/sitemap.xml`);
    
    if (!response.ok) {
      console.error('❌ Sitemap not accessible');
      console.error(`   Status: ${response.status} ${response.statusText}`);
      return false;
    }

    const content = await response.text();
    
    // Basic XML validation
    if (!content.includes('<?xml') || !content.includes('<urlset')) {
      console.error('❌ Invalid sitemap XML format');
      return false;
    }

    // Count URLs
    const urlMatches = content.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;

    console.log('✅ Sitemap is valid');
    console.log(`   Total URLs: ${urlCount}`);
    console.log(`   Size: ${(content.length / 1024).toFixed(2)} KB`);
    
    // Check for required routes
    const requiredRoutes = [
      '/',
      '/sermons',
      '/events',
      '/announcements',
      '/give',
      '/community',
    ];

    console.log('\n📋 Checking required routes:');
    for (const route of requiredRoutes) {
      const fullUrl = `${SITE_URL}${route}`;
      if (content.includes(fullUrl)) {
        console.log(`   ✅ ${route}`);
      } else {
        console.log(`   ⚠️  ${route} - Not found in sitemap`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error validating sitemap:', error);
    return false;
  }
}

async function validateRobotsTxt() {
  console.log('\n🤖 Validating Robots.txt Configuration...\n');

  try {
    const response = await fetch(`${SITE_URL}/robots.txt`);
    
    if (!response.ok) {
      console.error('❌ Robots.txt not accessible');
      console.error(`   Status: ${response.status} ${response.statusText}`);
      return false;
    }

    const content = await response.text();
    
    // Check for required directives
    const checks = [
      { pattern: /User-agent:/i, name: 'User-agent directive' },
      { pattern: /Allow:/i, name: 'Allow directive' },
      { pattern: /Disallow:/i, name: 'Disallow directive' },
      { pattern: /Sitemap:/i, name: 'Sitemap reference' },
    ];

    console.log('✅ Robots.txt is accessible');
    console.log('\n📋 Checking directives:');
    
    for (const check of checks) {
      if (check.pattern.test(content)) {
        console.log(`   ✅ ${check.name}`);
      } else {
        console.log(`   ⚠️  ${check.name} - Not found`);
      }
    }

    // Check if admin routes are blocked
    console.log('\n🔒 Checking security:');
    if (content.includes('/admin')) {
      console.log('   ✅ Admin routes are blocked');
    } else {
      console.log('   ⚠️  Admin routes may not be blocked');
    }

    if (content.includes('/api')) {
      console.log('   ✅ API routes are blocked');
    } else {
      console.log('   ⚠️  API routes may not be blocked');
    }

    // Check AI bot blocking
    const aiBots = ['GPTBot', 'ChatGPT', 'Claude', 'CCBot', 'anthropic'];
    const blockedBots = aiBots.filter(bot => 
      content.toLowerCase().includes(bot.toLowerCase())
    );

    if (blockedBots.length > 0) {
      console.log(`   ✅ AI bots blocked: ${blockedBots.join(', ')}`);
    } else {
      console.log('   ℹ️  No AI bots explicitly blocked');
    }

    return true;
  } catch (error) {
    console.error('❌ Error validating robots.txt:', error);
    return false;
  }
}

async function checkMetadata() {
  console.log('\n📊 Checking Page Metadata...\n');

  try {
    const response = await fetch(SITE_URL);
    
    if (!response.ok) {
      console.error('❌ Homepage not accessible');
      return false;
    }

    const html = await response.text();
    
    const checks = [
      { pattern: /<title>/i, name: 'Title tag' },
      { pattern: /<meta name="description"/i, name: 'Meta description' },
      { pattern: /<meta property="og:/i, name: 'OpenGraph tags' },
      { pattern: /<meta name="twitter:/i, name: 'Twitter Card tags' },
      { pattern: /<link rel="canonical"/i, name: 'Canonical URL' },
    ];

    console.log('📋 Metadata presence:');
    for (const check of checks) {
      if (check.pattern.test(html)) {
        console.log(`   ✅ ${check.name}`);
      } else {
        console.log(`   ⚠️  ${check.name} - Not found`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error checking metadata:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 SEO Validation Tool\n');
  console.log(`Site URL: ${SITE_URL}\n`);
  console.log('='.repeat(60));

  const results = {
    sitemap: await validateSitemap(),
    robots: await validateRobotsTxt(),
    metadata: await checkMetadata(),
  };

  console.log('\n' + '='.repeat(60));
  console.log('\n📈 Summary:\n');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`   Passed: ${passed}/${total} checks`);
  
  if (passed === total) {
    console.log('\n✅ All SEO validations passed!');
  } else {
    console.log('\n⚠️  Some validations failed. Please review the output above.');
  }

  console.log('\n💡 Next Steps:');
  console.log('   1. Submit sitemap to Google Search Console');
  console.log('   2. Add verification codes to app/layout.tsx');
  console.log('   3. Create OpenGraph image (public/og-image.jpg)');
  console.log('   4. Monitor search performance regularly');
  console.log('\n   See docs/SEO-SETUP.md for detailed instructions.\n');
}

main().catch(console.error);
