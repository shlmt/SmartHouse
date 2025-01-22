using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SmartHomeServer.Classes;

namespace SmartHomeServer;

public partial class Creditcard
{
    public Guid Id { get; set; }

    [StringLength(4)]
    public string LastFourDigits { get; set; } = null!;
    
    [StringLength(7)]
    public string ExpiryDate { get; set; } = null!;

    public string HolderName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
