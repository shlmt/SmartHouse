using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartHomeServer.Classes;

public partial class User
{
    public Guid Id { get; set; }

    public string Username { get; set; } = null!;

    [EmailAddress]
    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Role { get; set; } = null!;

    public Guid? CreditCardId { get; set; }

    public string? Coordinates { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool? IsActive { get; set; }

    public virtual Creditcard? CreditCard { get; set; }

    public virtual ICollection<Scheduledtask> Scheduledtasks { get; set; } = new List<Scheduledtask>();
}
