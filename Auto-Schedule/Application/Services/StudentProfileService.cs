using AutoMapper;
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
    public class StudentProfileService : IStudentProfileService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public StudentProfileService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<StudentProfileModel> GetStudentProfileAsync(Guid Id, CancellationToken cancellationToken)
        {
            try
            {
                var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == Id, cancellationToken);
                if (student == null)
                {
                    throw new KeyNotFoundException("Student not found.");
                }
                return _mapper.Map<StudentProfileModel>(student);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the student.", ex);
            }
        }

        public async Task<StudentProfileModel> UpdateStudentProfileAsync(StudentProfileModel studentProfile, CancellationToken cancellationToken)
        {
            try
            {
                var student = await _context.Students.FindAsync(studentProfile.Id, cancellationToken);
                if (student == null )
                {
                    throw new KeyNotFoundException("Student not found!");
                }
                _mapper.Map(studentProfile, student);
                //_context.Students.Update(student);
                await _context.SaveChangesAsync(cancellationToken);
                return studentProfile;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while updating the profile.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while updating the profile.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the profile.", ex);
            }
        }
    }
}
