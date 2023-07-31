using Microsoft.EntityFrameworkCore;

namespace LeafletProject.Data
{
    public class TestDbInitializer
    {
        public static IConfigurationRoot Configuration;
        public static DbContextOptionsBuilder<TestDbContext> OptionsBuilder;

        public static void Build()
        {
            var Builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json",optional:true,reloadOnChange:true);

            Configuration = Builder.Build();
            OptionsBuilder = new DbContextOptionsBuilder<TestDbContext>();
            var connString = Configuration.GetConnectionString("TestCon");
            OptionsBuilder.UseNpgsql(connString);

        }
    }
}
