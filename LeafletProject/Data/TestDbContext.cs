using Microsoft.EntityFrameworkCore;

namespace LeafletProject.Data
{
    public class TestDbContext : DbContext
    {
        public TestDbContext()
        {
                
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //TODO Build methodu mutlaka bundan önce başlatılmalı.
            optionsBuilder.UseNpgsql(TestDbInitializer.Configuration.GetConnectionString("TestCon"));
        }
    }
}
