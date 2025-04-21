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
        public async Task<CourseModel> GetByIdCourseAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var courseId = await _context.Courses.FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
                if (courseId == null)
                {
                    throw new Exception("Course not found!");
                }

                return _mapper.Map<CourseModel>(courseId);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the course.", ex);
            }
        }
        public async Task<CourseModel> UpdateCourseAsync(CourseModel courseModel, CancellationToken cancellationToken)
        {
            try
            {
                ValidateCourseModel(courseModel);
                var course = await _context.Courses.FindAsync(courseModel.Id);
                if (course == null)
                {
                    throw new Exception("Course not found!");
                }
                _mapper.Map(courseModel, course);
                _context.Courses.Update(course);
                await _context.SaveChangesAsync(cancellationToken);
                return courseModel;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while updating the course.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while updating the course.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the course.", ex);
            }
        }
        public async Task<List<CourseModel>> GetAllCoursesAsync(CancellationToken cancellationToken)
        {
            try
            {
                var courses = await _context.Courses.ToListAsync(cancellationToken);
                if (courses == null)
                {
                    throw new Exception("No course found!");
                }
                return _mapper.Map<List<CourseModel>>(courses);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the course.", ex);
            }
        }
        public async Task<CourseModel> DeleteCourseAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var courseToDelete = await _context.Courses.FirstOrDefaultAsync(c => c.Id == Id, cancellationToken);
                if (courseToDelete == null)
                {
                    throw new Exception("No course found to be deleted!");
                }
                _context.Courses.Remove(courseToDelete);
                await _context.SaveChangesAsync(cancellationToken);
                return _mapper.Map<CourseModel>(courseToDelete);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while deleting the course.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while deleting the course.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the course.", ex);
            }
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
