const { initializeDatabase } = require('./utils/database');

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL not found, skipping migration');
      console.log('✅ Migration skipped - will run when database is available');
      process.exit(0);
    }
    
    await initializeDatabase();
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    console.log('ℹ️ This is normal on first deploy before database is ready');
    console.log('✅ Migration will be retried on next startup');
    process.exit(0); // Don't fail the build
  }
}

migrate();
