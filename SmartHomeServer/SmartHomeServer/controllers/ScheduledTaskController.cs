using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeServer;
using SmartHomeServer.Classes;
using System.Security.Claims;

[Authorize(Roles = "Pro")]
[Route("api/[controller]")]
[ApiController]
public class ScheduledTasksController : ControllerBase
{
    private readonly MyDbContext _context;
    private readonly IMapper _autoMapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ScheduledTasksController(MyDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _autoMapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpGet]
    public async Task<ActionResult<List<Scheduledtask>>> GetUserScheduledTasks()
    {
        HttpContext context = _httpContextAccessor.HttpContext;
        string systemId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(systemId)) return Unauthorized();
        try
        {
            var tasks = await _context.Scheduledtasks
                .Where(t => t.UserId == new Guid(systemId))
                .ToListAsync();
            if (tasks == null) return NotFound();
            return Ok(_autoMapper.Map<List<Scheduledtask>, List<ScheduledTaskDTO>>(tasks));
        }
        catch (Exception ex)
        {
            return StatusCode(500);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ScheduledTaskDTO>> GetScheduledtask(int id)
    {
        HttpContext context = _httpContextAccessor.HttpContext;
        string systemId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(systemId)) return Unauthorized();
        try
        {
            var task = await _context.Scheduledtasks.FindAsync(id);
            if (task == null || task.UserId != new Guid(systemId)) return NotFound();
            return Ok(_autoMapper.Map<Scheduledtask,ScheduledTaskDTO>(task));
        }
        catch
        {
            return StatusCode(500);
        }
    }

    [HttpPost]
    public async Task<ActionResult<ScheduledTaskDTO>> CreateScheduledtask(ScheduledTaskDTO taskInput)
    {
        HttpContext context = _httpContextAccessor.HttpContext;
        string systemId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(systemId)) return Unauthorized();
        if (taskInput == null || string.IsNullOrWhiteSpace(taskInput.Name))
            return BadRequest();
        try
        {
            Scheduledtask task = _autoMapper.Map<ScheduledTaskDTO, Scheduledtask>(taskInput);
            task.UserId = new Guid(systemId);
            if (!task.IsOn) task.Payload = null;
            _context.Scheduledtasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetScheduledtask), new { id = task.Id }, task);
        }
        catch (Exception ex)
        {
            return StatusCode(500);
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateScheduledtask(ScheduledTaskDTO taskInput)
    {
        if (taskInput == null) return BadRequest();
        HttpContext context = _httpContextAccessor.HttpContext;
        string systemId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(systemId)) return Unauthorized();
        Scheduledtask task = _autoMapper.Map<ScheduledTaskDTO, Scheduledtask>(taskInput);
        task.UserId = new Guid(systemId);
        if (!task.IsOn) task.Payload = null;
        try
        {
            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Scheduledtasks.Any(e => e.Id == task.Id))
                return NotFound();
            else
                throw;
        }
        catch (Exception ex)
        {
            return StatusCode(500);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteScheduledtask(int id)
    {
        HttpContext context = _httpContextAccessor.HttpContext;
        string systemId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(systemId)) return Unauthorized();
        try
        {
            var task = await _context.Scheduledtasks.FindAsync(id);
            if (task == null || task.UserId != new Guid(systemId)) return NotFound();
            _context.Scheduledtasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch
        {
            return StatusCode(500);
        }
    }
}
