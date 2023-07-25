using LeafletProject.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace LeafletProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly USData _USData;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            _USData = new USData();
        }
        public IActionResult Index()
        {
            return View(_USData);
        }
        [HttpPost]
        public IActionResult Properties(USData usdata)
        {
            _USData.MALE = usdata.MALE;
            _USData.FEMALE = usdata.FEMALE;

            return PartialView("Properties", _USData);
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
    
}