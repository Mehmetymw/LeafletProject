using LeafletProject.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace LeafletProject.Controllers
{
    public class HomeController : Controller
    { 
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        USData USData = new USData();
        public IActionResult Index(USData usdata)
        {
            USData = usdata;
            return View(USData);
        }
        [HttpPost]
        public IActionResult Properties()
        {
            return PartialView("Properties", USData);
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
    public class USData
    {
        public string MALE{ get; set; }
        public string FEMALE { get; set; }
    }
}