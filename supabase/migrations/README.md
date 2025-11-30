# Database Migrations

This folder contains all database schema changes for the Prayerly app, organized chronologically to track the evolution of the database structure.

## Migration Files

| File | Description | Status |
|------|-------------|--------|
| `001_initial_schema.sql` | Core tables (profiles, prayers, journals, reminders, user_preferences) | ✓ Pending |
| `002_rls_policies.sql` | Row Level Security policies for data isolation | ✓ Pending |
| `003_indexes.sql` | Database indexes for query performance | ✓ Pending |
| `004_storage_setup.sql` | Storage bucket setup for profile pictures | ✓ Pending |

## How to Apply Migrations

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the contents of each migration file (starting with 001)
4. Paste into the SQL Editor
5. Click **Run** to execute
6. Repeat for each migration file in order (001 → 002 → 003 → 004)
7. Mark the migration as complete in the table above

**Important:** Always run migrations in numerical order!

## Creating New Migrations

When you need to make database changes:

1. **Create a new migration file** with the next number:
   ```
   005_description_of_change.sql
   ```

2. **Use descriptive names**:
   - `005_add_tags_table.sql`
   - `006_add_prayer_categories.sql`
   - `007_add_sharing_features.sql`

3. **Include header comments**:
   ```sql
   -- Migration: Add Tags Feature
   -- Description: Create tags table and add tag relationships
   -- Date: 2024-12-01
   ```

4. **Make migrations reversible** when possible:
   ```sql
   -- To rollback, run:
   -- DROP TABLE IF EXISTS tags CASCADE;
   ```

5. **Test in development environment first** before applying to production

## Migration Best Practices

### DO:
- ✓ Keep migrations small and focused
- ✓ Test migrations locally before applying to production
- ✓ Include rollback instructions
- ✓ Use `IF NOT EXISTS` and `IF EXISTS` for safety
- ✓ Document any manual steps required
- ✓ Commit migrations to version control immediately

### DON'T:
- ✗ Edit existing migration files (create new ones instead)
- ✗ Skip migrations (they must run in order)
- ✗ Delete old migrations (keep full history)
- ✗ Apply migrations directly to production without testing

## Rollback Procedure

If you need to undo a migration:

1. Create a new migration that reverses the changes:
   ```
   006_rollback_tags_feature.sql
   ```

2. Never edit or delete the original migration file

## Checking Migration Status

To verify which migrations have been applied to your database:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query:

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version;
```

This shows a list of all migrations that have been successfully applied.

## Common Migration Patterns

### Adding a Column
```sql
ALTER TABLE table_name
ADD COLUMN IF NOT EXISTS column_name TYPE;
```

### Adding an Index
```sql
CREATE INDEX IF NOT EXISTS idx_name
ON table_name(column_name);
```

### Adding RLS Policy
```sql
CREATE POLICY "policy_name"
ON table_name FOR SELECT
USING (auth.uid() = user_id);
```

### Creating a Trigger
```sql
CREATE TRIGGER trigger_name
AFTER INSERT ON table_name
FOR EACH ROW EXECUTE FUNCTION function_name();
```

## Need Help?

- **Supabase Database Docs**: https://supabase.com/docs/guides/database
- **SQL Reference**: https://www.postgresql.org/docs/
- **Migration Guide**: https://supabase.com/docs/guides/database/migrations
