﻿using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configuration
{
    public class CourseLecturesConfiguration : IEntityTypeConfiguration<CourseLectures>
    {
        public void Configure(EntityTypeBuilder<CourseLectures> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.User)
                   .WithMany(x => x.CourseLectures)
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(ur => ur.Course)
                .WithMany(r => r.CourseLectures)
                .HasForeignKey(ur => ur.CourseId)
                .OnDelete(DeleteBehavior.NoAction);

        }
    }
}
