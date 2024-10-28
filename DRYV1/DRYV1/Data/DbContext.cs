using DRYV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DRYV1.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<User> Users { get; set; }
        public DbSet<MusicGear> MusicGear { get; set; }
        public DbSet<GuitBassGear> GuitBassGear { get; set; }
        public DbSet<DrumsGear> DrumsGear { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MusicGear>().ToTable("MusicGear");
            modelBuilder.Entity<GuitBassGear>().ToTable("GuitBassGear");
            modelBuilder.Entity<DrumsGear>().ToTable("DrumsGear");
        }
    }
}