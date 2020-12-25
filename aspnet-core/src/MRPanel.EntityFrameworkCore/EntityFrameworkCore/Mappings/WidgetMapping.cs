﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MRPanel.Domain;

namespace MRPanel.EntityFrameworkCore.Mappings
{
    public class WidgetMapping : IEntityTypeConfiguration<Widget>
    {
        public void Configure(EntityTypeBuilder<Widget> builder)
        {
            builder.ToTable($"Mrp{nameof(Widget)}s");

            builder.Property(x => x.WidgetType)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(x => x.Content);

            builder.Property(x => x.ImageAddress);

            builder.Property(x => x.Order);

            builder.Property(x => x.SizeType)
                .HasConversion<int>();

            builder.Property(x => x.Position)
                .HasConversion<int>();

            builder.Property(x => x.PageId)
                .IsRequired();

            builder.HasOne(x => x.Page)
                .WithMany(s => s.Widgets)
                .HasForeignKey(x => x.PageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Parent)
                .WithMany(x => x.Widgets)
                .HasForeignKey(x => x.ParentId);
        }
    }
}