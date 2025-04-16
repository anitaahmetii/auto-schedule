using AutoMapper;
using Domain.Entities;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CourseService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<CourseModel> CreateCourseAsync(CourseModel courseModel, CancellationToken cancellationToken)
        {
            try
            {
                ValidateCourseModel(courseModel);
                var course = _mapper.Map<Course>(courseModel);
                await _context.Courses.AddAsync(course, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                courseModel.Id = course.Id;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("An error occurred while saving the course to the database.", dbEx);
            }
            catch (ArgumentException argEx)
            {
                throw new Exception("Invalid argument(s) provided.", argEx);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while creating the course.", ex);
            }
            return courseModel;
        }
        private void ValidateCourseModel(CourseModel courseModel)
        {
            if (courseModel == null)
                throw new ArgumentNullException(nameof(courseModel), "The course model cannot be null.");

            if (string.IsNullOrWhiteSpace(courseModel.Name))
                throw new ArgumentException("The name is required.", nameof(courseModel.Name));

            if (string.IsNullOrWhiteSpace(courseModel.ECTS))
                throw new ArgumentException("The ECTS is required.", nameof(courseModel.ECTS));

            if (string.IsNullOrWhiteSpace(courseModel.Semester))
                throw new ArgumentException("The semester is required.", nameof(courseModel.Semester));

            if (!courseModel.IsLecture && !courseModel.IsExcercise)
            {
                throw new ArgumentException("At least one option must be selected: lecture or exercise.");
            }
        }
    }
}
