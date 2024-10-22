using DRYV1.Models;
using Microsoft.EntityFrameworkCore;

namespace DRYV1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Instrument> Instruments { get; set; }
        public DbSet<GuitBassGear> Guitars { get; set; }
        
        public DbSet<DrumsGear> Drums { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Instrument>().ToTable("Instruments");
            modelBuilder.Entity<GuitBassGear>().ToTable("Guitars");
            modelBuilder.Entity<DrumsGear>().ToTable("Drums");
        }
    }
}