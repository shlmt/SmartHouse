﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using SmartHomeServer.Classes;

namespace SmartHomeServer;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Creditcard> Creditcards { get; set; }

    public virtual DbSet<Scheduledtask> Scheduledtasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseMySql("Name=db", ServerVersion.Parse("8.0.40-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Creditcard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("creditcards");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ExpiryDate)
                .HasMaxLength(7)
                .HasColumnName("expiry_date");
            entity.Property(e => e.HolderName)
                .HasMaxLength(255)
                .HasColumnName("holder_name");
            entity.Property(e => e.LastFourDigits)
                .HasMaxLength(4)
                .HasColumnName("last_four_digits");
        });

        modelBuilder.Entity<Scheduledtask>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("scheduledtasks");

            entity.HasIndex(e => e.UserId, "UserId");

            entity.HasIndex(e => new { e.DeviceId, e.DeviceType }, "idx_device");

            entity.HasIndex(e => e.StartTime, "idx_starttime");

            entity.Property(e => e.DeviceId).HasMaxLength(50);
            entity.Property(e => e.DeviceType).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(45);
            entity.Property(e => e.Payload).HasColumnType("json");
            entity.Property(e => e.Recurrence).HasColumnType("enum('None','Daily','Weekly')");
            entity.Property(e => e.RecurrenceDay).HasColumnType("enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')");
            entity.Property(e => e.StartTime).HasColumnType("datetime");
            entity.Property(e => e.Target).HasColumnType("enum('DeviceId','DeviceType')");

            entity.HasOne(d => d.User).WithMany(p => p.Scheduledtasks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("scheduledtasks_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.CreditCardId, "credit_card_id");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.Username, "username").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Coordinates)
                .HasMaxLength(255)
                .HasColumnName("coordinates");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.CreditCardId).HasColumnName("credit_card_id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("'1'")
                .HasColumnName("is_active");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasDefaultValueSql("'Standard'")
                .HasColumnType("enum('Standard','Pro','Admin')")
                .HasColumnName("role");
            entity.Property(e => e.Username).HasColumnName("username");

            entity.HasOne(d => d.CreditCard).WithMany(p => p.Users)
                .HasForeignKey(d => d.CreditCardId)
                .HasConstraintName("users_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
