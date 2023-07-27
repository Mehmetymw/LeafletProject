using LeafletProject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Text.Json;

namespace LeafletProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private USData _USData;

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
        public IActionResult Properties([FromBody] JsonElement jsonData)
        {
            jsonData.GetProperty("MALE").TryGetInt64(out long MALE);
            jsonData.GetProperty("FEMALE").TryGetInt64(out long FEMALE);
            var usData = new USData
            {
                MALE = MALE,
                FEMALE =FEMALE,
            };

            _USData.MALE = usData.MALE;
            _USData.FEMALE = usData.FEMALE;

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
